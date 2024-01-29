import React, { useState } from "react";
// import TextField from '@mui/material/TextField';
// import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { InputAdornment, TextField, Button, IconButton, useTheme } from "@mui/material";
import "./Login.css";
import { tokens } from "../../Theme";

const Login = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };
    const HandleClick = () => {
        alert(`Email: ${email}\nPassword: ${password}`);
    }

    return (
        <>
            <div class="innerbox">
                <form method="POST">
                    <h1 style={{ backgroundColor: colors.blueAccent[500] }}>Login</h1>
                    <div id="inputs">
                        <TextField id="textfield" label="Email" variant="outlined" fullWidth type="email" margin="normal" color="secondary" onChange={(e) => setEmail(e.target.value)} />
                        <TextField
                            id="textfield"

                            label="Password"
                            placeholder="Password"
                            color="secondary"
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            edge="end"
                                            onClick={handleTogglePassword}
                                        >
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            // style={{ marginTop: '1rem' }}
                            onChange={(e) => setPassword(e.target.value)}

                        />
                        <Button variant="contained" size="medium" sx={{
                            backgroundColor: colors.blueAccent[600],
                            color: colors.grey[100],
                        }} onClick={HandleClick} >Login</Button>
                    </div>
                </form >
            </div >
        </>
    );
};

export default Login;
