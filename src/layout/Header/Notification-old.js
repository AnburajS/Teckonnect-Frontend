import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Notification = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [clearNotifications, setClearNotifications] = useState(false);

  const Clear_Notifications = (e) => {
    setShowNotifications(false);
    setTimeout(() => {
      setShowNotifications(true);
    }, 0);
    setClearNotifications(() => {
      setClearNotifications(!clearNotifications);
    });
  };

  return (
    <React.Fragment>
      <li
        className={`nav-item dropdown no-arrow mx-1 eep_notification_li ${
          showNotifications ? 'show' : ''
        }`}
      >
        <Link
          className={`nav-link dropdown-toggle`}
          id="alertsDropdown"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded={`${showNotifications ? true : false}`}
          to="#"
        >
          <img
            alt=""
            src={process.env.PUBLIC_URL + `/images/notification.svg`}
          />
          <span className="badge badge-danger badge-counter">0</span>
        </Link>
        <div
          className={`eep-dropdown-div dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in eep_notification_div ${
            showNotifications ? 'show' : ''
          }`}
          aria-labelledby="alertsDropdown"
        >
          <div className="d-flex justify-content-between align-items-center noti_header_div">
            <h6 className="noti_header"> Recent Notifications </h6>
            {!clearNotifications && (
              <div className="noti_clear c1">
                <img
                  src={
                    process.env.PUBLIC_URL + '/images/icons/static/clear.svg'
                  }
                  width="25"
                  height="25"
                  alt="Clear"
                  onClick={(e) => Clear_Notifications(e)}
                />
              </div>
            )}
          </div>
          {!clearNotifications && (
            <div
              className="noti_data_all eep_scroll_y"
              style={{ maxHeight: '250px' }}
            >
              <div
                className="noti_data"
                onClick={() => setShowNotifications(false)}
              >
                <Link
                  className="a_hover_txt_deco_none c-2c2c2c"
                  to={{
                    pathname: '/app/awards',
                  }}
                  state={{ activeTab: 'MyAwardsTab' }}
                >
                  <div className="d-flex">
                    <div className="noti_icon_div">
                      <img
                        className="noti_icon"
                        src={
                          process.env.PUBLIC_URL +
                          '/images/icons/tasks/points.svg'
                        }
                        alt="Noti Icon"
                        title="Points"
                      />
                    </div>
                    <div className="noti_details">
                      <div className="d-flex justify-content-between">
                        <div className="noti_src">Badges</div>
                        <div className="noti_dt">2h ago</div>
                      </div>
                      <div className="noti_title">
                        {' '}
                        You just achieved 25 points for completing your task{' '}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="noti_data">
                <Link
                  className="a_hover_txt_deco_none c-2c2c2c"
                  to="#"
                >
                  <div className="d-flex">
                    <div className="noti_icon_div">
                      <img
                        className="noti_icon"
                        src={
                          process.env.PUBLIC_URL +
                          '/images/icons/tasks/awards.svg'
                        }
                        alt="Noti Icon"
                        title="Points"
                      />
                    </div>
                    <div className="noti_details">
                      <div className="d-flex justify-content-between">
                        <div className="noti_src">Awards</div>
                        <div className="noti_dt">5h ago</div>
                      </div>
                      <div className="noti_title">
                        {' '}
                        You have received an award for completing your task{' '}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="noti_data">
                <Link
                  className="a_hover_txt_deco_none c-2c2c2c"
                  to="#"
                >
                  <div className="d-flex">
                    <div className="noti_icon_div">
                      <img
                        className="noti_icon"
                        src={
                          process.env.PUBLIC_URL +
                          '/images/icons/tasks/certificates.svg'
                        }
                        alt="Noti Icon"
                        title="Points"
                      />
                    </div>
                    <div className="noti_details">
                      <div className="d-flex justify-content-between">
                        <div className="noti_src">Task</div>
                        <div className="noti_dt">Yesterday</div>
                      </div>
                      <div className="noti_title">Task assigned to you. </div>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="noti_data">
                <Link
                  className="a_hover_txt_deco_none c-2c2c2c"
                  to="#"
                >
                  <div className="d-flex">
                    <div className="noti_icon_div">
                      <img
                        className="noti_icon"
                        src={
                          process.env.PUBLIC_URL +
                          '/images/icons/tasks/merchandise.svg'
                        }
                        alt="Noti Icon"
                        title="Points"
                      />
                    </div>
                    <div className="noti_details">
                      <div className="d-flex justify-content-between">
                        <div className="noti_src">Program</div>
                        <div className="noti_dt">2021 Sep 22</div>
                      </div>
                      <div className="noti_title">
                        {' '}
                        You have added in the program.{' '}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="noti_data">
                <Link
                  className="a_hover_txt_deco_none c-2c2c2c"
                  to="#"
                >
                  <div className="d-flex">
                    <div className="noti_icon_div">
                      <img
                        className="noti_icon"
                        src={
                          process.env.PUBLIC_URL +
                          '/images/icons/tasks/e-cards.svg'
                        }
                        alt="Noti Icon"
                        title="Points"
                      />
                    </div>
                    <div className="noti_details">
                      <div className="d-flex justify-content-between">
                        <div className="noti_src">Awards</div>
                        <div className="noti_dt">2021 Sep 14</div>
                      </div>
                      <div className="noti_title">
                        {' '}
                        You have received an E-Card from Arvind AK - Software
                        Engineer{' '}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          )}
          {clearNotifications && (
            <div className="noti_delete_confirm_div">
              <div className="noti_delete_confirm">
                <p className="noti_delete_confirm_txt"> Are you sure? </p>
                <p>
                  {' '}
                  Do you really want to clear all the notifications? This
                  process cann't be undone.{' '}
                </p>
              </div>
              <div className="noti_delete_action">
                <button
                  type="button"
                  className="noti_action_btn noti_clear_confirm mr-2"
                >
                  {' '}
                  Clear{' '}
                </button>
                <button
                  type="button"
                  className="noti_action_btn noti_cancel"
                  onClick={(e) => Clear_Notifications(e)}
                >
                  {' '}
                  Cancel{' '}
                </button>
              </div>
            </div>
          )}
          <div className="dropdown-divider"></div>
          <Link to="/app/notifications">
            <div className="noti_show_all c1">
              <span className="a_hover_txt_deco_none c-2c2c2c">
                {' '}
                Show All Alerts{' '}
              </span>
            </div>
          </Link>
        </div>
      </li>
    </React.Fragment>
  );
};
export default Notification;
