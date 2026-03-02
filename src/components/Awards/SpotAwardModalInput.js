import React, { useState } from "react";
import Select from "react-select";
import { URL_CONFIG } from "../../constants/rest-config";
import { httpHandler } from "../../http/http-interceptor";
const SpotAwardModalInput = (props) => {
  const {
    getDepts = () => false,
    getUsers = () => false,
    getSelectedDeptment,
    isclear,
  } = props;

  const optionsOne = [{ value: "Spot", label: "Spot Award" }];

  const [deptValue, setDeptValue] = useState([]);
  const [assignUser, setAssignUser] = useState(null);
  const [assignUserState, setAssignUserState] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [deptOptions, setDeptOptions] = useState([]);
  const [assignDepartmentState, setAssignDepartmentState] = useState(false);
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [usersOptions, setUsersOptions] = useState([]);
  // const onDeptChangeHandler = (eve) => {
  //   setDeptValue(eve);
  //   getSelectedDeptment(eve);
  // };
  // const fetchUserData = () => {
  //   const obj = {
  //     url: URL_CONFIG.ALL_USER_DETAILS_FILTER_RESPONSE + "?active=true",
  //     method: "get",
  //   };
  //   httpHandler(obj)
  //     .then((userData) => {
  //       const uOptions = [];
  //       userData &&
  //         userData.data.map((res) => {
  //           if (
  //             JSON.parse(res?.role?.role_screen_mapping?.screen_access)
  //               ?.awardNominatorAssignee === true
  //           ) {
  //             uOptions.push({
  //               label: res.fullName + " - " + res.department.name,
  //               value: res.id,
  //             });
  //           }

  //           return res;
  //         });
  //       setUsersOptions([...uOptions]);
  //     })
  //     .catch((error) => {
  //       //const errMsg = error.response?.data?.message;
  //     });
  // };

  const fetchUserData = () => {
  const currentUserId = JSON.parse(sessionStorage.getItem("userData"))?.id;

  const obj = {
    url: URL_CONFIG.ALL_USER_DETAILS_FILTER_RESPONSE + "?active=true",
    method: "get",
  };

  httpHandler(obj)
    .then((userData) => {
      const uOptions = [];

      userData &&
        userData.data.map((res) => {
          const isAwardAssignee = JSON.parse(
            res?.role?.role_screen_mapping?.screen_access
          )?.awardNominatorAssignee === true;

          if (isAwardAssignee && res.id !== currentUserId) {
            uOptions.push({
              label: res.fullName + " - " + res.department.name,
              value: res.id,
            });
          }

          return res;
        });

      setUsersOptions([...uOptions]);
    })
    .catch((error) => {
      console.error("Failed to fetch users:", error);
    });
};


  const fetchDepts = () => {
    const obj = {
      url: URL_CONFIG.ALLDEPARTMENTS + "?active=true",
      method: "get",
    };
    httpHandler(obj)
      .then((dept) => {
        const dOptions = [];
        dept &&
          dept.data.map((res) => {
            dOptions.push({ label: res.name, value: res.id });
            return res;
          });
        setDeptOptions([...dOptions]);
      })
      .catch((error) => {
        //const errMsg = error.response?.data?.message;
      });
  };
  const assignChangeHandler = async (event) => {
    setAssignUser(event);
    if (event.value === "Users") {
      setSelectedDepts([]);
      getDepts([]);
      setAssignUserState(true);
      setAssignDepartmentState(false);
      fetchUserData();
      // const res = await fetchUserData();
      // onUserChangeHandler(res);
    } else if (event.value === "Departments") {
      setSelectedUsers([]);
      getUsers([]);
      setAssignUserState(false);
      setAssignDepartmentState(true);
      fetchDepts();
    }
  };

  const onUserChangeHandler = (eve) => {
    setSelectedUsers(eve);
    getUsers(eve);
  };

  const userChangeHandler = (eve) => {
    setSelectedUsers([...eve]);
    getUsers([...eve]);
    setSelectedDepts([]);
    getDepts([]);
  };

  const deptChangeHandler = (eve) => {
    setSelectedUsers([]);
    getUsers([]);
    setSelectedDepts([...eve]);
    getDepts([...eve]);
  };
  const options = [
    { value: "Users", label: "Users" },
    { value: "Departments", label: "Departments" },
  ];

  React.useEffect(() => {
    setDeptValue("");
  }, [isclear]);

  return (
    <div className="col-md-8 col-lg-8 col-xs-12 col-sm-12">
      <div className="bg-f5f5f5 br-15 h-100">
        <div className="p-4">
          <div className="r_award_col_div">
            <div className="col-md-12 form-group px-0 eep-recognition-select2-dropdown_div">
              <label className="font-helvetica-m c-404040">Award Type</label>
              <Select
                options={optionsOne}
                // placeholder=""
                classNamePrefix="eep_select_common select"
                className={`form-control a_designation basic-single p-0`}
                style={""}
                // menuPlacement=""
                // onChange=""
                defaultValue={optionsOne[0]}
                maxMenuHeight={150}
              />
            </div>
            {/* <div className="col-md-12 form-group text-left eep-badge-select2-dropdown_div px-0">
              <div className="d-flex p-0 mb-2">
                <label className="font-helvetica-m c-404040">Department</label>
              </div>
              <Select
                options={deptOptions}
                isSearchable={true}
                className={`form-group select_bgwhite p-0`}
                name="BadgeSelect"
                id="badgeselect"
                defaultValue=""
                onChange={(event) => { event.length && event.find(option => option.value === 'all') ? onDeptChangeHandler(deptOptions) : onDeptChangeHandler(event) }}
                //onChange={(event) => onDeptChangeHandler(event)}
                disabled=""
                classNamePrefix="eep_select_common select"
                isClearable={true}
                isMulti={true}
                style={{ height: "auto" }}
                maxMenuHeight={150}
                value={deptValue}
              />
            </div> */}

            <div className="col-md-12 form-group text-left eep-badge-select2-dropdown_div px-0">
              {/* <div className="mb-3 row"> */}
              <label
                className="col-form-label font-helvetica-m c-404040"
                style={{ color: "#404040 !important", padding: "7px 0px" }}
              >
                Assign
              </label>
              <div className="ccEmail_div" style={{ padding: "0px" }}>
                <Select
                  options={options}
                  placeholder="Not Yet Select"
                  classNamePrefix="eep_select_common select"
                  className={`form-control a_designation basic-single p-0`}
                  onChange={(event) => assignChangeHandler(event)}
                  maxMenuHeight={233}
                  value={assignUser}
                />
                <div className="login_error_div">
                  <span
                    className="login_error un_error text-danger ereorMsg ng-binding"
                    style={{ display: "inline" }}
                  ></span>
                </div>
              </div>
              {/* </div> */}

              {assignUserState && (
                <>
                  <div className="ccEmail_div mt-2 mb-1">
                    <div
                      className=" d-flex justify-content-between align-items-center  col-form-label"
                      style={{
                        padding: "7px 0px !important",
                        margin: "0px auto",
                      }}
                    >
                      <label
                        className="col-form-label font-helvetica-m c-404040"
                        style={{ padding: "0px" }}
                      >
                        Users <span className="users_span"></span>
                      </label>
                      <label className="mb-0">
                        {selectedUsers.length + "/" + usersOptions.length}
                      </label>
                    </div>
                    <Select
                      options={[
                        { label: "Select All", value: "all" },
                        ...usersOptions,
                      ]}
                      placeholder="Not Yet Select"
                      classNamePrefix="eep_select_common select"
                      className="border_none br-8 bg-white"
                      onChange={(event) => {
                        event.length &&
                        event.find((option) => option.value === "all")
                          ? userChangeHandler(usersOptions)
                          : userChangeHandler(event);
                      }}
                      isClearable={true}
                      isMulti={true}
                      value={selectedUsers}
                      style={{ height: "auto" }}
                      maxMenuHeight={150}
                    />
                    <div className="login_error_div">
                      <span
                        className="login_error un_error text-danger ereorMsg ng-binding"
                        style={{ display: "inline" }}
                      ></span>
                    </div>
                  </div>
                </>
              )}
              {assignDepartmentState && (
                <>
                  <div className="ccEmail_div mt-2 mb-1">
                    <div
                      className=" d-flex justify-content-between align-items-center  col-form-label"
                      style={{
                        padding: "7px 0px !important",
                        margin: "0px auto",
                      }}
                    >
                      <label
                        className="col-form-label font-helvetica-m c-404040"
                        style={{ padding: "0px" }}
                      >
                        Departments <span className="users_span"></span>
                      </label>
                      <label className="mb-0">
                        {selectedDepts?.length + "/" + deptOptions?.length}
                      </label>
                    </div>
                    <Select
                      options={[
                        { label: "Select All", value: "all" },
                        ...deptOptions,
                      ]}
                      placeholder="Not Yet Select"
                      classNamePrefix="eep_select_common select"
                      className="border_none br-8 bg-white"
                      onChange={(event) => {
                        event.length &&
                        event.find((option) => option.value === "all")
                          ? deptChangeHandler(deptOptions)
                          : deptChangeHandler(event);
                      }}
                      isClearable={true}
                      isMulti={true}
                      style={{ height: "auto" }}
                      maxMenuHeight={150}
                      value={selectedDepts}
                    />
                    <div className="login_error_div">
                      <span
                        className="login_error un_error text-danger ereorMsg ng-binding"
                        style={{ display: "inline" }}
                      ></span>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12 px-0 form-group s_awardDetails_div">
              <div className="bg-white br-10 h-100">
                <div className="p-3">
                  <div className="s_awardDetails_lb text-left">
                    <label className="font-helvetica-m c-404040">
                      Selection Details
                    </label>
                  </div>
                  <div className="row justify-content-md-center">
                    <div className="col-md-10 col-lg-10 col-sm-12 col-xs-12 s_awardDetails_inner">
                      <p className="col-md-6 col-sm-12 s_awardDetails_dept mb-0 text-center">
                        {" "}
                        {assignUserState ? (
                          <>
                            No. of User(s): <span>{selectedUsers.length}</span>
                          </>
                        ) : (
                          <>
                            No. of Department(s):{" "}
                            <span>{selectedDepts?.length}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SpotAwardModalInput;
