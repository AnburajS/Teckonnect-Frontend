import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highcharts3d from "highcharts/highcharts-3d";
import cylinder from "highcharts/modules/cylinder";
import HC_more from "highcharts/highcharts-more";
import Chart from "react-apexcharts";
highcharts3d(Highcharts);
cylinder(Highcharts);
HC_more(Highcharts);
require("highcharts/modules/exporting")(Highcharts);

const SurveyCharts = (props) => {
  const { chartData, iSchartDownloadLoading = true } = props;
  const [showChart, setShowChart] = useState(true);

  useEffect(() => {
    if (iSchartDownloadLoading) {
      setShowChart(false);
      setTimeout(() => {
        setShowChart(true);
      });
    }
  }, [chartData]);

  const initChartData = chartData ? chartData : {};

  const showChartData = React.useMemo(() => {
    let value = [];
    if (chartData?.chart?.type === "bar") {
      value = chartData?.series?.[0]?.data;
    } else {
      value = chartData?.series?.[0];
    }
    return value?.some((val) => val > 0);
  }, [chartData?.chart?.type,chartData?.series]);

  return (
    <React.Fragment>
      {showChart && (
        <>
          {/* <HighchartsReact
            highcharts={Highcharts}
            constructorType={"chart"}
            options={initChartData}
          /> */}
          {showChartData ? (
            <Chart
              options={initChartData}
              series={
                chartData?.chart?.type === "bar"
                  ? chartData?.series
                  : chartData?.series?.[0]
              }
              type={initChartData?.chart?.type}
            />
          ) : (
            <div style={{ textAlign: "center",    padding: '52px 0px',
            fontSize: '14px',
            fontWeight: 300, color:'#9d9d9d'}}>No results yet!</div>
          )}
        </>
      )}
    </React.Fragment>
  );
};
export default SurveyCharts;