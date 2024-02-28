import { Box, TextField, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../Theme.jsx";
import Table from "../../global/table.jsx";
import { alpha, styled } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Popup from "./AddMenu.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
const columns = [
  { field: "id", headerName: "ID" },
  {
    field: "name",
    headerName: "Name",
    editable: true,
  },
  {
    field: "description",
    headerName: "description",
    editable: true,
  },
  {
    field: "price",
    headerName: "Price",
    type: "number",
    editable: true,
  },
  {
    field: "tag",
    headerName: "Tag",
    type: "email",
    editable: true,
  },
];

// const rows = [
//   {
//     id: 1,
//     restaurant: "foodhub by H2O",
//     address: "Jhochhen",
//     phone: "9841385218",
//     email: "foodhub@gmail.com",
//     ownerName: "John Doe",
//   },
// ];

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#A0AAB4",
  },

  "& .MuiInput-underline:after": {
    borderBottomColor: "#B2BAC2",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#E0E3E7",
    },
    "&:hover fieldset": {
      borderColor: "#B2BAC2",
    },
  },
});

const Restaurant = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [open, setOpen] = useState(false);
  const handleclose = () => {
    setOpen(false);
  };
  const [rows, setRows] = useState([]);

  // useEffect(() => {
  //   axios
  //     .get("http://127.0.0.1:8000/admin/viewrestaurant/")
  //     .then((response) => {
  //       // Handle the data from the backend
  //       console.log(response.data);
  //       setRows(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }, []);

  return (
    <Box ml={3} mr={5}>
      <Box>
        <Typography variant="h1" fontWeight="bold">
          Menu
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
          variant="outlined"
          sx={{
            borderRadius: 3,
            borderColor: colors.greenAccent[500],
            color: colors.grey[100],
            ":hover": {
              backgroundColor: colors.greenAccent[800],
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
