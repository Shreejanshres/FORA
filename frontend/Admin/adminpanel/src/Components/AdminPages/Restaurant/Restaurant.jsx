import { Box, TextField, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../Theme.jsx";
import Table from "./restauranttable.jsx";
import { alpha, styled } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Popup from "./AddRestaurant.jsx";
import { useState, useEffect } from "react";
import axios from "axios";
const columns = [
  { field: "id", headerName: "ID" },
  {
    field: "name",
    headerName: "Restaurant  Name",
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
  {
    field: "email",
    headerName: "Email",
    type: "email",
    editable: true,
  },
  {
    field: "ownername",
    headerName: "Owner Name",
    editable: true,
  },
];

const CssTextField = styled(TextField)(({ theme }) => ({
  "& label.Mui-focused": {
    color: theme.palette.mode === "dark" ? "white" : "black",
  },
  "& .MuiOutlinedInput-focused": {
    color: "blue",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: theme.palette.mode === "dark" ? "white" : "black",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: theme.palette.mode === "dark" ? "white" : "black",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.mode === "dark" ? "white" : "black",
    },
  },
}));

const Restaurant = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const handleclose = () => {
    setOpen(false);
  };
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/admin/viewrestaurant/")
      .then((response) => {
        setRows(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  return (
    <Box ml={3} mr={5}>
      <Box>
        <Typography variant="h1" fontWeight="bold">
          Restaurants
        </Typography>
      </Box>
      <Box
        sx={{
          // border: "2px solid red",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <CssTextField
          label="Search"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
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
          Add Restaurant
        </Button>
        <Popup open={open} close={handleclose} title="Add Restaurant" />
      </Box>
      <Box m="20px 0 0 0">
        <Table columns={columns} data={rows} />
      </Box>
    </Box>
  );
};
export default Restaurant;
