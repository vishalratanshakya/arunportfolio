import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Play, Image as ImageIcon, X } from 'lucide-react';
import { projectsData } from '../data/projectsData';

export default function Projects() {
  const [activeGallery, setActiveGallery] = useState(null);
  const [activeVideoViewer, setActiveVideoViewer] = useState(null); // New state for full-screen video viewer

  const closeGallery = () => setActiveGallery(null);
  const closeVideoViewer = () => setActiveVideoViewer(null); // New close function for video viewer

  return (
    <section id="projects" className="py-20 bg-black/40 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent inline-block">Featured Projects</h2>
          <div className="h-1 w-20 bg-purple-600 mx-auto mt-4 rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {projectsData.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="glass rounded-3xl overflow-hidden group hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] transition-shadow flex flex-col"
            >
              <div className="relative h-64 md:h-80 overflow-hidden bg-gray-900 flex items-center justify-center">
                {/* Image Placeholder or Video Thumbnail */}
                {project.image ? (
                   project.image.toLowerCase().endsWith('.mp4') ? (
                     <video
                       src={`${project.image}#t=0.1`}
                       muted
                       loop
                       autoPlay
                       playsInline
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                     />
                   ) : (
                     <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                      onError={(e) => { e.target.style.display = 'none'; }}
                     />
                   )
                ) : null}
                
                {/* Fallback decorative background if no image maps correctly */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 to-black/60 -z-10 flex items-center justify-center">
                   <div className="text-8xl flex items-center justify-center text-purple-500/20">🎬</div>
                </div>

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
                  {project.video && (
                    <a href={project.video} target="_blank" rel="noreferrer" className="w-16 h-16 bg-purple-600 rounded-full flex flex-col items-center justify-center text-white hover:bg-white hover:text-purple-600 hover:scale-110 transition-all shadow-[0_0_20px_rgba(168,85,247,0.8)]">
                      <Play className="w-8 h-8 ml-1" />
                    </a>
                  )}
                  {project.gallery && project.gallery.length > 0 && (
                    <button 
                      onClick={() => setActiveGallery(project.gallery)}
                      className="w-16 h-16 bg-purple-600 rounded-full flex flex-col items-center justify-center text-white hover:bg-white hover:text-purple-600 hover:scale-110 transition-all shadow-[0_0_20px_rgba(168,85,247,0.8)]"
                    >
                      <ImageIcon className="w-8 h-8" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">{project.title}</h3>
                  <div className="flex gap-4">

                    {project.liveUrl && project.liveUrl !== '#' && (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">
                        <ExternalLink className="w-6 h-6" />
                      </a>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-400 mb-6 flex-1 text-sm md:text-base leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-auto pt-6 border-t border-white/5">
                  {project.techStack.map((tech, i) => (
                    <span key={i} className="text-xs font-medium text-purple-300 bg-purple-900/30 px-3 py-1.5 rounded-full border border-purple-500/20">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Gallery Modal */}
      <AnimatePresence>
        {activeGallery && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-8"
            onClick={closeGallery}
          >
            <button 
              onClick={closeGallery} 
              className="absolute top-6 right-6 text-white hover:text-purple-400 bg-white/10 p-2 rounded-full transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div 
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="max-w-7xl w-full max-h-full overflow-y-auto glass p-6 rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-6">Project Gallery</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeGallery.map((src, idx) => {
                  const isVideo = src.toLowerCase().endsWith('.mp4');
                  
                  return (
                    <div 
                      key={idx} 
                      className={`relative overflow-hidden rounded-xl bg-gray-900 flex items-center justify-center ${isVideo ? 'h-48 md:h-64' : 'aspect-square'}`}
                    >
                      {isVideo ? (
                        <div 
                          className="w-full h-full cursor-pointer group"
                          onClick={() => setActiveVideoViewer(src)}
                        >
                          <video 
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 rounded-xl"
                          >
                            <source src={src} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Play className="w-12 h-12 text-white" />
                          </div>
                        </div>
                      ) : (
                        <img 
                          src={src} 
                          alt={`Gallery Item ${idx + 1}`} 
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 rounded-xl"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-screen Video Viewer Modal */}
      <AnimatePresence>
        {activeVideoViewer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[101] flex items-center justify-center bg-black/95 p-4 md:p-8"
            onClick={closeVideoViewer}
          >
            <button 
              onClick={closeVideoViewer} 
              className="absolute top-6 right-6 text-white hover:text-purple-400 bg-white/10 p-2 rounded-full transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative w-full h-full max-w-screen-lg max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <video 
                src={activeVideoViewer} 
                controls 
                autoPlay 
                className="max-w-full max-h-full object-contain rounded-xl shadow-lg"
              >
                <source src={activeVideoViewer} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
