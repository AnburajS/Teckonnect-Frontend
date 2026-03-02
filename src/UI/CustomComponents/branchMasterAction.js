import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const BranchMasterActions = (props) => {

  const { data, getDeptData, isDelete, setisOpen } = props;
  //const propVals = props;
  const propVals = JSON.parse(JSON.stringify(data));

  const svgIcons = useSelector((state) => state.sharedData.svgIcons);

  const viewModeModal = () => {
    propVals.deptEditMode = false;
    getDeptData(propVals);
    Object.preventExtensions(propVals);
  };

  const editModeModal = () => {
    propVals.deptEditMode = true;
    getDeptData(propVals);
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
            data-target="#CreateBranchModal"
            className="dropdown-item"
            onClick={editModeModal}
          >
            Modify Branch
          </Link>
          {/* <div className="dropdown-divider"></div>
          <Link
            to="#"
            data-toggle="modal"
            data-target="#DeptMasterModal"
            className="dropdown-item"
            onClick={isDelete}
          >
            Delete Branch
          </Link> */}
        </div>
      </div>

    </React.Fragment>
  );
};
export default BranchMasterActions;
