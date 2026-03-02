import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PageHeader from '../../UI/PageHeader';
import TableComponent from '../../UI/tableComponent';
import { URL_CONFIG } from '../../constants/rest-config';
import { httpHandler } from '../../http/http-interceptor';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import './style.css';
import { pageLoaderHandler } from '../../helpers';
import { formatDates } from '../../constants/utills';

const MyProfileCoupon = (props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    data: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'Redemptions',
      link: '',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'redeem',
      })
    );
    fetchRedeem();
    pageLoaderHandler(isLoading ? 'show' : 'hide');
  }, []);

  const fetchRedeem = () => {
    setIsLoading(true);

    const obj = {
      url: URL_CONFIG.GET_REDEEM,
      method: 'get',
    };
    httpHandler(obj)?.then((response) => {
      setState({
        ...state,
        data: (response?.data?.data ?? []).sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        ),
      });
      setIsLoading(false);
    });
  };
  const headers = [
    {
      header: 'Voucher',
      accessorKey: 'image',
      // eslint-disable-next-line jsx-a11y/alt-text
      accessorFn: (row) => (
        <img
          style={{ width: '80px' }}
          className="icon_image"
          src={row?.image ?? ''}
        />
      ),
    },
    {
      header: 'Title',
      accessorKey: 'name',
    },

    {
      header: 'Redeem XP',
      accessorKey: 'points',
    },
    {
      header: 'Redeemed On',
      accessorKey: 'created_at',
      accessorFn: (row) =>
        row.created_at ? formatDates(row.created_at) : '--',
    },
  ];
  return (
    <React.Fragment>
      <PageHeader title={`Redemptions`} />
      {!isLoading && (
        <TableComponent
          data={state?.data ?? []}
          columns={headers}
          actionHidden={true}
          enableRowNumbers={true}
        />
      )}
    </React.Fragment>
  );
};
export default MyProfileCoupon;
