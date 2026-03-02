import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
require("highcharts/modules/exporting")(Highcharts);

const Charts = (props) => {

  const {chartType} = props;
  const [showChart, setShowChart] = useState(true);
  useEffect(() => {
    setShowChart(false);
    setTimeout(() => {
      setShowChart(true);
    })
  },[chartType.value])

  const chartOptions = {
    pie: {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Browser market shares in March, 2022'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          },
          showInLegend: true
        }
      },
      series: [{
        name: 'Brands',
        colorByPoint: true,
        data: [{
          name: 'Chrome',
          y: 74.77,
          sliced: true,
          selected: true
        },  {
          name: 'Edge',
          y: 12.82
        },  {
          name: 'Firefox',
          y: 4.63
        }, {
          name: 'Safari',
          y: 2.44
        }, {
          name: 'Internet Explorer',
          y: 2.02
        }, {
          name: 'Other',
          y: 3.28
        }]
      }]
    },
    verticalBarChart: {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Emissions to air in Norway'
      },
      subtitle: {
        text: 'Source: ' +
          '<a href="https://www.ssb.no/en/statbank/table/08940/" ' +
          'target="_blank">SSB</a>'
      },
      xAxis: {
        categories: [
          '2010',
          '2011',
          '2012',
          '2013',
          '2014',
          '2015',
          '2016',
          '2017',
          '2018',
          '2019',
          '2010',
          '2021'
        ],
        crosshair: true
      },
      yAxis: {
        title: {
          useHTML: true,
          text: 'Million tonnes CO<sub>2</sub>-equivalents'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [{
        name: 'Oil and gas extraction',
        data: [13.93, 13.63, 13.73, 13.67, 14.37, 14.89, 14.56,
          14.32, 14.13, 13.93, 13.21, 12.16]
    
      }, {
        name: 'Manufacturing industries and mining',
        data: [12.24, 12.24, 11.95, 12.02, 11.65, 11.96, 11.59,
          11.94, 11.96, 11.59, 11.42, 11.76]
    
      }, {
        name: 'Road traffic',
        data: [10.00, 9.93, 9.97, 10.01, 10.23, 10.26, 10.00,
          9.12, 9.36, 8.72, 8.38, 8.69]
    
      }, {
        name: 'Agriculture',
        data: [4.35, 4.32, 4.34, 4.39, 4.46, 4.52, 4.58, 4.55,
          4.53, 4.51, 4.49, 4.57]
    
      }]
    },
    horizontalBarChart: {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Historic World Population by Region'
      },
      subtitle: {
        text: 'Source: <a ' +
          'href="https://en.wikipedia.org/wiki/List_of_continents_and_continental_subregions_by_population"' +
          'target="_blank">Wikipedia.org</a>'
      },
      xAxis: {
        categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
        title: {
          text: null
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Population (millions)',
          align: 'high'
        },
        labels: {
          overflow: 'justify'
        }
      },
      tooltip: {
        valueSuffix: ' millions'
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
        shadow: true
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Year 1990',
        data: [631, 727, 3202, 721, 26]
      }, {
        name: 'Year 2000',
        data: [814, 841, 3714, 726, 31]
      }, {
        name: 'Year 2010',
        data: [1044, 944, 4170, 735, 40]
      }, {
        name: 'Year 2018',
        data: [1276, 1007, 4561, 746, 42]
      }]
    }
  }

  return  <React.Fragment>
    {showChart && <HighchartsReact
      highcharts={Highcharts}
      constructorType={"chart"}
      options={chartOptions[chartType.value]}
    />}
 
  {/* <HighchartsReact
    highcharts={Highcharts}
    constructorType={"chart"}
    options={chartOptions.verticalBarChart}/> */}
  </React.Fragment>
 
}
export default Charts;