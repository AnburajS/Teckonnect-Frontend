import React, { useEffect, useState } from 'react';

const FinancialYearSettings = (props) => {
  const [monthList, setMonthList] = useState([]);

  const yearSelectHandler = (argindex) => {
    let yearTempObj = monthList;
    yearTempObj.map((val, index) => {
      if (index === argindex) {
        val.isSelected = true;
        val.index = index + 1;
      } else {
        val.isSelected = false;
      }
      setMonthList([...yearTempObj]);
    });
    props.setState({
      ...props.state,
      ['financialYear']: yearTempObj?.find((v) => v.isSelected)?.index,
    });
  };

  const fetchMonthData = () => {
    fetch(`${process.env.PUBLIC_URL}/data/portalSettings.json`)
      .then((response) => response.json())
      .then((data) => {
        if (props?.state?.financialYear) {
          const date = data?.months.map((v, i) => {
            if (props?.state?.financialYear === i + 1) {
              v.isSelected = true;
            } else {
              v.isSelected = false;
            }
            return v;
          });
          setMonthList([...date]);
        } else {
          setMonthList(data.months);
        }
      });
  };

  useEffect(() => {
    fetchMonthData();
  }, []);

  return (
    <React.Fragment>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="heading">
          <span> Financial Year </span>
        </div>
      </div>

      <div
        className="eep_scroll_y"
        style={{ height: '85%' }}
      >
        <div className="row no-gutter">
          {monthList &&
            monthList.map((item, index) => {
              return (
                <div
                  className="col-sm-12 col-md-12 col-lg-6 col-xl-6"
                  key={'month_' + index}
                >
                  <div
                    id={'month_Id' + index}
                    className={`theam_container bg-white d-flex justify-content-center align-items-center ${
                      item.isSelected ? 'active-setting' : ' '
                    }`}
                    onClick={() => yearSelectHandler(index)}
                  >
                    <p className="title m-2">{item.month}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </React.Fragment>
  );
};

export default FinancialYearSettings;
