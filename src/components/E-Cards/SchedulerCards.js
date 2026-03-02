import React, { useEffect, useState } from 'react';
import TypeBasedFilter from '../../UI/TypeBasedFilter';
import PageHeader from '../../UI/PageHeader';
import { TYPE_BASED_FILTER } from '../../constants/ui-config';
import EventCard from './EventCard';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

function SchedulerCards({ templateType }) {
  const location = useLocation();
  const activeTabs = location?.state?.activeTab;
  const [cardData, setCardData] = useState([]);
  const [usersPic, setUsersPic] = useState([]);
  const [filterParams, setFilterParams] = useState({});
  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission
  );
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const fetchScheduleData = (paramsInfo) => {
    let obj;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    if (paramsInfo && Object.getOwnPropertyNames(paramsInfo)) {
      obj = {
        url: URL_CONFIG.SCHEDULE_ECARD,
        method: 'get',
        params: paramsInfo
          ? paramsInfo
          : { month: currentMonth, year: currentYear },
      };
    } else {
      obj = {
        url: URL_CONFIG.SCHEDULE_ECARD,
        method: 'get',
        params: { month: currentMonth, year: currentYear },
      };
    }

    httpHandler(obj)
      .then((userData) => {
        let final = [];
        userData?.data?.data?.map((data) => {
          console.log('birthday', templateType, data?.type);

          if (data?.type === templateType) {
            final.push(data);
          }
        });
        setCardData(final);
      })
      .catch((error) => {
        //const errMsg = error.response?.data?.message;
      });
  };
  const fetchAllUsersPics = () => {
    const obj = {
      url: URL_CONFIG.ALL_USER_DETAILS_FILTER_RESPONSE,
      method: 'get',
    };
    httpHandler(obj)
      .then((response) => {
        let userPicTempArry = [];

        response.data.map((item) => {
          if (item?.imageByte?.image) {
            userPicTempArry.push({
              id: item.user_id,
              pic: item?.imageByte?.image,
            });
          }
          return userPicTempArry;
        });
        setUsersPic(userPicTempArry);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    fetchAllUsersPics();
    fetchScheduleData();
  }, []);
  const getFilterParams = (paramsData) => {
    if (Object.getOwnPropertyNames(filterParams)) {
      setFilterParams({ ...paramsData });
    } else {
      setFilterParams({});
    }
    fetchScheduleData(paramsData);
  };
  return (
    <React.Fragment>
      {userRolePermission.ecardTemplates && (
        <>
          <PageHeader
            title="Status Report"
            // navLinksLeft={
            //   <Link
            //     className="text-right c-c1c1c1 mr-2 my-auto eep_nav_icon_div eep_action_svg"
            //     to={'/app/ecardIndex'}
            //     state={{
            //       activeTab:
            //         activeTabs === 'SchedulerTab' ? activeTabs : 'TemplatesTab',
            //     }}
            //     dangerouslySetInnerHTML={{
            //       __html: svgIcons && svgIcons.lessthan_circle,
            //     }}
            //   ></Link>
            // }
            filter={
              <TypeBasedFilter
                config={TYPE_BASED_FILTER}
                getFilterParams={getFilterParams}
              />
            }
          />
          <div
            className="eep_scroll_y urm_drage urm_drag_drop isDragging gride_view py-2 px-3"
            id="drage_container"
          >
            <div className="gride_container gride_colum_template_ecard">
              {cardData?.map((data) => {
                return (
                  <EventCard
                    date={data?.date}
                    time={data?.time}
                    type={data?.type}
                    status={data?.status}
                    response_data={data?.response_data}
                    usersPic={usersPic}
                  />
                );
              })}
            </div>
          </div>
        </>
      )}
    </React.Fragment>
  );
}

export default SchedulerCards;
