import React from "react";
import { Box } from "@mui/material";
import Element from "components/Element";

const TaskForm = (props) => {
  const { taskProps, formProps } = props;
  const { fields_list: fieldsList } = taskProps;

  console.log("Object: ", formProps);

  return (
    <Box margin="2rem 15rem">
      <Box
        display="grid"
        gap="30px"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
      >
        {fieldsList
          ? fieldsList.map(
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
                  handleBlur={formProps.handleBlur}
                  handleChange={formProps.handleChange}
                />
              )
            )
          : null}
      </Box>
    </Box>
  );
};

export default TaskForm;
