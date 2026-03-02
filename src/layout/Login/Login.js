import React, { useState } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import SvgComponent from '../../components/ViwerComponents';
import { URL_CONFIG } from '../../constants/rest-config';
import { httpHandler } from '../../http/http-interceptor';
import '../../styles/lib/bg-animations.scss';
import '../../styles/lib/login-style.scss';
import ChangePassword from './ChangePassword';
import ForgotPassword from './ForgotPassword';
import LoginForm from './LoginForm';

const Login = () => {
  const [state, setState] = useState({
    logo: null,
  });
  React.useEffect(() => {
    const obj = {
      url: URL_CONFIG.ADD_ADMIN_LOGIN_LOGO,
      method: 'get',
    };
    httpHandler(obj)
      .then((reponse) => {
        setState({
          ...state,
          logo:
            reponse?.data?.image ||
            process.env.PUBLIC_URL + '/images/icons/EnliteU Large.png',
        });
      })
      .catch((err) => {
        setState({
          ...state,
          logo: process.env.PUBLIC_URL + '/images/icons/EnliteU Large.png',
        });
      });
  }, []);

  return (
    <React.Fragment>
      <div className="bg-area">
        <ul className="bg-circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>

      <div className="eep-login-page">
        <div className="container">
          <div className={`login_centent_sec eep_scroll_y`}>
            <div
              className={`row content-sect w-90 align-items-center eep_scroll_y`}
            >
              <div className={`col-md-6 logo-sec`}>
                {state?.logo?.includes('.svg') ? (
                  <SvgComponent svgUrl={state?.logo} />
                ) : (
                  state?.logo && (
                    <img
                      className="mx-auto d-block"
                      style={{ width: '400px !important' }}
                      src={state?.logo}
                      alt="Logo"
                    />
                  )
                )}
              </div>
              <div className={`col-md-6 login-sec`}>
                {/* <Routes>
                  <Route
                    path="/"
                    element={<LoginForm />}
                  />
                  <Route
                    path="/login"
                    element={<LoginForm />}
                  />
                  <Route
                    path="/login/signin"
                    element={<LoginForm />}
                  />
                  <Route
                    path="/login/forgotpassword"
                    element={<ForgotPassword />}
                  />
                  <Route
                    path="/login/changepassword"
                    element={<ChangePassword />}
                  />
                </Routes> */}
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default Login;
