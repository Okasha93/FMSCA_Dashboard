import React, { useState, useMemo } from 'react';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Box, TextField } from '@mui/material';

interface DataTableProps {
  data: {
    id: number;
    entity_type: string;
    operating_status: string;
    usdot_number: string;
    mcs_150_form_date: string;
    out_of_service_date: string;
    record_status: string;
    power_units: number;
  }[];
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70, sortable: true, filterable: true },
  { field: 'entity_type', headerName: 'Entity Type', width: 150, sortable: true, filterable: true },
  { field: 'operating_status', headerName: 'Operating Status', width: 180, sortable: true, filterable: true },
  { field: 'usdot_number', headerName: 'USDOT Number', width: 150, sortable: true, filterable: true },
  { field: 'mcs_150_form_date', headerName: 'MCS-150 Form Date', width: 180, sortable: true, filterable: true },
  { field: 'out_of_service_date', headerName: 'Out of Service Date', width: 180, sortable: true, filterable: true },
  { field: 'record_status', headerName: 'Record Status', width: 150, sortable: true, filterable: true },
  { field: 'power_units', headerName: 'Power Units', width: 120, sortable: true, filterable: true },
  { field: 'created_dt', headerName: 'Created Dt', width: 150, sortable: true, filterable: true },
  { field: 'data_source_modified_dt', headerName: 'Data Source', width: 120, sortable: true, filterable: true },
  { field: 'legal_name', headerName: 'Legal Name', width: 120, sortable: true, filterable: true },
  { field: 'dba_name', headerName: 'dba_name', width: 120, sortable: true, filterable: true },
  { field: 'physical_address', headerName: 'Physical Address', width: 120, sortable: true, filterable: true },
  { field: 'p_street', headerName: 'P Street', width: 120, sortable: true, filterable: true },
  { field: 'p_city', headerName: 'P City', width: 120, sortable: true, filterable: true },
  { field: 'p_state', headerName: 'P State', width: 120, sortable: true, filterable: true },
  { field: 'p_zip_code', headerName: 'P Zip Code', width: 120, sortable: true, filterable: true },
  { field: 'phone', headerName: 'Phone', width: 120, sortable: true, filterable: true },
  { field: 'mailing_address', headerName: 'Mailing Address', width: 120, sortable: true, filterable: true },
  { field: 'm_street', headerName: 'M Street', width: 120, sortable: true, filterable: true },
  { field: 'm_city', headerName: 'M City', width: 120, sortable: true, filterable: true },
  { field: 'm_state', headerName: 'M State', width: 120, sortable: true, filterable: true },
  { field: 'm_zip_code', headerName: 'M Zip Code', width: 120, sortable: true, filterable: true },
  { field: 'mc_mx_ff_number', headerName: 'mc mx ff number', width: 120, sortable: true, filterable: true },
  { field: 'state_carrier_id_number', headerName: 'State Carrier', width: 120, sortable: true, filterable: true },
  { field: 'duns_number', headerName: 'Duns Number', width: 120, sortable: true, filterable: true },
  { field: 'drivers', headerName: 'Drivers', width: 120, sortable: true, filterable: true },
  { field: 'mcs_150_mileage_year', headerName: 'MCS 150', width: 120, sortable: true, filterable: true },
  { field: 'credit_score', headerName: 'Credit Score', width: 120, sortable: true, filterable: true },
];

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter data based on search query
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      Object.values(row).some((value) =>
        value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [data, searchQuery]);

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    setPageSize(model.pageSize);
  };

  return (
    <Box
      sx={{
        height: { xs: 'auto', md: 770 },
        width: '100%',
        padding: 2,
        paddingBottom: 10,
        backgroundColor: 'white',
        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
        borderRadius: 4,
      }}
    >
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        sx={{
          marginBottom: 2,
          width: { xs: '100%', sm: '30%' },
          alignSelf: 'flex-start',
        }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <DataGrid
        rows={filteredData}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: pageSize,
            },
          },
        }}
        onPaginationModelChange={handlePaginationModelChange}
        pagination
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
            backgroundColor: 'white',
            borderRadius: 2,
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#1E3A8A',
            color: 'blue',
          },
          '& .MuiDataGrid-row': {
            backgroundColor: '#F3F4F6',
          },
          '& .MuiDataGrid-cell': {
            padding: '8px',
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: '#F3F4F6',
          },
        }}
      />
    </Box>
  );
};

export default DataTable;
