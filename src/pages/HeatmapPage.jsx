import React, { useMemo, useState } from 'react';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function generateYear() {
    const data = [];
    const today = new Date();
    const base = new Date(today.getFullYear(), 0, 1);
    for (let i = 0; i < 365; i++) {
        const d = new Date(base);
        d.setDate(base.getDate() + i);
        const isPast = d <= today;
        data.push({
            date: d,
            sessions: isPast ? Math.floor(Math.random() * 5) : -1, // -1 = future
        });
    }
    return data;
}

const intensityBg = (sessions) => {
    if (sessions < 0) return 'rgba(255,255,255,0.03)';
    if (sessions === 0) return 'rgba(255,255,255,0.04)';
    if (sessions === 1) return 'rgba(124,58,237,0.2)';
    if (sessions === 2) return 'rgba(124,58,237,0.4)';
    if (sessions === 3) return 'rgba(124,58,237,0.6)';
    return 'rgba(124,58,237,0.9)';
};

export default function HeatmapPage() {
    const [hovered, setHovered] = useState(null);
    const yearData = useMemo(generateYear, []);

    const totalSessions = yearData.filter(d => d.sessions > 0).reduce((acc, d) => acc + d.sessions, 0);
    const activeDays = yearData.filter(d => d.sessions > 0).length;
    const longestStreak = (() => {
        let max = 0, cur = 0;
        for (const d of yearData) {
            if (d.sessions > 0) { cur++; max = Math.max(max, cur); } else { cur = 0; }
        }
        return max;
    })();

    // Group into weeks (columns)
    const weeks = [];
    const firstDow = yearData[0].date.getDay(); // 0=Sun
    let week = Array(firstDow).fill(null);
    for (const d of yearData) {
        week.push(d);
        if (d.date.getDay() === 6) { weeks.push(week); week = []; }
    }
    if (week.length) weeks.push(week);

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <div className="page-title">📅 Mapa Anual de Estudio</div>
                    <div className="page-subtitle">{new Date().getFullYear()} — Cada celda = 1 día</div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid-3" style={{ marginBottom: 24 }}>
                <div className="stat-card purple">
                    <div className="stat-icon">🔥</div>
                    <div className="stat-value">{longestStreak}</div>
                    <div className="stat-label">Racha más larga (días)</div>
                </div>
                <div className="stat-card amber">
                    <div className="stat-icon">⏱️</div>
                    <div className="stat-value">{totalSessions}</div>
                    <div className="stat-label">Sesiones totales</div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon">📅</div>
                    <div className="stat-value">{activeDays}</div>
                    <div className="stat-label">Días activos</div>
                </div>
            </div>

            {/* Heatmap */}
            <div className="card" style={{ overflowX: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                    <div className="card-title" style={{ margin: 0 }}>Actividad del año</div>
                    {/* Legend */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
                        Menos
                        {[0, 1, 2, 3, 4].map(s => (
                            <div key={s} title={`${s} sesiones`} style={{ width: 12, height: 12, borderRadius: 3, background: intensityBg(s), border: '1px solid rgba(255,255,255,0.06)', display: 'inline-block' }} />
                        ))}
                        Más
                    </div>
                </div>

                {/* Month labels */}
                <div style={{ display: 'flex', marginBottom: 4, marginLeft: 14 }}>
                    {MONTHS.map((m, mi) => {
                        const weekIdx = weeks.findIndex(w => w.some(d => d && d.date.getMonth() === mi && d.date.getDate() <= 7));
                        return <div key={m} style={{ flex: 1, fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', minWidth: 0 }}>{m}</div>;
                    })}
                </div>

                {/* Grid */}
                <div style={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                    {/* Day labels */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginRight: 4 }}>
                        {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((d, i) => (
                            <div key={d} style={{ width: 12, height: 14, fontSize: 9, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                                {i % 2 === 1 ? d : ''}
                            </div>
                        ))}
                    </div>
                    {weeks.map((week, wi) => (
                        <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {Array(7).fill(null).map((_, di) => {
                                const cell = week[di];
                                if (!cell) return <div key={di} style={{ width: 14, height: 14 }} />;
                                const isToday = cell.date.toDateString() === new Date().toDateString();
                                const isHovered = hovered && hovered.date.toDateString() === cell.date.toDateString();
                                return (
                                    <div
                                        key={di}
                                        className="heatmap-cell"
                                        style={{
                                            background: intensityBg(cell.sessions),
                                            border: isToday ? '2px solid var(--accent)' : `1px solid rgba(255,255,255,0.06)`,
                                            transform: isHovered ? 'scale(1.5)' : undefined,
                                            zIndex: isHovered ? 10 : undefined,
                                            position: 'relative',
                                        }}
                                        onMouseEnter={() => setHovered(cell)}
                                        onMouseLeave={() => setHovered(null)}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Tooltip */}
                {hovered && hovered.sessions >= 0 && (
                    <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                        <span>📅 {hovered.date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                        <span>·</span>
                        <span style={{ color: '#a78bfa', fontWeight: 700 }}>{hovered.sessions} sesiones</span>
                    </div>
                )}
            </div>
        </div>
    );
}
