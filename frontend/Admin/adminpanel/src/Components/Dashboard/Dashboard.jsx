import React from 'react';
import { Box } from '@mui/material';
const Dashboard = () => {
    return (
        <Box
            component="main"
            sx={{ flexGrow: 1, ml: "240px", bgcolor: 'background.default', p: 3 }}
        >
            <h1> Dashboard</h1>
        </Box>
    );
}

export default Dashboard;