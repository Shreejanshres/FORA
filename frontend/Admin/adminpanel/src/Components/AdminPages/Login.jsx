import React, { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Backgroundfood from "../../assets/foodbackground.jpg";
import { useNavigate } from "react-router-dom";
import {
  InputAdornment,
  Box,
  TextField,
  Button,
  IconButton,
  useTheme,
  FormControl,
  Typography,
} from "@mui/material";
import axios from "axios";
import { tokens } from "../../Theme";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const postdata = {
    email: email,
    password: password,
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
  const HandleClick = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/admin/",
        postdata
      );
      if (response.data.success) {
        setCookies("token", response.data.message, 1);
        navigate("/admin/dashboard");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle the error, e.g., show an error message to the user
    }
  };
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      if (decoded.is_admin) {
        navigate("/admin/dashboard");
      }
    }
  }, [navigate]);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        width: "100%",
        height: "100vh", // Set the height to 100% of the viewport height, adjust as needed
        backgroundImage: `url(${Backgroundfood})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "rgba(255, 255, 255, 0)",
      }}
    >
      <Box
        borderRadius=" 5rem 0 5rem 5px"
        width="30rem"
        height="30rem"
        display="flex"
        alignItems="center"
        flexDirection="column"
        backgroundColor={colors.primary[600]}
      >
        <Typography
          variant="h1"
          color={colors.primary[100]}
          sx={{
            backgroundColor: colors.blueAccent[600],
            width: "100%",
            textAlign: "center",
            py: 4,
            fontSize: 60,
          }}
          borderRadius="5rem 5px 5px 5px"
        >
          Login
        </Typography>
        <Box p={2} mt={4}>
          <TextField
            margin="normal"
            variant="outlined"
            color="secondary"
            label="Email"
            type="email"
            fullWidth
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <TextField
            margin="normal"
            color="secondary"
            type={showPassword ? "text" : "password"}
            label="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={handleTogglePassword}>
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        </Box>
        <Button
          variant="contained"
          sx={{ backgroundColor: colors.blueAccent[700] }}
          size="large"
          onClick={HandleClick}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
