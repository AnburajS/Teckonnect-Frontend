import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import PageHeader from "../../UI/PageHeader";
import { URL_CONFIG } from "../../constants/rest-config";
import { httpHandler } from "../../http/http-interceptor";
import ToggleSidebar from "../../layout/Sidebar/ToggleSidebar";

import EEPSubmitModal from "../../modals/EEPSubmitModal";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import html2pdf from "html2pdf.js";
import { pageLoaderHandler } from "../../helpers";
import Chart from "react-apexcharts";
import moment from "moment";
import { formatDates } from "../../constants/utills";
import Isloading from "../../UI/CustomComponents/Isloading";

const PulseSurveyMetric = () => {
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);

  const [toggleClass, setToggleClass] = useState(true);
  const location = useLocation();
  const sDataValues = location.state ? location.state?.surveyData : null;
  const [sDataValue, setLocationData] = useState(sDataValues);
  const [isloadingPdf, setIsPdfloading] = useState(false);
  const [pulseSurveyMetricData, setPulseSurveyMetricData] = useState([]);
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const [isLoading, setIsLoading] = useState(false);

  const hideModal = () => {
    let collections = document.getElementsByClassName("modal-backdrop");
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };
  const dispatch = useDispatch();

  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    {
      label: "Engage",
      link: "app/engage",
    },
    {
      label: "Survey",
      link: "app/survey",
    },
    {
      label: "Survey Responses",
      link: "",
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "Survey Results",
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: "",
      });
    };
  }, []);

  const getMetricOptions = (metric) => {
    const options = JSON.parse(metric?.parameters)?.values?.map(
      (data) => data?.label
    );

    const metricOptions = {
      chart: {
        height: 350,
        type: "line",
        stacked: false,
        zoom: {
          enabled: false,
        },
      },

      stroke: {
        width: [0, 4], // Line chart with thicker stroke for trend line
      },
      title: {
        text: metric?.label
          ? metric?.label
          : "Engagement Metrics & Trends Across Organizational Levels",
        align: "left",
        offsetY: 20,
        style: {
          fontSize: "12px",
          // fontWeight: 'normal',
          // color: '#333',
          // display: 'none',
        },
      },
      grid: {
        show: true,
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
        },
      },
      xaxis: {
        categories: options,
        title: {
          text: "Organizational Level",
        },
      },
      yaxis: [
        {
          title: {
            text: "Engagement Score",
          },
          min: 0,
          max: 100,
        },
      ],
      tooltip: {
        shared: true,
        intersect: false,
      },
      // colors: ['#FF5733', '#33B5FF'], // Column and line colors
    };
    return metricOptions;
  };
  const getMetricSeries = (question, mainData, options) => {
    const metricSerie = mainData?.map((data) => {
      const responses =
        data?.averageScorePerQuestion?.find(
          (data) => data?.question === question
        )?.answer || [];

      const answerCount = {};
      responses.forEach((response) => {
        if (!answerCount[response]) {
          answerCount[response] = 0;
        }
        answerCount[response]++;
      });

      const totalResponses = data?.totalAssigned;
      const trendData = options.map((option) => {
        const count = answerCount[option] || 0;
        return (
          totalResponses > 0 ? (count / totalResponses) * 100 : 0
        ).toFixed(0);
      });
      if (data?.survey_id === sDataValue[0]) {
        return {
          name: `${data?.survey_name} (${formatDates(data?.created_at)})`,
          type: "column",
          data: trendData, // Column chart data (engagement score by level)
        };
      } else {
        return {
          name: `${data?.survey_name} (${formatDates(data?.created_at)})`,
          // type: 'line',
          type: "column",
          data: trendData, // Line chart data (engagement trend)
        };
      }
    });
    // const sortedMetricSerie = metricSerie.sort((a, b) => {
    //   if (a.type === 'column' && b.type === 'line') return -1;
    //   if (a.type === 'line' && b.type === 'column') return 1;
    //   return 0;
    // });

    // return sortedMetricSerie;
    return metricSerie;
  };

  const sideBarClass = (tooglestate) => {
    setToggleClass(tooglestate);
  };

  const fetchSurveyPulseResponses = (surData) => {
    setIsLoading(true);

    if (surData && Object.keys(surData).length) {
      const obj = {
        url: URL_CONFIG.SURVEY_PULSE_RESPONSE_COMPARE,
        method: "get",
        params: { id: JSON.stringify(surData) },
      };
      httpHandler(obj)
        .then((response) => {
          //   setSurveyPulseResponseData(
          //     response?.data?.surveys[0].averageScorePerQuestion
          //       ? response?.data?.surveys[0].averageScorePerQuestion
          //       : []
          //   );
          setPulseSurveyMetricData(response?.data?.surveys);
          setIsLoading(false);
        })
        .catch((error) => {
          setShowModal({
            ...showModal,
            type: "danger",
            message: error?.response?.data?.message,
          });
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchSurveyPulseResponses(sDataValue);
    pageLoaderHandler(isLoading ? "show" : "hide");
  }, [sDataValue]);

  const getQuestionName = (qParamater) => {
    let qParamaterTemp = JSON.parse(qParamater.parameters);
    return qParamaterTemp.label;
  };

  function convertHtmlToPdf() {
    const element = document.getElementById("screen");
    const options = {
      margin: 1,
      filename: "surveyresponse.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 1.5, scrollX: 0, scrollY: -window.scrollY },
      jsPDF: { unit: "mm", format: "a2", orientation: "portrait", width: 1020 },
      pagebreak: { mode: "avoid-all" },
    };
    setTimeout(() => {
      html2pdf().set(options).from(element).save();
      setIsPdfloading(false);
    }, 800);
  }
  const onClickDownload = async (element) => {
    setIsPdfloading(true);
    convertHtmlToPdf();
  };
  useEffect(() => {
    const charts = document.querySelectorAll(
      ".custom-metric-chart .apexcharts-title-text"
    );
    console.log("charts", charts);
    charts.forEach((el) => {
      if (el?.textContent?.length > 0) {
        el.setAttribute("title", el.textContent);
      }
    });
  }, [pulseSurveyMetricData]);

  return (
    <React.Fragment>
      {!isLoading && (
        <>
          {isloadingPdf && (
            <div id="page-loader-container" style={{ zIndex: "1051" }}>
              <div id="loader">
                <img
                  src={process.env.PUBLIC_URL + "/images/loader.gif"}
                  alt="Loader"
                />
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "500",
                    paddingTop: "10px",
                    color: "#000",
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

          <PageHeader
            title="Survey Results"
            toggle={<></>}
            navLinksLeft={
              <Link
                to="/app/survey"
                className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg"
                dangerouslySetInnerHTML={{
                  __html: svgIcons && svgIcons.lessthan_circle,
                }}
              ></Link>
            }
            download={
              <button
                onClick={onClickDownload}
                className="btn btn-secondary mr-4"
                aria-controls="user_dataTable"
                type="button"
                style={{ marginRight: "8px", borderRadius: "6px" }}
              >
                Download Report
              </button>
            }
          />

          {isLoading ? (
            <Isloading />
          ) : (
            <div className="eep-container-sidebar h-100 eep_scroll_y">
              <div className="container-sm eep-container-sm">
                <div
                  className={`row eep-create-survey-div eep_with_sidebar ${
                    toggleClass ? "side_open" : ""
                  } vertical-scroll-snap`}
                >
                  <div
                    className="eep_with_content table-responsive eep_datatable_table_div p-3"
                    style={{ visibility: "visible" }}
                    id="screen"
                  >
                    {/* <div className="d-flex mb-3">
                    <h3 className="mb-0">{surveyResponseStateData?.name}</h3>
                  </div> */}

                    {pulseSurveyMetricData &&
                      pulseSurveyMetricData?.length > 0 &&
                      pulseSurveyMetricData?.map((sData1) => {
                        if (sData1?.survey_id === sDataValue?.[0]) {
                          return (
                            <div key={sData1?.survey_id}>
                              {sData1?.questions?.map((sData, i) => {
                                if (
                                  sData &&
                                  (sData.type === "radio-group" ||
                                    sData.type === "checkbox-group" ||
                                    sData.type === "select")
                                ) {
                                  return (
                                    <div
                                      className="col-md-12 px-0 mb-3"
                                      key={i}
                                    >
                                      <div className="bg-white br-10 h-100 border border-1">
                                        <div className="p-3">
                                          {/* <h5 className="">{sData?.question}</h5> */}
                                          <div className="row justify-content-center">
                                            <div className="col-8 custom-metric-chart">
                                              <p
                                                title={sData?.label}
                                                style={{
                                                  whiteSpace: "nowrap",
                                                  overflow: "hidden",
                                                  textOverflow: "ellipsis",
                                                  width: "100%",
                                                  fontWeight: 600,
                                                  fontSize: "14px",
                                                  marginBottom: "0",
                                                  marginLeft: "20px",
                                                }}
                                              >
                                                {sData?.label}
                                              </p>
                                              <Chart
                                                options={getMetricOptions(
                                                  sData
                                                )}
                                                series={getMetricSeries(
                                                  sData?.question,
                                                  pulseSurveyMetricData,
                                                  JSON.parse(
                                                    sData?.parameters
                                                  )?.values?.map(
                                                    (data) => data?.label
                                                  )
                                                )}
                                                type="line"
                                                height={350}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                                if (
                                  sData &&
                                  (sData.type === "text" ||
                                    sData.type === "textarea")
                                ) {
                                  return (
                                    <div className="col-md-12 px-0 mb-3">
                                      <div className="bg-white br-15 h-100 border border-1">
                                        <div className="p-3">
                                          <h5 className="">
                                            {getQuestionName(
                                              sData.surveyQuestion
                                            )}
                                          </h5>
                                          {sData.value.length &&
                                            sData.value.map((item) => {
                                              return (
                                                <div className="bg-f5f5f5 mb-2 br-5">
                                                  <div className="p-2">
                                                    <span>{item.value}</span>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                              })}
                            </div>
                          );
                        }
                      })}
                    {pulseSurveyMetricData &&
                      pulseSurveyMetricData.length <= 0 && (
                        <div className="eep_blank_div">
                          <img
                            src={
                              process.env.PUBLIC_URL +
                              "/images/icons/static/noData.svg"
                            }
                            alt="no-data-icon"
                          />
                          <p className="eep_blank_quote">No records found!</p>
                        </div>
                      )}
                  </div>
                  <ToggleSidebar
                    toggleSidebarType="survey"
                    sideBarClass={sideBarClass}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </React.Fragment>
  );
};

export default PulseSurveyMetric;
