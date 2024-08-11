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
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress size={150}/>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4, backgroundColor: '#F3F4F6', borderRadius: 4, boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)' }}>
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
