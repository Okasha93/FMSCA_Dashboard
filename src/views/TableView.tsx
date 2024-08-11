import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import DataTable from '../components/DataTable';
import Chart from '../components/Chart';
import SaveLoadModal from '../components/SaveLoadModal';
import { useHistory } from 'react-router-dom';

const TableView: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [labelField, setLabelField] = useState<string>('entity_type');
  const [valueField, setValueField] = useState<string>('power_units');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [savedViews, setSavedViews] = useState<string[]>([]);
  const history = useHistory();

  useEffect(() => {
    axios
      .get('/FMSCA_records.json')
      .then((response) => {
        setData(response.data);
        setLoading(false);
      });

    const views = localStorage.getItem('savedViews');
    if (views) {
      setSavedViews(JSON.parse(views));
    }
  }, []);

  useEffect(() => {
    const savedConfig = localStorage.getItem('tableConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setLabelField(config.labelField);
      setValueField(config.valueField);
    }
  }, []);

  const saveConfig = (viewName?: string) => {
    const config = {
      labelField,
      valueField,
    };
    const configName = viewName || `Config_${Date.now()}`;
    localStorage.setItem(configName, JSON.stringify(config));
    if (viewName && !savedViews.includes(viewName)) {
      setSavedViews([...savedViews, viewName]);
      localStorage.setItem('savedViews', JSON.stringify([...savedViews, viewName]));
    }
  };

  const resetConfig = () => {
    localStorage.removeItem('tableConfig');
    setLabelField('entity_type');
    setValueField('power_units');
  };

  const shareTableSetup = () => {
    const config = {
      labelField,
      valueField,
    };
    const encodedConfig = encodeURIComponent(JSON.stringify(config));
    history.push(`?config=${encodedConfig}`);
  };

  const loadConfig = (viewName: string) => {
    const savedConfig = localStorage.getItem(viewName);
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setLabelField(config.labelField);
      setValueField(config.valueField);
    }
  };
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const config = params.get('config');
    if (config) {
      const decodedConfig = JSON.parse(decodeURIComponent(config));
      setLabelField(decodedConfig.labelField);
      setValueField(decodedConfig.valueField);
    }
  }, []);
  
  if (loading) {
    return <CircularProgress />;
  }
  
  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 4 },
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
      }}
    >
      <Typography variant="h4" gutterBottom>
        FMSCA Dashboard
        </Typography>
      <DataTable data={data} />
      <Box sx={{ marginTop: 4 }}>
        <Chart
          data={data}
          labelField={labelField}
          valueField={valueField}
          onLabelFieldChange={setLabelField}
          onValueFieldChange={setValueField}
        />
      </Box>
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
          Save/Load Views
        </Button>
        <Button variant="outlined" color="secondary" onClick={resetConfig}>
          Reset to Default
        </Button>
        <Button variant="contained" color="primary" onClick={shareTableSetup}>
          Generate Shareable Link
        </Button>
      </Box>
      <SaveLoadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={saveConfig}
        onLoad={loadConfig}
        savedViews={savedViews}
      />
    </Box>
  );
  };
  
  export default TableView;