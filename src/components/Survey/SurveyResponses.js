import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import PageHeader from '../../UI/PageHeader';
import Toggle from '../../UI/Toggle';
import { URL_CONFIG } from '../../constants/rest-config';
import { httpHandler } from '../../http/http-interceptor';
import ToggleSidebar from '../../layout/Sidebar/ToggleSidebar';
import ConfirmStateModal from '../../modals/ConfirmStateModal';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import SurveyCharts from '../Charts/SurveyCharts';
import html2pdf from 'html2pdf.js';
import { pageLoaderHandler } from '../../helpers';
import { Link } from 'react-router-dom';
import Isloading from '../../UI/CustomComponents/Isloading';

const SurveyResponses = ({ header = true }) => {
  const [toggleClass, setToggleClass] = useState(true);
  const [toggleSwitch, setToggleSwitch] = useState(false);
  const [surveyResponseData, setSurveyResponseData] = useState([]);
  const [surveyResponseDataRaw, setSurveyResponseDataRaw] = useState([]);
  const location = useLocation();
  const sDataValue = location.state ? location.state?.surveyData : null;
  const [isloadingPdf, setIsPdfloading] = useState(false);
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
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

  const defaultApexChart = {
    'radio-group': {
      labels: [],
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
              show: false,
            },
          },
        },
      },
      series: [],
    },
    'radio-group1': {
      labels: [],
      dataLabels: {
        enabled: true,
      },
      chart: {
        type: 'pie',
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
            },
          },
        },
      },
      series: [16, 12, 8, 8],
    },
    'checkbox-group': {
      labels: [],
      dataLabels: {
        enabled: true,
      },
      chart: {
        width: 500,
        type: 'donut',
      },
      title: {
        text: '',
      },
      subtitle: {
        text: '',
      },
      legend: {
        show: false,
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          depth: 35,

          donut: {
            labels: {
              show: false,
            },
          },
        },
      },
      series: [],
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}</b>',
      },
    },
    select: {
      chart: {
        height: 350,
        type: 'bar',
      },
      stroke: {
        width: 2,
      },
      grid: {
        row: {
          colors: ['#fff', '#f2f2f2'],
        },
      },
      xaxis: {
        tickPlacement: 'on',
      },
      yaxis: {
        title: {
          text: '',
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 0,
          columnWidth: '50%',
        },
      },
      dataLabels: {
        enabled: true,
      },
      title: {
        text: '',
      },
      subtitle: {
        text: '',
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'horizontal',
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100],
        },
      },
      series: [],
    },
  };

  const sideBarClass = (tooglestate) => {
    setToggleClass(tooglestate);
  };

  const fetchSurveyResponses = (surData) => {
    setIsLoading(true);

    if (surData && Object.keys(surData).length) {
      const obj = {
        url: URL_CONFIG.SURVEY_RESPONSE,
        method: 'get',
        params: { id: surData?.id },
      };
      httpHandler(obj)
        .then((response) => {
          setSurveyResponseDataRaw(response.data?.assignCount);

          setSurveyResponseData(response.data?.data);
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

  const getValueCount = (data, filterValue) => {
    let lgth = data.filter((x) => {
      return x.value === filterValue;
    }).length;
    return lgth;
  };

  const getMultipleValueCount = (data, filterValue) => {
    let answerCountVal = 0;
    data.filter((y) => {
      const array = y?.value?.split(',');
      if (array?.indexOf(filterValue) !== -1) {
        answerCountVal += 1;
      }
      return answerCountVal;
    });
    return answerCountVal;
  };

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
    let chartOptionsTemp = {};
    if (chartData) {
      if (chartData.type === 'radio-group') {
        chartOptionsTemp = JSON.parse(
          JSON.stringify(defaultApexChart[chartData.type])
        );
        chartOptionsTemp['series'] = [];
        let optionsTemp = JSON.parse(chartData.surveyQuestion.parameters);
        let valTemp = [
          ...new Set(optionsTemp.values.map((item) => item.value)),
        ];
        let labelTemp = [
          ...new Set(optionsTemp.values.map((item) => item.label)),
        ];
        let optionDataTemp =
          valTemp &&
          valTemp?.length &&
          valTemp.map((vItem) => {
            let countVal = getValueCount(chartData?.value, vItem);
            return countVal;
          });
        let labelsTemp =
          labelTemp &&
          labelTemp.length &&
          labelTemp.map((lItem) => {
            return lItem;
          });
        chartOptionsTemp['labels'] = labelsTemp;
        chartOptionsTemp['series'] = [optionDataTemp];
        return chartOptionsTemp;
      }
      if (chartData.type === 'checkbox-group') {
        chartOptionsTemp = JSON.parse(
          JSON.stringify(defaultApexChart[chartData.type])
        );
        chartOptionsTemp['series'] = [];
        let optionsTemp = JSON.parse(chartData.surveyQuestion.parameters);
        let valTemp = [
          ...new Set(optionsTemp.values.map((item) => item.value)),
        ];
        let optionDataTemp =
          valTemp &&
          valTemp.length &&
          valTemp.map((vItem) => {
            let countVal = getMultipleValueCount(chartData.value, vItem);
            return countVal;
          });
        let labels =
          valTemp &&
          valTemp.length &&
          valTemp.map((vItem) => {
            return vItem;
          });
        chartOptionsTemp['labels'] = labels;
        chartOptionsTemp['series'] = [optionDataTemp];

        return chartOptionsTemp;
      }
      if (chartData.type === 'select') {
        chartOptionsTemp = JSON.parse(
          JSON.stringify(defaultApexChart[chartData.type])
        );
        chartOptionsTemp['series'] = [];
        let optionsTemp = JSON.parse(chartData?.surveyQuestion?.parameters);
        let valTemp = [
          ...new Set(optionsTemp?.values?.map((item) => item?.value)),
        ];
        let optionDataTemp =
          valTemp &&
          valTemp.length &&
          valTemp.map((vItem) => {
            let countVal = getMultipleValueCount(chartData?.value, vItem);
            return countVal;
          });
        // let optionDataTemp = [];
        // if (Array.isArray(valTemp) && valTemp?.length > 0) {
        //   // eslint-disable-next-line array-callback-return
        //   valTemp?.map((val) => {
        //     let countVal = getMultipleValueCount(chartData?.value, val);
        //     optionDataTemp.push({
        //       name: val,
        //       data:[countVal],
        //     });
        //   });
        // }
        chartOptionsTemp['xaxis'] = { categories: valTemp };
        chartOptionsTemp['series'] = [{ name: '', data: optionDataTemp }];

        return chartOptionsTemp;
      }
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

      //  hideBackdrop()
      //  setisLoadingPdf(false)
      // eslint-disable-next-line
    }, 800);
  }
  const onClickDownload = async (element) => {
    // setisLoadingPdf(true)
    // showBackdrop()
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
          {header && (
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
          )}
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
                          {surveyResponseStateData?.response}/
                          {surveyResponseDataRaw}
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
                                  <h5 className="">
                                    {getQuestionName(sData.surveyQuestion)}
                                  </h5>
                                  <div className="row justify-content-center">
                                    <div className="col-6">
                                      <SurveyCharts
                                        iSchartDownloadLoading={allExpended}
                                        chartData={getApexChartData(sData)}
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

export default SurveyResponses;
