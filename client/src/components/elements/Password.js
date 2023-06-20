import { TextField } from "@mui/material";

const Password = ({
  field_id,
  display_name,
  field_value,
  handleBlur,
  handleChange,
  touched,
  errors,
  values,
  ...otherProps
}) => {
  return (
    <TextField
      id="standard-basic"
      variant="outlined"
      type={"password"}
      label={display_name}
      onBlur={handleBlur}
      onChange={handleChange}
      value={values != null || values !== {} ? values[field_id] : field_value}
      name={field_id}
      error={!!touched[field_id] && !!errors[field_id]}
      helperText={touched[field_id] && errors[field_id]}
      sx={{ gridColumn: "span 4" }}
      otherProps
    />
  );
};

export default Password;
