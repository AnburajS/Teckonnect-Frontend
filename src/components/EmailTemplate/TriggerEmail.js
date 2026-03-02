import React, { useEffect, useState } from 'react';
import PageHeader from '../../UI/PageHeader';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import Select from 'react-select';
import {
  getEmailTemplatesList,
  triggerEmail,
} from '../../store/emailTemplateThunk';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';
import { hideModal } from '../../store/modalSlice';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ToolTip from '../../modals/ToolTip';
function TriggerEmail() {
  const [templateData, setTemplateData] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [assignUser, setAssignUser] = useState(null);
  const [assignUserState, setAssignUserState] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [deptOptions, setDeptOptions] = useState([]);
  const [assignDepartmentState, setAssignDepartmentState] = useState(false);
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [usersOptions, setUsersOptions] = useState([]);
  const [readOnly, setReadOnly] = useState(true);
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const { loading, data } = useSelector(
    (state) => state.emailTemplate?.getEmailTemplate
  );
  const showModalState = useSelector((state) => state.modal);
  const dispatch = useDispatch();
  const location = useLocation();

  const [editorContent, setEditorContent] = useState(
    selectedTemplate?.bodyContent || ''
  );

  const routerData = location.state;
  useEffect(() => {
    const temp = data?.response?.reduce((acc, item) => {
      if (
        item?.id === routerData?.response?.id ||
        item?.id === routerData?.data?.id
      ) {
        acc.push({
          value: item?.id,
          label: item?.templateName,
        });
      }
      return acc;
    }, []);

    setTemplateData(temp || []);
  }, [routerData?.response?.id, routerData?.data?.id, data?.response]);
  useEffect(() => {
    setEditorContent(selectedTemplate?.bodyContent || '');
  }, [selectedTemplate]);
  const options = [
    { value: 'Users', label: 'Users' },
    { value: 'Departments', label: 'Departments' },
  ];
  const assignChangeHandler = async (event) => {
    setAssignUser(event);

    setSelectedDepts([]);
    setSelectedUsers([]);

    setUsersOptions([]);
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

  useEffect(() => {
    dispatch(getEmailTemplatesList());
  }, []);
  const handleSelectTemplate = (event) => {
    setTemplateData(event);
  };
  const fetchDepts = async () => {
    const dOptions = [];
    const obj = {
      url: URL_CONFIG.ALLDEPARTMENTS + '?active=true',
      method: 'get',
    };
    await httpHandler(obj)
      .then((dept) => {
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
    return dOptions;
  };
  const fetchUserData = async () => {
    const uOptions = [];
    const obj = {
      url: URL_CONFIG.ALL_USER_DETAILS_FILTER_RESPONSE + '?active=true',
      method: 'get',
    };
    await httpHandler(obj)
      .then((userData) => {
        userData &&
          userData.data.map((res) => {
            if (
              res?.id !== JSON.parse(sessionStorage.getItem('userData'))?.id
            ) {
              uOptions.push({
                label: res.fullName + ' - ' + res.department.name,
                value: res.id,
              });
            }
            return res;
          });

        setUsersOptions([...uOptions]);
      })
      .catch((error) => {
        //const errMsg = error.response?.data?.message;
      });
    return uOptions;
  };
  const deptChangeHandler = (eve) => {
    setSelectedDepts([...eve]);
    setSelectedUsers([]);

    getSelectedDept([...eve]);
  };
  const getSelectedDept = (args) => {
    if (args) {
      const deptArr = [];
      args.map((res) => {
        return deptArr.push(res.value);
      });

      const obj = {
        url: URL_CONFIG.DEPT_USERS,
        method: 'get',
        params: {
          dept: JSON.stringify(deptArr),
          // deptArr.join()
        },
      };

      httpHandler(obj)
        .then((uData) => {
          var uDatas = uData.data;
          setUsersOptions([
            ...uDatas?.map((v) => ({ label: v?.fullName, value: v?.id })),
          ]);
        })
        .catch((error) => {
          //const errMsg = error.response?.data?.message;
        });
    }
  };
  const userChangeHandler = (eve) => {
    setSelectedUsers([...eve]);
    setSelectedDepts([]);
    // handleInputChange([...eve]);
  };
  const handleSubmit = () => {
    // dispatch(triggerEmail({}))

    const payload =
      assignUser?.value === 'Users'
        ? {
            templateId: templateData?.value
              ? templateData?.value
              : templateData?.[0]?.value,
            user: [...selectedUsers?.map((datas) => datas?.value)],
            emailContent: editorContent,
          }
        : {
            templateId: templateData?.value
              ? templateData?.value
              : templateData?.[0]?.value,
            user: [...usersOptions?.map((datas) => datas?.value)],
            emailContent: editorContent,
          };
    dispatch(triggerEmail(payload));
  };
  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'Email Templates',
      link: 'app/templatelist',
    },
    {
      label: `Send Email`,
      link: '',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Send E-Mail',
      })
    );
  }, [breadcrumbArr, dispatch]);

  useEffect(() => {
    const selectedTemplates = data?.response?.find((item) =>
      templateData?.value
        ? item?.id === templateData?.value
        : item?.id === routerData?.response?.id ||
          item?.id === routerData?.data?.id
    );
    setSelectedTemplate(selectedTemplates);
  }, [
    templateData?.value,
    routerData?.response?.id,
    routerData?.data?.id,
    data?.response,
  ]);

  return (
    <div className="p-2">
      {' '}
      <PageHeader
        title={'Send Email'}
        navLinksLeft={
          <Link
            to="/app/templatelist"
            className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg"
            dangerouslySetInnerHTML={{
              __html: svgIcons && svgIcons.lessthan_circle,
            }}
          ></Link>
        }
      />
      {showModalState.type !== null && showModalState.message !== null && (
        <EEPSubmitModal
          data={showModalState}
          className={`modal-addmessage`}
          // hideModal={() => dispatch(hideModal())}
          successFooterData={
            <Link
              to={'/app/templatelist'}
              // state={data?.id ? updateTemplates : templates}
              type="button"
              className="eep-btn  eep-btn-success"
              onClick={() => dispatch(hideModal())}
            >
              Ok
            </Link>
          }
          errorFooterData={
            <button
              type="button"
              className="eep-btn  eep-btn-danger"
              onClick={() => dispatch(hideModal())}
            >
              Close
            </button>
          }
        />
      )}
      <Row>
        <Col
          xs={7}
          className="mr-4 div-select-template"
        >
          <div className=" mb-2">
            <label
              className=" col-form-label fs-20"
              style={{ padding: '7px 8px' }}
            >
              Select Template
            </label>
            <div>
              <Select
                options={
                  data?.response?.map((item) => ({
                    value: item?.id,
                    label: item?.templateName,
                  })) || []
                }
                placeholder="Not Selected"
                classNamePrefix="eep_select_common select"
                className="border_none select-with-bg"
                onChange={(event) => handleSelectTemplate(event)}
                maxMenuHeight={233}
                value={templateData}
              />

              <div className="login_error_div">
                <span
                  className="login_error un_error text-danger ereorMsg ng-binding"
                  style={{ display: 'inline' }}
                ></span>
              </div>
            </div>
          </div>

          <div className="bg-f5f5f5  br-10 my-3">
            <div className="p-4">
              <div className="row justify-content-md-left">
                <div className="col-lg-12 eep_s_select2 surveyBy_div mb-4">
                  <label className="font-helvetica-r c-404040">Assign To</label>
                  <Select
                    options={options}
                    placeholder="Not Selected"
                    classNamePrefix="eep_select_common select"
                    className={`form-control a_designation basic-single p-0`}
                    onChange={(event) => assignChangeHandler(event)}
                    maxMenuHeight={233}
                    value={assignUser}
                    styles={{ border: ' 1px solid #ced4da' }}
                  />
                  <div className="login_error_div">
                    <span
                      className="login_error un_error text-danger ereorMsg ng-binding"
                      style={{ display: 'inline' }}
                    ></span>
                  </div>
                </div>

                {assignUserState && (
                  <div className="col-lg-12 eep_s_select2">
                    <div className="d-flex justify-content-between p-0 align-items-center">
                      <label className="font-helvetica-r c-404040 users_lbl">
                        Users <span className="users_span"></span>
                      </label>
                      <div className="selected_count_disp">
                        <label className="mb-0">
                          {selectedUsers.length + '/' + usersOptions.length}
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
                  <div className="col-lg-12 eep_s_select2">
                    <div className="d-flex justify-content-between p-0 align-items-center">
                      <label className="font-helvetica-r c-404040 departments_lbl">
                        Departments <span className="departments_span"></span>
                      </label>
                      <div className="selected_count_disp">
                        <label className="mb-0">
                          {selectedDepts.length + '/' + deptOptions.length}
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

          {selectedTemplate?.is_password && (
            <ToolTip
              title={`Note: To generate a new password,'{{password}}'
               plug-in to be added in the template.`}
              arrow
              placement="top-start"
              backgroundColor="#82889B"
              color="#FFFFFF"
              fontSize="10px"
            >
              <div className="mt-2 pb-3 fs-12 trigger-error">
                Note: To generate a new password,
                <code>{'{{password}}'}</code> plug-in to be added in the
                template.
              </div>
            </ToolTip>
          )}

          <div className="d-flex justify-content-end gap-2  mt-auto">
            <Link
              className="btn eep-btn eep-btn-cancel "
              type="button"
              to={'/app/templatelist'}
            >
              Cancel
            </Link>
            {console.log(
              (!templateData?.value && !templateData?.[0]?.value) ||
                (assignUser?.value === 'Users'
                  ? selectedUsers?.length === 0
                  : usersOptions?.length === 0),
              selectedUsers,
              usersOptions,
              templateData,
              assignUser
            )}
            <button
              className="btn eep-btn eep-btn-success ml-3"
              style={{ color: '#ffff' }}
              onClick={() => handleSubmit()}
              disabled={
                (!templateData?.value && !templateData?.[0]?.value) ||
                (assignUser?.value === 'Users'
                  ? selectedUsers?.length === 0
                  : usersOptions?.length === 0)
              }
            >
              Send
            </button>
          </div>
        </Col>

        <Col>
          {' '}
          <label
            className=" col-form-label fs-20"
            style={{ padding: '7px 8px' }}
          >
            Preview
          </label>
          <Col
            // xs={3}
            className=" bg-f8f8f8 col-border-radius"
            style={{ height: '95%' }}
          >
            <div className=" p-3 div-react">
              <p className="fs-16 d-flex align-items-center justify-content-between">
                <span> Preview displayed with plug-ins.</span>
                <button
                  className="ml-2 c-c1c1c1 border-none bg-none eep_action_svg"
                  type="button"
                  dangerouslySetInnerHTML={{
                    __html: svgIcons && svgIcons.penciledit,
                  }}
                  onClick={() => setReadOnly(!readOnly)}
                ></button>
              </p>
              <div className="eep-dropdown-divider"></div>
              {/* <p className="fs-12 ">
                {HtmlPreview(selectedTemplate?.bodyContent || '')}
              </p> */}
              <ReactQuill
                className={readOnly ? 'trigger-email-react-quill' : ''}
                readOnly={readOnly}
                value={editorContent}
                onChange={setEditorContent}
                modules={{ toolbar: false }}
              />
            </div>
          </Col>
        </Col>
      </Row>
    </div>
  );
}

export default TriggerEmail;
