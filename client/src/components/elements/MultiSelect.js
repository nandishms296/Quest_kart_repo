import React from "react";
import {
  Select as MuiSelect,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const MultiSelect = (props) => {
  const {
    field_id,
    display_name,
    options,
    handleBlur,
    handleChange,
    touched,
    errors,
    values,
  } = props;
  return (
    <FormControl sx={{ gridColumn: "span 4" }}>
      <InputLabel id="select-helper-mui5-label">{display_name}</InputLabel>
      <MuiSelect
        id="select-helper-mui5-label"
        label={display_name}
        name={field_id}
        multiple
        value={(values && values.list) || []} 
        onBlur={handleBlur}
        onChange={handleChange}
        error={!!touched[field_id] && !!errors[field_id]}
        helperText={touched[field_id] && errors[field_id]}
        sx={{ gridColumn: "span 4" }}
      >
        <MenuItem value="">None</MenuItem>
        {options &&
          options.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
      </MuiSelect>
    </FormControl>
  );
};
export default MultiSelect;
