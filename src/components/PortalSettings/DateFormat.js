import React, { useEffect, useState } from "react";

const DateFormat = (props) => {

  const [dateList, setDateList] = useState([]);
  const [timeList, setTimeList] = useState([]);

  const DateTimeHandler = (arg, argindx) => {
    
    let yearTempObj;
    if (arg.type === "date") {
      yearTempObj = dateList;
      yearTempObj.map((val, index) => {
        if (index === argindx) {
          val.isSelected = true;
        } else {
          val.isSelected = false;
        }
        return val;
      });
      setDateList([...yearTempObj]);
      props.setState({ ...props.state, ['dateFormat']: yearTempObj?.find(v => v.isSelected)?.date })
    } else if (arg.type === "time") {
      yearTempObj = timeList;
      yearTempObj.map((val, index) => {
        if (index === argindx) {
          val.isSelected = true;
        } else {
          val.isSelected = false;
        }
        return val;
      })
      setTimeList([...yearTempObj]);
      props.setState({ ...props.state, ['timeFormat']: yearTempObj?.find(v => v.isSelected)?.time })
    }
  }

  const fetchTimeData = () => {
    fetch(`${process.env.PUBLIC_URL}/data/portalSettings.json`)
      .then((response) => response.json())
      .then((data) => {
        if (props?.state?.timeFormat) {
          const time = data?.timeFormats.map(v => {
            if (props?.state?.timeFormat === v?.time) {
              v.isSelected = true;
            } else {
              v.isSelected = false;
            }
            return v
          })
          setTimeList([...time]);
        } else { setTimeList(data.timeFormats); }
      });
  };

  const fetchDateData = async () => {
    fetch(`${process.env.PUBLIC_URL}/data/portalSettings.json`)
      .then((response) => response.json())
      .then((data) => {
        if (props?.state?.dateFormat) {
          const date = data?.DateFormats.map(v => {
            if (props?.state?.dateFormat === v?.date) {
              v.isSelected = true;
            } else {
              v.isSelected = false;
            }
            return v
          })
          setDateList([...date]);
        } else {
          setDateList(data.DateFormats);
        }
      });
  };

  useEffect(() => {
    fetchDateData()
    fetchTimeData();
  }, []);

  return (
    <React.Fragment>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="heading"><span> Date Format </span></div>
      </div>

      <div className="eep_scroll_y mb-3" style={{ height: "40%" }}>

        <div className="row no-gutter">
          {dateList && dateList.map((item, index) => {
            return (
              <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6" key={"date_" + index}>
                <div id={"date_Id" + index} className={`theam_container bg-white d-flex justify-content-center align-items-center ${item.isSelected ? "active-setting" : " "}`} onClick={() => DateTimeHandler(item, index)}>
                  <p className="title m-2">{item.date}</p>
                </div>
              </div>
            )
          })}

        </div>

      </div>


      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="heading"><span> Time Format </span></div>
      </div>

      <div className="eep_scroll_y" style={{ height: "40%" }}>

        <div className="row no-gutter">
          {timeList && timeList.map((item, index) => {
            return (
              <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6" key={"time_" + index}>
                <div id={"time_Id" + index} className={`theam_container bg-white d-flex justify-content-center align-items-center ${item.isSelected ? "active-setting" : " "}`} onClick={() => DateTimeHandler(item, index)}>
                  <p className="title m-2">{item.time}</p>
                </div>
              </div>
            )
          })}
        </div>

      </div>

    </React.Fragment>
  );
};

export default DateFormat;
