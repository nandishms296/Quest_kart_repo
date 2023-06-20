import React, { useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Typography,
  useMediaQuery,
  Button,
  useTheme,
} from "@mui/material";
import { ModeEditOutline } from "@mui/icons-material";

import FlexBetween from "components/FlexBetween";
import {
  useGetProgramsQuery,
  useGetObjectFormQuery,
  useAddObjectMutation,
  useUpdateObjectMutation,
} from "../state/apiSlice";
import Header from "components/Header";
import { Link } from "react-router-dom";
import Popup from "components/Popup";
import ObjectForm from "pages/ObjectForm";

const Programs = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");

  const { data: formData, isLoading: isFormLoading } =
    useGetObjectFormQuery("Program");
  const { data: programRecords, isLoading: isRecordLoading } =
    useGetProgramsQuery();

  const [addObject] = useAddObjectMutation();
  const [updateObject] = useUpdateObjectMutation();

  const [initValue, setInitValue] = useState(null);
  const [fieldsList, setFieldList] = useState(null);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);

  const addOrEdit = async (values, resetForm) => {
    if (values?.id === 0) {
      await addObject({ object: "program", data: values });
    } else {
      await updateObject({ object: "program", data: values });
    }
    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
  };

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };
  // Css for Button
  const styles = {
    myBackground: {
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
  };

  if (formData && !isFormLoading && initValue === null && !isRecordLoading) {
    setInitValue(formData[0].initialvalues);
    setFieldList(formData[0].field_list);
  }

  return (
    <>
      <Box m="1.5rem 2.5rem">
        <FlexBetween>
          <Header title="Programs" subtitle="See your list of Programs." />
          <Button
            onClick={() => {
              setOpenPopup(true);
              setRecordForEdit(initValue || {});
            }}
            sx={styles.myBackground}
            style={styles.myBorder}
            // classes={styles.myFont}
          >
            Create Program
          </Button>
        </FlexBetween>
      </Box>
      <Box m="1.5rem 2.5rem">
        {programRecords && !isRecordLoading ? (
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
            {programRecords.map((item) => (
              <Card
                key={item.id}
                sx={{
                  backgroundImage: "none",
                  backgroundColor: theme.palette.background.alt,
                  borderRadius: "0.55rem",
                }}
              >
                <CardContent>
                  <FlexBetween>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color={theme.palette.grey[700]}
                      gutterBottom
                    >
                      ID: {item.id}
                    </Typography>
                    <Button
                      color="secondary"
                      onClick={() => {
                        openInPopup(item);
                      }}
                    >
                      <ModeEditOutline sx={styles.editButton} />
                      {/* <EditIcon /> */}
                    </Button>
                  </FlexBetween>
                  <Typography variant="h5" component="div">
                    {item.program_name}
                  </Typography>
                  <Typography
                    sx={{ mb: "1.5rem" }}
                    color={theme.palette.primary[400]}
                  >
                    {item.primary_stakeholder}
                  </Typography>
                  <Typography
                    sx={{ mb: "1.5rem" }}
                    color={theme.palette.secondary[400]}
                  >
                    {item.secondary_stakeholder}
                  </Typography>
                  {/* <Typography variant="body2"> */}
                  <div sx={{ height: "60px" }}>{item.program_description}</div>
                  {/* </Typography> */}
                </CardContent>
                <CardActions>
                  <Link to={`/projects/${item.id}`}>Explore Projects</Link>
                </CardActions>
              </Card>
            ))}
          </Box>
        ) : (
          <>Loading...</>
        )}
      </Box>
      <Popup
        title="Program Form"
        openPopup={openPopup}
        width={"md"}
        setOpenPopup={setOpenPopup}
      >
        <ObjectForm
          fieldsList={fieldsList}
          values={recordForEdit}
          addOrEdit={addOrEdit}
          object={"Program"}
        />
      </Popup>
    </>
  );
};

export default Programs;
