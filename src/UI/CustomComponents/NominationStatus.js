import React from "react";

const NominationStatus = (props) => {

  const {data} = props;

  return (
    <React.Fragment>
      <div className="ans-type text-end">
        <img
            src={data.nominated ? `${process.env.PUBLIC_URL}/images/icons/approved.svg` : `${process.env.PUBLIC_URL}/images/icons/waiting.svg`}
            className="r_award_img selected"
            alt="Status Icon"
            title={data.nominated ? "Nominated": "Waiting"}
            style={{width:"25px"}}
        />
      </div>
    </React.Fragment>
  );
};
export default NominationStatus;
