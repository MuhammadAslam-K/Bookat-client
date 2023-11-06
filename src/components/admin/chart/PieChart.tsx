import React from 'react';
import { PieChart as MinimalPieChart } from 'react-minimal-pie-chart';

interface PieChartProps {
    data: { title: string; value: number; color: string }[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
    return (
        <div className="w-64 h-64">
            <MinimalPieChart
                data={data}
                lineWidth={20}
                label={({ dataEntry }) => dataEntry.title}
                labelPosition={65}
                labelStyle={{
                    fontSize: '5px',
                    fill: '#fff',
                }}
                startAngle={90}
            />
        </div>
    );
};


export default PieChart;