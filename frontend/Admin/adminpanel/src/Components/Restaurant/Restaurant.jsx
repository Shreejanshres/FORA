import { Box, TextField, Typography, useTheme } from "@mui/material";
import { tokens } from "../../Theme";
import Table from "../Table/table.jsx";
import { alpha, styled } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "firstName",
    headerName: "First name",
    width: 150,
    editable: true,
  },
  {
    field: "lastName",
    headerName: "Last name",
    width: 150,
    editable: true,
  },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 110,
    editable: true,
  },
];

const rows = [
  { id: 1, lastName: "Last1", firstName: "First1", age: 25 },
  { id: 2, lastName: "Last2", firstName: "First2", age: 32 },
  { id: 3, lastName: "Last3", firstName: "First3", age: 28 },
  { id: 4, lastName: "Last4", firstName: "First4", age: 40 },
  { id: 5, lastName: "Last5", firstName: "First5", age: 22 },
  { id: 6, lastName: "Last6", firstName: "First6", age: 38 },
  { id: 7, lastName: "Last7", firstName: "First7", age: 45 },
  { id: 8, lastName: "Last8", firstName: "First8", age: 33 },
  { id: 9, lastName: "Last9", firstName: "First9", age: 29 },
  { id: 10, lastName: "Last10", firstName: "First10", age: 26 },
  { id: 11, lastName: "Last11", firstName: "First11", age: 31 },
  { id: 12, lastName: "Last12", firstName: "First12", age: 36 },
  { id: 13, lastName: "Last13", firstName: "First13", age: 27 },
  { id: 14, lastName: "Last14", firstName: "First14", age: 42 },
  { id: 15, lastName: "Last15", firstName: "First15", age: 23 },
  { id: 16, lastName: "Last16", firstName: "First16", age: 39 },
  { id: 17, lastName: "Last17", firstName: "First17", age: 47 },
  { id: 18, lastName: "Last18", firstName: "First18", age: 34 },
  { id: 19, lastName: "Last19", firstName: "First19", age: 30 },
  { id: 20, lastName: "Last20", firstName: "First20", age: 27 },
  { id: 21, lastName: "Last21", firstName: "First21", age: 35 },
  { id: 22, lastName: "Last22", firstName: "First22", age: 41 },
  { id: 23, lastName: "Last23", firstName: "First23", age: 26 },
  { id: 24, lastName: "Last24", firstName: "First24", age: 44 },
  { id: 25, lastName: "Last25", firstName: "First25", age: 21 },
  { id: 26, lastName: "Last26", firstName: "First26", age: 37 },
  { id: 27, lastName: "Last27", firstName: "First27", age: 46 },
  { id: 28, lastName: "Last28", firstName: "First28", age: 32 },
  { id: 29, lastName: "Last29", firstName: "First29", age: 28 },
  { id: 30, lastName: "Last30", firstName: "First30", age: 25 },
  { id: 31, lastName: "Last31", firstName: "First31", age: 33 },
  { id: 32, lastName: "Last32", firstName: "First32", age: 39 },
  { id: 33, lastName: "Last33", firstName: "First33", age: 24 },
  { id: 34, lastName: "Last34", firstName: "First34", age: 40 },
  { id: 35, lastName: "Last35", firstName: "First35", age: 29 },
  { id: 36, lastName: "Last36", firstName: "First36", age: 36 },
  { id: 37, lastName: "Last37", firstName: "First37", age: 43 },
  { id: 38, lastName: "Last38", firstName: "First38", age: 30 },
  { id: 39, lastName: "Last39", firstName: "First39", age: 26 },
  { id: 40, lastName: "Last40", firstName: "First40", age: 35 },
  { id: 41, lastName: "Last41", firstName: "First41", age: 41 },
  { id: 42, lastName: "Last42", firstName: "First42", age: 28 },
  { id: 43, lastName: "Last43", firstName: "First43", age: 38 },
  { id: 44, lastName: "Last44", firstName: "First44", age: 45 },
  { id: 45, lastName: "Last45", firstName: "First45", age: 32 },
  { id: 46, lastName: "Last46", firstName: "First46", age: 29 },
  { id: 47, lastName: "Last47", firstName: "First47", age: 37 },
  { id: 48, lastName: "Last48", firstName: "First48", age: 42 },
  { id: 49, lastName: "Last49", firstName: "First49", age: 31 },
  { id: 50, lastName: "Last50", firstName: "First50", age: 27 },
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
    // "&.Mui-focused fieldset": {
    //   borderColor: {colors.blueAccent[600]},
    // },
  },
});

const Restaurant = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box ml={3} mr={5}>
      <Box>
        <Typography variant="h1" fontWeight="bold">
          Restaurants
        </Typography>
      </Box>
      <Box>
        {/* <TextField
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
          style={{
            "&.Mui-focused": {
              fieldset: {
                borderColor: "red",
              },
            },
          }}
        /> */}
        <CssTextField label="Custom CSS" id="custom-css-outlined-input" />
      </Box>
      <Box m="40px 0 0 0" height="75vh">
        <Table columns={columns} data={rows} />
      </Box>
    </Box>
  );
};
export default Restaurant;
