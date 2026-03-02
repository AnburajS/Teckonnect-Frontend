import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import Slider from 'react-slick';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';
import ResponseInfo from '../../UI/ResponseInfo';
import ImagePreloader from './ImagePreloader';

const Template = () => {
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission
  );
  const [cardTemplates, setcardTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'RECOGNIZE',
      link: 'app/recognition',
    },
    {
      label: 'Template Library',
      link: 'app/Ecards',
    },
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Recognition',
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  });

  var settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    adaptiveHeight: true,
    slidesToScroll: 1,
    padSlides: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const fetchCardData = () => {
    setIsLoading(true);
    const obj = {
      url: URL_CONFIG.ALL_ECARDS,
      method: 'get',
    };
    httpHandler(obj)
      .then((response) => {
        const groupByCategory = response.data.reduce((group, card) => {
          const { category } = card;
          group[category] = group[category] ?? [];
          group[category].push(card);
          return group;
        }, {});
        setcardTemplates(groupByCategory);
        setIsLoading(false);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    fetchCardData();
  }, []);

  return (
    <React.Fragment>
      {userRolePermission.ecardTemplates && (
        <div className="eep-inner-tasks-div">
          <div id="Templateaccordion">
            <div className="card eep-card   eep-cardSliderr birthday-template-card">
              <div
                className="card-header"
                id="headingOne"
              >
                <div
                  className="row px-4 pt-3 pb-1 mx-0"
                  data-toggle="collapse"
                  data-target="#collapseBirthdayTemplate"
                  aria-expanded="true"
                  aria-controls="collapseBirthdayTemplate"
                >
                  <a className="col-sm-11 p-0 collapseTemplate c1">Birthday</a>
                  <Link
                    to="/app/birthdaytemplatesettings"
                    className="setting_icon ml-auto p-0 pr-1 col-sm-1 text-right"
                    dangerouslySetInnerHTML={{
                      __html: svgIcons && svgIcons.pencil,
                    }}
                  ></Link>
                </div>
              </div>
              <div
                id="collapseBirthdayTemplate"
                className="collapse show"
                aria-labelledby="headingOne"
                data-parent="#Templateaccordion"
              >
                <div className="card-body">
                  <div className="row birthdy_div">
                    <div className="col-md-12">
                      {cardTemplates &&
                        cardTemplates.birthday &&
                        cardTemplates.birthday.length > 0 && (
                          <Slider {...settings}>
                            {cardTemplates.birthday.map((item, index) => {
                              return (
                                <div
                                  className="parent_slider_img"
                                  key={'birthdayTemplate_' + index}
                                >
                                  <img
                                    src={item?.imageByte?.image}
                                    className="slider_image"
                                    id={index}
                                    alt="E-Card"
                                    style={{ height: '180px' }}
                                  />
                                </div>
                              );
                            })}
                          </Slider>
                        )}
                      {!isLoading &&
                        cardTemplates &&
                        !cardTemplates.birthday && (
                          <ResponseInfo
                            title="No records found!."
                            responseImg="noRecord"
                            responseClass="response-info"
                          />
                        )}
                      {isLoading &&
                        cardTemplates &&
                        !cardTemplates.birthday && <ImagePreloader />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card eep-card eep-cardSliderr anniversary-template-card">
              <div
                className="card-header"
                id="headingTwo"
              >
                <div
                  className="row px-4 pt-3 pb-1 mx-0 collapsed"
                  data-toggle="collapse"
                  data-target="#collapseAnniversaryTemplate"
                  aria-expanded="false"
                  aria-controls="collapseAnniversaryTemplate"
                >
                  <a
                    className="col-sm-11 p-0 collapseTemplate c1"
                    parentclss="birthday-card"
                    collapsetemplateid="collapseBirthdayTemplates"
                  >
                    Work Anniversary
                  </a>
                  <Link
                    to="/app/workanniversarysettings"
                    className="setting_icon ml-auto p-0 pr-1 col-sm-1 text-right"
                    dangerouslySetInnerHTML={{
                      __html: svgIcons && svgIcons.pencil,
                    }}
                  ></Link>
                </div>
              </div>
              <div
                id="collapseAnniversaryTemplate"
                className="collapse"
                aria-labelledby="headingTwo"
                data-parent="#Templateaccordion"
              >
                <div className="card-body">
                  <div className="row annivdy_div">
                    <div className="col-md-12">
                      {cardTemplates &&
                        cardTemplates.anniversary &&
                        cardTemplates.anniversary.length > 0 && (
                          <Slider {...settings}>
                            {cardTemplates.anniversary.map((item, index) => {
                              return (
                                <div
                                  className="parent_slider_img"
                                  key={'anniversTemplate_' + index}
                                >
                                  <img
                                    src={item?.imageByte?.image}
                                    className="slider_image"
                                    id={index}
                                    alt="E-Card"
                                    style={{ height: '180px' }}
                                  />
                                </div>
                              );
                            })}
                          </Slider>
                        )}
                      {!isLoading &&
                        cardTemplates &&
                        !cardTemplates.hasOwnProperty('anniversary') && (
                          <ResponseInfo
                            title="No records found!."
                            responseImg="noRecord"
                            responseClass="response-info"
                          />
                        )}
                      {isLoading &&
                        cardTemplates &&
                        !cardTemplates.anniversary && <ImagePreloader />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card eep-card eep-cardSliderr appreciation-template-card">
              <div
                className="card-header"
                id="headingThree"
              >
                <div
                  className="row px-4 pt-3 pb-1 mx-0 collapsed"
                  data-toggle="collapse"
                  data-target="#collapseAppreciationTemplate"
                  aria-expanded="false"
                  aria-controls="collapseAppreciationTemplate"
                >
                  <a className="col-sm-11 p-0 collapseTemplate c1">Kudos</a>
                  <Link
                    to="/app/appreciationtemplatesettings"
                    className="setting_icon ml-auto p-0 pr-1 col-sm-1 text-right"
                    dangerouslySetInnerHTML={{
                      __html: svgIcons && svgIcons.pencil,
                    }}
                  ></Link>
                </div>
              </div>
              <div
                id="collapseAppreciationTemplate"
                className="collapse"
                aria-labelledby="headingThree"
                data-parent="#Templateaccordion"
              >
                <div className="card-body">
                  <div className="row appreciation_div">
                    <div className="col-md-12">
                      {cardTemplates &&
                        cardTemplates.appreciation &&
                        cardTemplates.appreciation.length > 0 && (
                          <Slider {...settings}>
                            {cardTemplates.appreciation.map((item, index) => {
                              return (
                                <div
                                  className="parent_slider_img"
                                  key={'appreciationTemplate_' + index}
                                >
                                  <img
                                    src={item?.imageByte?.image}
                                    className="slider_image"
                                    id={index}
                                    alt="E-Card"
                                    style={{ height: '180px' }}
                                  />
                                </div>
                              );
                            })}
                          </Slider>
                        )}
                      {!isLoading &&
                        cardTemplates &&
                        !cardTemplates.hasOwnProperty('appreciation') && (
                          <ResponseInfo
                            title="No records found!."
                            responseImg="noRecord"
                            responseClass="response-info"
                          />
                        )}
                      {isLoading &&
                        cardTemplates &&
                        !cardTemplates.appreciation && <ImagePreloader />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card eep-card eep-cardSliderr seasonal-template-card">
              <div
                className="card-header"
                id="headingFour"
              >
                <div
                  className="row px-4 pt-3 pb-1 mx-0 collapsed"
                  data-toggle="collapse"
                  data-target="#collapseSeasonTemplate"
                  aria-expanded="false"
                  aria-controls="collapseSeasonTemplate"
                >
                  <a className="col-sm-11 p-0 collapseTemplate c1">
                    Festive Wishes
                  </a>
                  <Link
                    to="/app/seasonaltemplatesettings"
                    className="setting_icon ml-auto p-0 pr-1 col-sm-1 text-right"
                    dangerouslySetInnerHTML={{
                      __html: svgIcons && svgIcons.pencil,
                    }}
                  ></Link>
                </div>
              </div>
              <div
                id="collapseSeasonTemplate"
                className="collapse"
                aria-labelledby="headingFour"
                data-parent="#Templateaccordion"
              >
                <div className="card-body">
                  <div className="row seasonal_div">
                    <div className="col-md-12">
                      {cardTemplates &&
                        cardTemplates.seasonal &&
                        cardTemplates.seasonal.length > 0 && (
                          <Slider {...settings}>
                            {cardTemplates.seasonal.map((item, index) => {
                              return (
                                <div
                                  className="parent_slider_img"
                                  key={'seasonalTemplate_' + index}
                                >
                                  <img
                                    src={item?.imageByte?.image}
                                    className="slider_image"
                                    id={index}
                                    alt="E-Card"
                                    style={{ height: '180px' }}
                                  />
                                </div>
                              );
                            })}
                          </Slider>
                        )}
                      {!isLoading &&
                        cardTemplates &&
                        !cardTemplates.hasOwnProperty('seasonal') && (
                          <ResponseInfo
                            title="No records found!."
                            responseImg="noRecord"
                            responseClass="response-info"
                          />
                        )}
                      {isLoading &&
                        cardTemplates &&
                        !cardTemplates.seasonal && <ImagePreloader />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
export default Template;
