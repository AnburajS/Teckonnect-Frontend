import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import IconWithLength from '../../UI/CustomComponents/IconWithLength';
import MyForumsActions from '../../UI/CustomComponents/MyForumsActions';
import PageHeader from '../../UI/PageHeader';
import ForumYearFilter from '../../UI/ForumYearFilter';

import TableComponent from '../../UI/tableComponent';
import { URL_CONFIG } from '../../constants/rest-config';
import { httpHandler } from '../../http/http-interceptor';
import ConfirmStateModal from '../../modals/ConfirmStateModal';
import CreateEditCommunicationModal from '../../modals/CreateEditCommunicationModal';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import { pageLoaderHandler } from '../../helpers';
import { formatDates } from '../../constants/utills';
import TableComponentServerSide from '../../UI/TableComponentServerSide';
import Isloading from '../../UI/CustomComponents/Isloading';

const MyForumPosts = (props) => {
  const { usersPic, deptOptions } = props;

  const initUsersPic = usersPic ? usersPic : [];
  const initDeptOptions = deptOptions ? deptOptions : [];
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const [isLoading, setIsLoading] = useState(false);

  const yrDt = new Date().getFullYear();
  const [yearFilterValue, setYearFilterValue] = useState({ filterby: yrDt });
  const [myForumPostsLists, setMyForumPostsLists] = useState([]);
  const [usersPics, setUsersPics] = useState([]);
  const [deptOptionData, setDeptOptionData] = useState([]);
  const [forumTempData, setForumTempData] = useState({});
  const [confirmModalState, setConfirmModalState] = useState(false);
  const [forumEditModalState, setForumEditModalState] = useState(false);
  const [communicationModalErr, setCommunicationModalErr] = useState('');
  const [confirmStateModalObj, setConfirmStateModalObj] = useState({
    confirmTitle: null,
    confirmMessage: null,
  });
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0); // 0-based
  const [pageSize, setPageSize] = useState(10);
  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
    setConfirmModalState(false);
    setForumEditModalState(false);
    setForumTempData({});
  };

  useEffect(() => {
    setUsersPics(initUsersPic);
    setDeptOptionData(initDeptOptions);

    return () => {
      setUsersPics([]);
      setDeptOptionData([]);
    };
  }, [initUsersPic, initDeptOptions]);

  const IconWithLengthSettings = {
    comments: {
      title: 'Comments',
      default: 'MessageDefault.svg',
      isValue: 'Message.svg',
      classnames: 'eep-stretch-animation mr-2',
      objReference: 'forumComments',
    },
    likes: {
      title: 'Likes',
      default: 'HeartDefault.svg',
      isValue: 'Heart.svg',
      classnames: 'eep-pulsess-animation mr-2',
      objReference: 'forumLikes',
    },
    followers: {
      title: 'Followers',
      default: 'FollowDefault.svg',
      isValue: 'Follow.svg',
      classnames: 'eep-rotate-animation mr-2',
      objReference: 'forumFollowing',
    },
    createdAt: {
      classnames: '',
      objReference: 'createdAt',
    },
  };

  const dispatch = useDispatch();
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
        title: 'Forum Posts',
      }),
    );
    return () => {
      dispatch(
        BreadCrumbActions.updateBreadCrumb({
          breadcrumbArr: [],
          title: '',
        }),
      );
    };
  }, [breadcrumbArr, dispatch]);

  const fetchMyForumPostsData = (paramData = {}) => {
    setIsLoading(true);

    const queryParams = {
      direction: 'desc',
      limit: pageSize,
      offset: pageIndex + 1, // API is 1-based
      ...paramData,
    };

    const obj = {
      url: URL_CONFIG.MY_FORUMS,
      method: 'get',
      params: queryParams,
      isLoader: false,
    };
    // if (paramData && Object.keys(paramData).length > 0 && paramData !== '') {
    //   obj['params'] = paramData;
    // }
    httpHandler(obj)
      .then((myposts) => {
        setMyForumPostsLists([...myposts.data?.data]);
        setTotal(myposts?.data?.totalCount);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);

        //const errMsg = error.response?.data?.message;
      });
  };

  useEffect(() => {
    fetchMyForumPostsData(yearFilterValue);
    pageLoaderHandler(isLoading ? 'show' : 'hide');
  }, [pageIndex, pageSize, yearFilterValue]);

  const disableExistModal = () => {
    setConfirmModalState(false);
    setForumEditModalState(false);
  };

  const unPostForum = (fData) => {
    disableExistModal();
    let fDataTemp = JSON.parse(JSON.stringify(fData));
    fDataTemp['actionType'] = 'unpost';
    setForumTempData(fDataTemp);
    setConfirmStateModalObj({
      confirmTitle: 'Confirm Action',
      confirmMessage: 'Are you sure you want to remove this forum post?',
    });
    setConfirmModalState(true);
  };

  const postForum = (fData) => {
    disableExistModal();
    let fDataTemp = JSON.parse(JSON.stringify(fData));
    fDataTemp['actionType'] = 'post';
    setForumTempData(fDataTemp);
    setConfirmStateModalObj({
      confirmTitle: 'Are you sure?',
      confirmMessage: 'Do you really want to post this Forum?',
    });
    setConfirmModalState(true);
  };

  const deleteForum = (fData) => {
    disableExistModal();
    let fDataTemp = JSON.parse(JSON.stringify(fData));
    fDataTemp['actionType'] = 'delete';
    setForumTempData(fDataTemp);
    setConfirmStateModalObj({
      confirmTitle: 'Confirm Deletion',
      confirmMessage:
        'Are you sure you want to permanently delete this forum post?',
    });
    setConfirmModalState(true);
  };

  const editForum = (fData) => {
    disableExistModal();
    let fDataTemp = JSON.parse(JSON.stringify(fData));
    fDataTemp['actionType'] = 'edit';
    setForumTempData(fDataTemp);
    fetchForumDetail(fDataTemp);
  };

  const fetchForumDetail = (forumData) => {
    const obj = {
      url: URL_CONFIG.FORUM_BY_ID + '?id=' + forumData.id,
      method: 'get',
    };
    httpHandler(obj)
      .then((fData) => {
        setForumTempData(fData.data);
        if (forumData.actionType === 'edit') {
          setForumEditModalState(true);
        }
      })
      .catch((error) => {
        setShowModal({
          ...showModal,
          type: 'danger',
          message: error?.response?.data?.message,
        });
      });
  };

  const confirmState = (isConfirmed) => {
    if (isConfirmed) {
      disableExistModal();
      let forumUpdateObj, formData, httpObj;
      if (
        forumTempData.actionType === 'unpost' ||
        forumTempData.actionType === 'post'
      ) {
        formData = new FormData();
        forumUpdateObj = {
          id: forumTempData.id,
          title: forumTempData.title,
          description: forumTempData.description,
          active:
            forumTempData.actionType === 'post'
              ? true
              : forumTempData.actionType === 'unpost'
                ? false
                : false,
          existForumDept: [],
          dept: [],
          existForumAttach: [],
        };
        formData.append('forumrequest', JSON.stringify(forumUpdateObj));
        // formData.append('forumrequest', new Blob([JSON.stringify(forumUpdateObj)], { type: 'application/json' }));
        httpObj = {
          url: URL_CONFIG.FORUM,
          method: 'put',
          formData: formData,
        };
      }
      if (forumTempData.actionType === 'delete') {
        httpObj = {
          url: URL_CONFIG.FORUM + '?id=' + forumTempData.id,
          method: 'delete',
        };
      }
      httpHandler(httpObj)
        .then(() => {
          fetchMyForumPostsData(yearFilterValue);
        })
        .catch((error) => {
          const errMsg =
            error.response?.data?.message !== undefined
              ? error.response?.data?.message
              : 'Oops! Something went wrong. Please contact administrator.';
          setShowModal({
            ...showModal,
            type: 'danger',
            message: errMsg,
          });
        });
    } else {
      setForumTempData({});
    }
  };

  const updateCommunicationPost = (updateDatas) => {
    setCommunicationModalErr('');
    let formData = new FormData();
    if (updateDatas.files && updateDatas.files.length > 0) {
      updateDatas.files.map((item) => {
        formData.append('file', item);
        return item;
      });
    }

    let existForumDeptArr = [];
    let deptValsArr = [];
    updateDatas.dept.length > 0 &&
      updateDatas.dept.map((dID) => {
        if (updateDatas.existPostDept.indexOf(dID) !== -1) {
          existForumDeptArr.push(dID);
        } else {
          deptValsArr.push(dID);
        }
        return [existForumDeptArr, deptValsArr];
      });

    let forumUpdateObj = {
      id: updateDatas.postInfo.id,
      title: updateDatas.title,
      description: updateDatas.description,
      active: true,
      existForumDept: existForumDeptArr,
      dept: deptValsArr,
      existForumAttach: updateDatas.existPostAttach,
    };
    formData.append('forumrequest', JSON.stringify(forumUpdateObj));
    // formData.append('forumrequest', new Blob([JSON.stringify(forumUpdateObj)], { type: 'application/json' }));
    const obj = {
      url: URL_CONFIG.FORUM,
      method: 'put',
      formData: formData,
    };
    httpHandler(obj)
      .then((response) => {
        setForumEditModalState(false);
        fetchMyForumPostsData(yearFilterValue);
        setShowModal({
          ...showModal,
          success: 'Update Successful!',
          type: 'success',
          message: response?.data?.message,
        });
      })
      .catch((error) => {
        const errMsg =
          error.response?.data?.message !== undefined
            ? error.response?.data?.message
            : 'Oops! Something went wrong. Please contact administrator.';
        setCommunicationModalErr(errMsg);
      });
  };

  const myForumsTableHeaders = [
    {
      header: 'Title',
      accessorKey: 'title',
    },
    {
      header: 'Comments',
      accessorKey: 'forumComments.length',
      // accessorKey: 'action',
      // component: <IconWithLength cSettings={IconWithLengthSettings.comments} />,
      // accessorFn: (row) => {
      //   return (
      //     <IconWithLength
      //       cSettings={IconWithLengthSettings.comments}
      //       row={row}
      //     />
      //   );
      // },
    },
    {
      header: 'Likes',
      accessorKey: 'forumLikes.length',
      // component: <IconWithLength cSettings={IconWithLengthSettings.likes} />,
      // accessorFn: (row) => (
      //   <IconWithLength cSettings={IconWithLengthSettings.likes} />
      // ),
    },
    {
      header: 'Followers',
      accessorKey: 'forumFollowing.length',
      // component: <IconWithLength cSettings={IconWithLengthSettings.followers} />,
      // accessorFn: (row) => (
      //   <IconWithLength cSettings={IconWithLengthSettings.followers} />
      // ),
    },
    {
      header: 'Date',
      accessorKey: 'createdAt',
      // component: <DateFormatDisplay cSettings={IconWithLengthSettings.createdAt} />,
      Cell: ({ cell }) => {
        const rawDate = cell.getValue();
        return rawDate ? formatDates(rawDate) : '--'; // Use your existing function
      },
      // accessorFn: (row) => formatDates(row.createdAt),
    },
    // {
    //   header: "Action",
    //   accessorKey: "action",
    //   component: <MyForumsActions unPostForum={unPostForum} postForum={postForum} deleteForum={deleteForum} editForum={editForum} usersPic={usersPics} />,
    // },
  ];

  const onFilterChange = (filterValue) => {
    setYearFilterValue({ filterby: filterValue.value });
    // fetchMyForumPostsData({ filterby: filterValue.value });
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <Isloading />
      ) : (
        <>
          {' '}
          <PageHeader
            title="My Posts"
            // navLinksLeft={
            //   <Link
            //     to="forum"
            //     className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg"
            //     dangerouslySetInnerHTML={{
            //       __html: svgIcons && svgIcons.lessthan_circle,
            //     }}
            //   ></Link>
            // }
            filter={
              <ForumYearFilter
                onFilterChange={onFilterChange}
                value={yearFilterValue.filterby}
              />
            }
          />
          {confirmModalState && (
            <ConfirmStateModal
              hideModal={hideModal}
              confirmState={confirmState}
              confirmTitle={
                confirmStateModalObj.confirmTitle
                  ? confirmStateModalObj.confirmTitle
                  : 'Are you sure?'
              }
              confirmMessage={
                confirmStateModalObj.confirmMessage
                  ? confirmStateModalObj.confirmMessage
                  : ''
              }
              actionType={forumTempData.actionType}
            />
          )}
          {forumEditModalState && (
            <CreateEditCommunicationModal
              hideModal={hideModal}
              deptOptions={deptOptionData}
              createModalShow={forumEditModalState}
              updateCommunicationPost={updateCommunicationPost}
              communicationModalErr={communicationModalErr}
              communicationType="forum"
              communicationData={forumTempData}
            />
          )}
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
          <div
            className="eep-user-management eep-content-start"
            id="content-start"
          >
            <div
              className="table-responsive eep_datatable_table_div p-3 mt-3"
              style={{ visibility: 'visible' }}
            >
              <div
                id="user_dataTable_wrapper"
                className="dataTables_wrapper dt-bootstrap4 no-footer"
                style={{ width: '100%' }}
              >
                {!isLoading && (
                  <TableComponentServerSide
                    data={myForumPostsLists ?? []}
                    columns={myForumsTableHeaders}
                    action={
                      <MyForumsActions
                        unPostForum={unPostForum}
                        postForum={postForum}
                        deleteForum={deleteForum}
                        editForum={editForum}
                        usersPic={usersPics}
                      />
                    }
                    isServerSide={true}
                    total={total}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    onPaginationChange={({ pageIndex, pageSize }) => {
                      setPageIndex(pageIndex);
                      setPageSize(pageSize);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </React.Fragment>
  );
};

export default MyForumPosts;
