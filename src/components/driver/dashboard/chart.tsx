// import React from 'react';
// import { Bar } from 'react-chartjs-2';

// // interface Ride {
// //     date: string;
// //     price: number;
// // }

// interface ScheduledRidesChartProps {
//     rideDates: string[];
//     ridePrices: number[];
// }


// const ScheduledRidesChart: React.FC<ScheduledRidesChartProps> = ({ rideDates, ridePrices }) => {
// //

//     const chartData = {
//         labels: rideDates,
//         datasets: [
//             {
//                 label: 'Scheduled Rides',
//                 data: ridePrices,
//                 backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                 borderColor: 'rgba(75, 192, 192, 1)',
//                 borderWidth: 1,
//             },
//         ],
//     };

//     const chartOptions = {
//         scales: {
//             x: {
//                 type: 'category' as const,
//                 labels: rideDates,
//             },
//             y: {
//                 beginAtZero: true,
//             },
//         },
//     };

//     return <Bar data={chartData} options={chartOptions} />;
// };

// export default ScheduledRidesChart;
