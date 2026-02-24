import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const REWARDS = [
    { id: 1, emoji: '🎬', name: 'Noche de peli', desc: 'Eliges la película del viernes', cost: 80, cat: 'small', parent: 'Disponible' },
    { id: 2, emoji: '📱', name: '+1h de móvil extra', desc: 'Una hora más de pantalla', cost: 60, cat: 'small', parent: 'Disponible' },
    { id: 3, emoji: '🍕', name: 'Pizza para cenar', desc: 'Eliges la cena del sábado', cost: 120, cat: 'medium', parent: 'Disponible' },
    { id: 4, emoji: '🏀', name: 'Excursión deportiva', desc: 'Tarde de deporte de tu elección', cost: 200, cat: 'medium', parent: 'Requiere pacto' },
    { id: 5, emoji: '🎮', name: 'Torneo de videojuegos', desc: '3 horas de gaming sin límite', cost: 180, cat: 'medium', parent: 'Disponible' },
    { id: 6, emoji: '✈️', name: 'Fin de semana especial', desc: 'Actividad family de elección', cost: 500, cat: 'big', parent: 'Requiere pacto' },
];

const PARENT_REWARDS = [
    { id: 7, emoji: '📚', name: 'Pagar libros extra', desc: 'Material extra de preparación', cost: 0, cat: 'small', note: 'Inversión educativa' },
    { id: 8, emoji: '🏋️', name: 'Clases extraescolar', desc: 'Actividad de su elección', cost: 0, cat: 'medium', note: 'Actividad mensual' },
];

export default function RewardsPage() {
    const { focos, redeemReward, userRole } = useApp();
    const [filter, setFilter] = useState('todos');
    const [toast, setToast] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newR, setNewR] = useState({ name: '', desc: '', cost: 100, emoji: '🎁' });

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const EMOJIS = ['🎬', '🍕', '🎮', '📱', '🏀', '✈️', '🎁', '🍦', '🏋️', '📚', '🏖️', '🎤'];

    const all = userRole === 'parent' ? PARENT_REWARDS : REWARDS;
    const visible = filter === 'todos' ? all : all.filter(r => r.cat === filter);

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <div className="page-title">{userRole === 'parent' ? '🎁 Gestionar Recompensas' : '🎁 Bazar de Premios'}</div>
                    <div className="page-subtitle">
                        {userRole === 'parent'
                            ? 'Configura lo que puede canjear tu hijo/a'
                            : 'Canjea tus Focos por recompensas reales'
                        }
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    {userRole !== 'parent' && (
                        <div className="focos-badge">
                            <span className="focos-icon">🔆</span>
                            <div>
                                <div className="focos-count">{focos}</div>
                                <div className="focos-label">FOCOS</div>
                            </div>
                        </div>
                    )}
                    {userRole === 'parent' && (
                        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Añadir recompensa</button>
                    )}
                </div>
            </div>

            {/* Filter tabs */}
            <div className="tab-bar" style={{ marginBottom: 20 }}>
                {[['todos', 'Todas'], ['small', 'Pequeñas'], ['medium', 'Medianas'], ['big', 'Grandes']].map(([k, l]) => (
                    <div key={k} className={`tab${filter === k ? ' active' : ''}`} onClick={() => setFilter(k)}>{l}</div>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {visible.map(r => {
                    const canAfford = focos >= r.cost;
                    return (
                        <div key={r.id} className="reward-item" style={{ opacity: userRole === 'teen' && !canAfford ? 0.6 : 1 }}>
                            <span className="reward-emoji">{r.emoji}</span>
                            <div className="reward-info">
                                <div className="reward-name">{r.name}</div>
                                <div className="reward-desc">{r.desc}</div>
                                {r.parent && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>👨‍👩‍👦 {r.parent}</div>}
                                {r.note && <div style={{ fontSize: 10, color: 'var(--accent3)', marginTop: 4, fontWeight: 700 }}>{r.note}</div>}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                                {r.cost > 0 && <div className="reward-cost">{r.cost} 🔆</div>}
                                <span className={`reward-cat ${r.cat}`}>{r.cat}</span>
                                {userRole === 'teen' ? (
                                    <button
                                        className={`btn ${canAfford ? 'btn-primary' : 'btn-ghost'}`}
                                        style={{ fontSize: 12, padding: '6px 14px' }}
                                        disabled={!canAfford}
                                        onClick={() => {
                                            if (redeemReward(r.id, r.name, r.cost)) {
                                                showToast(`🎉 ¡"${r.name}" canjeado! Avisa a tus padres.`);
                                            }
                                        }}
                                    >
                                        {canAfford ? 'Canjear' : 'Sin Focos'}
                                    </button>
                                ) : (
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <button className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }}>✏️</button>
                                        <button className="btn btn-danger" style={{ fontSize: 12, padding: '6px 12px' }}>🗑️</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Parent — Add reward modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setShowModal(false)}>
                    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 28, maxWidth: 420, width: '100%' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                            <div style={{ fontSize: 18, fontWeight: 900 }}>Nueva recompensa</div>
                            <span style={{ cursor: 'pointer', fontSize: 20, color: 'var(--text-muted)' }} onClick={() => setShowModal(false)}>✕</span>
                        </div>

                        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Emoji</label>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '8px 0 16px' }}>
                            {EMOJIS.map(e => (
                                <div key={e} onClick={() => setNewR(r => ({ ...r, emoji: e }))} style={{ fontSize: 22, cursor: 'pointer', padding: 6, borderRadius: 8, border: `1.5px solid ${newR.emoji === e ? 'var(--accent)' : 'var(--border)'}`, background: newR.emoji === e ? 'rgba(124,58,237,0.12)' : 'var(--surface2)', transition: 'all 0.15s' }}>
                                    {e}
                                </div>
                            ))}
                        </div>

                        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Nombre</label>
                        <input className="form-input" value={newR.name} onChange={e => setNewR(r => ({ ...r, name: e.target.value }))} placeholder="ej: Noche de cine" style={{ margin: '6px 0 14px' }} />

                        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Descripción</label>
                        <input className="form-input" value={newR.desc} onChange={e => setNewR(r => ({ ...r, desc: e.target.value }))} placeholder="ej: Eliges la película" style={{ margin: '6px 0 14px' }} />

                        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Coste en Focos ({newR.cost} 🔆)</label>
                        <input type="range" min="10" max="1000" step="10" value={newR.cost} onChange={e => setNewR(r => ({ ...r, cost: Number(e.target.value) }))} style={{ width: '100%', margin: '8px 0 20px', accentColor: 'var(--accent)', cursor: 'pointer' }} />

                        <div style={{ display: 'flex', gap: 10 }}>
                            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancelar</button>
                            <button className="btn btn-primary" style={{ flex: 2, padding: 14 }} onClick={() => { setShowModal(false); showToast(`✅ "${newR.name}" añadido al bazar`); }}>
                                Añadir recompensa
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className="toast">
                    <span className="toast-icon">🎁</span>
                    <div>
                        <div className="toast-title">Canje en proceso</div>
                        <div className="toast-msg">{toast}</div>
                    </div>
                </div>
            )}
        </div>
    );
}
