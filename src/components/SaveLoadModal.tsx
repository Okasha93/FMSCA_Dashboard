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
      <Box sx={{ padding: 4, backgroundColor: 'white', margin: 'auto', width: 300, borderRadius: 4 }}>
        <Typography variant="h6" gutterBottom>Save/Load View</Typography>
        <TextField
          label="View Name"
          fullWidth
          value={viewName}
          onChange={(e) => setViewName(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <Button variant="contained" onClick={handleSave} fullWidth>Save</Button>
        <Typography variant="subtitle1" sx={{ marginTop: 2 }}>Saved Views:</Typography>
        {savedViews.map((name) => (
          <Button key={name} onClick={() => handleLoad(name)} fullWidth>
            {name}
          </Button>
        ))}
      </Box>
    </Modal>
  );
};

export default SaveLoadModal;
