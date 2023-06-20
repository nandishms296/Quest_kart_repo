import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { useTheme } from "@emotion/react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "api/axios";
import FlexBetween from "components/FlexBetween";
import {
  useGetUsersQuery,
  useGetObjectFormQuery,
  useAddObjectMutation,
  useUpdateObjectMutation,
} from "state/apiSlice";
import Header from "components/Header";
import Popup from "components/Popup";
import UserForm from "pages/UserForm";
import { ModeEditOutline } from "@mui/icons-material";

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
  editButton: {
    borderRadius: "6px!important",
    minWidth: "25px!important",
    minHeight: "25px!important",
    marginTop: "0px!important",
    marginRight: "30px!important",
    color: "#FFFFFF!important",
    fontWeight: "bold!important",
    // backgroundColor: '#0589f9ba!Important',
    backgroundColor: "#6385dbba!Important", // New Edit button BG Color, Matching with cards BG color
    marginLeft: "3px",
  },
  gridLinkBtn: {
    fontSize: "12px",
    fontWeight: "bold",
    borderRadius: "6px",
    backgroundColor: "#5adbb5!important",
    color: "#03112e!important",
    textTransform: "none",
    lineHeight: 1,
    width: "auto",
    padding: "7px 9px",
  },
  myBorder: {
    border: "2px solid green",
  },
  myFont: {
    color: "blue",
  },
};

const Users = () => {
  const theme = useTheme();

  const { data: userRecords, isLoading: isRecordLoading } = useGetUsersQuery();
  const { data: userformData, isLoading: isUserFormLoading } =
    useGetObjectFormQuery("User");
  const [addObject] = useAddObjectMutation();
  const [updateObject] = useUpdateObjectMutation();

  const [initValue, setInitValue] = useState(null);
  const [fieldsList, setFieldList] = useState(null);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);

  if (!isUserFormLoading && initValue === null && !isRecordLoading) {
    setInitValue(userformData[0].initialvalues);
    setFieldList(userformData[0].field_list);
  }

  const addOrEdit = async (values, resetForm) => {
    if (values?.id === 0) {
      await addObject({ object: "User", data: values });
    } else {
      await updateObject({ object: "User", data: values });
    }
    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
  };

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  let pageTitle = "Users";
  let pageSubTitle = "List of Users.";

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "full_name", headerName: "Full Name", flex: 1 },
    { field: "login_id", headerName: "User ID", flex: 1 },
    { field: "user_email", headerName: "Email ID", flex: 2 },
    { field: "user_phone", headerName: "Phone Number", flex: 1 },
    { field: "is_active", headerName: "Active", flex: 0.5 },
    {
      field: "status",
      headerName: "Status",
      sortable: false,
      renderCell: (params) => {
        const { id, is_active } = params.row;
        const onClick = (e) => {
          e.stopPropagation(); // don't select this row after clicking

          axios
            .put(`http://localhost:8080/api/users/activate/${id}`)
            .then((res) => {
              console.log(res.data);
            });

          window.location.reload();
        };

        return is_active === "Y" ? (
          <Button disabled style={{ backgroundColor: "gray", color: "#fff" }}>
            Approved
          </Button>
        ) : (
          <Button
            onClick={onClick}
            style={{ backgroundColor: "darkblue", color: "#fff" }}
          >
            Approve
          </Button>
        );
        // return is_active === 'Y' ? null : <Button onClick={onClick} style={{ backgroundColor: 'darkblue', color: '#fff' }}>Approve</Button>
      },
    },
    {
      field: "update",
      headerName: "Update",
      flex: 0.5,
      renderCell: ({ row }) => {
        return (
          <Button
            color="secondary"
            onClick={() => {
              openInPopup(row);
            }}
          >
            <ModeEditOutline sx={styles.editButton} />
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <Box m="1.5rem 2.5rem">
        <FlexBetween>
          <Header title={pageTitle} subtitle={pageSubTitle} />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setOpenPopup(true);
              setRecordForEdit(initValue);
            }}
            sx={styles.myBackground}
            style={styles.myBorder}
          >
            Create Users
          </Button>
        </FlexBetween>
      </Box>
      <Box m="1.5rem 2.5rem">
        {userRecords || !isRecordLoading ? (
          <Box
            m="40px 0 0 0"
            height="75vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme.palette.secondary[200],
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme.palette.grey[100],
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: theme.palette.secondary[200],
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `${theme.palette.grey[900]} !important`,
              },
            }}
          >
            <DataGrid
              rowHeight={32}
              rows={userRecords}
              columns={columns}
              components={{ Toolbar: GridToolbar }}
              getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0
                  ? "Mui-odd"
                  : "Mui-even"
              }
            />
          </Box>
        ) : (
          <>Loading...</>
        )}
      </Box>
      <Popup
        title="User Registration Form"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        width={"md"}
      >
        <UserForm
          fieldsList={fieldsList}
          values={recordForEdit}
          addOrEdit={addOrEdit}
          object={"User"}
        />
      </Popup>
    </>
  );
};

export default Users;
