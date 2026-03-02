/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
// import Tour from 'reactour';
import moment from "moment";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import AchievementAwards from "./AchievementAwards";
import AchievementBadges from "./AchievementBadges";
import PendingApproval from "./PendingApproval";
import Recognitions from "./Recognitions";
import Upcomings from "./upcoming";
import { useTranslation } from "react-i18next";
import { formatDates } from "../../constants/utills";

const Dashboard = (props) => {
  const { dashboardDetails, getUserPicture } = props;
  const { t } = useTranslation();
  const userSessionData = sessionStorage.userData
    ? JSON.parse(sessionStorage.userData)
    : {};
  const dispatch = useDispatch();
  // const [startTour, setStartTour] = useState(false);
  const breadcrumbArr = [
    {
      label: t(`dashboard.Home`),
      link: "app/dashboard",
    },
    {
      label: t(`dashboard.dashboard`),
      link: "#",
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: "",
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: "",
      });
    };
  }, []);
  const months = ["months", "month", "days", "day"];

  function removeDuplicates(data) {
    const uniqueEntries = {};
    data.forEach((entry) => {
      const key = entry.userId + "-" + entry.active;
      if (!uniqueEntries[key]) {
        uniqueEntries[key] = entry;
      }
    });
    return Object.values(uniqueEntries);
  }

  return (
    <React.Fragment>
      {/* <Tour steps={steps} {...tourProps} /> */}

      <div className="row eep_dashboard_div">
        <div className="col-sm-12 col-xs-12 col-md-6 col-lg-3 position_sticky eep-content-section eep-content-section-max">
          <div className="bg-f5f5f5 br-15 h-100 divFullHeight">
            <div className="bg-f0efef brtl-15 brtr-15 brbr-0 brbl-0 divMinusHeight">
              <div className="d_user_basic_details p-3">
                <img
                  src={
                    userSessionData.id
                      ? getUserPicture(
                          userSessionData.id,
                          userSessionData?.username
                        )
                      : process.env.PUBLIC_URL + "/images/user_profile.png"
                  }
                  className="d_u_pic"
                  alt={userSessionData.username}
                />
                <div className="d_u_details">
                  <label className="d_u_name font-helvetica-m my-0">
                    {userSessionData?.firstName} {userSessionData?.lastName}
                  </label>
                  {/* <p className="d_u_dept">
                    {dashboardDetails?.designation} -{' '}
                    {dashboardDetails?.departmentName}
                  </p> */}
                  <div className="d-flex flex-row justify-content-start align-items-center mt-2">
                    <img
                      width={"16px"}
                      src={
                        process.env.PUBLIC_URL +
                        "/images/icons/dashboard/designation-icon.svg"
                      }
                    />
                    <p className="d_u_dept ml-10">
                      {dashboardDetails?.designation}
                    </p>
                  </div>
                  <div className="d-flex flex-row justify-content-start align-items-center mt-2">
                    <Link to={{ pathname: "/app/orgChart" }}>
                      <img
                        width={"16px"}
                        src={
                          process.env.PUBLIC_URL +
                          "/images/icons/dashboard/org-icon.svg"
                        }
                      />
                    </Link>
                    <p className="d_u_dept ml-10">
                      {dashboardDetails?.departmentName}
                    </p>
                  </div>
                </div>
                {/* &nbsp;&nbsp;&nbsp;
                <Link to={{ pathname: "orgChart" }}>
                  <img width={'30px'} src={process.env.PUBLIC_URL + "/images/download.png"} />
                </Link> */}
              </div>
            </div>
            <div
              className="bg-f5f5f5 brtl-0 brtr-0 brbr-15 brbl-15 divSetMaxHeight eep_scroll_y"
              style={{ maxHeight: "516.6px" }}
            >
              <div className="d_user_official_details">
                <div className="col-md-12 c-2c2c2c bb_707070 dash_profile_details">
                  <label className="mb-0">
                    {
                      // (months?.includes(dashboardDetails?.experienceType)
                      // ) ? dashboardDetails?.sMonth :
                      dashboardDetails?.experience
                    }
                    <span className="ml-2">
                      {dashboardDetails?.experienceType}
                    </span>
                  </label>
                  <p className="text-right mb-1 d_doj opacity-3">
                    {" "}
                    {t(`dashboard.DOJ`)}:{" "}
                    {formatDates(dashboardDetails?.dateOfJoining)}
                    {/* {moment(dashboardDetails?.dateOfJoining).format(
                      'DD-MM-YYYY'
                    )}{' '} */}
                  </p>
                </div>
                <div className="col-md-12 c-2c2c2c px-0">
                  <div
                    className="panel-group"
                    id="d_accordion"
                    role="tablist"
                    aria-multiselectable="true"
                  >
                    {/* {dashboardDetails.directReporters &&
                      dashboardDetails.directReporters.length > 0 && (
                        <div className="panel panel-default bb_707070 dash_profile_details">
                          <div
                            className="panel-heading"
                            role="tab"
                            id="d_headingOne"
                          >
                            <h4 className="panel-title mb-0">
                              <a
                                className="c-2c2c2c a_hover_txt_deco_none c1"
                                role="button"
                                data-toggle="collapse"
                                data-parent="#d_accordion"
                                href="#d_collapseOne"
                                aria-expanded="false"
                                aria-controls="d_collapseOne"
                              >
                                <label className="mb-0 c1 title_lbl">
                                  {dashboardDetails.directReports > 9
                                    ? dashboardDetails.directReports
                                    : '0' + dashboardDetails.directReports}{' '}
                                  <span className="ml-2">
                                    {' '}
                                    {t(`dashboard.My_Team`)}{' '}
                                  </span>
                                </label>
                                <img
                                  src={
                                    process.env.PUBLIC_URL +
                                    '/images/icons/static/Down-Arrow.svg'
                                  }
                                  className="rotate-icon"
                                  alt="arrow-icon"
                                  style={{ width: '15px' }}
                                />
                              </a>
                            </h4>
                          </div>
                          <div
                            id="d_collapseOne"
                            className="panel-collapse collapse in eep_scroll_y"
                            role="tabpanel"
                            aria-labelledby="d_headingOne"
                          >
                            <div className="panel-body">
                              {dashboardDetails?.directReporters &&
                                dashboardDetails?.directReporters?.length > 0 &&
                                dashboardDetails?.directReporters?.map(
                                  (item, index) => {
                                    return (
                                      <div
                                        className="d_user_report_details"
                                        key={'directReport_' + index}
                                      >
                                        <img
                                          src={
                                            item.id
                                              ? getUserPicture(item.id)
                                              : process.env.PUBLIC_URL +
                                                '/images/user_profile.png'
                                          }
                                          className="d_u_pic"
                                          alt={item?.imageByte?.name}
                                          title={item?.imageByte?.name}
                                        />
                                        <label className="d_u_name font-helvetica-m my-0">
                                          <Link
                                            to={{
                                              pathname: 'userdashboard',
                                              state: {
                                                userData: { userID: item },
                                              },
                                            }}
                                            className="uNameLink a_hover_txt_deco_none"
                                          >
                                            {item.fullName} -{' '}
                                            {item?.department?.name}
                                          </Link>
                                        </label>
                                      </div>
                                    );
                                  }
                                )}
                            </div>
                          </div>
                        </div>
                      )} */}
                    <div className="panel panel-default dash_profile_details first-step">
                      <div
                        className="panel-heading"
                        role="tab"
                        id="d_headingTwo"
                      >
                        <h4 className="panel-title mb-0">
                          <a
                            className="collapsed c-2c2c2c a_hover_txt_deco_none c1"
                            role="button"
                            data-toggle="collapse"
                            data-parent="#d_accordion"
                            href="#d_collapseTwo"
                            aria-expanded="false"
                            aria-controls="d_collapseTwo"
                          >
                            <label className="mb-0 c1 title_lbl">
                              {/* {dashboardDetails.teamSize > 9
                                ? dashboardDetails.teamSize
                                : '0' + dashboardDetails.teamSize}{' '} */}
                              <span className="ml-2">
                                {t(`People I engage with`)}
                              </span>
                            </label>
                            <img
                              src={
                                process.env.PUBLIC_URL +
                                "/images/icons/static/Down-Arrow.svg"
                              }
                              className="rotate-icon"
                              alt="arrow-icon"
                              style={{ width: "15px" }}
                            />
                          </a>
                        </h4>
                      </div>
                      <div
                        id="d_collapseTwo"
                        className="panel-collapse collapse eep_scroll_y"
                        role="tabpanel"
                        aria-labelledby="d_headingTwo"
                      >
                        <div className="panel-body">
                          {dashboardDetails?.department?.users &&
                            dashboardDetails.department.users.map(
                              (item, index) => {
                                return (
                                  <>
                                    {userSessionData?.id !== item?.user_id && (
                                      <div
                                        className="d_user_report_details"
                                        key={"department_user_" + index}
                                      >
                                        <img
                                          src={
                                            item.id
                                              ? getUserPicture(
                                                  item.id,
                                                  item?.username
                                                )
                                              : process.env.PUBLIC_URL +
                                                "/images/user_profile.png"
                                          }
                                          className="d_u_pic"
                                          alt={item?.username}
                                        />
                                        <label className="d_u_name font-helvetica-m my-0">
                                          <Link
                                            to={{
                                              pathname: "/app/userdashboard",
                                            }}
                                            state={{
                                              userData: { userID: item },
                                            }}
                                            className="uNameLink a_hover_txt_deco_none"
                                          >
                                            {item?.fullName}
                                          </Link>
                                        </label>
                                      </div>
                                    )}
                                    {/* {userSessionData?.id === item?.user_id && (
                                      <span className="d_u_name font-helvetica-m my-0">
                                        {item?.fullName}
                                      </span>
                                    )} */}
                                  </>
                                );
                              }
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-xs-12 col-md-6 col-lg-9 eep-content-section  eep-content-section-max eep_scroll_y">
          <div className="row mb-3 eep-content-start">
            <div className="col-sm-12 col-xs-12 col-md-12 col-lg-12">
              <Recognitions dashboardDetails={dashboardDetails} />
            </div>
            <div className="col-sm-12 col-xs-12 col-md-12 col-lg-6">
              <PendingApproval dashboardDetails={dashboardDetails} />
              {/* <Upcomings
                dashboardDetails={{
                  upcomings: removeDuplicates(
                    dashboardDetails?.happenings ?? []
                  ),
                }}
              /> */}
            </div>
            <div className="col-sm-12 col-xs-12 col-md-12 col-lg-6">
              {/* <PendingApproval dashboardDetails={dashboardDetails} /> */}
              <Upcomings
                dashboardDetails={{
                  upcomings: removeDuplicates(
                    dashboardDetails?.happenings ?? []
                  ),
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <AchievementBadges dashboardDetails={dashboardDetails} />
            </div>
            <div className="col-md-6">
              <AchievementAwards dashboardDetails={dashboardDetails} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default Dashboard;
