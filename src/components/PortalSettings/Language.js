import React, { useEffect, useState } from "react";
import i18n from "i18next";

const Language = (props) => {
  const [languageList, setLanguageList] = useState([]);

  const langSelectHandler = (item) => {
    const languageTempObj = languageList.map((val) => {
      return {
        ...val,
        isSelected: val.language === item.language ? true : false,
      };
    });
    setLanguageList(languageTempObj);
    props.setState({
      ...props.state,
      ["language"]: languageTempObj?.find((v) => v.isSelected)?.language,
    });
  };

  const fetchLanguageData = () => {
    fetch(`${process.env.PUBLIC_URL}/data/portalSettings.json`)
      .then((response) => response.json())
      .then((data) => {
        if (props?.state?.language) {
          const date = data?.language.map((v) => {

            if (props?.state?.language === v?.language) {
              v.isSelected = true;
            } else {
              v.isSelected = false;
            }

            return v;
          });

          setLanguageList([...date]);
        } else {
          setLanguageList(data.language);
        }
      });
  };

  useEffect(() => {
    fetchLanguageData();
  }, []);

  return (
    <React.Fragment>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="heading">
          <span> Select Language </span>
        </div>
      </div>

      <div className="eep_scroll_y mb-3" style={{ height: "90%" }}>
        <div className="row no-gutter">
          {languageList &&
            languageList.map((item, index) => {
              return (
                <div
                  className="col-sm-12 col-md-12 col-lg-6 col-xl-6"
                  key={"lang_" + index}
                >
                  <div
                    id={"lang_Id" + index}
                    className={`theam_container bg-white d-flex justify-content-center align-items-center ${
                      item.isSelected ? "active-setting" : " "
                    }`}
                    onClick={() => langSelectHandler(item)}
                  >
                    <p className="title m-2">{item.language}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Language;
