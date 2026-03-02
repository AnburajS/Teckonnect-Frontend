import React, { useEffect, useRef, useState } from 'react';
import IdleTimer from 'react-idle-timer';
import { Link } from 'react-router-dom';
import EEPSessionTimeOutModal from '../modals/EEPSessionTimeOutModal';
import { httpHandler, ErrorHandling } from '../http/http-interceptor';
import { URL_CONFIG } from '../constants/rest-config';
import { useNavigate } from 'react-router-dom';
import { fetchUserlogin } from '../helpers';

// import Modal from 'react-modal';
// Modal.setAppElement('#root');

const IdleTimerContainer = () => {
  const idleTimeRef = useRef(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showSessionTimeOutModal, setshowSessionTimeOutModal] = useState({
    type: 'SessionTimeOut',
    message: 'Your Session Expired. ',
  });

  const config = {
    timoutTime: 40,
    refreshTime: 13,
  };

  useEffect(() => {
    checkUserActionSession();
  }, []);

  let checkUserActionTime;
  const checkUserActionSession = () => {
    checkUserActionTime = setInterval(() => {
      const loggedInTime = parseInt(sessionStorage.getItem('loggedInTime'));
      const diff = parseInt(
        Math.abs(new Date().getTime() - loggedInTime) / 1000
      );
      if (diff === config.refreshTime * 60) {
        clearInterval(checkUserActionTime);
        SessionExtenHandler();
      }
    }, 1000);
  };

  let interval;
  const idleWaiting = (flag = false) => {
    let initSec = 0;
    interval = setInterval(() => {
      initSec++;
      if (initSec === config.timoutTime * 60 - config.refreshTime * 60) {
        setModalIsOpen(false);
        ErrorHandling();
      }
    }, 1000);

    if (flag) {
      clearInterval(interval);
    }
  };

  const onIdle = () => {
    clearInterval(checkUserActionTime);
    setModalIsOpen(true);
    idleWaiting();
  };

  const onAction = () => {
    clearInterval(interval);
    idleWaiting(true);
  };
  const SessionExtenHandler = () => {
    setModalIsOpen(false);
    clearInterval(checkUserActionTime);
    const userData = JSON.parse(sessionStorage.userData);

    const obj = {
      url: URL_CONFIG.REFRESH_TOKEN_AUTH,
      method: 'get',
      payload: { refreshToken: userData.refreshToken },
      isAuth: true,
    };
    httpHandler(obj)
      .then((response) => {
        // const newUserData = {...userData, ...response.data}
        const token = JSON.parse(
          atob(response?.data?.data?.token?.split('.')[1])
        );
        const getAndUpdate = sessionStorage.getItem('userData');

        const newUserData = JSON.stringify({
          ...JSON.parse(getAndUpdate),
          id: token?.id,
          username: token?.username,
          email: token?.email_id,
          fullName: token?.username,
          tokenType: 'Bearer',
          accessToken: response?.data?.data?.token,
          // accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBZG1pbmlzdHJhdG9yIiwiaWF0IjoxNjg2ODI0NTE1LCJleHAiOjE2ODY4MjYzMTV9.J-C3XMTogyhBQR-00LkHhBS20MeoiPNrpsCoaRRN_CCxQkPldYnv9vx7tpS5r3leRROgbg8DUtHTjRay16b04g"
        });
        sessionStorage.userData = newUserData;
        sessionStorage.loggedInTime = new Date().getTime();
        checkUserActionSession();
        fetchUserlogin();
      })
      .catch((error) => {});
  };

  const history = useNavigate();
  const logoutHandler = () => {
    // const obj = {
    //   url: URL_CONFIG.LOGOUT,
    //   method: "post",
    //   payload: {},
    // };
    // httpHandler(obj)
    //   .then(() => {
    //     sessionStorage.clear();
    //     history.push("/login/signin");
    //   })
    //   .catch((error) => {
    //     //const errMsg = error.response?.data?.message;
    //
    //   });
    sessionStorage.clear();
    history('/');
  };

  return (
    <div>
      {modalIsOpen && (
        <EEPSessionTimeOutModal
          data={showSessionTimeOutModal}
          className={`modal-addmessage`}
          SessionTimeOutFooterData={
            <React.Fragment>
              <Link
                to="/login/signin"
                type="button"
                className="eep-btn eep-btn-warning-dark"
                onClick={logoutHandler}
              >
                Logout
              </Link>
              <Link
                to="#"
                type="button"
                className="eep-btn eep-btn-success"
                onClick={SessionExtenHandler}
              >
                Continue
              </Link>
            </React.Fragment>
          }
        ></EEPSessionTimeOutModal>
      )}
      <IdleTimer
        ref={idleTimeRef}
        timeout={config.refreshTime * 60 * 1000}
        onIdle={onIdle}
        onActive={onAction}
        onAction={onAction}
        Mousemove={onAction}
      ></IdleTimer>
    </div>
  );
};
export default IdleTimerContainer;
