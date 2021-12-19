import { useState, useEffect } from 'react';
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import Cookies from 'js-cookie';
// material
import { useTheme, styled } from '@material-ui/core/styles';
import { Card, CardHeader } from '@material-ui/core';
// utils
import { fNumber } from '../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../charts';
import statisticsApi from '../../../api/statistics';
// ----------------------------------------------------------------------

const CHART_HEIGHT = 395;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible'
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`
  }
}));

// ----------------------------------------------------------------------

export default function AppCurrentVisits() {
  const theme = useTheme();

  const [CHART_DATA, setChartData] = useState([]);
  const token = Cookies.get('tokenUser');
  useEffect(() => {
    async function getDataPieChart() {
      statisticsApi
        .getDataPieChart(token)
        .then((response) => {
          console.log(response.data);
          const arr = [];
          response.data.forEach((data) => {
            arr.push(data.totalOrders);
          });
          setChartData(arr);
        })
        .catch((erorr) => {
          if (erorr.response) {
            console.log('get data failed', erorr.response);
          }
        });
    }
    getDataPieChart();
  }, []);
  const chartOptions = merge(BaseOptionChart(), {
    colors: [theme.palette.info.main, theme.palette.error.main],
    labels: ['Direct', 'Online'],
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      shared: true,
      fillSeriesColor: false,
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `#${seriesName}`
        }
      }
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } }
    }
  });

  return (
    <Card>
      <CardHeader title="Order Payment Rate" />
      <ChartWrapperStyle dir="ltr">
        <ReactApexChart type="pie" series={CHART_DATA} options={chartOptions} height={280} />
      </ChartWrapperStyle>
    </Card>
  );
}
