import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import ApprovalActions from '../../UI/CustomComponents/ApprovalActions';
import ApprovalStatus from '../../UI/CustomComponents/ApprovalStatus';
import DateFormatDisplay from '../../UI/CustomComponents/DateFormatDisplay';
import Filter from '../../UI/Filter';
import PageHeader from '../../UI/PageHeader';
import Table from '../../UI/Table';
import { URL_CONFIG } from '../../constants/rest-config';
import { FILTER_LIST_CONFIG } from '../../constants/ui-config';
import { httpHandler } from '../../http/http-interceptor';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import TableComponent from '../../UI/tableComponent';
import moment from 'moment';
import { pageLoaderHandler } from '../../helpers';
import { formatDates } from '../../constants/utills';
import TableComponentServerSide from '../../UI/TableComponentServerSide';

function AwardApprovalList({ filter }) {
  const [awardApproval, setAwardApproval] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [total, setTotal] = useState(0);
  const [filtered, setFilter] = useState({
    filterValue: { label: 'Pending', value: false },
  });

  const [pageIndex, setPageIndex] = useState(0); // 0-based
  const [pageSize, setPageSize] = useState(10);
  const cSettings = {
    createdAt: {
      classnames: '',
      objReference: 'createdAt',
    },
  };

  const awardApprovalTableHeaders = [
    {
      header: 'Award Name',
      accessorKey: 'award.name',
    },
    {
      header: 'Team',
      accessorKey: 'judgeId.department.name',
    },
    {
      header: 'Nominees',
      accessorKey: 'nominations.length',
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
      header: 'Status',
      accessorKey: 'updatedAt',
      accessorFn: (row) => <ApprovalStatus data={row} />,
      // component: <ApprovalStatus />,
    },
    // {
    //   header: "Action",
    //   accessorKey: "action",
    //   component: <ApprovalActions isApprovalState={true} isView={false} />,
    // },
  ];

  const filterNominatedData = (data) => {
    console.log(data);
    return data.filter((item) => item.nominated === true);
  };

  const fetchAwardApprovalData = (arg = {}) => {
    setIsLoading(true);
    const queryParams = {
      direction: 'desc',
      limit: pageSize,
      offset: pageIndex + 1, // API is 1-based
      rec: arg.filterValue.value,
    };
    const obj = {
      url: URL_CONFIG.MY_APPROVALS,
      method: 'get',
      params: queryParams,
    };

    httpHandler(obj)
      .then((awardApproval) => {
        setTotal(awardApproval?.data?.totalCount);
        setAwardApproval(awardApproval?.data?.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchAwardApprovalData(filtered);

    pageLoaderHandler(isLoading ? 'show' : 'hide');
  }, [pageIndex, pageSize, filtered]);
  const dispatch = useDispatch();

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
      link: '',
    },
    // {
    //   label: "Awards and Approvals",
    //   link: "",
    // },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Awards and Approvals',
      })
    );
  }, [breadcrumbArr, dispatch]);
  useEffect(() => {
    if (filter) {
      filterOnChangeHandler(filter);
    }
  }, [filter]);
  const filterOnChangeHandler = (arg) => {
    setFilter({ filterValue: arg });
    setPageIndex(0);
    setPageSize(10);
  };

  return (
    <React.Fragment>
      {/* <PageHeader
        title="Award and Approvals"
        filter={
          <Filter
            config={FILTER_LIST_CONFIG}
            onFilterChange={filterOnChangeHandler}
          />
        }
      ></PageHeader> */}

      <div
        className="eep-user-management eepcontent-start"
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
            {/* // <Table
              //   component="userManagement"
              //   headers={awardApprovalTableHeaders}
              //   data={awardApproval}
              //   tableProps={{
              //     classes:
              //       "table stripe eep_datatable_table eep_datatable_table_spacer dataTable no-footer",
              //     id: "user_dataTable",
              //     "aria-describedby": "user_dataTable_info",
              //   }}
              //   action={null}
              // ></Table> */}
            {console.log('awardApproval', awardApproval)}
            {!isLoading && (
              <TableComponentServerSide
                data={awardApproval ?? []}
                columns={awardApprovalTableHeaders}
                action={
                  <ApprovalActions
                    isApprovalState={true}
                    isView={false}
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
    </React.Fragment>
  );
}
export default AwardApprovalList;
