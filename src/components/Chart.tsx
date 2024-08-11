import React, { useState, useEffect, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography,
} from '@mui/material';
import _ from 'lodash';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  data: any[];
  labelField: string;
  valueField: string;
  onLabelFieldChange: (field: string) => void;
  onValueFieldChange: (field: string) => void;
}

const Chart: React.FC<ChartProps> = ({ data, labelField, valueField, onLabelFieldChange, onValueFieldChange }) => {
  const [chartData, setChartData] = useState<any>({});
  const [editableValues, setEditableValues] = useState<number[]>([]);

  const handleLabelFieldChange = (event: SelectChangeEvent<string>) => {
    onLabelFieldChange(event.target.value as string);
  };

  const handleValueFieldChange = (event: SelectChangeEvent<string>) => {
    onValueFieldChange(event.target.value as string);
  };

  const handleEditChange = (index: number, value: number) => {
    const updatedValues = [...editableValues];
    updatedValues[index] = value;
    setEditableValues(updatedValues);
    saveChartData(updatedValues);
  };

  const saveChartData = (values: number[]) => {
    const savedData = {
      labels: chartData.labels,
      datasets: [{
        ...chartData.datasets[0],
        data: values,
      }],
    };
    localStorage.setItem('chartData', JSON.stringify(savedData));
    setChartData(savedData);
  };

  const computedChartData = useMemo(() => {
    if (data.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const labels: string[] = [];
    const chartValues: number[] = [];

    data.forEach((row) => {
      const label = row[labelField];
      const value = row[valueField];

      if (label && value) {
        if (labels.includes(label)) {
          chartValues[labels.indexOf(label)] += Number(value);
        } else {
          labels.push(label);
          chartValues.push(Number(value));
        }
      }
    });

    setEditableValues(chartValues);

    return {
      labels,
      datasets: [
        {
          label: `Total ${valueField} by ${labelField}`,
          data: chartValues,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  }, [data, labelField, valueField]);

  useEffect(() => {
    const savedChartData = localStorage.getItem('chartData');
    if (savedChartData) {
      setChartData(JSON.parse(savedChartData));
    } else {
      setChartData(computedChartData);
    }
  }, [computedChartData]);

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (!chartData.labels || !chartData.datasets || chartData.labels.length === 0 || chartData.datasets.length === 0) {
    return <Typography>No data available for the chart.</Typography>;
  }

  return (
    <Box sx={{ width: '100%', height: 700 }}>
      <Box sx={{ display: 'flex', gap: 3, marginBottom: 4 }}>
        <FormControl sx={{ minWidth: 150, marginTop: 7 }}>
          <InputLabel>Label Field</InputLabel>
          <Select value={labelField} onChange={handleLabelFieldChange}>
            {Object.keys(data[0] || {}).map((field) => (
              <MenuItem key={field} value={field}>
                {field}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150, marginTop: 7  }}>
          <InputLabel>Value Field</InputLabel>
          <Select value={valueField} onChange={handleValueFieldChange}>
            {Object.keys(data[0] || {}).map((field) => (
              <MenuItem key={field} value={field}>
                {field}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>


      <Bar data={chartData} options={options} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 10 }}>
        {editableValues.map((value, index) => (
          <TextField
            key={index}
            label={`Edit ${chartData.labels ? chartData.labels[index] : 'Value'}`}
            type="number"
            value={value}
            onChange={(e) => handleEditChange(index, Number(e.target.value))}
            fullWidth
          />
        ))}
      
      </Box>
    </Box>
  );
};

export default Chart;
