import React, { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Backgroundfood from "../../assets/foodbackground.jpg";
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

const Login = () => {
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
  const HandleClick = () => {
    // alert(`Email: ${email}\nPassword: ${password}`);
    // alert(postdata);
    const response = axios.post("http://127.0.0.1:8000/admins/", postdata);
    console.log(response);
  };

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
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
