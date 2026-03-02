import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../UI/PageHeader";
import {
  REST_CONFIG,
  ROUTE_URL,
  URL_CONFIG,
  IMAGE_URL,
} from "../constants/rest-config";
import { httpHandler } from "../http/http-interceptor";
import { BreadCrumbActions } from "../store/breadcrumb-slice";
import { sharedDataActions } from "../store/shared-data-slice";
import ResponseInfo from "../UI/ResponseInfo";
import { formatDates } from "../constants/utills";
import Isloading from "../UI/CustomComponents/Isloading";
import { pageLoaderHandler } from "../helpers";

const Notification = () => {
  const eepHistory = useNavigate();
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const [notificationList, setNotificationsList] = useState([]);
  //const [isChecked, setIsChecked] = useState(false);
  //const [checkedData, setCheckedData] = useState([]);
  //const [renderTable, setRenderTable] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [usersPic, setUsersPic] = useState([]);

  const activeAccord = {
    birthday: "Birthday",
    anniversary: "Anniversary",
    appreciation: "Appreciation",
    seasonal: "Seasonal",
  };

  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    {
      label: "Notifications",
      link: "app/notifications",
    },
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "Notifications",
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: "",
      });
    };
  });

  // const allChecke = (e) => {
  //   setRenderTable(false);
  //   if (e.target.checked) {
  //     setTimeout(() => {
  //       setIsChecked((current) => !current);
  //       setRenderTable(true);
  //     }, 1);
  //     const notificationListTemp = JSON.parse(JSON.stringify(notificationList));
  //     var result = notificationListTemp.map((item) => item.id);
  //     setCheckedData([...result]);
  //   } else if (!e.target.checked) {
  //     setCheckedData([]);
  //     setTimeout(() => {
  //       setIsChecked((current) => !current);
  //       setRenderTable(true);
  //     }, 1);
  //   }
  // };

  // const getCheckedData = (checkState, nData) => {
  //   let checkDataTemp = checkedData;
  //   if (checkState) {
  //     checkDataTemp.push(nData.id);
  //     setCheckedData(checkDataTemp);
  //   } else {
  //     checkDataTemp.map((val, index) => {
  //       if (nData.id === val) {
  //         checkDataTemp.splice(index, 1);
  //         setCheckedData([...checkDataTemp]);
  //       }
  //     });
  //   }
  //   setIsChecked(false);
  // };

  const fetchNotifications = () => {
    setIsLoading(true);
    const obj = {
      url: URL_CONFIG.NOTIFICATIONS_BY_ID,
      method: "get",
    };
    httpHandler(obj)
      .then((response) => {
        setNotificationsList(response?.data);
        dispatch(
          sharedDataActions.getIsNotification({
            isNotification: response?.data,
          })
        );
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const readUnreadNotifications = (arg, status, payload) => {
    if (arg) {
      let notificationReadPayload;
      if (status === "read") {
        notificationReadPayload = {
          id: [arg],
          seen: true,
        };
      }
      if (status === "unRead") {
        notificationReadPayload = {
          id: [arg],
          seen: false,
        };
      }
      const obj = {
        url: URL_CONFIG.NOTIFICATIONs_READ,
        method: "put",
        payload: notificationReadPayload,
      };
      httpHandler(obj)
        .then((response) => {
          if (payload) {
            eepHistory(ROUTE_URL[payload.pathname], {
              state: payload?.state,
            });
          }
          fetchNotifications();
        })
        .catch((error) => {});
    }
  };

  // const readUnreadAllNotifications = (arg) => {
  //   if (arg) {
  //     setRenderTable(false);
  //     setTimeout(() => {
  //       setIsChecked((current) => !current);
  //       setRenderTable(true);
  //     }, 1);
  //     const notificationListTemp = JSON.parse(JSON.stringify(notificationList));
  //     var result = notificationListTemp.map((item) => item.id);
  //     setCheckedData([...result]);
  //   }
  //   let notificationReadPayload;
  //   if (arg === "readAll") {
  //     notificationReadPayload = {
  //       id: checkedData,
  //       seen: true,
  //     };
  //   }
  //   if (arg === "unReadAll") {
  //     notificationReadPayload = {
  //       id: checkedData,
  //       seen: false,
  //     };
  //   }
  //   const obj = {
  //     url: URL_CONFIG.NOTIFICATIONs_READ,
  //     method: "put",
  //     payload: notificationReadPayload,
  //   };
  //   httpHandler(obj)
  //     .then((response) => {
  //       fetchNotifications();
  //     })
  //     .catch((error) => {});
  // };

  const clearNotifications = (arg) => {
    let obj = {};
    if (arg?.action === "clear") {
      if (arg.data) {
        obj = {
          id: [arg?.data],
        };
      }
    }
    if (arg?.action === "clearAll") {
      obj = {
        id: notificationList?.map((data) => data?.id),
      };
    }
    if (obj) {
      axios
        .delete(
          `${REST_CONFIG.METHOD}://${REST_CONFIG.BASEURL}/api/v1${URL_CONFIG.NOTIFICATIONs_DELETE}`,
          { data: { ...obj } }
        )
        .then((response) => {
          fetchNotifications();
        })
        .catch((error) => {});
    }
  };

  useEffect(() => {
    fetchNotifications();
    //setRenderTable(true);
    fetchAllUsersPics();
    pageLoaderHandler(isLoading ? "show" : "hide");
  }, []);

  const CustomComponentSettings = {
    date: {
      classnames: "",
      objReference: "date",
    },
  };

  // const notificationTableHeaders = [
  //   {
  //     header: "Title",
  //     accessorKey: "message",
  //     size: 400,
  //   },
  //   {
  //     header: "Date",
  //     accessorKey: "date",
  //     accessorFn: (row) => (row.date ? formatDates(row.date) : "--"),
  //     size: 300,
  //   },
  // ];

  const fetchAllUsersPics = () => {
    const obj = {
      url: URL_CONFIG.ALL_USER_DETAILS_FILTER_RESPONSE,
      method: "get",
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
  const getICONINDEX = (message) => {
    console.log("message", message);

    if (message.includes("Award")) {
      return "AWARDS";
    }
    if (message.includes("branch")) {
      return "BRANCH";
    }
    if (
      message.includes("Social Wall") ||
      message.includes("EnliteU Wall") ||
      message.includes("recognition")
    ) {
      return "SOCIALWALL";
    }
    return null;
  };
  return (
    <React.Fragment>
      <PageHeader title="Notifications" />
      {isLoading ? (
        <Isloading />
      ) : (
        <>
          {notificationList && notificationList.length === 0 ? (
            <div className="tab-content col-md-12 h-100 response-allign-middle">
              <ResponseInfo
                title="	No Notifications found. Stay tuned!"
                responseImg="noNotifications"
                responseClass="response-info"
                messageInfo="Communication is the real work of leadership."
                subMessageInfo="  Nitin Nohria "
              />
            </div>
          ) : (
            <React.Fragment>
              <div
                className="eep-user-management eep-content-start"
                id="content-start"
              >
                <div className="row no-gutters eep-notification-div justify-content-end">
                  <div className="p-0 m-0" id="eep-notification-diiv">
                    <div className="d-flex align-items-center align-content-center action-border">
                      <label
                        className="mb-0 mr-2 c1"
                        style={{ color: "#000000de" }}
                      >
                        Options
                      </label>
                      <div className="d-flex align-items-center align-content-center section_two">
                        <div className="text-center">
                          <a
                            href="#"
                            className="p-2 c1"
                            role="button"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                            dangerouslySetInnerHTML={{
                              __html: svgIcons && svgIcons.colon,
                            }}
                          ></a>
                          <div className="eep-dropdown-menu dropdown-menu dropdown-menu-left shadow pt-4 pb-4">
                            <Link
                              to="#"
                              className="dropdown-item clearr c1"
                              onClick={() =>
                                clearNotifications({
                                  data: false,
                                  action: "clearAll",
                                })
                              }
                            >
                              Clear All
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="gride_view notification_view mt-3 px-3">
                  <div className="gride_container gride_colum_template">
                    {notificationList &&
                      notificationList.length > 0 &&
                      notificationList.map((item, index) => {
                        return (
                          <div
                            className={`${
                              item?.seen ? " " : ""
                            }  gride_containerr`}
                            style={item?.seen ? {} : { background: "#e8e8e8" }}
                            key={"notification_" + index}
                          >
                            <div className="d-flex justify-content-end">
                              <div className="text-center p-1 section_two">
                                <Link
                                  to="#"
                                  className=" px-2 c1"
                                  role="button"
                                  data-toggle="dropdown"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                                  dangerouslySetInnerHTML={{
                                    __html: svgIcons && svgIcons.colon,
                                  }}
                                  onClick={(event) => event.preventDefault()} // Stop navigation
                                ></Link>
                                <div className="eep-dropdown-menu dropdown-menu dropdown-menu-left shadow pt-4 pb-4 ">
                                  {!item?.seen && (
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      onClick={() =>
                                        readUnreadNotifications(item.id, "read")
                                      }
                                    >
                                      Mark As Read
                                    </Link>
                                  )}
                                  {item?.seen && (
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      onClick={() =>
                                        readUnreadNotifications(
                                          item.id,
                                          "unRead"
                                        )
                                      }
                                    >
                                      Mark As Unread
                                    </Link>
                                  )}
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                    onClick={() =>
                                      clearNotifications({
                                        data: item.id,
                                        action: "clear",
                                      })
                                    }
                                  >
                                    Clear
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div>
                              <Link
                                to="#"
                                onClick={() =>
                                  readUnreadNotifications(item.id, "read", {
                                    pathname: item?.path, // Target path
                                    state: {
                                      activeTab:
                                        item?.path === "ECARDINDEX"
                                          ? "InboxTab"
                                          : item?.sub_path,
                                      subTab:
                                        item?.sub_path === "MyActionTab"
                                          ? "MyNominationsTab"
                                          : "",
                                      sub_path: item?.sub_path,
                                      notification: item,
                                      activeAccord:
                                        activeAccord[item?.sub_path] ||
                                        "Birthday",
                                      usersPicData: usersPic,
                                    },
                                  })
                                }
                                className="c1"
                              >
                                <div
                                  className={`${
                                    item?.seen ? " " : ""
                                  } d-flex mt-2 w-100 c1`}
                                >
                                  <div class="outter">
                                    <img
                                      src={
                                        IMAGE_URL[item?.path] ||
                                        IMAGE_URL[
                                          getICONINDEX(item?.message)
                                        ] ||
                                        "/images/icons/recognition/badges.svg"
                                      }
                                      className="image-circle"
                                      alt="Type"
                                    />
                                  </div>
                                  <div
                                    className="ml-3  mb-3 d-flex justify-content-between"
                                    style={{ color: "#000000de" }}
                                  >
                                    <label
                                      className="mb-0 c1"
                                      style={
                                        item?.seen
                                          ? { fontWeight: "500" }
                                          : { fontWeight: "700" }
                                      }
                                    >
                                      {item?.message}
                                    </label>
                                  </div>
                                </div>
                                <div
                                  className={`${
                                    item?.seen ? " " : ""
                                  } d-flex w-100 justify-content-end`}
                                >
                                  <div className="text-right noti_date">
                                    <span>{formatDates(item?.date, true)}</span>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </React.Fragment>
          )}
        </>
      )}
    </React.Fragment>
  );
};
export default Notification;
