import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import PageHeader from '../../UI/PageHeader';
import TypeBasedFilter from '../../UI/TypeBasedFilter';
import { TYPE_BASED_FILTER } from '../../constants/ui-config';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import Table from '../../UI/Table';
import ToggleSidebar from '../../layout/Sidebar/ToggleSidebar';
import DateFormatDisplay from '../../UI/CustomComponents/DateFormatDisplay';
import ResponseCustomComponent from '../../UI/CustomComponents/ResponseCustomComponent';
import PollCustomComponent from '../../UI/CustomComponents/PollCustomComponent';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';
import TableComponent from '../../UI/tableComponent';
import moment from 'moment';
import { pageLoaderHandler } from '../../helpers';
import PollResultModel from '../../modals/PollResultModel';
import { formatDates } from '../../constants/utills';

const PollResults = () => {
  const dispatch = useDispatch();
  const [toggleClass, setToggleClass] = useState(true);
  const [pollResultList, setPollResultList] = useState([]);
  // const [filterParams, setFilterParams] = useState({});
  const [filterParams, setFilterParams] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const [modelData, setModelData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      link: 'app/closedpolls',
    },
    {
      label: 'Poll RESULTs',
      link: '#',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Poll Results',
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  }, []);

  const sideBarClass = (tooglestate) => {
    setToggleClass(tooglestate);
  };

  const cSettings = {
    endDate: {
      classnames: '',
      objReference: 'endDate',
    },
    response: {
      title: 'Response',
      default: 'res-red.svg',
      minScore: 'res-red.svg',
      avgScore: 'res-yellow.svg',
      maxScore: 'res-green.svg',
      objReference: 'score',
    },
  };

  const PollResultTableHeaders = [
    {
      header: 'Poll TITLE',
      accessorKey: 'name',
      size: 200,
    },
    {
      header: 'END DATE',
      accessorKey: 'endDate',
      accessorFn: (row) => (row.endDate ? formatDates(row.endDate) : '--'),
      size: 120,
    },
    {
      header: 'ANSWERED',
      accessorKey: 'score',
      size: 120,
      accessorFn: (row) => (
        <PollCustomComponent
          data={row}
          typee="score"
        />
      ),
    },
    {
      header: 'COUNT',
      accessorKey: 'response',
      size: 120,
      accessorFn: (row) => (
        <PollCustomComponent
          data={row}
          typee="response"
        />
      ),
    },
    {
      header: 'RESPONSE',
      accessorKey: 'action',
      size: 120,
      accessorFn: (row) => (
        <ResponseCustomComponent
          data={row}
          cSettings={cSettings.response}
          type="polls"
          isButton={true}
          onClick={toggleModal}
        />
      ),
    },
  ];

  const fetchPollResultDetail = (paramsInfo) => {
    setIsLoading(true);

    let obj;
    if (Object.getOwnPropertyNames(paramsInfo)) {
      obj = {
        url: URL_CONFIG.POLL,
        method: 'get',
        params: paramsInfo,
      };
    } else {
      obj = {
        url: URL_CONFIG.POLL,
        method: 'get',
      };
    }
    httpHandler(obj)
      .then((response) => {
        setPollResultList(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        let errMsg;
        if (error.response) {
          if (error.response.status === 500) {
            errMsg =
              error.response?.data?.details !== undefined &&
              error.response?.data?.details[0]
                ? error.response?.data?.details[0]
                : 'Something went wrong contact administarator';
          } else {
            errMsg =
              error.response?.data?.message !== undefined
                ? error.response?.data?.message
                : 'Something went wrong contact administarator';
          }
        }
        setShowModal({
          ...showModal,
          type: 'danger',
          message: errMsg,
        });
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchPollResultDetail(filterParams);
    pageLoaderHandler(isLoading ? 'show' : 'hide');
  }, []);

  const getFilterParams = (paramsData) => {
    if (Object.getOwnPropertyNames(filterParams)) {
      setFilterParams({ ...paramsData });
    } else {
      setFilterParams({});
    }
    fetchPollResultDetail(paramsData);
  };
  const toggleModal = (data) => {
    setModelData(data);
    setIsModalOpen(true);
  };

  return (
    <React.Fragment>
      <PageHeader
        title="Poll Results"
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
                    data={pollResultList ?? []}
                    columns={PollResultTableHeaders}
                    actionHidden={true}
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
      <PollResultModel
        data={modelData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </React.Fragment>
  );
};

export default PollResults;
