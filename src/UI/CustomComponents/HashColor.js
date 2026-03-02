import React from "react";
const HashColor = (props) => {

  const {data} = props;

  const colorCode = data.colorCode.indexOf("#") !== -1 ? data.colorCode : "#" + data.colorCode;
  return (
    <div
      className="hastag-color-inner"
      style={{ backgroundColor: colorCode }}
    ></div>
  );
};
export default HashColor;
