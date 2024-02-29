import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../../Theme";
import styled from "@emotion/styled";
import axios from "axios";
const CustomTextField = styled(TextField)({});
function AddRestaurant({ open, close, title, data }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [companyname, setCompanyName] = useState("");
  const [ownername, setOwneryName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

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
        <Typography variant="h1">{title} </Typography>
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
            label="Restaurant Name"
            fullWidth
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <TextField
            label="Owner Name"
            fullWidth
            onChange={(e) => setOwneryName(e.target.value)}
          />
          <TextField
            label="Location"
            fullWidth
            onChange={(e) => setAddress(e.target.value)}
          />
          <TextField
            label="Phone Number"
            fullWidth
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextField
            label="email"
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
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
