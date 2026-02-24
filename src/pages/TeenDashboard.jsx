import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const RACHA_WEEK = [
    { emoji: '✅', perfect: true, done: true },
    { emoji: '✅', perfect: false, done: true },
    { emoji: '💎', perfect: true, done: true },
    { emoji: '✅', perfect: false, done: true },
    { emoji: '✅', perfect: true, done: true },
    { emoji: '😴', perfect: false, done: false },
    { emoji: '🎯', perfect: false, done: false, today: true },
];

const MISSIONS = [
    { emoji: '📐', title: 'Hoja de derivadas', subject: 'Matemáticas', xp: 15, done: false, priority: 'alta' },
    { emoji: '🔬', title: 'Informe de laboratorio', subject: 'Física', xp: 20, done: false, priority: 'alta' },
    { emoji: '📖', title: 'Lectura capítulo 7', subject: 'Historia', xp: 10, done: true, priority: 'media' },
];

export default function TeenDashboard() {
    const {
        profile, authUser, focos, streaks, level, isLinked, linkFamily,
        linkError, linkLoading, isClassroomLinked, classroomTasks, syncClassroom
    } = useApp();

    const [missions, setMissions] = useState(MISSIONS);
    const [joinCode, setJoinCode] = useState('');
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [emotion, setEmotion] = useState(null);

    const handleLink = async () => {
        const res = await linkFamily(joinCode);
        if (res.success) {
            setShowJoinModal(false);
        }
    };

    const levelNames = ['', 'Inicio', 'Explorador', 'Constante', 'Maestro', 'Sabio', 'Leyenda'];
    const xpForLevel = 500;
    const xpFill = Math.min((focos / xpForLevel) * 100, 100);

    const toggleMission = id => setMissions(prev => prev.map((m, i) => i === id ? { ...m, done: !m.done } : m));

    return (
        <div className="page">
            {/* Greeting */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <div style={{ fontSize: 12, color: '#a78bfa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>
                        {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} ·  Semana 8
                    </div>
                    <h1 style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.1, marginBottom: 4 }}>
                        ¡Hola, {profile?.displayName || 'estudiante'}! 👋
                    </h1>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Tienes 3 misiones hoy. ¡A por ellas!</p>
                </div>
                <div className="focos-badge">
                    <span className="focos-icon">🔆</span>
                    <div>
                        <div className="focos-count">{focos}</div>
                        <div className="focos-label">FOCOS</div>
                    </div>
                </div>
            </div>

            {/* Familia banner */}
            {!isLinked && (
                <div style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(245,158,11,0.1))', border: '1px solid rgba(124,58,237,0.4)', borderRadius: 16, padding: 20, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                        <span style={{ fontSize: 32 }}>👨‍👩‍👦</span>
                        <div>
                            <div style={{ fontSize: 15, fontWeight: 800 }}>¡Vincula con tu familia!</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Desbloquea pactos, recompensas y transparencia familiar</div>
                        </div>
                    </div>
                    <button className="btn btn-primary" style={{ flexShrink: 0 }} onClick={() => setShowJoinModal(true)}>
                        Introducir código
                    </button>
                </div>
            )}

            {/* XP Bar */}
            <div className="xp-section">
                <div className="xp-header">
                    <div className="xp-level">
                        <div className="level-badge">⭐</div>
                        <div>
                            <div className="level-name">Nivel {level} — {levelNames[level] || 'Maestro'}</div>
                            <div className="level-sub">Siguiente: {levelNames[level + 1] || 'Máximo nivel'}</div>
                        </div>
                    </div>
                    <div className="xp-numbers">{focos}/{xpForLevel} XP</div>
                </div>
                <div className="xp-bar-track">
                    <div className="xp-bar-fill" style={{ width: `${xpFill}%` }} />
                </div>
            </div>

            {/* Racha */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-title">
                    🔥 Racha de {streaks.study} días
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Esta semana</span>
                </div>
                <div className="racha-row">
                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => {
                        const d = RACHA_WEEK[i];
                        return (
                            <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                <div className={`racha-day${d.perfect ? ' perfect' : d.done ? ' done' : d.today ? ' today-dot' : ''}`} title={day}>
                                    {d.today ? '⏳' : d.emoji}
                                </div>
                                <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700 }}>{day}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid-2" style={{ gap: 20, marginBottom: 20 }}>
                {/* Missions */}
                <div className="card">
                    <div className="card-title">
                        🎯 Misiones de hoy
                        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>{missions.filter(m => m.done).length}/{missions.length}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {missions.map((m, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, opacity: m.done ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                                <div
                                    style={{ width: 22, height: 22, border: `2px solid ${m.done ? 'var(--accent3)' : 'rgba(255,255,255,0.2)'}`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, background: m.done ? 'var(--accent3)' : 'transparent', transition: 'all 0.2s' }}
                                    onClick={() => toggleMission(i)}
                                >
                                    {m.done && <span style={{ fontSize: 12, color: 'white' }}>✓</span>}
                                </div>
                                <span style={{ fontSize: 20 }}>{m.emoji}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, textDecoration: m.done ? 'line-through' : 'none' }}>{m.title}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.subject}</div>
                                </div>
                                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, fontWeight: 700, color: 'var(--focos)', flexShrink: 0 }}>+{m.xp}🔆</span>
                            </div>
                        ))}
                    </div>
                    <Link to="/pomodoro" className="btn btn-primary" style={{ width: '100%', marginTop: 14, textAlign: 'center' }}>
                        ▶ Iniciar Pomodoro
                    </Link>
                </div>

                {/* Quick Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                        { icon: '🔥', label: 'Racha de enfoque', value: `${streaks.study} días`, color: '#fb923c' },
                        { icon: '💎', label: 'Bloques perfectos', value: '8 esta semana', color: '#a78bfa' },
                        { icon: '⏱️', label: 'Tiempo de hoy', value: '1h 45min', color: 'var(--accent3)' },
                        { icon: '🏅', label: 'Ranking clase', value: '#3', color: 'var(--focos)' },
                    ].map((s, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, transition: 'all 0.2s' }}>
                            <span style={{ fontSize: 22 }}>{s.icon}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
                                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Emotion logger */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-title">¿Cómo te sientes hoy?</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {[['😊', 'Genial'], ['😐', 'Normal'], ['😫', 'Cansado'], ['😤', 'Frustrado'], ['🧠', 'Enfocado']].map(([e, l]) => (
                        <div key={l} className={`emotion-btn${emotion === l ? ' selected' : ''}`} style={{ fontSize: 22 }} onClick={() => setEmotion(l)}>
                            {e}
                            <span className="emotion-label">{l}</span>
                        </div>
                    ))}
                </div>
                {emotion && <p style={{ fontSize: 12, color: 'var(--accent3)', marginTop: 8, fontWeight: 700 }}>✓ Registrado: {emotion}</p>}
            </div>

            {/* Quick links */}
            <div className="grid-3" style={{ gap: 12 }}>
                {[
                    { icon: '📅', label: 'Planificador', to: '/planner', color: 'rgba(124,58,237,0.15)' },
                    { icon: '🏆', label: 'Insignias', to: '/badges', color: 'rgba(245,158,11,0.15)' },
                    { icon: '🤝', label: 'Pactos', to: '/pactos', color: 'rgba(16,185,129,0.15)' },
                    { icon: '🧠', label: 'IA Personal', to: '/ia', color: 'rgba(124,58,237,0.15)' },
                    { icon: '🎯', label: 'Exámenes', to: '/examenes', color: 'rgba(244,63,94,0.12)' },
                    { icon: '📚', label: 'Técnicas', to: '/library', color: 'rgba(66,133,244,0.12)' },
                ].map((l, i) => (
                    <Link key={i} to={l.to} style={{ textDecoration: 'none', background: l.color, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <span style={{ fontSize: 28 }}>{l.icon}</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text)' }}>{l.label}</span>
                    </Link>
                ))}
            </div>

            {/* Join Family Modal */}
            {showJoinModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setShowJoinModal(false)}>
                    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 32, maxWidth: 400, width: '100%', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                        <div style={{ fontSize: 56, marginBottom: 12 }}>🔗</div>
                        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Vincular con familia</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.7 }}>
                            Pide el código de 6 dígitos que aparece en el panel de tus padres
                        </div>
                        <input
                            className="form-input mono"
                            type="text" maxLength={6}
                            placeholder="CÓDIGO"
                            value={joinCode}
                            onChange={e => setJoinCode(e.target.value.toUpperCase())}
                            style={{ textAlign: 'center', fontSize: 28, letterSpacing: '0.4em', marginBottom: 12 }}
                        />
                        {linkError && (
                            <div style={{ color: '#fb7185', fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
                                ⚠️ {linkError}
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowJoinModal(false)}>Cancelar</button>
                            <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleLink} disabled={linkLoading || joinCode.length !== 6}>
                                {linkLoading ? '⏳ vinculando…' : 'Vincular'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
