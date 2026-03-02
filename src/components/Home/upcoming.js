import React from 'react';
import { Link } from 'react-router-dom';
import ResponseInfo from '../../UI/ResponseInfo';
import { useTranslation } from 'react-i18next';
import { checkDate } from '../../constants/utills';
const Upcomings = (props) => {
  const { dashboardDetails } = props;
  const { t } = useTranslation();

  return (
    <div className="bg-f5f5f5 br-15 mt-3 myTask_section">
      <div className="p-3">
        <h4 className="title_lbl cursor-default">
          {t(`dashboard.Happenings`)}
          <img
            width="30px"
            src="../images/image (3).png"
          />
        </h4>
        <div
          style={{
            minHeight: dashboardDetails?.upcomings?.length ? '180px' : '18px',
            maxHeight: '180px',
            overflowY: 'auto',
          }}
        >
          {dashboardDetails &&
            dashboardDetails.upcomings &&
            dashboardDetails.upcomings.map((item, index) => {
              return (
                <div
                  className="mytasks_list_div "
                  key={'myTask_' + index}
                >
                  <div className="">
                    <Link
                      to={{
                        pathname: '/app/ecardIndex',
                      }}
                      state={{
                        activeTab: 'CardsTab',
                        active: item?.active,
                        isDashbaordData: {
                          value: item?.userId,
                          label: item?.fullName + ' - ' + item?.role,
                        },
                      }}
                      className="c-2c2c2c a_hover_txt_deco_none d_mytasks_list"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <p className="mb-2 eep_overflow_ellipsis d_mytasks">
                        <span style={{ textTransform: 'capitalize' }}>
                          {item?.message}
                        </span>
                      </p>
                      <button
                        style={{
                          padding: 6,
                          fontSize: 10,
                        }}
                        className="eep-btn eep-btn-success eep-btn-xsml"
                      >
                        {t(`dashboard.Send`)}
                      </button>
                    </Link>
                    <label
                      className="d_mytasks_dt mb-0 opacity-3"
                      style={{
                        textAlign: 'start',
                        paddingRight: '20px',
                      }}
                    >
                      {checkDate(item?.date)}
                      {/* {t(`${item?.date}`)} */}
                    </label>
                  </div>
                  {index !== dashboardDetails?.upcomings?.length - 1 && (
                    <div
                      style={{ borderTop: '1px solid #e1dede' }}
                      className="dropdown-divider"
                    ></div>
                  )}
                </div>
              );
            })}
        </div>
        {dashboardDetails && !dashboardDetails.upcomings?.length && (
          <div className="pdy-30">
            <ResponseInfo
              title={t(`dashboard.No upcoming events found`)}
              responseImg="noRecord"
              responseClass="response-info"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Upcomings;
