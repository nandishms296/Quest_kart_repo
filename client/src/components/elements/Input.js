import React from "react";
import { TextField } from "@mui/material";

const Input = ({
  field_id,
  display_name,
  field_type,
  field_value,
  handleBlur,
  handleChange,
  touched,
  errors,
  values,
  ...otherProps
}) => {
  console.log("otherProps: ", otherProps);

  return (
    <TextField
      id="standard-basic"
      fullWidth
      variant="outlined"
      type={field_type}
      label={display_name}
      onBlur={handleBlur}
      onChange={handleChange}
      value={values != null ? values[field_id] || field_value : ""}
      name={field_id}
      error={!!touched[field_id] && !!errors[field_id]}
      helperText={touched[field_id] && errors[field_id]}
      sx={{ gridColumn: "span 4" }}
      otherProps
    />
  );
};

export default Input;
