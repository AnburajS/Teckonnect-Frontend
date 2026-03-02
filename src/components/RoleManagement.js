import React, { useEffect, useState } from 'react';
import { BreadCrumbActions } from '../store/breadcrumb-slice';
import { TabsActions } from '../store/tabs-slice';
import { useDispatch, useSelector } from 'react-redux';
import { httpHandler } from '../http/http-interceptor';
import { URL_CONFIG } from '../constants/rest-config';
import RoleUpdate from './RoleUpdate/RoleUpdate';
import ResponseInfo from '../UI/ResponseInfo';
import ReactTooltip from 'react-tooltip';
import RoleUserUpdate from './RoleUpdate/RoleUserUpdate';

const RoleManagement = () => {
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission
  );

  const [toggleColorPicker, setToggleColorPicker] = useState(false);
  const [roleActionBtn, setRoleActionBtn] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [roleValue, setRoleValue] = useState();
  var defaultColorCode = '#28accc';
  const [roleColorCode, setRoleColorCode] = useState(defaultColorCode);
  const [selectedRoleData, setSelectedRoleData] = useState({});
  const [roleUpdateID, setRoleUpdateID] = useState('');
  const [roleResponseMsg, setRoleResponseMsg] = useState('');
  const [roleResponseClassName, setRoleResponseClassName] = useState('');
  const [roleScreenResponseMsg, setRoleScreenResponseMsg] = useState('');
  var defaultRoleLabel = 'Create new role';
  const [roleLabel, setRoleLabel] = useState(defaultRoleLabel);
  const [roleColors, setRoleColors] = useState([]);
  const [permissionData, setPermissionData] = useState([]);
  const [roleDataForUpdate, setRoleDataForUpdate] = useState({});
  const [roleID, setRoleID] = useState([]);
  const [roleScreenID, setRoleScreenID] = useState([]);
  const [roleDataClicked, setRoleDataClicked] = useState(false);
  const permissionDefaultData = {
    adminPanel: false,
    myDashboard: false,
    employeeEngagementDashboard: false,
    hallOfFame: false,
    ecardTemplates: false,
    certificateSend: false,
    certificateCreate: false,
    certificateModify: false,
    badgeSend: false,
    badgeCreate: false,
    badgeModify: false,
    awardCreate: false,
    awardModify: false,
    awardCategorisation: false,
    awardNominatorAssignee: false,
    surveyCreate: false,
    surveyManage: false,
    ideaboxHide: false,
    myForums: false,
    forumHide: false,
    pollCreate: false,
    pollModify: false,
    enliteWallHide: false,
    orgChart: false,
  };

  const toggleHanlder = (eve) => {
    setToggleColorPicker((prevState) => !prevState);
    setRoleLabel(defaultRoleLabel);
    setRoleValue('');
    setRoleUpdateID('');
    setRoleResponseMsg('');
    setRoleActionBtn(false);
    setRoleColorCode(defaultColorCode);
  };

  const dispatch = useDispatch();
  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'Admin Panel',
      link: 'app/adminpanel',
    },
    {
      label: 'Role Management',
      link: '',
    },
  ];

  // const tabConfig = [
  //   {
  //     title: "Role",
  //     id: "roleTab",
  //   },
  //   {
  //     title: "Role Update",
  //     id: "roleUpdateTab",
  //   },
  // ];

  const tabConfig = [
    {
      title: 'Role',
      id: 'roleTab',
    },
    {
      title: 'Role Update',
      id: 'roleUpdateTab',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Role Management',
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  }, []);

  useEffect(() => {
    if (userRolePermission.adminPanel) {
      dispatch(
        TabsActions.updateTabsconfig({
          config: tabConfig,
        })
      );
      return () => {
        dispatch(
          TabsActions.updateTabsconfig({
            config: [],
          })
        );
      };
    }
  }, []);

  const fetchPermissionData = () => {
    fetch(`${process.env.PUBLIC_URL}/data/permissionData.json`)
      .then((response) => response.json())
      .then((data) => {
        setPermissionData(data);
      });
  };

  const fetchRoleData = () => {
    const obj = {
      url: URL_CONFIG.ALLROLES,
      method: 'get',
    };
    httpHandler(obj)
      .then(({ data }) => {
        setRoleData(data);
        const arr = [
          ...new Set(
            data.map((item) => item.color_code).filter((color) => color)
          ),
        ];
        setRoleColors(arr);
      })
      .catch((error) => {
        const errMsg = error.response?.data?.message;
      });
  };

  useEffect(() => {
    fetchRoleData();
    fetchPermissionData();
  }, []);

  const triggerColorPicker = () => {
    document.getElementById('color_picker_input').click();
  };

  const colorInputChangeHandler = (event) => {
    setRoleColorCode(event.target.value);
  };

  const onClickChooseColorPallet = (event) => {
    setRoleColorCode(event.target.style.backgroundColor);
  };

  const onChangeSetRoleValue = (event) => {
    setRoleValue(event.target.value);
    setRoleResponseMsg('');
    setRoleResponseClassName('');
  };

  const onClickCreateRole = () => {
    let payOptions = {
      role_name: roleValue,
      color_code: roleColorCode,
      screen: permissionDefaultData,
    };
    const obj = {
      url: URL_CONFIG.ALLROLES,
      method: 'post',
      payload: payOptions,
    };
    httpHandler(obj)
      .then((response) => {
        setRoleValue('');
        setRoleColorCode('');
        const resMsg = response?.data?.message;
        setRoleResponseMsg(resMsg);
        setRoleResponseClassName('response-succ');
        fetchRoleData();
      })
      .catch((error) => {
        const errMsg = error?.response?.data?.message;
        setRoleResponseMsg(errMsg);
        setRoleResponseClassName('response-err');
      });
  };

  const onClickAppendRoleData = (event, rdata) => {
    setRoleResponseMsg('');
    setToggleColorPicker(true);
    setRoleActionBtn(true);
    setRoleLabel('Update Role');
    setRoleValue(rdata?.role_name);
    setRoleColorCode(rdata?.color_code);
    setRoleUpdateID(rdata?.id);
    setSelectedRoleData(rdata);
    event.stopPropagation();
  };

  const onClickAppendPermissionData = (index, roldata) => {
    setRoleDataForUpdate(roldata);
    setRoleLabel(defaultRoleLabel);
    setToggleColorPicker(false);
    let removeClassName = document.querySelectorAll('#user_roles .user_role');
    for (var i = 0; i < removeClassName.length; i++) {
      removeClassName[i].classList.remove('selected');
    }
    let addClassName = document.getElementById('user_role_' + index);
    addClassName.classList.add('selected');
    setRoleDataClicked(true);
    setRoleScreenResponseMsg('');
    const obj = {
      url: URL_CONFIG.ROLE_SCREEN_MAPPING,
      method: 'get',
      params: { id: index },
    };
    httpHandler(obj)
      .then(({ data }) => {
        updatePermissionData(data?.role_screen_mapping?.screen);
        setRoleID(data?.id);
        setRoleScreenID(data?.role_screen_mapping?.id);
      })
      .catch((error) => {
        //const errMsg = error.response?.data?.message;
      });
  };

  const updatePermissionData = (rPermission) => {
    permissionData.map((res) => {
      let allowedCnt = 0;
      res.permissions.map((perm) => {
        perm['allow'] = rPermission[perm['value']] || false;
        if (rPermission[perm['value']]) {
          allowedCnt++;
        }
      });
      res['allowedCnt'] = allowedCnt;
    });
    setPermissionData([...permissionData]);
  };

  const onClickUpdateRole = () => {
    let payOptions = {
      role_id: roleUpdateID,
      is_active: selectedRoleData.is_active,
      role_name: roleValue,
      color_code: roleColorCode,
    };
    const obj = {
      url: URL_CONFIG.ALLROLES,
      method: 'put',
      payload: payOptions,
    };
    httpHandler(obj)
      .then((response) => {
        const resMsg = response?.data?.message;
        setRoleResponseMsg(resMsg);
        setRoleResponseClassName('response-succ');
        fetchRoleData();
      })
      .catch((error) => {
        const errMsg = error?.response?.data?.message;
        setRoleResponseMsg(errMsg);
        setRoleResponseClassName('response-err');
      });
  };

  const checkBoxOnChangeHandler = (data, outerIndex, innerIndex) => {
    setRoleScreenResponseMsg('');
    permissionData[outerIndex].permissions[innerIndex]['allow'] =
      document.getElementById('panelLabel_' + outerIndex + '_' + innerIndex)
        .value === 'true'
        ? false
        : true;

    permissionData.map((res) => {
      let allowedCnt = 0;
      res.permissions.map((perm) => {
        if (perm['allow']) {
          allowedCnt++;
        }
      });
      res['allowedCnt'] = allowedCnt;
    });
    setPermissionData([...permissionData]);
  };

  const updatePermission = (rid, rsid) => {
    const payOptions = {
      role_id: rid,
      screen: {},
    };
    permissionData.map((res) => {
      res.permissions.map((perm) => {
        payOptions['screen'][perm['value']] = perm['allow'] || false;
      });
    });
    const obj = {
      url: URL_CONFIG.ROLE_SCREEN_UPDATE,
      method: 'put',
      payload: payOptions,
    };
    httpHandler(obj)
      .then((response) => {
        const resMsg = response?.data?.message;
        setRoleScreenResponseMsg(resMsg);
        setRoleResponseClassName('response-succ');
      })
      .catch((error) => {
        const errMsg = error?.response?.data?.message;
        setRoleScreenResponseMsg(errMsg);
        setRoleResponseClassName('response-err');
      });
  };

  return (
    <React.Fragment>
      {userRolePermission.adminPanel && (
        <div className="tab-content">
          <div
            id="roleTab"
            className="tab-pane active"
          >
            <div className="row">
              <div className="col-sm-12 col-md-6 eep-content-section eep_scroll_y">
                <div className="urm_left_heading">User Roles</div>
                <div className="user_roles_container">
                  <div
                    id="user_roles"
                    className="user_roles eep_scroll_y"
                  >
                    {roleData &&
                      roleData.length > 0 &&
                      roleData.map((data, index) => (
                        <React.Fragment>
                          <div
                            id={`user_role_${data.id}`}
                            className="user_role role_select c1"
                            key={'user_role_' + index}
                            onClick={() =>
                              onClickAppendPermissionData(data.id, data)
                            }
                          >
                            <div className="user_role_inner_div">
                              <div
                                className="user_role_color"
                                style={{ backgroundColor: data.color_code }}
                              ></div>
                              <div className="user_role_name">
                                {data.role_name}
                              </div>
                            </div>
                            <div className="urm_icon_div">
                              <div
                                className="role_edit"
                                onClick={(event) =>
                                  onClickAppendRoleData(event, data)
                                }
                              >
                                <img
                                  className="c1"
                                  src={
                                    process.env.PUBLIC_URL +
                                    '/images/icons/static/Edit-Circle.svg'
                                  }
                                  width="20"
                                  alt="Edit"
                                />
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                  </div>
                  <div className="urm_Color_Picker_Wrapper">
                    <div className="bg-white border br-10">
                      {
                        <div
                          className="urm_action_div c1"
                          style={{ display: 'flex' }}
                          onClick={(eve) => toggleHanlder(eve)}
                        >
                          <span className="urm_add_role_name">{roleLabel}</span>
                          {!toggleColorPicker && (
                            <span
                              className="urm_add_role_icon"
                              dangerouslySetInnerHTML={{
                                __html: svgIcons && svgIcons.plus_sm,
                              }}
                            ></span>
                          )}
                          {toggleColorPicker && (
                            <span
                              className="urm_add_role_icon"
                              dangerouslySetInnerHTML={{
                                __html: svgIcons && svgIcons.minus_sm,
                              }}
                            ></span>
                          )}
                        </div>
                      }
                      {toggleColorPicker && (
                        <div
                          className="urm_action_detail_div"
                          style={{ display: 'flex' }}
                        >
                          <div className="Role_name">
                            <div
                              id="user_role_color"
                              className="user_role_color"
                              style={{ backgroundColor: roleColorCode }}
                            ></div>
                            <input
                              type="text"
                              id="user_role_name"
                              className="user_role_name"
                              autoComplete="off"
                              value={roleValue}
                              onChange={onChangeSetRoleValue}
                            />
                            {!roleActionBtn && (
                              <button
                                className="eep-btn eep-btn-success eep-btn-xsml c1"
                                onClick={onClickCreateRole}
                                disabled={!roleValue.trim()}
                              >
                                {' '}
                                Create Role{' '}
                              </button>
                            )}
                            {roleActionBtn && (
                              <button
                                className="eep-btn eep-btn-success eep-btn-xsml c1"
                                onClick={onClickUpdateRole}
                              >
                                {' '}
                                Update Role{' '}
                              </button>
                            )}
                          </div>
                          <div
                            id="color_code"
                            className="color_code eep_scroll_y"
                          >
                            {roleColors.length > 0 &&
                              roleColors.map((data, index) => (
                                <div
                                  className="pick_color"
                                  onClick={onClickChooseColorPallet}
                                  value={data}
                                  key={'pick_color_' + index}
                                >
                                  <div
                                    className="pick_color_bg"
                                    style={{ backgroundColor: data }}
                                  ></div>
                                </div>
                              ))}
                            <div className="position-relative">
                              <div
                                className="m-1"
                                dangerouslySetInnerHTML={{
                                  __html: svgIcons && svgIcons.plus_color_new,
                                }}
                                onClick={triggerColorPicker}
                              ></div>
                              <input
                                type="color"
                                className="position-absolute"
                                id="color_picker_input"
                                name="favcolor"
                                value={roleColorCode}
                                onChange={colorInputChangeHandler}
                              />
                            </div>
                          </div>
                          {roleResponseMsg && (
                            <div className="response-div m-0">
                              <p
                                className={`${roleResponseClassName} response-text`}
                              >
                                {roleResponseMsg}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 eep-content-section eep_scroll_y">
                <div className="urm_right_heading">Access Rights</div>
                <div
                  id="permission"
                  className="permission_container"
                >
                  <div
                    className="accordion eep_scroll_y opacity-50 pe-none"
                    id="permissionAccordion"
                  >
                    {roleDataClicked &&
                      permissionData.length > 0 &&
                      permissionData.map((datas, index) => (
                        <React.Fragment>
                          <ReactTooltip effect="solid" />
                          <div
                            id={`panel_${index}`}
                            className="permission_div_wrapper noborder p-2"
                            key={`panel_${index}`}
                          >
                            <div
                              className="permission_div c1"
                              data-toggle="collapse"
                              data-target={`#panelDiv_${index}`}
                              aria-expanded={`${
                                index === 0 ? 'true' : 'false'
                              }`}
                              aria-controls={`panelDiv_${index}`}
                            >
                              <div className="permission_module_name">
                                <span className="inner_div">
                                  {datas.header}
                                </span>
                                <span className="permisson_select_count ml-1">
                                  {'allowedCnt' in datas
                                    ? datas['allowedCnt']
                                    : 0}
                                  /{datas.permissions.length}
                                </span>
                              </div>
                              <div
                                className="unfold_icon"
                                dangerouslySetInnerHTML={{
                                  __html: svgIcons && svgIcons.unfold_icon,
                                }}
                              ></div>
                              <div
                                className="fold_icon"
                                dangerouslySetInnerHTML={{
                                  __html: svgIcons && svgIcons.fold_icon,
                                }}
                              ></div>
                            </div>
                            <div
                              className={`list_of_sub_modules collapse ${
                                index === 0 ? 'show' : ''
                              }`}
                              id={`panelDiv_${index}`}
                              aria-labelledby="headingOne"
                              data-parent={`#panel_${index}`}
                            >
                              {datas.permissions.length &&
                                datas.permissions.map((datap, i) => (
                                  <React.Fragment>
                                    <div
                                      className="sub_module px-2"
                                      id={`sub_module_${i}`}
                                      key={`sub_module_${i}`}
                                    >
                                      <div
                                        className="sub_module_name"
                                        data-tip={datap.tipvalue}
                                      >
                                        <label
                                          htmlFor={`panelLabel_${index}_${i}`}
                                          className="permission_check_label"
                                        >
                                          {' '}
                                          {datap.label}{' '}
                                        </label>
                                      </div>
                                      <div className="sub_module_permission">
                                        {/* <input type="checkbox" id={`panelLabel_${index}`} className="permission_check" abcdef={`${rolePermissionData[datap.value] ? "yezz" : "noo"}`} checked={rolePermissionData[datap.value] ? true : false} /> */}
                                        <input
                                          type="checkbox"
                                          id={`panelLabel_${index}_${i}`}
                                          name={`panelLabel_${index}_${i}`}
                                          className="permission_check"
                                          checked={datap.allow}
                                          value={datap.allow}
                                          onChange={() =>
                                            checkBoxOnChangeHandler(
                                              datas,
                                              index,
                                              i
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  </React.Fragment>
                                ))}
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                    {!roleDataClicked && (
                      <ResponseInfo
                        title="Select on a role name - to define its Access Rights!"
                        responseImg="noRecord"
                        responseClass="response-info"
                      />
                    )}
                  </div>

                  {roleDataClicked && !roleDataForUpdate.admin_role && (
                    <React.Fragment>
                      <div className="save_btn">
                        {/* <input type="button" className="eep-btn eep-btn-success" value="update" onClick={updatePermission}/> */}
                        {!roleScreenResponseMsg && (
                          <button
                            type="button"
                            className="eep-btn eep-btn-success"
                            onClick={() =>
                              updatePermission(roleID, roleScreenID)
                            }
                          >
                            {' '}
                            Update{' '}
                          </button>
                        )}
                        {roleScreenResponseMsg && (
                          <div className="response-div m-0">
                            <p
                              className={`${roleResponseClassName} response-text`}
                            >
                              {roleScreenResponseMsg}
                            </p>
                          </div>
                        )}
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </div>
              <div
                id="mstooltip"
                className="tooltipbox_wrapper"
              >
                <div className="tooltipbox">
                  <p className="m-0 tlable"></p>
                  <p className="m-0 tcontent"></p>
                </div>
              </div>
            </div>
          </div>
          <div
            id="roleUpdateTab"
            className="tab-pane"
          >
            <div
              className="row"
              id="roleUpdateTab"
            >
              <RoleUserUpdate />
            </div>
          </div>
        </div>
      )}
      {!userRolePermission.adminPanel && (
        <div className="row eep-content-section-data no-gutters">
          <ResponseInfo
            title="Oops! Looks illegal way."
            responseImg="accessDenied"
            responseClass="response-info"
            messageInfo="Contact Administrator."
          />
        </div>
      )}
    </React.Fragment>
  );
};
export default RoleManagement;
