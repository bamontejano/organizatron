import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const CLASS_CHALLENGES = [
    { id: 1, emoji: '🔬', title: 'Reto Física', desc: 'La clase completa 50 Pomodoros esta semana', progress: 38, target: 50, daysLeft: 2, reward: 200 },
    { id: 2, emoji: '📐', title: 'Cero Deudas', desc: 'Toda la clase entrega mates a tiempo', progress: 18, target: 22, daysLeft: 4, reward: 150 },
];

const CLASSMATES = [
    { name: 'Carlos M.', avatar: '🏆', sessions: 24, streak: 11, status: 'online' },
    { name: 'Laura S.', avatar: '📚', sessions: 18, streak: 8, status: 'study' },
    { name: 'Javier R.', avatar: '🔥', sessions: 16, streak: 6, status: 'offline' },
    { name: 'Isabel F.', avatar: '💎', sessions: 12, streak: 5, status: 'online' },
    { name: 'Miguel A.', avatar: '⭐', sessions: 10, streak: 3, status: 'offline' },
];

const STATUS_COLOR = { online: 'var(--accent3)', study: 'var(--focos)', offline: 'rgba(255,255,255,0.2)' };
const STATUS_LABEL = { online: 'En línea', study: 'Estudiando ahora', offline: 'Desconectado' };
const STATUS_ICON = { online: '🟢', study: '📖', offline: '⚫' };

export default function MiClase() {
    const { addFocos } = useApp();
    const [activeTab, setActiveTab] = useState('retos');
    const [celebrateCh, setCelebrateCh] = useState(null);

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <div className="page-title">🏫 Mi Clase</div>
                    <div className="page-subtitle">2º Bachillerato B · IES Rosalía de Castro</div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 10, padding: '8px 14px', fontSize: 12, fontWeight: 700, color: 'var(--accent3)' }}>
                        22 alumnos
                    </div>
                </div>
            </div>

            <div className="tab-bar">
                <div className={`tab${activeTab === 'retos' ? ' active' : ''}`} onClick={() => setActiveTab('retos')}>💪 Retos grupales</div>
                <div className={`tab${activeTab === 'clase' ? ' active' : ''}`} onClick={() => setActiveTab('clase')}>👥 Compañeros</div>
                <div className={`tab${activeTab === 'resumen' ? ' active' : ''}`} onClick={() => setActiveTab('resumen')}>📊 Resumen semanal</div>
            </div>

            {activeTab === 'retos' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {CLASS_CHALLENGES.map(ch => {
                        const pct = Math.min((ch.progress / ch.target) * 100, 100);
                        const isCelebrating = celebrateCh === ch.id;
                        return (
                            <div key={ch.id} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <span style={{ fontSize: 32 }}>{ch.emoji}</span>
                                        <div>
                                            <div style={{ fontSize: 16, fontWeight: 900 }}>{ch.title}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ch.desc}</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 20, fontWeight: 700, color: 'var(--focos)' }}>+{ch.reward} 🔆</div>
                                        <div style={{ fontSize: 11, color: '#fb7185', fontWeight: 700 }}>⏳ {ch.daysLeft} días</div>
                                    </div>
                                </div>
                                <div className="pacto-bar-track" style={{ marginBottom: 6 }}>
                                    <div className="pacto-bar-fill" style={{ width: `${pct}%` }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
                                    <span>{ch.progress} / {ch.target} completado</span>
                                    <span>{Math.round(pct)}%</span>
                                </div>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button
                                        className="btn btn-primary"
                                        style={{ flex: 1 }}
                                        onClick={() => { addFocos(10); setCelebrateCh(ch.id); setTimeout(() => setCelebrateCh(null), 2000); }}
                                    >
                                        {isCelebrating ? '🎉 ¡Contribuiste!' : '✅ Aportar mi sesión'}
                                    </button>
                                    <button className="btn btn-ghost" style={{ fontSize: 12 }}>Ver progreso</button>
                                </div>
                            </div>
                        );
                    })}
                    <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>🆕</div>
                        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>Proponer reto grupal</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Sugiere un reto para toda la clase y gana 100 Focos extra si se acepta</div>
                        <button className="btn btn-ghost" style={{ fontSize: 13 }}>💡 Enviar propuesta</button>
                    </div>
                </div>
            )}

            {activeTab === 'clase' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {CLASSMATES.map((c, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, transition: 'all 0.2s' }}>
                            <div style={{ position: 'relative' }}>
                                <span style={{ fontSize: 28 }}>{c.avatar}</span>
                                <span style={{ position: 'absolute', bottom: -2, right: -2, fontSize: 10 }}>{STATUS_ICON[c.status]}</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 14, fontWeight: 800 }}>{c.name}</div>
                                <div style={{ fontSize: 11, color: STATUS_COLOR[c.status], fontWeight: 700 }}>{STATUS_LABEL[c.status]}</div>
                            </div>
                            <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                                <span>📅 {c.sessions} ses.</span>
                                <span>🔥 {c.streak}d</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'resumen' && (
                <div className="card">
                    <div className="card-title">Progreso colectivo esta semana</div>
                    <div className="grid-2" style={{ marginBottom: 20 }}>
                        {[
                            { label: 'Pomodoros totales', value: '186', icon: '🍅', color: 'var(--accent)' },
                            { label: 'Focos ganados', value: '2.4K', icon: '🔆', color: 'var(--focos)' },
                            { label: 'Racha media', value: '6.2 días', icon: '🔥', color: '#fb923c' },
                            { label: 'Alumnos activos', value: '18/22', icon: '✅', color: 'var(--accent3)' },
                        ].map((s, i) => (
                            <div key={i} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
                                <span style={{ fontSize: 24 }}>{s.icon}</span>
                                <div>
                                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: 14, fontSize: 13, color: 'var(--accent3)', lineHeight: 1.7 }}>
                        🏆 ¡Vuestra clase está en el <strong>Top 3</strong> del instituto esta semana! Seguid así para desbloquear el reto especial del mes.
                    </div>
                </div>
            )}
        </div>
    );
}
