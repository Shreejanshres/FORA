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
      active={selected === title}
      icon={<icon.type {...icon.props} style={{ color: "white" }} />}
      onClick={() => setSelected(title)}
    >
      <Typography variant="h4" color={"white"}>
        {title}
      </Typography>
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
      <Typography variant="h6" color="white"   sx={{ m: "15px 0 5px 20px" }}>
        Data
      </Typography>
      <Item
        title="Restaurant"
        to="/admin/restaurantdata"
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
      <Typography variant="h6" color="white" sx={{ m: "15px 0 5px 20px" }}>
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
        to="/restaurant/orders"
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
    // Extract token from cookies
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));

    // Check if token exists
    if (tokenCookie) {
      const token = tokenCookie.split("=")[1];
      const data = JSON.parse(atob(token.split(".")[1]));
      setName(data.data.name);
    }
  }, []);
  return (
    <Sidebar
      collapsed={isCollapsed}
      backgroundColor={
        theme.palette.mode === "dark"
          ? colors.primary[700]
          : colors.primary[600]
      }
    >
      <Menu
        menuItemStyles={{
          button: {
            "&:hover": {
              backgroundColor: "transparent",
              color:
                theme.palette.mode === "dark"
                  ? colors.blueAccent[500]
                  : colors.blueAccent[300],
            },
            "&:active": {
              backgroundColor: colors.blueAccent[600],
              color: colors.redAccent[200],
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
                backgroundColor: "yellow",
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
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? colors.redAccent[300]
                        : colors.redAccent[800],
                    color: colors.blueAccent[100],
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
