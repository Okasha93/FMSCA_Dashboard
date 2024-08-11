import React, { useState } from 'react';
import { Box, Button, Modal, Typography, TextField } from '@mui/material';

interface SaveLoadModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  onLoad: (name: string) => void;
  savedViews: string[];
}

const SaveLoadModal: React.FC<SaveLoadModalProps> = ({ open, onClose, onSave, onLoad, savedViews }) => {
  const [viewName, setViewName] = useState('');

  const handleSave = () => {
    if (viewName.trim() !== '') {
      onSave(viewName);
      setViewName('');
      onClose();
    }
  };

  const handleLoad = (name: string) => {
    onLoad(name);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ padding: 4, backgroundColor: 'white', margin: 'auto', width: 400, borderRadius: 4, boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)' }}>
        <Typography variant="h6" gutterBottom>Save/Load View</Typography>
        <TextField
          label="View Name"
          fullWidth
          value={viewName}
          onChange={(e) => setViewName(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <Button variant="contained" onClick={handleSave} fullWidth sx={{ marginBottom: 2 }}>Save</Button>
        <Typography variant="subtitle1" sx={{ marginTop: 2 }}>Saved Views:</Typography>
        {savedViews.map((name) => (
          <Button key={name} onClick={() => handleLoad(name)} fullWidth sx={{ textTransform: 'none', marginBottom: 1 }}>
            {name}
          </Button>
        ))}
      </Box>
    </Modal>
  );
};

export default SaveLoadModal;
