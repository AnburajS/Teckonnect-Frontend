import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const DashboardCharts = (props) => {
  const { chartType, chartData } = props;
  const [showChart, setShowChart] = useState(true);

  useEffect(() => {
    setShowChart(false);
    setTimeout(() => {
      setShowChart(true);
    });
  }, [chartType]);

  const initChartData = chartData ? chartData : {};

  const showChartData = React.useMemo(() => {
    let value = [];
    if (chartData?.chart?.type === "bar") {
      value = chartData?.series?.[0]?.data;
    } else if (chartData?.chart?.type === "donut") {
      value = chartData?.series;
    }
    return value?.some((val) => val > 0);
  }, [chartData?.chart?.type, chartData?.series]);

  return (
    <React.Fragment>
      {showChart && (
        <>
          {showChartData ? (
            <Chart
              options={initChartData}
              series={chartData?.series}
              type={initChartData?.chart?.type}
            />
          ) : (
            <Chart
              options={initChartData}
              series={initChartData?.series}
              type="radialBar"
            />
          )}
        </>
      )}
    </React.Fragment>
  );
};
export default DashboardCharts;
