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
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const handleSubmit = async () => {
    const data = {
      name: name,
      address: address,
      phonenumber: phone,
      email: email,
    };
    console.log(data);
    try {
      console.log(data);
      const response = await axios.post(
        "http://127.0.0.1:8000/admin/adminsignup/",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        alert("Admin added successfully");
        close();
        window.location.reload();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("Error:", error);
    }
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
            label="Name"
            fullWidth
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Address"
            fullWidth
            onChange={(e) => setAddress(e.target.value)}
          />
          <TextField
            label="Phone Number"
            fullWidth
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextField
            label="Email"
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
            backgroundColor: colors.greenAccent[500],
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
