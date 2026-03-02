import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import PageHeader from '../../UI/PageHeader';
import TypeBasedFilter from '../../UI/TypeBasedFilter';
import { TYPE_BASED_FILTER } from '../../constants/ui-config';
// import { httpHandler } from "../../http/http-interceptor";
// import { URL_CONFIG } from "../../constants/rest-config";

const Redemptions = () => {
  // const [redemptionsData, setRedemptionsData] = useState({});
  // const [data, setData] = useState(null);
  const [filterParams, setFilterParams] = useState({});

  const dispatch = useDispatch();

  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'Rewards',
      link: 'app/points',
    },
    {
      label: 'Redemptions',
      link: 'app/redemption',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Redemptions',
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  });

  const getFilterParams = (paramsData) => {
    if (Object.getOwnPropertyNames(filterParams)) {
      setFilterParams({ ...paramsData });
    } else {
      setFilterParams({});
    }
    fetchRedemptions(paramsData);
  };

  const fetchRedemptions = (paramsInfo = {}) => {
    // let obj;
    // if (Object.getOwnPropertyNames(paramsInfo)) {
    //   obj = {
    //     url: URL_CONFIG.,
    //     method: "get",
    //     params: paramsInfo
    //   };
    // } else {
    //   obj = {
    //     url: URL_CONFIG.,
    //     method: "get"
    //   };
    // }
    // httpHandler(obj)
    //   .then((response) => {
    //
    //     setRedemptionsData(response.data);
    //   })
    //   .catch((error) => {
    //
    //     //const errMsg = error.response?.data?.message;
    //   });
  };

  useEffect(() => {
    fetchRedemptions();
  }, []);

  return (
    <React.Fragment>
      <PageHeader
        title={`Enlited points`}
        filter={
          <TypeBasedFilter
            config={TYPE_BASED_FILTER}
            getFilterParams={getFilterParams}
          />
        }
      />

      <div className="row redeem_div eep-content-start no-gutters">
        {/* <!-- Gift cards top div START --> */}

        <div className="col-md-12 redeemCards_topdiv mb-3">
          <div className="d-flex">
            <label className="redeemCards_label font-helvetica-m">
              Gift Cards
            </label>
            <label className="mypoints_label font-helvetica-m ml-auto">
              <span className="small mr-2">Available Points</span> 0{' '}
            </label>
          </div>

          <div className="redeemCard_div_min">
            <div className="row">
              <div className="text-center">No Gifts Redeemed</div>
            </div>
          </div>

          <div className="redeemCard_div_all">
            <div className="row"></div>
          </div>
        </div>

        <div className="col-md-12 merchandise_topdiv">
          <div className="d-flex">
            <label className="redeemCards_label font-helvetica-m">
              Merchandise
            </label>
            <label className="mypoints_label font-helvetica-m ml-auto">
              <span className="small mr-2">Available Points</span> 0{' '}
            </label>
          </div>

          <div className="merchandise_div_min">
            <div className="row">
              <div className="text-center">No Merchandise Redeemed</div>
            </div>
          </div>

          <div className="merchandise_div_all">
            <div className="row"></div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Redemptions;
