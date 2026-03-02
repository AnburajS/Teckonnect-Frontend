import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../UI/Button';
import { URL_CONFIG } from '../../constants/rest-config';
import { httpHandler } from '../../http/http-interceptor';
import classes from './LoginForm.module.scss';

const ForgotPassword = () => {
  const [responseClassName, checkResponseClassName] = useState('');
  const [responseMsg, checkResponseMsg] = useState('');

  const [enteredEmail, setEnteredEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [disable, setDisable] = useState(true);

  const IsValidEmail = new RegExp(
    /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g
  ).test(enteredEmail);
  const emailInputIsInvalid = !IsValidEmail && emailTouched;

  const emailChangeHandler = (event) => {
    if (event.target.value?.length <= 0) {
      setDisable(true);
    } else {
      setDisable(false);
    }

    setEnteredEmail(event.target.value);
  };

  const emailBlurHandler = (event) => {
    setEmailTouched(true);
    checkResponseMsg(false);
  };
  const formSubmitHanlder = (event) => {
    setEmailTouched(true);
    setDisable(true);
    if (IsValidEmail) {
      const obj = {
        url: URL_CONFIG.AUTH_FORGOT_PASSWORD_URL,
        method: 'post',
        payload: { email_id: enteredEmail },
        isAuth: true,
      };
      httpHandler(obj)
        .then(async (response) => {
          setEnteredEmail('');
          const resMsg = response?.data?.message;
          checkResponseClassName('response-succ');
          checkResponseMsg(resMsg);
          setEmailTouched(false);
          setDisable(false);
          await sentEmail(response?.data?.data?.token, enteredEmail);
        })
        .catch((error) => {
          const errMsg = error?.response?.data?.message;
          checkResponseClassName('response-err');
          checkResponseMsg(errMsg);
        });
    }
    event.preventDefault();
  };

  const sentEmail = (token, email) => {
    const obj = {
      url: URL_CONFIG.AUTH_FORGOT_PASSWORD_EMAIL_URL,
      method: 'post',
      payload: { email, token },
    };
    httpHandler(obj).then((response) => {
      const resMsg = response?.data?.message;
      checkResponseClassName('response-succ');
      checkResponseMsg(resMsg);
    });
  };

  const emailInputClass = emailInputIsInvalid ? `${classes.invalid}` : '';
  return (
    <div className={classes.loginFormContainer}>
      <h2 className={`text-center`}>Reset Password</h2>
      <h4 className="text-center">
        Please provide the email address below to proceed with resetting your
        password
      </h4>
      <div className={classes.formWrapper}>
        <form
          onSubmit={formSubmitHanlder}
          method="post"
        >
          <div className={classes.form_inputs_div}>
            <div className="eep-input-group">
              <div
                className={`${classes.input_group} ${emailInputClass} form-group input-group`}
                style={{ paddingBottom: 10 }}
              >
                <input
                  type="text"
                  id="email"
                  name="email"
                  className={`${classes.form_control} form-control`}
                  placeholder="email@domain.com"
                  onChange={emailChangeHandler}
                  onBlur={emailBlurHandler}
                />
                <br />
                {emailInputIsInvalid && (
                  <p
                    className={`response-err mb-0 mt-3 w-100 text-center response-text`}
                  >
                    Please enter a Valid email address
                  </p>
                  // <p className="error-text" style={{ marginBottom: 4 }}></p>
                )}
                {responseMsg && (
                  <p
                    className={`${responseClassName} mb-0 mt-3 w-100 text-center response-text`}
                  >
                    {responseMsg}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className={classes.btnSubmit_div}>
            <div className="row justify-content-center">
              <Button
                type="submit"
                disabled={disable}
                className={`${classes.btnSubmit} btn btn-login`}
                name="Reset Password"
              ></Button>
            </div>
          </div>
        </form>
        <div className={classes.fgt_pwd_div}>
          <div className="row text-center justify-content-center">
            <Link
              to="/login/signin"
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
export default ForgotPassword;
