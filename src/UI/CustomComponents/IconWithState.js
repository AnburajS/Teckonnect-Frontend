import React from "react";

const IconWithState = (props) => {

  const {data, cSettings} = props;

  const iconPath = process.env.PUBLIC_URL + '/images/icons/static/';

  return (
    <React.Fragment>
      <div className="ans-type text-left">
        <img
            src={data?.[cSettings?.objReference] ? iconPath + cSettings?.isValue :  iconPath + cSettings?.default}
            className={cSettings?.classnames}
            alt="Icon"
            title={cSettings?.title}
            style={{width:"20px"}}
        />
      </div>
    </React.Fragment>
  );
};
export default IconWithState;
