import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LogoutModal from "../../modals/LogoutModal";
import { useTranslation } from "react-i18next";

const UserNavItem = () => {
  const userRolePermission = useSelector(
    (state) => state?.sharedData?.userRolePermission
  );
  const [state, setState] = useState();
  const { t } = useTranslation();

  React.useEffect(() => {
    setState({
      ...state,
      logo: JSON.parse(sessionStorage.getItem("userData"))?.userLogo ?? "",
    });
  }, [JSON.parse(sessionStorage.getItem("userData"))?.userLogo]);

  return (
    <React.Fragment>
      <LogoutModal />
      <li className="nav-item dropdown no-arrow mx-1 eep_header_dp nav-link_icons">
        <a
          // className={`nav-button_icons`}
          className="c1"
          id="userDropdown"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          // to="#"
        >
          <img
            className={`img-profile rounded-circle`}
            src={
              state?.logo || process.env.PUBLIC_URL + `/images/user_profile.png`
            }
            alt="profile"
          />
        </a>

        <div
          className="eep-dropdown-menu eep-dropdown-div eep_profile_topbar dropdown-menu dropdown-menu-right shadow animated--grow-in"
          aria-labelledby="userDropdown"
        >
          <Link to="/app/myprofile" className="dropdown-item">
            {t(`navItem.My Profile`)}
          </Link>

          {userRolePermission.adminPanel && (
            <Link to="/app/adminpanel" className="dropdown-item">
              {t(`navItem.Admin Panel`)}
            </Link>
          )}

          <Link to="/app/help" className="dropdown-item">
            {t(`navItem.Help`)}
          </Link>

          <a
            className="dropdown-item c1"
            data-toggle="modal"
            data-target="#logoutModal"
          >
            {t(`navItem.Logout`)}
          </a>
        </div>
      </li>
    </React.Fragment>
  );
};
export default UserNavItem;
