import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Navbar from "./components/Navbar";
import History from "./pages/History";
import "./App.css";
import Settings from "./pages/Settings";
import { AlertProvider } from "./contexts/AlertContext";

function App() {
  useEffect(() => {
    const init = async () => {};
  }, []);

  return (
    <AlertProvider>
      <div className="bg-homepage-bg bg-cover font-crimson-txt bg-fixed overflow-hidden ">
        <div className="overflow-hidden h-screen">
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<Settings />} />
              {/* <Route path="/login" element={<Login/>} /> */}
            </Routes>
          </Router>
        </div>
      </div>
    </AlertProvider>
  );
}

export default App;
