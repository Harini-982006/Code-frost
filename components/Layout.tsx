
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, ClipboardList, HeartPulse, Info, MessageSquareCode } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/alerts', label: 'Safety Alerts', icon: Shield },
    { path: '/checklist', label: 'Preparedness', icon: ClipboardList },
    { path: '/health', label: 'Health Tips', icon: HeartPulse },
    { path: '/advisor', label: 'AI Advisor', icon: MessageSquareCode },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar for Desktop */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col sticky top-0 md:h-screen z-50">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">WinterGuard AI</h1>
        </div>
        
        <nav className="flex-1 p-4 flex md:flex-col overflow-x-auto md:overflow-y-auto gap-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800 hidden md:block">
          <div className="bg-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-2 uppercase tracking-widest font-bold">Emergency</p>
            <p className="text-lg font-bold text-red-400">911</p>
            <p className="text-[10px] text-slate-500 mt-1">Local emergency services</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-40 md:static">
           <h2 className="text-xl font-semibold text-slate-800">
             {navItems.find(i => i.path === location.pathname)?.label || 'Overview'}
           </h2>
           <div className="flex items-center gap-4">
              <span className="flex h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-medium text-slate-600">AI System Active</span>
           </div>
        </header>
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
