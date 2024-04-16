import { react } from "react";
import { Box, Typography } from "@mui/material";

export default function UserProfile() {
  return (
    <Box ml={3} mr={5}>
      <Box>
        <Typography variant="h1" fontWeight="bold">
          User Profile
        </Typography>
      </Box>
      <Box display={"flex"}>
        <Box>
          <img
            src="https://www.w3schools.com/howto/img_avatar.png"
            alt="user"
            style={{ width: "200px", height: "200px" }}
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
          <Typography variant="h5">Name: John Doe</Typography>
          <Typography variant="h5">Email:adsad @gmail.com</Typography>
          <Typography variant="h5">Phone: 1234567890</Typography>
          <Typography variant="h5">
            Address: 123, abc street, xyz city
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
