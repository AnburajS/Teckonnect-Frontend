import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const HashColorActions = (props) => {

  const { data, viewHashtagData } = props;

  const propVals = JSON.parse(JSON.stringify(data));
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);

  const toggleHashtag = () => {
    viewHashtagData(propVals);
  };

  return (
    <React.Fragment>
      <div className="d-flex align-items-center justify-content-end" >
        <div className="d-flex align-items-center mt-2 c1" onClick={toggleHashtag}>
          <Link to="#" className="eep_kebab_btn" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.edit }}></Link>
          <span className="font-weight-light ml-2">Edit</span>
        </div>
      </div>
    </React.Fragment>
  );
};
export default HashColorActions;