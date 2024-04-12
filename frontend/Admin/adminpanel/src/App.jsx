import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./Theme";

import "./App.css";
import MenuBar from "./Components/global/MenuBar";
import Topbar from "./Components/global/Topbar";
// admin
import Adminlogin from "./Components/AdminPages/Login.jsx";
import Admindashboard from "./Components/AdminPages/Dashboard.jsx";
import Restaurant from "./Components/AdminPages/Restaurant/Restaurant.jsx";
import Admin from "./Components/AdminPages/Admin/Admin.jsx";
//restaurant
import Restaurantlogin from "./Components/RestaurantPages/Login.jsx";
import Restaurantdashboard from "./Components/RestaurantPages/Dashboard.jsx";
import Restaurantmenu from "./Components/RestaurantPages/Menu/Menu.jsx";
import Orders from "./Components/RestaurantPages/Orders/Orders.jsx";
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
              <Route path="/admin" element={<Adminlogin />} />
              <Route path="/admin/dashboard" element={<Admindashboard />} />
              <Route path="/admin/restaurant" element={<Restaurant />} />
              <Route path="/admin/admin" element={<Admin />} />

              <Route path="/restaurant" element={<Restaurantlogin />} />
              <Route
                path="/restaurant/dashboard"
                element={<Restaurantdashboard />}
              />
              <Route path="/restaurant/menu" element={<Restaurantmenu />} />
              <Route path="/restaurant/orders" element={<Orders />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
