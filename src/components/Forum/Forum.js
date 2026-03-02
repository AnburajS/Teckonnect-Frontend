import moment from 'moment/moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../../UI/PageHeader';
import ResponseInfo from '../../UI/ResponseInfo';
import ForumTypeBasedFilter from '../../UI/ForumTypeBasedFilter';
import { URL_CONFIG } from '../../constants/rest-config';
import { TYPE_BASED_FILTER } from '../../constants/ui-config';
import { pageLoaderHandler } from '../../helpers';
import { httpHandler } from '../../http/http-interceptor';
import CreateEditCommunicationModal from '../../modals/CreateEditCommunicationModal';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import { TabsActions } from '../../store/tabs-slice';
import ForumFollowingList from './ForumFollowingList';
import ForumHotTopicsList from './ForumHotTopicsList';
import ForumList from './ForumList';
import MyForumPosts from './MyForumPosts';
import Isloading from '../../UI/CustomComponents/Isloading';

const Forum = () => {
  const [departments, setDepartments] = useState([]);
  const [createModalShow, setCreateModalShow] = useState(false);
  //const [listReverse, setListReverse] = useState(false);
  const [createModalErr, setCreateModalErr] = useState('');
  const [usersPic, setUsersPic] = useState([]);
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const [forumList, setForumList] = useState([]);
  const [forumFollowingList, setForumFollowingList] = useState([]);
  // const [filterParams, setFilterParams] = useState({});
  const [filterParams, setFilterParams] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const userData = sessionStorage.userData
    ? JSON.parse(sessionStorage.userData)
    : {};
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.tabs.activeTab);
  const location = useLocation();
  const navigate = useNavigate();
  const routerData = location.state;
  const [isloading, setIsloding] = useState(true);
  const [offset, setOffset] = useState(1);
  const [infiniteLoader, setInfiniteLoader] = useState(false);
  const [stopFetch, setStopFetch] = useState(false);
  const [offsetForum, setOffsetForum] = useState(1);
  const [stopFetchForum, setStopFetchForum] = useState(false);
  const [hotForumList, setHotForumList] = useState([]);
  const [offsetForumHotTopics, setOffsetForumHotTopics] = useState(1);
  const [stopFetchForumHotTopics, setStopFetchForumHotTopics] = useState(false);
  const [direction, setDirection] = useState('desc');
  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'Engage',
      link: 'app/engage',
    },
    {
      label: 'Forum',
      link: '',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Forum',
      }),
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  }, [activeTab]);

  const tabConfig = [
    {
      title: 'Forum Pot',
      id: 'forumpot',
    },
    {
      title: 'My Posts',
      id: 'myforums',
    },
  ];

  useEffect(() => {
    if (routerData) {
      const activeTabId = routerData.activeTab;
      tabConfig.map((res) => {
        if (res.id === activeTabId) {
          return (res.active = true);
        }
      });
      dispatch(
        TabsActions.updateTabsconfig({
          config: tabConfig,
        }),
      );
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      dispatch(
        TabsActions.updateTabsconfig({
          config: tabConfig,
        }),
      );
    }
    const initialFilter = routerData?.forumFilter
      ? { ...routerData.forumFilter }
      : {
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        };

    setFilterParams(initialFilter);

    getForumList(initialFilter, 1, true);
    getForumHotTopicsList(initialFilter, 1, true);

    // getForumList(filterParams, 1);
    // getForumHotTopicsList(filterParams, 1);
    getForumFollowingList(1);
    pageLoaderHandler(isloading ? 'show' : 'hide');

    return () => {
      dispatch(
        TabsActions.updateTabsconfig({
          config: [],
        }),
      );
    };
  }, []);

  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  //const findIndexByUserId = (array, userId) => array.findIndex((item) => item.userId.id === userId);

  const getDepartments = () => {
    const obj = {
      url: URL_CONFIG.ALLDEPARTMENTS,
      method: 'get',
      params: { active: true },
    };
    httpHandler(obj)
      .then((depts) => {
        const deptData = [];
        depts.data.map((res) => {
          return deptData.push({
            value: res.id,
            label: res.name,
            //id: res.id,
          });
        });
        setDepartments(deptData);
      })
      .catch((error) => {
        const errMsg = error.response?.data?.message;
        console.log('Forum errMsg', errMsg);
      });
  };

  const createCommunicationPost = (arg) => {
    let formData = new FormData();
    if (arg.files && arg.files.length > 0) {
      arg.files.map((item) => {
        const fileType = item?.type;
        return formData.append('file', item);
      });
    }
    let forumRequestObj = {
      title: arg.title,
      description: arg.description,
      active: true,
      dept: arg.dept,
      existForumDep: null,
      existForumAttach: null,
    };
    formData.append('forumrequest', JSON.stringify(forumRequestObj));
    const obj = {
      url: URL_CONFIG.FORUM,
      method: 'post',
      formData: formData,
    };
    httpHandler(obj)
      .then((response) => {
        getForumList(filterParams, 1);
        setCreateModalShow(false);
        setShowModal({
          ...showModal,
          type: 'success',
          success: 'Forum Created!',
          message: response?.data?.message,
        });
      })
      .catch((error) => {
        const errMsg =
          error.response?.data?.message !== undefined
            ? error.response?.data?.message
            : 'Something went wrong contact administarator';
        setCreateModalErr(errMsg);
      });
  };

  const getFilterParams = (paramsData) => {
    // if (Object.getOwnPropertyNames(filterParams)) {
    // if (filterParams && Object.getOwnPropertyNames(filterParams).length > 0) {
    setFilterParams({ ...paramsData });
    // sessionStorage.setItem(FORUM_FILTER_KEY, JSON.stringify(paramsData));

    // } else {
    //   setFilterParams({});
    // }
    setForumList([]);
    setHotForumList([]);
    setForumFollowingList([]);
    setStopFetchForum(false);
    setStopFetchForumHotTopics(false);
    setOffsetForum(1);
    setOffsetForumHotTopics(1);
    getForumList(paramsData, 1, true);
    getForumHotTopicsList(paramsData, 1, true);
  };

  //abcdef

  const getForumList = async (
    paramsInfo,
    offsetForumVal,
    reset = false,
    directions,
  ) => {
    const paramsTemp = {
      limit: 5,
      offset: offsetForumVal ? 1 : offsetForum,
      direction: directions ? directions : direction,
    };
    setIsloding(true);
    let obj;
    if (paramsInfo && Object.getOwnPropertyNames(paramsInfo)) {
      obj = {
        url: URL_CONFIG.GET_FORUM_LIST,
        method: 'get',
        params: { ...paramsInfo, ...paramsTemp },
        isLoader: false,
      };
    } else {
      obj = {
        url: URL_CONFIG.GET_FORUM_LIST,
        method: 'get',
        params: paramsTemp,
        isLoader: false,
      };
    }
    // if (filterParams && Object.getOwnPropertyNames(filterParams).length > 0) {
    //   obj = {
    //     url: URL_CONFIG.GET_FORUM_LIST,
    //     method: 'get',
    //     params: { ...filterParams, ...paramsTemp },
    //     isLoader: false,
    //   };
    // } else {
    //   obj = {
    //     url: URL_CONFIG.GET_FORUM_LIST,
    //     method: 'get',
    //     params: paramsTemp,
    //     isLoader: false,
    //   };
    // }

    await httpHandler(obj)
      .then((forumdata) => {
        const forumDataTemp = reset
          ? [...forumdata?.data]
          : [...forumdata?.data, ...forumList];
        if (forumDataTemp) {
          setForumList([
            ...forumDataTemp.sort(
              (a, b) =>
                paramsTemp?.direction === 'desc'
                  ? moment(b.createdAt).valueOf() -
                    moment(a.createdAt).valueOf() // Descending order
                  : moment(a.createdAt).valueOf() -
                    moment(b.createdAt).valueOf(), // Ascending order
            ),
          ]);
        }

        setIsloding(false);
        setOffsetForum(offsetForumVal ? 2 : offsetForum + 1);
        setStopFetchForum(forumdata.data.length < 5 ? true : false);
      })
      .catch((error) => {
        setIsloding(false);
      });
  };

  const fetchAllUsersPics = () => {
    const obj = {
      url: URL_CONFIG.ALL_USER_DETAILS_FILTER_RESPONSE,
      method: 'get',
    };
    httpHandler(obj)
      .then((response) => {
        let userPicTempArry = [];
        response.data.map((item) => {
          if (item?.imageByte?.image) {
            userPicTempArry.push({
              id: item.user_id,
              pic: item?.imageByte?.image,
            });
          }
          return userPicTempArry;
        });
        setUsersPic(userPicTempArry);
      })
      .catch((error) => {});
  };

  const getForumFollowingList = (offsetVal) => {
    setInfiniteLoader(true);
    const obj = {
      url: URL_CONFIG.FORUM_FOLLOWING,
      method: 'get',
      params: {
        direction: 'desc',
        limit: 5,
        offset: offsetVal ? 1 : offset,
      },
      isLoader: false,
    };
    httpHandler(obj)
      .then((forumdata) => {
        setForumFollowingList(
          offsetVal
            ? [...forumdata.data]
            : [...forumFollowingList, ...forumdata.data],
        );
        setInfiniteLoader(false);
        setOffset(offsetVal ? 2 : offset + 1);
        setStopFetch(forumdata.data.length < 5 ? true : false);
      })
      .catch((error) => {
        setInfiniteLoader(false);
        //const errMsg = error.response?.data?.message;
      });
  };

  useEffect(() => {
    getDepartments();
    fetchAllUsersPics();
  }, []);

  const readForum = (arg) => {
    if (arg) {
      if (!arg.fData.forumIsRead) {
        const obj = {
          url: URL_CONFIG.FORUM_READ_UNREAD,
          payload: { id: arg.fData.id },
          method: 'post',
          isLoader: false,
        };
        httpHandler(obj)
          .then((response) => {
            if (arg.isRedirect) {
              navigate('/app/forumdetailview', {
                state: {
                  forumData: arg.fData,
                  usersPicData: usersPic,
                  forumFilter: filterParams,
                },
              });
            }
            if (!arg.isRedirect) {
              let forumListTemp = JSON.parse(JSON.stringify(forumList));
              if (forumListTemp.length > 0) {
                forumListTemp.map((item) => {
                  if (item.id === arg.fData.id) {
                    item.forumIsRead = true;
                    item.forumRead = response?.data?.data;
                  }
                  return forumListTemp;
                });
              }
              setForumList([
                ...forumListTemp.sort(
                  (a, b) =>
                    direction === 'desc'
                      ? moment(b.createdAt).valueOf() -
                        moment(a.createdAt).valueOf() // Descending order
                      : moment(a.createdAt).valueOf() -
                        moment(b.createdAt).valueOf(), // Ascending order
                ),
              ]);
            }
          })
          .catch((error) => {
            const errMsg =
              error.response?.data?.message !== undefined
                ? error.response?.data?.message
                : 'Something went wrong contact administarator';
            setShowModal({
              ...showModal,
              type: 'danger',
              message: errMsg,
            });
          });
      }
      if (arg.fData.forumIsRead) {
        navigate('/app/forumdetailview', {
          state: {
            forumData: arg.fData,
            usersPicData: usersPic,
          },
        });
      }
    }
  };

  const unReadForum = (forumData) => {
    if (forumData) {
      const obj = {
        url: URL_CONFIG.FORUM_READ_UNREAD,
        payload: { id: forumData?.id },
        method: 'put',
        isLoader: false,
      };
      httpHandler(obj)
        .then(() => {
          let forumListTemp = JSON.parse(JSON.stringify(forumList));
          if (forumListTemp.length > 0) {
            forumListTemp.map((item) => {
              if (item?.id === forumData?.id) {
                item.forumIsRead = false;
              }
              return forumListTemp;
            });
          }
          setForumList([
            ...forumListTemp.sort(
              (a, b) =>
                direction === 'desc'
                  ? moment(b.createdAt).valueOf() -
                    moment(a.createdAt).valueOf() // Descending order
                  : moment(a.createdAt).valueOf() -
                    moment(b.createdAt).valueOf(), // Ascending order
            ),
          ]);
        })
        .catch((error) => {
          const errMsg =
            error.response?.data?.message !== undefined
              ? error.response?.data?.message
              : 'Something went wrong contact administarator';
          setShowModal({
            ...showModal,
            type: 'danger',
            message: errMsg,
          });
        });
    }
  };

  const unFollowForum = (followInfo) => {
    if (followInfo) {
      const obj = {
        url: URL_CONFIG.FORUM_FOLLOWING,
        payload: { id: followInfo?.id },
        method: 'put',
        isLoader: false,
      };
      httpHandler(obj)
        .then(() => {
          let forumListTemp = JSON.parse(JSON.stringify(forumList));
          if (forumListTemp.length > 0) {
            forumListTemp.map((item) => {
              if (item.id === followInfo.id) {
                item.forumIsfollowing = false;
              }
              return forumListTemp;
            });
          }
          setForumList([
            ...forumListTemp.sort(
              (a, b) =>
                direction === 'desc'
                  ? moment(b.createdAt).valueOf() -
                    moment(a.createdAt).valueOf() // Descending order
                  : moment(a.createdAt).valueOf() -
                    moment(b.createdAt).valueOf(), // Ascending order
            ),
          ]);
          getForumFollowingList(1);
        })
        .catch((error) => {
          const errMsg =
            error.response?.data?.message !== undefined
              ? error.response?.data?.message
              : 'Something went wrong contact administarator';
          setShowModal({
            ...showModal,
            type: 'danger',
            message: errMsg,
          });
        });
    }
  };

  const followForum = (arg) => {
    const obj = {
      url: URL_CONFIG.FORUM_FOLLOWING,
      payload: { id: arg.id },
      method: 'post',
      isLoader: false,
    };
    httpHandler(obj)
      .then((response) => {
        let forumListTemp = JSON.parse(JSON.stringify(forumList));
        if (forumListTemp.length > 0) {
          forumListTemp.map((item) => {
            if (item.id === arg.id) {
              item.forumIsfollowing = true;
              item.forumFollowing = response?.data?.data;
            }
            return forumListTemp;
          });
        }
        setForumList([
          ...forumListTemp.sort(
            (a, b) =>
              direction === 'desc'
                ? moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf() // Descending order
                : moment(a.createdAt).valueOf() - moment(b.createdAt).valueOf(), // Ascending order
          ),
        ]);
        getForumFollowingList(1);
      })
      .catch((error) => {
        const errMsg =
          error.response?.data?.message !== undefined
            ? error.response?.data?.message
            : 'Something went wrong contact administarator';
        setShowModal({
          ...showModal,
          type: 'danger',
          message: errMsg,
        });
      });
  };

  const readAll = (isReadAll) => {
    if (isReadAll) {
      const obj = {
        url: URL_CONFIG.FORUM_READ_ALL,
        method: 'post',
        isLoader: false,
      };
      httpHandler(obj)
        .then(() => {
          let forumListTemp = JSON.parse(JSON.stringify(forumList));
          if (forumListTemp.length > 0) {
            forumListTemp.map((item) => {
              item.forumIsRead = true;

              return forumListTemp;
            });
          }
          setForumList([
            ...forumListTemp.sort(
              (a, b) =>
                direction === 'desc'
                  ? moment(b.createdAt).valueOf() -
                    moment(a.createdAt).valueOf() // Descending order
                  : moment(a.createdAt).valueOf() -
                    moment(b.createdAt).valueOf(), // Ascending order
            ),
          ]);
        })
        .catch((error) => {
          const errMsg =
            error.response?.data?.message !== undefined
              ? error.response?.data?.message
              : 'Something went wrong contact administarator';
          setShowModal({
            ...showModal,
            type: 'danger',
            message: errMsg,
          });
        });
    }
  };

  const dateReceived = (isSort) => {
    const dir = isSort ? 'asc' : 'desc';
    setDirection(dir);
    getForumList(filterParams, 1, true, dir);
  };

  const getForumHotTopicsList = async (
    paramsInfo,
    offsetForumVal,
    reset = false,
  ) => {
    const paramsTemp = {
      limit: 5,
      offset: offsetForumVal ? 1 : offsetForumHotTopics,
      commandCount: 5,
    };
    setIsloding(true);
    let obj;
    if (paramsInfo && Object.getOwnPropertyNames(paramsInfo)) {
      obj = {
        url: URL_CONFIG.GET_FORUM_HOT_TOPICS_LIST,
        method: 'get',
        params: { ...paramsInfo, ...paramsTemp },
        isLoader: false,
      };
    } else {
      obj = {
        url: URL_CONFIG.GET_FORUM_HOT_TOPICS_LIST,
        method: 'get',
        params: paramsTemp,
        isLoader: false,
      };
    }
    await httpHandler(obj)
      .then((forumdata) => {
        const forumDataTemp =
          reset || offsetForumVal === 1
            ? [...forumdata?.data]
            : [...hotForumList, ...forumdata?.data];
        if (forumDataTemp) {
          setHotForumList([
            ...forumDataTemp
              .filter((forum) => forum.commandCount !== undefined) // Filter out forums without commandCount
              .sort((a, b) => b.commandCount - a.commandCount), // Sort the remaining forums
          ]);
        }
        setIsloding(false);
        setOffsetForumHotTopics(offsetForumVal ? 2 : offsetForumHotTopics + 1);
        setStopFetchForumHotTopics(forumdata.data.length < 5 ? true : false);
      })
      .catch((error) => {
        setIsloding(false);
      });
  };
  return (
    <React.Fragment>
      <div className="row eep-content-section-data no-gutters">
        <div className="tab-content col-md-12 h-100 response-allign-middle">
          <div
            id="forumpot"
            className="tab-pane active h-100"
          >
            {showModal.type !== null && showModal.message !== null && (
              <EEPSubmitModal
                data={showModal}
                className={`modal-addmessage`}
                hideModal={hideModal}
                successFooterData={
                  <Link
                    to="#"
                    type="button"
                    className="eep-btn eep-btn-xsml eep-btn-success"
                    onClick={hideModal}
                  >
                    Continue
                  </Link>
                }
                errorFooterData={
                  <button
                    type="button"
                    className="eep-btn eep-btn-xsml eep-btn-danger"
                    data-dismiss="modal"
                    onClick={hideModal}
                  >
                    Close
                  </button>
                }
              ></EEPSubmitModal>
            )}
            {createModalShow && (
              <CreateEditCommunicationModal
                deptOptions={departments}
                createModalShow={createModalShow}
                createCommunicationPost={createCommunicationPost}
                communicationModalErr={createModalErr}
                communicationType="forum"
                communicationData={null}
              />
            )}
            <PageHeader
              title="Forum"
              navLinksRight={
                <a
                  className="text-right c-c1c1c1 ml-2  eep_nav_icon_div eep_action_svg c1"
                  dangerouslySetInnerHTML={{
                    __html: svgIcons && svgIcons.plus,
                  }}
                  data-toggle="modal"
                  data-target="#CreateEditCommunicationModal"
                  onClick={() => setCreateModalShow(true)}
                ></a>
              }
              filter={
                <ForumTypeBasedFilter
                  config={TYPE_BASED_FILTER}
                  getFilterParams={getFilterParams}
                />
              }
            />

            {isloading ? (
              <Isloading />
            ) : (
              <>
                {forumList?.length > 0 ||
                hotForumList?.length > 0 ||
                forumFollowingList?.length > 0 ? (
                  <div className="row mx-0 forum_containerr">
                    <div className="col-md-6 eep-content-section-data eep_scroll_y pl-0">
                      {activeTab && activeTab.id === 'forumpot' && (
                        <ForumList
                          forumList={forumList}
                          userImageArr={usersPic}
                          readForum={readForum}
                          unReadForum={unReadForum}
                          unFollowForum={unFollowForum}
                          followForum={followForum}
                          readAll={readAll}
                          dateReceived={dateReceived}
                          getForumList={getForumList}
                          stopFetchForum={stopFetchForum}
                        />
                      )}
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 px-0">
                      <div className="forum_hottopics_wrapper_bg forum_hottopics_wrapper eep-content-section-data eep_scroll_y">
                        <div className="forum_shortlist_div sticky_position forum_hottopics_wrapper_bg pb-1">
                          <ul
                            className="nav nav-tabs card-header-tabs forum_rightdiv_filter m-0"
                            id="myTab"
                            role="tablist"
                          >
                            <li className="nav-item">
                              <a
                                className="nav-link forum_hot active c1"
                                id="one-tab"
                                data-toggle="tab"
                                href="#HotTopics"
                                role="tab"
                                aria-controls="One"
                                aria-selected="true"
                              >
                                <div className="forum_rightnav_action forum_hottopic_img_content d-flex align-items-center c1 forumj_hot_topic forum_bgcolor_selected_tap">
                                  <div
                                    className="forum-eep-right-tab"
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        svgIcons && svgIcons.hottopics_icon,
                                    }}
                                  ></div>
                                  <div className="hot_topic_btn">
                                    Trending Discussions
                                  </div>
                                </div>
                              </a>
                            </li>
                            <li className="nav-item">
                              <a
                                className="nav-link forum_follow c1"
                                id="two-tab"
                                data-toggle="tab"
                                href="#Following"
                                role="tab"
                                aria-controls="Two"
                                aria-selected="false"
                              >
                                <div className="forum_rightnav_action forum_following_img_content d-flex align-items-center c1 forumj_following forum_bgcolor_selected_tap">
                                  <div
                                    className="forum-eep-right-tab"
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        svgIcons && svgIcons.following_icon,
                                    }}
                                  ></div>
                                  <div className="following_topic_btn">
                                    Followed Threads
                                  </div>
                                </div>
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div
                          className="tab-content"
                          id="myTabContent"
                        >
                          <div
                            className="tab-pane fade show active"
                            id="HotTopics"
                            role="tabpanel"
                            aria-labelledby="one-tab"
                          >
                            <ForumHotTopicsList
                              forumList={hotForumList}
                              usersPic={usersPic}
                              getForumHotTopicsList={getForumHotTopicsList}
                              stopFetchForumHotTopics={stopFetchForumHotTopics}
                            />
                          </div>
                          <div
                            className="tab-pane fade"
                            id="Following"
                            role="tabpanel"
                            aria-labelledby="two-tab"
                          >
                            <ForumFollowingList
                              forumFollowingList={forumFollowingList}
                              getForumFollowingList={getForumFollowingList}
                              infiniteLoader={infiniteLoader}
                              usersPic={usersPic}
                              stopFetch={stopFetch}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <ResponseInfo
                    title="No Records found. Start Yours Now!"
                    responseImg="noForumShare"
                    responseClass="response-info"
                    messageInfo="Good communication is the bridge between confusion and clarity"
                    subMessageInfo="Nat Turner"
                  />
                )}
              </>
            )}
          </div>
          <div
            id="myforums"
            className="tab-pane h-100"
          >
            {activeTab && activeTab.id === 'myforums' && (
              <MyForumPosts
                usersPic={usersPic}
                deptOptions={departments}
              />
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Forum;
