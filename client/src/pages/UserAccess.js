import * as React from 'react';
import { useTheme, Box , Button, Select} from "@mui/material";
import { DataGrid, GridToolbar, useGridApiContext } from '@mui/x-data-grid';
// import moment from 'moment/moment'
import UsersActions from './UsersActions';
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import PropTypes from "prop-types";

const SelectEditInputCell = (props) => {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();
  const [options, setOptions] = React.useState([]);

  React.useEffect(() => {
    const fetchOptions = async () => {
      const response = await fetch('http://localhost:8080/api/lnkuserprojects/getidandname');
      if (field === 'user_id') {
        // fetch options for user_id
        const json = await response.json();
        setOptions(json[0].result.users.map((user) => ({ value: user.id, label: user.name })));
      } else if (field === 'program_id') {
        // fetch options for program_id
        const json = await response.json();
        setOptions(json[0].result.programs.map((program) => ({ value: program.id, label: program.name })));
      } else if (field === 'project_id') {
        // fetch options for project_id
        const json = await response.json();
        console.log(json[0].result.projects,"jsonnnnnnnnnnnnnnn");
        setOptions(json[0].result.projects.map((project) => ({ value: project.id, label: project.name })));
      }
    };
    fetchOptions();
  }, [field]);

  const handleChange = async (event) => {
    await apiRef.current.setEditCellValue({
      id,
      field,
      value: event.target.value,
    });
    apiRef.current.stopCellEditMode({ id, field });
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      size="small"
      sx={{ height: 1 }}
      native
      autoFocus
    >
      {options.map((option) => (
        <option key={option.label} value={option.label}>
          {option.label}
        </option>
      ))}
    </Select>
  );
};

  SelectEditInputCell.propTypes = {
    /** he column field of the cell that triggered the event. */
    field: PropTypes.string.isRequired,
    /** The grid row id.  */
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    /** The cell value, If the column has `valueGetter`, use `params.row` to directly access the fields.*/
    value: PropTypes.any,
  };

  const renderSelectEditInputCell = (params) => {
    return <SelectEditInputCell {...params} />;
  };

const UserAccess = () => {
  const theme = useTheme();

  const [rows, setRows] = React.useState([]);

  const [rowId, setRowId] = React.useState(null);

  let pageTitle = "User Access";
  let pageSubTitle = "Access to User Permissions";

  React.useEffect(() => {
    fetch("http://localhost:8080/api/lnkuserprojects/getRowsandColumns")
      .then((res) => res.json())
      .then((data) => {
        // setColumns(data.columns);
        // setRows(data.rows);
        setRows(data.rows[0].result);
        console.log(data.rows[0].result,".................");
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);


  const columns = React.useMemo(()=>[
    {
        field: "id",
        headerName: "ID",
        type: "text",
        headerAlign: "center",
        width: 25,
        editable: false,
      },
      {
        field: "user_id",
        headerName: "User ID",
        type: "select",
        headerAlign: "center",
        renderEditCell: renderSelectEditInputCell,
        width: 170,
        editable: true,
      },
      {
        field: "program_id",
        headerName: "Program ID",
        type: "select",
        headerAlign: "center",
        renderEditCell: renderSelectEditInputCell,
        width: 170,
        editable: true,
      },
      {
        field: "project_id",
        headerName: "Project ID",
        type: "select",
        headerAlign: "center",
        renderEditCell: renderSelectEditInputCell,
        width: 170,
        editable: true,
        
      },
      {
        field: "read_role",
        headerName: "Read Role",
        type: "boolean",
        headerAlign: "center",
        width: 100,
        editable: true,
      },
      {
        field: "write_role",
        headerName: "Write Role",
        type: "boolean",
        headerAlign: "center",
        width: 100,
        editable: true,
      },
      {
        field: "execute_role",
        headerName: "Execute Role",
        type: "boolean",
        headerAlign: "center",
        width: 100,
        editable: true,
      },
      {
        field: "is_active",
        headerName: "Active",
        type: "text",
        headerAlign: "center",
        width: 100,
        editable: true,
      },
      {
        field: "created_by",
        headerName: "Created By",
        type: "text",
        headerAlign: "center",
        width: 100,
        editable: true,
      },
      
      {
        field: "updated_by",
        headerName: "Updated By",
        type: "text",
        headerAlign: "center",
        width: 100,
        editable: true,
      },
      
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        headerAlign: "center",
        width: 150,
        renderCell:(params)=>(
         <UsersActions{...{params, rowId, setRowId}}/>
        ),
      },
],[rowId]
)

const handleAddRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      { id: "", user_id: "", program_id: "",read_role:false, write_role: false,execute_role: false,  }
    ]);
    setRowId(null);
  };

  return (
    <>
    <Box m="1.5rem 2.5rem">
        <FlexBetween>
          <Header title={pageTitle} subtitle={pageSubTitle} />
           <Button
              variant="contained"
              color="primary"
              onClick={handleAddRow}
            >
              Add Row
            </Button>
        </FlexBetween>
      </Box>
    <Box
        sx={{
          height: 450,
          width: "100%",
          boxShadow: 3,
          border: 3,
          borderColor: "primary.dark",
          "& .MuiDataGrid-cell:hover": {
            color: "primary.main",
          },
          "& .super-app-theme--header": {
            backgroundColor: "rgba(255, 7, 0, 0.55)",
          },
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#050548",
            borderBottom: "none",
            color: "#ffffff",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.grey[100],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: "#bbb6a8",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.grey[900]} !important`,
          },
        }}
      >

      <DataGrid
        rows={rows}
        columns={columns}
        getRowId = {row=>row.id}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        // checkboxSelection
        disableSelectionOnClick
        onCellEditCommit={params=>setRowId(params.id)}
        components={{
          Toolbar: GridToolbar,
        }}
      />

    </Box>
    </>
  );
};

export default UserAccess;