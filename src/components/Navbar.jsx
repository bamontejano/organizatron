import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
    Trophy,
    Flame,
    Calendar as CalendarIcon,
    Settings,
    LogOut,
    Target,
    Wallet,
    Home,
    Shield,
    BookOpen
} from 'lucide-react';

export default function Navbar() {
    const { userRole, focos, level, setUserRole } = useApp();

    return (
        <nav className="glass sticky top-0 z-[100] border-b border-slate-100 px-6 py-4 flex items-center justify-between shadow-sm">
            <Link to="/" className="flex items-center gap-3 no-underline">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                    <Target className="text-white" size={24} />
                </div>
                <span className="font-black tracking-tight text-xl text-slate-900">FOCUS <span className="text-indigo-600">FAMILY</span></span>
            </Link>

            <div className="flex items-center gap-4">
                {userRole && (
                    <div className="hidden md:flex items-center gap-2 mr-4">
                        <Link to="/" className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-all">
                            <Home size={22} />
                        </Link>

                        {userRole === 'teen' && (
                            <>
                                <Link to="/planner" className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-all">
                                    <CalendarIcon size={22} />
                                </Link>
                                <Link to="/economy" className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-all">
                                    <Wallet size={22} />
                                </Link>
                            </>
                        )}
                    </div>
                )}

                {userRole === 'teen' && (
                    <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl px-5 py-2.5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-pink-500 font-black text-lg">{focos}</span>
                            <Trophy className="text-pink-500" size={16} />
                        </div>
                        <div className="w-px h-6 bg-slate-100" />
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NV</span>
                            <span className="font-black text-indigo-600">{level}</span>
                        </div>
                    </div>
                )}

                {userRole === 'parent' && (
                    <div className="chip chip-secondary !py-2 !px-4 flex items-center gap-2 shadow-sm bg-pink-50 border-pink-100">
                        <Shield size={14} />
                        <span className="font-black">MODO PADRE</span>
                    </div>
                )}

                <div className="w-px h-8 bg-slate-100 mx-2" />

                <button
                    onClick={() => setUserRole(null)}
                    className="p-3 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                    title="Cerrar Sesión"
                >
                    <LogOut size={22} />
                </button>
            </div>
        </nav>
    );
}
