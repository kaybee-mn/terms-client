import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage'
import Navbar from './components/Navbar';
import History from './pages/History';
import Login from './pages/Login';
import AuthWrapper from './components/AuthWrapper';
import './App.css'
import Settings from './pages/Settings';

function App() {
  useEffect(()=>{const init =async()=>{}},[])
  

  return (
    <div className="bg-homepage-bg bg-cover font-crimson-txt bg-fixed overflow-hidden ">
      <div className='overflow-hidden h-screen'>
        
    <Router>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Homepage/>} />
      <Route path="/history" element={<History/>} />
      <Route path="/settings" element={<Settings />} />
      {/* <Route path="/login" element={<Login/>} /> */}
    </Routes>
  </Router>
  </div>
  </div>
  );
}

export default App
