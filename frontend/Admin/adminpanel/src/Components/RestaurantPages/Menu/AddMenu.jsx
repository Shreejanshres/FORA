import React, { useState, useEffect } from "react";
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

function AddMenu({ open, close, title, headings }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [itemname, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("veg");
  const [heading, setHeading] = useState("");

  const [tags, setTags] = useState([]);
  useEffect(() => {
    const fetchtags = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/restaurant/displaytags/`
        );
        setTags(response.data);
      } catch (error) {
        console.error("Error fetching headings:", error);
      }
    };
    fetchtags();
  }, []);

  const addmenuitem = async () => {
    const data = {
      item_name: itemname,
      price: price,
      tags: tag,
      heading: heading,
    };
    console.log(data);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/restaurant/addmenu/`,
        data
      );
      console.log(response);
      close();
    } catch (error) {
      console.error("Error adding menu item:", error);
    }
    window.location.reload();
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
            label="Price"
            fullWidth
            onChange={(e) => setPrice(e.target.value)}
          />
          <Select
            label="Tag"
            fullWidth
            value={tag || ""}
            onChange={(e) => setTag(e.target.value)}
          >
            {tags.map((tagItem) => (
              <MenuItem key={tagItem.id} value={tagItem.id}>
                {tagItem.tag}
              </MenuItem>
            ))}
          </Select>
          <Select
            label="Heading"
            fullWidth
            value={heading || ""}
            onChange={(e) => setHeading(e.target.value)}
          >
            {headings.map((headingItem) => (
              <MenuItem key={headingItem.id} value={headingItem.id}>
                {headingItem.heading_name}
              </MenuItem>
            ))}
          </Select>
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
          onClick={() => addmenuitem()}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddMenu;
