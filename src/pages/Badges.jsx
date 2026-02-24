import React, { useState } from 'react';

const ALL_BADGES = [
    { emoji: '🥇', name: 'Primer Paso', desc: 'Primera sesión', cat: 'esfuerzo', earned: true },
    { emoji: '📅', name: 'Semana Completa', desc: '7 días planificados', cat: 'esfuerzo', earned: true },
    { emoji: '💎', name: 'Primer Diamante', desc: '1 bloque perfecto', cat: 'enfoque', earned: true },
    { emoji: '🔥', name: 'Llama Inicial', desc: 'Racha de 3 días', cat: 'constancia', earned: true },
    { emoji: '🤝', name: 'Primer Pacto', desc: 'Pacto cumplido', cat: 'familia', earned: true },
    { emoji: '🧱', name: 'Muro de Acero', desc: '5 bloques perfectos', cat: 'enfoque', earned: true },
    { emoji: '📐', name: 'Matemático', desc: '10h de mates', cat: 'esfuerzo', earned: true },
    { emoji: '📆', name: '1 Semana', desc: 'Racha 7 días', cat: 'constancia', earned: true },
    { emoji: '🏡', name: 'Familia Unida', desc: '3 pactos cumplidos', cat: 'familia', earned: true },
    { emoji: '⭐', name: 'Explorador', desc: 'Nivel 2 alcanzado', cat: 'esfuerzo', earned: true },
    { emoji: '🏰', name: 'Fortaleza', desc: '10 bloques perfectos', cat: 'enfoque', earned: true },
    { emoji: '📖', name: 'Curioso', desc: '5 técnicas vistas', cat: 'esfuerzo', earned: true },
    { emoji: '🌙', name: '1 Mes', desc: 'Racha 30 días', cat: 'constancia', earned: false },
    { emoji: '⚔️', name: 'Invencible', desc: '20 bloques perfectos', cat: 'enfoque', earned: false },
    { emoji: '🏅', name: 'Negociador', desc: '5 pactos cumplidos', cat: 'familia', earned: false },
    { emoji: '🚀', name: 'Maestro', desc: 'Nivel 5 alcanzado', cat: 'esfuerzo', earned: false },
    { emoji: '💫', name: 'Trimestre', desc: '90 días de racha', cat: 'constancia', earned: false },
    { emoji: '👑', name: 'Leyenda', desc: '50 bloques perfectos', cat: 'enfoque', earned: false },
];

const TABS = ['todas', 'esfuerzo', 'enfoque', 'constancia', 'familia'];
const TAB_LABELS = { todas: 'Todas', esfuerzo: 'Esfuerzo', enfoque: 'Enfoque', constancia: 'Constancia', familia: 'Familia' };

export default function Badges() {
    const [filter, setFilter] = useState('todas');

    const visible = ALL_BADGES.filter(b => filter === 'todas' || b.cat === filter);
    const earnedCount = ALL_BADGES.filter(b => b.earned).length;
    const lockedCount = ALL_BADGES.length - earnedCount;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <div className="page-title">🏆 Insignias</div>
                    <div className="page-subtitle">{earnedCount} ganadas · {lockedCount} por desbloquear</div>
                </div>
                <span className="pill pill-amber">🔆 +5 XP al ganar</span>
            </div>

            <div className="tab-bar">
                {TABS.map(t => (
                    <div key={t} className={`tab${filter === t ? ' active' : ''}`} onClick={() => setFilter(t)}>
                        {TAB_LABELS[t]}
                    </div>
                ))}
            </div>

            <div className="badges-grid">
                {visible.map((b, i) => (
                    <div key={i} className={`badge-item${b.earned ? ' earned' : ' locked'}`}>
                        <span className="badge-emoji">{b.emoji}</span>
                        <div className="badge-name">{b.name}</div>
                        <div className="badge-desc">{b.desc}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
