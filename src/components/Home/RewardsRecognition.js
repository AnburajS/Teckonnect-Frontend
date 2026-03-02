import React, { useEffect, useState } from 'react';
// import { useDispatch } from "react-redux";
// import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import Highcharts from 'highcharts';
import PageHeader from '../../UI/PageHeader';
import TypeBasedFilter from '../../UI/TypeBasedFilter';
import { URL_CONFIG } from '../../constants/rest-config';
import { TYPE_BASED_FILTER_WITH_BETWEEN_DATES } from '../../constants/ui-config';
import { httpHandler } from '../../http/http-interceptor';
import DashboardCharts from '../Charts/DashboardCharts';
import { useTranslation } from 'react-i18next';
import Isloading from '../../UI/CustomComponents/Isloading';
import { pageLoaderHandler } from '../../helpers';

const RewardsRecognition = (props) => {
  // const dispatch = useDispatch();
  const { t } = useTranslation();

  const { allUserDatas } = props;

  const [filterParams, setFilterParams] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [rrData, setRRData] = useState({});
  const initAllUserDatas = allUserDatas ? allUserDatas : [];
  const [loginChart, setLoginChart] = useState({});
  const [recognitionChart, setRecognitionChart] = useState({});
  const [ecardChart, setEcardChart] = useState({});
  const [certificateChart, setCertificateChart] = useState({});
  const [badgeChart, setBadgeChart] = useState({});
  const [awardChart, setAwardChart] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const defaultChartOptions = {
    login: {
      chart: {
        type: 'radialBar',
        height: '50%',
        width: '50%',
        offsetX: -2,
        offsetY: -32,
        sparkline: { enabled: true },
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          hollow: {
            size: '60%',
            background: '#ffffff',
            position: 'front',
            dropShadow: {
              enabled: true,
              top: 3,
              blur: 6,
              opacity: 0.15,
            },
          },
          track: {
            background: '#e5e7eb',
            strokeWidth: '90%', // controls the **thickness** of the bar
            margin: 0,
          },
          // dataLabels: {
          //   name: {
          //     show: true,
          //     offsetY: 30,
          //     color: '#6b7280',
          //     fontSize: '15px',
          //     fontWeight: 40,
          //   },
          //   value: {
          //     show: true,
          //     fontSize: '20px',
          //     fontWeight: 500,
          //     offsetY: -10,
          //     color: '#111827',
          //     formatter: function () {
          //       return `${rrData.loginUserCount} Active Users`;
          //     },
          //   },
          // },
          dataLabels: {
            name: {
              show: true,
              offsetY: 80,
              color: '#6b7280',
              fontSize: '15px',
              fontWeight: 40,
            },
            value: {
              show: true,
              fontSize: '20px',
              fontWeight: 500,
              offsetY: -10,
              color: '#111827',
              formatter: function () {
                const userIcon = '👤'; // user icon
                return `${rrData.loginUserCount} ${userIcon} Active User`;
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
          gradientToColors: ['#2d6acdff'], // indigo/blue end
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
          colorStops: [
            { offset: 0, color: '#2563eb', opacity: 1 }, // deep blue start
            { offset: 100, color: '#3470d2ff', opacity: 1 }, // lighter blue end
          ],
        },
      },
      stroke: {
        lineCap: 'round', // rounded ends
      },
      series: [rrData.loginUserPercent], // percent value
      labels: ['Logged In'],
    },

    ///recognition start ///
    recognition: {
      chart: {
        renderTo: 'container',
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 15,
          beta: 15,
          depth: 50,
          viewDistance: 25,
        },
      },

      xAxis: {
        categories: ['E-Cards', 'Certificates', 'Badges', 'Awards'],
      },
      yAxis: {
        title: {
          enabled: false,
        },
      },
      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: 'Recognition: {point.y}',
      },
      title: {
        text: '',
      },
      subtitle: {
        text: '',
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        column: {
          depth: 25,
        },
      },
      series: [],
    },
    badge: {
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45,
          beta: 0,
        },
      },
      title: {
        text: '',
      },
      subtitle: {
        text: '',
      },
      accessibility: {
        point: {
          valueSuffix: '%',
        },
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}</b>',
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          depth: 35,
          dataLabels: {
            enabled: true,
            format: '{point.name}',
          },
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Badge',
          data: [
            ['Explorer', 23],
            ['Leader', 18],
            {
              name: 'Innovation',
              y: 12,
              sliced: true,
              selected: true,
            },
            ['Performer*', 9],
            ['Elite', 8],
            ['Team Changer', 30],
          ],
        },
      ],
    },
    badge1: {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
      },
      title: {
        text: '',
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}</b>',
      },
      accessibility: {
        point: {
          valueSuffix: '',
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false,
          },
          showInLegend: true,
        },
      },
      series: [
        {
          name: 'Badge',
          colorByPoint: true,
          data: [
            {
              name: 'Leader',
              y: 44,
              sliced: true,
              selected: true,
            },
            {
              name: 'Explorer',
              y: 22,
            },
            {
              name: 'Innovation',
              y: 4,
            },
            {
              name: 'Performer',
              y: 12,
            },
            {
              name: 'Elite',
              y: 2,
            },
            {
              name: 'Team Changer',
              y: 9,
            },
          ],
        },
      ],
    },
    awards: {
      chart: {
        type: 'column',
        zoom: {
          enabled: false,
        },
      },

      title: {
        text: '',
      },
      subtitle: {
        text: '',
      },
      xAxis: {
        categories: [
          'All Star',
          'Dark Knight',
          'Legendary',
          'Leviosa',
          'Omega',
          'Performer',
          'Picasso',
          'Premier',
          'Rockstar Rockie',
          'Super Squad',
          'Team Infinity',
          'Transformer',
        ],
        crosshair: true,
      },
      yAxis: {
        title: {
          useHTML: true,
          text: '',
        },
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series: [
        {
          name: 'Spot Awards',
          data: [13, 9, 7, 13, 14, 5, 3, 8, 11, 4, 10, 12],
        },
        {
          name: 'Nomination Awards',
          data: [12, 10, 11, 7, 11, 7, 9, 0, 1, 4, 2, 6],
        },
      ],
    },
    certificate: {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
      },
      title: {
        // text: 'Browser<br>shares<br>January<br>2022',
        text: 'Certificates',
        align: 'center',
        verticalAlign: 'middle',
        y: 60,
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}</b>',
      },
      accessibility: {
        point: {
          valueSuffix: '',
        },
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: -50,
            style: {
              fontWeight: 'bold',
              color: 'white',
            },
          },
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '75%'],
          size: '110%',
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Certificate',
          innerSize: '50%',
          data: [
            ['Kudos', 35],
            ['Excellence', 55],
            ['Achievement', 10],
          ],
        },
      ],
    },
    ecards: {
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45,
        },
      },
      title: {
        text: '',
      },
      subtitle: {
        text: '',
      },
      plotOptions: {
        pie: {
          innerSize: 100,
          depth: 45,
        },
      },
      series: [],
    },
  };

  // const apexChartOptions = {
  //   recognition: {
  //     labels: ['E-Cards', 'Certificates', 'Badges', 'Awards'],
  //     chart: {
  //       height: 350,
  //       type: 'bar',
  //       zoom: {
  //         enabled: false,
  //       },
  //     },
  //     stroke: {
  //       width: 2,
  //     },

  //     grid: {
  //       row: {
  //         colors: ['#fff', '#f2f2f2'],
  //       },
  //     },
  //     xaxis: {
  //       categories: [
  //         t(`dashboard.E-Cards`),
  //         t(`dashboard.Certificates`),
  //         t(`dashboard.Badges`),
  //         t(`dashboard.Awards`),
  //       ],
  //       tickPlacement: 'on',
  //     },
  //     yaxis: {
  //       title: {
  //         text: '',
  //       },
  //     },
  //     plotOptions: {
  //       bar: {
  //         borderRadius: 0,
  //         columnWidth: '50%',
  //       },
  //     },
  //     dataLabels: {
  //       enabled: true,
  //       style: {
  //         colors: ['#000'],
  //         boxShadow: 'none',
  //       },
  //     },
  //     title: {
  //       text: '',
  //     },
  //     subtitle: {
  //       text: '',
  //     },
  //     fill: {
  //       type: 'gradient',
  //       gradient: {
  //         shade: 'light',
  //         type: 'horizontal',
  //         shadeIntensity: 0.25,
  //         gradientToColors: undefined,
  //         inverseColors: true,
  //         opacityFrom: 0.85,
  //         opacityTo: 0.85,
  //         stops: [50, 0, 100],
  //       },
  //     },
  //     series: [],
  //   },
  //   ecards: {
  //     labels: [],
  //     dataLabels: {
  //       enabled: true,
  //     },
  //     chart: {
  //       type: 'donut',
  //     },
  //     title: {
  //       text: '',
  //     },
  //     subtitle: {
  //       text: '',
  //     },
  //     legend: {
  //       show: true,
  //     },
  //     plotOptions: {
  //       pie: {
  //         innerSize: 100,
  //         depth: 45,
  //         donut: {
  //           labels: {
  //             show: false,
  //           },
  //         },
  //       },
  //     },
  //     series: [],
  //   },

  const apexChartOptions = {
    recognition: {
      labels: ['E-Cards', 'Certificates', 'Badges', 'Awards'],
      chart: {
        height: 350,
        type: 'bar',
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '30%',
          borderRadius: 19, // rounded bars
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#111827'],
          fontSize: '12px',
          fontWeight: '600',
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: [
          t(`dashboard.E-Cards`),
          t(`dashboard.Certificates`),
          t(`dashboard.Badges`),
          t(`dashboard.Awards`),
        ],
        labels: {
          style: { fontSize: '13px', colors: '#6b7280' },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        title: { text: '' },
        labels: { style: { colors: '#6b7280', fontSize: '12px' } },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.3,
          gradientToColors: ['#6366f1', '#60a5fa', '#3b82f6', '#2563eb'], // gradient per bar
          inverseColors: false,
          opacityFrom: 0.9,
          opacityTo: 0.9,
          stops: [0, 100],
        },
      },
      grid: {
        borderColor: '#e5e7eb',
        row: { colors: ['#f9fafb', 'transparent'], opacity: 0.5 },
      },

      series: [
        {
          name: 'Recognition',
          data: [45, 60, 35, 50], // example dynamic data
        },
      ],
    },

    // ecards: {
    //   labels: ['Kudos', 'Excellence', 'Achievement', 'Innovation'],
    //   chart: { type: 'donut', height: 300 },
    //   plotOptions: {
    //     pie: {
    //       donut: {
    //         size: '65%',
    //         labels: {
    //           show: true,
    //           name: {
    //             offsetY: -10,
    //             color: '#6b7280',
    //             fontSize: '14px',
    //             fontWeight: '600',
    //           },
    //           value: {
    //             offsetY: 10,
    //             color: '#111827',
    //             fontSize: '16px',
    //             fontWeight: '700',
    //           },
    //           total: {
    //             show: true,
    //             label: 'Total',
    //             color: '#3b82f6',
    //             formatter: () => 150, // example total
    //           },
    //         },
    //       },
    //     },
    //   },
    //   dataLabels: {
    //     enabled: true,
    //     style: { fontSize: '13px', fontWeight: '600', colors: ['#fff'] },
    //   },
    //   fill: {
    //     type: 'gradient',
    //     gradient: {
    //       shade: 'light',
    //       type: 'horizontal',
    //       gradientToColors: ['#3b82f6', '#6366f1', '#60a5fa', '#2563eb'],
    //       opacityFrom: 0.9,
    //       opacityTo: 0.9,
    //     },
    //   },
    //   legend: {
    //     show: true,
    //     position: 'bottom',
    //     fontSize: '13px',
    //     labels: { colors: '#374151' },
    //   },
    //   series: [35, 55, 25, 40], // example dynamic values
    // },
    ecards: {
      labels: ['Kudos', 'Excellence', 'Achievement', 'Innovation'],
      series: [35, 55, 25, 40],
      chart: {
        type: 'donut',
        height: 320,
        animations: {
          enabled: true,
          easing: 'easeout',
          speed: 1200,
          animateGradually: { enabled: true, delay: 300 },
        },
        toolbar: { show: false },
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 270,
          donut: {
            size: '70%',
            background: 'transparent',
            labels: {
              show: true,
              name: {
                show: true,
                color: '#6b7280',
                fontSize: '15px',
                fontWeight: 600,
                offsetY: -10,
              },
              value: {
                show: true,
                fontSize: '18px',
                fontWeight: 800,
                color: '#111827',
                offsetY: 10,
                formatter: (val) => `${val}%`,
              },
              total: {
                show: true,
                label: 'Overall',
                fontSize: '15px',
                fontWeight: 700,
                color: '#3b82f6',
                formatter: (w) => {
                  const total = w.globals.seriesTotals.reduce(
                    (a, b) => a + b,
                    0
                  );
                  return `${total}`;
                },
              },
            },
          },
        },
      },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'diagonal1',
          shadeIntensity: 0.5,
          gradientToColors: ['#60a5fa', '#34d399', '#fbbf24', '#f87171'],
          inverseColors: false,
          opacityFrom: 0.9,
          opacityTo: 0.9,
          stops: [0, 100],
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['#ffffff'],
      },
      legend: {
        show: true,
        position: 'bottom',
        fontSize: '13px',
        fontWeight: 600,
        markers: { radius: 12 },
        labels: { colors: '#374151' },
        itemMargin: { horizontal: 8, vertical: 4 },
      },
      dataLabels: {
        enabled: true,
        dropShadow: { enabled: true, top: 2, left: 2, blur: 3, opacity: 0.3 },
        style: {
          fontSize: '13px',
          fontWeight: '600',
          colors: ['#ffffff'],
        },
        background: {
          enabled: true,
          foreColor: '#111827',
          borderRadius: 3,
          borderWidth: 0,
          opacity: 0.6,
        },
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: { height: 260 },
            legend: { position: 'bottom' },
            plotOptions: { pie: { donut: { size: '65%' } } },
          },
        },
      ],
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (val) => `${val} Awards`,
        },
      },
    },
    old_certificate: {
      labels: [
        t(`dashboard.Kudos`),
        t(`dashboard.Excellence`),
        t(`dashboard.Achievement`),
      ],
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
    // certificate: {
    //   // labels: [
    //   //   t(`dashboard.Kudos`),
    //   //   t(`dashboard.Excellence`),
    //   //   t(`dashboard.Achievement`),
    //   // ],
    //   dataLabels: {
    //     enabled: false,
    //   },
    //   chart: {
    //     type: 'bar',
    //   },
    //   title: {
    //     text: '',
    //   },
    //   subtitle: {
    //     text: '',
    //   },
    //   legend: {
    //     show: true,
    //   },
    //   xaxis: {
    //     categories: [
    //       'South Korea',
    //       'Canada',
    //       'United Kingdom',
    //       'Netherlands',
    //       'Italy',
    //       'France',
    //       'Japan',
    //       'United States',
    //       'China',
    //       'Germany',
    //     ],
    //   },
    //   plotOptions: {
    //     bar: {
    //       borderRadius: 4,
    //       borderRadiusApplication: 'end',
    //       horizontal: true,
    //       barHeight: '20%',
    //       columnWidth: '10px',
    //     },
    //   },
    //   series: [],
    // },

    certificate: {
      chart: {
        type: 'bar',
        height: 360,
        toolbar: { show: false },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1200,
          animateGradually: { enabled: true, delay: 150 },
          dynamicAnimation: { enabled: true, speed: 600 },
        },
      },
      legend: { show: false },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '13px',
          fontWeight: 'bold',
          colors: ['#565656ff', '#565656ff'], // white + gold for luxury look
        },
        formatter: function (val) {
          const certificateIcon = ''; // certificate icon
          return `${certificateIcon} ${val}`; // icon + value
        },
        dropShadow: {
          enabled: true,
          top: 2,
          left: 2,
          blur: 4,
          color: '#000',
          opacity: 0.6,
        },
      },
      xaxis: {
        categories: [
          'South Korea',
          'Canada',
          'United Kingdom',
          'Netherlands',
          'Italy',
          'France',
          'Japan',
          'United States',
          'China',
          'Germany',
        ],
        labels: {
          style: {
            fontSize: '13px',
            fontWeight: 500,
            colors: '#d1d5db',
          },
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 16,
          borderRadiusApplication: 'end',
          horizontal: true,
          distributed: true,
          columnWidth: '42px',
          barHeight: '24px',
          dataLabels: { position: 'top' },
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          // gradientToColors: ['rgba(255,215,0,0.9)'], // gold end
          gradientToColors: [' #2d6acdff'], // gold end

          inverseColors: false,
          opacityFrom: 0.95,
          opacityTo: 0.8,
          stops: [0, 100],
          // colorStops: [
          //   { offset: 0, color: 'rgba(37,99,235,0.95)', opacity: 0.95 }, // deep premium blue
          //   { offset: 100, color: 'rgba(255,215,0,0.9)', opacity: 0.9 }, // gold
          // ],
          colorStops: [
            { offset: 0, color: '#2563eb', opacity: 1 }, // deep blue start
            { offset: 100, color: '#3470d2ff', opacity: 1 }, // lighter blue end
          ],
        },
      },
      colors: ['rgba(37,99,235,0.95)', 'rgba(255,215,0,0.9)'], // premium glassy deep blue & gold
      grid: {
        borderColor: 'rgba(255,255,255,0.1)',
        strokeDashArray: 4,
        position: 'back',
      },
      tooltip: {
        theme: 'light',
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
        },
        marker: { show: true },
        y: {
          formatter: (val) => `${val} Certificates`,
        },
        backgroundColor: 'rgba(0,0,0,0.75)',
        borderRadius: 8,
        shadow: {
          enabled: true,
          color: '#000',
          offsetX: 2,
          offsetY: 2,
          blur: 8,
          opacity: 0.4,
        },
      },
      states: {
        hover: {
          filter: {
            type: 'lighten',
            value: 0.15,
          },
        },
      },
      series: [
        {
          name: 'Certificates',
          data: [10, 8, 15, 6, 12, 9, 14, 18, 20, 11],
        },
      ],
    },
    //////////////////////////////////////////////////////
    // badge: {
    //   labels: [
    //     t(`dashboard.Explorer`),
    //     t(`dashboard.Leader`),
    //     t(`dashboard.Performer`),
    //     t(`dashboard.Elite`),
    //     t(`dashboard.Team Change`),
    //   ],
    //   dataLabels: {
    //     enabled: true,
    //   },

    //   chart: {
    //     type: 'donut',
    //   },
    //   title: {
    //     text: '',
    //   },
    //   subtitle: {
    //     text: '',
    //   },
    //   legend: {
    //     show: true,
    //   },
    //   plotOptions: {
    //     pie: {
    //       innerSize: 100,
    //       depth: 45,
    //       donut: {
    //         labels: {
    //           show: false,
    //         },
    //       },
    //     },
    //   },
    //   series: [],
    // },
    /////////////////////////////////////////////////////////////////////////////
    badge: {
      chart: {
        type: 'donut',
        height: 400,
        toolbar: {
          show: true,
          tools: {
            download: true,
          },
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 900,
        },
      },

      // title: {
      //   text: 'Employee Badge Distribution',
      //   align: 'center',
      //   style: {
      //     fontSize: '16px',
      //     fontWeight: 700,
      //     color: '#1e293b',
      //   },
      // },

      // subtitle: {
      //   text: 'Exploring performance recognition across categories',
      //   align: 'center',
      //   style: {
      //     fontSize: '13px',
      //     color: '#64748b',
      //   },
      // },

      labels: [
        t('dashboard.Explorer'),
        t('dashboard.Leader'),
        t('dashboard.Performer'),
        t('dashboard.Elite'),
        t('dashboard.Team Change'),
      ],

      series: [28, 22, 18, 16, 14], // sample dynamic data

      legend: {
        show: true,
        position: 'right',
        fontSize: '13px',
        fontWeight: 500,
        labels: {
          colors: '#334155',
        },
        markers: {
          radius: 6,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 6,
        },
      },

      dataLabels: {
        enabled: true,
        dropShadow: {
          enabled: true,
          top: 2,
          left: 2,
          blur: 2,
          color: '#000',
          opacity: 0.2,
        },
        style: {
          fontSize: '13px',
          fontWeight: 600,
          colors: ['#fff'],
        },
        formatter: (val) => `${val.toFixed(1)}%`,
      },

      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            background: 'transparent',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                fontSize: '15px',
                fontWeight: 700,
                color: '#1e293b',
                formatter: (w) =>
                  w.globals.seriesTotals.reduce((a, b) => a + b, 0),
              },
              value: {
                fontSize: '22px',
                fontWeight: 700,
                color: '#2563eb',
              },
              name: {
                fontSize: '14px',
                color: '#64748b',
              },
            },
          },
        },
      },

      stroke: {
        show: true,
        width: 2,
        colors: ['#fff'],
      },

      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'diagonal1',
          shadeIntensity: 0.5,
          gradientToColors: [
            '#2563eb', // Blue
            '#10b981', // Emerald
            '#f59e0b', // Amber
            '#ec4899', // Pink
            '#8b5cf6', // Violet
          ],
          opacityFrom: 0.9,
          opacityTo: 0.8,
          stops: [0, 100],
        },
      },

      colors: ['#3b82f6', '#34d399', '#fbbf24', '#f472b6', '#a78bfa'],

      tooltip: {
        theme: 'light',
        fillSeriesColor: false,
        y: {
          formatter: (val) => `${val}% of total`,
        },
        style: {
          fontSize: '13px',
        },
      },

      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              height: 320,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },

    //   awards: {
    //     chart: {
    //       height: 350,
    //       type: 'bar',
    //       zoom: {
    //         enabled: false,
    //       },
    //     },
    //     stroke: {
    //       width: 2,
    //     },

    //     grid: {
    //       row: {
    //         colors: ['#fff', '#f2f2f2'],
    //       },
    //     },
    //     xaxis: {
    //       categories: [
    //         'All Star',
    //         'Dark Knight',
    //         'Legendary',
    //         'Leviosa',
    //         'Omega',
    //         'Performer',
    //         'Picasso',
    //         'Premier',
    //         'Rockstar Rockie',
    //         'Super Squad',
    //         'Team Infinity',
    //         'Transformer',
    //       ],
    //       tickPlacement: 'on',
    //     },
    //     yaxis: {
    //       title: {
    //         text: '',
    //       },
    //     },

    //     plotOptions: {
    //       bar: {
    //         borderRadius: 0,
    //         columnWidth: '50%',
    //       },
    //     },
    //     dataLabels: {
    //       enabled: true,
    //       style: {
    //         colors: ['#000'],
    //       },
    //     },
    //     title: {
    //       text: '',
    //     },
    //     subtitle: {
    //       text: '',
    //     },
    //     fill: {
    //       type: 'gradient',
    //       gradient: {
    //         shade: 'light',
    //         type: 'horizontal',
    //         shadeIntensity: 0.25,
    //         gradientToColors: undefined,
    //         inverseColors: true,
    //         opacityFrom: 0.85,
    //         opacityTo: 0.85,
    //         stops: [50, 0, 100],
    //       },
    //     },
    //     series: [
    //       {
    //         name: 'Spot Awards',
    //         data: [13, 9, 7, 13, 14, 5, 3, 8, 11, 4, 10, 12],
    //       },
    //       {
    //         name: 'Nomination Awards',
    //         data: [12, 10, 11, 7, 11, 7, 9, 0, 1, 4, 2, 6],
    //       },
    //     ],
    //   },
    // };

    awards: {
      chart: {
        type: 'bar',
        background: 'transparent',
        parentHeightOffset: 0,
        toolbar: {
          show: true,
          tools: { download: true },
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: { enabled: true, delay: 100 },
        },
        redrawOnParentResize: true,
        redrawOnWindowResize: true,
      },

      title: {
        text: '🏆 Employee Awards Dashboard',
        align: 'center',
        style: {
          fontSize: '20px',
          fontWeight: 700,
          color: '#0f172a',
          fontFamily: 'Inter, sans-serif',
        },
      },

      subtitle: {
        text: 'Spot & Nomination Awards Comparison',
        align: 'center',
        style: { fontSize: '14px', color: '#64748b', fontWeight: 500 },
      },

      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
          columnWidth: '50%',
          endingShape: 'rounded',
          dataLabels: { position: 'top' },
        },
      },

      dataLabels: {
        enabled: true,
        formatter: (val) => (val > 0 ? `${val} 🏅` : ''),
        offsetY: -8, // 🔹 makes labels stay visible even for tall bars
        style: {
          fontSize: '12px',
          fontWeight: 600,
          colors: ['#0f172a'],
        },
        background: {
          enabled: true,
          foreColor: '#0f172a',
          padding: 2,
          borderRadius: 4,
          borderWidth: 0,
          opacity: 0.1,
        },
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 2,
          opacity: 0.3,
        },
      },

      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },

      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.4,
          gradientToColors: ['#93c5fd', '#fde68a'],
          inverseColors: false,
          opacityFrom: 0.9,
          opacityTo: 0.85,
          stops: [0, 100],
        },
      },

      colors: ['#3b82f6', '#f59e0b'],

      xaxis: {
        categories: [
          'All Star',
          'Dark Knight',
          'Legendary',
          'Leviosa',
          'Omega',
          'Performer',
          'Picasso',
          'Premier',
          'Rockstar Rockie',
          'Super Squad',
          'Team Infinity',
          'Transformer',
        ],
        labels: {
          rotate: -30,
          style: {
            colors: '#334155',
            fontSize: '12px',
            fontWeight: 500,
          },
        },
        axisTicks: { show: false },
        axisBorder: { show: false },
      },

      yaxis: {
        labels: {
          style: { colors: '#475569', fontSize: '12px' },
        },
        min: 0,
        forceNiceScale: true,
        tickAmount: 6,
        max: undefined, // 🟢 let Apex auto-adjust height dynamically
      },

      grid: {
        borderColor: '#e2e8f0',
        // strokeDashArray: 4,
        padding: {
          top: 0,
          bottom: -15, // 🔥 removes extra bottom white space
          left: 15,
          right: 15,
        },
      },

      tooltip: {
        theme: 'light',
        y: { formatter: (val) => `${val} Awards` },
        marker: { show: true },
      },

      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '13px',
        fontWeight: 600,
        labels: { colors: '#334155' },
        markers: { radius: 8 },
        itemMargin: { horizontal: 10, vertical: 5 },
      },

      series: [
        {
          name: 'Spot Awards',
          data: [13, 9, 7, 13, 14, 5, 3, 8, 11, 4, 10, 12],
        },
        {
          name: 'Nomination Awards',
          data: [12, 10, 11, 7, 11, 7, 9, 0, 1, 4, 2, 6],
        },
      ],

      responsive: [
        {
          breakpoint: 1024,
          options: {
            chart: { height: '100%' },
            plotOptions: { bar: { columnWidth: '60%' } },
            dataLabels: { style: { fontSize: '11px' } },
          },
        },
        {
          breakpoint: 768,
          options: {
            chart: { height: '200%' },
            plotOptions: { bar: { columnWidth: '70%' } },
            legend: { position: 'bottom' },
          },
        },
      ],
    },
  };
  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'Dashboard',
      link: '#',
    },
    {
      label: 'Rewards & Recognition',
      link: '#',
    },
  ];

  const fetchRewardsRecognition = (paramsInfo) => {
    setIsLoading(true);
    let obj = {
      url: URL_CONFIG.REWARDS_RECOGNITION,
      method: 'get',
    };
    if (Object.getOwnPropertyNames(paramsInfo)) {
      obj['params'] = paramsInfo;
    }
    httpHandler(obj)
      .then((response) => {
        setRRData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log('fetchRewardsRecognition error', error);
        setIsLoading(false);
      });
  };

  const getFilterParams = (paramsData) => {
    if (Object.getOwnPropertyNames(filterParams)) {
      setFilterParams({ ...paramsData });
    } else {
      setFilterParams({});
    }
    fetchRewardsRecognition(paramsData);
  };

  useEffect(() => {
    fetchRewardsRecognition(filterParams);
    pageLoaderHandler(isLoading ? 'show' : 'hide');
  }, []);

  useEffect(() => {
    if (rrData && Object.keys(rrData)?.length) {
      // Login Chart Start
      let loginChartTemp = defaultChartOptions.login;
      loginChartTemp['series'] = [
        (rrData.loginUserCount / initAllUserDatas.length) * 100,
      ];
      loginChartTemp['labels'] = ['Total User' + ':' + initAllUserDatas.length];
      rrData.loginUserCount > 0
        ? setLoginChart({ ...loginChartTemp })
        : setLoginChart({});
      // Login Chart End

      // Recognition Chart Start
      let recognitionChartTemp = apexChartOptions.recognition;
      recognitionChartTemp['series'] = [
        {
          name: '',
          data: [
            rrData.eCardsCount,
            rrData.certificateCount,
            rrData.badgeCount,
            rrData.awardCount,
          ],
          // colorByPoint: true
        },
      ];

      //setRecognitionChart({...recognitionChartTemp});
      rrData.eCardsCount > 0 ||
      rrData.certificateCount > 0 ||
      rrData.badgeCount > 0 ||
      rrData.awardCount > 0
        ? setRecognitionChart({ ...recognitionChartTemp })
        : setRecognitionChart({});
      // Recognition Chart End

      // E-Cards Chart Start
      let ecardsTemp = apexChartOptions.ecards;
      let data = [
        rrData?.birthdayECardsCount ? rrData?.birthdayECardsCount : 0,
        rrData?.anniversaryECardsCount ? rrData?.anniversaryECardsCount : 0,
        rrData?.appreciationECardsCount ? rrData?.appreciationECardsCount : 0,
        rrData?.seasonalECardsCount ? rrData?.seasonalECardsCount : 0,
      ];

      ecardsTemp['labels'] = [
        t(`dashboard.Birthday`),
        t(`dashboard.Anniversary`),
        t(`dashboard.Kudos`),
        t(`dashboard.Seasonal`),
      ];
      ecardsTemp['series'] = data;
      //   {
      //   name: 'E-Cards',
      //   data: [
      //       rrData?.birthdayECardsCount ? ['Birthday', rrData?.birthdayECardsCount] : [],
      //       rrData?.anniversaryECardsCount ? ['Anniversary', rrData?.anniversaryECardsCount] : [],
      //       rrData?.appreciationECardsCount ? ['Kudos', rrData?.appreciationECardsCount] : [],
      //       rrData?.seasonalECardsCount ? ['Seasonal', rrData?.seasonalECardsCount] : []
      //   ]
      // }
      //setEcardChart({...ecardsTemp});
      rrData.birthdayECardsCount > 0 ||
      rrData.anniversaryECardsCount > 0 ||
      rrData.appreciationECardsCount > 0 ||
      rrData.seasonalECardsCount > 0
        ? setEcardChart({ ...ecardsTemp })
        : setEcardChart({});
      // E-Cards Chart End

      // Certificate Chart Start
      let certificateTemp = apexChartOptions.certificate;
      const values =
        rrData.categorizedCertificateCount &&
        Object.keys(rrData.categorizedCertificateCount).length > 0
          ? Object.values(rrData.categorizedCertificateCount)
          : [];

      // certificateTemp["labels"] =
      //   Object.keys(rrData.categorizedCertificateCount).length > 0
      //     ? Object.keys(rrData?.categorizedCertificateCount)
      //     : [];
      //certificateTemp['series'] = values;
      certificateTemp.xaxis.categories =
        Object.keys(rrData.categorizedCertificateCount).length > 0
          ? Object.keys(rrData?.categorizedCertificateCount)
          : [];
      //certificateTemp.series.data = values;
      certificateTemp.series = [
        {
          data: values,
        },
      ];

      Object.keys(rrData.categorizedCertificateCount).length > 0
        ? setCertificateChart({ ...certificateTemp })
        : setCertificateChart({});
      // Certificate Chart End

      // Badge Chart Start
      let badgeTemp = apexChartOptions.badge;
      const badgeValue =
        rrData.categorizedBadgeCount &&
        Object.keys(rrData.categorizedBadgeCount).length > 0
          ? Object.values(rrData.categorizedBadgeCount)
          : [];
      badgeTemp['labels'] =
        Object.keys(rrData.categorizedBadgeCount).length > 0
          ? Object.keys(rrData?.categorizedBadgeCount)
          : [];
      badgeTemp['series'] = badgeValue;
      Object.keys(rrData.categorizedBadgeCount).length > 0
        ? setBadgeChart({ ...badgeTemp })
        : setBadgeChart({});
      // Badge Chart End

      // Award Chart Start
      let awardTemp = apexChartOptions.awards;
      let spotAwardArr = [];
      let nomiAwardArr = [];

      Object.keys(rrData['categorizedAwardCount']).forEach(function (key) {
        if (key === 'spot_award') {
          spotAwardArr.push(rrData['categorizedAwardCount'][key]); // push the correct value
        }
        if (key === 'nomi_award') {
          nomiAwardArr.push(rrData['categorizedAwardCount'][key]); // push the correct value
        }
      });
      awardTemp['series'] = [
        {
          name: 'Spot Awards',
          data: spotAwardArr,
        },
        {
          name: 'Nomination Awards',
          data: nomiAwardArr,
        },
      ];
      Object.keys(rrData['categorizedAwardCount']).length > 0
        ? setAwardChart({ ...awardTemp })
        : setAwardChart({});
      // Award Chart End
    }

    return () => {
      setLoginChart({});
      setRecognitionChart({});
      setEcardChart({});
      setCertificateChart({});
      setBadgeChart({});
      setAwardChart({});
    };
  }, [rrData]);

  return (
    <React.Fragment>
      <PageHeader
        title={t(`dashboard.Organization Stats`)}
        filter={
          <TypeBasedFilter
            config={TYPE_BASED_FILTER_WITH_BETWEEN_DATES}
            getFilterParams={getFilterParams}
          />
        }
      />
      <div className="py-4">
        {isLoading ? (
          <Isloading />
        ) : (
          <div
            className="row m-0"
            id="content-start"
          >
            <div className="col-md-12">
              {/* <!-- Layer 1 START --> */}
              <div className="d_rewards_recog_div">
                <div className="col-xs-12 col-md-4 col-lg-3 col-xl-2 d_rewards_dtls">
                  <div className="card border-left-primary shadow h-100 py-0">
                    <div className="card-body p-3">
                      <div className="row no-gutters align-items-center">
                        <div className="col">
                          <div className="mb-2 text-capitalize">
                            {t(`dashboard.Users`)}( {t(`dashboard.Logged in`)})
                          </div>
                          <div className="d_recog_count">
                            <p className="mb-0 text-primary">
                              {rrData && rrData?.loginUserCount
                                ? rrData?.loginUserCount
                                : 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-md-4 col-lg-3 col-xl-2 d_rewards_dtls">
                  <div className="card eep-border-left-succ shadow h-100 py-0">
                    <div className="card-body p-3">
                      <div className="row no-gutters align-items-center">
                        <div className="col">
                          <div className="mb-2 text-capitalize">
                            {t(`dashboard.Recognition`)}
                          </div>
                          <div className="d_recog_count">
                            <p className="mb-0 eep-text-succ">
                              {rrData && rrData?.recognitionTotal
                                ? rrData?.recognitionTotal
                                : 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-md-4 col-lg-3 col-xl-2 d_rewards_dtls">
                  <div className="card eep-border-left-info shadow h-100 py-0">
                    <div className="card-body p-3">
                      <div className="row no-gutters align-items-center">
                        <div className="col">
                          <div className="mb-2 text-capitalize">
                            {t(`dashboard.E-Cards`)}
                          </div>
                          <div className="d_recog_count">
                            <p className="mb-0 eep-text-info">
                              {rrData && rrData?.eCardsCount
                                ? rrData?.eCardsCount
                                : 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-md-4 col-lg-3 col-xl-2 d_rewards_dtls">
                  <div className="card eep-border-left-warn shadow h-100 py-0">
                    <div className="card-body p-3">
                      <div className="row no-gutters align-items-center">
                        <div className="col">
                          <div className="mb-2 text-capitalize">
                            {t(`dashboard.Certificates`)}
                          </div>
                          <div className="d_recog_count">
                            <p className="mb-0 eep-text-warn">
                              {rrData && rrData?.certificateCount
                                ? rrData?.certificateCount
                                : 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-md-4 col-lg-3 col-xl-2 d_rewards_dtls">
                  <div className="card eep-border-left-light-grey shadow h-100 py-0">
                    <div className="card-body p-3">
                      <div className="row no-gutters align-items-center">
                        <div className="col">
                          <div className="mb-2 text-capitalize">
                            {t(`dashboard.Badges`)}
                          </div>
                          <div className="d_recog_count">
                            <p className="mb-0 eep-text-light-grey">
                              {rrData && rrData?.badgeCount
                                ? rrData?.badgeCount
                                : 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-md-4 col-lg-3 col-xl-2 d_rewards_dtls">
                  <div className="card eep-border-left-primary shadow h-100 py-0">
                    <div className="card-body p-3">
                      <div className="row no-gutters align-items-center">
                        <div className="col">
                          <div className="mb-2 text-capitalize">
                            {t(`dashboard.Awards`)}
                          </div>
                          <div className="d_recog_count">
                            <p className="mb-0 eep-text-primary">
                              {rrData && rrData?.awardCount
                                ? rrData?.awardCount
                                : 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- Layer 1 END --> */}

              <div className="row">
                <div className="col-md-6 d_charts_div row_col_div">
                  <div className="bg-white shadow br-15 h-100">
                    <div className="p-3">
                      <label className="d_sect_lbl">
                        {t(`dashboard.Logged in`)}
                      </label>
                      {Object.keys(loginChart).length > 0 && (
                        <DashboardCharts
                          chartType="login"
                          chartData={loginChart}
                        />
                      )}
                      {Object.keys(loginChart).length <= 0 && (
                        <div
                          className="parent_div"
                          style={{ marginTop: '14vh', height: '200px' }}
                        >
                          <div className="eep_blank_div">
                            <img
                              src={
                                process.env.PUBLIC_URL +
                                '/images/icons/static/noData.svg'
                              }
                              alt="no-data-icon"
                            />
                            <p className="eep_blank_quote">
                              {t(`dashboard.No records found`)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 d_charts_div row_col_div">
                  <div className="bg-white shadow br-15 h-100">
                    <div className="p-3">
                      <label className="d_sect_lbl">
                        {t(`dashboard.Holistic Recognition`)}
                      </label>
                      {Object.keys(recognitionChart).length > 0 && (
                        <DashboardCharts
                          chartType="recognition"
                          chartData={recognitionChart}
                        />
                      )}
                      {Object.keys(recognitionChart).length <= 0 && (
                        <div
                          className="parent_div"
                          style={{ marginTop: '14vh', height: '200px' }}
                        >
                          <div className="eep_blank_div">
                            <img
                              src={
                                process.env.PUBLIC_URL +
                                '/images/icons/static/noData.svg'
                              }
                              alt="no-data-icon"
                            />
                            <p className="eep_blank_quote">
                              {t(`dashboard.No records found`)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* <div className="col-md-6 d_charts_div row_col_div">
                <div className="bg-white shadow br-15 h-100">
                  <div className="p-3">
                    <label className="d_sect_lbl">
                      {t(`dashboard.Certificates`)}
                    </label>
                    {Object.keys(certificateChart).length > 0 && (
                      <DashboardCharts
                        chartType="certificate"
                        chartData={certificateChart}
                      />
                    )}
                    {Object.keys(certificateChart).length <= 0 && (
                      <div
                        className="parent_div"
                        style={{ marginTop: "14vh", height: "200px" }}
                      >
                        <div className="eep_blank_div">
                          <img
                            src={
                              process.env.PUBLIC_URL +
                              "/images/icons/static/noData.svg"
                            }
                            alt="no-data-icon"
                          />
                          <p className="eep_blank_quote">
                            {" "}
                            {t(`dashboard.No records found`)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div> */}
                <div className="col-md-6 d_charts_div row_col_div">
                  <div className="bg-white shadow br-15 h-100">
                    <div className="p-3">
                      <label className="d_sect_lbl">
                        {' '}
                        {t(`dashboard.Badges`)}{' '}
                      </label>
                      {Object.keys(badgeChart).length > 0 && (
                        <DashboardCharts
                          chartType="badge"
                          chartData={badgeChart}
                        />
                      )}
                      {Object.keys(badgeChart).length <= 0 && (
                        <div
                          className="parent_div"
                          style={{ marginTop: '14vh', height: '200px' }}
                        >
                          <div className="eep_blank_div">
                            <img
                              src={
                                process.env.PUBLIC_URL +
                                '/images/icons/static/noData.svg'
                              }
                              alt="no-data-icon"
                            />
                            <p className="eep_blank_quote">
                              {' '}
                              {t(`dashboard.No records found`)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 d_charts_div row_col_div">
                  <div className="bg-white shadow br-15 h-100">
                    <div className="p-3">
                      <label className="d_sect_lbl">
                        {' '}
                        {t(`dashboard.Awards`)}
                      </label>
                      {Object.keys(awardChart).length > 0 && (
                        <DashboardCharts
                          chartType="awards"
                          chartData={awardChart}
                        />
                      )}
                      {Object.keys(awardChart).length <= 0 && (
                        <div
                          className="parent_div"
                          style={{ marginTop: '14vh', height: '200px' }}
                        >
                          <div className="eep_blank_div">
                            <img
                              src={
                                process.env.PUBLIC_URL +
                                '/images/icons/static/noData.svg'
                              }
                              alt="no-data-icon"
                            />
                            <p className="eep_blank_quote">
                              {' '}
                              {t(`dashboard.No records found`)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-1 col-md-12 d_charts_div row_col_div">
                  <div className="bg-white shadow br-15 h-100">
                    <div className="p-3">
                      <label className="d_sect_lbl">
                        {t(`dashboard.Certificates`)}
                      </label>
                      {Object.keys(certificateChart).length > 0 && (
                        <DashboardCharts
                          chartType="certificate"
                          chartData={certificateChart}
                        />
                      )}
                      {Object.keys(certificateChart).length <= 0 && (
                        <div
                          className="parent_div"
                          style={{ marginTop: '14vh', height: '200px' }}
                        >
                          <div className="eep_blank_div">
                            <img
                              src={
                                process.env.PUBLIC_URL +
                                '/images/icons/static/noData.svg'
                              }
                              alt="no-data-icon"
                            />
                            <p className="eep_blank_quote">
                              {' '}
                              {t(`dashboard.No records found`)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 d_charts_div row_col_div">
                  <div className="bg-white shadow br-15 h-100">
                    <div className="p-3">
                      <label className="d_sect_lbl">
                        {t(`dashboard.E-Cards`)}
                      </label>
                      {Object.keys(ecardChart).length > 0 && (
                        <DashboardCharts
                          chartType="ecards"
                          chartData={ecardChart}
                        />
                      )}
                      {Object.keys(ecardChart).length <= 0 && (
                        <div
                          className="parent_div"
                          style={{ marginTop: '14vh', height: '200px' }}
                        >
                          <div className="eep_blank_div">
                            <img
                              src={
                                process.env.PUBLIC_URL +
                                '/images/icons/static/noData.svg'
                              }
                              alt="no-data-icon"
                            />
                            <p className="eep_blank_quote">
                              {t(`dashboard.No records found`)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* <div className="col-md-6 d_charts_div row_col_div">
                <div className="bg-white shadow br-15 h-100">
                  <div className="p-3">
                    <label className="d_sect_lbl">Rewards</label>
                    {true && 
                      <DashboardCharts chartType="login"/>
                    }
                    {false &&
                      <div className="parent_div">
                        <div className="eep_blank_div">
                          <img src={process.env.PUBLIC_URL + "/images/icons/static/noData.svg"} alt="no-data-icon" />
                          <p className="eep_blank_quote">No records found</p>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};
export default RewardsRecognition;
