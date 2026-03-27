import React from 'react';
import { motion } from 'framer-motion';
import { experienceData } from '../data/experienceData';

export default function Experience() {
  return (
    <section id="experience" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white inline-block">Professional Experience</h2>
          <div className="h-1 w-20 bg-purple-600 mx-auto mt-4 rounded-full"></div>
        </motion.div>

        <div className="relative border-l-2 border-purple-500/30 pl-8 ml-4 md:ml-0 space-y-12">
          {experienceData.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="relative"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[41px] top-1.5 w-5 h-5 bg-black border-4 border-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
              
              <div className="glass p-6 rounded-2xl flex flex-col items-start hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] transition-all">
                <div className="w-full flex flex-col md:flex-row justify-between mb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-purple-400">{exp.role}</h3>
                  <span className="text-gray-400 text-sm md:text-base font-medium mt-1 md:mt-0 px-3 py-1 bg-white/5 rounded-full">{exp.duration}</span>
                </div>
                <h4 className="text-lg text-white font-medium mb-4">{exp.company}</h4>
                <ul className="list-none space-y-3">
                  {exp.description.map((item, idx) => (
                    <li key={idx} className="text-gray-400 text-sm md:text-base flex items-start gap-3">
                      <span className="text-purple-500 mt-1">▹</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
