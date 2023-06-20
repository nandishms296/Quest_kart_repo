import { Box, CircularProgress, Fab } from '@mui/material'
import React, { useState } from 'react'
import { Check, Save } from '@mui/icons-material'
import { green } from '@mui/material/colors';

const UsersActions = ({params, rowId, setRowId}) => {
  const [loading,setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    setLoading(true);
  
    try {
      let response;
      let url;
      let { user_id, program_id, project_id, read_role, write_role, execute_role, is_active, created_by, id } = params.row;
  
      // Get the user ID
      const userResponse = await fetch(`http://localhost:8080/api/users/findbyname/${user_id}`);
      const userData = await userResponse.json();
      // console.log(userData.id,"111111111")
      user_id = userData.id;
  
      // Get the program ID
      const programResponse = await fetch(`http://localhost:8080/api/programs/findbyname/${program_id}`);
      const programData = await programResponse.json();
      program_id = programData.id;
  
      // Get the project ID
      const projectResponse = await fetch(`http://localhost:8080/api/projects/findbyname/${project_id}`);
      const projectData = await projectResponse.json();
      project_id = projectData.id;
  
      if (id) {
        response = await fetch(`http://localhost:8080/api/lnkuserprojects/${id}`, {
          method: "PUT",
          body: JSON.stringify({ user_id, program_id, project_id, read_role, write_role, execute_role, is_active, created_by }),
          headers: {
            "Content-Type": "application/json"
          }
        });
      } else {
        url = "http://localhost:8080/api/lnkuserprojects/";
        response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({ user_id, program_id, project_id, read_role, write_role, execute_role, is_active, created_by }),
          headers: {
            "Content-Type": "application/json"
          }
        });
      }
      if (response.ok) {
        setSuccess(true);
        setRowId(null);
      } else {
        console.error("Request failed:", response.status);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  
    setLoading(false);
  };

  return (
    <Box
      sx={{
        m: 1,
        position: 'relative',
      }}
    >
      {success ? (
        <Fab
          color="primary"
          sx={{
            width: 40,
            height: 40,
            bgcolor: green[500],
            '&:hover': { bgcolor: green[700] },
          }}
        >
          <Check />
        </Fab>
      ) : (
        <Fab
          color="primary"
          sx={{
            width: 40,
            height: 40,
          }}
          disabled={params.id !== rowId || loading}
          onClick={handleSubmit} 
        >
          <Save/>
        </Fab>
      )}
      {loading && (
        <CircularProgress
          size={52}
          sx={{
            color: green[500],
            position: 'absolute',
            top: -6,
            left: -6,
            zIndex: 1,
          }}
        />
      )}
    </Box>
  )
};

export default UsersActions
