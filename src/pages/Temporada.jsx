import React, { useState } from 'react';

const RANKINGS = [
    { pos: 1, name: 'María G.', level: 'Maestra', sessions: 28, focos: 420, avatar: '🌟', streak: 14, school: 'IES Rosalía' },
    { pos: 2, name: 'Carlos M.', level: 'Experto', sessions: 24, focos: 380, avatar: '🏆', streak: 11, school: 'IES Rosalía' },
    { pos: 3, name: 'Alejandro P.', level: 'Maestro', sessions: 22, focos: 350, avatar: '🎒', streak: 9, school: 'IES Rosalía', isMe: true },
    { pos: 4, name: 'Laura S.', level: 'Constante', sessions: 18, focos: 290, avatar: '📚', streak: 8, school: 'IES Rosalía' },
    { pos: 5, name: 'Javier R.', level: 'Constante', sessions: 16, focos: 260, avatar: '🔥', streak: 6, school: 'IES Rosalía' },
    { pos: 6, name: 'Isabel F.', level: 'Explorador', sessions: 12, focos: 200, avatar: '💎', streak: 5, school: 'IES Lorca' },
    { pos: 7, name: 'Miguel A.', level: 'Explorador', sessions: 10, focos: 180, avatar: '⭐', streak: 3, school: 'IES Lorca' },
    { pos: 8, name: 'Ana L.', level: 'Inicio', sessions: 8, focos: 130, avatar: '🌱', streak: 2, school: 'IES Lorca' },
];

const SEASON_BADGES = [
    { emoji: '❄️', name: 'Asistencia perfecta', desc: 'Estudia los 14 días', progress: 9, target: 14, earned: false },
    { emoji: '⭐', name: 'Racha de temporada', desc: '7 días consecutivos', progress: 9, target: 7, earned: true },
    { emoji: '🏆', name: 'Top 3', desc: 'Posición en el ranking', progress: 3, target: 3, earned: true },
    { emoji: '💎', name: '100 Focos en temporada', desc: 'Objetivo de la temporada', progress: 350, target: 500, earned: false },
];

const PODIUM_COLORS = ['rgba(245,158,11,0.15)', 'rgba(200,200,200,0.1)', 'rgba(180,100,50,0.1)'];
const MEDAL = ['🥇', '🥈', '🥉'];

export default function Temporada() {
    const [scope, setScope] = useState('global');

    const daysLeft = 5;
    const userRank = RANKINGS.find(r => r.isMe);

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <div className="page-title">🏆 Temporada de Invierno</div>
                    <div className="page-subtitle">Ranking semanal · 13–24 Feb 2026 · Quedan <strong style={{ color: '#fb7185' }}>{daysLeft} días</strong></div>
                </div>
                <div style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(245,158,11,0.1))', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 12, padding: '10px 18px', fontSize: 13, fontWeight: 700, color: '#a78bfa' }}>
                    ❄️ Temporada activa
                </div>
            </div>

            {/* Season Progress */}
            <div style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.12),rgba(245,158,11,0.06))', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 20, padding: 24, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <div style={{ fontSize: 13, color: '#a78bfa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>Tu posición actual</div>
                        <div style={{ fontSize: 32, fontWeight: 900 }}>🥉 Puesto {userRank?.pos}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 28, fontWeight: 700, color: 'var(--focos)' }}>{userRank?.focos} 🔆</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Necesitas {RANKINGS[1].focos - (userRank?.focos || 0)} más para el 🥈</div>
                    </div>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(((userRank?.focos || 0) / RANKINGS[0].focos) * 100, 100)}%`, background: 'linear-gradient(90deg,#7c3aed,#f59e0b)', borderRadius: 100 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                    <span>0 🔆</span><span>{RANKINGS[0].focos} 🔆 (1er lugar)</span>
                </div>
            </div>

            {/* Podium */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24, alignItems: 'flex-end', justifyContent: 'center' }}>
                {[RANKINGS[1], RANKINGS[0], RANKINGS[2]].map((r, i) => {
                    const podiumI = i === 0 ? 1 : i === 1 ? 0 : 2;
                    const h = i === 1 ? 120 : i === 0 ? 90 : 70;
                    return (
                        <div key={r.pos} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                            <div style={{ fontSize: 24 }}>{r.avatar}</div>
                            <div style={{ fontSize: 12, fontWeight: 800, textAlign: 'center' }}>{r.name}</div>
                            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 14, fontWeight: 700, color: 'var(--focos)' }}>{r.focos}</div>
                            <div style={{ width: '100%', height: h, background: PODIUM_COLORS[podiumI], border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px 10px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                                {MEDAL[podiumI]}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Scope Tabs + Rankings table */}
            <div className="tab-bar">
                <div className={`tab${scope === 'global' ? ' active' : ''}`} onClick={() => setScope('global')}>🌍 Global instituto</div>
                <div className={`tab${scope === 'clase' ? ' active' : ''}`} onClick={() => setScope('clase')}>🏫 Mi clase</div>
                <div className={`tab${scope === 'familia' ? ' active' : ''}`} onClick={() => setScope('familia')}>👨‍👩‍👦 Familiar</div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {RANKINGS.map((r, i) => {
                    const isMeStyle = r.isMe ? { background: 'rgba(124,58,237,0.12)', borderColor: 'rgba(124,58,237,0.3)' } : {};
                    return (
                        <div key={r.pos} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: '1px solid var(--border)', transition: 'background 0.15s', ...isMeStyle }}>
                            <div style={{ width: 28, fontFamily: "'Space Mono',monospace", fontWeight: 700, color: r.pos <= 3 ? 'var(--focos)' : 'var(--text-muted)', fontSize: 14, textAlign: 'center' }}>
                                {r.pos <= 3 ? MEDAL[r.pos - 1] : r.pos}
                            </div>
                            <div style={{ fontSize: 24 }}>{r.avatar}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                                    {r.name}
                                    {r.isMe && <span style={{ fontSize: 10, background: 'var(--accent)', color: 'white', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>TÚ</span>}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.level} · {r.school}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 16, fontWeight: 700, color: 'var(--focos)' }}>{r.focos}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>🔥 {r.streak}d racha</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Season Badges */}
            <div style={{ marginTop: 28 }}>
                <div className="section-title">Insignias de temporada</div>
                <div className="badges-grid">
                    {SEASON_BADGES.map((b, i) => (
                        <div key={i} className={`badge-item${b.earned ? ' earned' : ' locked'}`}>
                            <span className="badge-emoji">{b.emoji}</span>
                            <div className="badge-name">{b.name}</div>
                            <div className="badge-desc">{b.desc}</div>
                            {!b.earned && (
                                <>
                                    <div className="pacto-bar-track" style={{ marginTop: 8 }}>
                                        <div className="pacto-bar-fill" style={{ width: `${Math.min((b.progress / b.target) * 100, 100)}%` }} />
                                    </div>
                                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>{b.progress}/{b.target}</div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
