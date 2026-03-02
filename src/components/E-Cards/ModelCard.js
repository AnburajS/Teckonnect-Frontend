import React from 'react';

import ToolTip from '../../modals/ToolTip';
function ModelCard({
  type,
  image,
  user_image,
  message,
  error,
  userName,
  title,
}) {
  return (
    <div className="mb-3 card-ecard ">
      <div
        className="card p-3"
        style={{
          borderRadius: '12px',
          borderBottom: `10px solid ${type ? '#F24F4F' : '#78d31c'}`,
        }}
      >
        <img
          src={image}
          alt={title}
          height="120"
          width={'100%'}
          style={{ borderRadius: '8px' }}
        />
        <div className="  card-box-user-main mt-3 ">
          <img
            src={
              user_image
                ? user_image
                : process.env.PUBLIC_URL + '/images/user_profile.png'
            }
            className="user_img"
            alt={'img'}
          />
          <div className="card-box-user-main fs-20 ml-12">{userName}</div>{' '}
        </div>
        <div className="card-box-user-main mt-2">{message} </div>{' '}
        <ToolTip
          title={type ? { error } : ''}
          arrow
          placement="top-start"
          backgroundColor="#82889B"
          color="#FFFFFF"
          fontSize="10px"
        >
          <div className={`mt-2 pb-3 fs-12 ${type ? 'ecard-error' : ''}`}>
            {type ? { error } : ''}
          </div>
        </ToolTip>
        {/* <div className="mb-2 role-box-user-main ">
                Dept <div className="role-box-user ml-10    ">{department}</div>
              </div>
              <div className="mb-1 role-box-user-main">
                Role
                <div className="role-box-user ml-10"> {role}</div>
              </div> */}
      </div>
    </div>
  );
}

export default ModelCard;
