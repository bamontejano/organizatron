import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const FOCOS_GOALS = [
    { id: 1, emoji: '🏠', title: 'Fondo viaje familiar', desc: 'Para las vacaciones de verano en familia', target: 5000, current: 2840, contributed: 200, totalContrib: 20 },
    { id: 2, emoji: '🧒', title: 'Material escolar hermano', desc: 'Libros y material para el cole de Samuel', target: 800, current: 560, contributed: 50, totalContrib: 8 },
    { id: 3, emoji: '🎉', title: 'Celebración familiar', desc: 'Cumpleaños de mamá — cena especial', target: 1200, current: 900, contributed: 100, totalContrib: 12 },
];

export default function FocosSolidarios() {
    const { focos, addFocos } = useApp();
    const [amounts, setAmounts] = useState({ 1: 50, 2: 50, 3: 50 });
    const [toasts, setToasts] = useState([]);
    const [goals, setGoals] = useState(FOCOS_GOALS);

    const donate = (goal) => {
        const amount = amounts[goal.id];
        if (focos < amount) {
            showToast('⚠️', 'Sin Focos suficientes', `Tienes ${focos} Focos, necesitas ${amount}`);
            return;
        }
        addFocos(-amount);
        setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, current: Math.min(g.current + amount, g.target), contributed: g.contributed + amount, totalContrib: g.totalContrib + 1 } : g));
        showToast('🫶', '¡Donación realizada!', `Donaste ${amount} Focos a "${goal.title}"`);
    };

    const showToast = (icon, title, msg) => {
        const id = Date.now();
        setToasts(t => [...t, { id, icon, title, msg }]);
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <div className="page-title">🫶 Focos Solidarios</div>
                    <div className="page-subtitle">Dona tus Focos a objetivos familiares</div>
                </div>
                <div className="focos-badge">
                    <span className="focos-icon">🔆</span>
                    <div>
                        <div className="focos-count">{focos}</div>
                        <div className="focos-label">DISPONIBLES</div>
                    </div>
                </div>
            </div>

            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16, padding: 20, marginBottom: 24, display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 40 }}>🌱</span>
                <div>
                    <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 4 }}>¡Cada Focos cuenta!</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                        Usa tus Focos para contribuir a metas familiares. No pierdes puntos de nivel — solo demuestras compromiso con tu familia.
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {goals.map(g => {
                    const pct = Math.min((g.current / g.target) * 100, 100);
                    const isComplete = g.current >= g.target;
                    return (
                        <div key={g.id} className="card" style={{ borderColor: isComplete ? 'rgba(16,185,129,0.3)' : 'var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <span style={{ fontSize: 36 }}>{g.emoji}</span>
                                    <div>
                                        <div style={{ fontSize: 15, fontWeight: 900 }}>{isComplete && '✅ '}{g.title}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{g.desc}</div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 18, fontWeight: 700, color: 'var(--focos)' }}>{g.current.toLocaleString('es-ES')}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>de {g.target.toLocaleString('es-ES')} Focos</div>
                                </div>
                            </div>

                            <div style={{ height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden', marginBottom: 10 }}>
                                <div style={{ height: '100%', width: `${pct}%`, background: isComplete ? 'var(--accent3)' : 'linear-gradient(90deg,#10b981,#f59e0b)', borderRadius: 100, transition: 'width 0.6s ease' }} />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
                                <span>{Math.round(pct)}% conseguido</span>
                                <span>Tu contribución: <strong style={{ color: 'var(--focos)' }}>{g.contributed} 🔆</strong></span>
                            </div>

                            {!isComplete && (
                                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                        {[25, 50, 100].map(a => (
                                            <button key={a}
                                                onClick={() => setAmounts(prev => ({ ...prev, [g.id]: a }))}
                                                style={{ padding: '5px 12px', borderRadius: 8, border: `1px solid ${amounts[g.id] === a ? 'var(--accent)' : 'var(--border)'}`, background: amounts[g.id] === a ? 'rgba(124,58,237,0.2)' : 'var(--surface2)', color: amounts[g.id] === a ? '#a78bfa' : 'var(--text-muted)', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
                                                {a}🔆
                                            </button>
                                        ))}
                                        <input
                                            type="number"
                                            min="1"
                                            max={focos}
                                            value={amounts[g.id]}
                                            onChange={e => setAmounts(prev => ({ ...prev, [g.id]: Number(e.target.value) }))}
                                            style={{ width: 70, padding: '5px 10px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 12, fontFamily: 'inherit', outline: 'none' }}
                                        />
                                    </div>
                                    <button className="btn btn-success" style={{ fontSize: 13, padding: '9px 20px' }} onClick={() => donate(g)}>
                                        🫶 Donar {amounts[g.id]} 🔆
                                    </button>
                                </div>
                            )}

                            {isComplete && (
                                <div style={{ fontSize: 13, color: 'var(--accent3)', fontWeight: 700, padding: '10px 14px', background: 'rgba(16,185,129,0.1)', borderRadius: 10 }}>
                                    🎉 ¡Objetivo completado! Tu familia lo logró.
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Toast notifications */}
            <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {toasts.map(t => (
                    <div key={t.id} className="toast">
                        <span className="toast-icon">{t.icon}</span>
                        <div>
                            <div className="toast-title">{t.title}</div>
                            <div className="toast-msg">{t.msg}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
