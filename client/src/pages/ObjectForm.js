import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Element from "../components/Element";

const ObjectForm = (props) => {
  const { fieldsList, values, addOrEdit, object } = props;
  const [userSchema, setUserSchema] = useState(null);
  const [action, setAction] = useState(null);
  const [isEditing, setIsEditing] = useState(Boolean(values?.id));

  if (userSchema === null) {
    if (values?.id > 0) {
      setAction("Update");
    } else {
      setAction("Create");
    }

    let validationObject = {};
    fieldsList?.forEach(
      ({ field_id, display_label, required, field_value }) => {
        if (required === "Y") {
          validationObject[field_id] = yup
            .string()
            .required(`${field_id} is required`);
        }
      }
    );
    const validationSchema = yup.object().shape(validationObject);

    setUserSchema(validationSchema);
  }
  //Css for Button
  const styles = {
    btnCss: {
      backgroundColor: "rgb(0, 72, 190)!important",
      boxshadow: "grey 0px 0px 5px!important",
      color: "#FFFFFF!important",
      fontWeight: "800!important",
      fontSize: "13px!important",
    },
  };
  // End of CSS for Button
  const handleFormSubmit = async (values, { resetForm }) => {
    console.log("Handing Form Submit Value: ", values);
    setIsEditing(Boolean(values?.id));
    if (!("id" in values)) {
      values["id"] = 0;
    }
    if (!("created_by" in values)) {
      values["created_by"] = "system";
      values["updated_by"] = "system";
    }
    addOrEdit(values, resetForm);
  };

  return (
    <Box margin="2rem 15rem">
      <Formik
        onSubmit={handleFormSubmit}
        validationSchema={userSchema}
        initialValues={values}
      >
        {({
          values,
          errors,
          touched,
          dirty,
          handleBlur,
          handleChange,
          handleSubmit,
          handleReset,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            >
              {fieldsList
                ? fieldsList.map((field, index) => (
                    <Element
                      key={index}
                      field={field}
                      values={values}
                      touched={touched}
                      errors={errors}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      disabled={isEditing && field.field_id === "password"}
                    />
                  ))
                : null}
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="button"
                className="outline"
                onClick={handleReset}
                disabled={!dirty || isSubmitting}
                sx={styles.btnCss}
              >
                Reset
              </Button>
              &nbsp;
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isSubmitting}
                sx={styles.btnCss}
              >
                {action} {object}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default ObjectForm;
