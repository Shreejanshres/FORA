import { useState } from "react";

import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { Link } from "react-router-dom";
import Cookie from "js-cookie";
import { tokens } from "../../Theme";
import { useEffect } from "react";
import axios from "axios";
// import { Cookie } from "@mui/icons-material";
const isAdminPath = window.location.pathname.includes("/admin");

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      component={<Link to={to} />}
      sx={{
        color: colors.grey[100],
      }}
      active={selected === title}
      icon={icon}
      onClick={() => setSelected(title)}
    >
      <Typography variant="h4">{title}</Typography>
    </MenuItem>
  );
};
const AdminItem = ({ isCollapsed, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box paddingLeft={isCollapsed ? undefined : "10%"} mt={6}>
      <Item
        title="Dashboard"
        to="/admin/dashboard"
        icon={<HomeOutlinedIcon />}
        selected={selected}
        setSelected={setSelected}
      />
      <Divider />
      <Typography
        variant="h6"
        color={colors.grey[100]}
        sx={{ m: "15px 0 5px 20px" }}
      >
        Data
      </Typography>
      <Item
        title="Restaurant"
        to="/admin/restaurant"
        icon={<RestaurantOutlinedIcon />}
        selected={selected}
        setSelected={setSelected}
      />
      <Item
        title="Admins"
        to="/admin/admin"
        icon={<AdminPanelSettingsIcon />}
        selected={selected}
        setSelected={setSelected}
      />
      <Item
        title="Payment"
        to="/admin/payment"
        icon={<PaymentsOutlinedIcon />}
        selected={selected}
        setSelected={setSelected}
      />
    </Box>
  );
};
const RestaurantItem = ({ isCollapsed, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box paddingLeft={isCollapsed ? undefined : "10%"} mt={6}>
      <Item
        title="Dashboard"
        to="/restaurant/dashboard"
        icon={<HomeOutlinedIcon />}
        selected={selected}
        setSelected={setSelected}
      />
      <Divider />
      <Typography
        variant="h6"
        color={colors.grey[100]}
        sx={{ m: "15px 0 5px 20px" }}
      >
        Data
      </Typography>
      <Item
        title="Menu"
        to="/restaurant/menu"
        icon={<RestaurantOutlinedIcon />}
        selected={selected}
        setSelected={setSelected}
      />
      <Item
        title="Orders"
        to="/restaurant/admin"
        icon={<AdminPanelSettingsIcon />}
        selected={selected}
        setSelected={setSelected}
      />
      <Item
        title="Payment"
        to="/restaurant/payment"
        icon={<PaymentsOutlinedIcon />}
        selected={selected}
        setSelected={setSelected}
      />
    </Box>
  );
};
export default function MenuBar() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [name, setName] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const data = JSON.parse(atob(token.split(".")[1]));
      setName(data.data.ownername);
    }
  }, []);
  return (
    <Sidebar
      collapsed={isCollapsed}
      backgroundColor={
        theme.palette.mode === "dark"
          ? colors.primary[800]
          : colors.blueAccent[500]
      }
    >
      <Menu
        menuItemStyles={{
          button: {
            "&:hover": {
              backgroundColor: "transparent",
              color: colors.blueAccent[500],
              color:
                theme.palette.mode === "dark"
                  ? colors.blueAccent[500]
                  : colors.grey[800],
            },
            "&:active": {
              backgroundColor: colors.blueAccent[400],
              color: colors.greenAccent[500],
            },
            "::after": {
              color: "red",
              backgroundColor: "red",
            },
          },
        }}
      >
        <MenuItem
          onClick={() => setIsCollapsed(!isCollapsed)}
          icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
          sx={{
            margin: "1px 0 20px 0",
            icon: {
              "&:hover": {
                backgroundColor: "red",
              },
            },
          }}
        >
          {!isCollapsed && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              ml="15px"
            >
              <Typography variant="h3"></Typography>
              <IconButton
                onClick={() => setIsCollapsed(!isCollapsed)}
                sx={{
                  "&:hover": {
                    backgroundColor: colors.redAccent[400],
                  },
                }}
              >
                <CloseOutlinedIcon />
              </IconButton>
            </Box>
          )}
        </MenuItem>
        {!isCollapsed && (
          <Box textAlign="center" display="grid" gap={2}>
            <Typography variant="h2" fontWeight="bold" color={"white"}>
              Welcome back
            </Typography>
            <Typography variant="h4" fontWeight={"bold"} color={"white"}>
              {name}
            </Typography>
          </Box>
        )}
        {isAdminPath ? (
          <AdminItem
            isCollapsed={isCollapsed}
            selected={selected}
            setSelected={setSelected}
          />
        ) : (
          <RestaurantItem
            isCollapsed={isCollapsed}
            selected={selected}
            setSelected={setSelected}
          />
        )}
      </Menu>
    </Sidebar>
  );
}
