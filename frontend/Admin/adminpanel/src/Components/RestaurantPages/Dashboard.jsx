import {
	Box,
	Select,
	MenuItem,
	Typography,
	useTheme,
	TableSortLabel,
	Grid,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { tokens } from "../../Theme";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PeopleIcon from "@mui/icons-material/People";
import DollarIcon from "@mui/icons-material/MonetizationOn";
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
	const ordercol = [
		{ field: "user", headerName: "Customer Name" },
		{ field: "orderitems", headerName: "Order Items" },
		{ field: "ordernotes", headerName: "Order Notes" },
		{ field: "address", headerName: "Address" },
		{ field: "price", headerName: "Price", type: "number", editable: true },
		{ field: "payment_method", headerName: "Payment" },
		{ field: "status", headerName: "Status" },
	];
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [nooforders, setNoOfOrders] = useState(0);
	const [todayorders, setTodayOrders] = useState(0);
	const [orderBy, setOrderBy] = useState("");
	const [orders, setOrders] = useState([]);
	const [totalprice, setTotalPrice] = useState(0);
	const today = new Date();

	useEffect(() => {
		const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
		const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
		if (tokenCookie === undefined) {
			window.location.href = "/restaurant";
		}
		const token = tokenCookie.split("=")[1];

		const data = JSON.parse(atob(token.split(".")[1]));
		console.log(data);
		const restroId = data.data.id;

		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, "0");
		const day = String(today.getDate()).padStart(2, "0");
		const todayDate = `${year}-${month}-${day}`;

		axios
			.get(`http://127.0.0.1:8000/restaurant/getorder/${restroId}/`)
			.then((response) => {
				if (response.data["success"]) {
					const orderData = response.data["orders"];
					const ordersToday = orderData.filter((order) =>
						order.created_at.startsWith(todayDate)
					);
					const totalPriceToday = orderData.reduce((total, order) => {
						const totalPrice = parseInt(order.total_price, 10);
						return total + totalPrice;
					}, 0);
					setTotalPrice(totalPriceToday);
					setNoOfOrders(orderData.length);
					setTodayOrders(ordersToday.length);
					const formattedOrders = response.data["orders"].map((order) => ({
						...order,
						orderitems: order.order_items.map(
							(item) => `${item.quantity} x ${item.item.item_name}`
						),
						ordernotes: order.order_items.map((item) => item.notes),
						price: order.total_price,
						paymentstatus: order.payment_status ? "Paid" : "Unpaid",
					}));
					const filteredOrders = formattedOrders.filter(
						(order) => order.status !== "Delivered"
					);
					setOrders(filteredOrders);
					const hourData = {};
					orderData.forEach((order) => {
						const timestamp = order.updated_at;
						const date = new Date(timestamp);
						const hour = date.getHours();
						if (!hourData[hour]) {
							hourData[hour] = 1;
						} else {
							hourData[hour]++;
						}
					});
				} else {
					setErrorMessage(response.data["message"]);
				}
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
							value={nooforders}
							icon={LocalShippingIcon}
						/>
					</Grid>
					<Grid item xs={12} md={4}>
						<Data title="Today Order" value={todayorders} icon={PeopleIcon} />
					</Grid>
					<Grid item xs={12} md={4}>
						<Data title="Total Earned" value={totalprice} icon={DollarIcon} />
					</Grid>
				</Grid>
			</Box>
			<Box mt={5} mr={5}>
				<Box
					sx={{
						backgroundColor:
							theme.palette.mode === "dark" ? colors.primary[600] : "white",
						borderRadius: 2,
						padding: 1,
					}}
				>
					<h1>Orders</h1>
					<Box
						sx={{
							overflow: "auto",
							maxHeight: "500px",
						}}
					>
						<Paper
							sx={{
								width: "100%",
								borderRadius: "15px 15px 0 0",
							}}
							elevation={5}
						>
							<TableContainer
								sx={{
									maxHeight: "73vh",
									// borderRadius: "15px 15px 0 0",
									backgroundColor:
										theme.palette.mode === "dark"
											? colors.primary[400]
											: "white",
								}}
							>
								<Table>
									<TableHead>
										<TableRow>
											{ordercol.map((column) => (
												<TableCell
													key={column.field}
													sx={{
														backgroundColor:
															theme.palette.mode === "dark"
																? colors.primary[700]
																: colors.primary[600],
														color: "white",
													}}
												>
													{column.headerName}
												</TableCell>
											))}
										</TableRow>
									</TableHead>
									<TableBody>
										{orders.map((row, index) => (
											<TableRow key={index}>
												{ordercol.map((column) => (
													<TableCell key={column.field}>
														{column.field === "orderitems" &&
														Array.isArray(row[column.field])
															? row[column.field].join(", ")
															: column.field === "status" &&
															  row.status !== "Delivered"
															? row[column.field] // Only display the status value
															: row[column.field]}
													</TableCell>
												))}
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</Paper>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default Dashboard;
