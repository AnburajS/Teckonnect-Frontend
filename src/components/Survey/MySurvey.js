import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import PageHeader from '../../UI/PageHeader';
import TypeBasedFilter from '../../UI/TypeBasedFilter';
import TableComponent from '../../UI/tableComponent';
import CustomLinkComponent from '../../UI/CustomComponents/CustomLinkComponent';
import ToggleSidebar from '../../layout/Sidebar/ToggleSidebar';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import Isloading from '../../UI/CustomComponents/Isloading';
import ResponseInfo from '../../UI/ResponseInfo';
import { URL_CONFIG } from '../../constants/rest-config';
import { TYPE_BASED_FILTER } from '../../constants/ui-config';
import { pageLoaderHandler } from '../../helpers';
import { httpHandler } from '../../http/http-interceptor';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import { formatDates } from '../../constants/utills';
import TableComponentServerSide from '../../UI/TableComponentServerSide';

const MySurvey = () => {
  const dispatch = useDispatch();
  const [toggleClass, setToggleClass] = useState(true);
  const [mySurveyList, setMySurveyList] = useState([]);
  //const [filterParams, setFilterParams] = useState({});
  const [filterParams, setFilterParams] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0); // 0-based
  const [pageSize, setPageSize] = useState(10);

  // Set breadcrumb
  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [
          { label: 'Home', link: 'app/dashboard' },
          { label: 'Engage', link: 'app/engage' },
          { label: 'Survey', link: 'app/mysurvey' },
        ],
        title: 'My Survey',
      })
    );

    return () => {
      dispatch(
        BreadCrumbActions.updateBreadCrumb({
          breadcrumbArr: [],
          title: '',
        })
      );
    };
  }, []);

  // Handle modal close
  const hideModal = () => {
    document.querySelectorAll('.modal-backdrop')?.forEach((el) => el.remove());
    setShowModal({ type: null, message: null });
  };

  // Fetch survey data from API
  const fetchMySurveyDetail = async (params = {}) => {
    setIsLoading(true);
    pageLoaderHandler('show');

    const queryParams = {
      direction: 'desc',
      limit: pageSize,
      offset: pageIndex + 1, // API is 1-based
      ...params,
    };

    try {
      const response = await httpHandler({
        url: URL_CONFIG.MY_SURVEY,
        method: 'get',
        params: queryParams,
        isLoader: false,
      });
      console.log('response', response);
      setMySurveyList(response.data?.data);
      setTotal(response.data?.total ?? 100);
    } catch (error) {
      setShowModal({
        type: 'danger',
        message: error?.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setIsLoading(false);
      pageLoaderHandler('hide');
    }
  };

  // Run fetch on filter change
  const getFilterParams = (paramsData) => {
    setFilterParams(paramsData);
    setPageIndex(0); // reset to first page when filtering
  };

  // Fetch data whenever page/filter/pageSize changes
  useEffect(() => {
    fetchMySurveyDetail(filterParams);
  }, [pageIndex, pageSize, filterParams]);

  // Table column config
  const tableSettings = {
    view: {
      label: 'View',
      isRedirect: true,
      link: '/app/surveyanswer',
      objReference: { surveyData: 'data' },
    },
  };

  const surveyTableHeaders = [
    {
      header: 'SURVEY TITLE',
      accessorKey: 'survey.name',
    },
    {
      header: 'Date & Time',
      accessorKey: 'createdAt',
      Cell: ({ cell }) => {
        const rawDate = cell.getValue();
        return rawDate ? formatDates(rawDate) : '--'; // Use your existing function
      },
    },
    {
      header: 'View Survey',
      accessorKey: 'action',
      accessorFn: (row) => (
        <CustomLinkComponent
          data={row}
          cSettings={tableSettings.view}
        />
      ),
    },
  ];

  return (
    <React.Fragment>
      <PageHeader
        title="Manage Surveys"
        filter={
          <TypeBasedFilter
            config={TYPE_BASED_FILTER}
            getFilterParams={getFilterParams}
          />
        }
      />

      {showModal.type && showModal.message && (
        <EEPSubmitModal
          data={showModal}
          className="modal-addmessage"
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
              <div className="eep_with_content table-responsive eep_datatable_table_div px-3 py-0 mt-3">
                {mySurveyList.length === 0 ? (
                  <div className="row eep-content-section-data no-gutters">
                    <ResponseInfo
                      title="No records found!"
                      responseImg="noRecord"
                      responseClass="response-info"
                    />
                  </div>
                ) : (
                  <TableComponentServerSide
                    data={mySurveyList}
                    columns={surveyTableHeaders}
                    actionHidden={true}
                    isServerSide={true}
                    total={total}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    onPaginationChange={({ pageIndex, pageSize }) => {
                      console.log(pageIndex, pageSize);
                      setPageIndex(pageIndex);
                      setPageSize(pageSize);
                    }}
                  />
                )}
              </div>
              <ToggleSidebar
                toggleSidebarType="survey"
                sideBarClass={(state) => setToggleClass(state)}
              />
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default MySurvey;
