import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DeptMasterActions from '../UI/CustomComponents/DeptMasterActions';
import Filter from '../UI/Filter';
import PageHeader from '../UI/PageHeader';
import ResponseInfo from '../UI/ResponseInfo';
import TableComponent from '../UI/tableComponent';
import { URL_CONFIG } from '../constants/rest-config';
import { FILTER_CONFIG } from '../constants/ui-config';
import { downloadXlsx, pageLoaderHandler } from '../helpers';
import { httpHandler } from '../http/http-interceptor';
import CreateDepartmentModal from '../modals/CreateDepartmentModal';
import DeptActionsModal from '../modals/DeptActionsModal';
import { BreadCrumbActions } from '../store/breadcrumb-slice';
import { formatDates } from '../constants/utills';

function ListDepartments() {
  const [userData, setUserData] = useState([]);
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission
  );
  const [deptData, setDeptData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const getDeptData = (argu) => {
    setDeptData(argu);
  };

  const tableSettings = {
    createdAt: {
      classnames: '',
      objReference: 'createdAt',
    },
    updatedAt: {
      classnames: '',
      objReference: 'updatedAt',
    },
  };

  const userDataTableHeaders = [
    {
      header: 'Department Name',
      accessorKey: 'name',
    },
    {
      header: 'Created By',
      accessorKey: 'createdBy.username',
      accessorFn: (row) =>
        row?.createdBy?.username ? row?.createdBy?.username : '--',
    },
    {
      header: 'Created On',
      accessorKey: 'createdAt',
      // accessorFn: (row) => (row?.createdAt ? formatDates(row.createdAt) : '--'),
      Cell: ({ cell }) => {
        const rawDate = cell.getValue();
        return rawDate ? formatDates(rawDate) : '--'; // Use your existing function
      },
    },
    {
      header: 'Updated By',
      accessorKey: 'updatedBy.username',
      accessorFn: (row) =>
        row?.updatedBy?.username ? row?.updatedBy?.username : '--',
    },
    {
      header: 'Updated On',
      accessorKey: 'updatedAt',
      // accessorFn: (row) => (row?.updatedAt ? formatDates(row.updatedAt) : '--'),
      Cell: ({ cell }) => {
        const rawDate = cell.getValue();
        return rawDate ? formatDates(rawDate) : '--'; // Use your existing function
      },
    },
  ];

  const fetchDepartmentData = async (arg = {}) => {
    setIsLoading(true);
    const obj = {
      url: URL_CONFIG.ALLDEPARTMENTS,
      method: 'get',
    };

    if (
      arg.filterValue &&
      Object.keys(arg.filterValue).length &&
      arg.filterValue.value !== ''
    ) {
      obj['params'] = {
        active: arg.filterValue.value,
      };
    }
    await httpHandler(obj)
      .then((userData) => {
        const getData = userData?.data.map((item) => ({
          ...item,
          createdAt: moment(item.createdAt).format('MM/DD/YYYY'),
          updatedAt: moment(item.updatedAt).format('MM/DD/YYYY'),
        }));
        setUserData(getData);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const obj = {
      filterValue: { label: 'Active', value: true },
    };
    fetchDepartmentData(obj);
    pageLoaderHandler(isLoading ? 'show' : 'hide');
  }, []);

  const dispatch = useDispatch();
  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'dashboard',
    },
    {
      label: 'Admin Panel',
      link: 'app/adminpanel',
    },
    {
      label: 'Department Master',
      link: '',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Department Master',
      })
    );
  }, [breadcrumbArr, dispatch]);

  const filterOnChangeHandler = (arg) => {
    fetchDepartmentData({ filterValue: arg });
  };

  const handleExportDownload = () => {
    let xlData = userData?.map((v) => {
      return {
        Id: v?.id,
        Name: v?.name,
        'Created By': v?.createdBy?.username,
        'Created On': v?.createdAt,
        'Updated By': v?.updatedBy?.username,
        'Updated On': v?.updatedAt,
      };
    });
    downloadXlsx('DepartmentMasters.xlsx', xlData);
  };

  return (
    <React.Fragment>
      {userRolePermission?.adminPanel && (
        <React.Fragment>
          <CreateDepartmentModal fetchDeptData={fetchDepartmentData} />
          {deptData && Object.keys(deptData).length > 0 && (
            <DeptActionsModal
              viewDepartment={deptData}
              fetchDeptData={fetchDepartmentData}
            />
          )}
          <PageHeader
            title="Department Masters"
            navLinksRight={
              <a
                className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg c1"
                data-toggle="modal"
                data-target="#CreateDepartmentModal"
                dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.plus }}
              ></a>
            }
            filter={
              <Filter
                config={FILTER_CONFIG}
                onFilterChange={filterOnChangeHandler}
              />
            }
          ></PageHeader>

          <div
            className="eep-user-management eep-content-start"
            id="content-start"
          >
            <div
              className="table-responsive eep_datatable_table_div"
              style={{ visibility: 'visible' }}
            >
              <div
                id="user_dataTable_wrapper"
                className="dataTables_wrapper dt-bootstrap4 no-footer"
                style={{ width: '100%' }}
              >
                {!isLoading && (
                  <>
                    <button
                      className="btn btn-secondary"
                      aria-controls="user_dataTable"
                      type="button"
                      style={{
                        position: 'absolute',
                        zIndex: '9',
                        right: '18px',
                        margin: ' 8px 0px',
                      }}
                      onClick={() => handleExportDownload()}
                    >
                      <span>Excel</span>
                    </button>
                    <TableComponent
                      data={userData ?? []}
                      // noDataFound={userData?.length > 0 ? false : true}
                      columns={userDataTableHeaders}
                      action={<DeptMasterActions getDeptData={getDeptData} />}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
      {!userRolePermission?.adminPanel && (
        <div className="row eep-content-section-data no-gutters">
          <ResponseInfo
            title="Oops! Looks illegal way."
            responseImg="accessDenied"
            responseClass="response-info"
            messageInfo="Contact Administrator."
          />
        </div>
      )}
    </React.Fragment>
  );
}
export default ListDepartments;
