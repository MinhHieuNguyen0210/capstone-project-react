// import * as React from 'react';
// import Paper from '@material-ui/core/Paper';
// import {
//   Chart,
//   ArgumentAxis,
//   ValueAxis,
//   BarSeries,
//   Title,
//   PieSeries,
//   Legend
// } from '@devexpress/dx-react-chart-material-ui';
// import { withStyles } from '@material-ui/styles';
// import { Stack, Animation } from '@devexpress/dx-react-chart';

// const data1 = [
//   {
//     month: 'January',
//     budget: 29.956,
//     reality: 90.354
//   },
//   {
//     month: 'Feburary',
//     budget: 25.607,
//     reality: 55.793
//   },
//   {
//     month: 'March',
//     budget: 13.493,
//     reality: 48.983
//   },
//   {
//     month: 'April',
//     budget: 9.575,
//     reality: 43.363
//   },
//   {
//     month: 'May',
//     budget: 17.306,
//     reality: 30.223
//   },
//   {
//     month: 'June',
//     budget: 6.679,
//     reality: 28.638
//   },
//   {
//     month: 'July',
//     budget: 15,
//     reality: 25
//   },
//   {
//     month: 'August',
//     budget: 5,
//     reality: 19.622
//   },
//   {
//     month: 'September',
//     budget: 20,
//     reality: 30
//   },
//   {
//     month: 'October',
//     budget: 41,
//     reality: 53
//   },
//   {
//     month: 'November',
//     budget: 50,
//     reality: 69
//   },
//   {
//     month: 'December',
//     budget: 60,
//     reality: 72
//   }
// ];

// const data2 = [
//   { region: 'Asia', val: 4119626293 },
//   { region: 'Africa', val: 1012956064 },
//   { region: 'Northern America', val: 344124520 },
//   { region: 'Latin America and the Caribbean', val: 590946440 },
//   { region: 'Europe', val: 727082222 },
//   { region: 'Oceania', val: 35104756 }
// ];

// const legendStyles = () => ({
//   root: {
//     display: 'flex',
//     margin: 'auto',
//     flexDirection: 'row'
//   }
// });
// const legendRootBase = ({ classes, ...restProps }) => (
//   <Legend.Root {...restProps} className={classes.root} />
// );
// const Root = withStyles(legendStyles, { name: 'LegendRoot' })(legendRootBase);
// const legendLabelStyles = () => ({
//   label: {
//     whiteSpace: 'nowrap'
//   }
// });
// const legendLabelBase = ({ classes, ...restProps }) => (
//   <Legend.Label className={classes.label} {...restProps} />
// );
// const Label = withStyles(legendLabelStyles, { name: 'LegendLabel' })(legendLabelBase);

// export default class Demo extends React.PureComponent {
//   constructor(props) {
//     super(props);

//     this.state = {
//       data1
//     };
//   }

//   render() {
//     const { data1: chartData } = this.state;

//     return (
//       <Paper>
//         <Chart data={data1}>
//           <ArgumentAxis />
//           <ValueAxis />

//           <BarSeries name="Budget" valueField="budget" argumentField="month" color="#42A5F5" />
//           <BarSeries name="Reality" valueField="reality" argumentField="month" color="#FF7043" />
//           <Animation />
//           <Legend position="bottom" rootComponent={Root} labelComponent={Label} />
//           <Title text="Revenue 2021" />
//           <Stack />
//         </Chart>

//         <Chart data={data2}>
//           <PieSeries valueField="val" argumentField="region" innerRadius={0.6} />
//           <Title text="The Population of Continents and Regions" />
//           <Animation />
//         </Chart>
//       </Paper>
//     );
//   }
// }
