import React from "react";
import { FormControlLabel, Switch } from "@mui/material";

const ToggleButton = ({ field_id, display_name, handleChange, values }) => {
  const isChecked = values && values[field_id] === "Y";
  return (
    <FormControlLabel
      control={
        <Switch
          checked={isChecked}
          onChange={(e) =>
            handleChange({
              target: {
                name: field_id,
                value: e.target.checked ? "Y" : "N",
              },
            })
          }
          sx={{
            "& .MuiSwitch-thumb": {
              backgroundColor: "rgb(171, 192, 242)",
            },
            "& .MuiSwitch-track": {
              backgroundColor: "rgb(171, 192, 242)",
              opacity: 0.3,
            },
            "&.Mui-checked .MuiSwitch-thumb": {
              transform: "translateX(16px)",
            },
          }}
        />
      }
      label={display_name}
    />
  );
};

export default ToggleButton;
