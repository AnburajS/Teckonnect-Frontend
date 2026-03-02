import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ActionCustomComponent from '../UI/CustomComponents/ActionCustomComponent';
import PageHeader from '../UI/PageHeader';
import TableComponent from '../UI/tableComponent';
import { REST_CONFIG, URL_CONFIG } from '../constants/rest-config';
import { httpHandler } from '../http/http-interceptor';
import { BreadCrumbActions } from '../store/breadcrumb-slice';
import { sharedDataActions } from '../store/shared-data-slice';

const Notifications = () => {
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const [notificationList, setNotificationsList] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [checkedData, setCheckedData] = useState([]);
  const [renderTable, setRenderTable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'Notifications',
      link: 'app/notifications',
    },
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Notifications',
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  });

  // const allChecke = (e) => {
  // 	setRenderTable(false);
  // 	if (e.target.checked) {
  // 		// setIsAll({ ...isAll, ckeck: true });
  // 		setRenderTable(true);
  // 		const notificationListTemp = JSON.parse(JSON.stringify(notificationList));
  // 		var result = notificationListTemp.map(item => (item.id));
  // 		setCheckedData([...result]);
  // 	} else {
  // 		// setIsAll({ ...isAll, ckeck: false });
  // 		setRenderTable(true);
  // 		setCheckedData([]);
  // 	}
  // 	setIsChecked(current => !current);
  // };

  // const checkBoxHandler = (nData, checkState) => {
  // 	if (nData) {
  // 		if (checkState) {
  // 			let checkDataTemp = checkedData;
  // 			if (!checkDataTemp.includes(nData.id)) {
  // 				checkDataTemp.push(nData.id);
  // 				setCheckedData([...checkDataTemp]);
  // 			}
  // 		}
  // 		if (!checkState) {
  // 			let checkDataTemp = checkedData;
  // 			const nDataIndex = checkDataTemp.findIndex(x => x === nData.id);
  // 			if (nDataIndex > -1) {
  // 				checkDataTemp.splice(nDataIndex, 1);
  // 			}
  // 			setCheckedData([...checkDataTemp]);
  // 		}
  // 	}
  // }

  const allChecke = (e) => {
    setRenderTable(false);
    if (e.target.checked) {
      setTimeout(() => {
        setIsChecked((current) => !current);
        setRenderTable(true);
      }, 1);
      const notificationListTemp = JSON.parse(JSON.stringify(notificationList));
      var result = notificationListTemp.map((item) => item.id);
      setCheckedData([...result]);
    } else if (!e.target.checked) {
      setCheckedData([]);
      setTimeout(() => {
        setIsChecked((current) => !current);
        setRenderTable(true);
      }, 1);
    }
  };

  const getCheckedData = (checkState, nData) => {
    let checkDataTemp = checkedData;
    if (checkState) {
      checkDataTemp.push(nData.id);
      setCheckedData(checkDataTemp);
    } else {
      checkDataTemp.map((val, index) => {
        if (nData.id === val) {
          checkDataTemp.splice(index, 1);
          setCheckedData([...checkDataTemp]);
        }
      });
    }
    setIsChecked(false);
  };

  const fetchNotifications = () => {
    setIsLoading(true);

    const obj = {
      url: URL_CONFIG.NOTIFICATIONS_BY_ID,
      method: 'get',
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

  const readUnreadNotifications = (arg, status) => {
    if (arg) {
      let notificationReadPayload;
      if (status === 'read') {
        notificationReadPayload = {
          id: [arg],
          seen: true,
        };
      }
      if (status === 'unRead') {
        notificationReadPayload = {
          id: [arg],
          seen: false,
        };
      }
      const obj = {
        url: URL_CONFIG.NOTIFICATIONs_READ,
        method: 'put',
        payload: notificationReadPayload,
      };
      httpHandler(obj)
        .then((response) => {
          fetchNotifications();
        })
        .catch((error) => {});
    }
  };

  const readUnreadAllNotifications = (arg) => {
    if (arg) {
      setRenderTable(false);
      setTimeout(() => {
        setIsChecked((current) => !current);
        setRenderTable(true);
      }, 1);
      const notificationListTemp = JSON.parse(JSON.stringify(notificationList));
      var result = notificationListTemp.map((item) => item.id);
      setCheckedData([...result]);
    }
    // if (checkedData.length) {
    let notificationReadPayload;
    if (arg === 'readAll') {
      notificationReadPayload = {
        id: checkedData,
        seen: true,
      };
    }
    if (arg === 'unReadAll') {
      notificationReadPayload = {
        id: checkedData,
        seen: false,
      };
    }
    const obj = {
      url: URL_CONFIG.NOTIFICATIONs_READ,
      method: 'put',
      payload: notificationReadPayload,
    };
    httpHandler(obj)
      .then((response) => {
        fetchNotifications();
      })
      .catch((error) => {});
    // }
  };

  const clearNotifications = (arg) => {
    let obj = {};
    if (arg?.action === 'clear') {
      if (arg.data) {
        obj = {
          id: checkedData,
        };
      }
    }
    if (arg?.action === 'clearAll') {
      if (checkedData.length) {
        obj = {
          id: checkedData,
        };
      }
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
    setRenderTable(true);
  }, []);

  const CustomComponentSettings = {
    date: {
      classnames: '',
      objReference: 'date',
    },
  };

  const notificationTableHeaders = [
    // {
    // 	header: "",
    // 	accessorKey: "#",
    // 	accessorFn: (row) => <CheckBoxComponent data={row} getCheckedData={getCheckedData} bulkCheckState={isChecked} totalCheckBoxSx={{display:'flex',alignItems:'center'}} />,
    // 	size: 1,

    // },
    {
      header: 'Title',
      accessorKey: 'message',
      size: 400,
    },
    // {
    // 	header: "Src",
    // 	accessorKey: "type",
    // },
    {
      header: 'Date',
      accessorKey: 'date',
      accessorFn: (row) => (row.date ? moment(row.date).format('l') : '--'),
      size: 300,
    },
  ];

  return (
    <React.Fragment>
      <PageHeader title="Notifications" />
      <React.Fragment>
        <div className="row no-gutters eep-notification-div">
          <div
            className="col-md-12 p-0 m-0"
            id="eep-notification-diiv"
          >
            <div className="d-flex  align-items-center align-content-center justify-content-end check_options_div ">
              {/* <div className="d-flex align-items-center align-content-center action-border">
									<label className="mb-0 mr-2">Bulk Actions</label>
									<div className={`d-flex align-items-center align-content-center section_one ${isChecked ? "checked" : ""}`}>
										<div className="checkall">
											<input type="checkbox" className="notiCheck mb-0" id="notiCheck_all" checked={isChecked ? true : false} onChange={(e) => allChecke(e)} />
										</div>
										<div className={`clear ${isChecked ? "check_optionsb" : "check_optionsn"}`}>
											<div className=" c1 clear_js clear_icon_div" title="Clear All" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.clear_icon, }} onClick={() => clearNotifications({ data: false, action: "clearAll" })}></div>
										</div>
										<div className={`c1 mark_read_icon_div ${isChecked ? "check_optionsb" : "check_optionsn"}`} title="Mark As Read" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.read, }} onClick={() => readUnreadAllNotifications("readAll")}></div>
										<div className={`c1 mark_unread_icon_div ${isChecked ? "check_optionsb" : "check_optionsn"}`} title="Mark As Unread" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.un_read, }} onClick={() => readUnreadAllNotifications("unReadAll")}></div>
									</div>
								</div> */}
              <div className="d-flex align-items-center align-content-center action-border">
                <label
                  className="mb-0 mr-2 c1"
                  style={{ color: '#000000de' }}
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
                      {/* <Link to="#" className={`dropdown-item mark_all_raed c1`}  onClick={() =>  readUnreadAllNotifications("readAll")} >Mark All As Read</Link>
												<Link to="#" className="dropdown-item mark_all_unraed c1" onClick={() => readUnreadAllNotifications("unReadAll")} >Mark All As Unread</Link> */}
                      <Link
                        to="#"
                        className="dropdown-item clearr c1"
                        onClick={() =>
                          clearNotifications({
                            data: false,
                            action: 'clearAll',
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
        </div>
        <div
          className="eep-user-management eep-content-start"
          id="content-start"
        >
          <div
            className="table-responsive eep_datatable_table_div p-2"
            style={{ visibility: 'visible' }}
          >
            <div
              id="user_dataTable_wrapper"
              className="dataTables_wrapper dt-bootstrap4 no-footer"
              style={{ width: '100%' }}
            >
              {/* {renderTable && */}
              {!isLoading && (
                <TableComponent
                  data={notificationList ?? []}
                  columns={notificationTableHeaders}
                  action={
                    <ActionCustomComponent
                      readUnreadNotifications={readUnreadNotifications}
                      clearNotifications={clearNotifications}
                    />
                  }
                />
              )}
              {/* } */}
            </div>
          </div>
        </div>
      </React.Fragment>
      {/* {notificationList.length <= 0 &&
				<div className=" row eep-content-section-data no-gutters response-allign-middle">
					<div className="col-md-12">
						<ResponseInfo title="No records found!!!!!." responseImg="noRecord" responseClass="response-info" />
					</div>
				</div>
			} */}
    </React.Fragment>
  );
};
export default Notifications;
