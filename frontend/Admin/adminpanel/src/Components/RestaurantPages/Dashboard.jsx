import { Box, Grid, Icon, Typography, useTheme } from "@mui/material";
import { LineChart } from "../global/LineChart.jsx";

import { tokens } from "../../Theme";
import React, { useEffect, useState } from "react";
import axios from "axios";
const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [errormessage, setErrorMessage] = React.useState("");
  const [xAxis, setXAxis] = React.useState([]);
  const [yAxis, setYAxis] = React.useState([]);
  useEffect(() => {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
    const token = tokenCookie.split("=")[1];
    const data = JSON.parse(atob(token.split(".")[1]));
    console.log(data);
    const restroId = data.data.id;
    axios
      .get(`http://127.0.0.1:8000/restaurant/getorder/${restroId}/`)
      .then((response) => {
        if (response.data["success"]) {
          const orderData = response.data["orders"];
          const hourData = {};
          orderData.forEach((order) => {
            const timestamp = order.updated_at;
            const date = new Date(timestamp);
            const hour = date.getHours();
            if (!hourData[hour]) {
              hourData[hour] = 1;
            } else {
              hourData[hour]++;
            }
          });
          const xAxis = Object.keys(hourData).map((hour) => parseInt(hour));
          const yAxis = Object.values(hourData);

          // Update state variables
          setXAxis(xAxis);
          setYAxis(yAxis);
        } else {
          setErrorMessage(response.data["message"]);
        }
      });
  }, []);
  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.default",
        ml: 3,
      }}
    >
      <Box>
        <Typography variant="h1" fontWeight="bold">
          Dashboard
        </Typography>
      </Box>
      <Box>
        
      </Box>
    </Box>
  );
};

export default Dashboard;

const Data = ({ title, value, icon: IconComponent }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
  const token = tokenCookie.split("=")[1];
  return (
    <Box
      display="flex"
      sx={{
        border: theme.palette.mode === "dark" ? `1px solid` : undefined,
        borderColor: colors.primary[600],
        borderLeft: "5px solid",
        borderLeftColor: colors.redAccent[500],
        boxShadow:
          theme.palette.mode === "dark"
            ? `2px 2px 5px ${colors.primary[300]}`
            : undefined,
        borderRadius: 2,
        backgroundColor:
          theme.palette.mode === "dark" ? colors.primary[400] : "white",
      }}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Box mr={5} p={2}>
        <Typography variant="h3">{title}</Typography>
        <Typography variant="h1">{value}</Typography>
      </Box>
      <IconComponent sx={{ fontSize: 50, color: colors.grey[100], mr: 2 }} />
    </Box>
  );
};
