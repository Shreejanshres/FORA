import React, { useEffect, useState } from "react";
import {
  Typography,
  useTheme,
  Select,
  MenuItem,
  TableSortLabel,
} from "@mui/material";
import { tokens } from "../../../Theme";
import { Box } from "@mui/system";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";

export default function Orders() {
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

  const [orders, setOrders] = useState([]);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    const getOrders = () => {
      const userData = localStorage.getItem("token");
      const tokenParts = userData.split(".");
      const decodedPayload = JSON.parse(atob(tokenParts[1]));
      const restroId = decodedPayload.data.id;
      axios
        .get(`http://127.0.0.1:8000/restaurant/getorder/${restroId}/`)
        .then((response) => {
          if (response.data["success"] === true) {
            // Extracting item name and quantity and formatting them
            const formattedOrders = response.data["orders"].map((order) => ({
              ...order,
              orderitems: order.order_items.map(
                (item) => `${item.quantity} x ${item.item.item_name}`
              ),
              ordernotes: order.order_items.map((item) => item.notes),
              price: order.order_items.reduce(
                (total, item) => total + parseFloat(item.subtotal),
                0
              ),
              paymentstatus: order.payment_status ? "Paid" : "Unpaid",
            }));
            setOrders(formattedOrders);
          }
        });
    };

    getOrders();
  }, []);

  const handleStatusChange = (status, orderId) => {
    // Send a request to update the status
    axios
      .put(`http://127.0.0.1:8000/restaurant/updateorder/${orderId}/`, {
        status: status,
      })
      .then((response) => {
        if (response.data["success"] === true) {
          // Update the status in the local state
          const updatedOrders = orders.map((order) =>
            order.id === orderId ? { ...order, status: status } : order
          );
          setOrders(updatedOrders);
        }
      })
      .catch((error) => {
        console.error("Error updating order status:", error);
      });
  };

  const handleSort = (field) => {
    const isAsc = orderBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(field);
    // Sort orders array based on the selected column
    const sortedOrders = [...orders].sort((a, b) => {
      if (isAsc) {
        return a[field] < b[field] ? -1 : 1;
      } else {
        return a[field] > b[field] ? -1 : 1;
      }
    });
    setOrders(sortedOrders);
  };

  return (
    <Box ml={3} mr={5}>
      <Typography variant="h1" fontWeight="bold">
        Orders
      </Typography>
      <Box>
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
              borderRadius: "15px 15px 0 0",
              backgroundColor:
                theme.palette.mode === "dark" ? colors.primary[600] : "white",
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
                            ? colors.blueAccent[400]
                            : colors.blueAccent[500],
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
                        Array.isArray(row[column.field]) ? (
                          row[column.field].join(", ")
                        ) : column.field === "status" &&
                          row.status != "Delivered" ? (
                          <Select
                            value={row.status}
                            onChange={(e) =>
                              handleStatusChange(e.target.value, row.id)
                            }
                          >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Processing">Processing</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                            <MenuItem value="Delivering">Delivering</MenuItem>
                            <MenuItem value="Delivered">Delivered</MenuItem>
                          </Select>
                        ) : (
                          row[column.field]
                        )}
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
  );
}
