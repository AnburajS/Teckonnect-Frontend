import React from 'react';

function UserCards({
  data,
  boderColor,
  image,
  userName,
  department,
  role,
  handleRemove,
  isRemove,
  disabled,
}) {
  return (
    <div
      className={`${
        disabled === true ? 'opacity-2' : ''
      } gride_containerr d_rewards_dtls`}
    >
      <div
        className={`card  py-0 position-relative`}
        style={{
          borderLeft: `10px solid ${boderColor}`,
        }}
      >
        {isRemove && (
          <div className="user-card-close-button position-absolute">
            <button
              type="button"
              className="close eep-error-close"
              style={{ fontSize: '18px' }}
              onClick={() => handleRemove(data)}
            >
              <span aria-hidden="true">
                <img
                  src={process.env.PUBLIC_URL + '/images/icons/cancel.svg'}
                  alt=""
                />
              </span>
            </button>
          </div>
        )}

        <div className="card-body p-2">
          <div className=" no-gutters align-items-center">
            <div>
              <div className="mb-2  role-box-user-main ">
                <img
                  src={
                    image
                      ? image
                      : process.env.PUBLIC_URL + '/images/user_profile.png'
                  }
                  className="user_img"
                  alt={'img'}
                />
                <div className="role-box-users ml-12">{userName}</div>{' '}
              </div>
              <div className="mb-2 role-box-user-main ">
                Dept <div className="role-box-user ml-10    ">{department}</div>
              </div>
              <div className="mb-1 role-box-user-main">
                Role
                <div className="role-box-user ml-10"> {role}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCards;
