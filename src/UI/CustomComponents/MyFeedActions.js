import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const MyFeedActions = (props) => {

  const { data, deleteFeeds } = props;

  const svgIcons = useSelector((state) => state.sharedData.svgIcons);

  const deleteModeModal = (arg) => {
    deleteFeeds(arg);
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

        <div className="eep-dropdown-menu dropdown-menu dropdown-menu-right shadow pt-4 pb-4">
          <Link
            to="#"
            className="dropdown-item"
            onClick={() => deleteModeModal(data)}
          >
            Delete
          </Link>
        </div>
      </div>

    </React.Fragment>
  );
};
export default MyFeedActions;
