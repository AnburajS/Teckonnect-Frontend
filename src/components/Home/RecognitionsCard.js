import React from "react";

const RecognitionsDisplayCard = (props) => {
  const { dashboardDetails } = props;
  return (
    <div className="bg-f5f5f5 br-15 mb-3 recognitions_section h-100">
      <div className="p-3">
        <h4 className="title_lbl">Recognitions</h4>
        <div className="row dashboard_recog_div">
          <div className="col-sm-6 col-xs-6 col-md-6 mb-3 appriciationdv eep-scale-animation eep-shake">
            <div className="bg-white br-10 p-3 h-100 appriciationdv_inner ">
              <div className="d_recog_head">
                <div className="d_recog_icon_div eep-shake-animation">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      "/images/icons/recognition/e-cards.svg"
                    }
                    className="d_recog_icon"
                    alt="E-Cards"
                  />
                </div>
                <label className="mb-0 ml-2">E-Cards</label>
              </div>
              <div className="d_recog_count">
                <p className="d_appre_count mb-0">
                  {dashboardDetails.appreciations > 9
                    ? dashboardDetails.appreciations
                    : "0" + dashboardDetails.appreciations}
                </p>
              </div>
            </div>
          </div>
          {/* <div
            className="col-sm-6 col-xs-6 col-md-6 mb-3 pointsdv eep-scale-animation eep-shake"
            id="panel1"
          >
            <div className="bg-white br-10 p-3 h-100 appriciationdv_inner">
              <div className="d_recog_head">
                <div className="d_recog_icon_div eep-shake-animation">
                  <img
                    src={
                      process.env.PUBLIC_URL + '/images/icons/tasks/points.svg'
                    }
                    className="d_recog_icon"
                    alt="Points"
                    title="Points"
                  />
                </div>
                <label className="mb-0 ml-2">Points</label>
              </div>
              <div className="d_recog_count">
                <p className="d_point_count mb-0">
                  {dashboardDetails.points > 9
                    ? dashboardDetails.points
                    : '0' + dashboardDetails.points}
                </p>
              </div>
            </div>
          </div> */}
          <div className="col-sm-6 col-xs-6 col-md-6 mb-3 certificatesdv eep-scale-animation eep-shake">
            <div className="bg-white br-10 p-3 h-100 appriciationdv_inner">
              <div className="d_recog_head">
                <div className="d_recog_icon_div eep-shake-animation">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      "/images/icons/tasks/certificates.svg"
                    }
                    className="d_recog_icon"
                    alt="Certificates"
                  />
                </div>
                <label className="mb-0 ml-2">Certificates</label>
              </div>
              <div className="d_recog_count">
                <p className="d_certificates_count mb-0">
                  {dashboardDetails.certificates > 9
                    ? dashboardDetails.certificates
                    : "0" + dashboardDetails.certificates}
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-sm-6 col-xs-6 col-md-6 mb-3 badgesdv eep-scale-animation eep-shake">
            <div className="bg-white br-10 p-3 h-100 appriciationdv_inner">
              <div className="d_recog_head">
                <div className="d_recog_icon_div eep-shake-animation">
                  <img
                    src={
                      process.env.PUBLIC_URL + "/images/icons/tasks/badge.svg"
                    }
                    className="d_recog_icon"
                    alt="Badges"
                  />
                </div>
                <label className="mb-0 ml-2">Badges</label>
              </div>
              <div className="d_recog_count">
                <p className="d_badges_count mb-0">
                  {dashboardDetails.badges > 9
                    ? dashboardDetails.badges
                    : "0" + dashboardDetails.badges}
                </p>
              </div>
            </div>
          </div>
<div className="col-sm-6 col-xs-6 col-md-6 mb-3 awardsdv eep-scale-animation eep-shake">
            <div className="bg-white br-10 p-3 h-100 appriciationdv_inner">
              <div className="d_recog_head">
                <div className="d_recog_icon_div eep-shake-animation">
                  <img
                    src={
                      process.env.PUBLIC_URL + "/images/icons/tasks/awards.svg"
                    }
                    className="d_recog_icon"
                    alt="Awards"
                  />
                </div>
                <label className="mb-0 ml-2">Awards</label>
              </div>
              <div className="d_recog_count">
                <p className="d_awards_count mb-0">
                  {dashboardDetails.awards > 9
                    ? dashboardDetails.awards
                    : "0" + dashboardDetails.awards}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecognitionsDisplayCard;
