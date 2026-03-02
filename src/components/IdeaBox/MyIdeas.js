import React, { useEffect, useState } from "react";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PageHeader from "../../UI/PageHeader";
import YearFilter from "../../UI/YearFilter";
import Table from "../../UI/Table";
import { httpHandler } from "../../http/http-interceptor";
import { URL_CONFIG } from "../../constants/rest-config";
import DateFormatDisplay from "../../UI/CustomComponents/DateFormatDisplay";
import IconWithLength from "../../UI/CustomComponents/IconWithLength";
import MyIdeaActions from "../../UI/CustomComponents/MyIdeaActions";
import ConfirmStateModal from "../../modals/ConfirmStateModal";
import EEPSubmitModal from "../../modals/EEPSubmitModal";
import IdeaViewModal from "./IdeaViewModal";
import CreateEditCommunicationModal from "../../modals/CreateEditCommunicationModal";
import TableComponent from "../../UI/tableComponent";
import moment from "moment";
import { pageLoaderHandler } from "../../helpers";
import { formatDates } from "../../constants/utills";

function MyIdeas(props) {
  const { usersPic, deptOptions } = props;

  const initUsersPic = usersPic ? usersPic : [];
  const initDeptOptions = deptOptions ? deptOptions : [];
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);

  const yrDt = new Date().getFullYear();
  const [yearFilterValue, setYearFilterValue] = useState({ filterby: yrDt });
  const [usersPics, setUsersPics] = useState([]);
  const [deptOptionData, setDeptOptionData] = useState([]);
  const [myIdeasList, setMyIdeasList] = useState([]);
  const [ideaTempData, setIdeaTempData] = useState({});
  const [confirmModalState, setConfirmModalState] = useState(false);
  const [ideaViewModalState, setIdeaViewModalState] = useState(false);
  const [ideaEditModalState, setIdeaEditModalState] = useState(false);
  const [communicationModalErr, setCommunicationModalErr] = useState("");
  const [confirmStateModalObj, setConfirmStateModalObj] = useState({
    confirmTitle: null,
    confirmMessage: null,
  });
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const [isLoading, setIsLoading] = useState(false);

  const hideModal = () => {
    let collections = document.getElementsByClassName("modal-backdrop");
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
    setConfirmModalState(false);
    setIdeaViewModalState(false);
    setIdeaEditModalState(false);
    setIdeaTempData({});
  };

  const dispatch = useDispatch();
  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    {
      label: "Engage",
      link: "app/engage",
    },
    {
      label: "Innovation Hub",
      link: "",
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "My Innovations",
      })
    );
  }, [breadcrumbArr, dispatch]);

  useEffect(() => {
    setUsersPics(initUsersPic);
    setDeptOptionData(initDeptOptions);
  }, [initUsersPic, initDeptOptions]);

  // const IconWithLengthSettings = {
  //   favourites: {
  //     title: 'Favourites',
  //     default: 'StarDefault.svg',
  //     isValue: 'StarFavourite.svg',
  //     classnames: 'eep-rotate-animation mr-2',
  //     objReference: 'ideaFavorite',
  //   },
  //   likes: {
  //     title: 'Likes',
  //     default: 'HeartDefault.svg',
  //     isValue: 'Heart.svg',
  //     classnames: 'eep-pulsess-animation mr-2',
  //     objReference: 'ideaLikes',
  //   },
  //   comments: {
  //     title: 'Comments',
  //     default: 'MessageDefault.svg',
  //     isValue: 'Message.svg',
  //     classnames: 'eep-stretch-animation mr-2',
  //     objReference: 'ideaComments',
  //   },
  //   createdAt: {
  //     classnames: '',
  //     objReference: 'createdAt',
  //   },
  // };

  const disableExistModal = () => {
    setConfirmModalState(false);
    setIdeaViewModalState(false);
    setIdeaEditModalState(false);
  };

  const unPostIdea = (iData) => {
    disableExistModal();
    let iDataTemp = JSON.parse(JSON.stringify(iData));
    iDataTemp["actionType"] = "unpost";
    setIdeaTempData(iDataTemp);
    setConfirmStateModalObj({
      confirmTitle: "Confirm Action",
      confirmMessage: "Are you sure you want to remove this idea?",
    });
    setConfirmModalState(true);
  };

  const postIdea = (iData) => {
    disableExistModal();
    let iDataTemp = JSON.parse(JSON.stringify(iData));
    iDataTemp["actionType"] = "post";
    setIdeaTempData(iDataTemp);
    setConfirmStateModalObj({
      confirmTitle: "Confirm Action",
      confirmMessage: "Are you sure you want to publish this idea?",
    });
    setConfirmModalState(true);
  };

  const deleteIdea = (iData) => {
    disableExistModal();
    let iDataTemp = JSON.parse(JSON.stringify(iData));
    iDataTemp["actionType"] = "delete";
    setIdeaTempData(iDataTemp);
    setConfirmStateModalObj({
      confirmTitle: "Are you sure?",
      confirmMessage: "Do you really want to delete this Idea?",
    });
    setConfirmModalState(true);
  };

  const viewIdea = (iData) => {
    disableExistModal();
    let iDataTemp = JSON.parse(JSON.stringify(iData));
    iDataTemp["actionType"] = "view";
    setIdeaTempData(iDataTemp);
    fetchIdeaDetail(iDataTemp);
  };

  const editIdea = (iData) => {
    disableExistModal();
    let iDataTemp = JSON.parse(JSON.stringify(iData));
    iDataTemp["actionType"] = "edit";
    setIdeaTempData(iDataTemp);
    fetchIdeaDetail(iDataTemp);
  };

  const fetchIdeaDetail = (ideaData) => {
    const obj = {
      url: URL_CONFIG.IDEA_BY_ID + "?id=" + ideaData.id,
      method: "get",
    };
    httpHandler(obj)
      .then((iData) => {
        setIdeaTempData(iData.data);
        if (ideaData.actionType === "view") {
          setIdeaViewModalState(true);
        }
        if (ideaData.actionType === "edit") {
          setIdeaEditModalState(true);
        }
      })
      .catch((error) => {
        setShowModal({
          ...showModal,
          type: "danger",
          message: error?.response?.data?.message,
        });
      });
  };

  const myIdeasTableHeaders = [
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Favourites",
      accessorKey: "ideaFavorite.length",
      // component: <IconWithLength cSettings={IconWithLengthSettings.favourites} />,
      // accessorFn: (row) => {
      //   console.log(row, IconWithLengthSettings, 'ideaFavorite');

      //   // return <IconWithLength cSettings={IconWithLengthSettings.favourites} />;
      // },
    },
    {
      header: "Likes",
      accessorKey: "ideaLikes.length",
      // component: <IconWithLength cSettings={IconWithLengthSettings.likes} />,
      // accessorFn: (row) => (
      //   <IconWithLength cSettings={IconWithLengthSettings.likes} />
      // ),
    },
    {
      header: "Comments",
      accessorKey: "ideaComments.length",
      // component: <IconWithLength cSettings={IconWithLengthSettings.comments} />,
      // accessorFn: (row) => (
      //   <IconWithLength cSettings={IconWithLengthSettings.comments} />
      // ),
    },
    {
      header: "Date",
      accessorKey: "action",
      accessorFn: (row) => formatDates(row.createdAt),

      // component: <DateFormatDisplay cSettings={IconWithLengthSettings.createdAt} />,
    },
    // {
    //   header: "Action",
    //   accessorKey: "action",
    //   component: <MyIdeaActions unPostIdea={unPostIdea} postIdea={postIdea} deleteIdea={deleteIdea} viewIdea={viewIdea} editIdea={editIdea} />,
    // },
  ];

  const fetchMyIdeasData = (paramData = {}) => {
    setIsLoading(true);

    const obj = {
      url: URL_CONFIG.MY_IDEAS,
      method: "get",
    };
    if (paramData && Object.keys(paramData).length > 0 && paramData !== "") {
      obj["params"] = paramData;
    }
    httpHandler(obj)
      .then((myIdeas) => {
        setMyIdeasList([
          ...myIdeas?.data?.map((v) => {
            return { ...v, name: v?.title };
          }),
        ]);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);

        //const errMsg = error.response?.data?.message;
      });
  };

  useEffect(() => {
    fetchMyIdeasData(yearFilterValue);
    pageLoaderHandler(isLoading ? "show" : "hide");
  }, []);

  const confirmState = (isConfirmed) => {
    disableExistModal();
    if (isConfirmed) {
      let ideaUpdateObj, formData, httpObj;
      if (
        ideaTempData.actionType === "unpost" ||
        ideaTempData.actionType === "post"
      ) {
        formData = new FormData();
        ideaUpdateObj = {
          id: ideaTempData.id,
          title: ideaTempData.title,
          description: ideaTempData.description,
          active:
            ideaTempData.actionType === "post"
              ? true
              : ideaTempData.actionType === "unpost"
              ? false
              : false,
          existIdeaDept: [],
          dept: [],
          existIdeaAttach: [],
        };
        formData.append(
          "ideaRequest",
          JSON.stringify(ideaUpdateObj)
          //  new Blob([JSON.stringify(ideaUpdateObj)], { type: 'application/json'})
        );
        httpObj = {
          url: URL_CONFIG.IDEA,
          method: "put",
          formData: formData,
        };
      }
      if (ideaTempData.actionType === "delete") {
        httpObj = {
          url: URL_CONFIG.IDEA + "?id=" + ideaTempData.id,
          // payload: { id: ideaTempData.id },
          method: "delete",
        };
      }

      httpHandler(httpObj)
        .then(() => {
          fetchMyIdeasData(yearFilterValue);
        })
        .catch((error) => {
          const errMsg =
            error.response?.data?.message !== undefined
              ? error.response?.data?.message
              : "Oops! Something went wrong. Please contact administrator.";
          setShowModal({
            ...showModal,
            type: "danger",
            message: errMsg,
          });
        });
    } else {
      setIdeaTempData({});
    }
  };

  const updateCommunicationPost = (updateDatas) => {
    setCommunicationModalErr("");
    let formData = new FormData();
    if (updateDatas.files && updateDatas.files.length > 0) {
      updateDatas.files.map((item) => {
        formData.append("file", item);
        return item;
      });
    }

    let existIdeaDeptArr = [];
    let deptValsArr = [];
    updateDatas.dept.length > 0 &&
      updateDatas.dept.map((dID) => {
        if (updateDatas.existPostDept.indexOf(dID) !== -1) {
          existIdeaDeptArr.push(dID);
        } else {
          deptValsArr.push(dID);
        }
        return [existIdeaDeptArr, deptValsArr];
      });

    let ideaUpdateObj = {
      id: updateDatas.postInfo.id,
      title: updateDatas.title,
      description: updateDatas.description,
      active: true,
      existIdeaDept: existIdeaDeptArr,
      dept: deptValsArr,
      existIdeaAttach: updateDatas.existPostAttach,
    };
    formData.append(
      "ideaRequest",
      JSON.stringify(ideaUpdateObj)
      //  new Blob([JSON.stringify(ideaUpdateObj)], { type: 'application/json' })
    );
    const obj = {
      url: URL_CONFIG.IDEA,
      method: "put",
      formData: formData,
    };
    httpHandler(obj)
      .then((response) => {
        setIdeaEditModalState(false);
        fetchMyIdeasData(yearFilterValue);
        setShowModal({
          ...showModal,
          type: "success",
          message: response?.data?.message,
        });
      })
      .catch((error) => {
        const errMsg =
          error.response?.data?.message !== undefined
            ? error.response?.data?.message
            : "Oops! Something went wrong. Please contact administrator.";
        setCommunicationModalErr(errMsg);
      });
  };

  const onFilterChange = (filterValue) => {
    setYearFilterValue({ filterby: filterValue.value });
    fetchMyIdeasData({ filterby: filterValue.value });
  };

  return (
    <React.Fragment>
      <PageHeader
        title="My Innovations"
        // navLinksLeft={
        //   <Link
        //     to="/app/ideabox"
        //     className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg"
        //     dangerouslySetInnerHTML={{
        //       __html: svgIcons && svgIcons.lessthan_circle,
        //     }}
        //   ></Link>
        // }
        filter={<YearFilter onFilterChange={onFilterChange} />}
      />
      {confirmModalState && (
        <ConfirmStateModal
          hideModal={hideModal}
          confirmState={confirmState}
          confirmTitle={
            confirmStateModalObj.confirmTitle
              ? confirmStateModalObj.confirmTitle
              : "Are you sure?"
          }
          confirmMessage={
            confirmStateModalObj.confirmMessage
              ? confirmStateModalObj.confirmMessage
              : ""
          }
          actionType={ideaTempData.actionType}
        />
      )}

      {ideaViewModalState && (
        <IdeaViewModal
          ideaTempData={ideaTempData}
          hideModal={hideModal}
          usersPics={usersPics}
          ideaViewModalState={ideaViewModalState}
        />
      )}

      {ideaEditModalState && (
        <CreateEditCommunicationModal
          hideModal={hideModal}
          deptOptions={deptOptionData}
          createModalShow={ideaEditModalState}
          updateCommunicationPost={updateCommunicationPost}
          communicationModalErr={communicationModalErr}
          communicationType="idea"
          communicationData={ideaTempData}
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
              Ok
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
      <div className="eep-user-management eep-content-start" id="content-start">
        <div
          className="table-responsive eep_datatable_table_div p-3 mt-3"
          style={{ visibility: "visible" }}
        >
          <div
            id="user_dataTable_wrapper"
            className="dataTables_wrapper dt-bootstrap4 no-footer"
            style={{ width: "100%" }}
          >
            {!isLoading && (
              <TableComponent
                data={myIdeasList ?? []}
                columns={myIdeasTableHeaders}
                action={
                  <MyIdeaActions
                    unPostIdea={unPostIdea}
                    postIdea={postIdea}
                    deleteIdea={deleteIdea}
                    viewIdea={viewIdea}
                    editIdea={editIdea}
                  />
                }
              />
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
export default MyIdeas;
