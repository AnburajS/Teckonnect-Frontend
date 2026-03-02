import React from 'react';
import { Link } from 'react-router-dom';

const PulseCustomComponent = (props) => {
  const { data, cSettings, type } = props;
  const imgPath = process.env.PUBLIC_URL + '/images/icons/static/';
  const getIconPathh = () => {
    return imgPath + cSettings?.['pulse'];
  };

  return (
    <Link
      to={type !== '' && type === 'pulse' ? { pathname: '/app/pulse' } : {}}
      state={type !== '' && type === 'pulse' ? { surveyData: data } : {}}
    >
      {/* <Link to={type === "survey" ? "surveyresponses" : type === "polls" ? "pollanswer" : "#"}> */}
      {/* <img src={`${process.env.PUBLIC_URL}/images/icons/${data.score <= 30 ? "res-red.svg" : (data.score >= 31) && (data.score <= 70) ? "res-yellow.svg" : (data.score >= 71) && (data.score <= 100) ? "res-green.svg" : ""}`} height="22px" alt="Response-icon" /> */}
      <img
        src={getIconPathh()}
        height="22px"
        alt={'Pulse'}
      />
    </Link>
  );
};

export default PulseCustomComponent;
