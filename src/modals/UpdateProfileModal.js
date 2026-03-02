import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import ReactTooltip from 'react-tooltip';
import { URL_CONFIG } from '../constants/rest-config';
import { httpHandler } from '../http/http-interceptor';

const UpdateProfileModal = (props) => {
  const [togglePWIcon, setTogglePWIcon] = useState(true);
  const [toggleNewPWIcon, setToggleNewPWIcon] = useState(true);
  const [pwdResponseClassName, setPWDResponseClassName] = useState('');
  const [pwdResponseErr, setPWDResponseErr] = useState('');
  const [contactResponseErr, setContactResponseErr] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassWordTouched, setCurrentPassWordTouched] = useState(false);
  const [newPassWordTouched, setNewPasswordTouched] = useState(false);
  const [confirmPassWordTouched, setConfirmPasswordTouched] = useState(false);
  const [contactNumber, setContactNumber] = useState('');
  const [disable, setDisable] = useState(true);
  const [formIsValid, setFormIsValid] = useState(false);
  const [currUserData, setCurrUserData] = useState({});
  const pwBgImage = togglePWIcon
    ? '/images/pw_hide.svg'
    : '/images/pw_show.svg';
  const newPwBgImage = toggleNewPWIcon
    ? '/images/pw_hide.svg'
    : '/images/pw_show.svg';
  const [countryCodeData, setCountryCodeData] = useState([]);
  const [countryCodeDefault, setCountryCodeDefault] = useState({
    value: '+91',
    label: '+91',
  });
  const [defCountryCode, setDefCountryCode] = useState(null);
  const [countryCode, setCountryCode] = useState(countryCodeDefault);
  const [showSelect, setShowSelect] = useState(false);
  const passMaxLength = 16;
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);

  const passwordToggleHandler = () => {
    setTogglePWIcon(!togglePWIcon);
  };

  const newPasswordToggleHandler = () => {
    setToggleNewPWIcon(!toggleNewPWIcon);
  };

  const oldPWDChangeHandler = (event) => {
    setCurrentPassword(event.target.value);
    setCurrentPassWordTouched(true);
  };

  const newPWDChangeHandler = (event) => {
    setNewPassword(event.target.value);
    setNewPasswordTouched(true);
  };

  const confirmPWDChangeHandler = (event) => {
    setConfirmPassword(event.target.value);
    setConfirmPasswordTouched(true);
  };

  useEffect(() => {
    setDisable(true);
    setFormIsValid(false);
    if (currentPassWordTouched) {
    }

    if (newPassWordTouched && confirmPassWordTouched) {
      setPWDResponseClassName('');
      setPWDResponseErr('');
      if (newPassword !== confirmPassword) {
        setPWDResponseClassName('response-err');
        setPWDResponseErr('Passwords don’t match.');
      }
      if (newPassword === confirmPassword) {
        setDisable(false);
        setFormIsValid(true);
      }
    }
  }, [currentPassword, newPassword, confirmPassword]);

  const fetchCurrentUserData = () => {
    const userData = sessionStorage.userData
      ? JSON.parse(sessionStorage.userData)
      : {};
    const obj = {
      url: URL_CONFIG.GETUSER,
      method: 'get',
      params: { id: userData.id },
    };
    httpHandler(obj)
      .then((uData) => {
        setCurrUserData(uData.data);
      })
      .catch((error) => {
        const errMsg = error.response?.data?.message;
      });
  };

  useEffect(() => {
    fetchCurrentUserData();
  }, []);

  useEffect(() => {
    setShowSelect(false);
    setContactNumber(currUserData.telephoneNumber);
    const initCountryCode = currUserData.countryCode
      ? { value: currUserData.countryCode, label: currUserData.countryCode }
      : countryCodeDefault;
    setDefCountryCode(initCountryCode);
    setTimeout(() => {
      setShowSelect(true);
    }, 500);
  }, [currUserData, countryCodeDefault]);

  const fetchCountryCodeData = () => {
    fetch(`${process.env.PUBLIC_URL}/data/countryCodes.json`)
      .then((response) => response.json())
      .then((data) => {
        setCountryCodeData(data.countryCode.values);
        setCountryCodeDefault(data.countryCode.default);
      });
  };
  useEffect(() => {
    fetchCountryCodeData();
  }, []);

  const formSubmissionHandler = (event) => {
    event.preventDefault();
    // const userData = sessionStorage.userData ? JSON.parse(sessionStorage.userData) : {};

    let options = {
      // userId: userData.id,
      // currentPassword: currentPassword,
      // newPassword: newPassword,
      new_password: newPassword,
      old_password: currentPassword,
    };

    if (formIsValid) {
      const obj = {
        url: URL_CONFIG.AUTH_REST_PASSWORD_URL,
        method: 'patch',
        payload: options,
        isAuth: true,
      };
      httpHandler(obj)
        .then((resp) => {
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          const respMsg = 'Password updated successfully!';
          setPWDResponseClassName('response-succ');
          setPWDResponseErr(respMsg);
        })
        .catch((error) => {
          const errMsg = error?.response?.data?.message;
          setPWDResponseClassName('response-err');
          setPWDResponseErr(errMsg);
        });
    }
  };

  const contactNumberChangeHandler = (event) => {
    if (!isNaN(+event.target.value)) {
      setContactNumber(event.target.value);
    }
  };

  const onChangeCountryHandler = (event) => {
    setCountryCode(event);
  };

  const contactFormSubmissionHandler = (event) => {
    event.preventDefault();
    const userData = sessionStorage.userData
      ? JSON.parse(sessionStorage.userData)
      : {};
    const payload = {
      telephoneNumber: contactNumber,
      countryCode: countryCode.value,
      id: userData.id,
    };
    // delete currUserData.createdAt;
    // delete currUserData.createdBy;
    // delete currUserData.department.createdBy;
    // delete currUserData.department.createdBy;
    // delete currUserData.updatedAt;
    // delete currUserData.updatedBy;
    // delete currUserData.department.updatedAt;
    // delete currUserData.department.updatedBy;
    const obj = {
      url: URL_CONFIG.USER_CONTACT_UPDATE,
      method: 'put',
      payload: payload,
    };
    httpHandler(obj)
      .then((response) => {
        //const respMsg = response?.data?.message;
        setPWDResponseClassName('response-succ');
        //setContactResponseErr(respMsg);
        setContactResponseErr('Contact updated successfully!');
        window.location.reload();
      })
      .catch((error) => {
        const errMsg = error?.response?.data?.message;
        setPWDResponseClassName('response-err');
        setContactResponseErr(errMsg);
      });
  };

  return (
    <React.Fragment>
      <ReactTooltip
        effect="solid"
        className="toolTipSize zindex-max"
      />
      <div className="eepModalDiv">
        <div
          className="modal fade"
          id="UpdateProfileModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div
            className="modal-dialog w-75"
            role="document"
          >
            <div className="modal-content">
              <ul
                className="nav nav-tabs pl-1 pt-1"
                id="myTab"
                role="tablist"
              >
                <li
                  className="nav-item"
                  role="presentation"
                >
                  <a
                    className="nav-link active font-helvetica-m c1"
                    id="pwd-tab"
                    data-toggle="tab"
                    href="#pwd"
                    role="tab"
                    aria-controls="pwd"
                    aria-selected="true"
                    style={{ borderTopLeftRadius: '20px', color: 'inherit' }}
                  >
                    Change Password
                  </a>
                </li>
                <li
                  className="nav-item"
                  role="presentation"
                >
                  <a
                    className="nav-link font-helvetica-m c1"
                    id="phone-tab"
                    data-toggle="tab"
                    href="#phone"
                    role="tab"
                    aria-controls="phone"
                    aria-selected="false"
                    style={{ color: 'inherit' }}
                  >
                    Update Contact Number
                  </a>
                </li>
              </ul>
              <div className="modal-header p-1 border-0 flex-column">
                <button
                  onClick={() => props?.hideModal()}
                  className="close closed"
                  type="button"
                  data-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div
                className="tab-content"
                id="myTabContent"
              >
                <div
                  className="tab-pane fade show active"
                  id="pwd"
                  role="tabpanel"
                  aria-labelledby="pwd-tab"
                >
                  <div className="modal-body eep_scroll_y">
                    <div className="modalBodyHeight">
                      <div className="col-md-6 form-group text-left required">
                        <label
                          className="font-helvetica-m c-404040 control-label eep_popupLabelMargin"
                          htmlFor="password"
                        >
                          Current Password
                        </label>
                        <div
                          className="input-group field-wbr"
                          id="show_hide_password"
                        >
                          <input
                            className="form-control  pr-password"
                            type={togglePWIcon ? 'password' : 'text'}
                            id="Currentpassword"
                            name="u_upassword"
                            autoComplete="new-password"
                            placeholder="Current Password"
                            onChange={oldPWDChangeHandler}
                            value={currentPassword}
                            maxLength={passMaxLength}
                          />
                          <div className="input-group-addon">
                            <div
                              className="icon-place-holder"
                              style={{
                                backgroundImage: `url(${
                                  process.env.PUBLIC_URL + `${pwBgImage}`
                                })`,
                              }}
                              onClick={passwordToggleHandler}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 form-group text-left required">
                        <label
                          className="font-helvetica-m c-404040 control-label eep_popupLabelMargin mr-2"
                          htmlFor="password"
                        >
                          New Password
                        </label>
                        <span
                          className=""
                          data-tip="The minimum password length is 8 characters and must contain 1 capital letter 1 number and 1 special character."
                          dangerouslySetInnerHTML={{
                            __html: svgIcons && svgIcons.info_icon,
                          }}
                        ></span>
                        <div
                          className="input-group field-wbr"
                          id="show_hide_password"
                        >
                          <input
                            className="form-control  pr-password"
                            type={toggleNewPWIcon ? 'password' : 'text'}
                            id="Newpassword"
                            name="u_upassword"
                            autoComplete="new-password"
                            placeholder="New Password"
                            onChange={newPWDChangeHandler}
                            value={newPassword}
                            maxLength={passMaxLength}
                          />
                          <div className="input-group-addon">
                            <div
                              className="icon-place-holder"
                              style={{
                                backgroundImage: `url(${
                                  process.env.PUBLIC_URL + `${newPwBgImage}`
                                })`,
                              }}
                              onClick={newPasswordToggleHandler}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 form-group text-left required">
                        <label
                          className="font-helvetica-m c-404040 control-label eep_popupLabelMargin"
                          htmlFor="password"
                        >
                          Confirm Password
                        </label>
                        <div className="input-group field-wbr mb-3">
                          <input
                            className="form-control  c_upassword "
                            type="password"
                            id="matchPassword"
                            name="cu_upassword"
                            placeholder="Confirm Password"
                            autoComplete="new-password"
                            onChange={confirmPWDChangeHandler}
                            value={confirmPassword}
                            maxLength={passMaxLength}
                          />
                        </div>
                      </div>
                      <div className="modal-footer border-0 flex-column p-0">
                        {pwdResponseErr && (
                          <div className="response-div m-0">
                            <p
                              className={`${pwdResponseClassName} response-text`}
                            >
                              {pwdResponseErr}
                            </p>
                          </div>
                        )}
                        <div className="d-flex justify-content-center">
                          <button
                            className="eep-btn eep-btn-cancel mr-2"
                            type="button"
                            data-dismiss="modal"
                            onClick={() => props?.hideModal()}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="eep-btn eep-btn-success"
                            disabled={disable}
                            onClick={formSubmissionHandler}
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="phone"
                  role="tabpanel"
                  aria-labelledby="phone-tab"
                >
                  <div className="modal-body eep_scroll_y">
                    <div className="modalBodyHeight">
                      <div style={{ minHeight: '200px' }}>
                        <div className="col-md-6 form-group text-left required">
                          <label className="font-helvetica-m c-404040 control-label eep_popupLabelMargin">
                            Contact Number
                          </label>
                          <div className="input-group field-wbr">
                            <div className="input-group-prepend">
                              {showSelect && (
                                <Select
                                  options={countryCodeData}
                                  placeholder=""
                                  classNamePrefix="eep_select_common contact_number"
                                  className={`form-control a_designation basic-single`}
                                  style={{ height: 'auto' }}
                                  menuPlacement="top"
                                  onChange={(event) =>
                                    onChangeCountryHandler(event)
                                  }
                                  value={countryCode}
                                  maxMenuHeight={150}
                                />
                              )}
                            </div>
                            <input
                              type="text"
                              className="form-control  u_cnumber"
                              maxLength="10"
                              placeholder="Contact Number"
                              autoComplete="off"
                              name="telephoneNumber"
                              d="telephoneNumber"
                              onChange={(event) =>
                                contactNumberChangeHandler(event)
                              }
                              value={contactNumber}
                              style={{ height: 'auto' }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer border-0 flex-column p-0">
                        {contactResponseErr && (
                          <div className="response-div m-0">
                            <p
                              className={`${pwdResponseClassName} response-text`}
                            >
                              {contactResponseErr}
                            </p>
                          </div>
                        )}
                        <div className="d-flex justify-content-center">
                          <button
                            className="eep-btn eep-btn-cancel mr-2"
                            type="button"
                            data-dismiss="modal"
                            onClick={() => props?.hideModal()}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="eep-btn eep-btn-success"
                            onClick={contactFormSubmissionHandler}
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
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
export default UpdateProfileModal;
