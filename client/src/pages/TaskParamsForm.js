import React from "react";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import Element from "components/Element";

const TaskParamsForm = (props) => {
  const { taskProps, formProps, handleConnSubTypeChange, object } = props;
  const {
    connSubTypeList,
    currSrcConnSubType: currConnSubType,
    fieldList: fields_list,
  } = taskProps;

  console.log("Object: ", object);

  let taskParamFieldList = Object.assign([], fields_list);

  taskParamFieldList.sort(function (a, b) {
    return a.display_sequence - b.display_sequence;
  });

  const handleConnTypeChange = (event, newValue) => {
    console.log("SubType Value: ", newValue);
    handleConnSubTypeChange(newValue);
  };

  const onLoseFocus = (event) => {
    /*     const fields = ["src_schema", "src_table_name"];
    const found = fields.some((field) => field === event.target.name);
    if (formProps.values.src_query.replace(/\s+/g, "").length === 0 && found) {
      let schema = formProps.values.src_schema;
      let tablename = formProps.values.src_table_name;
      let query = "";
      if (
        schema.replace(/\s+/g, "").length !== 0 &&
        tablename.replace(/\s+/g, "").length !== 0
      ) {
        query = `select * from ${schema}.${tablename}`;
      }
      if (
        schema.replace(/\s+/g, "").length === 0 &&
        tablename.replace(/\s+/g, "").length !== 0
      ) {
        query = `select * from ${tablename}`;
      }
      console.log("Query: ", query);
      formProps.setFieldValue("src_query", query);
    } */
  };

  function ToggleButtonElement(props) {
    const { alignment, value, connSubList, handleChange } = props;
    const tabElements = connSubList?.map((item, index) => {
      return (
        <ToggleButton key={index} value={item} aria-label="left aligned">
          {item}
        </ToggleButton>
      );
    });
    return (
      <>
        <ToggleButtonGroup
          orientation={alignment}
          value={value}
          exclusive
          onChange={handleChange}
          aria-label="Connection Type"
        >
          {tabElements}
        </ToggleButtonGroup>
      </>
    );
  }

  return (
    <>
      <Box display="flex" flexDirection="row" sx={{ m: "3rem 1.5rem" }}>
        <Box>
          {connSubTypeList ? (
            <ToggleButtonElement
              alignment="vertical"
              value={currConnSubType}
              connSubList={connSubTypeList}
              handleChange={handleConnTypeChange}
            />
          ) : null}
        </Box>
        <Box flexGrow={1}>
          <Box
            display="grid"
            gap="8px"
            gridTemplateColumns="repeat(2, minmax(0, 1fr))"
          >
            {taskParamFieldList
              ? taskParamFieldList.map(
                  (
                    field,
                    index //field_type, field_id, field_value, display_name,option_list
                  ) => (
                    <Element
                      key={index}
                      field={field}
                      values={formProps.values}
                      touched={formProps.touched}
                      errors={formProps.errors}
                      handleBlur={(e) => {
                        onLoseFocus(e);
                      }}
                      handleChange={formProps.handleChange}
                    />
                  )
                )
              : null}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default TaskParamsForm;
