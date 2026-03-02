import $ from 'jquery';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import IconWithState from '../../UI/CustomComponents/IconWithState';
import ResponseCustomComponent from '../../UI/CustomComponents/ResponseCustomComponent';
import NPSCustomComponent from '../../UI/CustomComponents/NPSCustomComponent';
import PulseCustomComponent from '../../UI/CustomComponents/PulseCustomComponent';
import SurveyResultCustomComponent from '../../UI/CustomComponents/SurveyResultCustomComponent';
import PageHeader from '../../UI/PageHeader';
import TypeBasedFilter from '../../UI/TypeBasedFilter';
import TableComponent from '../../UI/tableComponent';
import { URL_CONFIG } from '../../constants/rest-config';
import { TYPE_BASED_FILTER } from '../../constants/ui-config';
import { httpHandler } from '../../http/http-interceptor';
import ToggleSidebar from '../../layout/Sidebar/ToggleSidebar';
import ConfirmStateModal from '../../modals/ConfirmStateModal';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import SurveyPreviewModal from './SurveyPreviewModal';
import { pageLoaderHandler } from '../../helpers';
import MetricCustomComponent from '../../UI/CustomComponents/MetricCustomComponent';
import SurveyResultModel from './SurveyResultModel';
import { formatDates } from '../../constants/utills';
import Isloading from '../../UI/CustomComponents/Isloading';
import TableComponentServerSide from '../../UI/TableComponentServerSide';
window.jQuery = $;
window.$ = $;
require('jquery-ui-sortable');
require('formBuilder');
require('formBuilder/dist/form-render.min.js');

const SurveyResult = () => {
  const dispatch = useDispatch();
  const [toggleClass, setToggleClass] = useState(true);
  const [previewState, setPreviewState] = useState(false);
  const [surveyResultList, setSurveyResultList] = useState([]);
  const [surveyTempData, setSurveyTempData] = useState({});
  const [jsonData, setJsonData] = useState([]);
  const [surveyTitle, setSurveyTitle] = useState(null);
  const [assignUser, setAssignUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [confirmModalState, setConfirmModalState] = useState(false);
  // const [filterParams, setFilterParams] = useState({});
  const [filterParams, setFilterParams] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [confirmStateModalObj, setConfirmStateModalObj] = useState({
    confirmTitle: null,
    confirmMessage: null,
  });
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modelData, setModelData] = useState({});
  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
    setConfirmModalState(false);
    setSurveyTempData({});
  };
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0); // 0-based
  const [pageSize, setPageSize] = useState(10);

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
      label: 'Survey',
      link: 'app/mysurvey',
    },
    {
      label: 'SURVEY Result',
      link: '',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Survey Results',
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  }, []);

  const disableExistModal = () => {
    setConfirmModalState(false);
    setShowModal({ type: null, message: null });
    setPreviewState(false);
  };

  const markImportantUnimportant = (arg) => {
    if (arg) {
      let obj;
      if (arg.isImportant) {
        obj = {
          url: URL_CONFIG.SURVEY_IMPORTANT_UNIMPORTANT + '?id=' + arg.sData.id,
          method: 'post',
        };
      }
      if (!arg.isImportant) {
        obj = {
          url: URL_CONFIG.SURVEY_IMPORTANT_UNIMPORTANT + '?id=' + arg.sData.id,
          method: 'delete',
        };
      }
      httpHandler(obj)
        .then(() => {
          fetchSurveyResultDetail(filterParams);
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

  const deleteSurvey = (sData) => {
    disableExistModal();
    let sDataTemp = JSON.parse(JSON.stringify(sData));
    sDataTemp['actionType'] = 'delete';
    setSurveyTempData(sDataTemp);
    setConfirmStateModalObj({
      confirmTitle: 'Are you sure?',
      confirmMessage: 'Do you really want to delete this Survey?',
    });
    setConfirmModalState(true);
  };

  const republishSurvey = (sInfo) => {
    if (sInfo && Object.keys(sInfo).length > 0) {
      const obj = {
        url: URL_CONFIG.SURVEY_BY_ID,
        method: 'get',
        params: { id: sInfo.id },
      };
      httpHandler(obj)
        .then((sData) => {
          updateAssignInfo(sData.data);
        })
        .catch((error) => {
          const errMsg =
            error.response?.data?.message !== undefined
              ? error.response?.data?.message
              : 'Something went wrong contact administarator';
        });
    }
  };

  const cSettings = {
    favourites: {
      title: 'Favourites',
      default: 'StarDefault.svg',
      isValue: 'StarFavourite.svg',
      classnames: 'eep-rotate-animation',
      objReference: 'favorites',
    },
    createdAt: {
      classnames: '',
      objReference: 'createdAt',
    },
    response: {
      title: 'Response',
      default: 'res-red.svg',
      minScore: 'res-red.svg',
      avgScore: 'res-yellow.svg',
      maxScore: 'res-green.svg',
      objReference: 'score',
    },
    report: {
      title: 'Report',
      default: 'enps.svg',
      enps: 'enps.svg',
      pulse: 'pulse.svg',
      metric: 'metric.svg',
      objReference: 'score',
    },
  };

  const reportArr = {
    enps: ['Main Employee Engagement'],
    pulse: ['Pulse Survey'],
  };

  const SurveyResultTableHeaders = [
    {
      header: 'SURVEY TITLE',
      accessorKey: 'name',
    },
    {
      header: 'Date',
      accessorKey: 'createdAt',
      Cell: ({ cell }) => {
        const rawDate = cell.getValue();
        return rawDate ? formatDates(rawDate) : '--'; // Use your existing function
      },
    },
    {
      header: 'SCORE',
      accessorKey: 'score',
      accessorFn: (row) => roundNumber(row?.score),
    },
    // {
    //   header: 'RESPONSE',
    //   accessorKey: 'response',
    //   accessorFn: (row) => (

    //   ),
    // },
    {
      header: 'REPORT',
      accessorKey: 'nps',
      // accessorFn: (row) => <>{ reportArr.enps.indexOf(row.name) > -1 ? <NPSCustomComponent isLoading={isLoading} data={row} cSettings={cSettings?.report} type="enps" /> : reportArr.pulse.indexOf(row.name) > -1 ? <PulseCustomComponent isLoading={isLoading} data={row} cSettings={cSettings?.report} type="pulse" /> : "" } </>,
      accessorFn: (row) => (
        <>
          <ResponseCustomComponent
            isLoading={isLoading}
            data={row}
            cSettings={cSettings?.response}
            type="survey"
          />
          {reportArr.enps.indexOf(row.name) > -1 ? (
            <>
              <NPSCustomComponent
                isLoading={isLoading}
                data={row}
                cSettings={cSettings?.report}
                type="enps"
              />{' '}
            </>
          ) : reportArr.pulse.indexOf(row.name) > -1 ? (
            <>
              {' '}
              <PulseCustomComponent
                isLoading={isLoading}
                data={row}
                cSettings={cSettings?.report}
                type="pulse"
              />{' '}
              <MetricCustomComponent
                isLoading={isLoading}
                data={row}
                cSettings={cSettings?.report}
                type=""
                setModelData={setModelData}
                setIsModalOpen={setIsModalOpen}
              />{' '}
            </>
          ) : (
            ''
          )}{' '}
        </>
      ),
    },
  ];

  const sideBarClass = (tooglestate) => {
    setToggleClass(tooglestate);
  };

  const roundNumber = (num) => {
    const roundedNum = Math.round(num * 10) / 10;
    return Math.ceil(roundedNum);
  };

  const fetchSurveyResultDetail = async (params = {}) => {
    setIsLoading(true);
    const queryParams = {
      direction: 'desc',
      limit: pageSize,
      offset: pageIndex + 1, // API is 1-based
      ...params,
    };

    const obj = {
      url: URL_CONFIG.SURVEY_RESULT,
      method: 'get',
      params: queryParams,
      isLoader: false,
    };
    httpHandler(obj)
      .then((response) => {
        setTotal(response?.data?.totalCount);
        setSurveyResultList(response.data?.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setShowModal({
          ...showModal,
          type: 'danger',
          message: error?.response?.data?.message,
        });
        setIsLoading(false);
      });
  };

  // useEffect(() => {
  //   fetchSurveyResultDetail(filterParams);
  //   pageLoaderHandler(isLoading ? 'show' : 'hide');
  // }, []);

  const getFilterParams = (paramsData) => {
    if (Object.getOwnPropertyNames(filterParams)) {
      setFilterParams({ ...paramsData });
    } else {
      setFilterParams({});
    }
    // fetchSurveyResultDetail(paramsData);
  };

  const confirmState = (isConfirmed) => {
    if (isConfirmed) {
      let httpObj;
      if (surveyTempData.actionType === 'delete') {
        httpObj = {
          url: URL_CONFIG.SURVEY + '?id=' + surveyTempData.id,
          method: 'delete',
        };
      }
      httpHandler(httpObj)
        .then(() => {
          fetchSurveyResultDetail(filterParams);
          disableExistModal();
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
    } else {
      setSurveyTempData({});
    }
  };

  const updateAssignInfo = (sData) => {
    if (sData) {
      setSurveyTitle(sData.name);
      const options = [
        { value: 'Users', label: 'Users' },
        { value: 'Departments', label: 'Departments' },
      ];
      let assignData = [];
      let surveyDataTemp = [];
      let jsonTemp;
      if (sData.deptList && sData.deptList.length > 0) {
        assignData = sData.deptList.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        setAssignUser(options[1]);
        setSelectedUsers([]);
        setSelectedDepts(assignData);
      }
      if (sData.userList && sData.userList.length > 0) {
        assignData = sData.userList.map((item) => {
          return {
            label: item.fullName,
            value: item.id,
          };
        });
        setAssignUser(options[0]);
        setSelectedDepts([]);
        setSelectedUsers(assignData);
      }
      if (sData.surveyQuestions && sData.surveyQuestions.length > 0) {
        sData.surveyQuestions.map((item) => {
          jsonTemp = JSON.parse(item.parameters);
          surveyDataTemp.push(jsonTemp);
          return surveyDataTemp;
        });
        setPreviewState(true);
        document.getElementById('previewSurvey').click();
        previewHandler(surveyDataTemp);
      }
    }
  };

  const previewHandler = (pJsonData) => {
    const wrap = $('#prevSurveyModal');
    $('#prevSurveyModal').html('');
    if (pJsonData !== undefined && pJsonData.length) {
      wrap.formRender({
        formData: pJsonData,
      });
      setJsonData([...pJsonData]);
    } else {
      var no_data = `<div className='text-center'><img src=${
        process.env.PUBLIC_URL + '/images/no-data.jpg'
      } className='w-50' /></div>`;
      $('#prevSurveyModal').html(no_data);
    }
  };

  const confirmRepublishSurveyHandler = () => {
    disableExistModal();
    let userIds = [],
      deptIds = [];
    selectedUsers.map((res) => {
      userIds.push(res.value);
      return res;
    });

    selectedDepts.map((res) => {
      deptIds.push(res.value);
      return res;
    });

    const requestData = {
      name: surveyTitle,
      description: null,
      departmentIds: deptIds,
      userIds: userIds,
      questions: jsonData,
    };

    const obj = {
      url: URL_CONFIG.SURVEY,
      method: 'post',
      payload: requestData,
    };
    httpHandler(obj)
      .then((response) => {
        setShowModal({
          ...showModal,
          type: 'success',
          success: 'Republish Successful!',
          message: 'Your survey has been republished successfully.',
        });
        fetchSurveyResultDetail(filterParams);
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
  useEffect(() => {
    fetchSurveyResultDetail(filterParams);
  }, [pageIndex, pageSize, filterParams]);
  return (
    <React.Fragment>
      <PageHeader
        title="Survey Results"
        filter={
          <TypeBasedFilter
            config={TYPE_BASED_FILTER}
            getFilterParams={getFilterParams}
          />
        }
      />
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
        />
      )}
      {isLoading ? (
        <Isloading />
      ) : (
        <>
          <div className="eep-container-sidebar h-100 eep_scroll_y">
            <div className="container-sm eep-container-sm">
              <div
                className={`row eep-create-survey-div eep_with_sidebar vertical-scroll-snap no-gutters ${
                  toggleClass ? 'side_open' : ''
                }`}
              >
                <div
                  className="eep_with_content table-responsive eep_datatable_table_div px-3 py-0 mt-3"
                  style={{ visibility: 'visible' }}
                >
                  <div
                    id="user_dataTable_wrapper"
                    className="dataTables_wrapper dt-bootstrap4 no-footer"
                    style={{ width: '100%' }}
                  >
                    {!isLoading && (
                      <TableComponentServerSide
                        data={surveyResultList ?? []}
                        columns={SurveyResultTableHeaders}
                        isServerSide={true}
                        total={total}
                        action={
                          <SurveyResultCustomComponent
                            markImportantUnimportant={markImportantUnimportant}
                            deleteSurvey={deleteSurvey}
                            republishSurvey={republishSurvey}
                          />
                        }
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
                <ToggleSidebar
                  toggleSidebarType="survey"
                  sideBarClass={sideBarClass}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            data-toggle="modal"
            data-target="#surveyPreviewModal"
            id="previewSurvey"
            className="eep-btn eep-btn-cancel eep-btn-xsml mr-2 d-none"
          >
            Preview
          </button>
        </>
      )}

      {previewState && (
        <SurveyPreviewModal
          title={surveyTitle}
          assignUser={assignUser}
          selectedDepts={selectedDepts}
          selectedUsers={selectedUsers}
          isRepublish={true}
          confirmRepublishSurveyHandler={confirmRepublishSurveyHandler}
        />
      )}
      <SurveyResultModel
        data={modelData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </React.Fragment>
  );
};

export default SurveyResult;
