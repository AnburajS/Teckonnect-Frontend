import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import ResponseInfo from "../../UI/ResponseInfo";
import { URL_CONFIG } from "../../constants/rest-config";
import { httpHandler } from "../../http/http-interceptor";
import EEPSubmitModal from "../../modals/EEPSubmitModal";
import { eepFormatDateTime } from "../../shared/SharedService";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import RecognitionsDisplayCard from "./RecognitionsCard";
import UserRecognizeModal from "./UserRecognizeModal";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const getLocation = useLocation();
  const userId = getLocation.state ? getLocation.state?.userData : null;
  console.log("userId", userId);
  const [recUserData, setRecUserData] = useState({});
  const [usersPic, setUsersPic] = useState([]);
  const [userRecognizeModalState, setUserRecognizeModalState] = useState(false);
  const [userRecognizeModalErr, setUserRecognizeModalErr] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [badges, setBadges] = useState(null);
  const [appreciation, setAppreciation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const defaultUserPic = process.env.PUBLIC_URL + "/images/user_profile.png";
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const hideModal = () => {
    let collections = document.getElementsByClassName("modal-backdrop");
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  const dispatch = useDispatch();
  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    // {
    //   label: 'My Dashboard',
    //   link: 'app/dashboard',
    // },
    {
      label: `${
        userId?.userID?.username
          ? userId?.userID?.username
          : userId?.userID?.fullName
          ? userId?.userID?.fullName
          : "user"
      }'s Dashboard`,
      link: "#",
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "Dashboard",
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: "",
      });
    };
  }, []);

  const userDashboardDetails = (arg) => {
    if (arg) {
      const obj = {
        url: URL_CONFIG.USER_DASHBOARD,
        method: "get",
        params: { id: arg.id },
      };
      httpHandler(obj)
        .then((response) => {
          const resMsg = response?.data?.message;
          setUserDetails(response.data);
        })
        .catch((error) => {
          const errMsg = error?.response?.data?.message;
        });
    }
  };

  useEffect(() => {
    if (userId) {
      setRecUserData(userId.userID);
      userDashboardDetails(userId.userID);
    }
  }, [userId]);

  const fetchAllUsers = () => {
    const obj = {
      url: URL_CONFIG.ALLUSERS,
      method: "get",
    };
    httpHandler(obj)
      .then((response) => {
        let userPicTempArry = [];
        response.data.map((item) => {
          if (item?.imageByte?.image) {
            userPicTempArry.push({
              id: item.id,
              pic: item?.imageByte?.image,
            });
          }
        });
        setUsersPic(userPicTempArry);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  let userPicIndex;
  const getUserPicture = (uID) => {
    userPicIndex = usersPic.findIndex((x) => x.id === uID);
    return userPicIndex !== -1 ? usersPic[userPicIndex].pic : defaultUserPic;
  };

  const getBadges = () => {
    const obj = {
      url: URL_CONFIG.ALLBADGES,
      method: "get",
      params: { active: true },
    };
    httpHandler(obj)
      .then((response) => {
        const resMsg = response?.data?.message;
        setBadges(response);
        setIsLoading(false);
      })
      .catch((error) => {
        const errMsg = error?.response?.data?.message;
      });
  };

  const getAppreciation = () => {
    const obj = {
      url: URL_CONFIG.GET_TEMPLATE_ECARD,
      method: "get",
      params: { type: "appreciation" },
    };
    httpHandler(obj)
      .then((response) => {
        const resMsg = response?.data?.message;
        setAppreciation(response);
        setIsLoading(false);
      })
      .catch((error) => {
        const errMsg = error?.response?.data?.message;
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getBadges();
      getAppreciation();
    }, []);
    return () => {
      clearTimeout(timer);
      setIsLoading(true);
      setAppreciation(null);
      setBadges(null);
    };
  }, []);

  const userRecognition = (arg) => {
    let argTemp = JSON.parse(JSON.stringify(arg));
    let obj;
    if (arg.isBadge) {
      delete argTemp["isBadge"];
      obj = {
        url: URL_CONFIG.RECOGNIZE_BADGE,
        method: "post",
        payload: argTemp,
      };
    }
    if (!arg.isBadge) {
      delete argTemp["isBadge"];
      obj = {
        url: URL_CONFIG.SEND_ECARD,
        method: "post",
        payload: argTemp,
      };
    }
    httpHandler(obj)
      .then((response) => {
        //const resMsg = response?.data?.message;
        setUserRecognizeModalErr(null);
        setUserRecognizeModalState(false);
        setShowModal({
          ...showModal,
          type: "success",
          message: "Recognized success!!!",
        });
      })
      .catch((error) => {
        const errMsg =
          error.response?.data?.message !== undefined
            ? error.response?.data?.message
            : "Oops! Something went wrong. Please contact administrator.";
        setUserRecognizeModalErr(errMsg);
      });
  };

  const userRecognizeModalHandler = () => {
    setUserRecognizeModalErr(null);
    setUserRecognizeModalState(true);
  };
  return (
    <React.Fragment>
      {showModal.type !== null && showModal.message !== null && (
        <EEPSubmitModal
          data={showModal}
          className={`modal-addmessage`}
          hideModal={hideModal}
          successFooterData={
            <button
              type="button"
              className="eep-btn eep-btn-xsml eep-btn-success"
              data-dismiss="modal"
              onClick={hideModal}
            >
              Ok
            </button>
          }
          errorFooterData={
            <button
              type="button"
              className="eep-btn eep-btn-xsml eep-btn-danger"
              data-dismiss="modal"
              onClick={hideModal}
            >
              Close
            </button>
          }
        ></EEPSubmitModal>
      )}
      {userRecognizeModalState && (
        <UserRecognizeModal
          clickedUser={recUserData}
          badges={badges}
          appreciation={appreciation}
          isLoading={isLoading}
          userRecognition={userRecognition}
          userRecognizeModalErr={userRecognizeModalErr}
        />
      )}
      {userDetails && Object.keys(userDetails).length > 0 && (
        <div className="row eep_dashboard_div">
          <div className="col-sm-12 col-xs-12 col-md-6 col-lg-3">
            <div className="bg-f5f5f5 br-15 h-100 divFullHeight">
              <div className="bg-f0efef brtl-15 brtr-15 brbr-0 brbl-0 divMinusHeight">
                <div className="d_user_basic_details p-3">
                  <img
                    src={
                      recUserData
                        ? getUserPicture(recUserData.id)
                        : defaultUserPic
                    }
                    className="d_u_pic"
                    alt="Profile Image"
                  />
                  <div className="d_u_details">
                    {/* <label className="d_u_name font-helvetica-m my-0">
                      {userDetails.name}
                    </label>
                    <p className="d_u_dept ">{userDetails.departmentName}</p>
                     */}
                    <label className="d_u_name font-helvetica-m my-0">
                      {userDetails.name}
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
                        {userDetails?.designation}
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
                        {userDetails?.departmentName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-f5f5f5 brtl-0 brtr-0 brbr-15 brbl-15 divSetMaxHeight eep_scroll_y">
                <div className="d_user_official_details_inner p-3">
                  <div className="d_user_official_details">
                    <div className="col-md-12 c-2c2c2c bb_707070 px-0 mb-3">
                      <label className="mb-0">
                        {userDetails?.experienceType === "years"
                          ? userDetails?.experience
                          : userDetails?.sMonth}{" "}
                        <span className="ml-2">
                          {userDetails.experienceType}
                        </span>
                      </label>
                      <p className="text-right mb-1">
                        {" "}
                        DOJ: {eepFormatDateTime(userDetails.dateOfJoining)}{" "}
                      </p>
                    </div>
                    {/* <div className="col-md-12 c-2c2c2c px-0 mb-3">
                      <label className="mb-3">
                        <span className="ml-2">Reporting to</span>
                      </label>
                      <p className="mb-1 text-right">
                        {userDetails.managerName}
                      </p>
                    </div> */}
                  </div>
                  <div className="d_user_official_details_action">
                    <div className="col-md-12 text-center">
                      <button
                        className="eep-btn eep-btn-success c1"
                        data-toggle="modal"
                        data-target="#UserRecognizeModal"
                        onClick={userRecognizeModalHandler}
                      >
                        Recognize
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-12 col-xs-12 col-md-6 col-lg-9">
            <div className="row">
              <div className="col-sm-12 col-xs-12 col-md-12 col-lg-6">
                {/* <Recognitions dashboardDetails={userDetails} /> */}
                <RecognitionsDisplayCard dashboardDetails={userDetails} />
              </div>

              <div className="col-sm-12 col-xs-12 col-md-12 col-lg-6 d_progress_stats">
                <div className="card bg-f5f5f5 br-15 h-100">
                  <div className="card-body">
                    <h4 className="mb-3 fs-22">Statistics</h4>
                    {/* <h4 className="small font-weight-bold">
                      Points <span className="ml-1">{userDetails.points}</span>
                      <span className="float-right">
                        You {userDetails.selfPoints}
                      </span>
                    </h4>
                    <div className="progress rounded-pill progress-bar-striped progress-bar-animated mb-4">
                      <div
                        className="progress-bar rounded-pill progress-bar-striped"
                        role="progressbar"
                        aria-valuenow="100"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ width: userDetails.pointsPercent + '%' }}
                      ></div>
                    </div>
                     */}
                    <h4 className="small font-weight-bold">
                      E-Cards
                      <span className="ml-1">{userDetails.appreciations}</span>
                      <span className="float-right">
                        You {userDetails.selfAppreciations}
                      </span>
                    </h4>
                    <div className="progress rounded-pill progress-bar-striped progress-bar-animated mb-4">
                      <div
                        className="progress-bar rounded-pill progress-bar-striped rounded-pill progress-bar-striped bg-warning"
                        role="progressbar"
                        aria-valuenow="<?php echo $orginal_op; ?>"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{
                          width: userDetails.appreciationsPercent + "%",
                        }}
                      ></div>
                    </div>
 <h4 className="small font-weight-bold">
                      {" "}
                      Certificates{" "}
                      <span className="ml-1">{userDetails.certificates}</span>
                      <span className="float-right">
                        You {userDetails.selfCertificates}
                      </span>
                    </h4>
                    <div className="progress rounded-pill progress-bar-striped progress-bar-animated mb-4">
                      <div
                        className="progress-bar rounded-pill progress-bar-striped bg-info"
                        role="progressbar"
                        aria-valuenow="40"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ width: userDetails.certificatesPercent + "%" }}
                      ></div>
                    </div>
                    <h4 className="small font-weight-bold">
                      {" "}
                      Badges <span className="ml-1">{userDetails?.badges}</span>
                      <span className="float-right">
                        You {userDetails?.selfBadges}
                      </span>
                    </h4>
                    <div className="progress rounded-pill progress-bar-striped progress-bar-animated mb-4">
                      <div
                        className="progress-bar rounded-pill progress-bar-striped bg-danger"
                        role="progressbar"
                        aria-valuenow="50"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ width: userDetails.badgesPercent + "%" }}
                      ></div>
                    </div>
                   
                    <h4 className="small font-weight-bold">
                      {" "}
                      Awards <span className="ml-1">{userDetails?.awards}</span>
                      <span className="float-right">
                        You {userDetails?.selfAwards}
                      </span>
                    </h4>
                    <div className="progress rounded-pill progress-bar-striped progress-bar-animated">
                      <div
                        className="progress-bar rounded-pill progress-bar-striped bg-success"
                        role="progressbar"
                        aria-valuenow="55"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ width: userDetails.awardsPercent + "%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 mt-3">
            <div className="bg-f5f5f5 br-10 achievements_section_div h-100 eep_scroll_y">
              <div className="p-3 text-center">
                <label className="achievements_lbl">Badges</label>
                {userDetails?.acheivedBadgeList &&
                  userDetails?.acheivedBadgeList?.length > 0 && (
                    <div className="d-flex flex-wrap justify-content-center achievements_badges">
                      {userDetails?.acheivedBadgeList &&
                        userDetails?.acheivedBadgeList?.map((item, index) => {
                          return (
                            <div
                              className="col-auto achievements_img_div"
                              key={"user_Achievements_badges_" + index}
                            >
                              <img
                                src={
                                  item?.imageByte
                                    ? item?.imageByte?.image
                                    : process.env.PUBLIC_URL +
                                      "/images/icons/static/noData.svg"
                                }
                                className="d_achievements_img eep-pulse-direct-animation"
                                alt={item?.imageByte?.name}
                                title={item?.imageByte?.name}
                              />
                              <span>
                                {item?.acheivedCount > 9
                                  ? item?.acheivedCount
                                  : "0" + item?.acheivedCount}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  )}
                {userDetails.acheivedBadgeList &&
                  !userDetails.acheivedBadgeList.length && (
                    <ResponseInfo
                      title="Yet to earn!"
                      responseImg="noRecord"
                      responseClass="response-info"
                    />
                  )}
              </div>
            </div>
          </div>

          <div className="col-md-6 mt-3">
            <div className="bg-f5f5f5 br-10 achievements_section_div h-100 eep_scroll_y">
              <div className="p-3 text-center">
                <label className="achievements_lbl">Awards</label>
                {userDetails?.acheivedAwardList &&
                  userDetails?.acheivedAwardList?.length > 0 && (
                    <div className="d-flex flex-wrap justify-content-center achievements_awards">
                      {userDetails?.acheivedAwardList &&
                        userDetails?.acheivedAwardList?.map((item, index) => {
                          return (
                            <div
                              className="col-auto achievements_img_div"
                              key={"user_Achievements_awards_" + index}
                            >
                              <img
                                src={
                                  item?.imageByte
                                    ? item?.imageByte?.image
                                    : process.env.PUBLIC_URL +
                                      "/images/icons/static/noData.svg"
                                }
                                className="d_achievements_img eep-pulse-direct-animation"
                                alt={item?.imageByte?.name}
                                title={item?.imageByte?.name}
                              />
                              <span>
                                {item.acheivedCount > 9
                                  ? item.acheivedCount
                                  : "0" + item.acheivedCount}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  )}
                {userDetails.acheivedAwardList &&
                  !userDetails.acheivedAwardList.length && (
                    <ResponseInfo
                      title="Yet to earn!"
                      responseImg="noRecord"
                      responseClass="response-info"
                    />
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default UserDashboard;
