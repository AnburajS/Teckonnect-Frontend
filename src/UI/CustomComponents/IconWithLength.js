import React from 'react';

const IconWithLength = (props) => {
  const { data, cSettings, row } = props;

  const iconPath = process.env.PUBLIC_URL + '/images/icons/static/';

  return (
    <React.Fragment>
      <div className="ans-type text-left">
        <img
          src={
            data[cSettings.objReference].length > 0
              ? iconPath + cSettings.isValue
              : iconPath + cSettings.default
          }
          className={cSettings.classnames}
          alt="Icon"
          title={cSettings.title}
          style={{ width: '20px' }}
        />
        <span className="dataLength">
          {data[cSettings.objReference].length}
        </span>
      </div>
    </React.Fragment>
  );
};
export default IconWithLength;
