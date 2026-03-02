import React from "react";
import { formatDate } from "../../shared/SharedService";

const DateFormatDisplay = (props) => {

  const {data, cSettings} = props;

  return (
    <React.Fragment>
      <div className="ans-type text-left">
        <span className="tableDates">{data[cSettings.objReference] ? formatDate(data[cSettings.objReference]) : "--"}</span>
      </div>
    </React.Fragment>
  );
};
export default DateFormatDisplay;
