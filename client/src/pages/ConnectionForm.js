import React, { useState } from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Typography,
  Avatar,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Element from "../components/Element";
import axios from "axios";
import crypto from "crypto";

import { Buffer } from "buffer";
import URLSafeBase64 from "urlsafe-base64";
// @ts-ignore
window.Buffer = Buffer;

function encrypt(val) {
  const CRYPTO_KEY = "8ookgvdIiH2YOgBnAju6Nmxtp14fn8d3";
  const CRYPTO_IV = "rBEssDfxofOveRxR";
  let cipher = crypto.createCipheriv("aes-256-cbc", CRYPTO_KEY, CRYPTO_IV);
  // UTF-8 to Base64 encoding
  let encrypted = cipher.update(val, "utf8", "base64");
  encrypted += cipher.final("base64");
  return URLSafeBase64.encode(encrypted);
}

// Css strt from here
const styles = {
  cssBtnTest: {
    fontSize: "14px",
    fontWeight: "800",
    borderRadius: "6px",
    border: "2px solid green",
    boxshadow: "grey 0px 0px 5px!important",
    backgroundColor: "#185c0c!important", // "rgb(0, 72, 190)!important",
    color: "#FFFFFF!important",
    textTransform: "upper",
    lineHeight: 1.5,
    padding: "7px 9px",
    width: "170px",
    height: "40px",
  },
  cssBtnResets: {
    fontSize: "14px",
    fontWeight: "800",
    borderRadius: "6px",
    border: "2px",
    boxshadow: "grey 0px 0px 5px!important",
    backgroundColor: "rgb(41, 44, 41,1)!important",
    color: "#FFFFFF!important",
    textTransform: "upper",
    lineHeight: 1.5,
    padding: "7px 9px",
    height: "40px",
    marginLeft: "10px!important",
    marginRight: "10px!important",
  },
  cssBtnSave: {
    fontSize: "14px",
    fontWeight: "800",
    borderRadius: "6px",
    border: "2px solid green",
    boxshadow: "grey 0px 0px 5px!important",
    backgroundColor: "rgb(0, 72, 190)!important",
    color: "#FFFFFF!important",
    textTransform: "upper",
    lineHeight: 1.5,
    padding: "7px 9px",
    width: "170px",
    height: "40px",
  },
  cssBtnEnabled: {
    fontSize: "14px",
    fontWeight: "800",
    borderRadius: "6px",
    border: "2px solid green",
    boxShadow: "grey 0px 0px 5px!important",
    backgroundColor: "rgb(0, 72, 190)!important",
    color: "#FFFFFF!important",
    textTransform: "uppercase",
    lineHeight: 1.5,
    padding: "7px 9px",
    width: "170px",
    height: "40px",
  },
  
  cssBtnDisabled: {
    fontSize: "14px",
    fontWeight: "800",
    borderRadius: "6px",
    border: "2px solid grey",
    boxShadow: "none!important",
    backgroundColor: "grey!important",
    color: "#FFFFFF!important",
    textTransform: "uppercase",
    lineHeight: 1.5,
    padding: "7px 9px",
    width: "170px",
    height: "40px",
  },
  conTypeSelected: {
    fontWeight: "800!important",
    color: "#488ac9!important",
    marginTop: "-20px!important",
    marginLeft: "160px!important",
    fontSize: "15px!important",
  },
  conTypeText: {
    fontWeight: "800",
    color: "rgb(36 7 58)",
    fontSize: "14px",
  },
};

const ConnectionForm = (props) => {
  const { formData, value, addOrEditConn } = props;
console.log("values",formData);

  const [currConnType, setCurrConnType] = useState(null);
  const [currSubConnType, setCurrSubConnType] = useState(null);
  const [connType, setConnType] = useState(null);
  const [connSubType, setConnSubType] = useState(null);
  const [initialValues, setInitialValues] = useState(value);
  const [connFieldForm, setConnFieldForm] = useState([value]);
  const [userSchema, setUserSchema] = useState(null);
  const [errors, setErrors] = useState(null);
  const [isConnSuccess, setIsConnSuccess] = useState(null);

  const loadConnSubType = (subTypeValue) => {
    try {
      console.log("Default assigned CurrentConnType: ", subTypeValue);
      let subConnTypeList = formData.filter(
        (item) => item.connection_subtype === subTypeValue
      );
      console.log("List of SubConnTypeList: ", subConnTypeList);

      let fieldList = Object.assign([], subConnTypeList[0].fields_list);

      fieldList.sort(function (a, b) {
        return a.display_sequence - b.display_sequence;
      });

      setConnFieldForm(fieldList);
      // set UserSchema
      loadUserSchema(fieldList);
      // set the initalValues.
      if (value?.connection_type != null && value?.connection_type !== "") {
        let fields = Object.assign({}, ...value.fields_list);
        const val = {
          connection_name: value.connection_name,
          connection_type: value.connection_type,
          connection_subtype: value.connection_subtype,
          project_id: value.project_id,
          id: value?.id || 0,
        };
        const defaulValue = { ...val, ...fields };
        setInitialValues(defaulValue);
      } else {
        setInitialValues(subConnTypeList[0].initialvalues);
      }
    } catch (err) {
      setErrors("Error while reading Records");
    }
  };


  const loadUserSchema = (fields_list) => {
    let validationObject = {};
    fields_list.forEach(({ field_id, display_label, required }) => {
      if (required === "R") {
        validationObject[field_id] = yup
          .string()
          .required(`${display_label} is required`);
      }
    });
    const validationSchema = yup.object().shape(validationObject);
    setUserSchema(validationSchema);
  };

  const fetchConnSubType = (newValue) => {
    console.log("updateConnSubType:- SubType Value: ", newValue);
    let subType = formData
      .filter((item) => item.connection_type === newValue)
      .map((value) => value.connection_subtype)
      .filter((value, index, _arr) => _arr.indexOf(value) === index);

    console.log("updateConnSubType:- SubType List: ", subType);
    setConnSubType(subType);
    if (value?.connection_subtype != null && value?.connection_subtype !== "") {
      setCurrSubConnType(value["connection_subtype"]);
      loadConnSubType(value["connection_subtype"]);
    } else {
      setCurrSubConnType(subType[0]);
      loadConnSubType(subType[0]);
    }
  };

  if (formData && !connType) {
    const connList = formData
      .map((rec) => rec.connection_type)
      .filter((rec, index, _arr) => _arr.indexOf(rec) === index);
    setConnType(connList);
    if (value?.connection_type != null && value?.connection_type !== "") {
      setCurrConnType(value["connection_type"]);
    } else {
      setCurrConnType(connList[0]);
    }
  }

  if (formData && connType && !connSubType) {
    fetchConnSubType(currConnType);
    setCurrConnType(currConnType);
  }

  const handleConnTypeChange = (event, newValue) => {
    fetchConnSubType(newValue);
    setCurrConnType(newValue);
  };
  const handleConnSubTypeChange = (event, newValue) => {
    console.log("SubType Value: ", newValue);
    setCurrSubConnType(newValue);
    loadConnSubType(newValue);
  };

  const [url, seturl] = useState(null);
  const testConnection = async (values) => {
    try {
      const subType = values.connection_subtype.replace(/ /g, "").toLowerCase();
      console.log(values, "subTypsdgve");
      if (subType == "restapi") {
        const URL_POST = `${process.env.REACT_APP_BASE_URL}/api/testconnection/${subType}/${values.authentication_type}`;
        seturl(URL_POST);
      } else {
        const URL_POST = `${process.env.REACT_APP_BASE_URL}/api/testconnection/${subType}`;
        seturl(URL_POST);
      }
      if ("password" in values) {
        values.password = encrypt(values.password);
      }
      // values.password = encrypt(values.password);
      const result = await axios.post(url, values);
      console.log(result);
      alert(`Connection Successful`);
      setIsConnSuccess(true);
    } catch (error) {
      alert(`Error: ${error}`);
      setIsConnSuccess(false);
    }
  };

  let obj = [];
  console.log("connFieldForm", connFieldForm);
  for (let i = 0; i < connFieldForm?.length; i++) {
    obj = connFieldForm[i]?.field_id;
    console.log("field values.......................", obj);
  }

  const handleFormSubmit = async (values, { resetForm }) => {
    console.log("123", values);
    let connectionValues = {
      ...values,
      connection_type: currConnType,
      connection_subtype: currSubConnType,
    };

    let tblConnection = {
      connection_type: currConnType,
      connection_subtype: currSubConnType,
      connection_name: values.connection_name,
      project_id: values.project_id,
      id: values?.id || 0,
    };

    Object.keys(tblConnection).forEach((prop) => delete connectionValues[prop]);

    const connDetails = [];
    Object.keys(connectionValues).forEach((key, index) => {
      connDetails.push({
        key_01: key,
        value_01: values[key],
        sequence: index + 1,
      });
    });

    const connectionRecord = {
      ...tblConnection,
      details: [...connDetails],
    };

    console.log("connectionRecord :", connectionRecord);

    addOrEditConn(connectionRecord, resetForm);
  };

  function ToggleButtonElement(props) {
    const { alignment, value, connList, handleChange } = props;
    const tabElements = connList?.map((item, index) => {
      return (
        <ToggleButton key={item} value={item} aria-label="left aligned">
          {item}
          <Avatar
            alt={item}
            sx={{ color: "black" }}
            src={`assets/${item.toLowerCase().trim().replace(" ", "_")}.png`}
          >
            {item}
          </Avatar>
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
      {errors ? (
        <Box display="flex" flexDirection="row" sx={{ m: "3rem 1.5rem" }}>
          <Typography variant="h4">{errors}</Typography>
        </Box>
      ) : (
        <Box display="flex" flexDirection="row" sx={{ m: "3rem 1.5rem" }}>
          <Box>
            <ToggleButtonElement
              alignment="vertical"
              value={currConnType}
              connList={connType}
              handleChange={handleConnTypeChange}

              // add here avatar and typography
            />
          </Box>

          <Box flexGrow={1}>
            <Box display="flex" justifyContent="center">
              <ToggleButtonElement
                alignment="center"
                value={currSubConnType}
                connList={connSubType}
                handleChange={handleConnSubTypeChange}
              />
            </Box>
            <Box margin="2rem 15rem">
              <Formik
                enableReinitialize={true}
                onSubmit={handleFormSubmit}
                validationSchema={userSchema}
                initialValues={initialValues}
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
                    <Box display="grid" gap="10px">
                      <Box sx={{ gridColumn: "span 4", marginLeft: "10px" }}>
                        <Typography variant="h6">
                          Connection Type:{" "}
                          <span style={{ color: "#0aabc5" }}>
                            {" "}
                            {currConnType}{" "}
                          </span>
                        </Typography>
                      </Box>
                      <Box sx={{ width: "400px", marginLeft: "10px" }}>
                        <Typography variant="h6">
                          Connection Sub Type:{" "}
                          <span style={{ color: "#0aabc5" }}>
                            {" "}
                            {currSubConnType}{" "}
                          </span>
                        </Typography>
                      </Box>

                      {connFieldForm
                        ? connFieldForm.map((formElement, index) => (
                            <Element
                              key={formElement.field_id}
                              field={formElement}
                              values={values}
                              touched={touched}
                              errors={errors}
                              handleBlur={handleBlur}
                              handleChange={handleChange}
                              type={currConnType}
                            />
                          ))
                        : null}
                    </Box>
                    <Box display="flex" justifyContent="end" mt="30px">
                      <Button
                        type="button"
                        sx={styles.cssBtnTest}
                        onClick={() =>
                          testConnection({
                            connection_type: currConnType,
                            connection_subtype: currSubConnType.replace(
                              /\s/g,
                              ""
                            ),
                            ...values,
                          })
                        }
                      >
                        Test Connection
                      </Button>
                      <Button
                        type="button"
                        className="outline"
                        sx={styles.cssBtnResets}
                        onClick={() => handleReset}
                        disabled={!dirty || isSubmitting}
                      >
                        Reset
                      </Button>
                      <Button
                        type="submit"
                        sx={isConnSuccess ? styles.cssBtnEnabled : styles.cssBtnDisabled}
                        variant="contained"
                        onClick={() => handleFormSubmit}
                        disabled={ isSubmitting || !isConnSuccess}
                      >
                        Save Connection
                      </Button>
                    </Box>
                  </form>
                )}
              </Formik>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ConnectionForm;
