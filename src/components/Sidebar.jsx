import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const NAV_TEEN = [
    {
        label: 'Principal',
        items: [
            { to: '/', icon: '🏠', label: 'Inicio', id: 'dashboard' },
            { to: '/planner', icon: '📅', label: 'Planificador', id: 'planner' },
            { to: '/pomodoro', icon: '⏱️', label: 'Modo Estudio', id: 'pomodoro' },
        ]
    },
    {
        label: 'Progreso',
        items: [
            { to: '/badges', icon: '🏆', label: 'Insignias', id: 'badges' },
            { to: '/heatmap', icon: '🗓️', label: 'Mapa Anual', id: 'heatmap' },
            { to: '/economy', icon: '🪙', label: 'Economía', id: 'economy' },
        ]
    },
    {
        label: 'Familia',
        items: [
            { to: '/pactos', icon: '🤝', label: 'Pactos', id: 'pactos', badge: 1 },
            { to: '/rewards', icon: '🎁', label: 'Recompensas', id: 'rewards' },
        ]
    },
    {
        label: 'Inteligencia',
        items: [
            { to: '/ia', icon: '🧠', label: 'IA Personal', id: 'ia' },
            { to: '/examenes', icon: '🎯', label: 'Exámenes', id: 'examenes' },
        ]
    },
    {
        label: 'Comunidad',
        items: [
            { to: '/temporada', icon: '🏆', label: 'Temporada', id: 'temporada' },
            { to: '/clase', icon: '🏫', label: 'Mi Clase', id: 'clase' },
        ]
    },
    {
        label: 'Integración',
        items: [
            { to: '/classroom', icon: '🎓', label: 'Classroom', id: 'classroom', badgeText: 'SYNC' },
            { to: '/library', icon: '📚', label: 'Técnicas', id: 'library' },
        ]
    },
];

const NAV_PARENT = [
    {
        label: 'Panel',
        items: [
            { to: '/', icon: '🏠', label: 'Inicio', id: 'dashboard' },
            { to: '/pactos', icon: '🤝', label: 'Pactos', id: 'pactos', badge: 1 },
            { to: '/rewards', icon: '🎁', label: 'Recompensas', id: 'rewards' },
        ]
    },
    {
        label: 'Familia',
        items: [
            { to: '/perfil', icon: '👨‍👩‍👦', label: 'Mi Familia', id: 'familia' },
        ]
    },
];

export default function Sidebar() {
    const { userRole, focos, level, logout } = useApp();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    if (!userRole) return null;

    const navSections = userRole === 'teen' ? NAV_TEEN : NAV_PARENT;
    const roleEmoji = userRole === 'teen' ? '🎒' : '👨‍👩‍👦';
    const roleLabel = userRole === 'teen' ? 'Alumno' : 'Padre/Madre';
    const levelNames = ['', 'Inicio', 'Explorador', 'Constante', 'Maestro', 'Sabio', 'Leyenda'];

    const handleLogout = async () => {
        await logout();
        // Auth state change in AppContext will redirect to AuthPage automatically
    };

    const close = () => setMobileOpen(false);

    return (
        <>
            {/* Mobile hamburger */}
            <div className="hamburger" onClick={() => setMobileOpen(o => !o)}>
                {mobileOpen ? '✕' : '☰'}
            </div>

            {/* Overlay */}
            <div className={`sidebar-overlay${mobileOpen ? ' show' : ''}`} onClick={close} />

            <aside className={`sidebar${mobileOpen ? ' open' : ''}`}>
                {/* Logo */}
                <div className="sidebar-logo">
                    <div className="logo-mark">📡 Focus Family</div>
                    <div className="logo-name">Focus Family</div>
                </div>

                {/* User Card */}
                <div className="sidebar-user" onClick={() => { navigate('/perfil'); close(); }}>
                    <div className="sidebar-avatar">{roleEmoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="sidebar-name">Mi Perfil</div>
                        <div className="sidebar-role-tag">{roleLabel}</div>
                    </div>
                    {userRole === 'teen' && (
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>{focos}</div>
                            <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Focos</div>
                        </div>
                    )}
                </div>

                {/* Level bar (teen only) */}
                {userRole === 'teen' && (
                    <div style={{ margin: '0 12px 8px', padding: '10px 12px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6 }}>
                            <span style={{ fontWeight: 700, color: '#a78bfa' }}>Nv.{level} {levelNames[level] || ''}</span>
                            <span style={{ color: 'var(--text-muted)', fontFamily: "'Space Mono', monospace" }}>{focos}/500</span>
                        </div>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.min((focos / 500) * 100, 100)}%`, background: 'linear-gradient(90deg, #7c3aed, #f59e0b)', borderRadius: 100 }} />
                        </div>
                    </div>
                )}

                {/* Nav Sections */}
                <nav className="nav-section">
                    {navSections.map((section) => (
                        <div key={section.label}>
                            <div className="nav-label">{section.label}</div>
                            {section.items.map((item) => {
                                const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
                                return (
                                    <Link
                                        key={item.id}
                                        to={item.to}
                                        onClick={close}
                                        className={`nav-item${isActive ? ' active' : ''}`}
                                        style={{ textDecoration: 'none', color: isActive ? 'var(--text)' : 'var(--text-muted)', display: 'flex' }}
                                    >
                                        <span className="nav-icon">{item.icon}</span>
                                        {item.label}
                                        {item.badge && <span className="nav-badge">{item.badge}</span>}
                                        {item.badgeText && <span className="nav-badge" style={{ background: 'var(--accent3)', fontSize: 9 }}>{item.badgeText}</span>}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* Bottom */}
                <div className="sidebar-bottom">
                    <Link to="/perfil" onClick={close} className="nav-item" style={{ textDecoration: 'none', color: 'var(--text-muted)', display: 'flex', marginBottom: 6 }}>
                        <span className="nav-icon">⚙️</span> Perfil y familia
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="btn btn-ghost"
                        style={{ width: '100%', color: '#fb7185', justifyContent: 'center', fontSize: 13 }}
                    >
                        🚪 Cerrar sesión
                    </button>
                </div>
            </aside>
        </>
    );
}
