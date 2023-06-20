import React, { useEffect, useState } from "react";
import { Box, useTheme, Button } from "@mui/material";
import { FileCopyOutlined } from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import PublishIcon from '@mui/icons-material/Publish';
import {
  useGetTasksQuery,
  useGetTaskFormQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskDetailsMutation,
  useUpdateGitDataMutation,
  useAddGitDataMutation,
} from "../state/apiSlice";

import Header from "components/Header";
import Popup from "components/Popup";
import TaskParameters from "./TaskParameters";
import TasksActions from "./TasksActions";
import DataQualityForm from "./DataQualityForm";
import SqlExecutionForm from "./SqlExecutionForm";

const styles = {
publishButton: {
   
    borderRadius: '4px', 
    padding: '10px 20px', 
    fontSize: '16px', 
    fontWeight: 'bold', 
  },
  myBackground: {
    boxshadow: "grey 0px 0px 5px!important",
    backgroundColor: "rgb(0, 72, 190)!important",
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: "14px",
  },
  myBorder: {
    border: "2px solid green",
  },
  myFont: {
    color: "blue",
  },
};

const Tasks = () => {
  const theme = useTheme();
  const { id } = useParams();
  const [rowId, setRowId] = React.useState(null);
  const [rowcopy, setRowCopy] = useState(null);
  const [rowpublish, setRowPublish] = useState(null);

  const { data: tasksRecords, isLoading: isRecordLoading } =
    useGetTasksQuery(id);

    
  const { data: taskFormFields, isLoading: isFormLoading } =
    useGetTaskFormQuery();

    console.log(taskFormFields,"taskFormFields")

  const [recordForEdit, setRecordForEdit] = useState(null);
  const [rowIdSQL, setRowIdSQL] = useState(null);
  const [openTaskPopup, setOpenTaskPopup] = useState(false);
  const [openSourcePopup, setOpenSourcePopup] = useState(false);
  const [openTargetPopup, setOpenTargetPopup] = useState(false);
  const [openDQFormPopup, setOpenDQFormPopup] = useState(false);
  const [openSqlExecutionFormPopup, setopenSqlExecutionFormPopup] = useState(false);


  const [addTask] = useAddTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [updateTaskDetails] = useUpdateTaskDetailsMutation();
  const [updateGit] = useUpdateGitDataMutation();
  const [addGit] = useAddGitDataMutation();

  // const [pipelineList, setPipelineList] = useState([]);
  const [taskType, setTaskType] = useState([]);

  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showCopyCancelDialog, setShowCopyCancelDialog] = useState(false);
const [showPublishCancelDialog, setShowPublishCancelDialog] = useState(false);
  const [copySuccessDialogOpen, setCopySuccessDialogOpen] = useState(false);
const [publishSuccessDialogOpen, setPublishSuccessDialogOpen] = useState(false);
  const [isRecordCopied, setIsRecordCopied] = useState(false);
const [isRecordPublished, setIsRecordPublished] = useState(false);

  const findSectionField = (formObject, section, field = null) => {
    const sectionRecord = formObject.find((rec) => rec.section === section);
    if (field) {
      const fieldRecord = sectionRecord.fields_list.find(
        (rec) => rec.field_id === field
      );
      return fieldRecord;
    }
    return sectionRecord;
  };


  useEffect(() => {
    if (!isFormLoading) {
      console.log("taskForms: ", taskFormFields);
      const taskTypeField = findSectionField(
        taskFormFields,
        "main",
        "task_type"
      );
      console.log("tt",taskTypeField);
      let taskFieldResult = []; // initializing array
      taskTypeField.option_list.forEach((element) => {
        taskFieldResult.push(element.name); // push the value directly
      });
      setTaskType(taskFieldResult);
    }
  }, [isFormLoading, taskFormFields]);
console.log("ttt",taskType);  

  const addOrEditRecord = async (values, resetForm, row) => {
    if (values?.id > 0) {
      await updateTask({ data: values, task_id: values.id });
    } else {
      await addTask({ data: values });
    }
    resetForm();
    setRecordForEdit(null);
    setOpenTaskPopup(false);
    setOpenSourcePopup(false);
    setOpenTargetPopup(false);
    if (isRecordCopied) {
      setIsRecordCopied(false);
      setCopySuccessDialogOpen(true);
    }
  };

  const copyRow = async (row) => {
    setShowCopyDialog(true);
    setRowCopy(row);
  };
 const publishRow = async (row) => {
    setShowPublishDialog(true);
    setRowPublish(row);
  };
  const handleCopyDialogClose = () => {
    setShowCopyDialog(false);
    setShowCopyCancelDialog(true);
  };
const handlePublishDialogClose = () => {
    setShowPublishDialog(false);
    setShowPublishCancelDialog(true);
  };

  const handleDialogClose = () => {
    setShowCopyCancelDialog(false);
	setShowPublishCancelDialog(false);
  };

  const handleCopyConfirm = async () => {
    setShowCopyDialog(false);

    let copyRecord = JSON.parse(JSON.stringify(rowcopy));

    copyRecord.task_name = `${rowcopy.task_name}_copy`;
    copyRecord.id = null;

    setRecordForEdit(copyRecord);
    setOpenTaskPopup(true);
    setIsRecordCopied(true);
    //setPopupData(data);
    //setRecordCopy(recordForEdit);
  };
  const handlePublishConfirm = async () => {
    setShowPublishDialog(false);
  
    const publishRecord = JSON.parse(JSON.stringify(rowpublish));
    try {
      await updateGit({id: publishRecord?.id });
      await addGit({id: publishRecord?.id });
    } catch (error) {
      // await addGit({id: publishRecord?.id });
      console.log(error)
    }
    setPublishSuccessDialogOpen(true);
  };
  
  const handleCopySuccessDialogClose = () => {
    setCopySuccessDialogOpen(false);
  };

  
  const handlePublishSuccessDialogClose = () => {
    setPublishSuccessDialogOpen(false);
  };


   const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "project_name", headerName: "Project Name", flex: 1 },
    {
      field: "pipeline_name",
      headerName: "Pipeline Name",
      flex: 1.25,
    },
    { field: "task_name", headerName: "Task Name", flex: 1, editable: true },
    {
      field: "task_description",
      headerName: "Description",
      flex: 2,
      editable: true,
    },
    {
      field: "task_type",
      headerName: "Type",
      type: "singleSelect",
      flex: 1,
      valueOptions: taskType,
      editable: true,
    },
    {
      field: "task_sequence",
      headerName: "Sequence No",
      flex: 1,
      editable: true,
    },
  {
    field: "sourceAndTarget",
    headerName: "Task Details",
    flex: 2,
    renderCell: ({ row }) => {
      const handleSourceClick = () => {
        setOpenSourcePopup(true);
        setRecordForEdit(row);
      };

      const handleTargetClick = () => {
        setOpenTargetPopup(true);
        setRecordForEdit(row);
      };

      const handleSqlExecutionCellClick = (row) => {
        setRecordForEdit(row);
        setopenSqlExecutionFormPopup(true);
        setRowIdSQL(row.id);
      };
    

    if (row.task_type === "SQL Execution") {
        return (
          <Box>
            <Button color="secondary" onClick={() => handleSqlExecutionCellClick(row)}>
              SQL Execution
            </Button>
          </Box>
        );
      }
      else {
      return (
        <Box>
          <Button color="secondary" onClick={handleSourceClick}>
            {row.source}
          </Button>
          <Button color="secondary" onClick={handleTargetClick}>
            {row.target}
          </Button>
        </Box>
      );
      }
    },
  },


    { field: "is_active", headerName: "Active", flex: 0.5, editable: true },
    {
      field: "dqcount",
      headerName: "Data Quality",
      headerAlign: "center",
      flex: 1,
      renderCell: ({ row }) => {
        const handleDQCellClick = () => {
          setRecordForEdit(row);
          setOpenDQFormPopup(true);
        };
        return (
          <Box>
            <Button color="secondary" onClick={handleDQCellClick}>
              {row.dqcount}
            </Button>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      headerAlign: "center",
      width: 80,
      renderCell: (params) => (
        <TasksActions {...{ params, rowId, setRowId, updateTaskDetails }} />
      ),
    },
    {
      field: "copytasks",
      headerName: "Copy Details",
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <Box>
            <Button
              color="secondary"
              onClick={() => {
                copyRow(row);
              }}
            >
              <FileCopyOutlined sx={styles.copyButton} />
            </Button>
          </Box>
        );
      },
    },
{
      field: "publish",
      headerName: "Publish",
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <Box>
            <Button
              color="secondary"
           
              onClick={() => {
                publishRow(row);
              }}
            >
             <PublishIcon sx={styles.PublishIcon} />

            </Button>
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <Box m="1.5rem 2.5rem">
        <Popup
          title="Copy Task?"
          openPopup={showCopyDialog}
          width={"md"}
          setOpenPopup={setShowCopyDialog}
          handleYesBtnClick={handleCopyConfirm}
          handleNoBtnClick={handleCopyDialogClose}
          yesBtn={true}
          noBtn={true}
        >
          <p>Do you want to copy this task {rowcopy?.task_name}?</p>
        </Popup>
        <Popup
			title="Publish Task?"
          openPopup={showPublishDialog}
          width={"md"}
          setOpenPopup={setShowPublishDialog}
          handleYesBtnClick={handlePublishConfirm}
          handleNoBtnClick={handlePublishDialogClose}
          yesBtn={true}
          noBtn={true}
        >
          <p>Do you want to publish this task {rowpublish?.task_name}? to GitHub</p>
        </Popup>
        <Popup
          title="Canceled"
          openPopup={showCopyCancelDialog}
          setOpenPopup={setShowCopyCancelDialog}
          width={"md"}
          handleYesBtnClick={handleDialogClose}
          yesBtn={true}
          noBtn={false}
        >
          <p>Copying Task: {rowcopy?.task_name} record is Canceled.</p>
        </Popup>
        <Popup
title="Canceled"
          openPopup={showPublishCancelDialog}
          setOpenPopup={setShowPublishCancelDialog}
          width={"md"}
          handleYesBtnClick={handleDialogClose}
          yesBtn={true}
          noBtn={false}
        >
          <p>Publishing Task: {rowpublish?.task_name} record to GitHub is Canceled.</p>
        </Popup>
        <Popup
          title="Task Copied"
          openPopup={copySuccessDialogOpen}
          setOpenPopup={setShowCopyCancelDialog}
          width={"md"}
          handleYesBtnClick={handleCopySuccessDialogClose}
          yesBtn={true}
          noBtn={false}
        >
          <p>
            Task: {rowcopy?.task_name} is copied as Task: {rowcopy?.task_name}
            _copy Successfully.
          </p>
        </Popup>
<Popup
          title="Task Published"
          openPopup={publishSuccessDialogOpen}
          setOpenPopup={setShowPublishCancelDialog}
          width={"md"}
          handleYesBtnClick={handlePublishSuccessDialogClose}
          yesBtn={true}
          noBtn={false}
        >
          <p>
            Task: {rowpublish?.task_name} is uploaded to GitHub Successfully.
          </p>
        </Popup>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="Tasks" subtitle="See your list of Tasks." />
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setOpenTaskPopup(true);
                setRecordForEdit(null);
              }}
              sx={styles.myBackground}
              style={styles.myBorder}
            >
              Create Tasks
            </Button>
          </Box>
        </Box>
      </Box>
      <Box m="1.5rem 2.5rem">
        {tasksRecords || !isRecordLoading ? (
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
              rows={tasksRecords}
              getRowId={(row) => row.id}
              columns={columns}
              components={{ Toolbar: GridToolbar }}
              onCellEditCommit={(params) => setRowId(params.id)}
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
        title="Task Details Form"
        openPopup={openTaskPopup}
        width={"md"}
        setOpenPopup={setOpenTaskPopup}
      >
        <TaskParameters
          taskFormFields={taskFormFields}
          values={recordForEdit}
          addOrEditRecord={addOrEditRecord}
          formType={"main"}
        />
      </Popup>
      <Popup
        title="Task Source Details Form"
        openPopup={openSourcePopup}
        width={"md"}
        setOpenPopup={setOpenSourcePopup}
      >
        <TaskParameters
          taskFormFields={taskFormFields}
          values={recordForEdit}
          addOrEditRecord={addOrEditRecord}
          formType={"source"}
        />
      </Popup>
      <Popup
        title="Task Target Details Form"
        openPopup={openTargetPopup}
        width={"md"}
        setOpenPopup={setOpenTargetPopup}
      >
        <TaskParameters
          taskFormFields={taskFormFields}
          values={recordForEdit}
          addOrEditRecord={addOrEditRecord}
          formType={"target"}
        />
      </Popup>
      <Popup
        title="Data Quality Form"
        openPopup={openDQFormPopup}
        width={"lg"}
        setOpenPopup={setOpenDQFormPopup}
      >
        <DataQualityForm
          taskFormFields={taskFormFields}
          values={recordForEdit}
          addOrEditRecord={addOrEditRecord}
          formType={"dataquality"}
        />
      </Popup>
      <Popup
        title="SQL Execution Form"
        openPopup={openSqlExecutionFormPopup}
        width={"lg"}
        setOpenPopup={setopenSqlExecutionFormPopup}
      >
        <SqlExecutionForm
          taskFormFields={taskFormFields}
          values={recordForEdit}
          addOrEditRecord={addOrEditRecord}
          formType={"sqlexecution"}
          setRecordForEdit={setRecordForEdit}
          rowIdSQL = {rowIdSQL}
        />
      </Popup>

    </>
  );
};

export default Tasks;
