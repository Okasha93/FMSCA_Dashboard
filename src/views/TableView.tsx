import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import DataTable from '../components/DataTable';
import Chart from '../components/Chart';
import SaveLoadModal from '../components/SaveLoadModal';
import { useNavigate, useLocation } from 'react-router-dom';

const TableView: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [labelField, setLabelField] = useState<string>('entity_type');
  const [valueField, setValueField] = useState<string>('power_units');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [savedViews, setSavedViews] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

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

  // Updated useEffect to use useLocation hook
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const config = params.get('config');
    if (config) {
      const decodedConfig = JSON.parse(decodeURIComponent(config));
      setLabelField(decodedConfig.labelField);
      setValueField(decodedConfig.valueField);
    }
  }, [location.search]);

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
  
  const loadConfig = (viewName: string) => {
    const savedConfig = localStorage.getItem(viewName);
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setLabelField(config.labelField);
      setValueField(config.valueField);
    }
  };

  const shareTableSetup = () => {
    const config = {
      labelField,
      valueField,
    };
    const encodedConfig = encodeURIComponent(JSON.stringify(config));
    const newUrl = `${window.location.origin}${window.location.pathname}?config=${encodedConfig}`;
    
    // Copy the new URL to the clipboard
    navigator.clipboard.writeText(newUrl)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy the link: ', err);
      });
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
        <CircularProgress size={150} />
      </Box>
    );
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
          Share Link
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
