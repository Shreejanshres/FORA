import { Box, Grid, Icon, Typography, useTheme } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import HandshakeIcon from "@mui/icons-material/Handshake";
import PeopleIcon from "@mui/icons-material/People";
import { tokens } from "../../Theme";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "./Restaurant/restauranttable.jsx";
const restrocol = [
	{
		field: "name",
		headerName: "Restaurant  Name",
	},
	{
		field: "address",
		headerName: "Address",
	},
	{
		field: "phonenumber",
		headerName: "Phone",
		type: "number",
		editable: true,
	},
];
const admincol = [
	{
		field: "name",
		headerName: "Name",
		editable: true,
	},
	{
		field: "address",
		headerName: "Address",
		editable: true,
	},
	{
		field: "phonenumber",
		headerName: "Phone",
		type: "number",
		editable: true,
	},
];
const Data = ({ title, value, icon: IconComponent }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	return (
		<Box
			display="flex"
			sx={{
				border: theme.palette.mode === "dark" ? `1px solid` : undefined,
				borderColor: colors.primary[600],
				borderLeft: "5px solid",
				borderLeftColor: colors.redAccent[500],
				height: "100px",
				borderRadius: 2,
				backgroundColor:
					theme.palette.mode === "dark" ? colors.primary[400] : "white",
			}}
			alignItems={"center"}
			justifyContent={"center"}
		>
			<Box mr={5} p={2}>
				<Typography variant="h3">{title}</Typography>
				<Typography variant="h1">{value}</Typography>
			</Box>
			<IconComponent sx={{ fontSize: 50, color: colors.grey[100], mr: 2 }} />
		</Box>
	);
};
const Dashboard = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [restronum, setRestronum] = useState(0);
	const [totaluser, setTotaluser] = useState(0);
	const [totalorder, setTotalorder] = useState(0);
	const [restrorows, setRestroRows] = useState([]);
	const [adminrows, setAdminRows] = useState([]);
	useEffect(() => {
		axios
			.get("http://127.0.0.1:8000/admin/viewrestaurant/")
			.then((response) => {
				setRestroRows(response.data);
				setRestronum(response.data.length);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
		axios
			.get("http://127.0.0.1:8000/gettotaluser/")
			.then((response) => {
				setTotaluser(response.data.message);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
		axios
			.get("http://127.0.0.1:8000/restaurant/gettotalorder/")
			.then((response) => {
				setTotalorder(response.data.message);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
		axios
			.get("http://127.0.0.1:8000/admin/getadmins/")
			.then((response) => {
				setAdminRows(response.data);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	}, []);
	return (
		<Box
			sx={{
				flexGrow: 1,
				bgcolor: "background.default",
				ml: 3,
			}}
		>
			<Box>
				<Typography variant="h1" fontWeight="bold">
					Dashboard
				</Typography>
			</Box>
			<Box mt={2} mr={5}>
				<Grid container spacing={3}>
					<Grid item xs={12} md={4}>
						<Data
							title="Total Orders"
							value={totalorder}
							icon={LocalShippingIcon}
						/>
					</Grid>
					<Grid item xs={12} md={4}>
						<Data title="Total Customers" value={totaluser} icon={PeopleIcon} />
					</Grid>
					<Grid item xs={12} md={4}>
						<Data
							title="Total Vendors"
							value={restronum}
							icon={HandshakeIcon}
						/>
					</Grid>
				</Grid>
			</Box>
			<Box display={"flex"} mt={5} mr={5}>
				<Box
					sx={{
						backgroundColor:
							theme.palette.mode === "dark" ? colors.primary[600] : "white",
						width: "700px",
						borderRadius: 2,
						padding: 1,
					}}
				>
					<h1>Restaurant</h1>
					<Box sx={{ overflow: "auto", maxHeight: "330px" }}>
						<Table columns={restrocol} data={restrorows} />
					</Box>
				</Box>
				<Box
					sx={{
						backgroundColor:
							theme.palette.mode === "dark" ? colors.primary[600] : "white",
						width: "500px",
						borderRadius: 2,
						ml: 3,
						padding: 1,
					}}
				>
					<h1>Admins</h1>
					<Box sx={{ overflow: "auto", maxHeight: "330px" }}>
						<Table columns={admincol} data={adminrows} />
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default Dashboard;
