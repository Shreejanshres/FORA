import { Box, TextField, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../Theme.jsx";
import Table from "../../global/table.jsx";
import { alpha, styled } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Popup from "./AddRestaurant.jsx";
import { useState } from "react";
const columns = [
  { field: "id", headerName: "ID" },
  {
    field: "restaurant",
    headerName: "Restaurant  Name",
    editable: true,
  },
  {
    field: "address",
    headerName: "Address",
    editable: true,
  },
  {
    field: "phone",
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
    field: "ownerName",
    headerName: "Owner Name",
    editable: true,
  },
];

const rows = [
  {
    id: 1,
    restaurant: "foodhub by H2O",
    address: "Jhochhen",
    phone: "9841385218",
    email: "foodhub@gmail.com",
    ownerName: "John Doe",
  },
];
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
