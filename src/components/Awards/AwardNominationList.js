import React, { useEffect, useState } from 'react';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import { useDispatch, useSelector } from 'react-redux';
import PageHeader from '../../UI/PageHeader';
import Table from '../../UI/Table';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';
import { FILTER_LIST_NOMINATE_CONFIG } from '../../constants/ui-config';
import ApprovalActions from '../../UI/CustomComponents/ApprovalActions';
import NominationStatus from '../../UI/CustomComponents/NominationStatus';
import Filter from '../../UI/Filter';
import DateFormatDisplay from '../../UI/CustomComponents/DateFormatDisplay';
import TableComponent from '../../UI/tableComponent';
import moment from 'moment';
import { pageLoaderHandler } from '../../helpers';
import { formatDates } from '../../constants/utills';
import TableComponentServerSide from '../../UI/TableComponentServerSide';

function AwardNominationList({ filter }) {
  const [awardNomination, setAwardNomination] = useState([]);
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

  const awardNominationTableHeaders = [
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
      // accessorFn: (row) => (row.createdAt ? formatDates(row.createdAt) : '--'),
      Cell: ({ cell }) => {
        const rawDate = cell.getValue();
        return rawDate ? formatDates(rawDate) : '--'; // Use your existing function
      },
    },
    {
      header: 'Status',
      accessorKey: 'action',
      accessorFn: (row) => <NominationStatus data={row} />,
    },
  ];

  const fetchAwardNominationData = (arg = {}) => {
    setIsLoading(true);
    const queryParams = {
      direction: 'desc',
      limit: pageSize,
      offset: pageIndex + 1, // API is 1-based
      rec: arg.filterValue.value,
    };
    const obj = {
      url: URL_CONFIG.MY_NOMINATIONS,
      method: 'get',
      params: queryParams,
    };

    httpHandler(obj)
      .then((awardNomination) => {
        setTotal(awardNomination?.data?.totalCount);
        setAwardNomination(awardNomination.data?.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);

        //const errMsg = error.response?.data?.message;
      });
  };

  useEffect(() => {
    fetchAwardNominationData(filtered);
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
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  }, []);

  const filterOnChangeHandler = (arg) => {
    setFilter({ filterValue: arg });
    setPageIndex(0);
    setPageSize(10);
  };
  useEffect(() => {
    if (filter) {
      filterOnChangeHandler(filter);
    }
  }, [filter]);
  return (
    <React.Fragment>
      {/* <PageHeader
        title="Awards and Nominated"
        filter={
          <Filter
            config={FILTER_LIST_NOMINATE_CONFIG}
            onFilterChange={filterOnChangeHandler}
          />
        }
      ></PageHeader> */}

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
            {/* {awardNomination && ( */}

            {!isLoading && (
              <TableComponentServerSide
                data={awardNomination ?? []}
                columns={awardNominationTableHeaders}
                action={
                  <ApprovalActions
                    isApprovalState={false}
                    isView={true}
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
            {/* )} */}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
export default AwardNominationList;
