import React from 'react';
import { Link } from 'react-router-dom';

const ResponseCustomComponent = (props) => {
  const { data, cSettings, type, isButton, onClick } = props;
  const imgPath = process.env.PUBLIC_URL + '/images/icons/static/';
  const getIconPath = () => {
    if (data) {
      if (data?.[cSettings?.objReference] <= 30) {
        return imgPath + cSettings?.['minScore'];
      } else if (
        data?.[cSettings?.objReference] >= 31 &&
        data?.[cSettings?.objReference] <= 70
      ) {
        return imgPath + cSettings?.['avgScore'];
      } else if (data?.[cSettings?.objReference] >= 71) {
        return imgPath + cSettings?.['maxScore'];
      } else {
        return imgPath + cSettings?.['default'];
      }
    } else {
      return imgPath + cSettings?.['default'];
    }
  };

  return (
    <>
      {isButton ? (
        <Link
          to={'#'}
          onClick={() => onClick(data)}
        >
          {/* <Link to={type === "survey" ? "surveyresponses" : type === "polls" ? "pollanswer" : "#"}> */}
          {/* <img src={`${process.env.PUBLIC_URL}/images/icons/${data.score <= 30 ? "res-red.svg" : (data.score >= 31) && (data.score <= 70) ? "res-yellow.svg" : (data.score >= 71) && (data.score <= 100) ? "res-green.svg" : ""}`} height="22px" alt="Response-icon" /> */}
          <img
            src={getIconPath()}
            height="22px"
            alt={cSettings?.title}
          />
        </Link>
      ) : (
        <Link
          to={
            type !== '' && type === 'survey'
              ? {
                  pathname: '/app/surveyresponses',
                  state: { surveyData: data },
                }
              : type !== '' && type === 'polls'
              ? {
                  pathname: '/app/pollanswer',
                  state: { pollData: data, viewType: 'notFromPoll' },
                }
              : {}
          }
          state={
            type !== '' && type === 'survey'
              ? { surveyData: data }
              : type !== '' && type === 'polls'
              ? { pollData: data, viewType: 'notFromPoll' }
              : {}
          }
        >
          {/* <Link to={type === "survey" ? "surveyresponses" : type === "polls" ? "pollanswer" : "#"}> */}
          {/* <img src={`${process.env.PUBLIC_URL}/images/icons/${data.score <= 30 ? "res-red.svg" : (data.score >= 31) && (data.score <= 70) ? "res-yellow.svg" : (data.score >= 71) && (data.score <= 100) ? "res-green.svg" : ""}`} height="22px" alt="Response-icon" /> */}
          <img
            src={getIconPath()}
            height="22px"
            alt={cSettings?.title}
          />
        </Link>
      )}
    </>
  );
};

export default ResponseCustomComponent;
