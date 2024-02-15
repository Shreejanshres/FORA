import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./Theme";

import "./App.css";

// admin
import Login from "./Components/AdminPages/Login.jsx";
import MenuBar from "./Components/global/MenuBar";
import Topbar from "./Components/global/Topbar";
import Dashboard from "./Components/AdminPages/Dashboard.jsx";
import Restaurant from "./Components/AdminPages/Restaurant/Restaurant.jsx";
import Admin from "./Components/AdminPages/Admin/Admin.jsx";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();
  const adminLoginPage = location.pathname === "/admin";
  const restaurantLoginPage = location.pathname === "/restaurant";

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {!adminLoginPage && !restaurantLoginPage && <MenuBar />}
          <main className="content">
            {!adminLoginPage && !restaurantLoginPage && (
              <Topbar setIsSidebar={setIsSidebar} />
            )}
            <Routes>
              <Route path="/admin" element={<Login />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/restaurant" element={<Restaurant />} />
              <Route path="/admin/admin" element={<Admin />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
