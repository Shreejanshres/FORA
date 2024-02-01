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
import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
import InputBase from "@mui/material/InputBase";

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Help from "@mui/icons-material/Help";
const Topbar = () => {
  const [user, setUser] = useState("");
  const [picture, setPicture] = useState("");

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  return (
    <Box
      display="flex"
      justifyContent="right"
      m={3}
      mb={0}
    >
      <IconButton onClick={colorMode.toggleColorMode} mr="4px">
        {theme.palette.mode === "dark" ? (
          <DarkModeOutlinedIcon sx={{ fontSize: "25px" }} />
        ) : (
          <LightModeOutlinedIcon sx={{ fontSize: "25px" }} />
        )}
      </IconButton>
      <IconButton component={Link} to="/form">
        <SettingsOutlinedIcon sx={{ fontSize: "25px" }} />
      </IconButton>
      <IconButton component={Link} to="/faq">
        <Help sx={{ fontSize: "23px" }} />
      </IconButton>

      <FormControl variant="standard" value="Shreejan">
        <Select
          value="Shreejan"
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
          <MenuItem value="Shreejan">
            <Box
              display="flex"
              justifyContent="space-between"
              align-items="center"
            >
              <Box
                component="img"
                alt="profile"
                src={`src/assets/1.jpg`}
                // src={`${picture}`}
                // src={`../../assets/${picture}`}
                height="40px"
                width="40px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <Typography variant="h5" sx={{ mt: "8px", ml: "10px" }}>
                Shreejan
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem component={Link} to="/">
            Log Out
          </MenuItem>
        </Select>
      </FormControl>
      {/* <Box
        component="img"
        alt="profile-user"
        height="50px"
        width="50px"
        borderRadius="50%"
        sx={{ objectFit: "cover" }}
        src={`src/assets/1.jpg`}
        style={{ cursor: "pointer", borderRadius: "50%" }}
      /> */}
    </Box>
  );
};
export default Topbar;
