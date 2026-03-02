import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../UI/Button';
import { URL_CONFIG } from '../../constants/rest-config';
import { httpHandler } from '../../http/http-interceptor';
import classes from './LoginForm.module.scss';

const ChangePassword = () => {
  const history = useNavigate();
  const [togglePWIcon, setTogglePWIcon] = useState(true);
  const pwBgImage = togglePWIcon
    ? '/images/pw_hide.svg'
    : '/images/pw_show.svg';

  const [disable, setDisable] = useState(true);
  const [passWord, setPassword] = useState('');
  const [passWordTouched, setPasswordTouched] = useState(false);
  const [passwordErr, setpasswordErr] = useState('');
  const passWordIsValid = passWord.trim() !== '';
  const passWordInputIsInvalid = !passWordIsValid && passWordTouched;

  const [cPassWord, setConfirmPassword] = useState('');
  const [cPassWordTouched, setConfirmPasswordTouched] = useState(false);
  const [responseClassName, checkResponseClassName] = useState('');
  const [cPasswordErr, setConfirmPasswordErr] = useState('');

  const [formIsValid, setFormIsValid] = useState(false);

  // useEffect(() => {
  //   const passwordValid = new RegExp(
  //     /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/g,
  //   ).test(passWord);
  //   setFormIsValid(false);
  //   if (passWordTouched) {
  //     if (passWord === '') {
  //       checkResponseClassName('response-err');
  //       setConfirmPasswordErr('Please enter new password');
  //     }
  //   }
  //   if (cPassWordTouched) {
  //     if (cPassWord === '') {
  //       checkResponseClassName('response-err');
  //       setConfirmPasswordErr('Please enter confirm password');
  //     }
  //   }
  //   if (passWord !== cPassWord) {
  //     checkResponseClassName('response-err');
  //     setConfirmPasswordErr("Password doesn't matched");
  //   }
  //   if (passWord && passWord === cPassWord && cPassWord) {
  //     if (!passwordValid) {
  //       checkResponseClassName('response-err');
  //       setConfirmPasswordErr(
  //         'Please enter a strong password, e.g. minimum 8 characters, with at least one uppercase letter and at least one special character.',
  //       );
  //       setDisable(true);
  //       setFormIsValid(false);
  //     } else if (passWord !== '' && cPassWord !== '') {
  //       checkResponseClassName('response-succ');
  //       setConfirmPasswordErr('Password matched');
  //     }
  //     setDisable(false);
  //     setFormIsValid(true);
  //   }
  // }, [passWord, cPassWord, passWordTouched, cPassWordTouched]);
  // useEffect(() => {
  //   const passwordRegex =
  //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.])[A-Za-z\d!@#$%^&*.]{8}$/;

  //   setFormIsValid(false);

  //   if (!passWord && passWordTouched) {
  //     setConfirmPasswordErr('Please enter new password');
  //     return;
  //   }

  //   if (!passwordRegex.test(passWord) && passWordTouched) {
  //     setConfirmPasswordErr(
  //       'Password must be minimum 8 characters and include at least one letter, one number, and one special character.',
  //     );
  //     return;
  //   }

  //   if (!cPassWord && cPassWordTouched) {
  //     setConfirmPasswordErr('Please enter confirm password');
  //     return;
  //   }

  //   if (passWord !== cPassWord && cPassWordTouched) {
  //     setConfirmPasswordErr('Password and confirm password must match');
  //     return;
  //   }

  //   if (
  //     passWord &&
  //     cPassWord &&
  //     passwordRegex.test(passWord) &&
  //     passWord === cPassWord
  //   ) {
  //     setConfirmPasswordErr('Password matched successfully');
  //     setFormIsValid(true);
  //   }
  // }, [passWord, cPassWord, passWordTouched, cPassWordTouched]);

  useEffect(() => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*._-])[A-Za-z\d!@#$%^&*._-]{8}$/;

    setFormIsValid(false);
    setDisable(true);

    if (!passWord && passWordTouched) {
      setConfirmPasswordErr('Please enter new password');
      return;
    }

    if (passWord && !passwordRegex.test(passWord) && passWordTouched) {
      setConfirmPasswordErr(
        'Password must be exactly 8 characters and include at least one lowercase, one uppercase, one number and one special character.',
      );
      return;
    }

    if (!cPassWord && cPassWordTouched) {
      setConfirmPasswordErr('Please enter confirm password');
      return;
    }

    if (passWord !== cPassWord && cPassWordTouched) {
      setConfirmPasswordErr('Password and confirm password must match');
      return;
    }

    if (
      passWord &&
      cPassWord &&
      passwordRegex.test(passWord) &&
      passWord === cPassWord
    ) {
      setConfirmPasswordErr('Password matched successfully');
      setFormIsValid(true);
      setDisable(false);
    }
  }, [passWord, cPassWord, passWordTouched, cPassWordTouched]);

  const passwordToggleHandler = () => {
    setTogglePWIcon(!togglePWIcon);
  };

  const passWordChangeHandler = (event) => {
    setDisable(true);
    setPassword(event.target.value);
    setPasswordTouched(true);
  };

  const confirmPassWordChangeHandler = (event) => {
    setDisable(true);
    setConfirmPassword(event.target.value);
    setConfirmPasswordTouched(true);
  };

  const passWordBlurHandler = () => {
    setPasswordTouched(true);
  };

  const confirmPassWordBlurHandler = () => {
    setConfirmPasswordTouched(true);
  };

  const formSubmissionHandler = (event) => {
    event.preventDefault();
    const params = new URLSearchParams(window.location.search).get('token');
    let options1 = {
      tokenValue: params,
      new_password: passWord,
    };

    if (formIsValid) {
      const obj = {
        url: URL_CONFIG.RESETPASSWORD_AUTH,
        method: 'post',
        payload: options1,
        isAuth: true,
      };
      httpHandler(obj)
        .then(() => {
          history('/login/signin');
        })
        .catch((error) => {
          const errMsg = error.response?.data;
          checkResponseClassName('response-err');
          setConfirmPasswordErr(errMsg);
        });
    }
  };

  const passwordInputClasses = passWordInputIsInvalid
    ? `${classes.invalid}`
    : '';

  return (
    // <div className={classes.loginFormContainer}>
    <div
      className={`${classes.loginFormContainer} ${classes.changePasswordContainer}`}
    >
      <h2 className={`text-center `}>Welcome</h2>
      <h4 className="text-center">Change password</h4>
      <div className={classes.formWrapper}>
        <form
          id="changepasswordform"
          onSubmit={formSubmissionHandler}
          method="post"
        >
          <div className={`${classes.form_inputs_div} form-inputs-div`}>
            <div className="eep-input-group">
              <div
                className={`${classes.input_group} ${passwordInputClasses} form-group input-group`}
                style={{ display: 'flex' }}
              >
                <input
                  type={togglePWIcon ? 'password' : 'text'}
                  id="password"
                  name="password"
                  className={`${classes.form_control} form-control`}
                  placeholder="New Password*"
                  onChange={passWordChangeHandler}
                  onBlur={passWordBlurHandler}
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
                {passWordInputIsInvalid && (
                  <p className="error-text">{passwordErr}</p>
                )}
              </div>
            </div>
            {/* <div className="eep-input-group">
              <div
                className={`${classes.input_group} ${passwordInputClasses} form-group input-group`}
                style={{ display: 'flex', paddingBottom: 10 }}
              >
                <input
                  type="password"
                  id="Confirm_password"
                  name="password"
                  className={`${classes.form_control} form-control`}
                  placeholder="Confirm Password*"
                  onChange={confirmPassWordChangeHandler}
                  onBlur={confirmPassWordBlurHandler}
                />
                {cPasswordErr && (
                  <div className={`${responseClassName} response-text`}>
                    <p class="error-text mb-n1">{cPasswordErr}</p>
                  </div>
                )}
              </div>
            </div> */}
            <div className="eep-input-group">
              <div className={classes.confirmFieldWrap}>
                <div
                  className={`${classes.input_group} ${passwordInputClasses} form-group input-group`}
                  style={{ display: 'flex', paddingBottom: 10 }}
                >
                  <input
                    type="password"
                    id="Confirm_password"
                    name="password"
                    className={`${classes.form_control} form-control`}
                    placeholder="Confirm Password*"
                    onChange={confirmPassWordChangeHandler}
                    onBlur={confirmPassWordBlurHandler}
                  />
                </div>

                {cPasswordErr && (
                  <p className={classes.confirmErrorText}>{cPasswordErr}</p>
                )}
              </div>
            </div>
          </div>
          <div className={classes.btnSubmit_div}>
            <div className="row justify-content-center">
              <Button
                type="submit"
                className={`${classes.btnSubmit} btn btn-login`}
                disabled={disable}
                name="SUBMIT"
              ></Button>
            </div>
          </div>
        </form>
        <div className={classes.fgt_pwd_div}>
          <div className="row text-center justify-content-center">
            <Link
              to="/login"
              className={classes.fgt_pwd}
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChangePassword;
