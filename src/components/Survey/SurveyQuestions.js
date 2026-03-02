import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CheckBoxComponent from '../../UI/CustomComponents/CheckBoxComponent';
import PageHeader from '../../UI/PageHeader';
import YearFilter from '../../UI/YearFilter';
import TableComponent from '../../UI/tableComponent';
import { URL_CONFIG } from '../../constants/rest-config';
import { httpHandler } from '../../http/http-interceptor';
import ToggleSidebar from '../../layout/Sidebar/ToggleSidebar';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import SurveyPreviewQuestionModal from './SurveyPreviewQuestionModal';
import { formatDates } from '../../constants/utills';
import Isloading from '../../UI/CustomComponents/Isloading';
import { pageLoaderHandler } from '../../helpers';
import TableComponentServerSide from '../../UI/TableComponentServerSide';

const SurveyQuestions = () => {
  const eepHistory = useNavigate();
  const yrDt = new Date().getFullYear();
  const [yearFilterValue, setYearFilterValue] = useState({ filterby: yrDt });
  const [toggleClass, setToggleClass] = useState(true);
  const [surveyQuestionsList, setSurveyQuestionsList] = useState([]);
  const [checkedData, setCheckedData] = useState([]);
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const [previewState, setPreviewState] = useState(false);
  const [jsonData, setJsonData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0); // 0-based
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();
  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };
  const [isLoading, setIsLoading] = useState(true);

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
      label: 'SURVEY QUESTIONS',
      link: '',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Survey Questions',
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  }, []);

  const getCheckedData = (cstate, arg) => {
    let checkedDataTemp = JSON.parse(JSON.stringify(checkedData));
    if (!surveyQuestionsList?.[cstate]?.action) {
      checkedDataTemp?.push(arg);
      setCheckedData([...checkedDataTemp]);
    } else {
      checkedDataTemp.map((val, index) => {
        if (arg.id === val.id) {
          checkedDataTemp.splice(index, 1);
          setCheckedData([...checkedDataTemp]);
        }
      });
    }

    let values = JSON.parse(JSON.stringify(surveyQuestionsList));
    let v = values?.[cstate]?.['action'];
    v = !values?.[cstate]?.['action'];
    setSurveyQuestionsList(values);
  };

  const CustomComponentSettings = {
    createdAt: {
      classnames: '',
      objReference: 'createdAt',
    },
  };

  const surveyTableHeaders = [
    {
      header: '#',
      accessorKey: 'action',
      size: 18,
      accessorFn: (row) => (
        <CheckBoxComponent
          data={row}
          getCheckedData={getCheckedData}
        />
      ),
    },
    {
      header: 'SURVEY QUESTION',
      accessorKey: 'question',
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
      header: 'Q Type',
      accessorKey: 'type',
    },
  ];

  const sideBarClass = (togglestate) => {
    setToggleClass(togglestate);
  };

  const fetchSurveyQuestionDetail = (paramData = {}) => {
    setIsLoading(true);

    const queryParams = {
      direction: 'desc',
      limit: pageSize,
      offset: pageIndex + 1, // API is 1-based
      ...paramData,
    };

    const obj = {
      url: URL_CONFIG.SURVEY_QUESTIONBANK,
      method: 'get',
      params: queryParams,
      isLoader: false,
    };
    // if (paramData && Object.keys(paramData).length > 0 && paramData !== '') {
    //   obj['params'] = paramData;
    // }
    httpHandler(obj)
      .then((response) => {
        setTotal(response?.data?.totalCount);
        const data = response?.data?.data?.map((v) => {
          return { ...v, action: false };
        });
        setSurveyQuestionsList(data);
        setIsLoading(false);
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
        setIsLoading(false);
      });
    pageLoaderHandler('hide');
  };

  useEffect(() => {
    fetchSurveyQuestionDetail({ ...yearFilterValue });
    pageLoaderHandler('show');
  }, [pageIndex, pageSize, yearFilterValue]);
  const onFilterChange = (filterValue) => {
    setYearFilterValue({ filterby: filterValue.value });
    // fetchSurveyQuestionDetail({ filterby: filterValue.value });
  };

  const createSurveyHandler = () => {
    setPreviewState(false);
    let surveyDataTemp = [];
    let jsonTemp;
    if (checkedData && checkedData.length > 0) {
      checkedData.map((item) => {
        jsonTemp = JSON.parse(item.parameters);
        surveyDataTemp.push(jsonTemp);
        return surveyDataTemp;
      });
      setJsonData([...surveyDataTemp]);
      setPreviewState(true);
    }
  };

  const confirmCreateSurveyHandler = () => {
    hideModal();
    setPreviewState(false);
    eepHistory('/app/createsurvey', {
      state: {
        surveyData: { isQuestionBank: true, surveyQuestions: jsonData },
      },
    });
  };

  return (
    <React.Fragment>
      <PageHeader
        title="Question Bank"
        filter={<YearFilter onFilterChange={onFilterChange} />}
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
      {previewState && (
        <SurveyPreviewQuestionModal
          confirmCreateSurveyHandler={confirmCreateSurveyHandler}
          jsonData={jsonData}
        />
      )}
      {isLoading ? (
        <Isloading />
      ) : (
        <div className="eep-container-sidebar h-100 eep_scroll_y">
          <div className="container-sm eep-container-sm">
            <div
              className={`row eep-create-survey-div eep_with_sidebar ${
                toggleClass ? 'side_open' : ''
              } vertical-scroll-snap`}
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
                  <TableComponentServerSide
                    data={surveyQuestionsList ?? []}
                    columns={surveyTableHeaders}
                    actionHidden={true}
                    isServerSide={true}
                    total={total}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    onPaginationChange={({ pageIndex, pageSize }) => {
                      setPageIndex(pageIndex);
                      setPageSize(pageSize);
                    }}
                  />
                </div>
              </div>
              <ToggleSidebar
                toggleSidebarType="survey"
                sideBarClass={sideBarClass}
              />
            </div>
            <div className="d-flex justify-content-center mb-3 mt-3">
              <button
                type="button"
                className="eep-btn eep-btn-success eep-btn-xsml urm_done_btn c1"
                data-toggle="modal"
                data-target="#SurveyPreviewQuestionModal"
                disabled={checkedData?.length > 0 ? false : true}
                onClick={createSurveyHandler}
              >
                Create Survey
              </button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default SurveyQuestions;
