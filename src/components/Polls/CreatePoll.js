import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import PageHeader from '../../UI/PageHeader';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';
import ToggleSidebar from '../../layout/Sidebar/ToggleSidebar';
import { formatFilterDate } from '../../shared/SharedService';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import ResponseInfo from '../../UI/ResponseInfo';
import { hasDuplicates } from '../../constants/utills';
import { faL } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment/moment';

const CreatePoll = () => {
  const getLocation = useLocation();
  const initPollData = getLocation.state ? getLocation.state.pollData : null;
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission,
  );
  const [assignUserState, setAssignUserState] = useState(false);
  const [assignDepartmentState, setAssignDepartmentState] = useState(false);
  const [assignUser, setAssignUser] = useState(null);
  const [toggleClass, setToggleClass] = useState(true);
  const [usersOptions, setUsersOptions] = useState([]);
  const [deptOptions, setDeptOptions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedDepts, setSelectedDepts] = useState([]);

  const [fileMessage, setFileMessage] = useState('');
  const [fileClassName, setFileClassName] = useState('');
  const [type, setType] = useState({
    value: 'MultipleChoices',
    label: 'Multiple Choices',
  });
  const [multipleChoiceArr, setMultipleChoiceArr] = useState([
    { value: '' },
    { value: '' },
  ]);
  const [textAreaArr, setTextAreaArr] = useState([
    { value: '' },
    { value: '' },
  ]);
  const [endDate, setEndDate] = useState(null);
  const [pollTitle, setPollTitle] = useState(null);
  const [isPollUpdate, setIsPollUpdate] = useState(false);
  const [enableCreatePollBtn, setEnableCreatePollBtn] = useState(false);
  const [enableCreatePollBtnByOpt, setEnableCreatePollBtnByOpt] =
    useState(false);
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  const ChoiceType = [
    { value: 'MultipleChoices', label: 'Multiple Choices' },
    { value: 'TextareaChoices', label: 'Textarea Choices' },
  ];
  const options = [
    { value: 'Users', label: 'Users' },
    { value: 'Departments', label: 'Departments' },
  ];

  const dispatch = useDispatch();

  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'Engage',
      link: 'app/engage',
    },
    {
      label: 'POLL',
      link: 'app/closedpolls',
    },
    {
      label: initPollData ? 'UPDATE POLL' : 'CREATE POLL',
      link: '',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Create Poll',
      }),
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  }, []);

  useEffect(() => {
    if (initPollData) {
      fetchUserData();
      const { name, type, options, endDate, pollResponse } = initPollData;
      setPollTitle(name);
      const ChoiceTypeTemp = ChoiceType.filter((res) => res.value === type);
      setType(ChoiceTypeTemp[0]);
      const optionsTemp = JSON.parse(options).map((item) => {
        return { value: item.option };
      });
      if (type === 'TextareaChoices') {
        setMultipleChoiceArr([]);
        setTextAreaArr(optionsTemp);
      }
      if (type === 'MultipleChoices') {
        setTextAreaArr([]);
        setMultipleChoiceArr(optionsTemp);
      }
      setEndDate(new Date(endDate));
      let userOptionsTemp = [];
      if (pollResponse) {
        setAssignUserState(true);
        setAssignUser({ value: 'Users', label: 'Users' });
        userOptionsTemp =
          Array.isArray(pollResponse) &&
          pollResponse?.map((item) => {
            return {
              value: item?.userId?.id,
              label:
                item?.userId?.firstname +
                ' ' +
                item?.userId?.lastname +
                ' - ' +
                item?.userId?.department?.name,
            };
          });
        setSelectedUsers([...userOptionsTemp]);
        setSelectedDepts([]);
      }
      setIsPollUpdate(true);
    }
  }, [initPollData]);

  useEffect(() => {
    let enableFlag = false;
    if (pollTitle && endDate) {
      let optionsFlag = false;
      if (type?.value === 'TextareaChoices') {
        const validTextArea = textAreaArr.filter((res) => res.value !== '');
        if (validTextArea.length >= 2) {
          optionsFlag = true;
        } else {
          optionsFlag = false;
        }
      } else {
        const validMultipleChoiceArr = multipleChoiceArr.filter(
          (res) => res.value !== '',
        );
        if (validMultipleChoiceArr.length >= 2) {
          optionsFlag = true;
        } else {
          optionsFlag = false;
        }
      }

      if (assignUser) {
        if (assignUserState && !assignDepartmentState) {
          if (selectedUsers.length) {
            enableFlag = true;
          }
        } else if (!assignUserState && assignDepartmentState) {
          if (selectedDepts.length) {
            enableFlag = true;
          }
        }
      }
      enableFlag = optionsFlag && enableFlag ? true : false;
    }
    setEnableCreatePollBtn(enableFlag);
  }, [
    type,
    pollTitle,
    endDate,
    multipleChoiceArr,
    textAreaArr,
    assignUser,
    assignUserState,
    assignDepartmentState,
    selectedUsers,
    selectedDepts,
  ]);

  const assignChangeHandler = (event) => {
    setAssignUser(event);
    setSelectedUsers([]);
    setSelectedDepts([]);

    if (event.value === 'Users') {
      setAssignUserState(true);
      setAssignDepartmentState(false);
      fetchUserData();
    } else if (event.value === 'Departments') {
      setAssignUserState(false);
      setAssignDepartmentState(true);
      fetchDepts();
    }
  };

  const fetchUserData = () => {
    const obj = {
      url: URL_CONFIG.GETALLUSERS + '?active=true',
      method: 'get',
    };
    httpHandler(obj)
      .then((userData) => {
        const uOptions = [];
        userData &&
          userData.data.map((res) => {
            uOptions.push({
              label: res.firstname + ' - ' + res.department.name,
              value: res.id,
            });
            return res;
          });
        setUsersOptions([...uOptions]);
      })
      .catch((error) => {});
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
      .catch((error) => {});
  };

  const userChangeHandler = (eve) => {
    setSelectedUsers([...eve]);
    setSelectedDepts([]);
  };

  const deptChangeHandler = (eve) => {
    setSelectedDepts([...eve]);
    setSelectedUsers([]);
  };

  const sideBarClass = (tooglestate) => {
    setToggleClass(tooglestate);
  };

  const ChoiceTypeFuntion = (e) => {
    setType(e);
    setMultipleChoiceArr([
      {
        value: '',
      },
      {
        value: '',
      },
    ]);
    setTextAreaArr([
      {
        value: '',
      },
      {
        value: '',
      },
    ]);
  };

  const addMoreHandler = (copy = false, index = null) => {
    if (type?.value === 'MultipleChoices') {
      setMultipleChoiceArr((prev) => {
        const prevData = [...prev];
        prevData.push({
          value: copy && index !== null ? prevData[index].value : '',
        });
        return prevData;
      });
    } else {
      setTextAreaArr((prev) => {
        const prevData = [...prev];
        prevData.push({
          value: copy && index !== null ? prevData[index].value : '',
        });
        return prevData;
      });
    }
  };

  const deleteHandler = (index) => {
    if (type?.value === 'MultipleChoices') {
      setMultipleChoiceArr((prev) => {
        const prevData = [...prev];
        prevData.splice(index, 1);
        return prevData;
      });
    } else {
      setTextAreaArr((prev) => {
        const prevData = [...prev];
        prevData.splice(index, 1);
        return prevData;
      });
    }
  };

  const setMultiChoiceValueHanlder = (e, index) => {
    multipleChoiceArr[index].value = e.target.value;
    setMultipleChoiceArr([...multipleChoiceArr]);
  };

  const setTextAreaValueHanlder = (e, index) => {
    textAreaArr[index].value = e.target.value;
    setTextAreaArr([...textAreaArr]);
  };

  const startDateOnChange = (date) => {
    setEndDate(date);
  };

  const createHandler = (isUpdate, pData) => {
    let userIds = [];
    let departmentIds = [];
    let optionsVal = [];
    let requestData = {
      name: pollTitle,
      active: true,
      endDate: formatFilterDate(endDate),
    };
    if (type && type?.value === 'MultipleChoices') {
      requestData['type'] = type?.value;
      optionsVal = multipleChoiceArr.map((item) => {
        return { option: item.value };
      });
      requestData['options'] = optionsVal;
    }
    if (type && type?.value === 'TextareaChoices') {
      requestData['type'] = type?.value;
      optionsVal = textAreaArr.map((item) => {
        return { option: item.value };
      });
      requestData['options'] = optionsVal;
    }
    if (selectedUsers && selectedUsers.length > 0) {
      requestData['departmentIds'] = [];
      userIds = selectedUsers.map((item) => {
        return item.value;
      });
      requestData['userIds'] = userIds;
    }
    if (selectedDepts && selectedDepts.length > 0) {
      requestData['userIds'] = [];
      departmentIds = selectedDepts.map((item) => {
        return item.value;
      });
      requestData['departmentIds'] = departmentIds;
    }
    let obj;
    if (!isUpdate) {
      obj = {
        url: URL_CONFIG.POLL,
        method: 'post',
        payload: requestData,
      };
    }
    if (isUpdate) {
      requestData['id'] = pData.id;
      obj = {
        url: URL_CONFIG.POLL,
        method: 'put',
        payload: requestData,
      };
    }
    httpHandler(obj)
      .then((response) => {
        setShowModal({
          ...showModal,
          type: 'success',
          success: isUpdate ? 'Poll Update!' : 'Poll Created!',
          message: response?.data?.message,
        });
      })
      .catch((error) => {
        const errMsg =
          error.response?.data?.message !== undefined
            ? error.response?.data?.message
            : 'Something went wrong contact administarator';
        setShowModal({
          ...showModal,
          type: 'danger',
          message: errMsg,
        });
      });
  };

  const CustomInputStartDate = React.forwardRef(({ value, onClick }, ref) => {
    return (
      <div
        className="input-group"
        onClick={onClick}
        ref={ref}
        style={{ cursor: 'pointer' }}
      >
        <button className="form-control border_none text-left p_enddate">
          {value ? value : 'DD/MM/YYYY'}
        </button>
        <span className="eep_addon_separator"></span>
        <span
          className="input-group-addon"
          dangerouslySetInnerHTML={{
            __html: svgIcons && svgIcons.calendar_icon,
          }}
        ></span>
      </div>
    );
  });
  useEffect(() => {
    const sourceArray =
      multipleChoiceArr.filter((item) => item.value !== '').length !== 0
        ? multipleChoiceArr
        : textAreaArr;

    const isDuplicate = hasDuplicates(sourceArray, 'value');
    if (multipleChoiceArr?.find((val) => val?.value === '')) {
      // setFileMessage('Please fill in all options.');
      setFileClassName('mt-1 mb-3 ml-1 eep-text-warn');
      setEnableCreatePollBtnByOpt(true);
    } else {
      if (isDuplicate) {
        setFileMessage('Please remove duplicate options.');
        setFileClassName('mt-1 mb-3 ml-1 eep-text-warn');
        setEnableCreatePollBtnByOpt(true);
      } else {
        setFileMessage('');
        setFileClassName('');
        setEnableCreatePollBtnByOpt(false);
      }
    }
  }, [multipleChoiceArr, textAreaArr]);
  const hasDuplicates = (arr, key) => {
    const seen = new Set();
    for (let item of arr) {
      const value = item[key];
      if (seen.has(value)) {
        return true;
      }
      seen.add(value);
    }
    return false;
  };

  const discardHandler = () => {
    setPollTitle('');
    setType({ value: 'MultipleChoices', label: 'Multiple Choices' });

    setMultipleChoiceArr([{ value: '' }, { value: '' }]);
    setTextAreaArr([{ value: '' }, { value: '' }]);

    setAssignUser(null);
    setAssignUserState(false);
    setAssignDepartmentState(false);
    setSelectedUsers([]);
    setSelectedDepts([]);

    setEndDate(null);

    setFileMessage('');
    setFileClassName('');
    setEnableCreatePollBtn(false);
    setEnableCreatePollBtnByOpt(false);
  };

  return (
    <React.Fragment>
      {userRolePermission.pollCreate && (
        <React.Fragment>
          <PageHeader title="New Poll" />
          {showModal.type !== null && showModal.message !== null && (
            <EEPSubmitModal
              data={showModal}
              className={`modal-addmessage`}
              hideModal={hideModal}
              successFooterData={
                <Link
                  to="/app/activepolls"
                  type="button"
                  className="eep-btn eep-btn-xsml eep-btn-success"
                >
                  Continue
                </Link>
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
          <div
            className={`row eep-create-survey-div eep_scroll_y eep_with_sidebar vertical-scroll-snap ${
              toggleClass ? 'side_open' : ''
            }`}
          >
            <div className="eep_with_content p-0">
              <div className="col-md-12">
                <div className="row poll-title-bar mb-3 align-items-center pollTopDiv">
                  <div className="col-md-8 col-lg-9 col-xs-12 col-sm-12 align-self-end">
                    <textarea
                      className="form-control poll-title border_none px-0 mb-3"
                      name="poll-title"
                      rows="1"
                      placeholder="Enter Poll Title"
                      value={pollTitle}
                      maxLength={255}
                      onChange={(evt) => setPollTitle(evt.target.value)}
                    ></textarea>
                    <div className="pollMultipleChoice mb-3">
                      {type?.value === 'MultipleChoices' && (
                        <div className="row no-gutters c_pollAns_whole_div p_multiOptions_div pollTypeCheck">
                          {multipleChoiceArr.map((res, index) => {
                            return (
                              <div
                                key={'choice_' + index}
                                className="c_pollAns_div"
                              >
                                <div className="p_editable_div">
                                  <div className="radio_circle_div mr-2">
                                    <span className="radio_circle"></span>
                                  </div>
                                  <input
                                    type="text"
                                    className="form-control border_none"
                                    placeholder="Add Choice"
                                    value={res.value}
                                    maxLength={120}
                                    onChange={(e) =>
                                      setMultiChoiceValueHanlder(e, index)
                                    }
                                  />
                                  <div className="pollAns_action_div">
                                    <div
                                      className="dlt_svg ml-2"
                                      title="Delete"
                                      dangerouslySetInnerHTML={{
                                        __html:
                                          svgIcons && svgIcons.delete_icon,
                                      }}
                                      onClick={() => deleteHandler(index)}
                                    ></div>
                                    <div
                                      className="copy_svg ml-2"
                                      title="Copy"
                                      dangerouslySetInnerHTML={{
                                        __html: svgIcons && svgIcons.copy_icon,
                                      }}
                                      onClick={() =>
                                        addMoreHandler(true, index)
                                      }
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {type?.value === 'TextareaChoices' && (
                        <div className="row no-gutters c_pollAns_whole_div p_textareaOptions_div pollTypeCheck">
                          {textAreaArr.map((res, index) => {
                            return (
                              <div
                                key={'textArea_' + index}
                                className="c_pollAns_div"
                              >
                                <div className="p_editable_div">
                                  <div className="radio_circle_div mr-2">
                                    <span className="radio_circle"></span>
                                  </div>
                                  <textarea
                                    className="form-control border_none pollOptionValue"
                                    placeholder="Add Choice"
                                    value={res.value}
                                    maxLength={255}
                                    onChange={(e) =>
                                      setTextAreaValueHanlder(e, index)
                                    }
                                  ></textarea>
                                  <div className="pollAns_action_div">
                                    <div
                                      className="dlt_svg ml-2"
                                      title="Delete"
                                      dangerouslySetInnerHTML={{
                                        __html:
                                          svgIcons && svgIcons.delete_icon,
                                      }}
                                      onClick={() => deleteHandler(index)}
                                    ></div>
                                    <div
                                      className="copy_svg ml-2"
                                      title="Copy"
                                      dangerouslySetInnerHTML={{
                                        __html: svgIcons && svgIcons.copy_icon,
                                      }}
                                      onClick={() =>
                                        addMoreHandler(true, index)
                                      }
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {enableCreatePollBtnByOpt && (
                        <div className={fileClassName}>{fileMessage}</div>
                      )}

                      <div className="row no-gutters c_pollAddmore_whole_div">
                        <div
                          className="col-md-8 col-lg-8 col-xs-12 col-sm-12 c_pollAddmore_div"
                          title="Add New Option"
                        >
                          <div
                            className="p_editable_div eep-svg-hover"
                            onClick={addMoreHandler}
                          >
                            <div
                              className="pollAns_add_div mr-2"
                              dangerouslySetInnerHTML={{
                                __html: svgIcons && svgIcons.plus_sm,
                              }}
                            ></div>
                            <label className="mb-0 p_addmore_lbl">
                              Add More
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-f5f5f5 br-10 mb-3">
                      <div className="p-4">
                        <div className="row justify-content-md-left">
                          <div className="col-lg-10 eep_s_select2 surveyBy_div mb-4">
                            <label className="font-helvetica-r c-404040">
                              Assign To
                            </label>
                            <Select
                              options={options}
                              value={assignUser}
                              placeholder="Not Selected"
                              classNamePrefix="eep_select_common select"
                              className={`form-control a_designation basic-single p-0`}
                              onChange={(event) => assignChangeHandler(event)}
                              maxMenuHeight={233}
                            />
                            <div className="login_error_div">
                              <span
                                className="login_error un_error text-danger ereorMsg ng-binding"
                                style={{ display: 'inline' }}
                              ></span>
                            </div>
                          </div>

                          {assignUserState && (
                            <div className="col-lg-10 eep_s_select2">
                              <div className="d-flex justify-content-between p-0 align-items-center">
                                <label className="font-helvetica-r c-404040 users_lbl">
                                  Users <span className="users_span"></span>
                                </label>
                                <div className="selected_count_disp">
                                  <label className="mb-0">
                                    {selectedUsers.length +
                                      '/' +
                                      usersOptions.length}
                                  </label>
                                </div>
                              </div>
                              <Select
                                options={[
                                  { label: 'Select All', value: 'all' },
                                  ...usersOptions,
                                ]}
                                placeholder="Not Selected"
                                classNamePrefix="eep_select_common select"
                                className="border_none br-8 bg-white"
                                onChange={(event) => {
                                  event.length &&
                                  event.find((option) => option.value === 'all')
                                    ? userChangeHandler(usersOptions)
                                    : userChangeHandler(event);
                                }}
                                isClearable={true}
                                isMulti={true}
                                value={selectedUsers}
                                style={{ height: 'auto' }}
                                maxMenuHeight={150}
                              />
                              <div className="login_error_div">
                                <span
                                  className="login_error un_error text-danger ereorMsg ng-binding"
                                  style={{ display: 'inline' }}
                                ></span>
                              </div>
                            </div>
                          )}

                          {assignDepartmentState && (
                            <div className="col-lg-10 eep_s_select2">
                              <div className="d-flex justify-content-between p-0 align-items-center">
                                <label className="font-helvetica-r c-404040 departments_lbl">
                                  Departments{' '}
                                  <span className="departments_span"></span>
                                </label>
                                <div className="selected_count_disp">
                                  <label className="mb-0">
                                    {selectedDepts.length +
                                      '/' +
                                      deptOptions.length}
                                  </label>
                                </div>
                              </div>
                              <Select
                                options={[
                                  { label: 'Select All', value: 'all' },
                                  ...deptOptions,
                                ]}
                                placeholder="Not Selected"
                                classNamePrefix="eep_select_common select"
                                className="border_none br-8 bg-white"
                                onChange={(event) => {
                                  event.length &&
                                  event.find((option) => option.value === 'all')
                                    ? deptChangeHandler(deptOptions)
                                    : deptChangeHandler(event);
                                }}
                                isClearable={true}
                                isMulti={true}
                                style={{ height: 'auto' }}
                                maxMenuHeight={150}
                                value={selectedDepts}
                              />
                              <div className="login_error_div">
                                <span
                                  className="login_error un_error text-danger ereorMsg ng-binding"
                                  style={{ display: 'inline' }}
                                ></span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row no-gutters c_pollAction_div">
                      <div className="col-md-12">
                        <div className="d-flex justify-content-center">
                          <button
                            type="button"
                            className="eep-btn eep-btn-cancel eep-btn-nofocus eep-btn-xsml mr-3"
                            onClick={discardHandler}
                          >
                            Discard
                          </button>

                          {!isPollUpdate && (
                            <button
                              type="submit"
                              className="eep-btn eep-btn-success eep-btn-nofocus eep-btn-xsml"
                              id="create_poll_actn"
                              onClick={() => createHandler(false, {})}
                              disabled={
                                !enableCreatePollBtn || enableCreatePollBtnByOpt
                              }
                            >
                              Create
                            </button>
                          )}
                          {isPollUpdate && (
                            <button
                              type="submit"
                              className="eep-btn eep-btn-success eep-btn-nofocus eep-btn-xsml"
                              id="update_poll_actn"
                              onClick={() => createHandler(true, initPollData)}
                              disabled={
                                !enableCreatePollBtn || enableCreatePollBtnByOpt
                              }
                            >
                              Update
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-lg-3 col-xs-12 col-sm-12 c_pollBy_div align-self-start bg-f5f5f5 br-10 p-3">
                    <div className="poll_input_div">
                      <label className="font-helvetica-m poll_dt_lbl c-404040 w-100">
                        Select Poll Type
                      </label>
                      <Select
                        options={ChoiceType}
                        value={type}
                        placeholder="Not Selected"
                        classNamePrefix="eep_select_common select"
                        className={`form-control a_designation basic-single p-0 mb-2`}
                        onChange={(event) => ChoiceTypeFuntion(event)}
                        maxMenuHeight={233}
                      />
                    </div>
                    <div className="eep-dropdown-divider"></div>
                    <div className="poll_dt_div">
                      <label className="font-helvetica-m poll_dt_lbl c-404040">
                        Set Expiry Date
                      </label>
                      <div
                        className="eepCustomDatepicker flex-grow-1"
                        id="p_enddate_div"
                      >
                        <DatePicker
                          selected={endDate}
                          className="date-picker"
                          calendarClassName="eep-date-picker"
                          onChange={(date) => startDateOnChange(date)}
                          customInput={<CustomInputStartDate />}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="DD/MM/YYYY"
                          minDate={moment().toDate()}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ToggleSidebar
              toggleSidebarType="polls"
              sideBarClass={sideBarClass}
            />
          </div>
        </React.Fragment>
      )}
      {!userRolePermission.pollCreate && (
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

export default CreatePoll;
