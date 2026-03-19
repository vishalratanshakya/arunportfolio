import React from 'react';
import { motion } from 'framer-motion';
import { techData } from '../data/techData';

export default function Technologies() {
  return (
    <section id="technologies" className="py-20 bg-black/50 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent inline-block">Technologies</h2>
          <div className="h-1 w-20 bg-purple-600 mx-auto mt-4 rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {techData.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.1, translateY: -5 }}
              className="glass p-6 rounded-2xl flex flex-col items-center justify-center gap-4 hover:shadow-[0_10px_30px_rgba(168,85,247,0.3)] transition-shadow group"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-xl bg-white/5 p-3 group-hover:bg-purple-900/40 transition-colors">
                <img 
                  src={tech.icon} 
                  alt={tech.name} 
                  className="max-w-full max-h-full object-contain filter drop-shadow-lg"
                />
              </div>
              <span className="text-sm md:text-base font-semibold text-gray-300 group-hover:text-purple-400 text-center">{tech.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
