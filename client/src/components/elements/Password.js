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
  type,
  ...otherProps
}) => {
  const renderField = () => {
    const shouldDisplayPassword = values.authentication_type === "basic" || (type && type !== "Application");
    
    if (shouldDisplayPassword) {
      return (
        <TextField
          id="standard-basic"
          fullWidth
          variant="outlined"
          type="password"
          label={display_name}
          onBlur={handleBlur}
          onChange={handleChange}
          value={values != null ? values[field_id] || field_value : ""}
          name={field_id}
          error={!!touched[field_id] && !!errors[field_id]}
          helperText={touched[field_id] && errors[field_id]}
          sx={{ gridColumn: "span 4" }}
          {...otherProps}
        />
      );
    } else {
      return null;
    }
  };

  return renderField();
};
export default Password;
