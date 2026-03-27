import React from 'react';
import { motion } from 'framer-motion';
import { User, Menu, LogOut, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();
  
  const navLinks = [
    { name: 'HOME', href: '#hero' },
    { name: 'ABOUT', href: '#education' },
    { name: 'SKILLS', href: '#experience' },
    { name: 'PROJECTS', href: '#projects' },
    { name: 'VIDEOS', href: '#projects' },
    { name: 'CONTACT', href: '#contact' },
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-50 bg-[#0f0505]/80 backdrop-blur-md border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Navigation - Centered Style */}
        <nav className="hidden lg:flex items-center gap-10 flex-1 justify-center">
          {navLinks.map((link, idx) => (
            <a 
              key={link.name} 
              href={link.href}
              className={`text-[12px] font-black tracking-[0.2em] transition-all hover:scale-110 ${idx === 0 ? 'text-red-600' : 'text-gray-400 hover:text-white'}`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Dynamic Auth Section - Right Side */}
        <div className="flex items-center gap-4">
           {isAuthenticated ? (
             /* Admin is Logged In: Show Dashboard and Logout */
             <div className="flex items-center gap-3">
               <button 
                 onClick={() => navigate('/admin')}
                 className="group flex items-center gap-3 bg-red-600/10 border border-red-600/20 pl-2 pr-6 py-2 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-[0_0_20px_rgba(225,29,72,0.1)]"
               >
                 <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                    <LayoutDashboard className="w-4 h-4 text-white" />
                 </div>
                 <span className="text-[12px] font-black tracking-widest uppercase italic">
                   DASHBOARD
                 </span>
               </button>

               <button 
                 onClick={() => {
                   onLogout();
                   navigate('/');
                 }}
                 className="group flex items-center gap-3 bg-white/5 border border-white/10 pl-2 pr-6 py-2 rounded-full hover:bg-white/10 transition-all hover:border-white/20"
               >
                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                     <LogOut className="w-4 h-4 text-gray-400 group-hover:text-white" />
                  </div>
                  <span className="text-[12px] font-black tracking-widest text-white uppercase italic">
                    LOGOUT
                  </span>
               </button>
             </div>
           ) : (
             /* Admin is NOT Logged In: Show Login Switch */
             <button 
               onClick={() => navigate('/login')}
               className="group flex items-center gap-3 bg-white/5 border border-white/10 pl-2 pr-6 py-2 rounded-full hover:bg-white/10 transition-all hover:border-white/20"
             >
                <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                   <User className="w-4 h-4 text-gray-400 group-hover:text-white" />
                </div>
                <span className="text-[12px] font-black tracking-widest text-white uppercase italic">
                  ADMIN LOGIN
                </span>
             </button>
           )}

           <button className="lg:hidden text-white">
              <Menu className="w-6 h-6" />
           </button>
        </div>

      </div>
    </motion.header>
  );
}
