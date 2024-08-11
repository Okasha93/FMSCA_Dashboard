import React, { useEffect, useMemo, useState } from 'react';
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import _ from 'lodash';
import moment from 'moment';

interface PivotTableProps {
  data: any[];
  rowField: string;
  valueField: string;
  onRowFieldChange: (field: string) => void;
  onPivotDataChange: (pivotData: any[]) => void;
}

const PivotTable: React.FC<PivotTableProps> = ({ data, rowField, valueField, onRowFieldChange, onPivotDataChange }) => {
  const [dateGrouping, setDateGrouping] = useState<string>('none');

  const pivotData = useMemo(() => {
    if (data.length === 0) {
      return [];
    }

    let groupedData;
    if (rowField === 'mcs_150_form_date' || rowField === 'out_of_service_date') {
      groupedData = _.groupBy(data, (item) => {
        const date = moment(item[rowField]);
        switch (dateGrouping) {
          case 'year':
            return date.format('YYYY');
          case 'month':
            return date.format('YYYY-MM');
          case 'week':
            return date.format('YYYY-[W]WW');
          default:
            return date.format('YYYY-MM-DD');
        }
      });
    } else {
      groupedData = _.groupBy(data, rowField);
    }

    return _.map(groupedData, (items, key) => {
      const total = _.sumBy(items, (item) => {
        const value = item[valueField as keyof typeof item];
        return typeof value === 'number' ? value : 0;
      });
      return {
        key,
        total,
        count: items.length,
      };
    });
  }, [data, rowField, valueField, dateGrouping]);

  useEffect(() => {
    onPivotDataChange(pivotData);
  }, [pivotData, onPivotDataChange]);

  const handleRowFieldChange = (event: SelectChangeEvent<string>) => {
    onRowFieldChange(event.target.value);
  };

  const handleDateGroupingChange = (event: SelectChangeEvent<string>) => {
    setDateGrouping(event.target.value);
  };

  if (data.length === 0) {
    return <Typography>No data available for the pivot table.</Typography>;
  }

  return (
    <Box sx={{ padding: 2, backgroundColor: 'white', boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)', borderRadius: 4 }}>
      <Typography variant="h4" gutterBottom>
        FMSCA Pivot Table
      </Typography>
      <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Group By</InputLabel>
            <Select value={rowField} onChange={handleRowFieldChange}>
              {Object.keys(data[0] || {}).map((field) => (
                <MenuItem key={field} value={field}>
                  {field}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {['mcs_150_form_date', 'out_of_service_date'].includes(rowField) && (
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Date Grouping</InputLabel>
              <Select value={dateGrouping} onChange={handleDateGroupingChange}>
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="year">Year</MenuItem>
                <MenuItem value="month">Month</MenuItem>
                <MenuItem value="week">Week</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>

      <Box sx={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#1E3A8A', color: 'white' }}>Group</th>
              <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#1E3A8A', color: 'white' }}>Total</th>
              <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#1E3A8A', color: 'white' }}>Count</th>
            </tr>
          </thead>
          <tbody>
            {pivotData.map((row, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid black', padding: '8px', backgroundColor: '#F3F4F6' }}>{row.key}</td>
                <td style={{ border: '1px solid black', padding: '8px', backgroundColor: '#F3F4F6' }}>{row.total}</td>
                <td style={{ border: '1px solid black', padding: '8px', backgroundColor: '#F3F4F6' }}>{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
};

export default PivotTable;
