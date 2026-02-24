import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const EXAMS = [
    {
        id: 1, subject: 'Matemáticas', emoji: '📐', date: '27 Feb 2026', daysLeft: 3,
        prediction: { score: 7.8, confidence: 82, level: 'Alta' },
        topics: [
            { name: 'Derivadas', mastery: 65, sessions: 4, study: 55 },
            { name: 'Integrales', mastery: 40, sessions: 2, study: 30 },
            { name: 'Sucesiones', mastery: 80, sessions: 6, study: 90 },
        ],
        plan: [
            { day: 'Hoy', task: 'Repaso derivadas · 45 min', priority: 'alta' },
            { day: 'Mañana', task: 'Práctica integrales · 60 min', priority: 'alta' },
            { day: 'Pasado', task: 'Repaso general · 30 min', priority: 'media' },
        ]
    },
    {
        id: 2, subject: 'Física', emoji: '🔬', date: '5 Mar 2026', daysLeft: 9,
        prediction: { score: 8.5, confidence: 75, level: 'Media' },
        topics: [
            { name: 'Cinemática', mastery: 75, sessions: 5, study: 70 },
            { name: 'Dinámica', mastery: 55, sessions: 3, study: 45 },
            { name: 'Energía', mastery: 88, sessions: 7, study: 95 },
        ],
        plan: [
            { day: 'Jue', task: 'Refuerzo Dinámica · 50 min', priority: 'alta' },
            { day: 'Vie', task: 'Simulacro · 45 min', priority: 'media' },
        ]
    },
];

const PRIORITY_COLOR = { alta: '#fb7185', media: 'var(--focos)', baja: 'var(--accent3)' };

function ExamCard({ exam, selected, onSelect }) {
    const predColor = exam.prediction.score >= 7 ? 'var(--accent3)' : exam.prediction.score >= 5 ? 'var(--focos)' : '#fb7185';

    return (
        <div
            className="card"
            style={{ cursor: 'pointer', border: `1px solid ${selected ? 'rgba(124,58,237,0.5)' : 'var(--border)'}`, background: selected ? 'rgba(124,58,237,0.06)' : 'var(--surface)', transition: 'all 0.2s' }}
            onClick={onSelect}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 28 }}>{exam.emoji}</span>
                    <div>
                        <div style={{ fontSize: 15, fontWeight: 800 }}>{exam.subject}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{exam.date}</div>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 28, fontWeight: 700, color: predColor, lineHeight: 1 }}>{exam.prediction.score.toFixed(1)}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>predicción</div>
                </div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: 12 }}>
                <span style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', padding: '3px 10px', borderRadius: 20, color: '#fb7185', fontWeight: 700 }}>🕐 {exam.daysLeft} días</span>
                <span style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '3px 10px', borderRadius: 20, color: 'var(--accent3)', fontWeight: 700 }}>🎯 {exam.prediction.confidence}% confianza</span>
            </div>
        </div>
    );
}

export default function Examenes() {
    const [selectedExam, setSelectedExam] = useState(EXAMS[0]);
    const [examMode, setExamMode] = useState(false);
    const [examElapsed, setExamElapsed] = useState(0);
    const [examRunning, setExamRunning] = useState(false);

    React.useEffect(() => {
        let interval;
        if (examRunning && examMode) {
            interval = setInterval(() => setExamElapsed(e => e + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [examRunning, examMode]);

    const pad = n => n.toString().padStart(2, '0');
    const elapsed = `${pad(Math.floor(examElapsed / 60))}:${pad(examElapsed % 60)}`;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <div className="page-title">🎯 Exámenes</div>
                    <div className="page-subtitle">Predicción de nota y plan de estudio personalizado</div>
                </div>
                {!examMode && (
                    <button className="btn btn-primary" onClick={() => setExamMode(true)}>🔴 Modo Examen</button>
                )}
            </div>

            {/* Exam Mode */}
            {examMode && (
                <div style={{ background: 'rgba(244,63,94,0.08)', border: '2px solid rgba(244,63,94,0.3)', borderRadius: 20, padding: 24, marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f43f5e', animation: 'pulse 1s ease-in-out infinite', boxShadow: '0 0 0 4px rgba(244,63,94,0.2)' }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 32, fontWeight: 700, color: '#fb7185' }}>{elapsed}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Modo examen activo — cronómetro</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn btn-ghost" onClick={() => setExamRunning(r => !r)}>
                                {examRunning ? '⏸ Pausar' : '▶ Iniciar'}
                            </button>
                            <button className="btn btn-danger" onClick={() => { setExamMode(false); setExamElapsed(0); setExamRunning(false); }}>
                                Salir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Exam list */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
                {EXAMS.map(e => (
                    <div key={e.id} style={{ flex: '1 1 260px' }}>
                        <ExamCard exam={e} selected={selectedExam.id === e.id} onSelect={() => setSelectedExam(e)} />
                    </div>
                ))}
            </div>

            {selectedExam && (
                <div className="grid-2" style={{ gap: 20 }}>
                    {/* Prediction */}
                    <div className="card">
                        <div className="card-title">📈 Predicción IA</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 56, fontWeight: 700, color: 'var(--accent3)', lineHeight: 1 }}>{selectedExam.prediction.score.toFixed(1)}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>predicción</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 10 }}>Si mantienes tu plan de estudio hasta {selectedExam.date}</div>
                                <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden', marginBottom: 8 }}>
                                    <div style={{ height: '100%', width: `${selectedExam.prediction.confidence}%`, background: 'linear-gradient(90deg,#7c3aed,#10b981)', borderRadius: 100 }} />
                                </div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selectedExam.prediction.confidence}% de confianza · {selectedExam.prediction.level}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {selectedExam.topics.map(t => (
                                <div key={t.name}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <span style={{ fontSize: 13, fontWeight: 700 }}>{t.name}</span>
                                        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: t.mastery >= 75 ? 'var(--accent3)' : t.mastery >= 50 ? 'var(--focos)' : '#fb7185', fontWeight: 700 }}>{t.mastery}%</span>
                                    </div>
                                    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${t.mastery}%`, background: t.mastery >= 75 ? 'var(--accent3)' : t.mastery >= 50 ? 'var(--focos)' : '#f43f5e', borderRadius: 100 }} />
                                    </div>
                                    <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                                        <span>📅 {t.sessions} sesiones</span><span>⏱ {t.study} min</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Study Plan */}
                    <div className="card">
                        <div className="card-title">📋 Plan de repaso</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {selectedExam.plan.map((p, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, transition: 'all 0.2s' }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 10, background: `${PRIORITY_COLOR[p.priority]}22`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <span style={{ fontSize: 10, fontWeight: 700, color: PRIORITY_COLOR[p.priority], textTransform: 'uppercase' }}>{p.day}</span>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, fontWeight: 700 }}>{p.task}</div>
                                        <span style={{ fontSize: 10, fontWeight: 700, color: PRIORITY_COLOR[p.priority], background: 'rgba(255,255,255,0.05)', padding: '1px 8px', borderRadius: 20, border: `1px solid ${PRIORITY_COLOR[p.priority]}44` }}>
                                            {p.priority}
                                        </span>
                                    </div>
                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-muted)' }}>▶️</button>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: 20, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12, padding: 12, fontSize: 12, color: '#a78bfa', lineHeight: 1.7 }}>
                            💡 <strong>Consejo de la IA:</strong> Empieza siempre con el tema con menor dominio (integrales) cuando tu concentración está en el pico.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
