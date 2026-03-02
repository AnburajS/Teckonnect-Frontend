import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
const UserManagementActionDropdown = (props) => {
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const userData = sessionStorage.userData
    ? JSON.parse(sessionStorage.userData)
    : {};

  return (
    <div className="ans-type text-center c1">
      <span
        className="eep_kebab_btn"
        data-toggle="dropdown"
        aria-expanded="false"
        dangerouslySetInnerHTML={{
          __html: svgIcons && svgIcons.colon,
        }}
      ></span>

      <div className="eep-dropdown-menu  dropdown-menu dropdown-menu-right shadowdrop pt-4 pb-4">
        <Link
          className="dropdown-item"
          to={`/app/users/view/${props?.data?.user_id}`}
        >
          View User
        </Link>
        {userData.id !== props?.data?.user_id && (
          <>
            <div className="dropdown-divider"></div>
            <Link
              className="dropdown-item"
              to={`/app/users/update/${props?.data?.user_id}`}
            >
              Modify User
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
export default UserManagementActionDropdown;
