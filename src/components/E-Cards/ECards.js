import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import ResponseInfo from '../../UI/ResponseInfo';
import { URL_CONFIG } from '../../constants/rest-config';
import { httpHandler } from '../../http/http-interceptor';
import ComposeCardModal from '../../modals/ComposeCardModal';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import { clearModalBackdrop } from '../../shared/SharedService';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import AddEcard from '../FormElements/AddEcard';
import ImagePreloader from './ImagePreloader';
import Slider from 'react-slick';

const ECards = ({ isDashbaord, isDashbaordData }) => {
  const [isComposeCardModal, setIsComposeCardModal] = useState(true);
  const userSessionData = sessionStorage.userData
    ? JSON.parse(sessionStorage.userData)
    : {};
  const [isLoading, setIsLoading] = useState(true);
  const [composeCardData, setComposeCardData] = useState({
    isSlider: null,
    sliderData: {},
    sliderPostn: 0,
  });
  const [cardTemplates, setcardTemplates] = useState([]);
  const [composeCardMessages, setComposeCardMessages] = useState([]);
  const [composeCardCategory, setComposeCardCategory] = useState({});
  console.log('composeCardCategory', composeCardCategory);
  const addECardStateObj = {
    birthday: true,
    anniversary: false,
    appreciation: false,
    seasonal: false,
  };
  const [addECardState, setAddECardState] = useState(addECardStateObj);
  const [showModal, setShowModal] = useState({ type: null, message: null });
  //const [showModal, setShowModal] = useState({ type: "success", message: "null", celebrations: {isCelebration: true, celebrationItem: "baloon.gif"} });
  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

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
      label: 'Ecards',
      link: '',
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

  // var settings = {
  //   // dots: false,
  //   // arrows: false,
  //   // infinite: false,
  //   // // infinite: true,
  //   // speed: 500,
  //   // slidesToShow: 3.5,
  //   // adaptiveHeight: true,
  //   // slidesToScroll: 4,
  //   // padSlides: false,
  //   dots: false,
  //   arrows: false,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 3.5,
  //   slidesToScroll: 4,
  // };
  const settings = {
    dots: false, // Show navigation dots
    infinite: true, // Infinite looping
    speed: 500, // Slide speed
    slidesToShow: 3.5, // Show only one slide at a time
    // slidesToScroll: 3.5, // Scroll one slide at a time
    initialSlide: 0.5,
    centerMode: false,
    slidesToScroll: 3,
    centerMode: false,

    // initialSlide: 0,
    prevArrow: (
      <div className="custom-arrow">
        <img
          src={`${process.env.PUBLIC_URL}/images/icons/static/LeftBar.svg`}
          className="mycert_icons"
          alt="Previous"
          title="Previous Slide"
        />
      </div>
    ), // Custom prev arrow
    nextArrow: (
      <div className="custom-arrow">
        <img
          src={`${process.env.PUBLIC_URL}/images/icons/static/RightBar.svg`}
          className="mycert_icons"
          alt="Next"
          title="Next Slide"
        />
      </div>
    ), // Custom next arro
    responsive: [
      {
        breakpoint: 1024, // For screens less than 1024px (tablet size)
        settings: {
          slidesToShow: 2, // Show 2 slides at a time
        },
      },
      {
        breakpoint: 768, // For screens less than 768px (mobile size)
        settings: {
          slidesToShow: 1, // Show 1 slide at a time
          dots: true, // Enable dots for smaller screens
        },
      },
    ],
  };
  const selectImageHandler = (e, carddataa, cat, item) => {
    let obj = {
      isSlider: true,
      sliderData: carddataa,
      sliderPostn: e.target.id,
      selectedCard: item,
    };
    setComposeCardData(obj);
    setIsComposeCardModal(true);
    let ComposeCardCategoryTemp = JSON.parse(
      JSON.stringify(composeCardCategory)
    );
    ComposeCardCategoryTemp.category = cat;
    setComposeCardCategory({
      ...composeCardCategory,
      ...ComposeCardCategoryTemp,
    });
    // setComposeCardCategory(ComposeCardCategoryTemp);
  };

  const getImageData = (arg) => {
    if (arg) {
      let obj = {
        isSlider: false,
        sliderData: arg,
        sliderPostn: 0,
      };
      setComposeCardData(obj);
      setIsComposeCardModal(true);
      let ComposeCardCategoryTemp = JSON.parse(
        JSON.stringify(composeCardCategory)
      );
      ComposeCardCategoryTemp.category = obj.sliderData.cat;

      setComposeCardCategory({
        ...composeCardCategory,
        ...ComposeCardCategoryTemp,
      });
      document.getElementById('trigger-compose-card').click();
    }
  };

  const fetchCardData = async () => {
    setIsLoading(true);
    var groupByCategory;
    const obj = {
      url: URL_CONFIG.ALL_ECARDS,
      method: 'get',
    };
    await httpHandler(obj)
      .then((response) => {
        groupByCategory = response?.data?.reduce((group, card) => {
          const { category } = card;
          group[category] = group[category] ?? [];
          group[category].push(card);
          return group;
        }, {});
        setcardTemplates(groupByCategory);
        setIsLoading(false);
      })
      .catch((error) => {});
    return groupByCategory;
  };

  const fetchComposeMessageData = () => {
    const obj = {
      url: URL_CONFIG.ALL_MESSAGES,
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
        setComposeCardMessages(groupByCategory);
      })
      .catch((error) => {});
  };

  const fetchUserData = () => {
    console.log('Calling fetchUserData...');
    const obj = {
      url: URL_CONFIG.ALL_USER_DETAILS_FILTER_RESPONSE,
      method: 'get',
      params: {
        active: true,
      },
    };
    httpHandler(obj)
      .then((userData) => {
        console.log('API Response fetchUserData', userData);
        let ComposeCardCategoryTemp = JSON.parse(
          JSON.stringify(composeCardCategory)
        );
        let uDataTemp = [];
        let uEmailDataTemp = [];
        userData?.data?.length > 0 &&
          userData.data.map((item) => {
            if (userSessionData.id !== item.user_id) {
              uDataTemp.push({
                value: item.id,
                label: item.fullName + ' - ' + item.department.name,
              });
            }
            return uDataTemp;
          });
        userData?.data?.length > 0 &&
          userData.data.map((item) => {
            uEmailDataTemp.push({ value: item.id, label: item.email });
            return uEmailDataTemp;
          });
        ComposeCardCategoryTemp.userData = uDataTemp;
        ComposeCardCategoryTemp.userEmailData = uEmailDataTemp;
        ComposeCardCategoryTemp.category =
          isDashbaord === 'birthday'
            ? 'birthday'
            : isDashbaord === 'anniversary'
            ? 'anniversary'
            : composeCardCategory?.category;
        setComposeCardCategory({
          ...composeCardCategory,
          ...ComposeCardCategoryTemp,
        });
      })
      .catch((error) => {
        //const errMsg = error.response?.data?.message;
      });
  };

  useEffect(() => {
    if (cardTemplates?.length === 0) {
      fetchCardData();
    }
    fetchComposeMessageData();
    fetchUserData();
  }, []);

  useEffect(() => {
    if (isDashbaord) {
      fetchComposeMessageData();
      fetchUserData();
      fetchCardData().then((groupByCategory) => {
        if (isDashbaord === 'anniversary') {
          var collapseBirthday = document.getElementById('collapseAnniversary');
          collapseBirthday.classList.add('collapse', 'show');
          var collapseBirthday = document.getElementById('collapseBirthday');
          collapseBirthday.classList.remove('show');
          var linkElement = document.querySelector('#headingOne .collapsed');
          linkElement.setAttribute('aria-expanded', 'false');
          cardHeadClick(isDashbaord);
          if (groupByCategory?.anniversary?.length > 0) {
            selectImageHandler(
              {
                target: {
                  id: '0',
                },
              },
              groupByCategory?.anniversary,
              'anniversary',
              groupByCategory?.anniversary?.[0]
            );

            // // Find the element that triggers the modal
            // var modalTriggerElement = document.querySelector(
            //   '[data-target="#ComposeCardModal"]'
            // );
            // // Simulate a click event on the element
            // if (modalTriggerElement) {
            //   modalTriggerElement.click();
            // }

            setTimeout(() => {
              const modalTriggerElement = document.querySelector(
                '[data-target="#ComposeCardModal"]'
              );
              if (modalTriggerElement) {
                modalTriggerElement.click();
              }
            }, 300);
          }
        } else if (isDashbaord === 'birthday') {
          cardHeadClick(isDashbaord);
          if (groupByCategory?.birthday?.length > 0) {
            selectImageHandler(
              {
                target: {
                  id: '0',
                },
              },
              groupByCategory?.birthday,
              'birthday',
              groupByCategory?.birthday?.[0]
            );

            setTimeout(() => {
              const modalTriggerElement = document.querySelector(
                '[data-target="#ComposeCardModal"]'
              );
              if (modalTriggerElement) {
                modalTriggerElement.click();
              }
            }, 300);
          }
        }
      });
    }
  }, []);

  const modalSubmitInfo = (arg) => {
    if (arg.status) {
      clearModalBackdrop();
      setIsComposeCardModal(false);
      setShowModal({
        ...showModal,
        type: 'success',
        success: 'E-Card Sent Successfully!',
        message: '',
        celebrations: { isCelebration: true, celebrationItem: 'baloon.gif' },
      });
    }
  };

  const cardHeadClick = (arg) => {
    const addCardObj = {
      birthday: true,
      anniversary: false,
      appreciation: false,
      seasonal: false,
    };
    const addCardObjTemp = JSON.parse(JSON.stringify(addCardObj));
    addCardObjTemp &&
      Object.keys(addCardObjTemp).map((key) => {
        if (key === arg) {
          addCardObjTemp[key] = true;
        } else {
          addCardObjTemp[key] = false;
        }
        return addCardObjTemp;
      });
    setAddECardState(addCardObjTemp);
  };

  return (
    <React.Fragment>
      {isComposeCardModal && (
        <ComposeCardModal
          composeCardData={composeCardData}
          composeCardMessages={composeCardMessages}
          composeCardCategory={composeCardCategory}
          modalSubmitInfo={modalSubmitInfo}
          isDashbaord={isDashbaord}
          isDashbaordData={isDashbaordData}
        />
      )}
      {showModal.type !== null && showModal.message !== null && (
        <EEPSubmitModal
          data={showModal}
          className={`modal-addmessage`}
          hideModal={hideModal}
          successFooterData={
            <button
              type="button"
              className="eep-btn eep-btn-xsml eep-btn-success"
              data-dismiss="modal"
              onClick={hideModal}
            >
              Ok
            </button>
          }
          errorFooterData={
            <button
              type="button"
              className="eep-btn eep-btn-xsml eep-btn-danger"
              data-dismiss="modal"
              onClick={hideModal}
            >
              Close
            </button>
          }
        ></EEPSubmitModal>
      )}
      <div className="eep-inner-tasks-div">
        <div id="accordion">
          <div className="card eep-card birthday-card">
            <div
              className="card-header"
              id="headingOne"
              onClick={() => cardHeadClick('birthday')}
            >
              <h5 className="mb-0">
                <Link
                  to="#"
                  className="collapsed pb-1" //btn btn-link
                  data-toggle="collapse"
                  data-target="#collapseBirthday"
                  aria-expanded="true"
                  aria-controls="collapseBirthday"
                >
                  Birthday
                </Link>
              </h5>
            </div>
            <div
              id="collapseBirthday"
              className="collapse show"
              aria-labelledby="headingOne"
              data-parent="#accordion"
            >
              <div className="card-body">
                <div className="row birthdy_div">
                  <div
                    className="col-md-9"
                    style={{ paddingRight: '6px' }}
                  >
                    {cardTemplates?.birthday?.length > 0 && (
                      <Slider
                        {...{
                          ...settings,
                          slidesToShow: Math.min(
                            cardTemplates.birthday.length,
                            3.5
                          ), // Dynamically update slidesToShow
                        }}
                        className="slider"
                      >
                        {cardTemplates.birthday.map((item, index) => {
                          const isMultipleSlides =
                            cardTemplates.birthday.length >= 3; // Condition for applying class
                          return (
                            <div
                              className={
                                isMultipleSlides ? '' : 'ecard_sliders'
                              } // Apply class conditionally
                              key={'birthdayTemplate_' + index} // Ensure each child has a unique key
                            >
                              <div
                                className="parent_slider_img c1"
                                data-toggle="modal"
                                data-target="#ComposeCardModal"
                                onClick={(e) =>
                                  selectImageHandler(
                                    e,
                                    cardTemplates.birthday,
                                    'birthday',
                                    item
                                  )
                                }
                              >
                                <img
                                  src={item?.imageByte?.image}
                                  className="slider_image"
                                  alt={item.name}
                                  style={{ height: '180px' }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </Slider>
                    )}
                    {isLoading && cardTemplates && !cardTemplates.birthday && (
                      <ImagePreloader />
                    )}
                    {!isLoading && cardTemplates && !cardTemplates.birthday && (
                      <ResponseInfo
                        title="No records found!."
                        responseImg="noRecord"
                        responseClass="response-info"
                      />
                    )}
                  </div>
                  <div
                    className="col-md-3"
                    style={{ padding: '0px' }}
                  >
                    {addECardState && addECardState.birthday && (
                      <React.Fragment>
                        <AddEcard
                          getImageData={getImageData}
                          eCardCategory="birthday"
                        />
                        <div
                          id="trigger-compose-card"
                          className="invisible"
                          data-toggle="modal"
                          data-target="#ComposeCardModal"
                        ></div>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card  eep-card anniversary-card">
            <div
              className="card-header"
              id="headingTwo"
              onClick={() => cardHeadClick('anniversary')}
            >
              <h5 className="mb-0">
                <Link
                  to="#"
                  className="collapsed pb-1"
                  data-toggle="collapse"
                  data-target="#collapseAnniversary"
                  aria-expanded="false"
                  aria-controls="collapseAnniversary"
                >
                  Work Anniversary
                </Link>
              </h5>
            </div>
            <div
              id="collapseAnniversary"
              className="collapse"
              aria-labelledby="headingTwo"
              data-parent="#accordion"
            >
              <div className="card-body">
                <div className="row annivdy_div">
                  <div className="col-md-9">
                    {cardTemplates &&
                      cardTemplates.anniversary &&
                      cardTemplates.anniversary.length > 0 && (
                        <Slider
                          {...{
                            ...settings,
                            slidesToShow: Math.min(
                              cardTemplates.anniversary.length,
                              3 ?? 3.5
                            ), // Dynamically update slidesToShow
                          }}
                          className="slider"
                        >
                          {cardTemplates.anniversary.map((item, index) => {
                            return (
                              <div
                                className={
                                  cardTemplates.anniversary.length >= 3
                                    ? ''
                                    : 'ecard_sliders'
                                }
                              >
                                <div
                                  className="parent_slider_img c1"
                                  key={'anniversTemplate_' + index}
                                  data-toggle="modal"
                                  data-target="#ComposeCardModal"
                                  onClick={(e) =>
                                    selectImageHandler(
                                      e,
                                      cardTemplates.anniversary,
                                      'anniversary',
                                      item
                                    )
                                  }
                                >
                                  <img
                                    src={item?.imageByte?.image}
                                    className="slider_image"
                                    id={index}
                                    alt={item.name}
                                    style={{ height: '180px' }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </Slider>
                      )}
                    {isLoading &&
                      cardTemplates &&
                      !cardTemplates.anniversary && <ImagePreloader />}
                    {!isLoading &&
                      cardTemplates &&
                      !cardTemplates.hasOwnProperty('anniversary') && (
                        <ResponseInfo
                          title="No records found!."
                          responseImg="noRecord"
                          responseClass="response-info"
                        />
                      )}
                  </div>
                  <div className="col-md-3">
                    {addECardState && addECardState.anniversary && (
                      <React.Fragment>
                        <AddEcard
                          getImageData={getImageData}
                          eCardCategory="anniversary"
                        />
                        <div
                          id="trigger-compose-card"
                          className="invisible"
                          data-toggle="modal"
                          data-target="#ComposeCardModal"
                        ></div>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card eep-card appreciation-card">
            <div
              className="card-header"
              id="headingThree"
              onClick={() => cardHeadClick('appreciation')}
            >
              <h5 className="mb-0">
                <Link
                  to="#"
                  className="collapsed pb-1"
                  data-toggle="collapse"
                  data-target="#collapseAppreciation"
                  aria-expanded="false"
                  aria-controls="collapseSeason"
                >
                  Kudos
                </Link>
              </h5>
            </div>
            <div
              id="collapseAppreciation"
              className="collapse"
              aria-labelledby="headingThree"
              data-parent="#accordion"
              style={{}}
            >
              <div className="card-body">
                <div
                  className="row appreciation_div"
                  style={{}}
                >
                  <div className="col-md-9">
                    {cardTemplates &&
                      cardTemplates.appreciation &&
                      cardTemplates.appreciation.length > 0 && (
                        <Slider
                          {...{
                            ...settings,
                            slidesToShow: Math.min(
                              cardTemplates.appreciation.length,
                              3 ?? 3.5
                            ), // Dynamically update slidesToShow
                          }}
                          className="slider"
                        >
                          {cardTemplates.appreciation.map((item, index) => {
                            return (
                              <div
                                className={
                                  cardTemplates.appreciation.length >= 3
                                    ? ''
                                    : 'ecard_sliders'
                                }
                              >
                                <div
                                  className="parent_slider_img c1"
                                  key={'appreciationTemplate_' + index}
                                  data-toggle="modal"
                                  data-target="#ComposeCardModal"
                                  onClick={(e) =>
                                    selectImageHandler(
                                      e,
                                      cardTemplates.appreciation,
                                      'appreciation',
                                      item
                                    )
                                  }
                                >
                                  <img
                                    src={item?.imageByte?.image}
                                    className="slider_image"
                                    id={index}
                                    alt="E-Card"
                                    style={{ height: '180px' }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </Slider>
                      )}
                    {isLoading &&
                      cardTemplates &&
                      !cardTemplates.appreciation && <ImagePreloader />}
                    {!isLoading &&
                      cardTemplates &&
                      !cardTemplates.hasOwnProperty('appreciation') && (
                        <ResponseInfo
                          title="No records found!."
                          responseImg="noRecord"
                          responseClass="response-info"
                        />
                      )}
                  </div>
                  <div className="col-md-3">
                    {addECardState && addECardState.appreciation && (
                      <React.Fragment>
                        <AddEcard
                          getImageData={getImageData}
                          eCardCategory="appreciation"
                        />
                        <div
                          id="trigger-compose-card"
                          className="invisible"
                          data-toggle="modal"
                          data-target="#ComposeCardModal"
                        ></div>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card eep-card seasonal-card">
            <div
              className="card-header"
              id="headingFour"
              onClick={() => cardHeadClick('seasonal')}
            >
              <h5 className="mb-0">
                <Link
                  to="#"
                  className="collapsed pb-1"
                  data-toggle="collapse"
                  data-target="#collapseSeason"
                  aria-expanded="false"
                  aria-controls="collapseSeason"
                >
                  Festive Wishes
                </Link>
              </h5>
            </div>
            <div
              id="collapseSeason"
              className="collapse"
              aria-labelledby="headingFour"
              data-parent="#accordion"
            >
              <div className="card-body">
                <div className="row seasonal_div">
                  <div className="col-md-9">
                    {cardTemplates &&
                      cardTemplates.seasonal &&
                      cardTemplates.seasonal.length > 0 && (
                        <Slider
                          {...{
                            ...settings,
                            slidesToShow: Math.min(
                              cardTemplates.seasonal.length,
                              3 ?? 3.5
                            ), // Dynamically update slidesToShow
                          }}
                          className="slider"
                        >
                          {cardTemplates.seasonal.map((item, index) => {
                            return (
                              <div
                                className={
                                  cardTemplates.seasonal.length >= 3
                                    ? ''
                                    : 'ecard_sliders'
                                }
                              >
                                <div
                                  className="parent_slider_img c1"
                                  key={'seasonalTemplate_' + index}
                                  data-toggle="modal"
                                  data-target="#ComposeCardModal"
                                  onClick={(e) =>
                                    selectImageHandler(
                                      e,
                                      cardTemplates.seasonal,
                                      'seasonal',
                                      item
                                    )
                                  }
                                >
                                  <img
                                    src={item?.imageByte?.image}
                                    className="slider_image"
                                    id={index}
                                    alt="E-Card"
                                    style={{ height: '180px' }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </Slider>
                      )}
                    {isLoading &&
                      cardTemplates &&
                      !cardTemplates.appreciation && <ImagePreloader />}
                    {!isLoading &&
                      cardTemplates &&
                      !cardTemplates.hasOwnProperty('seasonal') && (
                        <ResponseInfo
                          title="No records found!."
                          responseImg="noRecord"
                          responseClass="response-info"
                        />
                      )}
                  </div>
                  <div className="col-md-3">
                    {addECardState && addECardState.seasonal && (
                      <React.Fragment>
                        <AddEcard
                          getImageData={getImageData}
                          eCardCategory="seasonal"
                        />
                        <div
                          id="trigger-compose-card"
                          className="invisible"
                          data-toggle="modal"
                          data-target="#ComposeCardModal"
                        ></div>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default ECards;
