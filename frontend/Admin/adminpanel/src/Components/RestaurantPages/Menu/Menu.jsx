import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import Popup from "./AddMenu.jsx";
import { alpha } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import Table from "./menutable.jsx"; // Assuming you have defined this component

const Restaurant = () => {
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
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

  const theme = useTheme();
  const colors = {
    blueAccent: theme.palette.mode === "dark" ? "#0c84e4" : "#42a5f5",
    greenAccent: theme.palette.mode === "dark" ? "#4caf50" : "#66bb6a",
    grey: theme.palette.grey,
    redAccent: theme.palette.mode === "dark" ? "#f44336" : "#ef5350",
  };

  const [open, setOpen] = useState(false);
  const [openheading, setOpenHeading] = useState(false);
  const [headings, setHeadings] = useState([]);
  const [rows, setRows] = useState([]);
  const [itemname, setItemName] = useState("");
  const [restroid, setRestroid] = useState("");

  useEffect(() => {
    var userdata = localStorage.getItem("token");
    const tokenParts = userdata.split(".");
    const decodedPayload = JSON.parse(atob(tokenParts[1]));
    const restro = decodedPayload.data.id;
    setRestroid(restro);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/restaurant/display_headings/${restro}/`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        localStorage.setItem("headings", JSON.stringify(response.data.data));
        setHeadings(response.data.data[0].heading_set);
        allmenuitems(); // Call allmenuitems to populate rows with all menu items
      } catch (error) {
        console.error("Error fetching headings:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    allmenuitems(); // Call allmenuitems to populate rows with all menu items
  }, [headings]);

  const allmenuitems = () => {
    const newRows = [];
    headings.forEach((heading) => {
      heading.menuitem_set.forEach((menuitem) => {
        newRows.push({
          heading_id: heading.id,
          tag: heading.heading_name,
          id: menuitem.id,
          name: menuitem.item_name,
          price: menuitem.price,
        });
      });
    });
    setRows(newRows);
  };

  const heading_item = (index) => {
    const newRows = [];
    headings[index].menuitem_set.forEach((menuitem) => {
      newRows.push({
        heading_id: headings[index].id,
        tag: headings[index].heading_name,
        id: menuitem.id,
        name: menuitem.item_name,
        price: menuitem.price,
      });
    });
    setRows(newRows);
  };

  const handleOpen = () => {
    setOpen(!open);
  };
  const handleclose = () => {
    setOpen(false);
  };
  const openaddheading = () => {
    setOpenHeading(!openheading);
  };
  const closeheading = () => {
    setOpenHeading(false);
  };

  const addheading = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/restaurant/add_heading/`,
        {
          heading_name: itemname,
          restaurant: restroid,
        }
      );

      if (response.data["success"] === true) {
        alert("Heading added successfully");
        setOpenHeading(false);

        // Fetch the updated list of headings
        const updatedHeadingsResponse = await axios.get(
          `http://127.0.0.1:8000/restaurant/display_headings/${restroid}/`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const updatedHeadings =
          updatedHeadingsResponse.data.data[0].heading_set;
        setHeadings(updatedHeadings);
      } else {
        console.error("Failed to add heading:", response.data);
        alert("Failed to add heading");
      }
    } catch (error) {
      console.error("Error adding heading:", error);
      alert("Failed to add heading");
    }
  };
  return (
    <Box ml={3} mr={5}>
      <Box>
        <Typography variant="h1" fontWeight="bold">
          Menu
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          // justifyContent: "space-around",
          gap: "10px",
          backgroundColor: alpha(colors.blueAccent, 0.4),
          height: "50px",
          borderRadius: "10px",
        }}
      >
        <Button
          variant="text"
          sx={{
            color: "white",
            fontSize: "15px",
            fontWeight: "bold",
            ":hover": {
              backgroundColor: colors.greenAccent,
              color: colors.grey[100],
            },
          }}
          onClick={allmenuitems}
        >
          All
        </Button>
        {headings.map((heading, index) => (
          <Button
            key={index}
            variant="text"
            sx={{
              color: "white",
              fontSize: "15px",
              fontWeight: "bold",
              ":hover": {
                backgroundColor: colors.greenAccent,
                color: colors.grey[100],
              },
            }}
            onClick={() => heading_item(index)}
          >
            {heading.heading_name}
          </Button>
        ))}
        <IconButton
          size="large"
          sx={{
            backgroundColor: colors.blueAccent,
            margin: "5px 0px 5px 0px",
            color: "white",
            ":hover": {
              backgroundColor: colors.greenAccent,
            },
          }}
          onClick={openaddheading}
        >
          <Dialog open={openheading} onClose={closeheading} fullWidth>
            <DialogTitle textAlign="center">
              <Typography variant="h2">Add Heading</Typography>
            </DialogTitle>
            <DialogContent
              sx={{
                display: "flex",
                gap: 2,
                p: 3,
                pt: 1,
              }}
            >
              <TextField
                label="Heading name"
                fullWidth
                onChange={(e) => setItemName(e.target.value)}
                // prevent from closing
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                variant="contained"
                sx={{
                  background: colors.blueAccent,
                }}
                onClick={() => addheading()}
              >
                Save
              </Button>
            </DialogContent>
          </Dialog>

          <AddIcon />
        </IconButton>
        <Popup open={open} close={handleclose} title="Add Menu"  headings={headings}  />
      </Box>
      <Box m="20px 0 0 0">
        <Table columns={columns} data={rows} onClick={handleOpen} />
      </Box>
    </Box>
  );
};

export default Restaurant;
