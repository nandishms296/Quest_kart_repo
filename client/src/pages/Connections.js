import React, { useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Collapse,
  Avatar,
} from "@mui/material";
import {
  useGetConnectionsQuery,
  useGetConnectionFormQuery,
  useAddConnectionMutation,
  useUpdateConnectionMutation,
} from "../state/apiSlice";
import CryptoJS from "crypto-js";
import crypto from 'crypto';
import URLSafeBase64 from 'urlsafe-base64';

import { ModeEditOutline } from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import ConnectionForm from "./ConnectionForm";
import Popup from "components/Popup";
import Header from "components/Header";

const styles = {
  cssBtnCreate: {
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
  },
  myBorder: {
    border: "2px solid green",
  },
  myFont: {
    color: "blue",
  },
  editButton: {
    borderRadius: "6px!important",
    minWidth: "25px!important",
    minHeight: "25px!important",
    marginTop: "-12px!important",
    marginRight: "-56px!important",
    color: "#FFFFFF!important",
    backgroundColor: "#0589f9ba!Important",
  },
  btbText: {
    textecoration: "none!important",
    color: "#d91a1a!important",
  },
};

const Connection = (props) => {
  const { record, openInPopup } = props;
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  console.log(
    record.id,
    record.project_id,
    record.project_name,
    record.connection_type,
    record.connection_subtype,
    record.connection_name,
    record.fields_list
  );
  let connection_subtype = record.connection_subtype;

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }}
    >
      <CardContent>
        <Box>
          <FlexBetween>
            <Typography
              sx={{ fontSize: 14 }}
              color={theme.palette.grey[700]}
              gutterBottom
            >
              ID: {record.id}
            </Typography>
            <Button
              color="secondary"
              onClick={() => {
                openInPopup(record);
              }}
            >
              <ModeEditOutline sx={styles.editButton} />
            </Button>
          </FlexBetween>
        </Box>

        <Typography variant="h5" component="div">
          {record.connection_name}
        </Typography>
        <Typography sx={{ mb: "1.5rem" }} color={theme.palette.primary[400]}>
          {record.connection_type}
        </Typography>
        <Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[400]}>
          {record.connection_subtype}

          <Avatar
            alt={record.connection_subtype}
            sx={{ color: "black" }}
            src={`assets/${connection_subtype
              .toLowerCase()
              .trim()
              .replace(" ", "_")}.png`}
          >
            {record.connection_subtype}
          </Avatar>
        </Typography>

        <Typography variant="body2">
          Project Name - {record.project_name}
        </Typography>
      </CardContent>
      {record.fields_list && (
        <>
          <CardActions>
            <Button
              variant="primary"
              size="small"
              onClick={() => setIsExpanded(!isExpanded)}
              sx={styles.btbText}
            >
              See More
            </Button>
          </CardActions>
          <Collapse
            in={isExpanded}
            timeout="auto"
            unmountOnExit
            sx={{ color: theme.palette.grey[600] }}
          >
            <CardContent>
              {record.fields_list.map((item) => (
                <Typography variant="h5">
                  {Object.keys(item)[0]} = {Object.values(item)[0]}
                </Typography>
              ))}
            </CardContent>
          </Collapse>
        </>
      )}
    </Card>
  );
};



// function decrypt(encrypted) {
//   const CRYPTO_KEY = "8ookgvdIiH2YOgBnAju6Nmxtp14fn8d3";
//   const CRYPTO_IV = "rBEssDfxofOveRxR";
//   encrypted = URLSafeBase64.decode(encrypted);
//   let decipher = crypto.createDecipheriv("AES-256-CBC", CRYPTO_KEY, CRYPTO_IV);
//   // Base64 to UTF-8 decoding
//   let decrypted = decipher.update(encrypted, "base64", "utf8");
//   decrypted += decipher.final("utf8");
//   return decrypted;
// }
function decrypt(encrypted) {
  const CRYPTO_KEY = "8ookgvdIiH2YOgBnAju6Nmxtp14fn8d3";
  const CRYPTO_IV = "rBEssDfxofOveRxR";
  encrypted = Buffer.from(encrypted, "base64");
  let decipher = crypto.createDecipheriv("aes-256-cbc", CRYPTO_KEY, CRYPTO_IV);
  decipher.setAutoPadding(true);
  let decrypted = decipher.update(encrypted, "binary", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}






const Connections = () => {
  const isNonMobile = useMediaQuery("(min-width: 1000px)");

  const { data: connectionRecords, isLoading: isRecordLoading } =
    useGetConnectionsQuery();
  const { data: formData, isLoading: isFormLoading } =
    useGetConnectionFormQuery();
    console.log(connectionRecords,"12345")
  const [initValue, setInitValue] = useState(null);
  const [fieldsList, setFieldsList] = useState(null);
  const [connformData, setConnFormData] = useState(null);

  const [recordForEdit, setRecordForEdit] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);

  const [addConnection] = useAddConnectionMutation();
  const [updateConnection] = useUpdateConnectionMutation();

  // const decryptedRecords = connectionRecords?.map(record => {
    
  //   const decryptedFields = record?.fields_list?.map(field => {

  //     console.log(field.password,"field")
  //     if (field.password) {

  //       return {
  //         ...field,
  //         password: decrypt(field?.password)
  //       }
  //     }
  //     return field
  //   })
  //   return {
  //     ...record,
  //     fields_list: decryptedFields
  //   }
  // })

  const decryptedRecords = connectionRecords?.map(record => {
    const decryptedFields = record?.fields_list?.map(field => {
      console.log(field.password,"field")
      if (field.password || field.access_key || field.secret_access_key) {
        const decryptedField = { ...field }
        if (field.password) {
          decryptedField.password = decrypt(field.password)
        }
        if (field.access_key) {
          decryptedField.access_key = decrypt(field.access_key)
        }
        if (field.secret_access_key) {
          decryptedField.secret_access_key = decrypt(field.secret_access_key)
        }
        return decryptedField
      }
      return field
    })
    return {
      ...record,
      fields_list: decryptedFields
    }
  })
  
 let encryptt = "vWqJ79UdCktFtezt2SY3bQ"
  console.log(decryptedRecords, "54321")
  console.log(decrypt(encryptt),"decrypted")
  // const decryptedRecords = connectionRecords?.map((record) => {

  //   // const decryptedFields = record?.map((field) => {
  //   //   console.log(field)
  //   // })
  //   console.log(record.fields_list,"54321");
  // })
    
    

  // connectionRecords.forEach((record) => {
  //   record.fields_list.forEach((field) => {
  //     if (field.password ) {
  //       field.password = decrypt(field.password);
  //     }
  //   });
  // });
  
  if (!isFormLoading && initValue === null && fieldsList === null) {
    let initvalue = { ...formData[0].initialvalues };
    if (
      !("connection_type" in initvalue) &&
      !("connection_subtype" in initvalue)
    ) {
      initvalue["connection_type"] = "";
      initvalue["connection_subtype"] = "";
    }

    setInitValue(initvalue);

    setFieldsList(formData[0].field_list);
    
    setConnFormData(formData);
  }

  const addOrEditConn = async (values, resetForm) => {
    // encrypt the password here
    if (values?.id > 0) {
      await updateConnection({ data: values, connection_id: values.id });
    } else {
      await addConnection({ data: values });
    }

    console.log("Values: ", values);
    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
  };

  const openInPopup = (item) => {
    // decrypt the password here.
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  return (
    <>
      <Box m="1.5rem 2.5rem">
        <FlexBetween>
          <Header
            title="Connections"
            subtitle="See your list of Connections."
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setOpenPopup(true);
              setRecordForEdit(initValue);
            }}
            sx={styles.cssBtnCreate}
          >
            Create Connection
          </Button>
        </FlexBetween>
      </Box>
      <Box m="1.5rem 2.5rem">
        {decryptedRecords || !isRecordLoading ? (
          <Box
            mt="20px"
            display="grid"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            justifyContent="space-between"
            rowGap="20px"
            columnGap="1.33%"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {decryptedRecords.map((record) => (
              <Connection
                key={record.id}
                record={record}
                openInPopup={openInPopup}
              />
            ))}
          </Box>
        ) : (
          <>Loading...</>
        )}
      </Box>
      <Popup
        title="Connection Form"
        openPopup={openPopup}
        width={"md"}
        setOpenPopup={setOpenPopup}
      >
        <ConnectionForm
          formData={connformData}
          value={recordForEdit}
          addOrEditConn={addOrEditConn}
        />
      </Popup>
    </>
  );
};

export default Connections;
