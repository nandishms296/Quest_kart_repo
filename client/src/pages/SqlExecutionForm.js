import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  useAddTaskParameterSQLMutation,
  useUpdateTaskParameterSQLMutation,
  useGetTasksSqlExecutionQuery,
} from "../state/apiSlice";
import { useState } from "react";
import { handleSqlExecutionSubmit } from "../services/sqlLogic.controller";
const styles = {
  btnCss: {
    backgroundColor: "rgb(0, 72, 190)!important",
    boxshadow: "grey 0px 0px 5px!important",
    color: "#FFFFFF!important",
    fontWeight: "800!important",
    fontSize: "13px!important",
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
const SqlExecutionForm = ({
  taskFormFields,
  values,
  addOrEditRecord,
  formType,
}) => {
  const { data: tasksRecords } = useGetTasksSqlExecutionQuery(values.id);
  const [addTaskParameterSQL] = useAddTaskParameterSQLMutation();
  const [updateTaskParameterSQL] = useUpdateTaskParameterSQLMutation();

  const editValue = {
    connection_name: "",
    restart: "",
    SqlExecution: [],
  };
  editValue.connection_name =
    values.details?.SqlExecution?.parameters?.se_connection_name;
  editValue.restart = values.details?.SqlExecution?.parameters?.se_restart;
  // Append SqlExecution values
  if (values.details?.SqlExecution?.SqlExecution !== undefined) {
    const cleanedData = JSON.parse(
      JSON.stringify(values.details.SqlExecution).replace(/"se_/g, '"')
    );
    for (const item of cleanedData?.SqlExecution) {
      editValue.SqlExecution.push(item);
    }
  }
  const [data, setData] = useState(editValue);
  const sqlExecutionRecord = findSectionField(taskFormFields, formType);
  console.log("sql1", sqlExecutionRecord);

  let sqlcomponent = JSON.parse(
    JSON.stringify(sqlExecutionRecord["fields_list"][0]["sqlcomponent"])
  );

  let maincomponent = JSON.parse(
    JSON.stringify(sqlExecutionRecord["fields_list"][1]["main"])
  );
  let option_list = maincomponent.option_list;

  let maincomponent1 = JSON.parse(
    JSON.stringify(sqlExecutionRecord["fields_list"][2]["main"])
  );
  let option_list1 = maincomponent1.option_list;
  console.log("sql1111", option_list1);

  const { register, handleSubmit, control } = useForm({ defaultValues: data });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "SqlExecution",
  });

  const addOrEditRecordSqlexe = async (values, resetForm, row) => {
    if (tasksRecords?.data[0]?.id > 0) {
      await updateTaskParameterSQL({ data: values, task_id: row });
    } else {
      await addTaskParameterSQL({ data: values });
    }
    resetForm();
  };

  const onSubmit = (data, resetForm) => {
    handleSqlExecutionSubmit(data, values, addOrEditRecordSqlexe, resetForm);
  };

  return (
    <Box
      display="grid"
      gap="10px"
      gridTemplateColumns="repeat(1, minmax(0, 1fr))"
      padding={4}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <Typography variant="h6">DataBase Connections Name</Typography>
            <Box
              display="grid"
              gap="10px"
              gridTemplateColumns="repeat(1, minmax(0, 1fr))"
              width="530px"
              height="50px"
            >
              <Controller
                name="connection_name"
                control={control}
                defaultValue={data.connection_name || ""}
                render={({ field }) => (
                  <Select {...field}>
                    {option_list &&
                      option_list.map((item) => (
                        <MenuItem key={item.id} value={item.name}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
            </Box>
          </div>
          <div>
            <Typography variant="h6">Restart</Typography>
            <Box
              display="grid"
              gap="10px"
              gridTemplateColumns="repeat(1, minmax(0, 1fr))"
              width="350px"
              height="50px"
            >
              <Controller
                name="restart"
                control={control}
                defaultValue={data.restart || ""}
                render={({ field }) => (
                  <Select {...field}>
                    {option_list1 &&
                      option_list1.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.id}
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
            </Box>
          </div>
        </div>
        <br></br>
        <Box sx={{ marginTop: "20px" }}>
          <Typography variant="h6">SQL Execution Table</Typography>
        </Box>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="button" onClick={() => append({})} sx={styles.btnCss}>
            Add
          </Button>
        </div>
        <br></br>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell align="right">SQL Sequence No</TableCell>
                <TableCell align="right">Table Used Description</TableCell>
                <TableCell align="right">SQL Query</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fields.map((field, index) => {
                return (
                  <>
                    <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                      <TableCell align="right">
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 120 }}
                          size="small"
                          fullWidth
                        >
                          <TableCell align="right">
                            <TextField
                              variant="standard"
                              label="Execution Sequence No"
                              required
                              {...register(`SqlExecution[${index}].sql_seq_no`)}
                              name={`SqlExecution[${index}].sql_seq_no`}
                              inputProps={{
                                type: "text",
                              }}
                            />
                          </TableCell>
                        </FormControl>
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          variant="standard"
                          label="Tables Used Description"
                          {...register(
                            `SqlExecution[${index}].table_used_desc`
                          )}
                          name={`SqlExecution[${index}].table_used_desc`}
                          inputProps={{
                            type: "text",
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          variant="standard"
                          label="SQL Query"
                          required
                          {...register(`SqlExecution[${index}].sql_query`)}
                          name={`SqlExecution[${index}].sql_query`}
                          multiline
                          rows={5}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          variant="contained"
                          color="error"
                        >
                          x
                        </Button>
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <br />
        <br />
        <Button type="submit" variant="contained" sx={styles.btnCss}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default SqlExecutionForm;
