import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage'
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AuthWrapper from './components/AuthWrapper';
import './App.css'

function App() {

  return (
    <div className="bg-homepage-bg bg-cover font-crimson-txt bg-fixed overflow-hidden ">
      <div className='overflow-hidden h-screen'>
        <AuthWrapper>
        
    <Router>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Homepage/>} />
      <Route path="/dashboard" element={<Dashboard/>} />
      {/* <Route path="/login" element={<Login/>} /> */}
    </Routes>
  </Router>
  </AuthWrapper>
  </div>
  </div>
  );
}

export default App
