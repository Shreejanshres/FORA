import { Box, Grid, Icon, Typography, useTheme } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import HandshakeIcon from "@mui/icons-material/Handshake";
import PeopleIcon from "@mui/icons-material/People";
import { jwtDecode } from "jwt-decode";
import { tokens } from "../../Theme";
import React, { useEffect } from "react";
import axios from "axios";

const Data = ({ title, value, icon: IconComponent }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Check if the token exists
    if (token) {
      // Send the token to the backend for data retrieval
      axios
        .get("http://127.0.0.1:8000/admin/getdata/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // Handle the data from the backend
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, []);

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
const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
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
      <Box
        display="flex"
        textAlign={"center"}
        justifyContent={"center"}
        alignItems={"center"}
        pt={5}
        gap={15}
      >
        <Data
          title={"Total Deliveries"}
          value={"100"}
          icon={LocalShippingIcon}
        />
        <Data title={"Total Partners"} value={"100"} icon={HandshakeIcon} />
        <Data title={"Total Users"} value={"100"} icon={PeopleIcon} />
      </Box>
    </Box>
  );
};

export default Dashboard;
