import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ManageAwardActions from '../../UI/CustomComponents/ManageAwardActions';
import PageHeader from '../../UI/PageHeader';
import TableComponent from '../../UI/tableComponent';
import { URL_CONFIG } from '../../constants/rest-config';
import { httpHandler } from '../../http/http-interceptor';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import StopAllotedAwardModal from '../../modals/StopAllotedAwardModal';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import { pageLoaderHandler } from '../../helpers';
import Filter from '../../UI/Filter';
import {
  BULK_ACTION,
  HIDE_SHOW_FILTER_CONFIG,
} from '../../constants/ui-config';
import BulkAction from '../../UI/BulkAction';
import { Link } from 'react-router-dom';
import AssignAwards from './AssignAwards';
import { formatDates } from '../../constants/utills';
import TableComponentServerSide from '../../UI/TableComponentServerSide';

const ManageAwards = () => {
  const [filterBy, setFilterBy] = useState({ filter: true });
  const [bulkUpdateBy, setBulkUpdateBy] = useState({ updateBy: null });
  const [enableBulkState, setEnableBulkState] = useState({ bulkState: false });
  const [awardManage, setAwardManage] = useState([]);
  const [deletionState, setDeletionState] = useState(false);
  const [tab, setTab] = useState('award_type');
  const [deletionData, setDeletionData] = useState([]);
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const [isLoading, setIsLoading] = useState(false);
  const [nominateTypeData, setNominateTypeData] = useState({});
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [awardData, setAwardData] = useState({});
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0); // 0-based
  const [pageSize, setPageSize] = useState(10);
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission
  );
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
      label: 'RECOGNIZE',
      link: 'app/recognition',
    },
    {
      label: 'AWARDS',
      link: 'app/awards',
    },
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Manage Awards',
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  }, []);

  const triggerModal = (isTrigger) => {
    if (isTrigger) {
      if (isTrigger.handleState) {
        setDeletionData(isTrigger.data);
        setDeletionState(isTrigger.handleState);
      } else {
        setDeletionData([]);
        setDeletionState(false);
      }
    }
  };

  const tableSettings = {
    createdAt: {
      classnames: '',
      objReference: 'createdAt',
    },
    lastRun: {
      classnames: '',
      objReference: 'lastRun',
    },
    nextRun: {
      classnames: '',
      objReference: 'nextRun',
    },
  };

  const manageNominationSchedulesTableHeaders = [
    {
      header: 'Award Name',
      accessorKey: 'award.name',
    },
    {
      header: 'Type',
      accessorKey: 'type',
    },
    {
      header: 'Date',
      accessorKey: 'createdAt',
      Cell: ({ cell }) => {
        const rawDate = cell.getValue();
        return rawDate ? formatDates(rawDate) : '--'; // Use your existing function
      },
      // accessorFn: (row) => (row?.createdAt ? formatDates(row.createdAt) : '--'),

      // component: <DateFormatDisplay cSettings={tableSettings.createdAt} />,
    },
    {
      header: 'Last Run',
      accessorKey: 'lastRun',
      // component: <DateFormatDisplay cSettings={tableSettings.lastRun} />,
      accessorFn: (row) => (row?.lastRun ? formatDates(row.lastRun) : '--'),
    },
    {
      header: 'Next Run',
      accessorKey: 'nextRun',
      // component: <DateFormatDisplay cSettings={tableSettings.nextRun} />,
      accessorFn: (row) => (row.nextRun ? formatDates(row.nextRun) : '--'),
    },
    // {
    //   header: "Action",
    //   accessorKey: "action",
    //   component: <ManageAwardActions triggerModal={triggerModal} />,
    // },
  ];

  const manageSpotTableHeaders = [
    {
      header: 'Award Name',
      accessorKey: 'award.name',
    },
    {
      header: 'Department',
      accessorKey: 'departmentId.name',
    },
    {
      header: 'Date',
      accessorKey: 'createdAt',
      Cell: ({ cell }) => {
        const rawDate = cell.getValue();
        return rawDate ? formatDates(rawDate) : '--'; // Use your existing function
      },
      // accessorFn: (row) => (row?.createdAt ? formatDates(row.createdAt) : '--'),
    },
    // {
    //   header: "Actions",
    //   accessorKey: "action",
    //   component: <ManageAwardActions triggerModal={triggerModal} />,
    // },
  ];

  const clickHandler = (arg) => {
    setTab(arg);
    setPageIndex(0);
    setPageSize(10);
  };

  const fetchManageAwardData = (arg) => {
    setIsLoading(true);
    const queryParams = {
      direction: 'desc',
      limit: pageSize,
      offset: pageIndex + 1, // API is 1-based
      type: arg,
    };

    const obj = {
      url: URL_CONFIG.MANAGE_AWARDS,
      method: 'get',
      params: queryParams,
    };

    // let obj;
    // if (arg === 'nomi_award') {
    //   obj = {
    //     url: URL_CONFIG.MANAGE_AWARDS,
    //     method: 'get',
    //     params: {  },
    //   };
    // }
    // if (arg === 'spot_award') {
    //   obj = {
    //     url: URL_CONFIG.MANAGE_AWARDS,
    //     method: 'get',
    //     params: { type: arg },
    //   };
    // }
    httpHandler(obj)
      .then((response) => {
        setTotal(response?.data?.totalCount);
        setAwardManage(
          response?.data?.data?.map((v) => {
            return {
              ...v,
              name: v?.award?.name ?? '',
              // createdAt: v?.created_at,
              // nextRun: v?.next_run,
              // lastRun: v?.last_run,
              // type: v?.entity_type || v?.type || ''
            };
          })
        );
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);

        //const errMsg = error.response?.data?.message;
      });
  };

  useEffect(() => {
    if (tab !== 'award_type') {
      fetchManageAwardData(tab);
    }
    pageLoaderHandler(isLoading ? 'show' : 'hide');
  }, [pageIndex, pageSize, tab]);

  const confirmState = (arg) => {
    if (arg) {
      //if(deletionData.entityType === "nomi_award") {
      const obj = {
        url:
          URL_CONFIG.MANAGE_AWARDS +
          '?id=' +
          deletionData.id +
          '&type=' +
          (deletionData?.entityType || deletionData?.type),
        method: 'delete',
      };
      httpHandler(obj)
        .then(() => {
          fetchManageAwardData(deletionData?.entityType || deletionData?.type);
        })
        .catch((error) => {
          setShowModal({
            ...showModal,
            type: 'danger',
            message: error?.response?.data?.message,
          });
        });
      //}
    } else {
      setDeletionData([]);
      setDeletionState(false);
    }
  };
  const filterOnChangeHandler = (arg) => {
    if (arg) {
      setFilterBy({ filter: arg.value });
      fetchAwardData(arg.value);
      resetCheckBox();
    }
  };
  const enableFilterOptions = (e) => {
    const { checked } = e.target;
    setEnableBulkState({ bulkState: false });
    if (checked) {
      setEnableBulkState({ bulkState: true });
    }
  };
  const onBulkActionChangeHandler = (arg) => {
    if (arg) {
      setBulkUpdateBy({ updateBy: arg.value });
    }
  };
  const bulkSubmitHandler = () => {
    if (selectedRecords.length > 0 && bulkUpdateBy.updateBy !== null) {
      const obj = {
        url: URL_CONFIG.AWARD_BULK_UPDATE,
        method: 'put',
        payload: {
          award: selectedRecords,
          active: bulkUpdateBy.updateBy,
        },
      };
      httpHandler(obj)
        .then((response) => {
          setShowModal({
            ...showModal,
            type: 'success',
            message: response?.data?.message,
          });
          fetchAwardData(filterBy.filter);
          resetCheckBox();
          setEnableBulkState({ bulkState: false });
        })
        .catch((error) => {
          setShowModal({
            ...showModal,
            type: 'danger',
            message: error?.response?.data?.message,
          });
        });
    }
  };
  const fetchAwardData = (arg) => {
    const obj = {
      url: URL_CONFIG.ALLAWARDS,
      method: 'get',
      params: { active: arg },
    };
    httpHandler(obj)
      .then((awardData) => {
        setAwardData(awardData.data);
      })
      .catch((error) => {});
  };
  const getSelectedAwards = (arg) => {
    const selectedArray = arg.map((i) => Number(i));
    setSelectedRecords(selectedArray);
  };
  const resetCheckBox = () => {
    const badgeList = document.getElementsByClassName('badge-list');
    setSelectedRecords([]);
    for (let i = 0; i < badgeList.length; i++) {
      if (badgeList[i]) {
        badgeList[i].checked = false;
      }
    }
  };
  const fetchNominationTypeData = () => {
    fetch(`${process.env.PUBLIC_URL}/data/awardNominationTypes.json`)
      .then((response) => response.json())
      .then((data) => {
        setNominateTypeData(data);
      })
      .catch();
  };

  useEffect(() => {
    fetchAwardData(filterBy.filter);
    fetchNominationTypeData();
  }, []);
  return (
    <React.Fragment>
      {tab === 'award_type' ? (
        <>
          {!userRolePermission.awardCreate &&
            !userRolePermission.awardModify && (
              <PageHeader
                title="Awards and Nomination"
                filter={
                  <Filter
                    config={HIDE_SHOW_FILTER_CONFIG}
                    onFilterChange={filterOnChangeHandler}
                  />
                }
              ></PageHeader>
            )}
          {userRolePermission.awardCreate &&
            !userRolePermission.awardModify && (
              <PageHeader
                title="Awards and Nomination"
                navLinksRight={
                  <Link
                    className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg"
                    to="/app/createaward"
                    dangerouslySetInnerHTML={{
                      __html: svgIcons && svgIcons.plus,
                    }}
                  ></Link>
                }
                filter={
                  <Filter
                    config={HIDE_SHOW_FILTER_CONFIG}
                    onFilterChange={filterOnChangeHandler}
                  />
                }
              ></PageHeader>
            )}
          {!userRolePermission.awardCreate &&
            userRolePermission.awardModify && (
              <PageHeader
                title="Awards and Nomination"
                filter={
                  <Filter
                    config={HIDE_SHOW_FILTER_CONFIG}
                    onFilterChange={filterOnChangeHandler}
                  />
                }
                BulkAction={
                  <BulkAction
                    config={BULK_ACTION}
                    onClickCheckbox={enableFilterOptions}
                    onFilterChange={onBulkActionChangeHandler}
                    checkBoxInfo={enableBulkState}
                    bulkSubmitHandler={bulkSubmitHandler}
                  />
                }
              ></PageHeader>
            )}
          {userRolePermission.awardCreate && userRolePermission.awardModify && (
            <PageHeader
              title="Awards and Nomination"
              navLinksRight={
                <Link
                  className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg"
                  to="/app/createaward"
                  dangerouslySetInnerHTML={{
                    __html: svgIcons && svgIcons.plus,
                  }}
                ></Link>
              }
              filter={
                <Filter
                  config={HIDE_SHOW_FILTER_CONFIG}
                  onFilterChange={filterOnChangeHandler}
                />
              }
              BulkAction={
                <BulkAction
                  config={BULK_ACTION}
                  onClickCheckbox={enableFilterOptions}
                  onFilterChange={onBulkActionChangeHandler}
                  checkBoxInfo={enableBulkState}
                  bulkSubmitHandler={bulkSubmitHandler}
                />
              }
            ></PageHeader>
          )}
        </>
      ) : (
        <PageHeader title="Manage Awards"></PageHeader>
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
      {deletionState && (
        <StopAllotedAwardModal
          deleteMessage={{
            msg: 'Are you sure?',
            subMsg: 'Do you really want to delete this?',
          }}
          confirmState={confirmState}
        />
      )}
      <div
        className="py-1"
        style={{ position: 'relative' }}
      >
        <div className="tabSwitch">
          <button
            onClick={() => clickHandler('award_type')}
            className={tab === 'award_type' ? 'tabButtonActive' : 'tabButton'}
          >
            Award Types
          </button>
          <button
            onClick={() => clickHandler('nomi_award')}
            className={tab === 'nomi_award' ? 'tabButtonActive' : 'tabButton'}
          >
            Nomination Schedules
          </button>
          <button
            onClick={() => clickHandler('spot_award')}
            className={tab === 'spot_award' ? 'tabButtonActive' : 'tabButton'}
          >
            Spot
          </button>
        </div>

        <div className="award_manage_div">
          {tab === 'award_type' && (
            <div style={{ marginTop: '4.5rem' }}>
              <AssignAwards
                filterBy={filterBy}
                awardData={awardData}
                bulkUpdateBy={bulkUpdateBy}
                bulkUpdateState={enableBulkState}
                getSelectedAwards={getSelectedAwards}
                nominateTypeData={nominateTypeData}
              />
            </div>
          )}
          {tab === 'nomi_award' && !isLoading && (
            <div
              className="table-responsive eep_datatable_table_div"
              style={{ visibility: 'visible', overflowX: 'hidden' }}
            >
              <TableComponentServerSide
                data={awardManage ?? []}
                columns={manageNominationSchedulesTableHeaders}
                action={<ManageAwardActions triggerModal={triggerModal} />}
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
          )}

          {tab === 'spot_award' && !isLoading && (
            <div
              className="table-responsive eep_datatable_table_div"
              style={{ visibility: 'visible', overflowX: 'hidden' }}
            >
              <TableComponentServerSide
                data={awardManage ?? []}
                columns={manageSpotTableHeaders}
                action={<ManageAwardActions triggerModal={triggerModal} />}
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
          )}
        </div>

        {/* <div className="row award_manage_div" id="content-start">
          <div className="col-md-12">
            <ul className="nav nav-pills eep-nav-pills justify-content-end" id="pills-tab" role="tablist">
              <li className="nav-item" role="presentation">
                <a className="nav-link active c1" id="pills-nomination-schedule-tab" href="#pills-spot" role="tab" data-toggle="pill" aria-controls="pills-nomination-schedule" aria-selected="true" onClick={() => clickHandler("nomi_award")}>Nomination Schedules</a>
              </li>
              <li className="nav-item" role="presentation">
                <a className="nav-link c1" id="pills-spot-tab" href="#pills-nomination-schedule" role="tab" data-toggle="pill" aria-controls="pills-spot" aria-selected="false" onClick={() => clickHandler("spot_award")}>Spot</a>
              </li>
            </ul>
          </div>
          <div className="col-md-12 tab-content" id="pills-tabContent">
            <div className="tab-pane fade show active" id="pills-spot" role="tabpanel" aria-labelledby="pills-spot-tab">
              
             <div className="table-responsive eep_datatable_table_div" style={{ visibility: "visible", overflowX: "hidden" }}>

              <TableComponent
              data={awardManage ?? []}
              columns={manageNominationSchedulesTableHeaders}
              action={<ManageAwardActions triggerModal={triggerModal} />}
              />
              </div>
            </div>
            <div className="tab-pane fade" id="pills-nomination-schedule" role="tabpanel" aria-labelledby="pills-nomination-schedule-tab">
              
              <div className="table-responsive eep_datatable_table_div p-2 mt-3" style={{ visibility: "visible", overflowX: "hidden" }}>
              <TableComponent
              data={awardManage ?? []}
              columns={manageSpotTableHeaders}
              action={<ManageAwardActions triggerModal={triggerModal} />}
              />
              </div>
     
            </div>
          </div>
        </div> */}
      </div>
    </React.Fragment>
  );
};
export default ManageAwards;
