import React from "react";
const Card = (props) => {
  return (
    <div className={props.className}>
      <div className="card eep_box_shadow br-15">
        <div className="card-body">{props.children}</div>
      </div>
    </div>
  );
};
export default Card;
