import React, { useState } from 'react';

const ALL_BADGES = [];

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
