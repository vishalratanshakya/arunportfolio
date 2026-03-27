import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Play, Image as ImageIcon, X, FileVideo, Filter, ChevronRight } from 'lucide-react';
import axios from 'axios';

export default function Projects({ adminMode }) {
  const [activeGallery, setActiveGallery] = useState(null);
  const [activeVideoViewer, setActiveVideoViewer] = useState(null);
  const [dbProjects, setDbProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [videoFilter, setVideoFilter] = useState('ALL');
  const [imageFilter, setImageFilter] = useState('ALL');

  const closeGallery = () => setActiveGallery(null);
  const closeVideoViewer = () => setActiveVideoViewer(null);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/projects');
      setDbProjects(res.data);
    } catch (err) {
      console.error("FAILED TO FETCH DB PROJECTS:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const allProjects = dbProjects;

  const videoProjects = useMemo(() => allProjects.filter(p => 
    p.type === 'video' || 
    p.video || 
    (p.image && (p.image.toLowerCase().endsWith('.mp4') || p.image.includes('/video/upload/')))
  ), [allProjects]);
  
  const imageProjects = useMemo(() => allProjects.filter(p => !videoProjects.includes(p)), [allProjects, videoProjects]);

  // Unique Categories
  const videoCategories = useMemo(() => {
    const cats = new Set(videoProjects.map(p => (p.category || 'GENERAL').toUpperCase()));
    return ['ALL', ...Array.from(cats)].sort();
  }, [videoProjects]);

  const imageCategories = useMemo(() => {
    const cats = new Set(imageProjects.map(p => (p.category || 'GENERAL').toUpperCase()));
    return ['ALL', ...Array.from(cats)].sort();
  }, [imageProjects]);

  // Filtered Lists
  const filteredVideoProjects = videoProjects.filter(p => 
    videoFilter === 'ALL' || (p.category || 'GENERAL').toUpperCase() === videoFilter
  );

  const filteredImageProjects = imageProjects.filter(p => 
    imageFilter === 'ALL' || (p.category || 'GENERAL').toUpperCase() === imageFilter
  );

  return (
    <section id="projects" className="py-24 bg-[#050505] relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full bg-red-900/5 blur-[120px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20 text-center">
          <div className="inline-block px-5 py-2 rounded-full bg-red-600/10 border border-red-600/20 mb-8 shadow-[0_0_30px_rgba(220,38,38,0.1)]">
            <span className="text-[10px] font-black tracking-[0.4em] uppercase italic text-red-600">PRODUCTION ARCHIVE</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black italic text-white uppercase tracking-tighter decoration-red-600 decoration-8 underline-offset-8 underline leading-none">FEATURED WORK</h2>
        </motion.div>

        {/* VIDEO SECTION */}
        <div className="mb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-white/5 pb-10">
             <div className="flex items-center gap-5">
                <div className="w-16 h-1 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)]"></div>
                <h3 className="text-2xl md:text-3xl font-black italic text-white uppercase tracking-tighter flex items-center gap-4">
                   <FileVideo className="w-8 h-8 text-red-600" /> CINEMATIC VIDEOS
                </h3>
             </div>
             
             {/* VIDEO FILTERS */}
             <div className="flex flex-wrap gap-2">
                {videoCategories.map(cat => (
                   <button 
                    key={cat} 
                    onClick={() => setVideoFilter(cat)}
                    className={`px-5 py-2 rounded-xl text-[10px] font-black italic uppercase tracking-widest transition-all border ${videoFilter === cat ? 'bg-red-600 border-red-500 text-white shadow-xl scale-105' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`}
                   >
                    {cat}
                   </button>
                ))}
             </div>
          </div>
          
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredVideoProjects.map((project, index) => (
                <ProjectCard 
                  key={project._id || project.id || index} 
                  project={project} 
                  index={index} 
                  onVideoClick={setActiveVideoViewer} 
                  onGalleryClick={setActiveGallery} 
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* IMAGE SECTION */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-white/5 pb-10">
             <div className="flex items-center gap-5">
                <div className="w-16 h-1 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)]"></div>
                <h3 className="text-2xl md:text-3xl font-black italic text-white uppercase tracking-tighter flex items-center gap-4">
                   <ImageIcon className="w-8 h-8 text-red-600" /> CREATIVE PHOTOGRAPHY
                </h3>
             </div>

             {/* IMAGE FILTERS */}
             <div className="flex flex-wrap gap-2">
                {imageCategories.map(cat => (
                   <button 
                    key={cat} 
                    onClick={() => setImageFilter(cat)}
                    className={`px-5 py-2 rounded-xl text-[10px] font-black italic uppercase tracking-widest transition-all border ${imageFilter === cat ? 'bg-red-600 border-red-500 text-white shadow-xl scale-105' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`}
                   >
                    {cat}
                   </button>
                ))}
             </div>
          </div>
          
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredImageProjects.map((project, index) => (
                <ProjectCard 
                  key={project._id || project.id || index} 
                  project={project} 
                  index={index} 
                  onVideoClick={setActiveVideoViewer} 
                  onGalleryClick={setActiveGallery} 
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <Modals 
        activeGallery={activeGallery} 
        activeVideoViewer={activeVideoViewer} 
        closeGallery={closeGallery} 
        closeVideoViewer={closeVideoViewer} 
      />
    </section>
  );
}

const getYoutubeEmbedUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=0` : url;
};

const isYoutubeUrl = (url) => {
  return url && (url.includes('youtube.com') || url.includes('youtu.be'));
};

function ProjectCard({ project, index, onVideoClick, onGalleryClick }) {
  const videoUrl = project.video || project.image || '';
  const isYoutube = isYoutubeUrl(videoUrl);
  const isMp4 = typeof videoUrl === 'string' && (videoUrl.toLowerCase().endsWith('.mp4') || videoUrl.includes('/video/upload/'));
  const isVideo = isYoutube || isMp4;
  
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }} className="bg-[#0f0404]/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-red-600/30 transition-all duration-500 shadow-2xl flex flex-col relative">
      <div className="relative aspect-[16/10] overflow-hidden bg-black">
        {isMp4 ? (
          <video muted loop autoPlay playsInline className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          <img src={project.image || (isYoutube ? `https://img.youtube.com/vi/${getYoutubeEmbedUrl(videoUrl).split('/').pop().split('?')[0]}/maxresdefault.jpg` : '')} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        )}
        
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-6 backdrop-blur-[2px]">
          {isVideo ? (
            <button onClick={() => onVideoClick(videoUrl)} className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all shadow-[0_0_30px_rgba(220,38,38,0.4)] ring-4 ring-red-600/20">
              <Play className="w-8 h-8 ml-1 fill-current" />
            </button>
          ) : (
            <button onClick={() => onGalleryClick(project.gallery || [project.image])} className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all backdrop-blur-md border border-white/20">
              <ImageIcon className="w-8 h-8" />
            </button>
          )}
        </div>
      </div>

      <div className="p-8 flex-1">
        <div className="flex items-center gap-3 mb-4">
           {isVideo ? <FileVideo className="w-4 h-4 text-red-600" /> : <ImageIcon className="w-4 h-4 text-red-600" />}
           <span className="text-[10px] font-black text-white/40 tracking-[0.2em] uppercase italic">{project.category || 'PRODUCTION'}</span>
        </div>
        <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-4 group-hover:text-red-600 transition-colors leading-none">{project.title}</h4>
        <p className="text-gray-500 text-[11px] leading-relaxed font-bold mb-8 uppercase tracking-wide opacity-80">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5 mt-auto">
            <span className="text-[10px] font-black text-red-600/60 bg-red-600/5 px-4 py-1.5 rounded-full border border-red-600/10 uppercase italic tracking-widest">{project.category || 'MASTERWORK'}</span>
            <span className="text-[10px] font-black text-white/30 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 uppercase italic tracking-widest">{isVideo ? 'MP4 PRODUCTION' : 'PHOTO ASSET'}</span>
        </div>
      </div>
    </motion.div>
  );
}

function Modals({ activeGallery, activeVideoViewer, closeGallery, closeVideoViewer }) {
  const isYoutube = isYoutubeUrl(activeVideoViewer);
  
  return (
    <>
      <AnimatePresence>
        {activeGallery && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-8" onClick={closeGallery}>
            <button onClick={closeGallery} className="absolute top-8 right-8 text-white bg-white/10 p-4 rounded-full hover:bg-red-600 transition-all shadow-2xl z-50"><X className="w-8 h-8" /></button>
            <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }} className="max-w-7xl w-full max-h-full overflow-y-auto glass p-10 rounded-[3rem] border border-white/10" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-10 text-center underline decoration-red-600 decoration-8 underline-offset-8">GALLERY COLLECTION</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeGallery.map((src, idx) => (
                  <div key={idx} className="relative aspect-square overflow-hidden rounded-3xl bg-[#0f0404] border border-white/5 group">
                    <img src={src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeVideoViewer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[101] flex items-center justify-center bg-black/98 p-8" onClick={closeVideoViewer}>
            <button onClick={closeVideoViewer} className="absolute top-8 right-8 text-white bg-white/10 p-4 rounded-full hover:bg-red-600 transition-all shadow-2xl z-50"><X className="w-8 h-8" /></button>
            <div className="relative w-full h-full max-w-6xl max-h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              {isYoutube ? (
                <iframe 
                  className="w-full aspect-video rounded-[2rem] shadow-[0_0_100px_rgba(220,38,38,0.2)] border border-white/10"
                  src={getYoutubeEmbedUrl(activeVideoViewer)}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video controls autoPlay loop className="max-w-full max-h-full object-contain rounded-[2rem] shadow-[0_0_100px_rgba(220,38,38,0.2)] border border-white/10">
                  <source src={activeVideoViewer} type="video/mp4" />
                </video>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
