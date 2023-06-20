import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  GridToolbarContainer,
  gridFilteredSortedRowIdsSelector,
  useGridApiContext,
  gridVisibleColumnFieldsSelector,
} from "@mui/x-data-grid";
import axios from "axios";
import { createSvgIcon } from "@mui/material/utils";
import PropTypes from "prop-types";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material";
import { GridToolbar } from "@mui/x-data-grid";
import "../index.css";

const SelectEditInputCell = (props) => {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();
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
      <option>Int32</option>
      <option>Bigint</option>
      <option>Number</option>
      <option>Float</option>
      <option>Number</option>
      <option>String</option>
      <option>Boolean</option>
      <option>Object</option>
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

const metadataColumnsList = [
  {
    field: "id",
    headerName: "Serial No",
    type: "text",
    headerAlign: "center",
    width: 25,
    editable: false,
  },
  {
    field: "actualColumns",
    headerName: "Actual Columns",
    type: "text",
    headerAlign: "center",
    width: 150,
    editable: false,
  },
  {
    field: "aliasColumns",
    headerName: "Alias Columns",
    type: "text",
    headerAlign: "center",
    width: 150,
    editable: true,
  },
  {
    field: "sourceDatatype",
    headerName: "Source Data type",
    type: "text",
    headerAlign: "center",
    width: 150,
    editable: false,
  },
  {
    field: "targetDatatype",
    headerName: "Target Data type",
    type: "text",
    renderEditCell: renderSelectEditInputCell,
    editable: true,
    width: 120,
  },
  {
    field: "sourceLength",
    headerName: "Source Length",
    type: "number",
    headerAlign: "center",
    width: 100,
    editable: true,
  },
  {
    field: "targetLength",
    headerName: "Target Length",
    type: "number",
    headerAlign: "center",
    width: 100,
    editable: true,
  },
];

const getJson = (apiRef) => {
  // Select rows and columns
  const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
  const visibleColumnsField = gridVisibleColumnFieldsSelector(apiRef);

  // Format the data. Here we only keep the value
  const data = filteredSortedRowIds.map((id) => {
    const row = {};
    visibleColumnsField.forEach((field) => {
      // if (field !== "__check__") {
      row[field] = apiRef.current.getCellParams(id, field).value;
      //  }
    });
    return row;
  });

  // Stringify with some indentation
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#parameters
  return data;
};

const ExportIcon = createSvgIcon(
  <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z" />,
  "SaveAlt"
);

const CustomToolbar = (props) => {
  const { connectionId, tableName, schemaName, databaseType } = props;
  console.log("props: ", props);
  //The API object is accessible through the apiRef variable.you will have to use either useGridApiContext or useGridApiRef.
  const apiRef = useGridApiContext();

  const handleExport = async () => {
    const jsonExport = getJson(apiRef);
    console.log("jsonExport: ", jsonExport);
    console.log("connectionId: ", connectionId);
    console.log("tableName: ", tableName);
    console.log("schemaName: ", schemaName);

    try {
      const url = `http://localhost:8080/api/columnreference/delete/${connectionId}&${schemaName}&${tableName}`;
      const result = await axios.delete(url);
      console.log("Delete Result : ", result);

      const records = jsonExport.map((rec) => ({
        connection_name: Number(connectionId),
        schema_name: schemaName,
        table_name: tableName,
        task_parameter_id: 0,
        source_field_name: rec.actualColumns,
        source_field_dbtype: rec.sourceDatatype,
        source_field_length: rec.sourceLength,
        target_type: databaseType,
        target_field_name: rec.aliasColumns,
        target_field_type: rec.targetDatatype,
        target_field_length: rec.targetLength,
        field_sequence: rec.id,
        is_active: rec.__check__,
        created_by: "system",
        updated_by: "system",
      }));

      // bulkInsert into columnReference table.
      const postUrl = `http://localhost:8080/api/columnreference/`;
      const postResult = await axios.post(postUrl, records);
      console.log("postResult: ", postResult);
      alert("Record Inserted...");
    } catch (error) {
      console.log("Error while delete records in columnreference table.");
      alert("Record Not Inserted...");
    }
  };

  const buttonBaseProps = {
    color: "primary",
    size: "small",
    startIcon: <ExportIcon />,
  };

  return (
    <GridToolbarContainer>
      <Box
        component="span"
        sx={{
          p: 2,
          border: "1px dashed grey",
          backgroundColor: "#bbb6a8", // Add a grey background color
        }}
      >
        <Button
          {...buttonBaseProps}
          onClick={() => handleExport()}
          sx={{ fontWeight: "bold", Height: "5px" }}
          variant="contained"
          color="primary"
        >
          SAVE
        </Button>
      </Box>
    </GridToolbarContainer>
  );
};

const PreviewData = (props) => {
  const { previewInfo } = props;
  const { inputProps, ...otherProps } = previewInfo;

  const theme = useTheme();
  const metaDataInfo = otherProps.metaDataInfo;
  const previewRows = otherProps.rows;

  const tableName = inputProps?.table_name;
  const connectionId = inputProps?.connection_id;
  const schemaName = inputProps?.schema_name;
  const databaseType = inputProps?.database_type;

  let previewColumnsList = [];

  if (otherProps?.rows.length > 0) {
    Object.keys(otherProps.rows[0]).forEach((fieldName) => {
      previewColumnsList.push({
        field: fieldName,
        headerName: fieldName,
        type: "text",
        headerAlign: "center",
        width: 150,
      });
    });
  }

  const rows1 = previewRows.map((item, index) => ({
    ...item,
    id: index + 1,
  }));

  const rows2 = metaDataInfo.map((item, index) => ({
    ...item,
    id: index + 1,
  }));

  return (
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
        rows={rows1}
        columns={previewColumnsList}
        pJobDescriptionSize={5}
        rowsPerPJobDescriptionOptions={[5]}
        experimentalFeatures={{ newEditingApi: true }}
        components={{ Toolbar: GridToolbar }}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "Mui-odd" : "Mui-even"
        }
      />
      <hr style={{ borderColor: "rgb(7, 0, 76)" }} />
      <center>
        <br />
        <b style={{ color: "rgb(135 111 89)" }}>
          "Previewed Table Name" = {tableName}
        </b>
        <br />
        <br></br>
      </center>
      <hr style={{ borderColor: "rgb(7, 0, 76)" }} />

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
          rows={rows2}
          columns={metadataColumnsList}
          pJobDescriptionSize={5}
          rowsPerPJobDescriptionOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          components={{ Toolbar: CustomToolbar }}
          componentsProps={{
            toolbar: {
              tableName: tableName,
              connectionId: connectionId,
              schemaName: schemaName,
              databaseType: databaseType,
            },
          }}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "Mui-odd" : "Mui-even"
          }
        />
      </Box>
    </Box>
  );
};

export default PreviewData;
