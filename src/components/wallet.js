import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ResponseInfo from '../UI/ResponseInfo';
import TableComponent from '../UI/tableComponent';
import { URL_CONFIG } from '../constants/rest-config';
import { downloadXlsx, pageLoaderHandler } from '../helpers';
import { httpHandler } from '../http/http-interceptor';
import { BreadCrumbActions } from '../store/breadcrumb-slice';
import { TabsActions } from '../store/tabs-slice';
import WalletComponent from './walletComponent';
import WalletBalance from './walletBalance';

const Wallet = () => {
  const dispatch = useDispatch();
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission
  );
  const activeTab = useSelector((state) => state.tabs.activeTab);
  const [isLoading, setIsLoading] = useState(false);

  const [wallet, setWallet] = useState([]);
  const [state, setState] = useState({
    points: {},
  });

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
      label: 'Wallet Configuration',
      link: '',
    },
  ];

  const tabConfig = [
    {
      title: 'Wallet Configuration',
      id: 'wallet',
    },
    {
      title: 'Wallet Balance',
      id: 'walletBalance',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Wallet',
      })
    );
  }, [breadcrumbArr, dispatch]);

  const fetchWallet = () => {
    setIsLoading(true);

    const obj = {
      url: URL_CONFIG.GET_POINTS_CONFIG,
      method: 'get',
    };
    httpHandler(obj)
      .then((response) => {
        setWallet(response?.data?.data ?? []);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

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
    await getPointsValue();
    await fetchWallet();
  };

  useEffect(() => {
    fetchWallet();
    getPointsValue();
    pageLoaderHandler(isLoading ? 'show' : 'hide');
  }, []);

  useEffect(() => {
    dispatch(
      TabsActions.updateTabsconfig({
        config: tabConfig,
      })
    );
    return () => {
      dispatch(
        TabsActions.updateTabsconfig({
          config: [],
        })
      );
    };
  }, [userRolePermission]);

  const getPointsValue = async () => {
    const obj = {
      url: URL_CONFIG.GET_POINTS_VALUE,
      method: 'get',
    };
    const data = await httpHandler(obj);
    state['points'] = data?.data?.data ?? {};
    setState({ ...state });
  };

  const walletTableHeaders = [
    {
      header: 'Country',
      accessorKey: 'country_name',
    },
    {
      header: 'Branch',
      accessorKey: 'branch_name',
    },
    {
      header: 'Available Points',
      accessorKey: 'available_value',
      accessorFn: (row) => (
        <div
          style={{
            color:
              parseInt(row?.optimal_value) > parseInt(row?.allocated_value) &&
              'red',
          }}
        >
          {row?.available_value ?? '0'}
        </div>
      ),
    },
    {
      header: 'Optimal Value',
      accessorKey: 'optimal_value',
      accessorFn: (row) => (
        <WalletComponent
          state={state}
          inputkey={'optimal_value'}
          row={row}
          addWalletPoints={addWalletPoints}
        />
      ),
    },
    {
      header: 'Allocated Value',
      accessorKey: 'allocated_value',
      accessorFn: (row) => (
        <WalletComponent
          state={state}
          inputkey={'allocated_value'}
          row={row}
          addWalletPoints={addWalletPoints}
        />
      ),
    },
  ];

  const handleExportDownload = () => {
    let xlData = wallet?.map((v) => {
      return {
        Country: v?.country_name,
        Branch: v?.branch_name,
        ['Available Points']: v?.available_value,
        ['Optimal Value']: v?.optimal_value,
        ['Allocated Value']: v?.allocated_value,
      };
    });
    downloadXlsx('Wallet.xlsx', xlData);
  };

  return (
    <React.Fragment>
      {activeTab &&
        activeTab?.id === 'wallet' &&
        userRolePermission?.adminPanel &&
        !isLoading && (
          <React.Fragment>
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
              data={wallet ?? []}
              columns={walletTableHeaders}
              actionHidden={true}
            />
          </React.Fragment>
        )}

      {activeTab &&
        activeTab?.id === 'walletBalance' &&
        userRolePermission?.adminPanel && (
          <React.Fragment>
            <WalletBalance />
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
export default Wallet;
