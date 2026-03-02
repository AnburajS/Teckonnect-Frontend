import React from "react";

const DropAssignedUsers = (props) => {
  const { userData, showcontrol, deletedUser } = props;

  const deleteUserHandler = (arg) => {
    deletedUser(arg);
  };

  return (
    <React.Fragment>
      {userData && (
        <div className="urm_profile_container text-center">
          <div className="urm_profile_pic">
            <img
              src={userData?.imageByte?.image ? userData?.imageByte.image : process.env.PUBLIC_URL + "/images/user_profile.png"}
              className="role_image"
              alt="profilePiccture"
            />
          </div>
          <div className="urm_profile_name">
            {userData?.firstname} {userData?.lastname}
          </div>
          <div className="urm_profile_department">{userData?.department.name}</div>
          <div
            className="urm_profile_role"
            style={{
              backgroundColor:
                userData?.role &&
                userData?.role.colorCode &&
                userData?.role.colorCode.indexOf("#") !== -1
                  ? userData?.role.colorCode
                  : userData?.role && userData?.role.colorCode
                  ? "#" + userData?.role.colorCode
                  : null,
            }}
          >
            {userData?.role && userData?.role.roleName}
          </div>
          {showcontrol && (
            <div className="dropdown eep_custom_dropdown c-c1c1c1 c1">
              <i
                className="fas fa-ellipsis-v"
                style={{ "font-size": "14px" }}
                data-toggle="dropdown"
                aria-expanded="false"
              ></i>
              <div
                className="dropdown-menu eep_custom_dropdown_bg"
                x-placement="bottom-start"
              >
                <a
                  className="eep-options-item c1"
                  onClick={() => deleteUserHandler(userData)}
                >
                  Remove
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </React.Fragment>
  );
};
export default DropAssignedUsers;
