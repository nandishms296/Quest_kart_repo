import React from "react";
import { at } from "lodash";
import { useField } from "formik";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";

const CheckBox = (props) => {
  const { display_name, values, ...rest } = props;
  const [field, meta, helper] = useField(props);
  const { setValue } = helper;

  console.log("checkbox",props)

  function _renderHelperText() {
    const [touched, error] = at(meta, "touched", "error");
    if (touched && error) {
      return <FormHelperText>{error}</FormHelperText>;
    }
  }

  const _onChange = (evt) => {
    setValue(evt.target.checked ? "Y" : "N");
  };

  return (
    <FormControl {...rest}>
      <FormControlLabel
        value={values === "Y" ? true : false}
        checked={values === "Y" ? true : false}
        control={<Checkbox {...field} onChange={_onChange} />}
        label={display_name}
      />
      {_renderHelperText()}
    </FormControl>
  );
};

export default CheckBox;
