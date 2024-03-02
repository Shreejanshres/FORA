import { Box, TextField, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../Theme.jsx";
import Table from "../../global/table.jsx";
import { alpha, styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Popup from "./AddMenu.jsx";
import { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { Input } from "@mui/material";
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
  const [headings, setHeadings] = useState([]);

  const [newHeading, setNewHeading] = useState("New Heading");
  useLayoutEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/restaurant/display_headings/",
          {
            params: {
              id: 1,
            },
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setHeadings(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (headings.length > 0) {
      allmenuitems();
    }
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

  const sendHeadingToBackend = async (heading) => {
    try {
      // Make an API call to add the new heading to the backend
      const response = await axios.post(
        "http://127.0.0.1:8000/restaurant/add_heading/",
        {
          userId: 1,
          heading,
        }
      );
      console.log(response.data); // Handle the response from the backend as needed
    } catch (error) {
      console.error("Error adding heading to backend:", error);
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
          // border: "2px solid red",
          display: "flex",
          justifyContent: "space-arournd",
          gap: "10px",
          backgroundColor: alpha(colors.blueAccent[700], 0.5),
          height: "50px",
        }}
      >
        <Button
          variant="text"
          sx={{
            color: "white",
            fontSize: "15px",
            fontWeight: "bold",
            ":hover": {
              backgroundColor: colors.greenAccent[800],
              color: colors.grey[100],
            },
          }}
          onClick={() => allmenuitems()}
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
                backgroundColor: colors.greenAccent[800],
                color: colors.grey[100],
              },
            }}
            onClick={() => heading_item(index)}
          >
            {heading.heading_name}
          </Button>
        ))}
        {open && (
          <Input
            aria-label="New Heading"
            onInput={(e) => setNewHeading(e.currentTarget.textContent)}
          />
        )}
        <IconButton
          size="large"
          sx={{
            backgroundColor: colors.blueAccent[500],
            margin: "5px 0px 5px 0px",
            color: "white",
            ":hover": {
              backgroundColor: colors.greenAccent[800],
            },
          }}
          onClick={() => setOpen(!open)}
        >
          <AddIcon />
        </IconButton>

        {/* <Popup open={open} close={handleclose} title="Add Menu" /> */}
      </Box>
      <Box m="20px 0 0 0">
        <Table columns={columns} data={rows} />
      </Box>
    </Box>
  );
};
export default Restaurant;
// onClick={() => setOpen(!open)}
