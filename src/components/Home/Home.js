import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { URL_CONFIG } from '../../constants/rest-config';
import { httpHandler } from '../../http/http-interceptor';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import { sharedDataActions } from '../../store/shared-data-slice';
import { TabsActions } from '../../store/tabs-slice';
import Dashboard from './Dashboard';
import HallOfFame from './HallOfFame';
import RewardsRecognition from './RewardsRecognition';
import { pageLoaderHandler } from '../../helpers';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const [usersPic, setUsersPic] = useState([]);
  const [dashboardDetails, setDashboardDetails] = useState({});
  const [hallOfFameDetails, setHallOfFameDetails] = useState({});
  const [allUserDatas, setAllUserDatas] = useState([]);
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.tabs.activeTab);
  const location = useLocation();
  const history = useNavigate();
  const routerData = location.state;
  const [filterParams, setFilterParams] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission
  );
  const { t } = useTranslation();
  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'My Dashboard',
      id: 'My_Dashboard',
      link: '#',
    },
  ];

  /*
  const tabConfig = [
    {
      title: "My Dashboard",
      id: "My_Dashboard",
    },
    {
      title: "Rewards & Recognition ",
      id: "Rewards_Recognition",
    },
    {
      title: "Hall of Fame",
      id: "Hall_of_Fame",
    },
  ];
  */

  const tabConfig = [
    {
      title: t(`dashboard.My Dashboard`),
      id: 'My_Dashboard',
    },
  ];

  useEffect(() => {
    if (userRolePermission.employeeEngagementDashboard) {
      tabConfig.push({
        title: t(`dashboard.Organization Stats`),
        id: 'Rewards_Recognition',
      });
    }
    if (userRolePermission.hallOfFame) {
      tabConfig.push({
        title: t(`dashboard.Hall of Fame`),
        id: 'Hall_of_Fame',
      });
    }

    // if (userRolePermission.employeeEngagementDashboard || userRolePermission.hallOfFame) {
    if (routerData?.activeTab) {
      const activeTabId = routerData.activeTab;
      tabConfig.map((res) => {
        if (res.id === activeTabId) {
          res['active'] = true;
        }
      });
      dispatch(
        TabsActions.updateTabsconfig({
          config: tabConfig,
        })
      );
      // history.replace({ pathname: history.location.pathname, state: {} });
    } else {
      dispatch(
        TabsActions.updateTabsconfig({
          config: tabConfig,
        })
      );
    }

    return () => {
      dispatch(
        TabsActions.updateTabsconfig({
          config: [],
        })
      );
    };
    // }
  }, [userRolePermission]);

  useEffect(() => {
    // dispatch(TabsActions.tabOnChange({tabInfo:tabConfig?.[0]}))
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  }, []);

  // const getDashboardDetails = async () => {
  //   pageLoaderHandler('show')
  //   const obj = {
  //     url: URL_CONFIG.DASHBOARD_INDEX,
  //     method: "get"
  //   }
  //   await httpHandler(obj)
  //     .then((response) => {
  //       setDashboardDetails(response?.data);
  //       pageLoaderHandler('hide')
  //     }).catch((error) => {
  //
  //       pageLoaderHandler('hide')
  //     });
  // }
  const getDashboardDetails = async () => {
    try {
      pageLoaderHandler('show');

      const obj = {
        url: URL_CONFIG.DASHBOARD_INDEX,
        method: 'get',
        params: { date: '7' },
      };

      const response = await httpHandler(obj);
      setDashboardDetails(response?.data);

      pageLoaderHandler('hide');
    } catch (error) {
      pageLoaderHandler('hide');
    }
  };

  const fetchAllUsers = () => {
    const obj = {
      url: URL_CONFIG.ALL_USER_DETAILS_FILTER_RESPONSE,
      method: 'get',
      isLoader: false,
    };
    httpHandler(obj)
      .then((response) => {
        let userPicTempArry = [];
        response.data.map((item) => {
          if (item?.imageByte?.image) {
            userPicTempArry.push({
              id: item.user_id,
              pic: item?.imageByte?.image,
              userName: item?.username,
            });
          }
        });
        setUsersPic(userPicTempArry);
        setAllUserDatas(response.data);
      })
      .catch((error) => {});
  };

  const fetchHallOfFame = (paramsInfo = {}) => {
    const obj = {
      url: URL_CONFIG.HALL_OF_FAME,
      method: 'get',
    };
    if (Object.getOwnPropertyNames(paramsInfo)) {
      obj['params'] = paramsInfo;
    }
    httpHandler(obj)
      .then((response) => {
        setHallOfFameDetails(response.data);
      })
      .catch((error) => {});
  };

  const getHallOfFameFilterParams = (paramsData) => {
    fetchHallOfFame(paramsData);
  };

  // const fetchIsNotification = () => {
  //   const obj = {
  //     url: URL_CONFIG.NOTIFICATIONS_BY_ID,
  //     method: "get",
  //     isLoader: true
  //   };
  //   httpHandler(obj)
  //     .then((response) => {
  //       dispatch(sharedDataActions.getIsNotification({
  //         isNotification: response?.data
  //       }))
  //     })
  //     .catch((error) => {
  //
  //     });
  // }

  useEffect(() => {
    getDashboardDetails();
    fetchAllUsers();
    // fetchIsNotification();
  }, []);

  useEffect(() => {
    if (activeTab?.id === 'Hall_of_Fame') {
      fetchHallOfFame(filterParams);
    }
  }, [activeTab]);

  let userPicIndex;
  // const getUserPicture = (uID) => {

  //   userPicIndex = usersPic.findIndex((x) => x.id === uID);
  //   return userPicIndex !== -1
  //     ? usersPic[userPicIndex].pic
  //     : process.env.PUBLIC_URL + '/images/user_profile.png';
  // };

  const getUserPicture = (uID, userName) => {
    userPicIndex =
      usersPic.findIndex((x) => x.userName === userName) ||
      usersPic.findIndex((x) => x.id === uID);
      userPicIndex = usersPic.findIndex((x) => x.id === uID);
    // userPicIndex = usersPicProps.findIndex((x) => x.id === uID);
    return userPicIndex !== -1
      ? usersPic[userPicIndex].pic
      : process.env.PUBLIC_URL + '/images/user_profile.png';
  };
  return (
    <div className="row eep-content-section-data no-gutters">
      <div className="tab-content col-md-12 h-100">
        <div
          id="My_Dashboard"
          className="tab-pane active h-100"
        >
          {activeTab &&
            activeTab?.id === 'My_Dashboard' &&
            Object?.entries(dashboardDetails)?.length > 0 && (
              <Dashboard
                dashboardDetails={dashboardDetails}
                getUserPicture={getUserPicture}
              />
            )}
        </div>
        <div
          id="Rewards_Recognition"
          className="tab-pane h-100"
        >
          {activeTab && activeTab?.id === 'Rewards_Recognition' && (
            <RewardsRecognition allUserDatas={allUserDatas} />
          )}
        </div>
        <div
          id="Hall_of_Fame"
          className="tab-pane h-100"
        >
          {activeTab && activeTab?.id === 'Hall_of_Fame' && (
            <HallOfFame
              hallOfFameDetails={hallOfFameDetails}
              getHallOfFameFilterParams={getHallOfFameFilterParams}
              getUserPicture={getUserPicture}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default Home;
