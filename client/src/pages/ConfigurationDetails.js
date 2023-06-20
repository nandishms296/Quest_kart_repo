import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { useTheme } from "@emotion/react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import FlexBetween from "components/FlexBetween";
import {
  useGetConfigurationDetailsQuery,
  useGetConfigurationDetailsFormQuery,
  useAddObjectMutation,
  useUpdateObjectMutation,
} from "../state/apiSlice";
import Header from "components/Header";
import { useParams } from "react-router-dom";
import Popup from "components/Popup";
import ObjectForm from "pages/ObjectForm";
import { ModeEditOutline } from "@mui/icons-material";

const styles = {
  myBackground: {
    fontSize: "14px",
    fontWeight: "800",
    borderRadius: "6px",
    border: "2px solid green",
    boxshadow: "grey 0px 0px 5px!important",
    backgroundColor: "rgb(0, 72, 190)!important",
    color: "#FFFFFF!important",
    textTransform: "upper",
    lineHeight: 1.5,
    padding: "7px 9px",
  },
  editButton: {
    borderRadius: "6px!important",
    minWidth: "25px!important",
    minHeight: "25px!important",
    marginTop: "0px!important",
    marginRight: "30px!important",
    color: "#FFFFFF!important",
    fontWeight: "bold!important",
    backgroundColor: "#0589f9ba!Important",
    marginLeft: "3px",
  },
  gridLinkBtn: {
    fontSize: "12px",
    fontWeight: "bold",
    borderRadius: "6px",
    backgroundColor: "#5adbb5!important",
    color: "#03112e!important",
    textTransform: "none",
    lineHeight: 1,
    width: "auto",
    padding: "7px 9px",
  },
  myBorder: {
    border: "2px solid green",
  },
  myFont: {
    color: "blue",
  },
};
const ConfigurationDetails = () => {
  const theme = useTheme();
  const { id } = useParams();
  console.log("Id:", id);

  const { data: configurationdetailsRecords, isLoading: isRecordLoading } =
    useGetConfigurationDetailsQuery(id);
  const { data: formData, isLoading: isFormLoading } =
    useGetConfigurationDetailsFormQuery("configuration_detail");
  const [addObject] = useAddObjectMutation();
  const [updateObject] = useUpdateObjectMutation();

  const [initValue, setInitValue] = useState(null);
  const [fieldsList, setFieldList] = useState(null);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);

  if (!isFormLoading && initValue === null && !isRecordLoading) {
    setInitValue(formData[0].initialvalues);
    setFieldList(formData[0].field_list);
  }

  const addOrEdit = async (values, resetForm) => {
    if (values?.id === 0) {
      await addObject({ object: "configuration_detail", data: values });
    } else {
      await updateObject({ object: "configuration_detail", data: values });
    }
    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
  };

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  var pageTitle = "Configuration Details";
  var pageSubTitle = "See your list of Configuration Details.";

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    // { field: "configuration_id", headerName: "configuration_id", flex: 0.5 },
    {
      field: "configuration_name",
      headerName: "configuration_name",
      flex: 0.5,
    },
    { field: "display_sequence", headerName: "display_sequence", flex: 0.5 },
    { field: "key_01", headerName: "key_01", flex: 0.5 },
    { field: "value_01", headerName: "value_01", flex: 0.5 },
    { field: "required", headerName: "required", flex: 0.25 },
    { field: "key_02", headerName: "key_02", flex: 0.5 },
    { field: "value_02", headerName: "value_02", flex: 0.5 },
    { field: "field_type", headerName: "field_type", flex: 0.5 },
    { field: "remarks", headerName: "remarks", flex: 0.5 },
    { field: "is_active", headerName: "is_active", flex: 0.25 },
    {
      field: "update",
      headerName: "Update",
      flex: 0.25,
      renderCell: ({ row }) => {
        return (
          <Button
            color="secondary"
            onClick={() => {
              openInPopup(row);
            }}
          >
            <ModeEditOutline sx={styles.editButton} />
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <Box m="1.5rem 2.5rem">
        <FlexBetween>
          <Header title={pageTitle} subtitle={pageSubTitle} />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setOpenPopup(true);
              setRecordForEdit(initValue);
            }}
            sx={styles.myBackground}
            style={styles.myBorder}
          >
            Create Configuration Details
          </Button>
        </FlexBetween>
      </Box>
      <Box m="1.5rem 2.5rem">
        {configurationdetailsRecords || !isRecordLoading ? (
          <Box
            m="40px 0 0 0"
            height="75vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },

              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme.palette.secondary[200],
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme.palette.grey[100],
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: theme.palette.secondary[200],
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `${theme.palette.grey[900]} !important`,
              },
            }}
          >
            <DataGrid
              rowHeight={32}
              rows={configurationdetailsRecords}
              columns={columns}
              components={{ Toolbar: GridToolbar }}
              getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0
                  ? "Mui-odd"
                  : "Mui-even"
              }
            />
          </Box>
        ) : (
          <>Loading...</>
        )}
      </Box>
      <Popup
        title="Configuration Details Form"
        openPopup={openPopup}
        width={"md"}
        setOpenPopup={setOpenPopup}
      >
        <ObjectForm
          fieldsList={fieldsList}
          values={recordForEdit}
          addOrEdit={addOrEdit}
          object={"configuration_detail"}
        />
      </Popup>
    </>
  );
};

export default ConfigurationDetails;
