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
  useGetProjectsQuery,
  useGetObjectFormQuery,
  useAddObjectMutation,
  useUpdateObjectMutation,
} from "../state/apiSlice";
import Header from "components/Header";
import { Link, useParams } from "react-router-dom";
import Popup from "components/Popup";
import ObjectForm from "pages/ObjectForm";

const Projects = () => {
  const theme = useTheme();
  const { id } = useParams();
  console.log("Id:", id);
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  const { data: projectRecords, isLoading: isRecordLoading } =
    useGetProjectsQuery(id);
  const { data: formData, isLoading: isFormLoading } =
    useGetObjectFormQuery("Project");
  const [addObject] = useAddObjectMutation();
  const [updateObject] = useUpdateObjectMutation();

  const [initValue, setInitValue] = useState(null);
  const [fieldsList, setFieldList] = useState(null);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);

  if (!isFormLoading && initValue === null && !isRecordLoading) {
    setInitValue(formData[0].initialvalues);
    setFieldList(formData[0].field_list);
  }

  const addOrEdit = async (values, resetForm) => {
    if (values?.id === 0) {
      await addObject({ object: "project", data: values });
    } else {
      await updateObject({ object: "project", data: values });
    }
    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
  };

  let pageTitle = "Projects";
  let pageSubTitle = "See your list of Project.";
  if (typeof id !== "undefined") {
    pageTitle = "Programs -> Projects";
    pageSubTitle = "Details of Project of Program ID : " + id;
  }

  const openInPopup = (item) => {
    if (id !== undefined) {
      item["program_id"] = id;
    }
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  // CSS for Edit Icons on CARDS
  const styles = {
    editButton: {
      borderRadius: "6px!important",
      minWidth: "25px!important",
      minHeight: "25px!important",
      marginTop: "-12px!important",
      marginRight: "-56px!important",
      color: "#FFFFFF!important",
      fontWeight: "bold!important",
      backgroundColor: "#0589f9ba!Important",
    },
    cssBtnCreate: {
      fontSize: "14px",
      fontWeight: "bold",
      borderRadius: "6px",
      border: "2px solid green",
      boxshadow: "grey 0px 0px 5px!important",
      backgroundColor: "rgb(0, 72, 190)!important",
      color: "#FFFFFF!important",
      textTransform: "upper",
      lineHeight: 1.5,
      padding: "7px 9px",
    },
  };

  return (
    <>
      <Box m="1.5rem 2.5rem">
        <FlexBetween>
          <Header title={pageTitle} subtitle={pageSubTitle} />
          {/* <Header title="Projects" subtitle="See your list of Project." /> */}
          <Button
            onClick={() => {
              setOpenPopup(true);
              setRecordForEdit(initValue);
            }}
            sx={styles.cssBtnCreate}
          >
            Create Projects
          </Button>
        </FlexBetween>
      </Box>
      <Box m="1.5rem 2.5rem">
        {projectRecords?.length === 0 && !isRecordLoading ? (
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
            <Typography variant="h5">
              No Project belongs to Program Id: {id}
            </Typography>
          </Box>
        ) : (
          <></>
        )}
        {projectRecords || !isRecordLoading ? (
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
            {projectRecords.map((item) => (
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
                      color={theme.palette.secondary[700]}
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
                    </Button>
                  </FlexBetween>
                  <Typography variant="h5" component="div">
                    {item.project_name}
                  </Typography>
                  <Typography
                    sx={{ mb: "1.5rem" }}
                    color={theme.palette.primary[400]}
                  >
                    {item.project_manager}
                  </Typography>
                  <Typography
                    sx={{ mb: "1.5rem" }}
                    color={theme.palette.secondary[400]}
                  >
                    {item.project_lead}
                  </Typography>
                  <Typography variant="body2">
                    {item.project_description}
                  </Typography>
                </CardContent>
                <CardActions>
                  {/* <Link to={`/pipelines/${id}`}>Explore Pipelines</Link> */}
                  <Link to={`/pipelines/${item.id}`}>Explore Pipelines</Link>
                </CardActions>
              </Card>
            ))}
          </Box>
        ) : (
          <>Loading...</>
        )}
      </Box>
      <Popup
        title="Project Form"
        openPopup={openPopup}
        width={"md"}
        setOpenPopup={setOpenPopup}
      >
        <ObjectForm
          fieldsList={fieldsList}
          values={recordForEdit}
          addOrEdit={addOrEdit}
          object={"Project"}
        />
      </Popup>
    </>
  );
};

export default Projects;
