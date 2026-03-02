import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

const EcardModalInfo = (props) => {
  const { composeCardValue, msg, getComposeInfoData } = props;
  const initCardData = composeCardValue ? composeCardValue : [];
  const [sliderPosition, setSliderPosition] = useState(0);
  const [sliderPositionNew, setSliderPositionNew] = useState(0);

  const infoObj = {
    templateId: null,
    contentType: '',
    imagebyte: {},
  };
  const [composeInfo, setComposeInfo] = useState({});

  useEffect(() => {
    setComposeInfo(infoObj);

    if (initCardData.isSlider) {
      // Find the index of selectedCard
      const selectedIndex = initCardData.sliderData.findIndex(
        (item) => item.id === initCardData.selectedCard?.id
      );
      const position = selectedIndex !== -1 ? selectedIndex : 0; // fallback to 0

      setSliderPosition(position);

      let composeInfoTemp = JSON.parse(JSON.stringify(infoObj));
      composeInfoTemp.templateId = initCardData.selectedCard?.id || 0;
      composeInfoTemp.contentType = '';
      composeInfoTemp.imagebyte = {};
      setComposeInfo(composeInfoTemp);
      getComposeInfoData(composeInfoTemp);

      setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.slickGoTo(position);
        }
      }, 0); // move after mount
    }

    if (!initCardData.isSlider) {
      let composeInfoTemp = JSON.parse(JSON.stringify(infoObj));
      composeInfoTemp.templateId = 0;
      composeInfoTemp.imagebyte = {
        image: initCardData.sliderData.image,
        name: initCardData.sliderData.name,
      };
      composeInfoTemp.contentType = initCardData.sliderData.contentType;
      setComposeInfo(composeInfoTemp);
      getComposeInfoData(composeInfoTemp);
    }
  }, [initCardData]);

  useEffect(() => {
    setSliderPositionNew(sliderPosition);
    sliderChange(sliderPosition);
  }, [sliderPosition, sliderPositionNew]);

  const sliderChange = (arg) => {
    setSliderPositionNew(arg);
  };

  var settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    adaptiveHeight: true,
    slidesToScroll: 1,
    beforeChange: (current, next, arg) => {
      setSliderPosition(next);
    },
    afterChange: (current, arg) => {
      setSliderPosition(current);
      let composeInfoTemp = JSON.parse(JSON.stringify(composeInfo));
      composeInfoTemp.templateId = initCardData.sliderData[current].id;
      composeInfoTemp.contentType = '';
      composeInfoTemp.imagebyte = {};
      setComposeInfo(composeInfoTemp);
      getComposeInfoData(composeInfoTemp);
    },
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
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

  const sliderRef = useRef();

  const gotoSlide = () => {
    sliderRef.current.slickGoTo(composeCardValue.sliderPostn);
  };

  const gotoPrevious = () => {
    sliderRef.current.slickPrev('bbb');
  };

  const gotoNext = () => {
    sliderRef.current.slickNext('test');
  };

  return (
    <div
      id="CardTemplate"
      className="carousel slide"
    >
      {composeCardValue &&
        composeCardValue.isSlider &&
        composeCardValue.sliderData && (
          <div>
            <Slider
              {...settings}
              ref={sliderRef}
            >
              {composeCardValue.sliderData &&
                composeCardValue.sliderData.length > 0 &&
                composeCardValue.sliderData.map((item, index) => {
                  return (
                    <div
                      className="parent_slider_img"
                      data-toggle="modal"
                      data-target="#ComposeCardModal"
                      key={'birthdaymodal_' + index}
                    >
                      <img
                        src={item?.imageByte?.image}
                        className="slider_image eep_slider_lists"
                        id={index}
                        alt="E-Cards"
                      />
                    </div>
                  );
                })}
            </Slider>
            <div className="row carousel-control_div my-3">
              <div className="col-md-12 text-center">
                <Link
                  to="#"
                  className="left carousel-control"
                  role="button"
                  data-slide="prev"
                  onClick={gotoPrevious}
                >
                  <i className="fas fa-caret-left"></i>
                </Link>
                <span className="mx-2">Modify templates</span>
                <Link
                  to="#"
                  className="right carousel-control"
                  role="button"
                  data-slide="next"
                  onClick={gotoNext}
                >
                  <i className="fas fa-caret-right"></i>
                </Link>
                <div className="counter_slider mt-3 text-center">
                  <span>{+sliderPosition + +1}</span> OF{' '}
                  <span>{composeCardValue.sliderData.length}</span>
                </div>
              </div>
            </div>
            {msg && (
              <div className="row carousel-message_div">
                <div className="col-md-12 text-justify">
                  <div className="carousel-caption px-2 c-2c2c2c">
                    <h6>{msg}</h6>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      {composeCardValue &&
        !composeCardValue.isSlider &&
        composeCardValue.sliderData && (
          <div>
            <img
              src={composeCardValue.sliderData.image}
              className="slider_image"
              alt="E-Card"
              title={composeCardValue.sliderData.name}
            />
            {msg && (
              <div className="row carousel-message_div">
                <div className="col-md-12 text-justify">
                  <div className="carousel-caption px-2 c-2c2c2c">
                    <h6>{msg}</h6>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      {composeCardValue && composeCardValue.sliderData === null && (
        <div
          className="alert alert-danger"
          role="alert"
        >
          Not able to fetch property data. Please try again from beginning.
        </div>
      )}
    </div>
  );
};

export default EcardModalInfo;
