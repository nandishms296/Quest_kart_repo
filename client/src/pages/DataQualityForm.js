import { useForm, useFieldArray } from "react-hook-form";
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  OutlinedInput,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
} from "@mui/material";

import {
  useGetTasksDQQuery,
  useAddTaskParameterMutation,
  useUpdateTaskParameterMutation,
} from "../state/apiSlice";

import { useState, useEffect } from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const styles = {
  btnCss: {
    backgroundColor: "rgb(0, 72, 190)!important",
    boxshadow: "grey 0px 0px 5px!important",
    color: "#FFFFFF!important",
    fontWeight: "800!important",
    fontSize: "13px!important",
  },
};

function getStyles(option, selectedValues, theme) {
  return {
    fontWeight:
    selectedValues.indexOf(option) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export const DQParameterFields = (props) => {
  const theme = useTheme();
  const { parameterFields, register, fieldName, index, options } = props;
  // const [options, setOptions] = useState([]);
  console.log(parameterFields,"parameterFields");
  console.log(options,"optionsvaluesvalues");
  const [selectedValues, setSelectedValues] = useState([]);
  

  const checkParameterFields = parameterFields.find(
    (rec) => rec.check_name === fieldName
  )?.param_field_list;

  if (checkParameterFields) {
    const sortedParameterFields = checkParameterFields.sort((a, b) => {
      return a.display_sequence - b.display_sequence;
    });

    const displayNames = sortedParameterFields
      .map((rec) => rec.display_name)
      .filter((rec, index, _arr) => _arr.indexOf(rec) === index);  

    const handleSelectChange = (event) => {
      const {
        target: { value },
      } = event;
      setSelectedValues(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
       // {...register(`DataQuality[${index}].${item.field_id}`)}
    };
    return (
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          {fieldName !== "" ? (
            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  {displayNames &&
                    displayNames.map((name, index) => (
                      <TableCell key={index}>{name}</TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {sortedParameterFields &&
                    sortedParameterFields.map((item, paramIndex) => (
                      <TableCell key={paramIndex} component="th" scope="row">
                        {item.field_type === 'multiselect' ? (
                          <Select
                            multiple
                            variant="outlined"
                            {...register(`DataQuality[${index}].${item.field_id}`)}
                            value={selectedValues}
                            onChange={handleSelectChange}
                            input={<OutlinedInput label="Name" />}
                            MenuProps={MenuProps}
                          >
                            {options.map((option) => (
                              <MenuItem key={option} value={option} style={getStyles(option, selectedValues, theme)}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        ) : (
                          <TextField
                            variant="standard"
                            {...register(`DataQuality[${index}].${item.field_id}`)}
                          />
                        )}
                      </TableCell>
                    ))}
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <Box>
              <Typography variant="h6">
                Data Quality Check is not selected.
              </Typography>
            </Box>
          )}
        </TableCell>
      </TableRow>
    );
  } else {
    return null;
  }
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

//*********************

const DataQualityForm = ({
  taskFormFields,
  values,
  addOrEditRecord,
  formType,
}) => {


  const [addTaskParameter] = useAddTaskParameterMutation();
  const [updateTaskParameter] = useUpdateTaskParameterMutation();
  const { data: tasksRecords } = useGetTasksDQQuery(values.id);


  console.log(tasksRecords,"tasksRecords")
  const editValue = {
    dq_pre_check: "",
    dq_post_check: "",
    DataQuality: []
  };
  
  console.log(values?.details?.Source, "valuesss");
  console.log(values?.details?.DataQuality, "view to take");
  
  editValue.dq_pre_check = values.details.DataQuality?.parameters?.dq_pre_check === "1";
  editValue.dq_post_check = values.details.DataQuality?.parameters?.dq_post_check === "1";
  
  if (values?.details?.DataQuality !== undefined) {
    for (const item of values.details.DataQuality?.DataQuality) {
      const updatedItem = {
        ...item,
        dq_active: item.dq_active === "1" ? true : false,
        dq_ignore_bad_records: item.dq_ignore_bad_records === "1" ? true : false
      };
  
      const dqList = item.dq_list || '';
      const dqListArray = dqList.split(',').map(item => item.trim());
      updatedItem.dq_list = dqListArray;
  
      editValue.DataQuality.push(updatedItem);
    }
  }
  
  
  console.log(editValue, "editValue12334");
  const [options, setOptions] = useState([]);

  const [data, setData] = useState(editValue);

  console.log("Data:1 ", data);

  const dataQualityRecord = findSectionField(taskFormFields, formType);

  let executionCheckForm = JSON.parse(
    JSON.stringify(dataQualityRecord.fields_list.executioncheck)
  );
  let dataQualityMultiForm = JSON.parse(
    JSON.stringify(dataQualityRecord.fields_list.record)
  );

  executionCheckForm.sort((a, b) => {
    return a.display_sequence - b.display_sequence;
  });

  dataQualityMultiForm.sort((a, b) => {
    return a.display_sequence - b.display_sequence;
  });
   
  console.log(dataQualityMultiForm,"dataQualityMultiForm")

  const checkFieldOptionList = dataQualityMultiForm.find(
    (rec) => rec.field_id === "dq_check"
  ).option_list;

  console.log(checkFieldOptionList,"checkFieldOptionList");
  
  const parameterFields = dataQualityMultiForm.find(
    (rec) => rec.field_id === "dq_parameters"
  ).params_field_list;

  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: data,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "DataQuality",
  });

  useEffect(() => {
    if (values?.details?.Source.src_table_name && values?.details?.Source?.src_connection_name) {
      const url = `http://localhost:8080/api/preview/mysql/?connection_id=${values?.details?.Source?.src_connection_name}&table_name=${values?.details?.Source?.src_table_name}`
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const actualColumnsArray = data.metaDataInfo.map(item => item.actualColumns);
          const columns = data.columns || [];
          const fieldValues = columns.map((column) => column.field);
          setOptions(actualColumnsArray);
        })
        .catch((error) => console.error("Error fetching options:", error));
    }
  }, [values?.details?.Source?.src_table_name, values?.details?.Source?.src_connection_name]);

  console.log(options,"optionsss")

  const handleSelectChange = (index) => (e) => {
    const param_init_values = parameterFields.find(
      (rec) => rec.check_name === e.target.value
    ).param_initial_list;

    const { DataQuality, ...checkFields } = data;
    setValue(e.target.name, e.target.value);

    const newDQArray = DataQuality.map((item, i) => {
      if (index === i) {
        return {
          ...item,
          dq_check: e.target.value,
          ...{ ...param_init_values },
        };
      } else {
        return item;
      }
    });
    const newData = { DataQuality: newDQArray, ...checkFields };
    setData(newData);
    console.log("New Data: ", data);
  };

  const addOrEditRecordDQ = async (values, resetForm, row) => {
    if (tasksRecords?.data[0]?.id > 0) {
      await updateTaskParameter({ data: values, task_id: row });
    } else {
      await addTaskParameter({ data: values });
    }
    resetForm();
  };

  const onSubmit = (data, resetForm) => {
    // setData(data);
    console.log(data,"submitted");


    const updatedData = {
      ...data,
      DataQuality: data.DataQuality.map((item, idx) => ({
        ...item,
        idx: idx + 1,
      }))
    };

    console.log(updatedData, "updatedData");

    const cleanedData = JSON.parse(JSON.stringify(updatedData).replace(/"dq_/g, '"'));

    console.log(cleanedData, "cleanedData");

    const restructuredData = [];

    // Add main task entries
    restructuredData.push(
      {
        "task_id": values.id,
        "task_type": "DataQuality",
        "parameter_type": "parameters",
        "key_01": "pre_check",
        "value_01": cleanedData.pre_check !== "" ? cleanedData.pre_check : false,
        "is_active": "Y",
        "created_by": "admin",
        "sequence": 1
      },
      {
        "task_id": values.id,
        "task_type": "DataQuality",
        "parameter_type": "parameters",
        "key_01": "post_check",
        "value_01": cleanedData.post_check !== "" ? cleanedData.post_check : false,
        "is_active": "Y",
        "created_by": "admin",
        "sequence": 2
      }
    );

    // Process DataQuality array
    cleanedData.DataQuality.forEach((item, idx) => {

      const parameterType = item.idx;
      const dynamicKeys = Object.keys(item).filter(key => key !== "idx");

      dynamicKeys.forEach((key, sequence) => {
        const restructuredItem = {
          "task_id": values.id,
          "task_type": "DataQuality",
          "parameter_type": parameterType,
          "key_01": key,
          "value_01": item[key],
          "is_active": "Y",
          "created_by": "admin",
          "sequence": sequence + 3 // Add 3 to start the sequence from 3
        };

        restructuredData.push(restructuredItem);
      });
    });

    // Output the restructured data

    for (let i = 0; i < restructuredData.length; i++) {
      if (Array.isArray(restructuredData[i].value_01)) {
        restructuredData[i].value_01 = restructuredData[i].value_01.join(",");
      }
    }

    console.log(restructuredData, "restructuredData1");
    let taskRecordDQ = { details: restructuredData };

    addOrEditRecordDQ(taskRecordDQ, resetForm, values.id);
  };

  return (
    <Box
      display="grid"
      gap="10px"
      gridTemplateColumns="repeat(1, minmax(0, 1fr))"
      padding={4}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Typography variant="h6">Execution Check Fields</Typography>
        </Box>
        <Box
          display="grid"
          gap="10px"
          gridTemplateColumns="repeat(2, minmax(0, 1fr))"
        >
          {executionCheckForm &&
            executionCheckForm.map((field, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    {...register(field.field_id)}
                    checked={watch(field.field_id)}
                  />
                }
                label={field.display_name}
              />
            ))}
        </Box>
        <Box sx={{ marginTop: "20px" }}>
          <Typography variant="h6">Data Quatity Form</Typography>
        </Box>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell align="right">Check Type</TableCell>
                <TableCell align="right">Data Quality Check</TableCell>
                <TableCell align="right">Threshold Bad Records</TableCell>
                <TableCell align="right">Ignore Bad Records</TableCell>
                <TableCell align="right">Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fields.map((field, index) => {
                return (
                  <>
                    <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                      <TableCell component="th" scope="row">
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 120 }}
                          size="small"
                        >
                          <Select
                            {...register(`DataQuality[${index}].dq_type`)}
                            value={watch(`DataQuality[${index}].dq_type`)}
                            onChange={(e) =>
                              setValue(e.target.name, e.target.value)
                            }
                          >
                            <MenuItem value="pre_check">Pre Check</MenuItem>
                            <MenuItem value="post_check">Post Check</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell align="right">
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 120 }}
                          size="small"
                          fullWidth
                        >
                          <Select
                            {...register(`DataQuality[${index}].dq_check`)}
                            value={watch(`DataQuality[${index}].dq_check`)}
                            onChange={handleSelectChange(index)}
                          >
                            {checkFieldOptionList &&
                              checkFieldOptionList.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                  {item.name}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          variant="standard"
                          {...register(
                            `DataQuality[${index}].dq_threshold_bad_records`
                          )}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...register(
                                `DataQuality[${index}].dq_ignore_bad_records`
                              )}
                              checked={watch(
                                `DataQuality[${index}].dq_ignore_bad_records`
                              )}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell align="right">
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...register(`DataQuality[${index}].dq_active`)}
                              checked={watch(`DataQuality[${index}].dq_active`)}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          sx={styles.btnCss}
                        >
                          X
                        </Button>
                      </TableCell>
                    </TableRow>

                    
                    <DQParameterFields
                      fieldName={watch(`DataQuality[${index}].dq_check`)}
                      options ={options}
                      parameterFields={parameterFields}
                      register={register}
                      index={index} // Pass the index prop
                    />
                  </>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Button type="button" onClick={() => append({})} sx={styles.btnCss}>
          Add
        </Button>
        <br />

        <Button type="submit" variant="contained" sx={styles.btnCss}>
          Submit
        </Button>

      </form>
    </Box>
  );
};

export default DataQualityForm;