import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface BarChartProps {
    months: string[];
    userCounts: number[];
}

const BarChart: React.FC<BarChartProps> = ({ months, userCounts }) => {
    const chartData = {
        options: {
            chart: {
                id: 'basic-bar',
            },
            xaxis: {
                categories: months,
            },
        },
        series: [
            {
                name: '',
                data: userCounts,
            },
        ],
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <ReactApexChart
                options={chartData.options}
                series={chartData.series}
                type="bar"
                width="100%"
                height={350}
            />
        </div>
    );
};

export default BarChart;
