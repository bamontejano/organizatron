import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, BookOpen, Wallet } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function MobileNav() {
    const { userRole } = useApp();
    const location = useLocation();

    if (!userRole || userRole === 'parent') return null;

    const NavLink = ({ to, icon: Icon, label }) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all no-underline ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}
            >
                <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}>
                    <Icon size={22} strokeWidth={isActive ? 3 : 2} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
            </Link>
        );
    };

    return (
        <div className="md:hidden fixed bottom-6 inset-x-6 z-[100] pointer-events-none">
            <div className="bg-white/90 backdrop-blur-xl h-20 pointer-events-auto flex items-center justify-around px-4 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[28px] border border-white/50 ring-1 ring-slate-100">
                <NavLink to="/" icon={Home} label="Inicio" />
                <NavLink to="/planner" icon={Calendar} label="Plan" />
                <NavLink to="/economy" icon={Wallet} label="Focos" />
            </div>
        </div>
    );
}
