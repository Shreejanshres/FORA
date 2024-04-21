import { useContext } from "react";
import { Link } from "react-router-dom";
import { ColorModeContext, tokens } from "../../Theme";
import {
  Typography,
  MenuItem,
  Select,
  FormControl,
  Box,
  IconButton,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Switch } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
// import axios from "axios";
import InputBase from "@mui/material/InputBase";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Help from "@mui/icons-material/Help";
import axios from "axios";
const Topbar = () => {
  const [user, setUser] = useState("");
  const [picture, setPicture] = useState("");
  const [name, setName] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [is_restaurant, setIsRestaurant] = useState(false);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(false);

  useEffect(() => {
    if (window.location.pathname.includes("/restaurant")) {
      setIsRestaurant(true);
    }
    // Extract token from cookies
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
    const token = tokenCookie.split("=")[1];
    const data = JSON.parse(atob(token.split(".")[1]));
    setIsRestaurantOpen(data.data.open);
    console.log(tokenCookie);
    // Check if token exists
    if (tokenCookie) {
      const token = tokenCookie.split("=")[1];
      const data = JSON.parse(atob(token.split(".")[1]));
      setName(data.data.name);
    }
  }, []);

  const handlelogout = () => {
    if (window.location.pathname.includes("/admin")) {
      window.location.href = "/admin";
    } else {
      window.location.href = "/restaurant";
    }
  };

  const handleUser = () => {
    if (window.location.pathname.includes("/restaurant")) {
      window.location.href = "/restaurant/profile";
    }
  };

  const setCookies = (name, value, days) => {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  };
  const handleOpen = async () => {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
    const token = tokenCookie.split("=")[1];
    const data = JSON.parse(atob(token.split(".")[1]));
    setIsRestaurantOpen(!isRestaurantOpen);

    if (tokenCookie) {
      const id = data.data.id;
      const response = await axios.put(
        `http://127.0.0.1:8000/restaurant/updateopen/`,
        {
          id: id,
          status: !isRestaurantOpen,
        }
      );
      if (response.data.success) {
        setCookies("token", response.data.token, 1);
      }
    }
  };
  return (
    <Box display="flex" justifyContent="right" m={3} mb={0}>
      {is_restaurant && (
        <FormControlLabel
          control={
            <Switch
              color="secondary"
              onClick={handleOpen}
              checked={isRestaurantOpen}
            />
          }
          label="Open"
        />
      )}
      <IconButton onClick={colorMode.toggleColorMode} mr="4px">
        {theme.palette.mode === "dark" ? (
          <DarkModeOutlinedIcon sx={{ fontSize: "25px" }} />
        ) : (
          <LightModeOutlinedIcon sx={{ fontSize: "25px" }} />
        )}
      </IconButton>
      <IconButton component={Link} to="/faq">
        <Help sx={{ fontSize: "23px" }} />
      </IconButton>
      <FormControl variant="standard" value={name}>
        <Select
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{
            backgroundColor: { color: colors.primary[100] },
            width: "160px",
            borderRadius: "0.25rem",
            p: "0.25rem 1rem",
            "& .MuiSvgIcon-root": {
              pr: "0.25rem",
              width: "3rem",
            },
            "& .MuiSelect-select:focus": {
              backgroundColor: { color: colors.primary[200] },
            },
          }}
          input={<InputBase />}
        >
          <MenuItem value={name} onClick={handleUser}>
            <Box
              display="flex"
              justifyContent="space-between"
              align-items="center"
            >
              <Box
                component="img"
                alt="profile"
                src={`src/assets/1.jpg`}
                height="40px"
                width="40px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <Typography variant="h5" sx={{ mt: "8px", ml: "10px" }}>
                {name}
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handlelogout}>Log Out</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
export default Topbar;
