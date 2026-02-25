import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const EXAMS = [];

const PRIORITY_COLOR = { alta: '#fb7185', media: 'var(--focos)', baja: 'var(--accent3)' };

function ExamCard({ exam, selected, onSelect }) {
    const predColor = exam.prediction.level === 'Alta' ? 'var(--accent3)' : exam.prediction.level === 'Media' ? 'var(--focos)' : '#fb7185';

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
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 24, fontWeight: 700, color: predColor, lineHeight: 1 }}>{exam.prediction.level}</div>
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
            {EXAMS.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                    <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>Aún no hay exámenes añadidos</div>
                    <div style={{ fontSize: 14 }}>Próximamente podrás añadir tus fechas de exámenes aquí.</div>
                </div>
            ) : (
                <>
                    <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
                        {EXAMS.map(e => (
                            <div key={e.id} style={{ flex: '1 1 260px' }}>
                                <ExamCard exam={e} selected={selectedExam?.id === e.id} onSelect={() => setSelectedExam(e)} />
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
                                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 28, fontWeight: 700, color: 'var(--accent3)', lineHeight: 1 }}>{selectedExam.prediction.level}</div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>predicción</div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 10 }}>Si mantienes tu plan de estudio hasta {selectedExam.date}</div>
                                        <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden', marginBottom: 8 }}>
                                            <div style={{ height: '100%', width: `${selectedExam.prediction.confidence}%`, background: 'linear-gradient(90deg,#7c3aed,#10b981)', borderRadius: 100 }} />
                                        </div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selectedExam.prediction.confidence}% de confianza</div>
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
                                    💡 <strong>Consejo de la IA:</strong> Sigue tu plan, te ayudará a mantener la calma en el examen.
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
