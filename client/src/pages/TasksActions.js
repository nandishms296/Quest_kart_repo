import { Box, CircularProgress, Fab } from "@mui/material";
import React, { useState } from "react";
import { Check, Save } from "@mui/icons-material";
import { green } from "@mui/material/colors";

const TasksActions = ({ params, rowId, setRowId, updateTaskDetails }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      let {
        id,
        pipeline_id,
        task_name,
        task_description,
        task_type,
        task_sequence,
        is_active,
        ...otherFields
      } = params.row;

      const updateTaskRecord = {
        id,
        pipeline_id,
        task_name,
        task_description,
        task_type,
        task_sequence,
        is_active,
        ...otherFields,
      };

      await updateTaskDetails({
        data: updateTaskRecord,
        id: id,
      });

      setSuccess(true);
      setRowId(null);
    } catch (error) {
      console.error("Request failed:", error);
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        m: 1,
        position: "relative",
      }}
    >
      {success ? (
        <Fab
          color="primary"
          sx={{
            width: 40,
            height: 40,
            bgcolor: green[500],
            "&:hover": { bgcolor: green[700] },
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
          <Save />
        </Fab>
      )}
      {loading && (
        <CircularProgress
          size={52}
          sx={{
            color: green[500],
            position: "absolute",
            top: -6,
            left: -6,
            zIndex: 1,
          }}
        />
      )}
    </Box>
  );
};

export default TasksActions;