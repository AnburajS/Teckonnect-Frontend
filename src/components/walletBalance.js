import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { URL_CONFIG } from '../constants/rest-config';
import { httpHandler } from '../http/http-interceptor';
import { BreadCrumbActions } from '../store/breadcrumb-slice';
import { pageLoaderHandler } from '../helpers';
import classes from '../styles/lib/wallet-balance.scss';

const WalletBalance = () => {
  console.log('classes', classes);
  const dispatch = useDispatch();
  const [balanceData, setBalanceData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const breadcrumbArr = [
    { label: 'Home', link: 'app/dashboard' },
    { label: 'Admin Panel', link: 'app/adminpanel' },
    { label: 'Wallet Balance', link: '' },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Wallet',
      })
    );
  }, [breadcrumbArr, dispatch]);

  const fetchYGGAccount = () => {
    setIsLoading(true);

    const obj = {
      url: URL_CONFIG.YGG_Account,
      method: 'get',
    };

    httpHandler(obj)
      .then((response) => {
        console.log('fetchYGGAccount Response', response);
        setBalanceData(response?.data?.data ?? {});
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchYGGAccount();
  }, []);

  useEffect(() => {
    pageLoaderHandler(isLoading ? 'show' : 'hide');
  }, [isLoading]);

  return (
    <div className="row justify-content-center mt-4">
      <div className="col-md-7">
        <div className="wallet-card d-flex justify-content-between align-items-center px-4 py-5">
          <div>
            <div className="wallet-label mb-3">Account Name</div>
            <div className="wallet-value">{balanceData.account || 'N/A'}</div>
          </div>
          <div className="text-end">
            <div className="wallet-label mb-3">Account Balance</div>
            <div className="d-flex align-items-center justify-content-end gap-2">
              <span className="currency-tag mr-2">
                {balanceData.balance_amount?.currency || 'AED'}
              </span>
              <span className="wallet-value">
                {balanceData.balance_amount?.amount?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || '0.00'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletBalance;
