import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CustomLinkComponent from '../../UI/CustomComponents/CustomLinkComponent';
import PageHeader from '../../UI/PageHeader';
import TypeBasedFilter from '../../UI/TypeBasedFilter';
import TableComponent from '../../UI/tableComponent';
import { URL_CONFIG } from '../../constants/rest-config';
import { TYPE_BASED_FILTER } from '../../constants/ui-config';
import { pageLoaderHandler } from '../../helpers';
import { httpHandler } from '../../http/http-interceptor';
import ToggleSidebar from '../../layout/Sidebar/ToggleSidebar';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import { formatDates } from '../../constants/utills';

const ClosedPolls = (props) => {
  const [toggleClass, setToggleClass] = useState(true);
  const [myPollsList, setMyPollsList] = useState([]);
  // const [filterParams, setFilterParams] = useState({});
  const [filterParams, setFilterParams] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const dispatch = useDispatch();
  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };
  const [isLoading, setIsLoading] = useState(false);

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
      label: 'POLL',
      link: '',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'My Polls',
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  }, []);

  const fetchMyPollsDetail = (paramsInfo) => {
    setIsLoading(true);

    pageLoaderHandler('show');
    let obj;
    if (Object.getOwnPropertyNames(paramsInfo)) {
      obj = {
        url: URL_CONFIG.CLOSED_POLLS,
        method: 'get',
        params: paramsInfo,
      };
    } else {
      obj = {
        url: URL_CONFIG.CLOSED_POLLS,
        method: 'get',
      };
    }
    httpHandler(obj)
      .then((response) => {
        setMyPollsList(response.data);
        pageLoaderHandler('hide');
        setIsLoading(false);
      })
      .catch((error) => {
        setShowModal({
          ...showModal,
          type: 'danger',
          message: error?.response?.data?.message,
        });
        pageLoaderHandler('hide');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchMyPollsDetail(filterParams);
    pageLoaderHandler(isLoading ? 'show' : 'hide');
  }, []);

  const tableSettings = {
    createdAt: {
      classnames: '',
      objReference: 'createdAt',
    },
    view: {
      classnames: '',
      label: 'View',
      isRedirect: true,
      link: '/app/pollanswer',
      objReference: { pollData: 'data', viewType: 'fromPoll' },
    },
  };

  const PollsTableHeaders = [
    {
      header: 'POLL TITLE',
      accessorKey: 'polls.name',
    },
    {
      header: 'Date',
      accessorKey: 'createdAt',
      accessorFn: (row) => (row.createdAt ? formatDates(row.createdAt) : '--'),
    },
    // {
    // 	header: "View",
    // 	accessorKey: "action",
    // 	accessorFn: (row) => <CustomLinkComponent data={row} cSettings={tableSettings.view} />,
    // }
  ];

  const sideBarClass = (togglestate) => {
    setToggleClass(togglestate);
  };

  const getFilterParams = (paramsData) => {
    if (Object.getOwnPropertyNames(filterParams)) {
      setFilterParams({ ...paramsData });
    } else {
      setFilterParams({});
    }
    fetchMyPollsDetail(paramsData);
  };

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
      <PageHeader
        title="Manage Polls"
        filter={
          <TypeBasedFilter
            config={TYPE_BASED_FILTER}
            getFilterParams={getFilterParams}
          />
        }
      />
      <div className="eep-container-sidebar h-100 eep_scroll_y">
        <div className="container-sm eep-container-sm">
          <div
            className={`row eep-create-survey-div eep_with_sidebar ${
              toggleClass ? 'side_open' : ''
            } vertical-scroll-snap`}
          >
            <div
              className="eep_with_content table-responsive eep_datatable_table_div p-3 mt-3"
              style={{ visibility: 'visible' }}
            >
              <div
                id="user_dataTable_wrapper"
                className="dataTables_wrapper dt-bootstrap4 no-footer"
                style={{ width: '100%' }}
              >
                {!isLoading && (
                  <TableComponent
                    data={myPollsList ?? []}
                    columns={PollsTableHeaders}
                    // actionHidden={true}
                    action={
                      <CustomLinkComponent cSettings={tableSettings.view} />
                    }
                  />
                )}
              </div>
            </div>
            <ToggleSidebar
              toggleSidebarType="polls"
              sideBarClass={sideBarClass}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ClosedPolls;
