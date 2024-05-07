import { React, useState, useEffect } from "react";
import {
	Box,
	Button,
	Typography,
	useTheme,
	TextField,
	Dialog,
	DialogTitle,
	DialogActions,
	Grid,
	DialogContent,
} from "@mui/material";
import { tokens } from "../../Theme";
import axios from "axios";
import { set } from "date-fns";

export default function Promotion() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [open, setOpen] = useState(false);
	const [image, setImage] = useState(null);
	const [id, setId] = useState("");
	const [addedPromotion, setAddedPromotion] = useState(false);
	const [deletedPromotion, setDeletedPromotion] = useState(false);

	const [promotions, setPromotions] = useState([]);
	useEffect(() => {
		const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
		const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
		const token = tokenCookie.split("=")[1];
		const data = JSON.parse(atob(token.split(".")[1]));
		if (tokenCookie) {
			console.log(data.data.id);
			setId(data.data.id);
		}

		axios
			.get(`http://127.0.0.1:8000/restaurant/getpromotionbyid/${data.data.id}/`)
			.then((response) => {
				console.log(response.data);
				setPromotions(response.data);
			});
	}, []);

	const handleclose = () => {
		setOpen(false);
	};
	const handleImage = async (event) => {
		const selectedFile = event.target.files[0];
		if (selectedFile) {
			const img = new Image();
			img.onload = function () {
				if (this.width !== 1100 || this.height !== 1100) {
					alert("Please select an image with dimensions 1100x1100.");
					event.target.value = ""; // Clear the input field
				} else {
					convertAndSetImage(selectedFile);
				}
			};
			img.src = URL.createObjectURL(selectedFile);
		}
	};
	const convertAndSetImage = async (file) => {
		const base64 = await convertToBase64(file);
		setImage(base64);
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
	const handleSubmit = () => {
		const data = {
			picture: image,
			restaurant: id,
		};
		console.log(data);
		axios
			.post(`http://127.0.0.1:8000/restaurant/addpromotion/`, data)
			.then((response) => {
				console.log(response.data);
				if (response.data.success) {
					handleclose();
					window.location.reload();
				} else {
					alert(response.data.message);
					handleclose();
				}
			})
			.catch((error) => {
				console.log(error);
				alert("Error while adding promotion");
			});
	};
	const onDelete = (id) => {
		axios
			.delete(`http://127.0.0.1:8000/restaurant/deletepromotion/${id}/`)
			.then((response) => {
				console.log(response.data);
				if (response.data.success) {
					window.location.reload();
				} else {
					alert(response.data.message);
				}
			})
			.catch((error) => {
				console.log(error);
				alert("Error while deleting promotion");
			});
	};
	return (
		<Box ml={3} mr={5}>
			<Box>
				<Typography variant="h1" fontWeight="bold">
					Promotions
				</Typography>
			</Box>
			<Button
				variant="contained"
				sx={{
					backgroundColor:
						theme.palette.mode == "dark"
							? colors.greenAccent[600]
							: colors.greenAccent[400],
					color: "white",
					":hover": {
						backgroundColor:
							theme.palette.mode == "dark"
								? colors.greenAccent[400]
								: colors.greenAccent[600],
					},
				}}
				onClick={() => setOpen(!open)}
			>
				Add Promotion
			</Button>
			<Dialog open={open} onClose={handleclose} fullWidth>
				<DialogTitle textAlign="center">
					<Typography variant="h1"> Add Promotion </Typography>
				</DialogTitle>
				<DialogContent>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							gap: 2,
							p: 3,
							pt: 1,
						}}
					>
						<input type="file" fullWidth onChange={handleImage} />
					</Box>
				</DialogContent>
				<DialogActions
					sx={{
						justifyContent: "center",
					}}
				>
					<Button
						size="large"
						variant="contained"
						sx={{
							backgroundColor: colors.greenAccent[500],
						}}
						onClick={handleSubmit}
					>
						Submit
					</Button>
				</DialogActions>
			</Dialog>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: 3,
					mt: 3,
				}}
			>
				<Grid container spacing={2}>
					{promotions.map((promotion, index) => (
						<Grid item key={index} xs={12} sm={6} md={4}>
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									gap: 2,
									p: 3,
									borderRadius: 2,
									backgroundColor:
										theme.palette.mode == "dark"
											? colors.grey[700]
											: colors.grey[800],
								}}
							>
								<img
									src={`http://127.0.0.1:8000/${promotion.picture}`}
									alt="promotion"
									style={{
										width: "100%",
										height: "200px",
										objectFit: "cover",
										borderRadius: 10,
									}}
								/>
								<Button
									variant="contained"
									color="error"
									onClick={() => onDelete(promotion.id)}
								>
									Delete
								</Button>
							</Box>
						</Grid>
					))}
				</Grid>
			</Box>
		</Box>
	);
}
