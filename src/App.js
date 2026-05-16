import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import About from './pages/About/About';
import Traffic from './pages/Traffic/Traffic';
import Reports from './pages/Reports/Reports';
import News from './pages/News/News';
import Contact from './pages/Contact/Contact';
import Admin from './pages/Admin/Admin';
import Radars from './pages/Radars/Radars';
import TrafficLaws from './pages/TrafficLaws/TrafficLaws';

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/traffic" element={<Traffic />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/radars" element={<Radars />} />
        <Route path="/traffic-laws" element={<TrafficLaws />} />
        <Route path="/news" element={<News />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><Admin /></ProtectedRoute>} />
      </Routes>

      <Footer />
    </>
  );
}
