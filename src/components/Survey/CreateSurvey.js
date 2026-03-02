import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';
import ToggleSidebar from '../../layout/Sidebar/ToggleSidebar';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import FormBuilderComponent from './FormBuilderComponent';
import SurveyPreviewModal from './SurveyPreviewModal';
import $ from 'jquery';
window.jQuery = $;
window.$ = $;
require('jquery-ui-sortable');
require('formBuilder');
require('formBuilder/dist/form-render.min.js');

const CreateSurvey = () => {
  const getLocation = useLocation();
  const initSurveyData = getLocation.state
    ? getLocation.state.surveyData
    : null;
  const dispatch = useDispatch();
  const [assignUserState, setAssignUserState] = useState(false);
  const [assignDepartmentState, setAssignDepartmentState] = useState(false);
  const [assignUser, setAssignUser] = useState(null);
  const [toggleClass, setToggleClass] = useState(true);
  const [usersOptions, setUsersOptions] = useState([]);
  const [deptOptions, setDeptOptions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [jsonData, setJsonData] = useState({});
  const [surveyTitle, setSurveyTitle] = useState(null);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

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
      label: 'Survey',
      link: 'app/mysurvey',
    },
    {
      label: initSurveyData
        ? initSurveyData.isQuestionBank
          ? 'CREATE SURVEY'
          : 'UPDATE SURVEY'
        : 'CREATE SURVEY',
      link: '#',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Create Survey',
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
    if (initSurveyData) {
      fetchUserData();
      fetchDepts();
      if (initSurveyData && !initSurveyData.isQuestionBank) {
        fetchSurveyData(initSurveyData.sData);
      }
    } else {
      setAssignUser(null);
      setSelectedDepts([]);
      setSelectedUsers([]);
      setAssignUserState(false);
      setAssignDepartmentState(false);
    }
  }, [initSurveyData]);

  const options = [
    { value: 'Users', label: 'Users' },
    { value: 'Departments', label: 'Departments' },
  ];

  const assignChangeHandler = (event) => {
    setAssignUser(event);
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

  const fetchSurveyData = (sInfo) => {
    if (sInfo) {
      const obj = {
        url: URL_CONFIG.SURVEY_MODIFY,
        method: 'get',
        params: { id: sInfo.id },
      };
      httpHandler(obj)
        .then((sData) => {
          updateAssignInfo(sData.data);
        })
        .catch((error) => {
          //const errMsg = error.response?.data?.message;
        });
    }
  };

  const updateAssignInfo = (sData) => {
    if (sData) {
      let assignData = [];
      if (sData.deptList && sData.deptList.length > 0) {
        assignData = sData.deptList.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        setAssignUser(options[1]);
        setSelectedUsers([]);
        setSelectedDepts(assignData);
        setAssignUserState(false);
        setAssignDepartmentState(true);
      }
      if (sData.userList && sData.userList.length > 0) {
        assignData = sData.userList.map((item) => {
          return {
            label: item.fullName,
            value: item.id,
          };
        });
        setAssignUser(options[0]);
        setSelectedDepts([]);
        setSelectedUsers(assignData);
        setAssignUserState(true);
        setAssignDepartmentState(false);
      }
    }
  };

  const fetchUserData = () => {
    const obj = {
      url: URL_CONFIG.ALL_USER_DETAILS_FILTER_RESPONSE + '?active=true',
      method: 'get',
    };
    httpHandler(obj)
      .then((userData) => {
        const uOptions = [];
        userData &&
          userData.data.map((res) => {
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

  const getJsonData = (arg) => {
    setJsonData(arg);
  };

  const getSurveyTitle = (arg) => {
    setSurveyTitle(arg);
  };

  const previewHandler = () => {
    //const wrap = document.getElementById("prevSurveyModal");
    const wrap = $('#prevSurveyModal');
    $('#prevSurveyModal').html('');
    //wrap.innerHTML = "";
    if (jsonData !== undefined && jsonData.length) {
      wrap.formRender({
        formData: jsonData,
      });
    } else {
      var no_data = `<div className='text-center'><img src=${
        process.env.PUBLIC_URL + '/images/no-data.jpg'
      } className='w-50' /></div>`;
      $('#prevSurveyModal').html(no_data);
      //wrap.innerHTML = no_data;
    }
  };

  const publishSurvey = (isUpdate) => {
    let userIds = [],
      deptIds = [];
    selectedUsers.map((res) => {
      userIds.push(res.value);
      return res;
    });

    selectedDepts.map((res) => {
      deptIds.push(res.value);
      return res;
    });

    const requestData = {
      name: surveyTitle,
      description: null,
      departmentIds: deptIds,
      userIds: userIds,
      questions: jsonData,
    };

    if (isUpdate) {
      requestData['id'] = initSurveyData?.id ?? initSurveyData?.sData?.id;
    }

    if (jsonData.length > 0) {
      const obj = {
        url: URL_CONFIG.SURVEY,
        method: isUpdate ? 'put' : 'post',
        payload: requestData,
      };
      httpHandler(obj)
        .then((response) => {
          setShowModal({
            ...showModal,
            type: 'success',
            success: 'Survey Created!',
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
    } else {
      setShowModal({
        ...showModal,
        type: 'danger',
        message: 'Select at least one question to proceed..',
      });
    }
  };

  const confirmRepublishSurveyHandler = () => {
    console.log('Clicked confirmRepublishSurveyHandler');
  };

  useEffect(() => {
    setBtnDisabled(true);
    if (
      surveyTitle &&
      surveyTitle !== '' &&
      assignUser &&
      Object.keys(assignUser).length > 0
    ) {
      if (assignUser.value === 'Users') {
        setBtnDisabled(selectedUsers.length > 0 ? false : true);
      } else if (assignUser.value === 'Departments') {
        setBtnDisabled(selectedDepts.length > 0 ? false : true);
      } else {
        setBtnDisabled(true);
      }
    }
  }, [surveyTitle, jsonData, assignUser, selectedUsers, selectedDepts]);

  return (
    <React.Fragment>
      {showModal.type !== null && showModal.message !== null && (
        <EEPSubmitModal
          data={showModal}
          className={`modal-addmessage`}
          hideModal={hideModal}
          successFooterData={
            <Link
              to="/app/mysurvey"
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
              Got It
            </button>
          }
        ></EEPSubmitModal>
      )}
      <div className="eep-container-sidebar h-100 eep_scroll_y">
        <div className="container-sm eep-container-sm">
          <div
            className={`row eep-create-survey-div eep_with_sidebar ${
              toggleClass ? 'side_open' : ''
            } vertical-scroll-snap`}
          >
            <div className="eep_with_content">
              <div className="survey-question_div">
                <FormBuilderComponent
                  getJsonData={getJsonData}
                  getSurveyTitle={getSurveyTitle}
                  initSurveyData={initSurveyData}
                />

                <div className="bg-f5f5f5 eep_s_assignto br-10 mb-3">
                  <div className="p-4">
                    <div className="row justify-content-md-left">
                      <div className="col-lg-10 eep_s_select2 surveyBy_div mb-4">
                        <label className="font-helvetica-r c-404040">
                          Assign To
                        </label>
                        <Select
                          options={options}
                          placeholder="Not Selected"
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
                            placeholder="Not Yet Select"
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
                            placeholder="Not Yet Select"
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

                <div className="d-flex justify-content-center s_create_action mb-3">
                  {!initSurveyData && (
                    <button
                      type="submit"
                      className="eep-btn eep-btn-success"
                      id="surveySubmit"
                      disabled={btnDisabled}
                      onClick={() => publishSurvey(false)}
                    >
                      Publish Survey
                    </button>
                  )}
                  {initSurveyData && !initSurveyData.isQuestionBank && (
                    <button
                      type="submit"
                      className="eep-btn eep-btn-success"
                      id="surveySubmit"
                      disabled={btnDisabled}
                      onClick={() => publishSurvey(true)}
                    >
                      Update
                    </button>
                  )}
                  {initSurveyData && initSurveyData.isQuestionBank && (
                    <button
                      type="submit"
                      className="eep-btn eep-btn-success"
                      id="surveySubmit"
                      disabled={btnDisabled}
                      onClick={() => publishSurvey(false)}
                    >
                      Publish Survey{' '}
                    </button>
                  )}
                  <div
                    className="s_preview_div ml-4 text-center c1"
                    id="s_preview_div"
                  >
                    <button
                      type="button"
                      data-toggle="modal"
                      data-target="#surveyPreviewModal"
                      id="surveySubmitPreview"
                      className="eep-btn eep-btn-cancel eep-btn-xsml mr-2"
                      onClick={previewHandler}
                    >
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <ToggleSidebar
              toggleSidebarType="survey"
              sideBarClass={sideBarClass}
            />
          </div>
        </div>
      </div>

      <SurveyPreviewModal
        title={surveyTitle}
        assignUser={assignUser}
        selectedDepts={selectedDepts}
        selectedUsers={selectedUsers}
        isRepublish={false}
        confirmRepublishSurveyHandler={confirmRepublishSurveyHandler}
      />
    </React.Fragment>
  );
};

export default CreateSurvey;
