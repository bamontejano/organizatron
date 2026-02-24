import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const TYPES = ['study', 'leisure', 'rest'];
const TYPE_EMOJI = { study: '📐', leisure: '🎮', rest: '😴' };
const TYPE_COLOR = { study: 'rgba(124,58,237,0.7)', leisure: 'rgba(245,158,11,0.7)', rest: 'rgba(16,185,129,0.6)' };
const TYPE_BG = { study: 'rgba(124,58,237,0.12)', leisure: 'rgba(245,158,11,0.1)', rest: 'rgba(16,185,129,0.08)' };
const TYPE_BORDER = { study: 'rgba(124,58,237,0.3)', leisure: 'rgba(245,158,11,0.25)', rest: 'rgba(16,185,129,0.2)' };
const TYPE_LABEL = { study: 'Estudio', leisure: 'Ocio', rest: 'Descanso' };

const EMPTY_BLOCK = { day: 'Lunes', startTime: '09:00', endTime: '10:00', type: 'study', subject: '', task: '', notes: '' };

export default function Planner() {
    const { blocks, addBlock, updateBlock, removeBlock } = useApp();
    const [showModal, setShowModal] = useState(false);
    const [editingBlock, setEditingBlock] = useState(null);
    const [newBlock, setNewBlock] = useState({ ...EMPTY_BLOCK });
    const [filterType, setFilterType] = useState('todos');

    const openNew = () => { setEditingBlock(null); setNewBlock({ ...EMPTY_BLOCK }); setShowModal(true); };

    const openEdit = (b) => { setEditingBlock(b); setNewBlock({ ...b }); setShowModal(true); };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newBlock.subject) return;
        if (editingBlock) { updateBlock(newBlock); }
        else { addBlock(newBlock); }
        setShowModal(false);
    };

    const filteredBlocks = filterType === 'todos' ? blocks : blocks.filter(b => b.type === filterType);
    const blocksByDay = DAYS.reduce((acc, d) => ({ ...acc, [d]: filteredBlocks.filter(b => b.day === d) }), {});

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <div className="page-title">📅 Planificador</div>
                    <div className="page-subtitle">{blocks.length} bloques planificados esta semana</div>
                </div>
                <button className="btn btn-primary" onClick={openNew}>+ Añadir bloque</button>
            </div>

            {/* Filters */}
            <div className="tab-bar">
                <div className={`tab${filterType === 'todos' ? ' active' : ''}`} onClick={() => setFilterType('todos')}>Todos</div>
                {TYPES.map(t => (
                    <div key={t} className={`tab${filterType === t ? ' active' : ''}`} onClick={() => setFilterType(t)}>
                        {TYPE_EMOJI[t]} {TYPE_LABEL[t]}
                    </div>
                ))}
            </div>

            {/* Week view */}
            <div style={{ overflowX: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(120px, 1fr))', gap: 12, minWidth: 700 }}>
                    {DAYS.map(day => (
                        <div key={day}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1.5, textAlign: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)', marginBottom: 10 }}>
                                {day.substring(0, 3)}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {blocksByDay[day].length === 0 ? (
                                    <div
                                        style={{ height: 80, border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.15)', fontSize: 22, transition: 'all 0.2s' }}
                                        onClick={() => { setNewBlock({ ...EMPTY_BLOCK, day }); setEditingBlock(null); setShowModal(true); }}
                                        onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'; e.currentTarget.style.color = 'rgba(124,58,237,0.5)'; }}
                                        onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.15)'; }}
                                    >+</div>
                                ) : (
                                    blocksByDay[day].map((b, bi) => (
                                        <div
                                            key={bi}
                                            style={{ background: TYPE_BG[b.type], border: `1px solid ${TYPE_BORDER[b.type]}`, borderRadius: 10, padding: '10px', cursor: 'pointer', transition: 'all 0.2s', borderLeft: `3px solid ${TYPE_COLOR[b.type]}` }}
                                            onClick={() => openEdit(b)}
                                            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                                        >
                                            <div style={{ fontSize: 14, marginBottom: 4 }}>{TYPE_EMOJI[b.type]}</div>
                                            <div style={{ fontSize: 12, fontWeight: 800, lineHeight: 1.3, marginBottom: 4 }}>{b.subject}</div>
                                            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{b.startTime}–{b.endTime}</div>
                                        </div>
                                    ))
                                )}
                                {blocksByDay[day].length > 0 && (
                                    <div
                                        style={{ border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 8, padding: '6px', textAlign: 'center', cursor: 'pointer', fontSize: 11, color: 'rgba(255,255,255,0.2)', transition: 'all 0.2s' }}
                                        onClick={() => { setNewBlock({ ...EMPTY_BLOCK, day }); setEditingBlock(null); setShowModal(true); }}
                                        onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'}
                                        onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
                                    >+ añadir</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setShowModal(false)}>
                    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 28, maxWidth: 480, width: '100%', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                            <div style={{ fontSize: 18, fontWeight: 900 }}>{editingBlock ? 'Editar bloque' : 'Nuevo bloque'}</div>
                            <span style={{ cursor: 'pointer', fontSize: 20, color: 'var(--text-muted)' }} onClick={() => setShowModal(false)}>✕</span>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>Día</label>
                                <select className="form-input" value={newBlock.day} onChange={e => setNewBlock(b => ({ ...b, day: e.target.value }))} style={{ cursor: 'pointer' }}>
                                    {DAYS.map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>Tipo</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                                    {TYPES.map(t => (
                                        <div
                                            key={t}
                                            onClick={() => setNewBlock(b => ({ ...b, type: t }))}
                                            style={{ padding: '10px 6px', borderRadius: 10, border: `2px solid ${newBlock.type === t ? TYPE_COLOR[t] : 'var(--border)'}`, background: newBlock.type === t ? TYPE_BG[t] : 'var(--surface2)', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
                                        >
                                            <div style={{ fontSize: 20 }}>{TYPE_EMOJI[t]}</div>
                                            <div style={{ fontSize: 11, fontWeight: 700, marginTop: 4, color: newBlock.type === t ? 'var(--text)' : 'var(--text-muted)' }}>{TYPE_LABEL[t]}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>Materia / Actividad</label>
                                <input className="form-input" required value={newBlock.subject} onChange={e => setNewBlock(b => ({ ...b, subject: e.target.value }))} placeholder="ej: Matemáticas" />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>Inicio</label>
                                    <input type="time" className="form-input" value={newBlock.startTime} onChange={e => setNewBlock(b => ({ ...b, startTime: e.target.value }))} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>Fin</label>
                                    <input type="time" className="form-input" value={newBlock.endTime} onChange={e => setNewBlock(b => ({ ...b, endTime: e.target.value }))} />
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>Tarea (opcional)</label>
                                <input className="form-input" value={newBlock.task} onChange={e => setNewBlock(b => ({ ...b, task: e.target.value }))} placeholder="ej: Ejercicios pág 45" />
                            </div>

                            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancelar</button>
                                {editingBlock && (
                                    <button type="button" className="btn btn-danger" style={{ flex: 1 }} onClick={() => { removeBlock(editingBlock.id || editingBlock); setShowModal(false); }}>Eliminar</button>
                                )}
                                <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: 14 }}>
                                    {editingBlock ? 'Guardar cambios' : 'Añadir bloque'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
