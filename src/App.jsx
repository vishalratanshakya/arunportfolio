import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Mail, Phone } from 'lucide-react';

import Header from './components/Header';
import Hero from './components/Hero';
import Education from './components/Education';
import Experience from './components/Experience';
import Technologies from './components/Technologies';
import Projects from './components/Projects';
import Contact from './components/Contact';

function App() {
  return (
    <div className="min-h-screen text-gray-200 selection:bg-purple-500 selection:text-white">
      <Header />
      <main className="pt-20">
        <Hero />
        <Education />
        <Experience />
        <Technologies />
        <Projects />
        <Contact />
      </main>
      
      <footer className="py-8 text-center text-sm text-gray-500 border-t border-white/5 mt-20">
        <p>© {new Date().getFullYear()} Arun Kumar. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
