import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { merge } from 'lodash';

import ReactApexChart from 'react-apexcharts'; // material
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { Card, CardHeader, Box, Button } from '@material-ui/core'; //

import Cookies from 'js-cookie';
import { BaseOptionChart } from '../../charts'; // ----------------------------------------------------------------------

import statisticsApi from '../../../api/statistics';

const useStyles = makeStyles({
  daterange: {
    margin: '10px 0 0 1000px '
  }
});
function AppRevenueChart() {
  const classes = useStyles();
  const [chartData, setChartData] = useState([]);
  const [value, onChange] = useState([new Date(), new Date()]);
  const [filterDate, setFilterDate] = useState({
    from: 1635206400000, // 26/10/2021
    to: 1635638400000 // 31/10/2021
  });
  const token = Cookies.get('tokenUser');
  console.log(value[0], value[1]);
  useEffect(() => {
    async function getChartData() {
      const res = await statisticsApi.getStatistics(filterDate.from, filterDate.to, token);
      console.log(res.data);
      setChartData(res.data);
      console.log(chartData);
    }
    getChartData();
  }, [filterDate]);
  const formatIsoStringToDate = (data) => {
    const date = new Date(data);
    const year = date.getFullYear();
    const time = date.toLocaleTimeString(
      ('en', { timeStyle: 'short', hour12: false, timeZone: 'UTC' })
    );
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
      dt = `0${dt}`;
    }
    if (month < 10) {
      month = `0${month}`;
    }
    const object = `${dt}/${month}/${year}`;
    return object;
  };

  const newChart = chartData.map((x) => x.revenue);
  const newDate = chartData.map((x) => formatIsoStringToDate(x.day));

  const clickFilter = () => {
    const obj = {
      from: value[0].getTime() + 25200000,
      to: value[1].getTime()
    };
    console.log(obj);
    setFilterDate(obj);
    console.log(filterDate);
  };
  const CHART_DATA = [
    {
      name: 'Revenue',
      type: 'column',
      // chart data
      data: newChart
    }
  ];
  const chartOptions = merge(BaseOptionChart(), {
    stroke: {
      width: [5]
    },
    plotOptions: {
      bar: {
        columnWidth: '30%',
        borderRadius: 0
      }
    },
    fill: {
      type: ['solid']
    },
    // chart date
    labels: newDate,
    xaxis: {
      type: 'date'
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)} `;
          }

          return y;
        }
      }
    }
  });
  return (
    <Card>
      <DateRangePicker className={classes.daterange} onChange={onChange} value={value} />
      <Button
        onClick={() => {
          clickFilter();
        }}
      >
        Filter
      </Button>
      <CardHeader title="Revenue 2021" subheader="Unit: VNĐ" />
      <Box
        sx={{
          p: 3,
          pb: 1
        }}
        dir="ltr"
      >
        <ReactApexChart type="line" series={CHART_DATA} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}

export { AppRevenueChart as default };
