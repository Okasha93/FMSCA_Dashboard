import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, CircularProgress } from '@mui/material';
import PivotTable from '../components/PivotTable';
import PivotChart from '../components/PivotChart';

const PivotTableView: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [pivotData, setPivotData] = useState<any[]>([]);
  const [rowField, setRowField] = useState<string>('entity_type');
  const [valueField, setValueField] = useState<string>('power_units');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/FMSCA_records.json')
      .then((response) => {
        setData(response.data);
        setLoading(false);
      });
  }, []);

  const handlePivotDataChange = (newPivotData: any[]) => {
    setPivotData(newPivotData);
  };

  const handleRowFieldChange = (field: string) => {
    setRowField(field);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ padding: 2 }}>
      <PivotTable 
        data={data}
        rowField={rowField}
        valueField={valueField}
        onRowFieldChange={handleRowFieldChange}
        onPivotDataChange={handlePivotDataChange} 
      />
      <Box sx={{ marginTop: 4 }}>
        <PivotChart pivotData={pivotData} rowField={rowField} />
      </Box>
    </Box>
  );
};

export default PivotTableView;
