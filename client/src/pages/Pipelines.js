import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { useTheme } from "@emotion/react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useParams, Link } from "react-router-dom";

import FlexBetween from "components/FlexBetween";
import {
  useGetPipelinesQuery,
  useLazyGetPipelineFlowByIdQuery,
  useGetObjectFormQuery,
  useAddObjectMutation,
  useUpdateObjectMutation,
} from "../state/apiSlice";
import Header from "components/Header";
import TaskSequenceFlow from "./TaskSequenceFlow";
import Popup from "components/Popup";
import ObjectForm from "pages/ObjectForm";
import { ModeEditOutline } from "@mui/icons-material";

const styles = {
  myBackground: {
    //backgroundColor: "#4681f4!important",
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
const Pipelines = () => {
  const theme = useTheme();
  const { id } = useParams();
  console.log("Id:", id);

  const { data: projectRecords, isLoading: isRecordLoading } =
    useGetPipelinesQuery(id);
  const { data: formData, isLoading: isFormLoading } =
    useGetObjectFormQuery("Pipeline");
  const [getPipelineFlowById] = useLazyGetPipelineFlowByIdQuery();

  const [addObject] = useAddObjectMutation();
  const [updateObject] = useUpdateObjectMutation();

  const [initValue, setInitValue] = useState(null);
  const [fieldsList, setFieldList] = useState(null);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [pipelineTasks, setPipelineTasks] = useState([]);

  const [openPopup, setOpenPopup] = useState(false);
  const [openTaskSeqPopup, setOpenTaskSeqPopup] = useState(false);

  if (!isFormLoading && initValue === null && !isRecordLoading) {
    setInitValue(formData[0].initialvalues);
    setFieldList(formData[0].field_list);
  }

  const addOrEdit = async (values, resetForm) => {
    if (values?.id === 0) {
      await addObject({ object: "pipeline", data: values });
    } else {
      await updateObject({ object: "pipeline", data: values });
    }
    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
  };

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  let pageTitle = "Pipelines";
  let pageSubTitle = "See your list of Pipelines.";

  if (typeof id !== "undefined") {
    pageTitle = "Projects -> Pipelines";
    pageSubTitle = "Details of Pipelines of Project ID : " + id;
  }

  const handleTaskSequenceClick = async (id) => {
    const { data } = await getPipelineFlowById(id);
    if (data) {
      setPipelineTasks(data);
      setOpenTaskSeqPopup(true);
      // open Open Popup for Task Sequencing.
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "pipeline_name", headerName: "Pipeline Name", flex: 1 },
    { field: "pipeline_cd", headerName: "Pipeline Code", flex: 1 },
    { field: "pipeline_description", headerName: "Description", flex: 2 },
    { field: "pipeline_sequence", headerName: "Sequence No", flex: 1 },
    { field: "is_active", headerName: "Active", flex: 0.25 },
    {
      field: "Task Sequence",
      Header: "Task Sequence",
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <Box>
            <Button
              color="secondary"
              onClick={() => handleTaskSequenceClick(row.id)}
            >
              Sequence
            </Button>
          </Box>
        );
      },
    },
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
    {
      field: "opentasks",
      headerName: "Open Tasks",
      flex: 0.75,
      renderCell: ({ row: { id } }) => {
        return (
          // <Box width="60%" m="0 auto" p="5px" display="flex" justifyContent="center" backgroundColor={theme.palette.secondary[400]} borderRadius="5px">
          //     <Link to={`/tasks/${id}`}>Open Tasks</Link>
          // </Box>
          <Button component={Link} to={`/tasks/${id}`} sx={styles.gridLinkBtn}>
            Open Tasks
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <Box m="1.5rem 2.5rem">
        <FlexBetween>
          {/* <Header title="Pipelines" subtitle="See your list of Pipelines." /> */}
          <Header title={pageTitle} subtitle={pageSubTitle} />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setOpenPopup(true);
              setRecordForEdit(initValue);
            }}
            // sx={{ fontSize: "14px", fontWeight: "bold",  borderRadius:"10px",  backgroundColor :"#4681f4!important",
            //     color: "#FFFFFF!important", textTransform:"none", lineHeight:1.5, width:"140px", padding: "7px 9px",
            //     }}
            sx={styles.myBackground}
            style={styles.myBorder}
          >
            Create Pipeline
          </Button>
        </FlexBetween>
      </Box>
      <Box m="1.5rem 2.5rem">
        {projectRecords || !isRecordLoading ? (
          <Box
            m="40px 0 0 0"
            height="75vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              /*  "& .MuiDataGrid-cell": {
                            borderBottom: "none", 
                            backgroundColor: theme.palette.grey[100], 
                            // Below line added by SA
                            lineHeight: 'unset !important',
                            maxHeight: 'none !important',
                            whiteSpace: 'normal',
                        }, */
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
              rows={projectRecords}
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
        title="Pipeline Form"
        openPopup={openPopup}
        width={"md"}
        setOpenPopup={setOpenPopup}
      >
        <ObjectForm
          fieldsList={fieldsList}
          values={recordForEdit}
          addOrEdit={addOrEdit}
          object={"Pipeline"}
        />
      </Popup>
      <Popup
        title="Task Sequence Canvas."
        openPopup={openTaskSeqPopup}
        width={"lg"}
        setOpenPopup={setOpenTaskSeqPopup}
      >
        <TaskSequenceFlow
          pipelineTasks={pipelineTasks}
          addOrEditRecord={addOrEdit}
          formType={"Tasks Sequence"}
        />
      </Popup>
    </>
  );
};

export default Pipelines;
