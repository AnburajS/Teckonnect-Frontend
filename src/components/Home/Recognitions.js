import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Recognitions = (props) => {
  const { dashboardDetails } = props;
  const { t } = useTranslation();

  return (
    <div className="bg-f5f5f5 br-15 mb-3 recognitions_section h-100">
      <div className="p-3">
        <h4 className="title_lbl"> {t(`dashboard.Recognitions`)}</h4>
        <div className="row dashboard_recog_div">
          <div className="col-sm-3 col-xs-3 col-md-3 mb-3 appriciationdv c1 eep-scale-animation eep-shake">
            <div className="bg-white br-10 p-3 h-100 appriciationdv_inner ">
              <Link
                to={{
                  pathname: '/app/ecardIndex',
                }}
                state={{ activeTab: 'InboxTab', activeAccord: 'Birthday' }}
              >
                <div className="d_recog_head">
                  <div className="d_recog_icon_div eep-shake-animation">
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        '/images/icons/recognition/e-cards.svg'
                      }
                      className="d_recog_icon"
                      alt="E-Cards"
                    />
                  </div>
                  <label className="mb-0 ml-2">
                    {t(`dashboard.Appreciations`)}{' '}
                  </label>
                </div>
                <div className="d_recog_count">
                  <p className="d_appre_count mb-0">
                    {dashboardDetails.appreciations > 9
                      ? dashboardDetails.appreciations
                      : '0' + dashboardDetails.appreciations}
                  </p>
                </div>
              </Link>
            </div>
          </div>
          {/* <div
            className="col-sm-3 col-xs-3 col-md-3 mb-3 pointsdv c1 eep-scale-animation eep-shake"
            id="panel1"
          >
            <div className="bg-white br-10 p-3 h-100 appriciationdv_inner">
              <Link
                to={{ pathname: '/app/points' }}
                state={{ activeTab: 'points' }}
              >
                <div className="d_recog_head">
                  <div className="d_recog_icon_div eep-shake-animation">
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        '/images/icons/tasks/points.svg'
                      }
                      className="d_recog_icon"
                      alt="Points"
                      title="Points"
                    />
                  </div>
                  <label className="mb-0 ml-2"> {t(`dashboard.Points`)}</label>
                </div>
                <div className="d_recog_count">
                  <p className="d_point_count mb-0">
                    {dashboardDetails.points > 9
                      ? dashboardDetails.points
                      : '0' + dashboardDetails.points}
                  </p>
                </div>
              </Link>
            </div>
          </div> */}
          <div className="col-sm-3 col-xs-3 col-md-3 mb-3 certificatesdv c1 eep-scale-animation eep-shake">
            <div className="bg-white br-10 p-3 h-100 appriciationdv_inner">
              <Link
                to={{
                  pathname: '/app/certificates',
                }}
                state={{ activeTab: 'mycertificate' }}
              >
                <div className="d_recog_head">
                  <div className="d_recog_icon_div eep-shake-animation">
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        '/images/icons/tasks/certificates.svg'
                      }
                      className="d_recog_icon"
                      alt="Certificates"
                      title="Certificates"
                    />
                  </div>
                  <label className="mb-0 ml-2">
                    {' '}
                    {t(`dashboard.Certificates`)}
                  </label>
                </div>
                <div className="d_recog_count">
                  <p className="d_certificates_count mb-0">
                    {dashboardDetails.certificates > 9
                      ? dashboardDetails.certificates
                      : '0' + dashboardDetails.certificates}
                  </p>
                </div>
              </Link>
            </div>
          </div>
         
          <div className="col-sm-3 col-xs-3 col-md-3 mb-3 badgesdv c1 eep-scale-animation eep-shake">
            <div className="bg-white br-10 p-3 h-100 appriciationdv_inner">
              <Link
                to={{
                  pathname: '/app/badges',
                }}
                state={{ activeTab: 'mybadgeTab' }}
              >
                <div className="d_recog_head">
                  <div className="d_recog_icon_div eep-shake-animation">
                    <img
                      src={
                        process.env.PUBLIC_URL + '/images/icons/tasks/badge.svg'
                      }
                      className="d_recog_icon"
                      alt="Badges"
                      title="Badges"
                    />
                  </div>
                  <label className="mb-0 ml-2"> {t(`dashboard.Badges`)}</label>
                </div>
                <div className="d_recog_count">
                  <p className="d_badges_count mb-0">
                    {dashboardDetails.badges > 9
                      ? dashboardDetails.badges
                      : '0' + dashboardDetails.badges}
                  </p>
                </div>
              </Link>
            </div>
          </div>
           <div className="col-sm-3 col-xs-3 col-md-3 mb-3 awardsdv c1 eep-scale-animation eep-shake">
            <div className="bg-white br-10 p-3 h-100 appriciationdv_inner">
              <Link
                to={{
                  pathname: '/app/awards',
                }}
                state={{ activeTab: 'MyAwardsTab' }}
              >
                <div className="d_recog_head">
                  <div className="d_recog_icon_div eep-shake-animation">
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        '/images/icons/tasks/awards.svg'
                      }
                      className="d_recog_icon"
                      alt="Awards"
                      title="Awards"
                    />
                  </div>
                  <label className="mb-0 ml-2"> {t(`dashboard.Awards`)}</label>
                </div>
                <div className="d_recog_count">
                  <p className="d_awards_count mb-0">
                    {dashboardDetails.awards > 9
                      ? dashboardDetails.awards
                      : '0' + dashboardDetails.awards}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recognitions;
