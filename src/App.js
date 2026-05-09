import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import About from './pages/About/About';
import Traffic from './pages/Traffic/Traffic';
import Reports from './pages/Reports/Reports';
import News from './pages/News/News';
import Contact from './pages/Contact/Contact';
import Admin from './pages/Admin/Admin';

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/traffic" element={<Traffic />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/news" element={<News />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      <Footer />
    </>
  );
}
