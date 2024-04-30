import {
  Typography,
  Box,
  useTheme,
  TextField,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import { react, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Backgroundfood from "../../assets/foodbackground.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import { tokens } from "../../Theme";
import axios from "axios";

export default function changepassword() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state ? location.state.email : null;

  const [oldpassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showconfirmPassword, setShowConfrimPassword] = useState(false);
  const [showoldPassword, setShowOldPassword] = useState(false);

  var is_wrong = false;

  const handlePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const handleOldPassword = () => {
    setShowOldPassword((prevShowPassword) => !prevShowPassword);
  };
  const handleConfirmPassword = () => {
    setShowConfrimPassword((prevShowPassword) => !prevShowPassword);
  };

  const HandleClick = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (password !== confirmPassword) {
      alert("Password and Confirm Password should be same");
      is_wrong = true;
      return;
    }
    const postdata = {
      email: email,
      old_password: oldpassword,
      new_password: password,
    };
    console.log(postdata);
    try {
      const response = await axios.put(
        "http://127.0.0.1:8000/restaurant/updatepassword/",
        postdata
      );
      if (response.data.success) {
        navigate("/restaurant");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);

    }
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
        borderRadius=" 2rem 2rem 0 0"
        width="30rem"
        height="28rem"
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
          }}
          borderRadius=" 2rem 2rem 0 0"
        >
          Change Password
        </Typography>

        <Box p={2} width={"100%"}>
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            color="secondary"
            type={showoldPassword ? "text" : "password"}
            label="Old Password"
            onChange={(e) => {
              setOldPassword(e.target.value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={handleOldPassword}>
                    {showoldPassword ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            color="secondary"
            type={showPassword ? "text" : "password"}
            label="New Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={handlePassword}>
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            color={is_wrong ? "error" : "secondary"}
            type={showconfirmPassword ? "text" : "password"}
            label="Confirm Password"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={handleConfirmPassword}>
                    {showconfirmPassword ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
}
