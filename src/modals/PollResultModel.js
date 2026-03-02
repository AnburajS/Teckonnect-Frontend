import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import PageHeader from '../UI/PageHeader';
import Modal from './Model';
import { formatFilterDate } from '../shared/SharedService';
import { generatePDF } from '../constants/utills';

const PollResultModel = ({ data, isOpen, onClose }) => {
  const [isloadingPdf, setIsPdfloading] = useState(false);
  const currentUserData = sessionStorage.userData
    ? JSON.parse(sessionStorage.userData)
    : {};
  const [pollData, setPollData] = useState({ ...data });
  useEffect(() => {
    setPollData(data);
  }, [data]);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: 'pie',
    },
    labels: [], // Replace with your options dynamically
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  });

  const [chartSeries, setChartSeries] = useState([]); // Data for the chart

  useEffect(() => {
    if (data?.map) {
      const labels = Object.keys(data?.map);
      const series = Object.values(data?.map);

      setChartOptions((prevOptions) => ({
        ...prevOptions,
        labels: labels,
      }));
      setChartSeries(series);
    }
  }, [data]);
  const getSubmittedCount = (submittedData) => {
    var res = submittedData?.reduce(function (obj, v) {
      obj[v.state] = (obj[v.state] || 0) + 1;
      return obj;
    }, {});
    if (res?.submitted) {
      return res?.submitted;
    } else {
      return 0;
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Polls Answer"
      modalWidth="w-75"
      className="tc_design"
    >
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
      <div
        className="row"
        id="chartDiv"
      >
        <div className="chart-container col-md-8">
          <label className="fs-18 fw-600 my-3">{data?.name}</label>
          {chartSeries &&
          Object.values(chartSeries).every((value) => value === 0) ? (
            <div
              className="fs-14 fw-300 ml-3"
              style={{
                textAlign: 'start',
                padding: '30px 0px',

                color: '#9d9d9d',
              }}
            >
              <img
                src={process.env.PUBLIC_URL + '/images/icons/static/noData.svg'}
                alt="no-data-icon"
              />
              <p className="eep_blank_quote">No results yet!</p>
            </div>
          ) : (
            <div>
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="pie"
                width="400"
              />
            </div>
          )}
        </div>

        {pollData &&
          (pollData?.createdBy?.id ||
            pollData?.createdBy?.user_id !== currentUserData?.id) && (
            <div className="col-md-4 col-lg-3 col-xs-12 col-sm-12 align-self-start mt-3">
              <div className="col-md-12 bg-f5f5f5 br-10 p-3 mb-3">
                <label className="mb-0">
                  Type : <span>{pollData?.type}</span>
                </label>
                <div className="eep-dropdown-divider"></div>
                <label className="mb-0">
                  End Date : <span>{formatFilterDate(pollData?.endDate)}</span>
                </label>
              </div>
              <div className="col-md-12 b-dbdbdb br-10 p-3">
                <div className="d-flex justify-content-between">
                  <label className="mb-0">Response Info : </label>
                  <label className="mb-0">
                    <span>
                      {getSubmittedCount(pollData?.pollResponse)}/
                      {pollData?.pollResponse?.length}
                    </span>
                  </label>
                </div>
                <div className="eep-dropdown-divider"></div>
                <div
                  className="eep_scroll_y"
                  style={{ maxHeight: '245px' }}
                >
                  {pollData?.pollResponse &&
                    pollData?.pollResponse?.length > 0 &&
                    pollData?.pollResponse
                      ?.sort((a, b) => (a.userId.id > b.userId.id ? 1 : -1))
                      .map((item, index) => {
                        return (
                          <div
                            className={`d-flex ${
                              pollData.pollResponse.length - 1 === index
                                ? ''
                                : 'mb-2'
                            }`}
                            key={'responseUser_' + index}
                          >
                            <img
                              src={
                                item.state === 'submitted'
                                  ? process.env.PUBLIC_URL +
                                    '/images/icons/static/res-green.svg'
                                  : process.env.PUBLIC_URL +
                                    '/images/icons/static/res-red.svg'
                              }
                              alt={item.state}
                              title={item.state}
                              style={{ width: '15px' }}
                            />
                            <label className="mb-0 ml-2">
                              {item?.userId?.firstname +
                                ' ' +
                                item?.userId?.lastname}
                            </label>
                          </div>
                        );
                      })}
                </div>
              </div>
            </div>
          )}
      </div>
      <div className=" col-xs-12 col-sm-12 d-flex justify-content-center">
        {chartSeries && chartSeries.every((value) => value === 0) ? null : (
          <button
            onClick={() =>
              generatePDF(
                'chartDiv',
                'auto',
                'auto',
                data?.name,
                setIsPdfloading
              )
            }
            className="btn  btn-secondary "
            style={{ marginLeft: '0.75rem' }}
          >
            Download Report
          </button>
        )}
      </div>
    </Modal>
  );
};

export default PollResultModel;
