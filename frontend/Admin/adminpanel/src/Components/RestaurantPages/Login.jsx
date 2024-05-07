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
	Typography,
} from "@mui/material";
import axios from "axios";
import { tokens } from "../../Theme";

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
				"http://127.0.0.1:8000/restaurant/",
				postdata
			);
			if (response.data.success) {
				if (response.data.is_active) {
					setCookies("token", response.data.message, 1);
					navigate("/restaurant/dashboard");
				} else {
					navigate("/restaurant/changepassword", { state: { email } });
				}
			} else {
				alert(response.data.message);
			} 
		} catch (error) {
			console.error("Error:", error);
		}
	};

	useEffect(() => {
		const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
		const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
		const token = document.cookie.split("=")[1];

		if (token) {
			navigate("/restaurant/dashboard");
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
				backgroundColor={"#141b2d"}
			>
				<Typography
					variant="h1"
					color={"white"}
					sx={{
						backgroundColor: "#535ac8",
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
						InputLabelProps={{
							style: {
								color: "white", // Label color
							},
						}}
						onChange={(e) => {
							setEmail(e.target.value);
						}}
						focused
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
							style: {
								color: "white", // Text color
								borderColor: "white !important", // Border color
							},
						}}
						focused
						fullWidth
					/>
				</Box>
				<Button
					variant="contained"
					sx={{ backgroundColor: "#3e4396", color: "white" }}
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
