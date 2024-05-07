import { react, useEffect, useState } from "react";
import {
	Box,
	Button,
	Typography,
	Input,
	useTheme,
	TextField,
} from "@mui/material";
import { tokens } from "../../Theme";
import axios from "axios";
export default function UserProfile() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [picture, setPicture] = useState("");
	const [cover, setCover] = useState("");
	const [delivery, setDelivery] = useState("");
	const [description, setDescription] = useState("");
	const [id, setId] = useState("");

	const [tempimage, setTempImage] = useState(null);
	const [tempprofile, setTempProfile] = useState(null);

	useEffect(() => {
		const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
		const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));

		if (tokenCookie) {
			const token = tokenCookie.split("=")[1];
			const data = JSON.parse(atob(token.split(".")[1]));
			setId(data.data.id);
			setName(data.data.name);
			setEmail(data.data.email);
			setPhone(data.data.phonenumber);
			setAddress(data.data.address);
			setPicture(data.data.picture);
			setCover(data.data.coverphoto);
			setDelivery(data.data.delivery_time);
			setDescription(data.data.description);
		}
	}, []);
	const setCookies = (name, value, days) => {
		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
			expires = "; expires=" + date.toUTCString();
		}
		document.cookie = name + "=" + (value || "") + expires + "; path=/";
	};
	const handleSave = () => {
		const data = {
			delivery_time: delivery,
			description: description,
			coverphoto: tempimage,
			picture: tempprofile,
		};
		console.log(data);
		axios
			.put(`http://127.0.0.1:8000/restaurant/updaterestro/${id}/`, data)
			.then((response) => {
				setCookies("token", response.data.token, 1);
			});
	};
	const handlePhotoChange = async (event) => {
		const selectedFile = event.target.files[0];
		console.log(selectedFile);
		if (selectedFile) {
			const base64 = await convertToBase64(selectedFile);
			setTempImage(base64);
		}
	};
	const handleProfileChange = async (event) => {
		const selectedFile = event.target.files[0];
		console.log(selectedFile);
		if (selectedFile) {
			const base64 = await convertToBase64(selectedFile);
			setTempProfile(base64);
		}
	};
	const convertToBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const fileReader = new FileReader();
			fileReader.readAsDataURL(file);
			fileReader.onload = () => {
				resolve(fileReader.result);
			};
			fileReader.onerror = (error) => {
				reject(error);
			};
		});
	};

	return (
		<Box ml={3} mr={5}>
			<Box>
				<Typography variant="h1" fontWeight="bold">
					User Profile
				</Typography>
			</Box>
			<Box
				width={"100%"}
				height={"18rem"}
				sx={{
					backgroundColor: "lightgray",
					backgroundImage:
						tempimage != null
							? `url(${tempimage})`
							: cover != null
							? `url(http://127.0.0.1:8000/${cover})`
							: null,
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
					position: "relative",
					cursor: "pointer",
					"&:hover": { opacity: 0.5 }, // Apply opacity on hover
				}}
				onClick={() => document.getElementById("fileInput").click()}
			>
				{cover != null && tempimage != null ? null : <p>Add photo</p>}
			</Box>
			<input
				id="fileInput"
				type="file"
				onChange={handlePhotoChange}
				style={{ display: "none" }}
			/>
			<Box mt={2} display={"flex"}>
				{/* profile image */}
				<Box>
					<img
						src={
							tempprofile != null
								? tempprofile
								: picture != null
								? `http://127.0.0.1:8000/${picture}`
								: null
						}
						alt="user"
						style={{ width: "200px", height: "200px", cursor: "pointer" }}
						onClick={() => document.getElementById("profileinput").click()}
					/>
					<input
						id="profileinput"
						type="file"
						onChange={handleProfileChange}
						style={{ display: "none" }}
					/>
				</Box>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: 2,
						p: 3,
						pt: 1,
					}}
				>
					<Typography variant="h3">Name: {name}</Typography>
					<Typography variant="h3">Email: {email}</Typography>
					<Typography variant="h3">Phone: {phone}</Typography>
					<Typography variant="h3">Address: {address}</Typography>
				</Box>
			</Box>
			<Box mt={2} width={60} display={"flex"} flexDirection={"column"}>
				<Typography variant="h3">Delivery Time:</Typography>
				<TextField
					value={delivery}
					onChange={(e) => setDelivery(e.target.value)}
				/>
				<Typography variant="h3">Description:</Typography>
				<TextField
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
				<Button
					variant="contained"
					sx={{ backgroundColor: colors.blueAccent[700] }}
					size="large"
					onClick={handleSave}
				>
					Save
				</Button>
			</Box>
		</Box>
	);
}
