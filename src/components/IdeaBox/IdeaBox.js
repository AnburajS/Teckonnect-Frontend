import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../../UI/PageHeader';
import ResponseInfo from '../../UI/ResponseInfo';
import TypeBasedFilter from '../../UI/TypeBasedFilter';
import { URL_CONFIG } from '../../constants/rest-config';
import { TYPE_BASED_FILTER } from '../../constants/ui-config';
import { httpHandler } from '../../http/http-interceptor';
import CreateEditCommunicationModal from '../../modals/CreateEditCommunicationModal';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import { TabsActions } from '../../store/tabs-slice';
import IdeaDetailView from './IdeaDetailView';
import IdeaList from './IdeaList';
import MyIdeas from './MyIdeas';
import { pageLoaderHandler } from '../../helpers';
import moment from 'moment/moment';
import Isloading from '../../UI/CustomComponents/Isloading';

const IdeaBox = () => {
  const [deptOptions, setDeptOptions] = useState([]);
  const [ideaLists, setIdeaLists] = useState([]);
  const [usersPic, setUsersPic] = useState([]);
  const [createModalShow, setCreateModalShow] = useState(false);
  const [ideaData, setIdeaData] = useState(null);
  const [ideaDataState, setIdeaDataState] = useState(false);
  const [ideaListsReverse, setIdeaListsReverse] = useState('desc');
  const [createModalErr, setCreateModalErr] = useState('');
  const [filterParams, setFilterParams] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const [direction, setDirection] = useState('desc');
  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };
  const [isLoading, setIsLoading] = useState(true);

  const loggedUserData = sessionStorage.userData
    ? JSON.parse(sessionStorage.userData)
    : {};
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.tabs.activeTab);
  const location = useLocation();
  const history = useNavigate();
  const routerData = location.state || {
    activeTab: window.location.hash.substring(1)?.split('?')?.[0],
  };
  const notification = location?.state?.notification;
  const [infiniteLoader, setInfiniteLoader] = useState(false);
  const [offsetIdea, setOffsetIdea] = useState(1);
  const [stopFetchIdea, setStopFetchIdea] = useState(false);
  //const [offsetIdeaVal, setOffsetIdeaVal] = useState(1);

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
      label: 'Innovation Hub',
      link: '',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Innovation Hub',
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  }, []);

  const tabConfig = [
    {
      title: 'Innovation',
      id: 'ideas',
    },
    {
      title: 'My Innovation',
      id: 'myideas',
    },
  ];

  useEffect(() => {
    if (routerData) {
      const activeTabId = routerData.activeTab;
      tabConfig.map((res) => {
        if (res.id === activeTabId) {
          res.active = true;
        }
      });

      dispatch(
        TabsActions.updateTabsconfig({
          config: tabConfig,
        })
      );
      // history.replace({ pathname: history.location.pathname, state: {} });
    } else {
      dispatch(
        TabsActions.updateTabsconfig({
          config: tabConfig,
        })
      );
    }

    // fetchIdeas(false);
    // pageLoaderHandler(isloading ? 'show' : 'hide');
    return () => {
      dispatch(
        TabsActions.updateTabsconfig({
          config: [],
        })
      );
    };
  }, []);

  const fetchDepartmentData = () => {
    const obj = {
      url: URL_CONFIG.ALLDEPARTMENTS,
      method: 'get',
      params: { active: true },
      isLoader: false,
    };
    httpHandler(obj)
      .then((deptData) => {
        let optionsTemp = [];
        deptData.data.map((deptValue) => {
          return optionsTemp.push({
            value: deptValue.id,
            label: deptValue.name,
          });
        });
        setDeptOptions(optionsTemp);
      })
      .catch((error) => {
        //const errMsg = error.response?.data?.message;
      });
  };

  const getFilterParams = (paramsData) => {
    if (Object.getOwnPropertyNames(filterParams)) {
      setFilterParams({ ...paramsData });
    } else {
      setFilterParams({});
    }
    fetchIdeas(false, null, paramsData, 1);
  };
  const fetchIdeaList = () => {
    fetchIdeas(false, null, filterParams);
  };
  const fetchIdeas = async (
    isIdeaActive,
    ideaID = null,
    paramsInfo,
    offset,
    directions
  ) => {
    setInfiniteLoader(true);
    const paramsTemp = {
      limit: 5,
      offset: offset ? offset : offsetIdea,
      direction: directions ? directions : direction,
    };
    //setIsloding(true);
    let obj;
    if (paramsInfo && Object.getOwnPropertyNames(paramsInfo)) {
      obj = {
        url: URL_CONFIG.IDEA,
        method: 'get',
        params: { ...paramsInfo, ...paramsTemp },
        isLoader: false,
      };
    } else {
      obj = {
        url: URL_CONFIG.IDEA,
        method: 'get',
        params: paramsTemp,
        isLoader: false,
      };
    }
    await httpHandler(obj)
      .then((ideaData) => {
        const ideaDataTemp =
          paramsTemp?.offset === 1
            ? [...ideaData?.data]
            : [...ideaLists, ...ideaData?.data];
        if (!isIdeaActive) {
          setIdeaLists([
            ...ideaDataTemp.sort(
              (a, b) =>
                paramsTemp?.direction === 'desc'
                  ? moment(b.createdAt).valueOf() -
                    moment(a.createdAt).valueOf() // Descending order
                  : moment(a.createdAt).valueOf() -
                    moment(b.createdAt).valueOf() // Ascending order
            ),
          ]);

          // setIdeaData(null);
          // setIdeaDataState(false);
          setInfiniteLoader(false);
          setOffsetIdea(offset ? 2 : offsetIdea + 1);
          setStopFetchIdea(
            paramsTemp?.offset === 1
              ? false
              : ideaData.data.length < 5
              ? true
              : false
          );
        } else {
          markIdeaAsActiveState(
            [
              ...ideaDataTemp.sort(
                (a, b) =>
                  paramsTemp?.direction === 'desc'
                    ? moment(b.createdAt).valueOf() -
                      moment(a.createdAt).valueOf() // Descending order
                    : moment(a.createdAt).valueOf() -
                      moment(b.createdAt).valueOf() // Ascending order
              ),
            ],
            ideaID
          );

          setInfiniteLoader(false);
          setOffsetIdea(offset ? 2 : offsetIdea + 1);
          setStopFetchIdea(
            paramsTemp?.offset === 1
              ? false
              : ideaData.data.length < 5
              ? true
              : false
          );
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setInfiniteLoader(false);
        setIsLoading(false);
      });
  };
  const fetchAllUsers = () => {
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
              username: item?.username,
            });
          }
          return item;
        });
        setUsersPic(userPicTempArry);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    fetchDepartmentData();
    fetchAllUsers();
    fetchIdeaList();
    pageLoaderHandler(isLoading ? 'show' : 'hide');
  }, []);

  const markIdeaAsActiveState = (loopData, ideaIDData) => {
    let ideaDataTemp = JSON.parse(JSON.stringify(loopData));
    ideaDataTemp &&
      ideaDataTemp.length > 0 &&
      ideaDataTemp.map((item) => {
        if (item.id === ideaIDData) {
          // item.ideaIsActive = true;
        } else {
          item.ideaIsActive = false;
        }
        return item;
      });
    setIdeaLists(ideaDataTemp);
  };

  const createCommunicationPost = (arg) => {
    let formData = new FormData();
    if (arg.files && arg.files.length > 0) {
      arg.files.map((item) => {
        formData.append('file', item);
        return item;
      });
    }
    const ideaRequestObj = {
      title: arg.title,
      description: arg.description,
      active: true,
      dept: arg.dept,
      existIdeaDept: null,
      existIdeaAttach: null,
    };

    formData.append(
      'ideaRequest',
      JSON.stringify(ideaRequestObj)
      //  new Blob([JSON.stringify(ideaRequestObj)], { type: 'application/json' })
    );

    const obj = {
      url: URL_CONFIG.IDEA,
      method: 'post',
      formData: formData,
    };
    httpHandler(obj)
      .then((response) => {
        fetchIdeas(false, null, filterParams, 1);
        setCreateModalShow(false);
        setShowModal({
          ...showModal,
          type: 'success',
          success: 'Idea Submitted!',
          message: response?.data?.message,
        });
      })
      .catch((error) => {
        const errMsg =
          error.response?.data?.message !== undefined
            ? error.response?.data?.message
            : 'Oops! Something went wrong. Please contact administrator.';
        setCreateModalErr(errMsg);
      });
  };

  const viewIdeaData = (iData) => {
    if (!iData.ideaIsRead) {
      readIdeaData(iData, true, true);
    } else {
      markIdeaAsActiveState(ideaLists, iData.id);
    }
    setIdeaData(iData);
    setIdeaDataState(true);
  };

  const readIdeaData = (iData, isActive, isRead) => {
    if (iData) {
      let obj;
      let iReadIndex = 0;
      if (isRead) {
        obj = {
          url: URL_CONFIG.IDEA_READ_UNREAD,
          //  + "?id=" +iData.id,
          payload: { id: iData.id },
          method: 'post',
          isLoader: false,
        };
      }
      if (!isRead) {
        // iReadIndex = iData.ideaRead.findIndex(x => x.userId.id === loggedUserData.id);
        obj = {
          url: URL_CONFIG.IDEA_READ_UNREAD,
          //  + "?id=" + iData.ideaRead[iReadIndex].id,
          // payload: { id: iData.ideaRead[iReadIndex].id },
          payload: { id: iData.id },
          method: 'put',
          isLoader: false,
        };
      }
      httpHandler(obj)
        .then(() => {
          if (isRead) {
            let ideaListsTemp = JSON.parse(JSON.stringify(ideaLists));
            if (ideaListsTemp) {
              ideaListsTemp.map((idea) => {
                if (idea.id === iData.id) {
                  idea.ideaIsRead = true;
                  // idea.ideaRead.splice(iReadIndex, 1);
                  if (isActive) {
                    // idea.ideaIsActive = true;
                  }
                } else {
                  if (isActive) {
                    idea.ideaIsActive = false;
                  }
                }
                return idea;
              });
              setIdeaLists(ideaListsTemp);
            }
          }
          if (!isRead) {
            let ideaListsTemp = JSON.parse(JSON.stringify(ideaLists));
            if (ideaListsTemp) {
              ideaListsTemp.map((idea) => {
                if (idea.id === iData.id) {
                  idea.ideaIsRead = false;
                  // idea.ideaRead.splice(iReadIndex, 1);
                  if (isActive) {
                    // idea.ideaIsActive = true;
                  }
                } else {
                  if (isActive) {
                    idea.ideaIsActive = false;
                  }
                }
                return idea;
              });
              setIdeaLists(ideaListsTemp);
            }
          }
        })
        .catch((error) => {
          setShowModal({
            ...showModal,
            type: 'danger',
            message: error?.response?.data?.message,
          });
          //const errMsg = error.response?.data?.message;
        });
    }
  };

  const markImportant = (iData, isImportant) => {
    let obj;
    let iImportantIndex = 0;
    if (isImportant) {
      obj = {
        url: URL_CONFIG.IDEA_IMPORTANT_UNIMPORTANT,
        //  + "?id=" + iData.id,
        payload: { id: iData.id },
        method: 'post',
        isLoader: false,
      };
    }
    if (!isImportant) {
      // iImportantIndex = iData.ideaFavorites.findIndex(x => x.userId.id === loggedUserData.id);
      obj = {
        url: URL_CONFIG.IDEA_IMPORTANT_UNIMPORTANT,
        //  + "?id=" + iData.ideaFavorites[iImportantIndex].id,
        payload: { id: iData.id },
        method: 'put',
        isLoader: false,
      };
    }
    httpHandler(obj)
      .then(() => {
        if (isImportant) {
          let ideaDataTemp = JSON.parse(JSON.stringify(ideaLists));
          ideaDataTemp &&
            ideaDataTemp.length > 0 &&
            ideaDataTemp.map((item) => {
              if (item.ideaIsActive) {
                // item.ideaIsActive = true;
              } else {
                item.ideaIsActive = false;
              }
              if (item.id === iData.id) {
                if (item.ideaFavorites) {
                  item.ideaIsImportant = true;
                }
              }
              return item;
            });
          setIdeaLists(ideaDataTemp);
        }
        if (!isImportant) {
          let ideaDataTemp = JSON.parse(JSON.stringify(ideaLists));
          ideaDataTemp &&
            ideaDataTemp.length > 0 &&
            ideaDataTemp.map((item) => {
              if (item.ideaIsActive) {
                // item.ideaIsActive = true;
              } else {
                item.ideaIsActive = false;
              }
              if (item.id === iData.id) {
                if (item.ideaFavorites) {
                  item.ideaIsImportant = false;
                }
              }
              return item;
            });
          setIdeaLists(ideaDataTemp);
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
  };

  const readAllIdeas = (isReadAll) => {
    if (isReadAll) {
      const obj = {
        url: URL_CONFIG.IDEA_READ_ALL,
        method: 'post',
        isLoader: false,
      };
      httpHandler(obj)
        .then(() => {
          let ideaListsTemp = JSON.parse(JSON.stringify(ideaLists));
          if (ideaListsTemp) {
            ideaListsTemp.map((idea) => {
              idea.ideaIsRead = true;

              return idea;
            });
            setIdeaLists(ideaListsTemp);
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
  };

  const triggerCreateModal = () => {
    setCreateModalShow(true);
  };

  const dateReceived = (isSort) => {
    const dir = isSort ? 'asc' : 'desc';
    setDirection(dir);
    fetchIdeas(false, null, filterParams, 1, dir);
  };
  useEffect(() => {
    if (notification?.on_focus) {
      setIdeaDataState(true);
      setIdeaData({ id: Number(notification?.on_focus) });
    }
  }, [notification]);

  return (
    <React.Fragment>
      {showModal.type !== null && showModal.message !== null && (
        <EEPSubmitModal
          data={showModal}
          className={`modal-addmessage`}
          hideModal={hideModal}
          successFooterData={
            <button
              type="button"
              className="eep-btn eep-btn-xsml eep-btn-success"
              data-dismiss="modal"
              onClick={hideModal}
            >
              Continue
            </button>
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
      {isLoading ? (
        <Isloading />
      ) : (
        <div className="row eep-content-section-data no-gutters">
          <div className="tab-content col-md-12 h-100 response-allign-middle">
            <div
              id="ideas"
              className="tab-pane active h-100"
            >
              {createModalShow && (
                <CreateEditCommunicationModal
                  deptOptions={deptOptions}
                  createModalShow={createModalShow}
                  createCommunicationPost={createCommunicationPost}
                  communicationModalErr={createModalErr}
                  communicationType="idea"
                  communicationData={null}
                />
              )}
              <PageHeader
                title="Innovation Hub"
                navLinksRight={
                  <Link
                    to="#"
                    className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg"
                    dangerouslySetInnerHTML={{
                      __html: svgIcons && svgIcons.plus,
                    }}
                    onClick={triggerCreateModal}
                    data-toggle="modal"
                    data-target="#CreateEditCommunicationModal"
                  ></Link>
                }
                filter={
                  <TypeBasedFilter
                    config={TYPE_BASED_FILTER}
                    getFilterParams={getFilterParams}
                  />
                }
              />
              {!isLoading && (
                <>
                  {ideaLists?.length > 0 && (
                    <React.Fragment>
                      <div className="row mx-0 ideaaboxContainer">
                        <div className="col-md-6 eep-content-section-data eep_scroll_y pl-0">
                          {activeTab && activeTab.id === 'ideas' && (
                            <IdeaList
                              ideaListsData={ideaLists}
                              usersPic={usersPic}
                              fetchIdeas={fetchIdeaList}
                              stopFetchIdea={stopFetchIdea}
                              viewIdeaData={viewIdeaData}
                              readIdeaData={readIdeaData}
                              markImportant={markImportant}
                              readAllIdeas={readAllIdeas}
                              dateReceived={dateReceived}
                            />
                          )}
                        </div>
                        <div className="col-md-6 idea_detail_view eep-content-section-data ideabox-border-main eep_scroll_y px-0">
                          {ideaDataState && (
                            <IdeaDetailView
                              ideaData={ideaData}
                              usersPic={usersPic}
                              setIdeaDataState={setIdeaDataState}
                            />
                          )}
                          {!ideaDataState && (
                            <div className="row eep-content-section-data no-gutters">
                              <div className="eep_blank_div">
                                <img
                                  src={`${process.env.PUBLIC_URL}/images/icons/static/readData.png`}
                                  alt="Read Data"
                                />
                                <p className="eep_blank_message">
                                  Choose an Innovation to View
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                  {ideaLists && ideaLists?.length <= 0 && (
                    <ResponseInfo
                      title="No records found!!"
                      responseImg="noIdeaShare"
                      responseClass="response-info"
                      messageInfo="Nothing is really ours until we share it"
                      subMessageInfo="C. S. Lewis"
                    />
                  )}
                </>
              )}
            </div>
            <div
              id="myideas"
              className="tab-pane h-100"
            >
              {activeTab && activeTab.id === 'myideas' && (
                <MyIdeas
                  usersPic={usersPic}
                  deptOptions={deptOptions}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default IdeaBox;
