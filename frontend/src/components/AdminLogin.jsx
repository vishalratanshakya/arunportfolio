import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, LogIn, Loader2, AlertCircle, Eye, EyeOff, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ onLogin }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('isAdminAuthenticated', 'true');
        onLogin();
        navigate('/');
      } else {
        setError(data.error || 'Incorrect Username or Password.');
      }
    } catch (err) {
      setError('Connection failed. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Red Portfolio Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-900/10 rounded-full blur-[120px]"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#0f0505]/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10"
      >
        <div className="flex justify-center mb-10">
           <div className="w-16 h-16 bg-gradient-to-tr from-red-600 to-red-800 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.3)] transform -rotate-6">
              <Shield className="w-8 h-8 text-white rotate-6" />
           </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-3 tracking-tighter uppercase italic">ADMIN ACCESS</h1>
          <p className="text-gray-500 font-bold tracking-[0.2em] text-[10px] uppercase">Arun Kumar Development Studio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Username</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-red-500 transition-colors" />
              <input 
                required
                type="text"
                placeholder="ENTER USERNAME"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-6 text-white text-xs font-bold tracking-widest focus:outline-none focus:border-red-600/50 transition-all placeholder:text-gray-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-red-500 transition-colors" />
              <input 
                required
                type={showPassword ? "text" : "password"}
                placeholder="ENTER PASSWORD"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-14 text-white text-xs font-bold tracking-widest focus:outline-none focus:border-red-600/50 transition-all placeholder:text-gray-700"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-2"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="bg-red-600/10 border border-red-600/20 rounded-xl p-4 flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-wider"
            >
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </motion.div>
          )}

          <button 
            disabled={loading}
            type="submit"
            className="w-full py-5 mt-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] text-white bg-red-600 hover:bg-red-500 hover:shadow-[0_0_30px_rgba(220,38,38,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" /> SECURE LOGIN
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
           <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em]">Proprietary Workspace</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
