import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const isHome = window.location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#0A0F1A] text-white p-4 relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-cyan-400 rounded-full mix-blend-screen filter blur-[100px] opacity-20 pointer-events-none"></div>

      {/* Header */}
      <header className="flex items-center justify-between mb-6 relative z-10">
        {!isHome ? (
          <button onClick={() => navigate(-1)} className="p-2 glass-panel rounded-full hover:bg-white/10 transition">
            <ArrowLeft size={20} className="text-blue-400" />
          </button>
        ) : (
          <div className="flex items-center">
            <img src="/h2gologo.png" alt="H2GO" className="h-10 object-contain drop-shadow-lg filter brightness-110" />
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 pb-20">
        <Outlet />
      </main>
    </div>
  );
};
