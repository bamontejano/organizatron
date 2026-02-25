import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const CLASSROOM_TASKS = [];

const SCHEDULE_TODAY = [];

const PRIORITY_COLOR = { alta: '#fb7185', media: 'var(--focos)', baja: 'var(--accent3)' };
const COURSE_COLORS = { 'Matemáticas': '#7c3aed', 'Física': '#10b981', 'Historia': '#f59e0b', 'Inglés': '#4285f4', 'Lengua': '#f43f5e' };

export default function ClassroomPage() {
    const { isClassroomLinked, syncClassroom } = useApp();
    const [tasks, setTasks] = useState(CLASSROOM_TASKS);
    const [activeTab, setActiveTab] = useState('tareas');
    const [filter, setFilter] = useState('pendientes');

    const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));

    const visible = tasks.filter(t => filter === 'completadas' ? t.done : !t.done);

    if (!isClassroomLinked) {
        return (
            <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center', maxWidth: 460 }}>
                    <div style={{ fontSize: 72, marginBottom: 16, lineHeight: 1 }}>🎓</div>
                    <div className="page-title" style={{ fontSize: 26, marginBottom: 10 }}>Conecta Google Classroom</div>
                    <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 28 }}>
                        Vincula tu cuenta escolar para importar tareas, horarios y fechas de entrega de forma automática.
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28, textAlign: 'left' }}>
                        {['Tareas sincronizadas automáticamente', 'Recordatorios inteligentes antes de entregas', 'Gana Focos al completar tareas', 'Predicción de carga de trabajo'].map((t, i) => (
                            <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--text-muted)', alignItems: 'center' }}>
                                <span style={{ color: 'var(--accent3)', fontSize: 18 }}>✓</span> {t}
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-success" style={{ fontSize: 15, padding: '14px 32px', width: '100%' }} onClick={syncClassroom}>
                        🎓 Vincular Google Classroom
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontSize: 24 }}>🎓</span>
                    <div>
                        <div className="page-title">Google Classroom</div>
                        <div className="page-subtitle">Sincronizado hace 5 min</div>
                    </div>
                </div>
                <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={syncClassroom}>↺ Sincronizar</button>
            </div>

            <div className="tab-bar">
                <div className={`tab${activeTab === 'tareas' ? ' active' : ''}`} onClick={() => setActiveTab('tareas')}>
                    📋 Tareas <span style={{ background: '#fb7185', fontSize: 10, padding: '2px 7px', borderRadius: 20, color: 'white', fontWeight: 700, marginLeft: 6 }}>{tasks.filter(t => !t.done).length}</span>
                </div>
                <div className={`tab${activeTab === 'horario' ? ' active' : ''}`} onClick={() => setActiveTab('horario')}>📅 Horario hoy</div>
                <div className={`tab${activeTab === 'semana' ? ' active' : ''}`} onClick={() => setActiveTab('semana')}>📊 Carga semanal</div>
            </div>

            {activeTab === 'tareas' && (
                <>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                        {['pendientes', 'completadas'].map(f => (
                            <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'}`} style={{ fontSize: 12, padding: '6px 14px' }} onClick={() => setFilter(f)}>
                                {f === 'pendientes' ? `⏳ Pendientes (${tasks.filter(t => !t.done).length})` : `✅ Completadas (${tasks.filter(t => t.done).length})`}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {visible.map(t => (
                            <div key={t.id} className="cl-task" style={{ opacity: t.done ? 0.6 : 1 }}>
                                <div
                                    style={{ width: 22, height: 22, border: `2px solid ${t.done ? 'var(--accent3)' : 'rgba(255,255,255,0.2)'}`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, background: t.done ? 'var(--accent3)' : 'transparent', transition: 'all 0.2s' }}
                                    onClick={() => toggleTask(t.id)}
                                >
                                    {t.done && <span style={{ fontSize: 12 }}>✓</span>}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: `${COURSE_COLORS[t.course]}22`, color: COURSE_COLORS[t.course], border: `1px solid ${COURSE_COLORS[t.course]}44` }}>{t.course}</span>
                                        <span style={{ fontSize: 10, fontWeight: 700, color: PRIORITY_COLOR[t.priority] }}>{t.priority}</span>
                                    </div>
                                    <div style={{ fontSize: 14, fontWeight: 700, textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>📅 Entrega: {t.due} · {t.teacher}</div>
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 14, fontWeight: 700, color: 'var(--focos)' }}>+{t.points}🔆</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {activeTab === 'horario' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {SCHEDULE_TODAY.map((s, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'var(--surface2)', border: `1px solid var(--border)`, borderRadius: 14, borderLeft: `4px solid ${s.color}` }}>
                            <div style={{ textAlign: 'right', minWidth: 50 }}>
                                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 14, fontWeight: 700 }}>{s.time}</div>
                                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.duration}min</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 800 }}>{s.subject}</div>
                                {s.room && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>📍 {s.room}</div>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'semana' && (
                <div className="grid-2" style={{ gap: 16 }}>
                    {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((day, i) => {
                        const load = [2, 4, 2, 3, 1][i];
                        const pct = (load / 5) * 100;
                        const color = pct >= 70 ? '#fb7185' : pct >= 50 ? 'var(--focos)' : 'var(--accent3)';
                        return (
                            <div key={day} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                                    <span>{day}</span>
                                    <span style={{ color, fontFamily: "'Space Mono',monospace" }}>{load} entregas</span>
                                </div>
                                <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 100 }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
