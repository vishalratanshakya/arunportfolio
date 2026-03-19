import React from 'react';
import { motion } from 'framer-motion';
import { educationData } from '../data/educationData';

export default function Education() {
  return (
    <section id="education" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent inline-block">Education</h2>
          <div className="h-1 w-20 bg-purple-600 mx-auto mt-4 rounded-full"></div>
        </motion.div>

        <div className="space-y-8">
          {educationData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="glass p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-white/10 transition-colors"
            >
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.degree}</h3>
                <p className="text-purple-400 font-medium">{item.school}</p>
              </div>
              <div className="mt-4 md:mt-0 px-4 py-2 bg-purple-900/30 text-purple-300 rounded-full text-sm font-semibold border border-purple-500/20">
                {item.duration}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
