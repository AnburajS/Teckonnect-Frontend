import React from "react";
import { useSelector } from "react-redux";

const MyIdeaActions = (props) => {
  //const propVals = props;
  //const propVals = JSON.parse(JSON.stringify(props));

  const { data, unPostIdea, postIdea, deleteIdea, viewIdea, editIdea } = props;

  const svgIcons = useSelector((state) => state.sharedData.svgIcons);

  const viewModeModal = (arg) => {
    viewIdea(arg);
  };

  const unPostModeModal = (arg) => {
    unPostIdea(arg);
  };

  const postModeModal = (arg) => {
    postIdea(arg);
  };

  const deleteModeModal = (arg) => {
    deleteIdea(arg);
  };

  const editModeModal = (arg) => {
    editIdea(arg);
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
          <a
            className="dropdown-item c1"
            onClick={() => editModeModal(data)}
          >
            Edit
          </a>
          {data.active &&
            <a
              className="dropdown-item c1"
              onClick={() => unPostModeModal(data)}
            >
              Unpost
            </a>
          }
          {!data.active &&
            <a
              className="dropdown-item c1"
              onClick={() => postModeModal(data)}
            >
              Post
            </a>
          }
          <a
            className="dropdown-item c1"
            onClick={() => deleteModeModal(data)}
          >
            Delete
          </a>
          <a
            className="dropdown-item c1"
            onClick={() => viewModeModal(data)}
          >
            View
          </a>
        </div>
      </div>

    </React.Fragment>
  );
};
export default MyIdeaActions;
