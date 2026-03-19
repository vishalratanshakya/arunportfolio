import React from 'react';
import { motion } from 'framer-motion';
import { personalData } from '../data/personalData';

export default function Hero() {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center md:text-left"
        >
          <h2 className="text-purple-400 font-semibold tracking-wide uppercase text-sm mb-3">Hello, I am</h2>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">
            {personalData.name}
          </h1>
          <h3 className="text-2xl md:text-3xl text-gray-400 font-light mb-6">
            {personalData.title}
          </h3>
          <p className="text-gray-400 leading-relaxed max-w-xl mx-auto md:mx-0">
            {personalData.about}
          </p>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 inline-block"
          >
            <a href="#projects" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-medium transition-colors">
              View Work
            </a>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 flex justify-center"
        >
          <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full p-2 bg-gradient-to-tr from-purple-600 to-transparent">
            <div className="absolute inset-2 bg-[#0a0a0a] rounded-full overflow-hidden">
              <img 
                src={personalData.profileImage} 
                alt={personalData.name} 
                className="w-full h-full object-cover transition-all duration-500"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -inset-4 bg-purple-500/20 blur-3xl -z-10 rounded-full"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
