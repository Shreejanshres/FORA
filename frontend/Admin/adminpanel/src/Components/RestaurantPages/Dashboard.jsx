import {
	Box,
	Select,
	MenuItem,
	Typography,
	useTheme,
	TableSortLabel,
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

const Dashboard = () => {
	const columns = [
		{ field: "id", headerName: "ID" },
		{ field: "user", headerName: "Customer Name" },
		{ field: "orderitems", headerName: "Order Items" },
		{ field: "ordernotes", headerName: "Order Notes" },
		{ field: "address", headerName: "Address" },
		{ field: "price", headerName: "Price", type: "number", editable: true },
		{ field: "payment_method", headerName: "Payment" },
		{ field: "paymentstatus", headerName: "Payment Status" },
		{ field: "status", headerName: "Status" },
	];
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [errormessage, setErrorMessage] = useState("");
	const [xAxis, setXAxis] = useState([]);
	const [yAxis, setYAxis] = useState([]);
	const [nooforders, setNoOfOrders] = useState(0);
	const [todayorders, setTodayOrders] = useState(0);
	const [orderBy, setOrderBy] = useState("");
	const [orders, setOrders] = useState([]);
	const [totalprice, setTotalPrice] = useState(0);
	const today = new Date();
	const [value, onChange] = useState(today);

	useEffect(() => {
		const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
		const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
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
					const xAxis = Object.keys(hourData).map((hour) => parseInt(hour));
					const yAxis = Object.values(hourData);

					// Update state variables
					setXAxis(xAxis);
					setYAxis(yAxis);
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
			<Box display={"flex"}>
				<Box width={"60%"}>
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
									theme.palette.mode === "dark" ? colors.primary[400] : "white",
							}}
						>
							<Table>
								<TableHead>
									<TableRow>
										{columns.map((column) => (
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
												{column.field !== "status" ? (
													<TableSortLabel
														active={orderBy === column.field}
														direction={orderBy === column.field ? order : "asc"}
														onClick={() => handleSort(column.field)}
													>
														{column.headerName}
													</TableSortLabel>
												) : (
													column.headerName
												)}
											</TableCell>
										))}
									</TableRow>
								</TableHead>
								<TableBody>
									{orders.map((row, index) => (
										<TableRow key={index}>
											{columns.map((column) => (
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
					<Typography variant="h3" fontWeight="bold">
						Total Orders: {nooforders}
					</Typography>
					<Typography variant="h3" fontWeight="bold">
						Orders Today: {todayorders}
					</Typography>
					<Typography variant="h3" fontWeight="bold">
						Total Income: {totalprice}
					</Typography>
				</Box>
				<Box>{/* <Calendar onChange={onChange} value={value} /> */}</Box>
			</Box>
		</Box>
	);
};

export default Dashboard;
