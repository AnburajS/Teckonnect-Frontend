import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CustomLinkComponent from '../../UI/CustomComponents/CustomLinkComponent';
import PageHeader from '../../UI/PageHeader';
import TypeBasedFilter from '../../UI/TypeBasedFilter';
import TableComponent from '../../UI/tableComponent';
import { URL_CONFIG } from '../../constants/rest-config';
import { TYPE_BASED_FILTER } from '../../constants/ui-config';
import { httpHandler } from '../../http/http-interceptor';
import ToggleSidebar from '../../layout/Sidebar/ToggleSidebar';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import { pageLoaderHandler } from '../../helpers';
import { formatDates } from '../../constants/utills';
import Isloading from '../../UI/CustomComponents/Isloading';
import TableComponentServerSide from '../../UI/TableComponentServerSide';

const MyLibrary = () => {
  const [toggleClass, setToggleClass] = useState(true);
  const [librarySurveyList, setlibrarySurveyList] = useState([]);
  const [filterParams, setFilterParams] = useState({});
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const [isLoading, setIsLoading] = useState(true);
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
      label: 'Survey Vault',
      link: 'app/librarysurvey',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'My Survey',
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  }, []);

  const fetchMySurveyDetail = async (params = {}) => {
    setIsLoading(true);
    const queryParams = {
      direction: 'desc',
      limit: pageSize,
      offset: pageIndex + 1, // API is 1-based
      ...params,
    };

    const obj = {
      url: URL_CONFIG.GET_LIBRARY_SURVEY,
      method: 'get',
      params: queryParams,
      isLoader: false,
    };
    await httpHandler(obj)
      .then((response) => {
        setTotal(response?.data?.totalCount);
        setlibrarySurveyList(response?.data?.data);
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
    pageLoaderHandler('hide');
  };

  // useEffect(() => {
  //   fetchMySurveyDetail(filterParams);
  // }, []);

  const getFilterParams = (paramsData) => {
    if (Object.getOwnPropertyNames(filterParams)) {
      setFilterParams({ ...paramsData });
    } else {
      setFilterParams({});
    }
    // fetchMySurveyDetail(paramsData);
  };

  const tableSettings = {
    created_at: {
      classnames: '',
      objReference: 'created_at',
    },
    view: {
      classnames: '',
      label: 'View',
      isRedirect: true,
      link: '/app/surveylibrary',
      objReference: { surveyData: 'data' },
    },
  };

  const surveyTableHeaders = [
    {
      header: 'SURVEY TITLE',
      accessorKey: 'name',
    },
    {
      header: 'Date',
      accessorKey: 'created_at',
      Cell: ({ cell }) => {
        const rawDate = cell.getValue();
        return rawDate ? formatDates(rawDate) : '--'; // Use your existing function
      },
    },
  ];

  const sideBarClass = (togglestate) => {
    setToggleClass(togglestate);
  };
  // Fetch data whenever page/filter/pageSize changes
  useEffect(() => {
    fetchMySurveyDetail(filterParams);
    pageLoaderHandler('show');
  }, [pageIndex, pageSize, filterParams]);
  return (
    <React.Fragment>
      <PageHeader
        title="Survey Vault"
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
              {' '}
              Ok{' '}
            </button>
          }
          errorFooterData={
            <button
              type="button"
              className="eep-btn eep-btn-xsml eep-btn-danger"
              data-dismiss="modal"
              onClick={hideModal}
            >
              {' '}
              Close{' '}
            </button>
          }
        ></EEPSubmitModal>
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
                    data={librarySurveyList ?? []}
                    columns={surveyTableHeaders}
                    isServerSide={true}
                    total={total}
                    action={
                      <CustomLinkComponent
                        isLibrary={true}
                        cSettings={tableSettings.view}
                      />
                    }
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
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default MyLibrary;
