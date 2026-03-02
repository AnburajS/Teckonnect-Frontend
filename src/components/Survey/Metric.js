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
import Isloading from '../../UI/CustomComponents/Isloading';

const Metric = () => {
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);

  const [toggleClass, setToggleClass] = useState(true);
  const [toggleSwitch, setToggleSwitch] = useState(false);
  const [surveyPulseResponseData, setSurveyPulseResponseData] = useState([]);
  const location = useLocation();
  const sDataValue = location.state ? location.state?.surveyData : null;
  const [isloadingPdf, setIsPdfloading] = useState(false);
  const [surveyResponseData, setSurveyResponseData] = useState([]);
  const [surveyResponseDataRaw, setSurveyResponseDataRaw] = useState([]);
  const [surveyResponseStateData, setSurveyResponseStateData] =
    useState(sDataValue);
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const [confirmStateModalObj, setConfirmStateModalObj] = useState({
    confirmTitle: null,
    confirmMessage: null,
  });
  const [allExpended, setAllExpended] = React.useState(false);
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
      label: 'Communication',
      link: 'app/communication',
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

  // Example data for survey responses and trends dummy START
  const categories = ['Manager', 'Director', 'VP', 'Executive', 'CEO'];
  const surveyScores = [75, 80, 85, 90, 95]; // These could represent average scores for each level
  const trendData = [70, 75, 80, 85, 90]; // Trends for each organizational level

  const metricOptions = {
    chart: {
      height: 350,
      type: 'line',
      stacked: false,
    },
    stroke: {
      width: [0, 4], // Line chart with thicker stroke for trend line
    },
    title: {
      text: 'Engagement Metrics & Trends Across Organizational Levels',
      align: 'center',
    },
    grid: {
      show: true,
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
      },
    },
    xaxis: {
      categories: categories,
      title: {
        text: 'Organizational Level',
      },
    },
    yaxis: [
      {
        title: {
          text: 'Engagement Score',
        },
        min: 0,
        max: 100,
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
    },
    colors: ['#FF5733', '#33B5FF'], // Column and line colors
  };

  const metricSeries = [
    {
      name: 'Survey Responses',
      type: 'column',
      data: surveyScores, // Column chart data (engagement score by level)
    },
    {
      name: 'Trend Over Time',
      type: 'line',
      data: trendData, // Line chart data (engagement trend)
    },
  ];
  // Example data for survey responses and trends dummy EMD

  const sideBarClass = (tooglestate) => {
    setToggleClass(tooglestate);
  };

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
          setSurveyPulseResponseData(
            response.data.averageScorePerQuestion
              ? response.data.averageScorePerQuestion
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
          setSurveyResponseDataRaw(response.data);
          let sResponseItemData = [];
          response.data.length &&
            response.data.map((item) => {
              item.surveyResponseItems &&
                item.surveyResponseItems.length &&
                item.surveyResponseItems.map((subItem) => {
                  sResponseItemData.push(subItem);
                });
              return sResponseItemData;
            });

          const groupedMap = sResponseItemData.reduce(
            (entryMap, e) =>
              entryMap.set(e.surveyQuestion.id, [
                ...(entryMap.get(e.surveyQuestion.id) || []),
                e,
              ]),
            new Map()
          );
          const arr = Array.from(groupedMap, function (item) {
            return {
              key: item[0],
              value: item[1],
              surveyQuestion: item[1][0]['surveyQuestion'],
              type: item[1][0]['type'],
            };
          });
          setSurveyResponseData(arr);
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
        if (chartData && chartData.type) {
          chartOptionsTemp = JSON.parse(
            JSON.stringify(defaultApexChart[chartData.type])
          );
        } else {
          console.error(
            'Error: chartData or chartData.type is not defined in defaultApexChart'
          );
          // Assign a fallback value or handle the error as needed
          chartOptionsTemp = {}; // or any default configuration
        }
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
        if (chartData && chartData.type) {
          chartOptionsTemp = JSON.parse(
            JSON.stringify(defaultApexChart[chartData.type])
          );
        } else {
          console.error(
            'Error: chartData or chartData.type is not defined in defaultApexChart'
          );
          // Assign a fallback value or handle the error as needed
          chartOptionsTemp = {}; // or any default configuration
        }
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
        barHeight: '50%', // Adjust bar height for better spacing
        distributed: true,
        horizontal: true,
        dataLabels: {
          position: 'bottom',
        },
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels to avoid clutter
    },
    stroke: {
      width: 1,
      colors: ['#fff'],
    },
    yaxis: {
      labels: {
        show: true,
        maxWidth: 200, // Limit width to prevent long labels from overlapping
      },
      title: {
        text: undefined,
      },
    },
    title: {
      text: 'Survey Questions and Average Scores',
      align: 'center',
      style: {
        fontSize: '16px',
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

  // Semi circle START
  // Calculate Overall Survey Score
  const totalScore = surveyPulseResponseData?.reduce(
    (acc, item) => acc + Number(item.average_score),
    0
  );
  // const totalScore = surveyPulseResponseData?.average_total_score;
  const overallScore = totalScore / surveyPulseResponseData.length;

  // Flatten the responses arrays and find the highest number
  const allResponses = surveyPulseResponseData
    .flatMap((item) => item.responses)
    .filter((value) => value !== null && value !== 0);
  const highestNumber =
    allResponses.length > 0 ? Math.max(...allResponses) : null;

  // Optionally, convert overall score to percentage
  const overallScorePercentage = (overallScore / highestNumber) * 100; // Assuming max score is 5

  // ApexCharts configuration
  const semiOptions = {
    chart: {
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: '#e7e7e7',
          strokeWidth: '97%',
          margin: 5, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            color: '#999',
            opacity: 1,
            blur: 2,
          },
        },
        dataLabels: {
          name: {
            fontSize: '12px',
          },
          value: {
            fontSize: '16px',
            formatter: function () {
              return `${overallScore.toFixed(2)} / 5`;
            },
          },
          total: {
            show: true,
            fontSize: '10px',
            label: 'Overall Score',
            formatter: function () {
              return `${overallScorePercentage.toFixed(1)}%`;
            },
          },
        },
      },
    },
    labels: ['Overall Score'],
  };
  // Semi END

  // Category based chart dummy START
  const catOptions = {
    chart: {
      type: 'bar',
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    xaxis: {
      categories: [
        'Job Satisfaction',
        'Work-Life Balance',
        'Recent Changes',
        'Team Dynamics',
        'Work Environment',
        'Motivation',
        'Communication',
        'Recognition',
        'Personal Development',
        'Overall Engagement',
      ],
    },
    yaxis: {
      title: {
        text: 'Number of Responses',
      },
    },
    colors: ['#FF4560', '#008FFB', '#00E396', '#775DD0', '#FEB019'],
    legend: {
      position: 'top',
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
    dataLabels: {
      enabled: false,
    },
  };

  const catSeries = [
    {
      name: 'Very Dissatisfied / Strongly Disagree',
      data: [2, 3, 1, 4, 3, 2, 1, 5, 4, 3], // Example data
    },
    {
      name: 'Dissatisfied / Disagree',
      data: [4, 5, 3, 6, 5, 4, 2, 7, 6, 5],
    },
    {
      name: 'Neutral',
      data: [6, 4, 5, 4, 4, 6, 5, 4, 5, 6],
    },
    {
      name: 'Satisfied / Agree',
      data: [8, 7, 8, 7, 8, 9, 7, 6, 7, 8],
    },
    {
      name: 'Very Satisfied / Strongly Agree',
      data: [5, 6, 7, 6, 7, 5, 8, 7, 6, 5],
    },
  ];
  // Category based chart dummy START

  const totOptions = {
    chart: {
      height: 350,
      type: 'radialBar',
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: '70%',
          background: '#fff',
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: 'front',
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24,
          },
        },
        track: {
          background: '#fff',
          strokeWidth: '67%',
          margin: 0, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35,
          },
        },

        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: '#888',
            fontSize: '12px',
          },
          value: {
            formatter: function (val) {
              return parseInt(val);
            },
            color: '#111',
            fontSize: '24px',
            show: true,
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#ABE5A1'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: 'round',
    },
    labels: ['Response'],
  };

  const totSeries = [
    (surveyResponseStateData?.response / surveyResponseDataRaw?.length) * 100,
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
                        {/* <h3 className="mb-0">
                        {surveyResponseDataRaw?.answerTotal}/
                        {surveyResponseDataRaw?.assignTotal}
                      </h3> */}
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
                                    <div className="col-8">
                                      <Chart
                                        options={metricOptions}
                                        series={metricSeries}
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

export default Metric;
