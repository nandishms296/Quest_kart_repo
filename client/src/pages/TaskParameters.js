import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  FormHelperText,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";

import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";

import PreviewData from "../components/PreviewData";

import TaskParamsForm from "./TaskParamsForm";

import CloseIcon from "@mui/icons-material/Close";
import TaskForm from "./TaskForm";

const styles = {
  btnBack: {
    backgroundColor: "#111111",
    color: "#FFFFFF",
    marginRight: "15px",
  },
  btnNext: {
    backgroundColor: "rgb(0, 72, 190)!important",
    color: "#FFFFFF",
    fontWeight: "800",
  },
  btnPreview: {
    backgroundColor: "#1E6738",
    float: "right",
    color: "#FFFFFF",
    fontWeight: "600",
  },
};

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

const TaskParameters = (props) => {
  const {
    taskFormFields,
    values: editValue,
    addOrEditRecord,
    formType,
  } = props;

  console.log("Values", editValue);

  const mainRecord = findSectionField(taskFormFields, "main");
  const sourceRecord = findSectionField(taskFormFields, "source");
  const targetRecord = findSectionField(taskFormFields, "target");

  const mainForm = mainRecord.fields_list;
  const sourceFormData = sourceRecord.fields_list;
  const targetFormData = targetRecord.fields_list;

  const sourceConnSubTypeList = sourceFormData
    .map((rec) => rec.connection_subtype)
    .filter((rec, index, _arr) => _arr.indexOf(rec) === index);
  const targetConnSubTypeList = targetFormData
    .map((rec) => rec.connection_subtype)
    .filter((rec, index, _arr) => _arr.indexOf(rec) === index);

  const [currSrcConnSubType, setCurrSrcConnSubType] = useState(null);
  const [currTgtConnSubType, setCurrTgtConnSubType] = useState(null);

  const [sourceForm, setSourceForm] = useState(null);
  const [targetForm, setTargetForm] = useState(null);
  const [previewInfo, setPreviewInfo] = useState(null);

  function changeConnSubType(type, connSubType) {
    console.log("item", connSubType);
    if (type === "source") {
      setCurrSrcConnSubType(connSubType);
      const srcSelectedItem = sourceFormData.filter(
        (item) => item.connection_subtype === connSubType
      );
      setSourceForm(srcSelectedItem[0]);
    }
    if (type === "target") {
      setCurrTgtConnSubType(connSubType);
      const tgtSelectedItem = targetFormData.filter(
        (item) => item.connection_subtype === connSubType
      );
      setTargetForm(tgtSelectedItem[0]);
    }
  }

  function validateFormSchema(formData) {
    var validSchemaObject = {};
    formData.forEach(({ field_id, display_label, required }) => {
      if (required === "R") {
        validSchemaObject[field_id] = yup
          .string()
          .required(`${display_label} is required`);
      }
    });
    return yup.object().shape(validSchemaObject);
  }

  function validateSchemaObject(section) {
    var validationObject = {};

    switch (section) {
      case "main":
        if (mainForm != null) {
          validationObject[section] = validateFormSchema(mainForm);
        }
        break;
      case "source":
        if (sourceForm != null) {
          validationObject[section] = validateFormSchema(
            sourceForm?.field_list
          );
        }
        break;
      case "target":
        if (targetForm != null) {
          validationObject[section] = validateFormSchema(
            targetForm?.field_list
          );
        }
        break;
      default:
        break;
    }

    return validationObject;
  }

  if (formType === "source" && currSrcConnSubType === null) {
    if (editValue && editValue.source !== "none") {
      changeConnSubType("source", editValue.source);
    } else {
      changeConnSubType("source", sourceFormData[0].connection_subtype);
    }
  }

  if (formType === "target" && currTgtConnSubType === null) {
    if (editValue && editValue.target !== "none") {
      changeConnSubType("target", editValue.target);
    } else {
      changeConnSubType("target", targetFormData[0].connection_subtype);
    }
  }

  var initValues = {};
  if (editValue === null || editValue === undefined) {
    initValues = {
      ...mainForm?.initialvalues,
      ...sourceForm?.initialvalues,
      ...targetForm?.initialvalues,
    };
  } else {
    const { details, ...taskRecord } = editValue;
    if (Object.keys(details).length !== 0) {
      const { Source, Target } = details;
      var detailRecord = Object.assign({}, Source, Target);
      initValues = { ...taskRecord, ...detailRecord };
    } else {
      initValues = { ...taskRecord };
    }
  }

  const validationSchema = validateSchemaObject(formType);

  const [errors, setErrors] = useState(null);

  if (sourceFormData === null || targetFormData === null) {
    setErrors("Form data for Main, Source or Target can't be null.");
  }

  const formik = useFormik({
    initialValues: initValues,
    validationSchema: validationSchema[formType],
    onSubmit: (values, { resetForm }) => {
      console.log("values", values);
      handleFormSubmit(values, resetForm);
    },
  });

  const formTask = (formikProps) => {
    return (
      <TaskForm
        taskProps={mainRecord}
        formProps={formikProps}
        object={"Task"}
      />
    );
  };

  const formSourceTask = (formikProps, sourceConnType) => {
    return (
      <TaskParamsForm
        taskProps={{
          connSubTypeList: sourceConnSubTypeList,
          currSrcConnSubType: sourceConnType,
          fieldList: sourceForm?.field_list,
        }}
        formProps={formikProps}
        handleConnSubTypeChange={handleSourceConnSubTypeChange}
        object={"Source"}
      />
    );
  };

  const formTargetTask = (formikProps, targetConnType) => {
    return (
      <TaskParamsForm
        taskProps={{
          connSubTypeList: targetConnSubTypeList,
          currSrcConnSubType: targetConnType,
          fieldList: targetForm?.field_list,
        }}
        formProps={formikProps}
        handleConnSubTypeChange={handleTargetConnSubTypeChange}
        object={"Target"}
      />
    );
  };

  function handleSourceConnSubTypeChange(subTypeValue) {
    changeConnSubType("source", subTypeValue);
    console.log("Source Handle Connection SubType Change: ", subTypeValue);
  }

  function handleTargetConnSubTypeChange(subTypeValue) {
    changeConnSubType("target", subTypeValue);
    console.log("Target Handle Connection SubType Change: ", subTypeValue);
  }

  const handleFormSubmit = async (values, resetForm) => {
    console.log("Handing Form Submit Value: ", values);

    const mainFormFields = mainForm
      .map((rec) => rec.field_id)
      .filter((rec, index, _arr) => _arr.indexOf(rec) === index);

    let taskParameterValues = {};
    let srcParameterType, tgtParameterType;
    const removeFields = [
      "id",
      "is_active",
      "source",
      "target",
      "dqcount",
      "project_name",
      "pipeline_name",
    ];

    let tblTask = {
      is_active: "Y",
      id: values?.id || 0,
    };
    /* collecting Task fields for table tbl_task. */
    mainFormFields.forEach((prop) => (tblTask[prop] = values[prop]));

    switch (formType) {
      case "source":
        if ("tgt_parameter_type" in values) {
          tgtParameterType = values.tgt_parameter_type;
          srcParameterType = currSrcConnSubType;
        }
        taskParameterValues = {
          ...values,
          src_parameter_type: currSrcConnSubType,
        };
        break;
      case "target":
        if ("src_parameter_type" in values) {
          srcParameterType = values.src_parameter_type;
          tgtParameterType = currTgtConnSubType;
        }
        taskParameterValues = {
          ...values,
          tgt_parameter_type: currTgtConnSubType,
        };
        break;
      default:
        break;
    }
    console.log(srcParameterType, "srcParameterType");
    console.log(tgtParameterType, "tgtParameterType");
    mainFormFields.forEach((prop) => (tblTask[prop] = values[prop]));
    mainFormFields.forEach((prop) => delete taskParameterValues[prop]);
    removeFields.forEach((prop) => delete taskParameterValues[prop]);

    console.log("tblTaskParameter: ", taskParameterValues);

    const taskDetails = [];
    Object.keys(taskParameterValues).forEach((key, index) => {
      let parameter_type = key.includes("src_")
        ? srcParameterType
        : key.includes("tgt_")
        ? tgtParameterType
        : null;
      taskDetails.push({
        task_type: key.includes("src_")
          ? "Source"
          : key.includes("tgt_")
          ? "Target"
          : "DataQuality",
        parameter_type,
        key_01: key.replace("src_", "").replace("tgt_", ""),
        value_01: taskParameterValues[key],
        sequence: index + 1,
        is_active: "Y",
      });
    });

    let taskRecord = { ...tblTask, details: taskDetails };
    console.log("taskDetails :", taskDetails);
    console.log("taskRecord :", taskRecord);
    addOrEditRecord(taskRecord, resetForm);
  };

  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);

  const handlePreview = async () => {
    let data = {};
    let filetype;
    let connectionType;

    if (formType === "source") {
      connectionType = currSrcConnSubType.toLowerCase().replace(/\s/g, "");
      filetype = formik.values.src_file_type;
      if (connectionType === "awss3" || connectionType === "localserver") {
        data = {
          connection_id: formik.values.src_connection_name,
          table_name: formik.values.src_file_name,
          filepath: formik.values.src_file_path,
          header: formik.values.src_skip_header,
          delimiter: ",",
          encoding: "utf-8",
        };
      } else {
        data = {
          connection_id: formik.values.src_connection_name,
          table_name: formik.values.src_table_name,
          schema_name: formik.values.src_schema,
          header: formik.values.src_select_columns,
        };
      }
    }

    if (formType === "target") {
      connectionType = currTgtConnSubType.toLowerCase().replace(/\s/g, "");
      data = {
        connection_id: formik.values.tgt_connection_name,
        table_name: formik.values.tgt_table_name,
        schema_name: formik.values.tgt_schema,
        header: formik.values.src_select_columns,
      };
    }

    let url;
    if (connectionType === "awss3" || connectionType === "localserver") {
      url = `http://localhost:8080/api/preview/${connectionType}/${filetype}`;
    } else {
      url = `http://localhost:8080/api/preview/${connectionType}/`;
    }

    try {
      const result = await axios.get(url, { params: data });
      setPreviewInfo(result.data);
      setOpen(true);
      setError(null); // Clear any previous errors
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
        console.log("error", error);
      } else {
        setError(error.message);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  return (
    <>
      {errors ? (
        <Box display="flex" flexDirection="row" sx={{ m: "3rem 1.5rem" }}>
          <Typography variant="h4">{errors}</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            maxWidth: "600px",
            padding: 2,
          }}
        >
          <Grid container>
            <Grid item xs={12} sx={{ padding: "20px" }}>
              {formType === "main"
                ? formTask(formik)
                : formType === "source"
                ? formSourceTask(formik, currSrcConnSubType)
                : formType === "target"
                ? formTargetTask(formik, currTgtConnSubType)
                : null}
            </Grid>

            {formik.errors.submit && (
              <Grid item xs={12}>
                <FormHelperText error>{formik.errors.submit}</FormHelperText>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                onClick={formik.handleSubmit}
                sx={{
                  backgroundColor: "rgb(0, 72, 190)!important",
                  color: "#FFFFFF",
                }}
              >
                Submit
              </Button>

              {formType === "source" || formType === "target" ? (
                <Button
                  variant="contained"
                  onClick={handlePreview}
                  style={styles.btnPreview}
                >
                  Preview
                </Button>
              ) : null}
              <br></br>
              <br></br>
              {error && (
                <div
                  style={{
                    backgroundColor: "rgb(7, 0, 76)",
                    color: "white",
                    padding: "10px",
                    borderRadius: "10px",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ marginRight: "10px" }}>⚠️</div>{" "}
                      <div style={{ fontWeight: "bold" }}>Error</div>{" "}
                    </div>
                    <IconButton
                      style={{
                        position: "absolute",
                        bottom: "18px",
                        right: "5px",
                      }}
                      onClick={handleClose}
                      color="inherit"
                    >
                      <CloseIcon style={{ fontSize: "20px" }} />
                    </IconButton>
                  </div>
                  <div style={{ flex: "1", marginTop: "3px" }}>{error}</div>{" "}
                </div>
              )}
            </Grid>
          </Grid>

          <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                marginTop: "75px",
                minWidth: "90%",
                height: "90vh",
                maxWidth: "none",
                maxHeight: "none",
                resize: true,
              },
            }}
          >
            <DialogTitle
              style={{
                backgroundColor: "#0cf5ea8a",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <center></center>PREVIEWING DATABASE TABLES AND LOCAL STORAGE
              FILES
              <IconButton onClick={handleClose} color="inherit">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <PreviewData
                handleClose={handlePreview}
                previewInfo={previewInfo}
              />
            </DialogContent>
          </Dialog>
        </Box>
      )}
    </>
  );
};

export default TaskParameters;
