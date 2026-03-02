import React from "react";

const ApprovalStatus = (props) => {

  const {data} = props;

  return (
    <React.Fragment>
      <div className="ans-type">
        <img
            src={data.recognized ? `${process.env.PUBLIC_URL}/images/icons/approved.svg` : `${process.env.PUBLIC_URL}/images/icons/waiting.svg`}
            className="r_award_img selected"
            alt="Status Icon"
            title={data.recognized ? "Approved": "Waiting"}
            style={{width:"25px"}}
        />
      </div>
    </React.Fragment>
  );
};
export default ApprovalStatus;
