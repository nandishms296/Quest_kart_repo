import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import Header from "components/Header";
import { useFormik } from "formik";
import { useTheme } from "@emotion/react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  useGetFrequentlyusedobjectsQuery,
  useGetProjectCountQuery,
} from "../state/apiSlice";


const Dashboard = () => {
  const { data: projectCount, isLoading: isCountLoading } = useGetProjectCountQuery();
const theme = useTheme();

const { data: projectRecords, isLoading: isRecordLoading } =useGetFrequentlyusedobjectsQuery();


const metrics = [
  { label: "Connections", value: projectCount && projectCount.length > 0 ? projectCount[0]?.connection || "" : "" },
  { label: "Projects", value: projectCount && projectCount.length > 0 ? projectCount[0]?.projects || "" : "" },
  { label: "Pipelines", value: projectCount && projectCount.length > 0 ? projectCount[0]?.pipelines || "" : "" },
  { label: "Tasks", value: projectCount && projectCount.length > 0 ? projectCount[0]?.tasks || "" : "" },

];
  const columns = [
    { field: "object", headerName: "Object",flex: 1 },
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1},
    { field: "created_dttm", headerName: "Created_dttm", flex: 1 },
  ];
  return (
    <Box m="1.5rem 2.5rem">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Dashboard" subtitle="Welcome to your dashboard" />
      </Box>

      <Box display="flex" justifyContent="space-between" mt="2rem">
        {metrics.map((metric, index) => (
           <Card key={index} sx={{ width: 300, height: 150, marginRight: "1rem", backgroundColor: "#050548" }}>

                    <CardContent>
                      <Typography variant="h4"  color="white" gutterBottom>
          
                {metric.label}
              </Typography>
              <Typography variant="h3" color="white">{metric.value}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
       <Box m="1.5rem 2.5rem">
         {projectRecords || !isRecordLoading ? (
           <Box
             m="40px 0 0 0"
             height="75vh"
             sx={{
               "& .MuiDataGrid-root": {
                 border: "none",
               },
               /*  "& .MuiDataGrid-cell": {
                             borderBottom: "none", 
                             backgroundColor: theme.palette.grey[100], 
                             // Below line added by SA
                             lineHeight: 'unset !important',
                             maxHeight: 'none !important',
                             whiteSpace: 'normal',
                         }, */
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
               rows={projectRecords}
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
    </Box>
  );
};

export default Dashboard;
