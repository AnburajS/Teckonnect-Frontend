import React from 'react';
import { Link } from 'react-router-dom';

const MetricCustomComponent = (props) => {
  const { data, cSettings, type, setModelData, setIsModalOpen } = props;
  const imgPath = process.env.PUBLIC_URL + '/images/icons/static/';
  const getIconPathh = () => {
    return imgPath + cSettings?.['metric'];
  };

  return (
    <Link
      to={type !== '' && type === 'metric' ? { pathname: '/app/metric' } : {}}
      state={type !== '' && type === 'metric' ? { surveyData: data } : {}}
      onClick={
        type !== ''
          ? null
          : () => {
              setModelData(data);
              setIsModalOpen(true);
            }
      }
    >
      {/* <Link to={type === "survey" ? "surveyresponses" : type === "polls" ? "pollanswer" : "#"}> */}
      {/* <img src={`${process.env.PUBLIC_URL}/images/icons/${data.score <= 30 ? "res-red.svg" : (data.score >= 31) && (data.score <= 70) ? "res-yellow.svg" : (data.score >= 71) && (data.score <= 100) ? "res-green.svg" : ""}`} height="22px" alt="Response-icon" /> */}
      <img
        src={getIconPathh()}
        height="22px"
        alt={cSettings?.title}
      />
    </Link>
  );
};

export default MetricCustomComponent;
