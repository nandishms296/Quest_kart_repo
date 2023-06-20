import React from "react";
import Input from "./elements/Input";
import TextArea from "./elements/TextArea";
import CheckBox from "./elements/CheckBox";
import Select from "./elements/Select";
import Password from "./elements/Password";
import ToggleButton from "./elements/ToggleButton";
import MultiSelect from "./elements/MultiSelect";
import Components from "./elements/Components";
import Text from "./elements/Text"


const Element = ({
  field: {
    field_type,
    field_id,
    field_value,
    display_name,
    option_list,
    params_field_list,
  },
  type,
  values,
  touched,
  errors,
  handleBlur,
  handleChange,
  selectedCheck,
  setFormValues,
  ...otherProps
}) => {
  switch (field_type) {
    case "text":
      return (
        <Input
          field_id={field_id}
          display_name={display_name}
          handleBlur={handleBlur}
          handleChange={handleChange}
          values={values}
          field_value={field_value}
          touched={touched}
          errors={errors}
        />
      );
      case "input":
        return (
          <Text
            field_id={field_id}
            display_name={display_name}
            handleBlur={handleBlur}
            handleChange={handleChange}
            values={values}
            field_value={field_value}
            touched={touched}
            errors={errors}
          />
        );
    case "password":
      return (
        <Password
          field_id={field_id}
          display_name={display_name}
          handleBlur={handleBlur}
          handleChange={handleChange}
          values={values}
          type={type}
          field_value={field_value}
          touched={touched}
          errors={errors}
        />
      );
    case "textarea":
      return (
        <TextArea
          field_id={field_id}
          display_name={display_name}
          handleBlur={handleBlur}
          handleChange={handleChange}
          values={values}
          field_value={field_value}
          touched={touched}
          errors={errors}
        />
      );
    case "checkbox":
      return (
        <CheckBox
          name={field_id}
          display_name={display_name}
          handleBlur={handleBlur}
          handleChange={handleChange}
          values={values[field_id]}
          touched={touched}
          errors={errors}
          otherProps={otherProps}
        />
      );
    case "select":
      return (
        <Select
          field_id={field_id}
          display_name={display_name}
          handleBlur={handleBlur}
          handleChange={handleChange}
          values={values}
          touched={touched}
          errors={errors}
          options={option_list || []}
        />
      );
    case "multiselect":
      return (
        <MultiSelect
          field_id={field_id}
          display_name={display_name}
          handleBlur={handleBlur}
          handleChange={handleChange}
          values={values}
          touched={touched}
          errors={errors}
          options={option_list || []}
        />
      );
    case "togglebutton":
      return (
        <ToggleButton
          field_id={field_id}
          display_name={display_name}
          handleBlur={handleBlur}
          handleChange={handleChange}
          checked={values[field_id]}
          touched={touched}
          errors={errors}
        />
      );

    case "component":
      return (
        <Components
          field={{ params_field_list }}
          selectedCheck={selectedCheck}
          formValues={values}
          setFormValues={setFormValues}
        />
      );
    default:
      return null;
  }
};

export default Element;
