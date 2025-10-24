import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useTheme } from "../contexts/ThemeContext";

interface DataTableProps {
  columns: GridColDef[];
  rows: any[];
  getRowId?: (row: any) => string | number;
}

const paginationModel = { page: 0, pageSize: 10 };

export default function DataTable({ columns, rows, getRowId }: DataTableProps) {
  const { isDarkMode } = useTheme();

  return (
    <Paper 
      sx={{ 
        height: "82vh", 
        width: "100%",
        backgroundColor: 'background.paper',
        boxShadow: 'shadows.3',
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 20, 50, 100, 200]}
        getRowId={getRowId}
        sx={{
          border: 0,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            fontSize: '0.875rem',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid divider`,
            color: 'text.primary',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'action.hover',
          },
          '& .MuiTablePagination-root': {
            color: 'text.primary',
          },
        }}
      />
    </Paper>
  );
}