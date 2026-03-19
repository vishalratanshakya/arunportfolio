import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Instagram, Linkedin, ExternalLink } from 'lucide-react';
import { personalData } from '../data/personalData';

export default function Contact() {
  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/10 -z-10"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Let's Connect</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            I'm currently available for freelance projects. Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>
        </motion.div>

        <div className="glass p-12 rounded-[3rem] shadow-[0_0_50px_rgba(168,85,247,0.1)] relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full"></div>
          
          <div className="grid md:grid-cols-2 gap-12 relative z-10">
            {/* Contact Info */}
            <div className="space-y-8 flex flex-col justify-center">
              <motion.a 
                href={`mailto:${personalData.email}`}
                whileHover={{ x: 10, color: '#a855f7' }}
                className="flex items-center gap-6 text-gray-300 transition-colors group"
              >
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center group-hover:bg-purple-600/20 group-hover:border-purple-500/50 transition-all">
                  <Mail className="w-6 h-6 text-purple-400 group-hover:text-purple-300" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</h4>
                  <p className="text-lg font-medium">{personalData.email}</p>
                </div>
              </motion.a>

              <motion.a 
                href={`tel:${personalData.phone}`}
                whileHover={{ x: 10, color: '#a855f7' }}
                className="flex items-center gap-6 text-gray-300 transition-colors group"
              >
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center group-hover:bg-purple-600/20 group-hover:border-purple-500/50 transition-all">
                  <Phone className="w-6 h-6 text-purple-400 group-hover:text-purple-300" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone</h4>
                  <p className="text-lg font-medium">{personalData.phone}</p>
                </div>
              </motion.a>

              <div className="flex items-center gap-6 text-gray-300 group">
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Location</h4>
                  <p className="text-lg font-medium">{personalData.location}</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-12">
              <h4 className="text-2xl font-semibold text-white mb-8">Follow Me</h4>
              <div className="flex flex-col gap-6">
                {personalData.instagram && (
                  <motion.a 
                    href={personalData.instagram}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="flex justify-between items-center px-6 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-pink-900/40 hover:border-pink-500/50 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <Instagram className="w-6 h-6 text-gray-400 group-hover:text-pink-400 transition-colors" />
                      <span className="font-medium text-gray-300 group-hover:text-white transition-colors">Instagram</span>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-600 group-hover:text-pink-400 transition-colors" />
                  </motion.a>
                )}
                
                {personalData.linkedin && (
                  <motion.a 
                    href={personalData.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="flex justify-between items-center px-6 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-blue-900/40 hover:border-blue-500/50 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <Linkedin className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors" />
                      <span className="font-medium text-gray-300 group-hover:text-white transition-colors">LinkedIn</span>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition-colors" />
                  </motion.a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
