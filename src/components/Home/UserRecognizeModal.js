import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import ResponseInfo from '../../UI/ResponseInfo';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';

const UserRecognizeModal = (props) => {
  const {
    clickedUser,
    appreciation,
    badges,
    isLoading,
    userRecognition,
    userRecognizeModalErr,
  } = props;
  const [imgData, setImgData] = useState({
    image: process.env.PUBLIC_URL + '/images/icons/static/noData.svg',
    name: 'image',
    id: null,
    points: null,
  });
  const [recogMessage, setRecogMessage] = useState('');
  const [userRecognizationData, setUserRecognizationData] = useState({});
  const [recogDataError, setRecogDataError] = useState(null);
  const [recogIsValid, setRecogIsValid] = useState(true);
  const maxLgth = 120;

  var settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    swipeToSlide: true,
    adaptiveHeight: true,
    slidesToScroll: 1,
    padSlides: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
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

  const imageClickHandler = (arg) => {
    if (arg.itemKey.id) {
      setRecogDataError(null);
      setUserRecognizationData({});
      if (arg.itemKey.imageByte) {
        setImgData({
          image: arg?.itemKey?.imageByte?.image,
          name: arg.itemKey.name,
          id: arg.itemKey.id,
          points: arg.badge ? arg.itemKey.points : null,
        });
      } else {
        setImgData({
          image: process.env.PUBLIC_URL + '/images/icons/static/noData.svg',
          name: 'image',
          id: arg.itemKey.id,
          points: arg.badge ? arg.itemKey.points : null,
        });
      }
      if (arg.badge) {
        let tempData = {
          isBadge: true,
          badge: {
            id: arg.itemKey.id,
          },
          userId: [{ id: clickedUser.id }],
          hashTag: [],
          wallPost: false,
          shareWallPost: false,
        };
        setUserRecognizationData(tempData);
      }
      if (!arg.badge) {
        let tempData = {
          isBadge: false,
          to: clickedUser.id,
          cc: [],
          type: 'appreciation',
          templateId: arg.itemKey.id,
          contentType: '',
          imageByte: arg.itemKey.imageByte,
        };
        setUserRecognizationData(tempData);
      }
    } else {
      setImgData({
        image: process.env.PUBLIC_URL + '/images/icons/static/noData.svg',
        name: 'image',
        id: null,
        points: null,
      });
      setRecogDataError('Image Source issue. Contact administrator');
    }
  };

  const userMessage = (arg) => {
    setRecogMessage(arg.target.value);
  };

  const recognize = () => {
    let userRecognizationDataTemp = JSON.parse(
      JSON.stringify(userRecognizationData)
    );
    userRecognizationDataTemp['message'] = recogMessage;
    userRecognition(userRecognizationDataTemp);
  };

  useEffect(() => {
    setRecogIsValid(true);
    if (recogMessage && recogMessage !== '' && imgData && imgData.id) {
      setRecogIsValid(false);
    }
  }, [imgData, recogMessage]);

  return (
    <div className="eepModalDiv">
      <div
        className="modal fade"
        id="UserRecognizeModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog w-75"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header p-1 border-0 flex-column">
              <button
                className="close closed"
                type="button"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setImgData({
                    image:
                      process.env.PUBLIC_URL +
                      '/images/icons/static/noData.svg',
                    name: 'image',
                    id: null,
                    points: null,
                  });
                  setRecogMessage(''); // 🔹 clear message
                  setUserRecognizationData({});
                }}
              ></button>
            </div>
            <div className="modal-body round-images eep_scroll_y">
              <div className="modalBodyHeight">
                <div className="row no-gutters">
                  <div className="col-8">
                    <div className="eep-inner-tasks-div">
                      <div id="Templateaccordion">
                        <div className="card eep-card eep-cardSlider birthday-template-card">
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
                              <span className="col-sm-11 p-0 collapseTemplate">
                                Badges
                              </span>
                            </div>
                          </div>
                          <div
                            id="collapseBirthdayTemplate"
                            className="collapse show"
                            aria-labelledby="headingOne"
                            data-parent="#Templateaccordion"
                          >
                            <div
                              className="card-body"
                              style={{ padding: '0.5rem' }}
                            >
                              <div className="row birthdy_div">
                                <div className="col-md-12">
                                  {badges && badges.data.length > 0 && (
                                    <Slider {...settings}>
                                      {badges.data
                                        .filter((item) => item.points === 0)
                                        .map((item, index) => {
                                          return (
                                            <div
                                              className="parent_slider_img_modal"
                                              key={'badge_' + index}
                                            >
                                              <div className="bg-f1f1f1 text-center p-1 br-15">
                                                <img
                                                  src={
                                                    item?.imageByte
                                                      ? item?.imageByte?.image
                                                      : process.env.PUBLIC_URL +
                                                        '/images/icons/static/noData.svg'
                                                  }
                                                  className="slider_image"
                                                  id={index}
                                                  alt="E-Card"
                                                  title={
                                                    item.points > 0
                                                      ? item.name +
                                                        ' - ' +
                                                        item.points
                                                      : item.name
                                                  }
                                                  onClick={() =>
                                                    imageClickHandler({
                                                      itemKey: item,
                                                      badge: true,
                                                    })
                                                  }
                                                />
                                                <div
                                                  className="mt-1 px-2 text-secondary eep_truncate"
                                                  title={
                                                    item.points > 0
                                                      ? item.name +
                                                        ' - ' +
                                                        item.points
                                                      : item.name
                                                  }
                                                >
                                                  <span className="text-center">
                                                    {item.name}{' '}
                                                  </span>{' '}
                                                  {item.points > 0 ? (
                                                    <span>
                                                      {' '}
                                                      - {item.points}
                                                    </span>
                                                  ) : (
                                                    ''
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })}
                                    </Slider>
                                  )}
                                  {!isLoading &&
                                    badges &&
                                    badges.data.length < 0 && (
                                      <ResponseInfo
                                        title="No records found!."
                                        responseImg="noRecord"
                                        responseClass="response-info"
                                      />
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card eep-card eep-cardSlider appreciation-template-card">
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
                              <span className="col-sm-11 p-0 collapseTemplate">
                                Kudos
                              </span>
                            </div>
                          </div>
                          <div
                            id="collapseAppreciationTemplate"
                            className="collapse"
                            aria-labelledby="headingThree"
                            data-parent="#Templateaccordion"
                          >
                            <div
                              className="card-body"
                              style={{ padding: '0.5rem' }}
                            >
                              <div className="row appreciation_div">
                                <div className="col-md-12">
                                  {appreciation &&
                                    appreciation.data.length > 0 && (
                                      <Slider {...settings}>
                                        {appreciation.data.map(
                                          (item, index) => {
                                            return (
                                              <div
                                                className="parent_slider_img_modal"
                                                key={'appreciation_' + index}
                                              >
                                                <div className="bg-f1f1f1 text-center p-1 br-15 text-center">
                                                  <img
                                                    src={
                                                      item?.imageByte?.image
                                                        ? item?.imageByte?.image
                                                        : process.env
                                                            .PUBLIC_URL +
                                                          '/images/icons/static/noData.svg'
                                                    }
                                                    className="slider_image br-15"
                                                    id={index}
                                                    alt="E-Card"
                                                    // title={item.name}
                                                    style={{
                                                      width: '100%',
                                                      height: '100%',
                                                    }}
                                                    onClick={() =>
                                                      imageClickHandler({
                                                        itemKey: item,
                                                        badge: false,
                                                      })
                                                    }
                                                  />
                                                  <div
                                                    className="mt-1 px-2 text-secondary eep_truncate"
                                                    title={item.name}
                                                  >
                                                    {/* <span className="text-center">
                                                      {item.name}
                                                    </span> */}
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          }
                                        )}
                                      </Slider>
                                    )}
                                  {!isLoading &&
                                    appreciation &&
                                    appreciation.data.length <= 0 && (
                                      <ResponseInfo
                                        title="No records found!."
                                        responseImg="noRecord"
                                        responseClass="response-info"
                                      />
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div
                      className="bg-f4f4f4 br-15 border border-1 gride_view"
                      style={{ borderColor: '#f4f4f4' }}
                    >
                      {recogDataError && (
                        <div
                          className="alert alert-danger m-3 p-2"
                          role="alert"
                        >
                          {recogDataError}
                        </div>
                      )}
                      {!recogDataError && (
                        <div
                          className="gride_colum_template"
                          style={{
                            gridTemplate: 'inherit',
                            marginLeft: '1rem',
                            marginRight: '1rem',
                          }}
                        >
                          <div className="gride_container my-2">
                            {imgData.id && (
                              <React.Fragment>
                                <div className="bg-white br-15 p-2">
                                  <img
                                    src={imgData.image}
                                    width="100px"
                                    height="100px"
                                    alt={imgData.name}
                                    title={imgData.name}
                                  />
                                </div>
                                <div
                                  className="text-center text-secondary mt-2 eep_truncate"
                                  title={imgData.name}
                                >
                                  {/* <span>{imgData.name}</span>{" "} */}
                                  {imgData.points && imgData.points > 0 ? (
                                    <span> - {imgData.points}</span>
                                  ) : (
                                    ''
                                  )}
                                </div>
                              </React.Fragment>
                            )}
                            {!imgData.id && (
                              <div
                                className="alert alert-info"
                                role="alert"
                              >
                                Choose an image from slider to recognize -{' '}
                                {clickedUser.fullName}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <div
                        className="textarea_div my-2"
                        style={{
                          marginLeft: '1rem',
                          marginRight: '1rem',
                          marginTop: '1.5rem',
                        }}
                      >
                        <textarea
                          className="bg-white"
                          rows="2"
                          placeholder={`Enter message to ${clickedUser.fullName} `}
                          style={{
                            resize: 'none',
                            paddingLeft: '8px',
                            paddingTop: '5px',
                            borderRadius: '9px',
                          }}
                          value={recogMessage}
                          maxLength={maxLgth}
                          onChange={(e) => userMessage(e)}
                        ></textarea>
                      </div>
                      <div className="modal-footer border-0 flex-column">
                        <div className="row justify-content-md-center">
                          <div className="col-md-12 col-lg-12 col-xs-12 col-sm-12 text-center">
                            {!userRecognizeModalErr && (
                              <button
                                type="button"
                                className="btn eep-btn eep-btn-success"
                                disabled={recogIsValid}
                                onClick={() => recognize()}
                              >
                                {' '}
                                Done{' '}
                              </button>
                            )}
                            {userRecognizeModalErr && (
                              <div
                                className="alert alert-danger  m-3 p-2"
                                role="alert"
                              >
                                {userRecognizeModalErr}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserRecognizeModal;
