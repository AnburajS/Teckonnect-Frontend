import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import PageHeader from '../../UI/PageHeader';
import Toggle from '../../UI/Toggle';
import { URL_CONFIG } from '../../constants/rest-config';
import { httpHandler } from '../../http/http-interceptor';
import ToggleSidebar from '../../layout/Sidebar/ToggleSidebar';
import ConfirmStateModal from '../../modals/ConfirmStateModal';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import html2pdf from 'html2pdf.js';
import { pageLoaderHandler } from '../../helpers';
import Chart from 'react-apexcharts';
import SurveyCharts from '../Charts/SurveyCharts';
import SurveyResponses from './SurveyResponses';
import PulseSruveyResponse from './PulseSruveyResponse';
import Isloading from '../../UI/CustomComponents/Isloading';

const Pulse = () => {
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);

  const [toggleSwitch, setToggleSwitch] = useState(false);
  const [surveyPulseResponseData, setSurveyPulseResponseData] = useState([]);
  const [pulseResponseData, setPulseResponseData] = useState({});

  const location = useLocation();
  const sDataValue = location.state ? location.state?.surveyData : null;
  const [isloadingPdf, setIsPdfloading] = useState(false);
  const [surveyResponseStateData, setSurveyResponseStateData] =
    useState(sDataValue);
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const [confirmStateModalObj, setConfirmStateModalObj] = useState({
    confirmTitle: null,
    confirmMessage: null,
  });
  const [allExpended, setAllExpended] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };
  const dispatch = useDispatch();

  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'Engage',
      link: 'app/engage',
    },
    {
      label: 'Survey',
      link: 'app/mysurvey',
    },
    {
      label: 'Survey Responses',
      link: '',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Survey Results',
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  }, []);

  const fetchSurveyPulseResponses = (surData) => {
    setIsLoading(true);

    if (surData && Object.keys(surData).length) {
      const obj = {
        url: URL_CONFIG.SURVEY_PULSE_RESPONSE,
        method: 'get',
        params: { id: surData?.id },
      };
      httpHandler(obj)
        .then((response) => {
          setPulseResponseData(response?.data);
          setSurveyPulseResponseData(
            response?.data.averageScorePerQuestion
              ? response?.data.averageScorePerQuestion
              : []
          );
          setIsLoading(false);
        })
        .catch((error) => {
          setShowModal({
            ...showModal,
            type: 'danger',
            message: error?.response?.data?.message,
          });
          setIsLoading(false);
        });
    }
  };
  useEffect(() => {
    fetchSurveyPulseResponses(surveyResponseStateData);

    pageLoaderHandler(isLoading ? 'show' : 'hide');
  }, [surveyResponseStateData]);

  const modalState = (item) => {
    setToggleSwitch(true);
    setConfirmStateModalObj({
      confirmTitle: 'Confirm Action',
      confirmMessage: item
        ? 'Do you want to Pause accepting new responses? '
        : 'Do you want to Start accepting new responses?',
    });
  };

  const confirmState = (arg) => {
    if (arg) {
      const obj = {
        url:
          URL_CONFIG.SURVEY_ACCEPT_RESPONSE +
          '?id=' +
          surveyResponseStateData.id +
          '&response=' +
          (surveyResponseStateData.acceptResponse ? '0' : '1'),
        method: 'put',
      };
      httpHandler(obj)
        .then(() => {
          setShowModal({
            ...showModal,
            type: 'success',
            sucess: surveyResponseStateData.acceptResponse
              ? 'Action Successful!'
              : 'Success!',
            message: surveyResponseStateData.acceptResponse
              ? 'Survey closed for further responses.'
              : 'Survey reopened for responses.',
          });
          let surveyResponseStateDataTemp = JSON.parse(
            JSON.stringify(surveyResponseStateData)
          );
          if (surveyResponseStateData.acceptResponse) {
            surveyResponseStateDataTemp['acceptResponse'] = false;
            setSurveyResponseStateData({ ...surveyResponseStateDataTemp });
          } else {
            surveyResponseStateDataTemp['acceptResponse'] = true;
            setSurveyResponseStateData({ ...surveyResponseStateDataTemp });
          }
        })
        .catch((error) => {
          const errMsg =
            error.response?.data?.message !== undefined
              ? error.response?.data?.message
              : 'Something went wrong contact administarator';
          setShowModal({
            ...showModal,
            type: 'danger',
            message: errMsg,
          });
        });
      setToggleSwitch(false);
    } else {
      setToggleSwitch(false);
    }
  };

  function convertHtmlToPdf() {
    const element = document.getElementById('screen');
    const options = {
      margin: 1,
      filename: 'surveyresponse.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 1.5, scrollX: 0, scrollY: -window.scrollY },
      jsPDF: { unit: 'mm', format: 'a2', orientation: 'portrait', width: 1020 },
      pagebreak: { mode: 'avoid-all' },
    };
    setTimeout(() => {
      html2pdf().set(options).from(element).save();
      setAllExpended(false);
      setIsPdfloading(false);
    }, 800);
  }
  const onClickDownload = async (element) => {
    setIsPdfloading(true);
    convertHtmlToPdf();
  };

  // Check that surveyPulseResponseData is an array and map only if it contains data
  const questions = Array.isArray(surveyPulseResponseData)
    ? surveyPulseResponseData.map((data) => data.question || 'N/A')
    : [];

  const averageScores = Array.isArray(surveyPulseResponseData)
    ? surveyPulseResponseData.map((data) => data.average_score || 0)
    : [];

  const options = {
    chart: {
      type: 'bar',
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },
    legend: {
      show: false, // Set this to false to hide the legend
    },
    xaxis: {
      categories: questions,
      labels: {
        style: {
          fontSize: '10px', // Reduce font size for readability
        },
      },
    },
    plotOptions: {
      bar: {
        barHeight: '80%', // Adjust bar height for better spacing
        distributed: true,
        horizontal: true,
        borderRadius: 12,
        dataLabels: {
          position: 'right',
        },
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels to avoid clutter
    },
    stroke: {
      width: 1.5,
      colors: ['#fff'],
    },
    yaxis: {
      labels: {
        show: true,
        align: 'left',
        minWidth: 200,
        maxWidth: 200,
        style: {
          fontSize: '8px',
          fontWeight: 500,
        },
      },
      title: {
        text: undefined,
      },
      grid: {
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: false } },
        padding: {
          left: 20,
          right: 40,
        },
      },
    },
    title: {
      text: '📊 Survey Questions and Average Scores',
      align: 'center',
      style: {
        fontSize: '13px',
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (value) => `Average Score: ${value}`,
      },
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 300,
          },
          yaxis: {
            labels: {
              style: {
                fontSize: '8px',
              },
            },
          },
        },
      },
    ],
  };

  const series = [
    {
      name: 'Average Score',
      // data: [10,20,30,40,50,60,70,80,90,100,66,75,44,33,22,11,77,54,12,88],
      data: averageScores,
    },
  ];
  const validResponses = surveyPulseResponseData?.filter((item) => {
    const score = Number(item?.average_score);
    return !isNaN(score);
  });

  const totalScore = validResponses?.reduce(
    (acc, item) => acc + Number(item.average_score),
    0
  );
  const overallScore = totalScore / surveyPulseResponseData.length;

  const allResponses = surveyPulseResponseData
    .flatMap((item) => item.responses)
    .filter((value) => value !== null && value !== 0);
  const highestNumber =
    allResponses.length > 0 ? Math.max(...allResponses) : null;

  const overallScorePercentage = (overallScore / highestNumber) * 100; // Assuming max score is 5
  // const semiOptions = {
  //   chart: {
  //     type: 'radialBar',
  //     // height: 100, // or any other suitable number
  //   },
  //   plotOptions: {
  //     radialBar: {
  //       startAngle: -90,
  //       endAngle: 90,
  //       track: {
  //         background: '#e7e7e7',
  //         strokeWidth: '97%',
  //         margin: 5, // margin is in pixels
  //         dropShadow: {
  //           enabled: true,
  //           top: 5,
  //           left: 0,
  //           color: '#999',
  //           opacity: 1,
  //           blur: 2,
  //         },
  //       },
  //       dataLabels: {
  //         name: {
  //           fontSize: '12px',
  //         },
  //         // value: {
  //         //   fontSize: '14px',
  //         //   formatter: function () {
  //         //     return `${overallScore.toFixed(2)} / 5`;
  //         //   },
  //         // },
  //         total: {
  //           show: true,
  //           fontSize: '10px',
  //           margin: '0',
  //           label: `Net Positivity ${
  //             overallScorePercentage ? overallScorePercentage.toFixed(0) : 0
  //           }%`,
  //           formatter: function () {
  //             return ``;
  //           },
  //         },
  //       },
  //     },
  //   },

  const semiOptions = {
    chart: {
      type: 'radialBar',
      sparkline: {
        enabled: true, // removes extra padding, neat for small screens
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          margin: 5,
          size: '55%', // inner circle size
          background: 'transparent',
        },
        track: {
          background: '#f0f0f0',
          strokeWidth: '95%',
          margin: 5,
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            blur: 3,
            opacity: 0.25,
          },
        },
        dataLabels: {
          name: {
            offsetY: 35,
            fontSize: '13px',
            fontWeight: 600,
            color: '#374151', // neutral dark gray
          },
          value: {
            offsetY: -10,
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#111827',
            formatter: function (val) {
              return `${val}%`; // big % in center
            },
          },
          total: {
            show: true,
            label: 'Net Positivity',
            fontSize: '14px',
            fontWeight: 600,
            color: '#2563eb', // nice blue
            formatter: function () {
              return `${
                overallScorePercentage ? overallScorePercentage.toFixed(0) : 0
              }%`;
            },
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'horizontal',
        shadeIntensity: 0.4,
        gradientToColors: ['#10b981'], // teal/green finish
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: 'round',
    },
    responsive: [
      {
        breakpoint: 768, // tablets/small screens
        options: {
          plotOptions: {
            radialBar: {
              dataLabels: {
                value: {
                  fontSize: '16px',
                },
                name: {
                  fontSize: '11px',
                },
                total: {
                  fontSize: '12px',
                },
              },
            },
          },
        },
      },
      {
        breakpoint: 480, // mobiles
        options: {
          plotOptions: {
            radialBar: {
              hollow: {
                size: '60%',
              },
              dataLabels: {
                value: {
                  fontSize: '14px',
                },
                name: {
                  fontSize: '10px',
                },
                total: {
                  fontSize: '11px',
                },
              },
            },
          },
        },
      },
    ],

    // series: [`${overallScorePercentage.toFixed(1)}%`],
    // labels: ['Overall Score'],
  };

  // const totOptions = {
  //   chart: {
  //     height: 350,
  //     type: 'radialBar',
  //     toolbar: {
  //       show: true,
  //     },
  //   },
  //   plotOptions: {
  //     radialBar: {
  //       startAngle: -135,
  //       endAngle: 225,
  //       hollow: {
  //         margin: 0,
  //         size: '70%',
  //         background: '#fff',
  //         image: undefined,
  //         imageOffsetX: 0,
  //         imageOffsetY: 0,
  //         position: 'front',
  //         dropShadow: {
  //           enabled: true,
  //           top: 3,
  //           left: 0,
  //           blur: 4,
  //           opacity: 0.24,
  //         },
  //       },
  //       track: {
  //         background: '#fff',
  //         strokeWidth: '67%',
  //         margin: 0, // margin is in pixels
  //         dropShadow: {
  //           enabled: true,
  //           top: -3,
  //           left: 0,
  //           blur: 4,
  //           opacity: 0.35,
  //         },
  //       },

  //       dataLabels: {
  //         show: true,
  //         name: {
  //           offsetY: -10,
  //           show: true,
  //           color: '#888',
  //           fontSize: '12px',
  //         },
  //         value: {
  //           formatter: function (val) {
  //             return `${parseInt(Number(val) ? val : 0)}%`;
  //           },
  //           color: '#111',
  //           fontSize: '24px',
  //           show: true,
  //         },
  //       },
  //     },
  //   },
  //   fill: {
  //     type: 'gradient',
  //     gradient: {
  //       shade: 'dark',
  //       type: 'horizontal',
  //       shadeIntensity: 0.5,
  //       gradientToColors: ['#ABE5A1'],
  //       inverseColors: true,
  //       opacityFrom: 1,
  //       opacityTo: 1,
  //       stops: [0, 100],
  //     },
  //   },
  //   stroke: {
  //     lineCap: 'round',
  //   },
  //   labels: ['Response'],
  // };

  const totOptions = {
    chart: {
      height: 350,
      type: 'radialBar',
      toolbar: {
        show: true, // ✅ keep download/export
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: '72%', // ✅ slightly bigger inner circle
          background: 'rgba(255,255,255,0.15)', // ✅ subtle glow background
          dropShadow: {
            enabled: true,
            top: 4,
            left: 0,
            blur: 12,
            color: 'rgba(0,0,0,0.4)',
            opacity: 0.45,
          },
        },
        track: {
          background: 'rgba(230, 230, 230, 0.8)',
          strokeWidth: '65%',
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            blur: 8,
            color: 'rgba(0,0,0,0.2)',
            opacity: 0.3,
          },
        },
        dataLabels: {
          show: true,
          name: {
            offsetY: -12,
            color: '#6c757d',
            fontSize: '15px',
            fontWeight: 700,
            letterSpacing: '0.6px',
          },
          value: {
            formatter: function (val) {
              return `${parseInt(Number(val) ? val : 0)}%`;
            },
            color: '#111827',
            fontSize: '24px',
            fontWeight: 600,
            style: { fontFamily: 'Poppins, sans-serif' },
            dropShadow: {
              enabled: true,
              top: 2,
              left: 2,
              blur: 4,
              color: 'rgba(0,0,0,0.3)',
            },
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.6,
        gradientToColors: ['#6a11cb', '#2575fc', '#f7971e'],

        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 20, 50, 75, 100],
      },
    },
    stroke: {
      lineCap: 'round',
      dashArray: 0,
    },
    labels: ['Response'],

    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 1200,
      animateGradually: {
        enabled: true,
        delay: 200,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 800,
      },
    },

    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: { height: 280 },
          plotOptions: {
            radialBar: {
              hollow: { size: '65%' },
              dataLabels: {
                name: { fontSize: '14px' },
                value: { fontSize: '26px' },
              },
            },
          },
        },
      },
      {
        breakpoint: 768,
        options: {
          chart: { height: 240 },
          plotOptions: {
            radialBar: {
              hollow: { size: '60%' },
              dataLabels: {
                name: { fontSize: '13px' },
                value: { fontSize: '22px' },
              },
            },
          },
        },
      },
    ],
  };

  const totSeries = [
    (pulseResponseData?.answerCount / pulseResponseData?.assignCount) * 100,
  ];

  return (
    <React.Fragment>
      {!isLoading && (
        <>
          {isloadingPdf && (
            <div
              id="page-loader-container"
              style={{ zIndex: '1051' }}
            >
              <div id="loader">
                <img
                  src={process.env.PUBLIC_URL + '/images/loader.gif'}
                  alt="Loader"
                />
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    paddingTop: '10px',
                    color: '#000',
                  }}
                >
                  Downloading...
                </div>
              </div>
            </div>
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
                  Got It
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

          {toggleSwitch && (
            <ConfirmStateModal
              hideModal={hideModal}
              confirmState={confirmState}
              confirmTitle={confirmStateModalObj.confirmTitle}
              confirmMessage={confirmStateModalObj.confirmMessage}
            />
          )}

          <PageHeader
            title="Survey Results"
            navLinksLeft={
              <Link
                to="/app/survey"
                className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg"
                dangerouslySetInnerHTML={{
                  __html: svgIcons && svgIcons.lessthan_circle,
                }}
              ></Link>
            }
            toggle={
              <Toggle
                modalState={modalState}
                checkState={surveyResponseStateData?.acceptResponse}
              />
            }
            download={
              <button
                onClick={onClickDownload}
                className="btn btn-secondary"
                aria-controls="user_dataTable"
                type="button"
                style={{ marginRight: '8px', borderRadius: '6px' }}
              >
                Download Report
              </button>
            }
          />
          {isLoading ? (
            <Isloading />
          ) : (
            <div className="row eep_dashboard_div">
              <div className="col-sm-12 col-xs-12 col-md-8 col-lg-5 position_sticky eep-content-section eep-content-section-max">
                <div className="br-15 h-100 divFullHeight">
                  <div className="row px-0 mb-3">
                    <div className="col-md-6 ">
                      <div className="bg-white br-10   h-100 border border-1 ml-12">
                        <Chart
                          options={semiOptions}
                          series={[overallScorePercentage]}
                          type="radialBar"
                          height={300}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 ">
                      <div className="bg-white br-10   h-100 border border-1 ml-12">
                        <Chart
                          options={totOptions}
                          series={[totSeries]}
                          type="radialBar"
                          height={300}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row px-0 mb-3 h-100">
                    <div className="col-md-12">
                      <div className="bg-white br-10 h-100 border border-1">
                        <Chart
                          options={options}
                          series={series}
                          type="bar"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-xs-12 col-md-4 col-lg-7 eep-content-section eep-content-section-max eep_scroll_y">
                <PulseSruveyResponse
                  header={false}
                  pulseResponseData={pulseResponseData}
                />
              </div>
            </div>
          )}
        </>
      )}
    </React.Fragment>
  );
};

export default Pulse;
