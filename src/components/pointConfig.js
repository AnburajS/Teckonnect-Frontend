import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ResponseInfo from '../UI/ResponseInfo';
import TableComponent from '../UI/tableComponent';
import { URL_CONFIG } from '../constants/rest-config';
import { downloadXlsx, pageLoaderHandler } from '../helpers';
import { httpHandler } from '../http/http-interceptor';
import { BreadCrumbActions } from '../store/breadcrumb-slice';
import WalletComponent from './walletComponent';

const PointsConfig = () => {
  const dispatch = useDispatch();
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission
  );
  const [isLoading, setIsLoading] = useState(false);

  const [pointsConfig, setPointsConfig] = useState([]);

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
      label: 'points Configuration',
      link: '',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'pointsConfig',
      })
    );
  }, [breadcrumbArr, dispatch]);

  const fetchpointsConfig = () => {
    setIsLoading(true);

    const obj = {
      url: URL_CONFIG.GET_POINTS_CONFIG,
      method: 'get',
    };
    httpHandler(obj)
      .then((response) => {
        let uniqueCountriesMap = new Map();
        let filteredData = [];
        response?.data?.data?.forEach((entry) => {
          const countryId = entry?.country_id;
          if (!uniqueCountriesMap.has(countryId)) {
            uniqueCountriesMap.set(countryId, true);
            filteredData.push(entry);
          }
        });
        setPointsConfig(filteredData ?? []);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchpointsConfig();
    pageLoaderHandler(isLoading ? 'show' : 'hide');
  }, []);

  const pointsConfigTableHeaders = [
    {
      header: 'Country',
      accessorKey: 'country_name',
    },
    {
      header: 'Currency',
      accessorKey: 'country_symbol',
    },
    {
      header: 'Unit Value',
      accessorKey: 'value_peer_points',
      accessorFn: (row) => (
        <WalletComponent
          inputkey={'value_peer_points'}
          row={row}
          addWalletPoints={addWalletPoints}
        />
      ),
    },
  ];

  const addWalletPoints = async (point, data) => {
    const obj = {
      url: URL_CONFIG.ADD_POINTS_CONFIG,
      method: 'post',
      payload: {
        ...point,
        id: data?.id,
      },
    };
    await httpHandler(obj);
    await fetchpointsConfig();
  };

  const handleExportDownload = () => {
    let xlData = pointsConfig?.map((v) => {
      return {
        Country: v?.country_name,
        Currency: v?.country_symbol,
        ['Value Per Point']: v?.value_peer_points,
      };
    });
    downloadXlsx('PointsConfig.xlsx', xlData);
  };

  return (
    <React.Fragment>
      {userRolePermission?.adminPanel && !isLoading && (
        <>
          {/* <PageHeader title="Points Configuration" /> */}
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
            data={pointsConfig ?? []}
            columns={pointsConfigTableHeaders}
            actionHidden={true}
          />
        </>
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
export default PointsConfig;
