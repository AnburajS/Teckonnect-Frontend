// import { getRoles } from '@crayond_dev/idm-client';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import UserManagementActionDropdown from '../UI/CustomComponents/UserManagementActionDropdown';
import Filter from '../UI/Filter';
import PageHeader from '../UI/PageHeader';
import ResponseInfo from '../UI/ResponseInfo';
import TableComponent from '../UI/tableComponent';
import { URL_CONFIG } from '../constants/rest-config';
import { FILTER_CONFIG } from '../constants/ui-config';
import { downloadXlsx, getRolesInApp, pageLoaderHandler } from '../helpers';
import { httpHandler } from '../http/http-interceptor';
// import { idmRoleMappingRolesScreenAccess } from "../idm";
import CreateBulkUploadModal from '../modals/CreateBulkUserModal';
import { BreadCrumbActions } from '../store/breadcrumb-slice';
import { formatDates } from '../constants/utills';

const UserManagement = () => {
  const [isUpload, setIsUpload] = useState(true);
  const [userData, setUserData] = useState([]);
  const [data, setData] = useState({});
  const [state, setState] = useState({ uploadData: null });
  const [isLoading, setIsLoading] = useState(false);

  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission
  );

  const userDataTableHeaders = [
    {
      header: 'USER NAME',
      accessorKey: 'username',
    },
    {
      header: 'FIRST NAME',
      accessorKey: 'firstname',
    },
    {
      header: 'LAST NAME',
      accessorKey: 'lastname',
    },
    {
      header: 'DEPT',
      accessorKey: 'department.name',
    },
    {
      header: 'DESIG',
      accessorKey: 'designation',
    },
    {
      header: 'EMAIL',
      accessorKey: 'email',
    },
    {
      header: 'CONTACT',
      accessorKey: 'telephoneNumber',
    },
    {
      header: 'ROLE',
      accessorKey: 'role.roleName',
    },
    // {
    //   fieldLabel: null,
    //   fieldValue: "action",
    //   component: <UserManagementActionDropdown />,
    // },
  ];

  const dispatch = useDispatch();
  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'Admin Panel',
      link: 'app/adminpanel',
    },
    {
      label: 'User Management',
      link: '',
    },
  ];

  const fetchUserData = (arg) => {
    setIsLoading(true);

    const obj = {
      url: URL_CONFIG.GETALLUSERS,
      method: 'get',
      params: {
        active: arg.filterValue,
      },
    };
    httpHandler(obj)
      .then((userData) => {
        setUserData(
          userData?.data?.map((v) => {
            return { ...v, name: v?.username };
          })
        );
        setIsLoading(false);
      })
      .catch((error) => {
        //const errMsg = error.response?.data?.message;
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const obj = { filterValue: true };
    fetchUserData(obj);
    pageLoaderHandler(isLoading ? 'show' : 'hide');
  }, []);

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'User Management',
      })
    );
  }, [breadcrumbArr, dispatch]);

  const filterOnChangeHandler = (arg) => {
    fetchUserData({ filterValue: arg.value });
  };

  const userBulkDataTableHeaders = [
    {
      header: 'Username',
      accessorKey: 'Username',
    },
    {
      header: 'First Name',
      accessorKey: 'Firstname',
    },
    {
      header: 'Last Name',
      accessorKey: 'Lastname',
    },
    {
      header: 'Email',
      accessorKey: 'Email',
    },
    {
      header: 'DOJ',
      accessorKey: 'DOJ',
    },
    {
      header: 'DOB',
      accessorKey: 'DOB',
    },
    {
      header: 'Designation',
      accessorKey: 'Designation',
    },
    {
      header: 'Contact',
      accessorKey: 'ContactNumber',
    },
    {
      header: 'Department',
      accessorKey: 'Department',
    },
    {
      header: 'Country',
      accessorKey: 'Country',
    },
    {
      header: 'Branch',
      accessorKey: 'Branch',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      Cell: ({ cell, column }) => (
        <span
          style={{
            color:
              cell.getValue()?.toLowerCase() === 'failure' ? 'red' : 'green',
          }}
        >
          {cell.getValue()}
        </span>
      ),
    },
    {
      header: 'Message',
      accessorKey: 'message',
      Cell: ({ cell, column }) => (
        <span
          style={{
            color: 'red',
          }}
        >
          {cell.getValue()}
        </span>
      ),
    },
  ];

  const handleChange = (e) => {
    setState({
      ...state,
      uploadData: e.target.files[0],
    });
  };

  const onSucess = (e) => {
    const file = state.uploadData;
    const reader = new FileReader();

    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const excelJson = JSON.parse(JSON.stringify(json, null, 2));
      const headers = excelJson[0];
      const dataArray = excelJson.slice(1);
      //const roles = await getRoles({ apiKey: "ASC4PK0UVE5OOCO8NK" });
      const roles = await getRolesInApp(1);

      const payloadConstruction = dataArray
        .map((row) => {
          if (row?.length > 0) {
            const obj = {};
            headers.forEach((header, index) => {
              obj[header] = row[index];
            });
            return obj;
          }
        })
        ?.filter((v) => v);

      // const payload = await payloadConstruction?.map(async (v) => {
      //   const imd_role = roles?.find(c => c?.name?.toLowerCase() === v?.role?.toLowerCase())

      //   const roleData = await idmRoleMappingRoles(imd_role?.id);
      //   v.role = {
      //     idm_id: imd_role?.id,
      //     role_name: imd_role?.name,
      //     screen: JSON.stringify(roleData?.data)
      //   };
      //   // v.role = imd_role || ''
      //   return { ...v }
      // })

      const payload = [];
      for (const v of payloadConstruction) {
        if (v?.['DOB(dd/mm/yyyy)']) {
          v.DOB = v?.['DOB(dd/mm/yyyy)'] ?? null;
          delete v?.['DOB(dd/mm/yyyy)'];
        }
        if (v?.['DOJ(dd/mm/yyyy)']) {
          v.DOJ = v?.['DOJ(dd/mm/yyyy)'] ?? null;
          delete v?.['DOJ(dd/mm/yyyy)'];
        }
        const imd_role = roles?.find(
          (c) => c?.role_name?.toLowerCase() === v?.Role?.toLowerCase()
        );

        v.role_id = imd_role?.id;

        // const roleData = await idmRoleMappingRolesScreenAccess(imd_role?.role_permission_mappings?.[0]?.permission?.data?.data ?? []);
        // v.role = {
        //   idm_id: imd_role?.id,
        //   role_name: imd_role?.name,
        //   screen: JSON.stringify(roleData?.data)
        // };

        payload.push({ ...v });
      }

      if (payload?.length > 0) {
        const obj_ = {
          url: URL_CONFIG.UPSERT_BULK_USER,
          method: 'post',
          payload: {
            data: payload ?? [],
          },
        };
        httpHandler(obj_)
          .then((response) => {
            setData({ ...(response?.data?.data ?? {}) });
            setIsUpload(false);
          })
          .catch((error) => console.log(error));
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const openBulk = () => {
    setIsUpload(true);
  };

  const downloadExcel = (failure) => {
    const worksheet = XLSX.utils.json_to_sheet(
      failure?.map((v) => {
        return {
          ...v,
          role: v?.role?.role_name || v?.role || '',
        };
      })
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'FailureUsers.xlsx');
  };

  const handleExportDownload = () => {
    let xlData = userData?.map((v) => {
      return {
        Id: v?.id,
        'User Name': v?.username ?? '',
        'First Name': v?.firstname ?? '',
        'Last Name': v?.lastname ?? '',
        Gender: v?.gender?.label ?? '',
        Designation: v?.designation ?? '',
        'Department Name': v?.department?.name,
        'Manager Name': v?.managerName ?? '',
        // 'Manager Name': v?.department?.name,
        'Email Id': v?.email ?? '',
        'Contact Number': v?.telephoneNumber ?? '',
        'Date Of Birth': v?.dateOfBirth ? formatDates(v?.dateOfBirth) : '',
        'Date Of Join': v?.dateOfJoining ? formatDates(v?.dateOfJoining) : '',
        'Role Name': v?.role?.roleName ?? '',
        'Country Name': v?.country?.label ?? '',
        'Branch Name': v?.branch?.label ?? '',
      };
    });
    downloadXlsx('UserManagements.xlsx', xlData);
  };

  return (
    <React.Fragment>
      {userRolePermission?.adminPanel && (
        <CreateBulkUploadModal
          data={
            data?.allData?.map((v) => {
              return { ...v, manager: v?.isdefault ? 0 : 1 };
            }) ?? []
          }
          failureData={data?.failureData ?? []}
          userBulkDataTableHeaders={userBulkDataTableHeaders}
          // isUpload={false}
          isUpload={isUpload}
          downloadExcel={downloadExcel}
          url={process.env.PUBLIC_URL + `/data/SampleUsers.xlsx`}
          // url={'https://objectstore.e2enetworks.net/enliteu/Bulk_user_upload_template.xlsx'}
          //url={'https://webstorageenliteu.blob.core.windows.net/enliteu-web/Bulk-User-Upload-Sample-Template.xlsx'}
          // url={'https://enliteu.objectstore.e2enetworks.net/Bulk%20user%20upload%20Template.xlsx'}
          onSucess={onSucess}
          fileName={state?.uploadData?.name ?? ''}
          handleChange={handleChange}
        />
      )}

      {userRolePermission?.adminPanel && (
        <React.Fragment>
          <PageHeader
            title="User Management"
            navLinksRight={
              <Link
                className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg"
                to="/app/newUser"
                dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.plus }}
              ></Link>
            }
            filter={
              <>
                <a
                  className="eep-btn eep-btn-success eep-btn-xsml add_bulk_upload_button c1"
                  data-toggle="modal"
                  data-target="#CreateBulkUploadModal"
                  onClick={openBulk}
                  style={{ color: '#fff' }}
                >
                  {' '}
                  <img
                    style={{ width: '20px', marginTop: '-4px' }}
                    src={'/images/Group 106594.svg'}
                  />{' '}
                  Add Bulk Users
                </a>
                <Filter
                  config={FILTER_CONFIG}
                  onFilterChange={filterOnChangeHandler}
                />
              </>
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
                {/* {userData && (
                  <Table
                    component="userManagement"
                    headers={userDataTableHeaders}
                    data={userData}
                    tableProps={{
                      classes: "table stripe eep_datatable_table eep_datatable_table_spacer dataTable no-footer",
                      id: "user_dataTable",
                      "aria-describedby": "user_dataTable_info",
                    }}
                    action={null}
                  ></Table>
                )} */}

                {!isLoading && (
                  <div style={{ position: 'relative' }}>
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
                      columns={userDataTableHeaders}
                      // actionFixed={fal}
                      action={<UserManagementActionDropdown />}
                    />
                  </div>
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
};
export default UserManagement;
