import { useState } from "react";

import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { Link } from "react-router-dom";

import { tokens } from "../../Theme";
import { Title } from "@mui/icons-material";
import { red } from "@mui/material/colors";
const drawerWidth = 240;

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

export default function MenuBar() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Sidebar collapsed={isCollapsed} backgroundColor={colors.primary[800]}>
      <Menu
        menuItemStyles={{
          button: {
            "&:hover": {
              backgroundColor: "transparent",
              color: colors.blueAccent[500],
            },
            "&:active": {
              backgroundColor: colors.blueAccent[400],
              color: colors.greenAccent[500],
            },
            "::after":{
                color:"red",
                backgroundColor:"red"
            }
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
                color: "yellow",
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
            <Typography variant="h2" fontWeight="bold">
              Welcome back
            </Typography>
            <Typography variant="h4" fontWeight={"bold"}>
              Shreejan Shrestha
            </Typography>
          </Box>
        )}
        <Box
          paddingLeft={isCollapsed ? undefined : "0"}
          mt={6}
          alignItems={'center'}
        >
          <Item
            title="Dashboard"
            to="/dashboard"
            icon={<HomeOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Restaurant"
            to="/restaurant"
            icon={<RestaurantOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Payment"
            to="/payment"
            icon={<PaymentsOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
        </Box>
      </Menu>
    </Sidebar>
  );
}
