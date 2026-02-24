import React, { useState } from 'react';

const TECHNIQUES = [
    { emoji: '🍅', title: 'Pomodoro', difficulty: 'Fácil', focos: 10, desc: '25 minutos de enfoque total seguidos de 5 min de descanso. Acumula 4 y descansa 20 min.', tag: 'Concentración' },
    { emoji: '🧠', title: 'Feynman', difficulty: 'Media', focos: 20, desc: 'Explica el tema como si se lo contaras a un niño de 12 años. Si no puedes, no lo has entendido.', tag: 'Comprensión' },
    { emoji: '🃏', title: 'Flashcards', difficulty: 'Fácil', focos: 15, desc: 'Tarjetas de pregunta-respuesta con repetición espaciada. Ideal para vocabulario y fechas.', tag: 'Memorización' },
    { emoji: '🗺️', title: 'Mapas mentales', difficulty: 'Media', focos: 18, desc: 'Conecta ideas visualmente partiendo del concepto central. Activa ambos hemisferios cerebrales.', tag: 'Comprensión' },
    { emoji: '📝', title: 'Active Recall', difficulty: 'Media', focos: 22, desc: 'Cierra el libro y escribe todo lo que recuerdas. Más efectivo que reler para la retención.', tag: 'Memorización' },
    { emoji: '🔄', title: 'Spaced Repetition', difficulty: 'Difícil', focos: 30, desc: 'Repasa el material a intervalos crecientes (1d, 3d, 7d, 21d). Vence el olvido exponencial.', tag: 'Memorización' },
    { emoji: '🎯', title: 'Cornell Notes', difficulty: 'Fácil', focos: 12, desc: 'Divide la hoja en 3 zonas: notas, preguntas y resumen. Sistema usado en Harvard.', tag: 'Organización' },
    { emoji: '🌊', title: 'Método Flow', difficulty: 'Difícil', focos: 35, desc: 'Entra en estado de flujo total: sin notificaciones, una sola tarea, metas claras y progresivas.', tag: 'Concentración' },
];

const DIFF_COLOR = { 'Fácil': 'var(--accent3)', 'Media': 'var(--focos)', 'Difícil': '#fb7185' };
const DIFF_BG = { 'Fácil': 'rgba(16,185,129,0.12)', 'Media': 'rgba(245,158,11,0.12)', 'Difícil': 'rgba(244,63,94,0.1)' };

export default function Library() {
    const [expanded, setExpanded] = useState(null);
    const [filter, setFilter] = useState('Todos');

    const tags = ['Todos', ...new Set(TECHNIQUES.map(t => t.tag))];
    const visible = filter === 'Todos' ? TECHNIQUES : TECHNIQUES.filter(t => t.tag === filter);

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <div className="page-title">📚 Técnicas de Estudio</div>
                    <div className="page-subtitle">{TECHNIQUES.length} métodos probados para estudiar mejor</div>
                </div>
            </div>

            <div className="tab-bar">
                {tags.map(t => (
                    <div key={t} className={`tab${filter === t ? ' active' : ''}`} onClick={() => setFilter(t)}>{t}</div>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {visible.map((t, i) => {
                    const isOpen = expanded === i;
                    return (
                        <div
                            key={i}
                            className="card"
                            style={{ cursor: 'pointer', transition: 'all 0.2s', borderColor: isOpen ? 'rgba(124,58,237,0.4)' : 'var(--border)' }}
                            onClick={() => setExpanded(isOpen ? null : i)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <span style={{ fontSize: 28, flexShrink: 0 }}>{t.emoji}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                                        <div style={{ fontSize: 15, fontWeight: 800 }}>{t.title}</div>
                                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 20, background: DIFF_BG[t.difficulty], color: DIFF_COLOR[t.difficulty], border: `1px solid ${DIFF_COLOR[t.difficulty]}44` }}>{t.difficulty}</span>
                                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 20, background: 'rgba(124,58,237,0.12)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)' }}>{t.tag}</span>
                                    </div>
                                    {!isOpen && <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.desc}</div>}
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 14, fontWeight: 700, color: 'var(--focos)' }}>+{t.focos} 🔆</div>
                                    <span style={{ fontSize: 18, color: 'var(--text-muted)', transition: 'transform 0.2s', display: 'inline-block', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>⌄</span>
                                </div>
                            </div>

                            {isOpen && (
                                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                                    <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 16 }}>{t.desc}</p>
                                    <div style={{ display: 'flex', gap: 10 }}>
                                        <button className="btn btn-primary" style={{ fontSize: 13 }}>▶ Iniciar con esta técnica</button>
                                        <button className="btn btn-ghost" style={{ fontSize: 13 }}>📋 Más info</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
