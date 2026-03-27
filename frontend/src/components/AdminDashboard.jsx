import React, { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';
import Cropper from 'react-easy-crop';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Film, Image as ImageIcon, CheckCircle2, Loader2, ArrowLeft, LogOut, Settings, Key, User, ShieldCheck, AlertCircle, LayoutDashboard, Eye, EyeOff, Camera, Save, Scissors, Link as LinkIcon, FileVideo, Trash2, List, Lock, Tag, AlignLeft, ZoomIn, RectangleHorizontal, Square, Monitor, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('video');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  
  const [projects, setProjects] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  // Profile
  const [profileImg, setProfileImg] = useState(localStorage.getItem('adminProfileImg') || "/assets/profile img/profile.jpg");
  const [tempProfileImg, setTempProfileImg] = useState(null);
  const [profileCrop, setProfileCrop] = useState({ x: 0, y: 0 });
  const [profileZoom, setProfileZoom] = useState(1);
  const [profileCroppedArea, setProfileCroppedArea] = useState(null);
  const [isCroppingProfile, setIsCroppingProfile] = useState(false);

  // Portfolio Cropper
  const [croppingTarget, setCroppingTarget] = useState('main'); // 'main' or 'thumb'
  const [tempPortfolioImg, setTempPortfolioImg] = useState(null);
  const [portfolioCrop, setPortfolioCrop] = useState({ x: 0, y: 0 });
  const [portfolioZoom, setPortfolioZoom] = useState(1);
  const [portfolioAspect, setPortfolioAspect] = useState(16/10);
  const [portfolioCroppedArea, setPortfolioCroppedArea] = useState(null);
  const [isCroppingPortfolio, setIsCroppingPortfolio] = useState(false);

  const aspectPresets = [
    { label: 'Cinematic', value: 16/10, icon: <Monitor className="w-4 h-4" /> },
    { label: 'Square', value: 1, icon: <Square className="w-4 h-4" /> },
    { label: 'Social', value: 4/5, icon: <Smartphone className="w-4 h-4" /> },
    { label: 'Wide', value: 21/9, icon: <RectangleHorizontal className="w-4 h-4" /> }
  ];

  const [formData, setFormData] = useState({
    title: '',
    category: '', 
    description: '',
    videoFile: null,
    thumbnail: null
  });

  const [settingsData, setSettingsData] = useState({ oldPassword: '', newPassword: '' });

  const fetchProjects = async () => {
    setIsFetching(true);
    try {
      const res = await axios.get('http://localhost:5000/api/projects');
      setProjects(res.data);
    } catch (err) { console.error("FETCH ERROR:", err); }
    finally { setIsFetching(false); }
  };

  useEffect(() => {
    if (activeTab === 'manage') fetchProjects();
  }, [activeTab]);

  const handleDeleteProject = async (id) => {
    if(!window.confirm("ARE YOU SURE YOU WANT TO DELETE THIS PRODUCTION?")) return;
    try { 
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:5000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }); 
      setProjects(projects.filter(p => p._id !== id)); 
    } catch (err) { alert("DELETE FAILED."); }
  };

  const createCroppedImage = async (imageSrc, pixelCrop) => {
    const image = new Image(); image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));
    const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d');
    canvas.width = pixelCrop.width; canvas.height = pixelCrop.height;
    ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
    return new Promise((resolve) => { canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.95); });
  };

  const onProfileCropComplete = useCallback((_area, pixels) => setProfileCroppedArea(pixels), []);
  const onPortfolioCropComplete = useCallback((_area, pixels) => setPortfolioCroppedArea(pixels), []);

  const saveProfileCrop = async () => {
    try {
      const blob = await createCroppedImage(tempProfileImg, profileCroppedArea);
      const reader = new FileReader(); reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        localStorage.setItem('adminProfileImg', base64data);
        setProfileImg(base64data); setIsCroppingProfile(false); setTempProfileImg(null);
      }
    } catch (e) { console.error(e); }
  };

  const savePortfolioCrop = async () => {
    try {
      const blob = await createCroppedImage(tempPortfolioImg, portfolioCroppedArea);
      const file = new File([blob], "cropped-asset.jpg", { type: "image/jpeg" });
      if (croppingTarget === 'main') setFormData({ ...formData, videoFile: file });
      else setFormData({ ...formData, thumbnail: file });
      setIsCroppingPortfolio(false); setTempPortfolioImg(null);
    } catch (e) { console.error(e); }
  };

  const onProfileFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => { setTempProfileImg(reader.result); setIsCroppingProfile(true); };
      reader.readAsDataURL(file);
    }
  };

  const handleAssetSelect = (e, target) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => { setCroppingTarget(target); setTempPortfolioImg(reader.result); setIsCroppingPortfolio(true); };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      setFormData({ ...formData, videoFile: file });
    }
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    const currentKey = localStorage.getItem('adminKey') || 'arun@123';
    if (settingsData.oldPassword !== currentKey) return setError('MASTER KEY MISMATCH.');
    if (settingsData.newPassword.length < 4) return setError('KEY TOO SHORT.');
    localStorage.setItem('adminKey', settingsData.newPassword);
    setSuccess(true);
    setTimeout(() => { setSuccess(false); setSettingsData({ oldPassword: '', newPassword: '' }); setActiveTab('video'); }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    if (!formData.videoFile) { setError(activeTab === 'video' ? 'ERROR: ATTACH MP4.' : 'ERROR: ATTACH IMAGE.'); setLoading(false); return; }
    const data = new FormData();
    data.append('title', formData.title.toUpperCase()); data.append('category', (formData.category || 'GENERAL').toUpperCase()); data.append('type', activeTab);
    data.append('description', formData.description.toUpperCase()); data.append('source', 'mp4'); data.append('file', formData.videoFile);
    if (activeTab === 'video' && formData.thumbnail) data.append('thumbnail', formData.thumbnail);
    try { 
      const token = localStorage.getItem('adminToken');
      await axios.post('http://localhost:5000/api/projects', data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      }); 
      setSuccess(true); 
      setTimeout(() => { setSuccess(false); setFormData({ title: '', category: '', description: '', videoFile: null, thumbnail: null }); }, 3000); 
    } catch (err) { 
      const errorMsg = err.response?.data?.details || err.response?.data?.error || 'UPLOAD FAILED. PLEASE CHECK CONSOLE.';
      console.error("FULL ERROR:", err);
      setError(errorMsg.toUpperCase()); 
    } finally { 
      setLoading(false); 
    }
  };

  // Content Filtering for Manage Tab
  const allContent = projects;
  const videoContent = allContent.filter(p => p.type === 'video' || p.video || (p.image && (p.image.endsWith('.mp4') || p.image.includes('video'))));
  const photoContent = allContent.filter(p => !videoContent.includes(p));

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-12 selection:bg-red-600 font-sans">
      <div className="fixed inset-0 bg-red-600/5 blur-[150px] pointer-events-none -z-10"></div>
      
      {/* Profile Crop Modal */}
      <AnimatePresence>
        {isCroppingProfile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/98 flex flex-col items-center justify-center p-6 backdrop-blur-xl">
             <div className="relative w-full max-w-sm aspect-square bg-[#0f0404] rounded-full overflow-hidden border border-white/10 ring-4 ring-red-600/20 shadow-[0_0_100px_rgba(220,38,38,0.2)]"><Cropper image={tempProfileImg} crop={profileCrop} zoom={profileZoom} aspect={1} onCropChange={setProfileCrop} onZoomChange={setProfileZoom} onCropComplete={onProfileCropComplete} cropShape="round" showGrid={false} /></div>
             <div className="mt-10 w-full max-w-sm space-y-6"><input type="range" value={profileZoom} min={1} max={3} step={0.1} onChange={(e) => setProfileZoom(e.target.value)} className="w-full h-1 bg-white/5 rounded-full accent-red-600" /><div className="flex gap-4"><button onClick={() => setIsCroppingProfile(false)} className="flex-1 py-4 rounded-xl border border-white/5 font-black text-[10px] uppercase text-gray-500 hover:text-white">ABORT</button><button onClick={saveProfileCrop} className="flex-1 py-4 rounded-xl bg-red-600 font-black text-[10px] uppercase text-white shadow-2xl">SAVE</button></div></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portfolio Crop Modal */}
      <AnimatePresence>
        {isCroppingPortfolio && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/98 flex flex-col items-center justify-center p-6 backdrop-blur-xl">
             <div className="relative w-full max-w-4xl aspect-[16/10] bg-[#0f0404] rounded-[2rem] overflow-hidden border border-white/10 ring-4 ring-red-600/10 shadow-[0_0_100px_rgba(220,38,38,0.2)]"><Cropper image={tempPortfolioImg} crop={portfolioCrop} zoom={portfolioZoom} aspect={portfolioAspect} onCropChange={setPortfolioCrop} onZoomChange={setPortfolioZoom} onCropComplete={onPortfolioCropComplete} showGrid={false} /></div>
             <div className="mt-10 w-full max-w-4xl space-y-8 bg-black/40 p-10 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6"><div className="flex flex-wrap gap-3">{aspectPresets.map((preset) => (<button key={preset.label} onClick={() => setPortfolioAspect(preset.value)} className={`px-5 py-3 rounded-xl flex items-center gap-3 transition-all border ${portfolioAspect === preset.value ? 'bg-red-600 border-red-500 text-white shadow-xl' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}>{preset.icon} <span className="text-[10px] font-black italic uppercase tracking-widest">{preset.label}</span></button>))}</div><div className="flex items-center gap-4 flex-1 max-w-sm"><ZoomIn className="w-5 h-5 text-red-600" /><input type="range" value={portfolioZoom} min={1} max={3} step={0.1} onChange={(e) => setPortfolioZoom(e.target.value)} className="w-full h-1 bg-white/5 rounded-full accent-red-600" /></div></div>
                <div className="flex gap-4 pt-4"><button onClick={() => setIsCroppingPortfolio(false)} className="flex-1 py-5 rounded-2xl border border-white/5 font-black text-[11px] uppercase text-gray-700 hover:text-white">ABORT</button><button onClick={savePortfolioCrop} className="flex-1 py-5 rounded-2xl bg-red-600 font-black text-[11px] uppercase italic text-white shadow-[0_0_50px_rgba(220,38,38,0.4)] underline underline-offset-4 tracking-[0.2em]">FINALIZE</button></div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto z-10">
        <input type="file" ref={fileInputRef} onChange={onProfileFileSelect} accept="image/*" className="hidden" />

        <div className="bg-[#0f0404]/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-6 md:p-10 mb-8 flex flex-col md:flex-row items-center gap-6 md:gap-10 shadow-2xl">
           <div className="relative w-32 h-32 md:w-36 md:h-36 shrink-0"><div onClick={() => fileInputRef.current.click()} className="w-full h-full rounded-full border-4 border-red-900/40 overflow-hidden shadow-2xl cursor-pointer group/avatar"><img src={profileImg} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center"><Camera className="w-6 h-6 text-white" /></div></div></div>
           <div className="flex-1 text-center md:text-left z-10"><h1 className="text-4xl md:text-6xl font-black mb-1 text-white italic tracking-tighter uppercase underline decoration-red-600 decoration-8 underline-offset-[12px]">STUDIO DASH</h1><div className="flex flex-wrap justify-center md:justify-start gap-4 mt-12"><button onClick={() => setActiveTab('video')} className={`px-8 py-3 rounded-2xl font-black text-[10px] flex items-center gap-3 transition-all ${activeTab === 'video' || activeTab === 'photo' ? 'bg-red-600 text-white shadow-2xl' : 'bg-white/5 text-gray-400 hover:text-white'}`}><Upload className="w-4 h-4" /> UPLOAD</button><button onClick={() => setActiveTab('manage')} className={`px-8 py-3 rounded-2xl font-black text-[10px] flex items-center gap-3 transition-all ${activeTab === 'manage' ? 'bg-red-600 text-white shadow-2xl' : 'bg-white/5 text-gray-400 hover:text-white'}`}><List className="w-4 h-4" /> MANAGE</button><button onClick={() => setActiveTab('settings')} className={`px-8 py-3 rounded-2xl font-black text-[10px] flex items-center gap-3 transition-all ${activeTab === 'settings' ? 'bg-red-600 text-white shadow-2xl' : 'bg-white/5 text-gray-400 hover:text-white'}`}><Settings className="w-4 h-4" /> KEY</button><button onClick={() => navigate('/')} className="bg-white/5 px-8 py-3 rounded-2xl font-black text-[10px] uppercase hover:bg-white/10 flex items-center gap-3 italic tracking-widest text-white transition-all ring-1 ring-white/5">SITE</button></div></div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'manage' && (
             <motion.div key="manage" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-[#0f0404]/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-8 min-w-0 flex-wrap gap-4">
                  <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">ALL PRODUCTIONS</h2>
                  <button onClick={fetchProjects} className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-red-600 transition-all"><Loader2 className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} /></button>
                </div>
                
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-4 space-y-12">
                   {/* VIDEOS SECTION */}
                   <div>
                      <div className="flex items-center gap-4 mb-6"><div className="w-10 h-0.5 bg-red-600 rounded-full"></div><h3 className="text-[11px] font-black italic text-white uppercase tracking-[0.3em] flex items-center gap-3"><Film className="w-4 h-4 text-red-600" /> CINEMATIC VIDEOS</h3></div>
                      <div className="space-y-4">
                        {videoContent.map((p, idx) => (
                           <div key={p._id || idx} className="flex items-center gap-6 p-4 bg-white/5 border border-white/5 rounded-3xl hover:border-red-600/30 transition-all group">
                              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black shrink-0 border border-white/10 shadow-xl"><video src={p.video || p.image} className="w-full h-full object-cover" muted /></div>
                              <div className="flex-1 min-w-0"><h4 className="font-black italic text-white uppercase truncate tracking-tighter text-sm">{p.title}</h4><span className="text-[9px] font-black text-red-600 uppercase tracking-widest">{p.category || 'GENERAL'}</span></div>
                              {p._id ? <button onClick={() => handleDeleteProject(p._id)} className="w-10 h-10 bg-red-600/10 text-red-500 rounded-xl border border-red-600/20 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center shrink-0"><Trash2 className="w-4 h-4" /></button> : <div className="w-10 h-10 flex items-center justify-center text-gray-700"><Lock className="w-4 h-4" /></div>}
                           </div>
                        ))}
                      </div>
                   </div>

                   {/* PHOTOS SECTION */}
                   <div>
                      <div className="flex items-center gap-4 mb-6"><div className="w-10 h-0.5 bg-red-600 rounded-full"></div><h3 className="text-[11px] font-black italic text-white uppercase tracking-[0.3em] flex items-center gap-3"><ImageIcon className="w-4 h-4 text-red-600" /> CREATIVE PHOTOGRAPHY</h3></div>
                      <div className="space-y-4">
                        {photoContent.map((p, idx) => (
                           <div key={p._id || idx} className="flex items-center gap-6 p-4 bg-white/5 border border-white/5 rounded-3xl hover:border-red-600/30 transition-all group">
                              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black shrink-0 border border-white/10 shadow-xl"><img src={p.image} className="w-full h-full object-cover" /></div>
                              <div className="flex-1 min-w-0"><h4 className="font-black italic text-white uppercase truncate tracking-tighter text-sm">{p.title}</h4><span className="text-[9px] font-black text-red-600 uppercase tracking-widest">{p.category || 'GENERAL'}</span></div>
                              {p._id ? <button onClick={() => handleDeleteProject(p._id)} className="w-10 h-10 bg-red-600/10 text-red-500 rounded-xl border border-red-600/20 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center shrink-0"><Trash2 className="w-4 h-4" /></button> : <div className="w-10 h-10 flex items-center justify-center text-gray-700"><Lock className="w-4 h-4" /></div>}
                           </div>
                        ))}
                      </div>
                   </div>
                </div>
             </motion.div>
          )}

          {activeTab === 'settings' && (
             <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-[#0f0404]/60 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 md:p-20 shadow-2xl relative overflow-hidden text-center"><h2 className="text-3xl font-black italic uppercase text-white mb-14 underline decoration-red-600 decoration-8 underline-offset-8">SECURITY VAULT</h2><form onSubmit={handleUpdatePassword} className="space-y-8 max-w-sm mx-auto"><div className="space-y-3"><label className="text-[10px] font-black text-gray-600 tracking-[0.3em] uppercase italic">OLD KEY</label><input required type={showOldPass ? "text" : "password"} value={settingsData.oldPassword} onChange={(e) => setSettingsData({...settingsData, oldPassword: e.target.value})} className="w-full bg-[#150a0a] border border-white/10 rounded-2xl px-6 py-5 text-sm outline-none focus:border-red-600 transition-all" /></div><div className="space-y-3"><label className="text-[10px] font-black text-gray-600 tracking-[0.3em] uppercase italic">NEW KEY</label><input required type={showNewPass ? "text" : "password"} value={settingsData.newPassword} onChange={(e) => setSettingsData({...settingsData, newPassword: e.target.value})} className="w-full bg-[#150a0a] border border-white/10 rounded-2xl px-6 py-5 text-sm outline-none focus:border-red-600 transition-all" /></div><button type="submit" className="w-full py-6 rounded-2xl bg-red-600 font-black text-[13px] uppercase italic tracking-[0.4em] hover:bg-red-500 shadow-2xl text-white">UPDATE PROTECTION</button></form></motion.div>
          )}

          {(activeTab === 'video' || activeTab === 'photo') && (
            <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-[#0f0404]/90 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-14 shadow-2xl relative overflow-hidden">
              <div className="mb-12"><h2 className="text-4xl font-black italic text-white uppercase tracking-tighter">UPLOAD DATA</h2></div>
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="flex bg-white/5 p-2 rounded-2xl border border-white/5"><button type="button" onClick={() => { setActiveTab('video'); setFormData({...formData, videoFile: null, thumbnail: null}); }} className={`flex-1 py-4 rounded-xl font-black text-[10px] transition-all uppercase italic flex items-center justify-center gap-3 ${activeTab === 'video' ? 'bg-red-600 text-white shadow-2xl' : 'text-gray-600 hover:text-white'}`}><Film className="w-5 h-5" /> VIDEO</button><button type="button" onClick={() => { setActiveTab('photo'); setFormData({...formData, videoFile: null, thumbnail: null}); }} className={`flex-1 py-4 rounded-xl font-black text-[10px] transition-all uppercase italic flex items-center justify-center gap-3 ${activeTab === 'photo' ? 'bg-red-600 text-white shadow-2xl' : 'text-gray-600 hover:text-white'}`}><ImageIcon className="w-5 h-5" /> PHOTO</button></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8"><div className="space-y-3"><label className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic ml-2">PRODUCTION TITLE</label><input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value.toUpperCase()})} placeholder="E.G., DUBAI LUXURY EDIT" className="w-full bg-[#150a0a] border border-white/5 rounded-2xl px-6 py-5 text-[13px] font-black text-white italic uppercase placeholder:text-gray-800 focus:border-red-600 outline-none shadow-2xl" /></div><div className="space-y-3"><label className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic ml-2">PRODUCTION CATEGORY</label><div className="relative"><Tag className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600" /><input required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value.toUpperCase()})} placeholder="E.G., ADVERTISEMENT, NATURE, REEL" className="w-full bg-[#150a0a] border border-white/5 rounded-2xl pl-14 pr-8 py-5 text-[13px] font-black text-white italic uppercase placeholder:text-gray-800 focus:border-red-600 outline-none shadow-2xl" /></div></div></div>
                <div className="space-y-3"><label className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic ml-2 flex items-center gap-3"><AlignLeft className="w-4 h-4 text-red-600" /> PRODUCTION DESCRIPTION</label><textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value.toUpperCase()})} placeholder="DESCRIBE YOUR CINEMATIC MASTERPIECE..." className="w-full bg-[#150a0a] border border-white/5 rounded-2xl px-6 py-5 text-[12px] font-black text-white italic uppercase placeholder:text-gray-800 focus:border-red-600 outline-none shadow-2xl resize-none shadow-inner" /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {activeTab === 'video' ? (<><div className="space-y-3"><label className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic ml-2">MP4 MASTER ASSET</label><div className="relative group overflow-hidden rounded-[2rem] border-2 border-dashed border-white/5 p-12 flex flex-col items-center justify-center gap-4 bg-black/60 h-44 hover:border-red-600 transition-all"><input type="file" accept="video/mp4,video/x-m4v,video/*" onChange={(e) => handleAssetSelect(e, 'main')} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />{formData.videoFile ? <span className="text-green-500 font-black italic text-[11px] uppercase truncate px-8 flex items-center gap-2 font-black transition-all"><CheckCircle2 className="w-4 h-4" /> {formData.videoFile.name}</span> : <><FileVideo className="w-8 h-8 text-gray-700 group-hover:text-red-600" /><span className="text-[9px] font-black text-gray-700 group-hover:text-white uppercase italic tracking-widest">SELECT MP4 MASTER</span></>}</div></div><div className="space-y-3"><label className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic ml-2">COVER THUMBNAIL</label><div className="relative group overflow-hidden rounded-[2rem] border-2 border-dashed border-white/5 p-12 flex flex-col items-center justify-center gap-4 bg-black/60 h-44 hover:border-red-600 transition-all"><input type="file" accept="image/*" onChange={(e) => handleAssetSelect(e, 'thumb')} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />{formData.thumbnail ? <span className="text-green-500 font-black italic text-[11px] uppercase truncate px-8 flex items-center gap-2 font-black transition-all"><CheckCircle2 className="w-4 h-4" /> {formData.thumbnail.name} (SHAPED)</span> : <><ImageIcon className="w-8 h-8 text-gray-700 group-hover:text-red-600" /><span className="text-[9px] font-black text-gray-700 group-hover:text-white uppercase italic tracking-widest">SELECT & SHAPE</span></>}</div></div></>) : (<div className="col-span-2 space-y-3"><label className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic ml-2">MASTER IMAGE ASSET</label><div className="relative group overflow-hidden rounded-[2.5rem] border-2 border-dashed border-white/5 p-20 flex flex-col items-center justify-center gap-6 bg-black/60 h-72 hover:border-red-600 transition-all"><input type="file" accept="image/*" onChange={(e) => handleAssetSelect(e, 'main')} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />{formData.videoFile ? <span className="text-green-500 font-black italic text-[12px] uppercase truncate px-12 flex items-center gap-2 font-black transition-all"><CheckCircle2 className="w-5 h-5" /> {formData.videoFile.name} (SHAPED)</span> : <><Upload className="w-14 h-14 text-gray-700 group-hover:text-red-600" /><span className="text-[10px] font-black text-gray-700 group-hover:text-white uppercase italic tracking-[0.3em]">SELECT & SHAPE PHOTO</span></>}</div></div>)}
                </div>
                {error && <div className="p-6 rounded-2xl bg-red-600/10 border border-red-600/30 flex items-center gap-5 text-red-500 text-[11px] font-black italic uppercase"><AlertCircle className="w-6 h-6" /> {error}</div>}
                <div className="pt-6"><button disabled={loading || success} type="submit" className={`w-full py-7 rounded-[2rem] font-black text-[14px] tracking-[0.4em] uppercase shadow-2xl transition-all italic text-white ${success ? 'bg-green-600' : 'bg-red-600 hover:bg-red-500 active:scale-[0.98]'}`}>{loading ? 'SYNCING PRODUCTION...' : success ? 'COMPLETE' : 'DEPLOY TO LIVE WORK'}</button></div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
