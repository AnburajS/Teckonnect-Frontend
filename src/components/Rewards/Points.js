import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PageHeader from '../../UI/PageHeader';
import TypeBasedFilter from '../../UI/TypeBasedFilter';
import { URL_CONFIG } from '../../constants/rest-config';
import { TYPE_BASED_FILTER } from '../../constants/ui-config';
import { httpHandler } from '../../http/http-interceptor';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import AvailPoints from './AvailPoints';
import PointsTable from './PointsTable';
import { pageLoaderHandler } from '../../helpers';

const Points = () => {
  const [pointsList, setPointsList] = useState({});
  const [filterParams, setFilterParams] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    // {
    //   label: "Rewards",
    //   link: "app/points",
    // },
    {
      label: 'XP',
      link: 'app/points',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'XP',
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
    fetchPoints(paramsData);
  };

  const fetchPoints = (paramsInfo = {}) => {
    setIsLoading(true);

    let obj;
    if (Object.getOwnPropertyNames(paramsInfo)) {
      obj = {
        url: URL_CONFIG.GET_POINTS,
        method: 'get',
        params: paramsInfo,
      };
    } else {
      obj = {
        url: URL_CONFIG.GET_POINTS,
        method: 'get',
      };
    }
    httpHandler(obj)
      .then((response) => {
        setPointsList(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        const errMsg = error.response?.data?.message;
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchPoints();
    pageLoaderHandler(isLoading ? 'show' : 'hide');
  }, []);

  return (
    <React.Fragment>
      <PageHeader
        title={`Total Earned XP : ${pointsList?.totalPoints ?? '00'}`}
        filter={
          <TypeBasedFilter
            config={TYPE_BASED_FILTER}
            getFilterParams={getFilterParams}
          />
        }
      />
      {!isLoading && (
        <div className="row eep-content-start">
          <div className="col-md-3 myPointsLeft_div">
            <AvailPoints pointsList={pointsList} />
          </div>
          <div className="col-md-9 myPointsRight_div">
            <PointsTable pointsList={pointsList} />
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Points;
