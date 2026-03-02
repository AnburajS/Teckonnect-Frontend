import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import * as XLSX from 'xlsx';
import PageHeader from '../UI/PageHeader';
import FlowDiagram from '../components/ReactFlow/index';
import { URL_CONFIG } from '../constants/rest-config';
import { httpHandler } from '../http/http-interceptor';
import CreateBulkUploadModal from '../modals/CreateBulkUserModal';
import { BreadCrumbActions } from '../store/breadcrumb-slice';

const BulkUploadOrgChart = () => {
  const user_details = sessionStorage.getItem('userData');
  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission
  );
  const dispatch = useDispatch();
  const [isUpload, setIsUpload] = useState(true);
  const [data, setData] = useState({});
  const [state, setState] = useState({
    userData: [],
    selectUser: null,
    chartData: null,
    uploadData: null,
    orgChartData: null,
  });

  const onChange = (k, event) => {
    setState({
      ...state,
      [k]: event,
    });
  };

  const openBulk = () => {
    setIsUpload(true);
  };

  const handleChange = (e) => {
    setState({
      ...state,
      uploadData: e.target.files[0],
    });
  };

  const onSucess = (e) => {
    const file = state.uploadData;
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const excelJson = JSON.parse(JSON.stringify(json, null, 2));
      const headers = excelJson[0];
      const dataArray = excelJson.slice(1);
      const payload = dataArray
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

      if (payload?.length > 0) {
        const obj_ = {
          url: URL_CONFIG.UPSERT_BULK_ORG,
          method: 'post',
          payload: {
            data: payload ?? [],
          },
        };
        httpHandler(obj_)
          .then((response) => {
            setData({ ...(response?.data?.data ?? {}) });
            setIsUpload(false);
            fetchUserData();
          })
          .catch((error) => console.log(error));
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'ORG CHART',
      link: 'app/orgChart',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Users',
      })
    );
  }, [breadcrumbArr, dispatch]);

  const downloadExcel = (failure) => {
    const worksheet = XLSX.utils.json_to_sheet(failure);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'FailureUsers.xlsx');
  };

  const userBulkDataTableHeaders = [
    {
      header: 'fullName',
      accessorKey: 'Username',
    },
    {
      header: 'Reportung To',
      accessorKey: 'ReportingTo',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      Cell: ({ cell }) => (
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
      Cell: ({ cell }) => (
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

  const fetchUserData = async (arg) => {
    const obj = {
      url: URL_CONFIG.GETALLUSERS,
      method: 'get',
    };
    await httpHandler(obj)
      .then(async (userData) => {
        const res = await chartData(userData?.data, userData?.data);
        setState({
          ...state,
          chartData: res ?? [],
          userData: userData?.data?.map((v) => {
            return {
              //...v,
              id: v?.id,
              value: v?.role?.roleName,
              profile_pic: v?.imageByte?.image,
              label: v?.fullName,
            };
          }),
        });
      })
      .catch((error) => {});
  };

  const getOrg = async () => {
    await fetchOrgData();
    await fetchUserData();
  };

  useEffect(() => {
    getOrg();
  }, []);

  const fetchOrgData = async () => {
    const obj = {
      url: URL_CONFIG.EXPORT_BULK_ORG,
      method: 'post',
    };
    await httpHandler(obj)
      .then(async (exportData) => {
        state.orgChartData = exportData?.data?.data ?? {};
        setState({
          ...state,
        });
      })
      .catch((error) => {});
  };

  const chartDataChildData = (allData, v) => {
    const child = allData?.filter((c) => c?.manager === v?.id);
    return child;
  };

  const chartData = (allData, data) => {
    let initialEdges = [];
    const edgeType = 'step';
    const animated = false;
    const position = { x: 0, y: 0 };
    const initialNodes = data?.map((v) => {
      allData?.map((c) => {
        if (c?.manager === v?.id) {
          return initialEdges.push({
            id: 'e' + v?.id + c?.id,
            source: JSON.stringify(v?.id),
            target: JSON.stringify(c?.id),
            type: edgeType,
            animated,
            markerEnd: {
              type: 'arrow',
            },
          });
        }
      });
      return {
        id: JSON.stringify(v?.id),
        position,
        type: 'cutom',
        data: {
          id: JSON.stringify(v?.id),
          manager: v?.manager,
          user_id: v?.id,
          user_node_id: v?.fullName ?? '',
          icon: v?.imageByte?.image ?? '',
          title: v?.fullName ?? '',
          subline: `${
            (v?.role?.roleName ? v?.role?.roleName + ' ● ' : '') ?? ''
          }${v?.designation ?? ''}`,
          email: v?.email ? ' ● ' + v?.email : '',
          country_name: v?.country?.label ?? '',
          country_logo: v?.country?.flag ?? '',
          branch: v?.branch?.label ?? '',
          isloggedUser: v?.user_id === JSON.parse(user_details)?.id,
          color: !v?.active
            ? '#ff572221'
            : v?.user_id === JSON.parse(user_details)?.id
            ? '#607d8b8a'
            : '',
          background: !v?.active
            ? '#ff572221'
            : v?.user_id === JSON.parse(user_details)?.id
            ? '#E2EDF3'
            : '',
          children: chartDataChildData(allData, v),
          active: v?.active,
        },
      };
    });
    return { initialNodes, initialEdges };
  };

  const CustomOption = ({ innerProps, label, value, data }) => {
    return (
      <div
        {...innerProps}
        className="orgUpload_User_List"
      >
        <div>
          <img
            className="img"
            src={
              data?.profile_pic ??
              `${process.env.PUBLIC_URL}/images/user_profile.png`
            }
          />
        </div>
        <div>
          <div className="title">{label}</div>
          <span className="dis"> {value}</span>
        </div>
      </div>
    );
  };

  const handleExportDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(state?.orgChartData?.data ?? []);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'export.xlsx');
  };

  return (
    <React.Fragment>
      <CreateBulkUploadModal
        title={'Org Bulk Upload'}
        data={data?.allData}
        failureData={data?.failureData ?? []}
        userBulkDataTableHeaders={userBulkDataTableHeaders}
        // isUpload={false}
        isUpload={isUpload}
        downloadExcel={downloadExcel}
        url={process.env.PUBLIC_URL + `/data/SampleUsers.xlsx`}
        //url_old={'https://enliteutestingdiag.blob.core.windows.net/enliteu-testing-container/Bulk-User-Upload-Template.xlsx'}
        isOrg={state?.orgChartData}
        onSucess={onSucess}
        fileName={state?.uploadData?.name ?? ''}
        handleChange={handleChange}
        handleExportDownload={handleExportDownload}
      />

      <PageHeader
        // title="Org Chart"
        hiddenDivider={true}
        filter={
          <div className="d-flex align-items-center align-content-center">
            {userRolePermission?.adminPanel && (
              <a
                style={{
                  marginBottom: 14,
                  marginRight: 10,
                  color: '#fff',
                }}
                className="eep-btn eep-btn-success eep-btn-xsml add_bulk_upload_button c1"
                data-toggle="modal"
                data-target="#CreateBulkUploadModal"
                onClick={openBulk}
              >
                {' '}
                <img
                  style={{ width: '18px', marginTop: '-2px' }}
                  src={'/images/Group 106594.svg'}
                />{' '}
                <span
                  style={{
                    fontSize: 11,
                  }}
                >
                  Bulk Upload
                </span>
              </a>
            )}
            <div
              className="form-group field-wbr"
              style={{ width: '280px' }}
            >
              <Select
                options={
                  !state?.orgChartData?.newUsers && (state?.userData ?? [])
                }
                components={{ Option: CustomOption }}
                classNamePrefix="eep_select_common select"
                className={`a_designation basic-single`}
                placeholder="search..."
                onChange={(e) => onChange('selectUser', e?.id)}
              />
            </div>
          </div>
        }
      ></PageHeader>
      {state?.orgChartData?.newUsers && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            right: '46%',
            fontSize: '16px',
          }}
        >
          Start building
        </div>
      )}

      {!state?.orgChartData?.newUsers &&
        state?.chartData?.initialNodes?.length > 0 &&
        state?.chartData?.initialEdges?.length > 0 && (
          <FlowDiagram
            selectUser={state?.selectUser}
            chartData={state?.chartData ?? {}}
          />
        )}
    </React.Fragment>
  );
};
export default BulkUploadOrgChart;
