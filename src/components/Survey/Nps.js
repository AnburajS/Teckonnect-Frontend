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
import Isloading from '../../UI/CustomComponents/Isloading';

const Nps = () => {
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);

  const [toggleClass, setToggleClass] = useState(true);
  const [toggleSwitch, setToggleSwitch] = useState(false);
  const [surveyResponseData, setSurveyResponseData] = useState([]);
  const [surveyResponseDataRaw, setSurveyResponseDataRaw] = useState([]);
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
  const [isLoading, setIsLoading] = useState(false);

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

  const defaultApexChart = {
    options: {
      labels: [],
      colors: ['#169C5A', '#FAAC50', '#F24F4F'],
      dataLabels: {
        enabled: true,
      },
      chart: {
        type: 'donut',
      },
      title: {
        text: '',
      },
      subtitle: {
        text: '',
      },
      legend: {
        show: true,
      },
      plotOptions: {
        pie: {
          innerSize: 100,
          depth: 45,
          donut: {
            labels: {
              show: true,
              total: {
                showAlways: true,
                show: true,
                label: 'NPS',
                // formatter: () => `${22}`,
              },
            },
          },
        },
      },
    },
    series: [],
  };

  const sideBarClass = (tooglestate) => {
    setToggleClass(tooglestate);
  };

  const fetchSurveyResponses = (surData) => {
    setIsLoading(true);

    if (surData && Object.keys(surData).length) {
      const obj = {
        url: URL_CONFIG.SURVEY_ENPS_RESPONSE,
        method: 'get',
        params: { id: surData?.id },
      };
      httpHandler(obj)
        .then((response) => {
          setSurveyResponseDataRaw(response.data);
          let sResponseItemData = [];
          response.data.eNPS &&
            response.data.eNPS.length &&
            response.data.eNPS.map((subItem) => {
              sResponseItemData.push(subItem);
            });
          setSurveyResponseData(sResponseItemData);
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
    fetchSurveyResponses(surveyResponseStateData);
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

  const getQuestionName = (qParamater) => {
    let qParamaterTemp = JSON.parse(qParamater.parameters);
    return qParamaterTemp.label;
  };

  const getApexChartData = (chartData) => {
    if (chartData && chartData.eNPSResult) {
      const keyTemp = Object.keys(chartData.eNPSResult);
      const valTemp = Object.values(chartData.eNPSResult).map((data) =>
        Number(data)
      );

      // Get Promoters and Detractors values
      const promoters = chartData.eNPSResult.Promoters || 0;
      const detractors = chartData.eNPSResult.Detractors || 0;

      // Calculate NPS Score
      const npsScore = promoters - detractors;

      return {
        ...defaultApexChart,
        options: {
          ...defaultApexChart.options,
          labels: keyTemp,
          legend: {
            show: false, // Disable legend
          },
          plotOptions: {
            pie: {
              ...defaultApexChart.options.plotOptions.pie,
              donut: {
                ...defaultApexChart.options.plotOptions.pie.donut,
                labels: {
                  show: true,
                  total: {
                    showAlways: true,
                    show: true,
                    label: 'NPS', // Display "NPS Score" label
                    fontSize: '16px',
                    color: '#000', // Customize color if needed
                    fontWeight: 'bold', // Customize font weight if needed
                    formatter: () => `${npsScore}`, // Display NPS Score (Promoters - Detractors)
                  },
                },
              },
            },
          },
        },
        series: valTemp,
      };
    }
    return defaultApexChart;
  };

  const geteNPSData = (chartData) => {
    if (!chartData || !chartData.eNPSResult)
      return { promoters: 0, passives: 0, detractors: 0, npsScore: 0 };

    const promoters = chartData.eNPSResult.Promoters || 0;
    const passives = chartData.eNPSResult.Passives || 0;
    const detractors = chartData.eNPSResult.Detractors || 0;

    // Calculate NPS Score (Promoters - Detractors)
    const npsScore = promoters - detractors;

    return { promoters, passives, detractors, npsScore };
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
      setIsPdfloading(false);
    }, 800);
  }
  const onClickDownload = async (element) => {
    setIsPdfloading(true);
    convertHtmlToPdf();
  };

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
            title="Survey Insights"
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
            <div className="eep-container-sidebar h-100 eep_scroll_y">
              <div className="container-sm eep-container-sm">
                <div
                  className={`row eep-create-survey-div eep_with_sidebar ${
                    toggleClass ? 'side_open' : ''
                  } vertical-scroll-snap`}
                >
                  <div
                    className="eep_with_content table-responsive eep_datatable_table_div p-3"
                    style={{ visibility: 'visible' }}
                    id="screen"
                  >
                    <div className="d-flex mb-3">
                      <h3 className="mb-0 fs-22 fw-600">
                        {surveyResponseStateData?.name}
                      </h3>
                      <div className="ml-auto my-auto">
                        <h3 className="mb-0">
                          {surveyResponseDataRaw?.answerTotal}/
                          {surveyResponseDataRaw?.assignTotal}
                        </h3>
                      </div>
                    </div>

                    {surveyResponseData &&
                      surveyResponseData?.length > 0 &&
                      surveyResponseData?.map((sData) => {
                        if (
                          sData &&
                          (sData.type === 'radio-group' ||
                            sData.type === 'checkbox-group' ||
                            sData.type === 'select')
                        ) {
                          return (
                            <div className="col-md-12 px-0 mb-3">
                              <div className="bg-white br-10 h-100 border border-1">
                                <div className="p-3">
                                  <h5 className="">{sData?.question}</h5>
                                  <div className="row justify-content-center">
                                    <div className="col-5">
                                      <Chart
                                        options={
                                          getApexChartData(sData).options
                                        }
                                        series={getApexChartData(sData).series}
                                        type="donut"
                                      />
                                      <div
                                        style={{
                                          backgroundColor: '#f0f8ff',
                                          borderRadius: '10px',
                                          padding: '20px',
                                          display: 'flex',
                                          justifyContent: 'space-around',
                                          alignItems: 'center',
                                          fontFamily: 'Helvetica',
                                        }}
                                      >
                                        <div style={{ textAlign: 'center' }}>
                                          <div
                                            style={{
                                              fontSize: '32px',
                                              color: '#4CAF50',
                                            }}
                                          >
                                            😊
                                          </div>
                                          <div
                                            style={{
                                              fontSize: '20px',
                                              color: '#4CAF50',
                                            }}
                                          >
                                            {geteNPSData(sData).promoters}%
                                          </div>
                                          <div
                                            style={{
                                              fontSize: '14px',
                                              color: '#333',
                                            }}
                                          >
                                            Promoters
                                          </div>
                                        </div>
                                        <div
                                          style={{
                                            width: '1px',
                                            height: '60px',
                                            backgroundColor: '#ccc',
                                          }}
                                        ></div>
                                        <div style={{ textAlign: 'center' }}>
                                          <div
                                            style={{
                                              fontSize: '32px',
                                              color: '#F44336',
                                            }}
                                          >
                                            😐
                                          </div>
                                          <div
                                            style={{
                                              fontSize: '20px',
                                              color: '#F44336',
                                            }}
                                          >
                                            {geteNPSData(sData).passives}%
                                          </div>
                                          <div
                                            style={{
                                              fontSize: '14px',
                                              color: '#333',
                                            }}
                                          >
                                            Passives
                                          </div>
                                        </div>
                                        <div
                                          style={{
                                            width: '1px',
                                            height: '60px',
                                            backgroundColor: '#ccc',
                                          }}
                                        ></div>
                                        <div style={{ textAlign: 'center' }}>
                                          <div
                                            style={{
                                              fontSize: '32px',
                                              color: '#FF9800',
                                            }}
                                          >
                                            ☹️
                                          </div>
                                          <div
                                            style={{
                                              fontSize: '20px',
                                              color: '#FF9800',
                                            }}
                                          >
                                            {geteNPSData(sData).detractors}%
                                          </div>
                                          <div
                                            style={{
                                              fontSize: '14px',
                                              color: '#333',
                                            }}
                                          >
                                            Detractors
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        if (
                          sData &&
                          (sData.type === 'text' || sData.type === 'textarea')
                        ) {
                          return (
                            <div className="col-md-12 px-0 mb-3">
                              <div className="bg-white br-15 h-100 border border-1">
                                <div className="p-3">
                                  <h5 className="">
                                    {getQuestionName(sData.surveyQuestion)}
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

                    {surveyResponseData && surveyResponseData.length <= 0 && (
                      <div className="eep_blank_div">
                        <img
                          src={
                            process.env.PUBLIC_URL +
                            '/images/icons/static/noData.svg'
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

export default Nps;
