import { useEffect, useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../Theme";
import axios from "axios";

export default function UserProfile() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [picture, setPicture] = useState("");
  const [id, setId] = useState("");
  const [tempimage, setTempImage] = useState(null);
  const [tempprofile, setTempProfile] = useState(null);

  useEffect(() => {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));

    if (tokenCookie) {
      const token = tokenCookie.split("=")[1];
      const data = JSON.parse(atob(token.split(".")[1]));
      console.log(data);
      setId(data.data.id);
      setName(data.data.name);
      setEmail(data.data.email);
      setPhone(data.data.phonenumber);
      setAddress(data.data.address);
      setPicture(data.data.picture);
    }
  }, []);

  const setCookies = (name, value, days) => {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  };

  const handleSave = () => {
    const data = {
      picture: tempprofile,
    };
    console.log(data);
    axios
      .put(`http://127.0.0.1:8000/admin/updateadmin/${id}/`, data)
      .then((response) => {
        setCookies("token", response.data.token, 1);
        window.location.reload();
      });
  };

  const handleProfileChange = async (event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
    if (selectedFile) {
      const base64 = await convertToBase64(selectedFile);
      setTempProfile(base64);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  return (
    <Box ml={3} mr={5}>
      <Box>
        <Typography variant="h1" fontWeight="bold">
          User Profile
        </Typography>
      </Box>

      <Box
        mt={2}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* profile image */}
        <Box>
          <img
            src={
              tempprofile != null ? (
                tempprofile
              ) : picture != null ? (
                `http://127.0.0.1:8000/${picture}`
              ) : (
                <Box>
                  <Typography variant="h3">No Image</Typography>
                </Box>
              )
            }
            // alt="Profile Picture"
            style={{ width: "200px", height: "200px", cursor: "pointer" }}
            onClick={() => document.getElementById("profileinput").click()}
          />
          <input
            id="profileinput"
            type="file"
            onChange={handleProfileChange}
            style={{ display: "none" }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 3,
            pt: 1,
          }}
        >
          <Typography variant="h3">Name: {name}</Typography>
          <Typography variant="h3">Email: {email}</Typography>
          <Typography variant="h3">Phone: {phone}</Typography>
          <Typography variant="h3">Address: {address}</Typography>
        </Box>
      </Box>
      <Box style={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: colors.blueAccent[400], color: "white" }}
          size="large"
          onClick={handleSave}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}
