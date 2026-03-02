import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
const EmailActionDropDown = (props) => {
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  return (
    <div className="ans-type text-center c1 ">
      <span
        className="eep_kebab_btn"
        data-toggle="dropdown"
        aria-expanded="false"
        dangerouslySetInnerHTML={{
          __html: svgIcons && svgIcons.colon,
        }}
      ></span>

      <div className="eep-dropdown-menu  dropdown-menu dropdown-menu-right shadowdrop pt-3 pb-">
        <Link
          className="dropdown-item"
          to={`/app/viewtemplate`}
          state={{ data: props?.data }}
        >
          View Template
        </Link>

        <div className="dropdown-divider"></div>
        <Link
          className="dropdown-item"
          to={`/app/updatetemplate`}
          state={{ data: props?.data }}
        >
          Modify Template
        </Link>

        <div className="dropdown-divider"></div>
        <Link
          className="dropdown-item"
          // to={`/app/tiggermail`}
          to={`/app/trigger`}
          state={{ data: props?.data }}
        >
          Send Email
        </Link>
      </div>
    </div>
  );
};

export default EmailActionDropDown;
