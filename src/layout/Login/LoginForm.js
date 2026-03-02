import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../UI/Button';
import { REST_CONFIG, URL_CONFIG } from '../../constants/rest-config';
import { httpHandler } from '../../http/http-interceptor';
//import { idmRoleMapping } from "../../idm";
import { sharedDataActions } from '../../store/shared-data-slice';
import classes from './LoginForm.module.scss';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { fetchUserlogin } from '../../helpers';

// const { t } = useTranslation();

const LoginForm = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const [togglePWIcon, setTogglePWIcon] = useState(true);
  const pwBgImage = togglePWIcon
    ? '/images/pw_hide.svg'
    : '/images/pw_show.svg';
  const [userName, setUserName] = useState('');
  const [userNameTouched, setUserNameTouched] = useState(false);
  const userNameIsValid = userName.trim() !== '';
  const nameInputIsInvalid = !userNameIsValid && userNameTouched;

  const [passWord, setPassWord] = useState('');
  const [passWordTouched, setPasswordTouched] = useState(false);
  const passWordIsValid = passWord.trim() !== '';
  const passWordInputIsInvalid = !passWordIsValid && passWordTouched;

  const [loginError, setLoginError] = useState('');

  const [formIsValid, setFormIsValid] = useState(false);
  const [language, setLanguage] = useState(
    localStorage.getItem('appLanguage') || 'en',
  );

  useEffect(() => {
    const savedLang = localStorage.getItem('appLanguage') || 'en';
    i18n.changeLanguage(savedLang);
    document.documentElement.dir = i18n.dir(savedLang);
  }, []);

  useEffect(() => {
    setFormIsValid(false);

    if (userNameIsValid && passWordIsValid) {
      setFormIsValid(true);
    }
  }, [userNameIsValid, passWordIsValid]);

  const passwordToggleHandler = () => {
    setTogglePWIcon(!togglePWIcon);
  };

  const userNameInputChangeHandler = (event) => {
    setLoginError('');
    setUserName(event.target.value);
  };

  const userNameBlurHandler = (event) => {
    setUserNameTouched(true);
  };

  const passWordChangeHandler = (event) => {
    setLoginError('');
    setPassWord(event.target.value);
  };

  const passWordBlurHandler = () => {
    setPasswordTouched(true);
  };
  const { t } = useTranslation();
  // const formSubmissionHandler = async (event) => {
  //   event.preventDefault();

  //   const validate_login_uder = {
  //     url: URL_CONFIG.USER_VALIDATION,
  //     method: 'post',
  //     payload: {
  //       username: userName,
  //     },
  //   };

  //   setUserNameTouched(true);
  //   setPasswordTouched(true);

  //   let options1 = {
  //     username: userName,
  //     password: passWord,
  //   };

  //   if (formIsValid) {
  //     const user_validation = await httpHandler(validate_login_uder);
  //     if (!user_validation?.data?.is_valid) {
  //       const errMsg =
  //         'You are not a valid user. Please contact the administrator.';
  //       setLoginError(errMsg);
  //       return;
  //     }
  //     const obj = {
  //       url: URL_CONFIG.AUTH_LOGIN_URL,
  //       method: 'post',
  //       payload: options1,
  //       isLoader: true,
  //       isAuth: true,
  //     };
  //     httpHandler(obj)
  //       .then(async (userData) => {
  //         sessionStorage.userData = JSON.stringify({
  //           id: userData.data.data.user?.id,
  //           username: userData?.data?.data?.user?.username,
  //           email: userData?.data?.data?.user?.email_id,
  //           fullName: userData?.data?.data?.user?.username,
  //           tokenType: 'Bearer',
  //           accessToken: userData?.data?.data?.token,
  //         });
  //         sessionStorage.loggedInTime = new Date().getTime();
  //         updateToLoginUserTokenHandler(userData?.data?.data?.token);
  //         await fetchPermission()?.then(() => {
  //           if (
  //             sessionStorage?.redirect &&
  //             sessionStorage?.redirect.includes('slack=true')
  //           ) {
  //             const url = new URL(sessionStorage?.redirect);
  //             const router = url.pathname;
  //             history.push(
  //               router + '#' + sessionStorage?.redirect.split('#')[1]
  //             );
  //             sessionStorage.removeItem('redirect');
  //           } else {
  //             // history.push("/app/dashboard");
  //             window.location.pathname = '/app/dashboard';
  //           }
  //         });

  //         await fetchUserlogin();
  //       })
  //       .catch((error) => {
  //         const errMsg = 'Invalid username or password.';
  //         setLoginError(errMsg);
  //       });
  //   }
  // };
  const formSubmissionHandler = async (event) => {
    event.preventDefault();

    const validate_login_uder = {
      url: URL_CONFIG.USER_VALIDATION,
      method: 'post',
      payload: {
        username: userName,
      },
    };

    setUserNameTouched(true);
    setPasswordTouched(true);

    let options1 = {
      username: userName,
      password: passWord,
    };

    const obj = {
      url: URL_CONFIG.AUTH_LOGIN_URL,
      method: 'post',
      payload: options1,
      isLoader: true,
      isAuth: true,
    };

    if (formIsValid) {
      try {
        // Start validation and login request simultaneously using Promise.all
        const [userValidationResponse, loginResponse] = await Promise.all([
          httpHandler(validate_login_uder),
          httpHandler(obj),
        ]);

        console.log('User Validation Response:', userValidationResponse);
        console.log('Login Response:', loginResponse);

        // Validate user
        if (!userValidationResponse?.data?.is_valid) {
          const errMsg =
            'You are not a valid user. Please contact the administrator.';
          setLoginError(errMsg);
          return;
        }

        // Login successful, handle user data and navigation
        sessionStorage.userData = JSON.stringify({
          id: loginResponse.data.data.user?.id,
          username: loginResponse?.data?.data?.user?.username,
          email: loginResponse?.data?.data?.user?.email_id,
          fullName: loginResponse?.data?.data?.user?.username,
          tokenType: 'Bearer',
          accessToken: loginResponse?.data?.data?.token,
        });

        sessionStorage.loggedInTime = new Date().getTime();
        updateToLoginUserTokenHandler(loginResponse?.data?.data?.token);

        await fetchPermission();

        // Handle redirection after successful login and permission fetch
        if (
          sessionStorage?.redirect &&
          sessionStorage?.redirect.includes('slack=true')
        ) {
          const url = new URL(sessionStorage?.redirect);
          const router = url.pathname;
          // history.push(router + '#' + sessionStorage?.redirect.split('#')[1]);
          const redirectFragment = sessionStorage?.redirect?.split('#')[1];
          history(router + `#${redirectFragment}`);
          sessionStorage.removeItem('redirect');
        } else {
          // Navigate to the dashboard
          window.location.pathname = '/app/dashboard';
        }

        // Fetch user login data after navigation
        await fetchUserlogin();
      } catch (error) {
        const errMsg = 'Invalid username or password.';
        setLoginError(errMsg);
      }
    }
  };
  const updateToLoginUserTokenHandler = async (token) => {
    const obj = {
      url: URL_CONFIG.TOKEN_UPDATE,
      method: 'post',
      payload: { token: token ?? localStorage.getItem('deviceToken') },
      isLoader: true,
    };

    await httpHandler(obj);
  };

  const fetchPermission = async () => {
    const obj = {
      url: URL_CONFIG.USER_PERMISSION,
      method: 'get',
    };
    await httpHandler(obj)
      .then(async (response) => {
        //const roleData = await idmRoleMapping(response?.data?.roleId?.idmID);

        const getAndUpdate = sessionStorage.getItem('userData');
        const arabic = (response?.data?.theme).some(
          (obj) => obj.language === 'Arabic (AR)' && obj.id === 1,
        );
        const addFileds = {
          ...JSON.parse(getAndUpdate),
          firstName: response?.data?.firstName,
          lastName: response?.data?.lastName,
          allPoints: response?.data?.totalPoints,
          HeaderLogo: response?.data?.HeaderLogo,
          userLogo: response?.data?.userLogo,
          theme: response?.data?.theme,
          orgId: response?.data?.orgId ?? '',
          countryDetails: response?.data?.countryDetails ?? '',
          arabic: arabic,
        };
        sessionStorage.setItem('userData', JSON.stringify(addFileds));
        // check language ans set in documentElement <HTML></HTML>

        // arabic ? i18n.changeLanguage('ar') : i18n.changeLanguage('en');
        // const dir = i18n.dir(i18n.language);
        // document.documentElement.dir = dir;

        ////////////////////////////////////////////
        // dispatch(
        //   sharedDataActions.getUserRolePermission({
        //     userRolePermission: roleData?.data,
        //   })
        // );
        const savedLang = localStorage.getItem('appLanguage') || 'en';
        i18n.changeLanguage(savedLang);
        document.documentElement.dir = i18n.dir(savedLang);

        const dir = i18n.dir(i18n.language);
        document.documentElement.dir = dir;

        dispatch(
          sharedDataActions.getUserRolePermission({
            userRolePermission: response?.data?.screen,
          }),
        );
      })
      .catch((error) => {});
  };

  const nameInputClasses = nameInputIsInvalid ? `${classes.invalid}` : '';
  const passwordInputClasses = passWordInputIsInvalid
    ? `${classes.invalid}`
    : '';

  return (
    <div className={classes.loginFormContainer}>
      <h2 className={`text-center `}>{t('login.welcome')}</h2>
      <h4 className="text-center">{t('login.subtitle')}</h4>
      <div className={classes.formWrapper}>
        <form
          id="loginform"
          onSubmit={formSubmissionHandler}
          method="post"
        >
          <div className={`${classes.form_inputs_div} form-inputs-div`}>
            <div className="eep-input-group">
              <div
                className={`${classes.input_group} ${nameInputClasses} form-group input-group`}
                style={{ display: 'flex' }}
              >
                <input
                  type="text"
                  id="username"
                  name="username"
                  className={`${classes.form_control} form-control`}
                  value={userName}
                  placeholder={t('login.username')}
                  onChange={userNameInputChangeHandler}
                  onBlur={userNameBlurHandler}
                />
                {nameInputIsInvalid && (
                  <p className="error-text">{t('login.usernameError')}</p>
                )}
              </div>
            </div>
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
                  placeholder={t('login.password')}
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
              </div>
              {passWordInputIsInvalid && (
                <p
                  className="error-text"
                  style={{ bottom: '5px' }}
                >
                  Please enter password
                </p>
              )}
              {loginError && (
                <p className="error-text mb-2">
                  {t('login.invalidCredentials')}
                </p>
              )}
            </div>
          </div>
          <div className={classes.languageField}>
            <select
              className={classes.languageSelect}
              value={language}
              onChange={(e) => {
                const lang = e.target.value;
                setLanguage(lang);
                i18n.changeLanguage(lang);
                document.documentElement.dir = i18n.dir(lang);
                localStorage.setItem('appLanguage', lang);
              }}
            >
              <option
                value=""
                disabled
              >
                Language
              </option>
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>

          <div className={classes.btnSubmit_div}>
            <div className="row justify-content-center">
              <Button
                type="submit"
                className={`${classes.btnSubmit} btn btn-login`}
                name={t('login.loginBtn')}
              ></Button>
            </div>
          </div>
        </form>
        <div className={classes.fgt_pwd_div}>
          <div className="row text-center justify-content-center">
            <Link
              to="/login/forgotpassword"
              className={classes.fgt_pwd}
            >
              {t('login.forgotPassword')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginForm;
