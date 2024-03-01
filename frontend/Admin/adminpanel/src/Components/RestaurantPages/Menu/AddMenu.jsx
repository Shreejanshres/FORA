import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  TextField,
  Typography,
  useTheme,
  MenuItem,
} from "@mui/material";
import { tokens } from "../../../Theme";
import styled from "@emotion/styled";
import axios from "axios";
const CustomTextField = styled(TextField)({});
function AddRestaurant({ open, close, title, data }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [itemname, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [heading, setHeading] = useState("");

  const handleSubmit = () => {
    data = {
      name: companyname,
      ownername: ownername,
      address: address,
      phonenumber: phone,
      email: email,
    };
    axios
      .post("http://127.0.0.1:8000/admin/addrestaurant/", data)
      .then((response) => {
        console.log(response.data);
        if (response.data["success"] === true) {
          alert("Restaurant added successfully");
          close();
        }
      });
  };

  return (
    <Dialog open={open} onClose={close} fullWidth>
      <DialogTitle textAlign="center">
        <Typography variant="h2">{title} </Typography>
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
          <TextField
            label="Item Name"
            fullWidth
            onChange={(e) => setItemName(e.target.value)}
          />
          <TextField
            id="outlined-multiline-flexible"
            label="Descrption"
            multiline
            maxRows={4}
            fullWidth
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label="Price"
            fullWidth
            onChange={(e) => setPrice(e.target.value)}
          />
          <Select
            label="Tag"
            fullWidth
            onChange={(e) => setTag(e.target.value)}
          >
            <MenuItem value={"veg"}>Veg</MenuItem>
            <MenuItem value={"non-veg"}>Non-Veg</MenuItem>
          </Select>
          <Select
            label="Heading"
            fullWidth
            onChange={(e) => setHeading(e.target.value)}
          />
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
            backgroundColor: colors.blueAccent[500],
          }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddRestaurant;
