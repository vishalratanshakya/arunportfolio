import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Education from './components/Education';
import Experience from './components/Experience';
import Technologies from './components/Technologies';
import Projects from './components/Projects';
import Contact from './components/Contact';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';

function MainPortfolio({ isAuthenticated, handleLogout }) {
  useEffect(() => {
    // Global fix for video cut-offs on servers
    const fixVideos = () => {
      document.querySelectorAll('video').forEach(video => {
        if (!video.hasAttribute('data-video-fixed')) {
          video.preload = 'auto';
          video.setAttribute('crossorigin', 'anonymous');
          video.playsInline = true;
          video.setAttribute('data-video-fixed', 'true');
          
          if (video.readyState < 3) {
             video.load();
          }
        }
      });
    };

    const interval = setInterval(fixVideos, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen text-gray-200 selection:bg-red-600 selection:text-white">
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />

      <main className="pt-20">
        <Hero />
        <Education />
        <Experience />
        <Technologies />
        <Projects adminMode={isAuthenticated} />
        <Contact />
      </main>
      <footer className="py-8 text-center text-sm text-gray-500 border-t border-white/5 mt-20">
        <p>© {new Date().getFullYear()} Arun Kumar. All rights reserved.</p>
      </footer>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAdminAuthenticated') === 'true'
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAdminAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminToken');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPortfolio isAuthenticated={isAuthenticated} handleLogout={handleLogout} />} />
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to="/" replace /> : 
            <AdminLogin onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/admin" 
          element={
            isAuthenticated ? 
            <AdminDashboard onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } 
        />
        {/* Wildcard to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
