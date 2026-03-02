import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { URL_CONFIG } from '../../constants/rest-config';
import { httpHandler } from '../../http/http-interceptor';
const BadgeModalInputs = (props) => {
  const {
    modalInputData,
    deptInputOptions,
    getWallPostStatus,
    getSelectedDept,
    getHashValues,
    getRegonitionMsg,
    showBadgeModal,
    getDepts = () => false,
    getUsers = () => false,
    getAssign = () => false,
    getSelectedUser = () => false,
    newModalDatas,
  } = props;
  const [recogMessage, setRecogMessage] = useState('');
  const [deptValue, setDeptValue] = useState([]);
  const [toggleSwitch, setToggleSwitch] = useState(false);
  const [hashId, setHashId] = useState([]);
  const msgMaxLength = 120;

  const [assignUser, setAssignUser] = useState(null);
  const [assignUserState, setAssignUserState] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [deptOptions, setDeptOptions] = useState([]);
  const [assignDepartmentState, setAssignDepartmentState] = useState(false);
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [usersOptions, setUsersOptions] = useState([]);
  const currUserData = sessionStorage.userData
    ? JSON.parse(sessionStorage.userData)
    : {};

  useEffect(() => {
    setDeptValue([]);
    setAssignUser(null);
    setAssignDepartmentState(false);
    setToggleSwitch(false);
    setHashId([]);
    setRecogMessage('');
    const checkBox = document.getElementsByClassName('socialHashTag');
    for (let i = 0; i < checkBox.length; i++) {
      checkBox[i].checked = false;
    }
  }, [modalInputData, showBadgeModal, newModalDatas]);

  const handleonKeyUp = (e) => {
    e.target.value = e.target.value.substring(0, msgMaxLength);
    setRecogMessage(e.target.value);
    getRegonitionMsg(e.target.value);
  };

  const toggleSwitchHandler = () => {
    setToggleSwitch((prev) => !prev);
    let toggleSwitch1 = !toggleSwitch;
    let obj = { wallPost: toggleSwitch1 };
    getWallPostStatus(obj);
  };

  const onDeptChangeHandler = (eve) => {
    getSelectedDept(eve);
    setDeptValue(eve);
  };

  const onUserChangeHandler = (eve) => {
    getSelectedUser(eve);
    setSelectedUsers(eve);
  };

  const hashOnChangeHandler = (eve) => {
    const { value, checked } = eve.target;
    var hashIdTemp = hashId;
    if (checked) {
      hashIdTemp.push({ id: value });
    } else {
      for (let i = 0; i < hashIdTemp.length; i++) {
        if (value === hashIdTemp[i].id) {
          hashIdTemp.splice(i, 1);
          break;
        }
      }
    }
    setHashId(hashIdTemp);
    getHashValues(hashIdTemp);
  };

  const fetchUserData = async () => {
    const uOptions = [];
    // const obj = {
    //   url: URL_CONFIG.ALL_USER_DETAILS_FILTER_RESPONSE + "?active=true",
    //   method: "get",
    // };
    //gggg
    const obj = {
      url: URL_CONFIG.DEPT_USERS,
      method: 'get',
      params: {
        dept: JSON.stringify([currUserData?.departmentID]),
      },
    };
    await httpHandler(obj)
      .then((userData) => {
        userData &&
          userData.data
            .filter((res) => res.id !== currUserData?.id)
            .map((res) => {
              uOptions.push({
                label: res.fullName + ' - ' + res.department.name,
                value: res.id,
              });
              return res;
            });
        setUsersOptions([...uOptions]);
      })
      .catch((error) => {
        //const errMsg = error.response?.data?.message;
      });
    return uOptions;
  };

  const fetchDepts = () => {
    const obj = {
      url: URL_CONFIG.ALLDEPARTMENTS + '?active=true',
      method: 'get',
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
    getAssign(event);
    if (event.value === 'Users') {
      setDeptValue([]);
      getSelectedDept([]);
      setAssignUserState(true);
      setAssignDepartmentState(false);
      const res = await fetchUserData();
      onUserChangeHandler(res);
    } else if (event.value === 'Departments') {
      setSelectedUsers([]);
      getSelectedUser([]);
      setAssignUserState(false);
      setAssignDepartmentState(true);
      fetchDepts();
    }
  };

  const userChangeHandler = (eve) => {
    setSelectedUsers([...eve]);
    setSelectedDepts([]);
    getDepts([]);
    getUsers([...eve]);
  };

  const deptChangeHandler = (eve) => {
    setSelectedDepts([...eve]);
    setSelectedUsers([]);
    getDepts([]);
    getUsers([...eve]);
  };
  const options = [
    { value: 'Users', label: 'Users' },
    { value: 'Departments', label: 'Departments' },
  ];

  return (
    <React.Fragment>
      <div className="badge_modal_left_col_inner h-100">
        <div className="row">
          <div className="col-md-12 text-right">
            <div className="eep_recog_enable">
              <BootstrapSwitchButton
                checked={toggleSwitch}
                width={140}
                onstyle="success"
                onlabel="WALL POST"
                offlabel=""
                style="toggle_switch"
                onChange={toggleSwitchHandler}
              />
            </div>
          </div>
          <div className="col-md-12 col-lg-12 col-xs-12 col-sm-12 mb-3">
            <div className="text-center">
              <div className="n_badge_add_col_inner_frombadge position-relative bg-white">
                <img
                  src={
                    modalInputData?.imageByte?.image
                      ? modalInputData.imageByte.image
                      : `${process.env.PUBLIC_URL}/images/icons/static/No-Icon.svg`
                  }
                  className="batch_img_modal"
                  alt="Badge Icon"
                  title={modalInputData['name']}
                />
                {modalInputData['points'] > 0 && (
                  <h5 className="points_highlights">
                    <span>{modalInputData['points']}</span>
                    <span>{modalInputData['points'] > 1 ? ' pts' : ' pt'}</span>
                  </h5>
                )}
              </div>
              <label className="n_badge_add_label">
                {' '}
                {modalInputData['name']}{' '}
              </label>
            </div>
          </div>
          <div className="col-md-12 col-lg-12 col-xs-12 col-sm-12">
            <div className=" bg-f5f5f5 p-4 br-10">
              <div className="col-md-12 form-group text-left eep-badge-select2-dropdown_div px-0">
                <label
                  className="col-form-label"
                  style={{ padding: '7px 0px' }}
                >
                  Assign
                </label>
                <div
                  className="ccEmail_div"
                  style={{ padding: '0px' }}
                >
                  <Select
                    options={options}
                    placeholder="Select User / Department"
                    classNamePrefix="eep_select_common select"
                    className={`form-control a_designation basic-single p-0`}
                    onChange={(event) => assignChangeHandler(event)}
                    maxMenuHeight={233}
                    value={assignUser}
                  />
                  <div className="login_error_div">
                    <span
                      className="login_error un_error text-danger ereorMsg ng-binding"
                      style={{ display: 'inline' }}
                    ></span>
                  </div>
                </div>

                {assignDepartmentState && (
                  <>
                    <div
                      className=" d-flex justify-content-between align-items-center  col-form-label"
                      style={{
                        padding: '7px 0px !important',
                        margin: '0px auto',
                        marginTop: '10px',
                      }}
                    >
                      <label
                        className="col-form-label"
                        style={{ padding: '0px' }}
                      >
                        Departments <span className="users_span"></span>
                      </label>
                      <label className="mb-0">
                        ({deptValue.length + '/' + deptInputOptions.length})
                      </label>
                    </div>
                    <div className="col-md-12 form-group text-left eep-badge-select2-dropdown_div px-0">
                      <Select
                        options={[
                          { label: 'Select All', value: 'all' },
                          ...deptInputOptions,
                        ]}
                        // options={deptInputOptions}
                        isSearchable={true}
                        className={`form-group select_bgwhite p-0`}
                        name="BadgeSelect"
                        id="badgeselect"
                        defaultValue=""
                        onChange={(event) => {
                          event.length &&
                          event.find((option) => option.value === 'all')
                            ? onDeptChangeHandler(deptInputOptions)
                            : onDeptChangeHandler(event);
                        }}
                        disabled=""
                        classNamePrefix="eep_select_common select"
                        isClearable={true}
                        isMulti={true}
                        style={{ height: 'auto' }}
                        maxMenuHeight={150}
                        value={deptValue}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="col-md-12 col-lg-12 col-xs-12 col-sm-12 px-0">
                <textarea
                  name="message"
                  className="form-control badge_recog_msg"
                  id="badge_recog_msg"
                  rows="2"
                  placeholder="Add a Custom Message"
                  maxLength={msgMaxLength}
                  onChange={handleonKeyUp}
                  value={recogMessage}
                ></textarea>
                <div className="eep_tags_group_div">
                  <span className="help-block">
                    <p
                      id="characterLeft"
                      className="help-block "
                    >
                      <span>{recogMessage.length}</span>
                      <span>{`/${msgMaxLength}`}</span>
                    </p>
                  </span>
                  <div className="eep-dropdown-divider"></div>
                  <div
                    className="btn-group eep_tags_group hashTag eep_scroll_y"
                    style={{ height: '70px' }}
                  >
                    {modalInputData['hashTag'] &&
                      modalInputData['hashTag'].map((dataHash, i) => (
                        <div
                          className="eep_tags"
                          key={'hash_' + i}
                        >
                          <input
                            type="checkbox"
                            className="btn-check socialHashTag"
                            name="hashtag"
                            id={'check' + i}
                            value={dataHash.id}
                            autoComplete="off"
                            onChange={hashOnChangeHandler}
                          />
                          <label
                            className="btn btn-outline-primary text-xs"
                            htmlFor={'check' + i}
                            style={{
                              fontSize: '14px',
                              lineHeight: '1.2',
                              padding: '6px 12px',
                            }}
                          >
                            #{dataHash.hashtagName}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default BadgeModalInputs;
