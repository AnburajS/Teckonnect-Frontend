import $ from 'jquery';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import Select from 'react-select';
import { URL_CONFIG } from '../../constants/rest-config';
import { httpHandler } from '../../http/http-interceptor';
import ToggleSidebar from '../../layout/Sidebar/ToggleSidebar';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import FormBuilderComponent from './FormBuilderComponent';
import SurveyPreviewModal from './SurveyPreviewModal';
window.jQuery = $;
window.$ = $;
require('jquery-ui-sortable');
require('formBuilder');
require('formBuilder/dist/form-render.min.js');

const SurveyLibrarayAnswer = () => {
  const getLocation = useLocation();
  const initSurveyData = getLocation.state ? getLocation?.state : null;
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
  const [getData, setgetData] = useState({});
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
      label: 'Survey Vault',
      link: 'app/librarysurvey',
    },
    {
      label: 'SURVEY',
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
    fetchSurveyData();
  }, []);

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

  const fetchSurveyData = () => {
    if (initSurveyData) {
      const obj = {
        url: URL_CONFIG.SHOW_LIBRARY_SURVEY,
        method: 'get',
        params: { id: initSurveyData?.id },
        isLoader: false,
      };
      httpHandler(obj)
        .then((sData) => {
          updateAssignInfo(sData?.data);
        })
        .catch((error) => {
          //const errMsg = error.response?.data?.message;
        });
    }
  };

  const updateAssignInfo = (sData) => {
    if (sData) {
      //setAssignUser(options[1]);
      setSelectedUsers([]);
      setSelectedDepts([]);

      var res = {
        name: '',
        surveyQuestions: [],
      };
      sData?.survey_questions?.map((v) => {
        res['surveyQuestions'].push({ parameters: JSON.stringify(v) });
      });
      res['name'] = sData?.name;
      setgetData({ sData: res });
      // previewHandler(sData)
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

  const publishSurvey = () => {
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
      ...(initSurveyData
        ? { library_added_survey_id: initSurveyData?.id }
        : ''),
    };

    if (jsonData.length > 0) {
      const obj = {
        url: URL_CONFIG.SURVEY,
        method: 'post',
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

  const confirmRepublishSurveyHandler = () => {};

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
                  initSurveyData={getData}
                  isLibrary={true}
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
                  <button
                    type="submit"
                    className="eep-btn eep-btn-success"
                    id="surveySubmit"
                    disabled={btnDisabled}
                    onClick={() => publishSurvey()}
                  >
                    Publish
                  </button>
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

export default SurveyLibrarayAnswer;
