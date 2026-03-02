import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const CountryMappingActions = (props) => {

  const { data, getCountryData, isDelete, setisOpen } = props;
  const propVals = JSON.parse(JSON.stringify(data));
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);

  const deleteModeModal = () => {
    isDelete(propVals);
    Object.preventExtensions(propVals);
  };

  const editModeModal = () => {
    propVals.countryEditMode = true;
    getCountryData(propVals);
    setisOpen(true)
    Object.preventExtensions(propVals);
  };

  return (
    <React.Fragment>
      <div className="ans-type text-center c1">
        <span
          className="eep_kebab_btn"
          data-toggle="dropdown"
          aria-expanded="false"
          dangerouslySetInnerHTML={{
            __html: svgIcons && svgIcons.colon,
          }}
        ></span>

        <div className="eep-dropdown-menu dropdown-menu dropdown-menu-right shadowdrop pt-4 pb-4">
          <Link
            to="#"
            data-toggle="modal"
            data-target="#CreateYGGCountryModal"
            className="dropdown-item"
            onClick={editModeModal}
          >
            Modify Country
          </Link>
          <div className="dropdown-divider"></div>
            <Link
              to="#"
              data-toggle="modal"
              data-target="#DeptMasterModal"
              className="dropdown-item"
              onClick={deleteModeModal}
            >
            Delete Country
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
};
export default CountryMappingActions;
