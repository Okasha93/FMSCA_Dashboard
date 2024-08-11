import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Box } from '@mui/material';

interface PivotChartProps {
  pivotData: Array<{ key: string; total: number; count: number }>;
  rowField: string;
}

const PivotChart: React.FC<PivotChartProps> = ({ pivotData, rowField }) => {
  const chartData = useMemo(() => ({
    labels: pivotData.map((row) => row.key),
    datasets: [
      {
        label: `Total by ${rowField}`,
        data: pivotData.map((row) => row.total),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  }), [pivotData, rowField]);

  return (
    <Box sx={{ width: '100%', height: 700 }}>
      <Bar data={chartData} />
    </Box>
  );
};

export default PivotChart;
