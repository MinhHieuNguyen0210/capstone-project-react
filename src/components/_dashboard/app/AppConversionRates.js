import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Box, Card, CardHeader } from '@material-ui/core';
// utils
import { fNumber } from '../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../charts';

// ----------------------------------------------------------------------

const CHART_DATA = [{ name: 'quanity', data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200] }];
const categoriesData = [
  'Cà phê đá xay',
  'Bông lan trứng muối',
  'Caramel Machiato',
  'Cơm',
  'Bún',
  'Phở',
  'Cold Brew',
  'Truyền thống',
  'Phúc bồn tử'
];

export default function AppConversionRates() {
  const chartOptions = merge(BaseOptionChart(), {
    tooltip: {
      marker: { show: false },
      y: {
        // formatter: (seriesName) => fNumber(seriesName),
        title: {
          // formatter: (seriesName) => `${seriesName}`
        }
      }
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: '40%', borderRadius: 2 }
    },
    xaxis: {
      categories: categoriesData
    }
  });

  return (
    <Card>
      <CardHeader title="Product Statictics Sold" subheader="Unit" />
      <Box sx={{ mx: 3 }} dir="ltr">
        <ReactApexChart type="bar" series={CHART_DATA} options={chartOptions} height={400} />
      </Box>
    </Card>
  );
}
