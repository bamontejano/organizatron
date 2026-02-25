import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 8); // 8 to 21
const TYPES = ['study', 'leisure', 'rest'];
const TYPE_EMOJI = { study: '📐', leisure: '🎮', rest: '😴' };
const TYPE_COLOR = { study: 'rgba(124,58,237,0.7)', leisure: 'rgba(245,158,11,0.7)', rest: 'rgba(16,185,129,0.6)' };
const TYPE_BG = { study: 'rgba(124,58,237,0.12)', leisure: 'rgba(245,158,11,0.1)', rest: 'rgba(16,185,129,0.08)' };
const TYPE_BORDER = { study: 'rgba(124,58,237,0.3)', leisure: 'rgba(245,158,11,0.25)', rest: 'rgba(16,185,129,0.2)' };
const TYPE_LABEL = { study: 'Estudio', leisure: 'Ocio', rest: 'Descanso' };

const EMPTY_BLOCK = { day: 'Lunes', startTime: '08:00', endTime: '09:00', type: 'study', subject: '', task: '', notes: '' };

export default function Planner() {
    const { blocks, addBlock, updateBlock, removeBlock, userRole } = useApp();
    const [showModal, setShowModal] = useState(false);
    const [editingBlock, setEditingBlock] = useState(null);
    const [newBlock, setNewBlock] = useState({ ...EMPTY_BLOCK });
    const [filterType, setFilterType] = useState('todos');

    const openNew = (day = 'Lunes', hour = 8) => {
        setEditingBlock(null);
        const hrStr = hour.toString().padStart(2, '0');
        const endHrStr = (hour + 1).toString().padStart(2, '0');
        setNewBlock({ ...EMPTY_BLOCK, day, startTime: `${hrStr}:00`, endTime: `${endHrStr}:00` });
        setShowModal(true);
    };

    const openEdit = (b) => { setEditingBlock(b); setNewBlock({ ...b }); setShowModal(true); };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newBlock.subject) return;
        if (editingBlock) { updateBlock(newBlock); }
        else { addBlock(newBlock); }
        setShowModal(false);
    };

    const filteredBlocks = filterType === 'todos' ? blocks : blocks.filter(b => b.type === filterType);

    // Calculate position and height of a block in the grid
    const getBlockStyle = (startTime, endTime) => {
        const parseTime = (timeStr) => {
            if (!timeStr) return 0;
            const [h, m] = timeStr.split(':').map(Number);
            return h + m / 60;
        };
        const start = parseTime(startTime);
        const end = parseTime(endTime);
        const top = Math.max(0, start - 8) * 60; // 60px per hour
        const height = Math.max(15, (end - start) * 60);

        return {
            position: 'absolute',
            top: `${top}px`,
            height: `${height}px`,
            left: '4px',
            right: '4px',
            zIndex: 10,
        };
    };

    return (
        <div className="page" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="page-header" style={{ flexShrink: 0 }}>
                <div>
                    <div className="page-title">📅 Planificador Semanal</div>
                    <div className="page-subtitle">{blocks.length} bloques planificados</div>
                </div>
                {userRole === 'teen' && <button className="btn btn-primary" onClick={() => openNew()}>+ Nuevo bloque</button>}
            </div>

            {/* Filters */}
            <div className="tab-bar" style={{ flexShrink: 0, overflowX: 'auto', marginBottom: 12 }}>
                <div className={`tab${filterType === 'todos' ? ' active' : ''}`} onClick={() => setFilterType('todos')}>Todos</div>
                {TYPES.map(t => (
                    <div key={t} className={`tab${filterType === t ? ' active' : ''}`} onClick={() => setFilterType(t)}>
                        {TYPE_EMOJI[t]} {TYPE_LABEL[t]}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto', background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', position: 'relative' }}>
                <div style={{ display: 'flex', minWidth: 800 }}>
                    {/* Time labels column */}
                    <div style={{ width: 60, flexShrink: 0, borderRight: '1px solid var(--border)', background: 'var(--surface2)' }}>
                        <div style={{ height: 40, borderBottom: '1px solid var(--border)' }}></div> {/* Header empty space */}
                        {HOURS.map(h => (
                            <div key={h} style={{ height: 60, borderBottom: '1px solid var(--border)', position: 'relative' }}>
                                <span style={{ position: 'absolute', top: -10, right: 8, fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>
                                    {h.toString().padStart(2, '0')}:00
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Days columns */}
                    {DAYS.map(day => {
                        const dayBlocks = filteredBlocks.filter(b => b.day === day);
                        return (
                            <div key={day} style={{ flex: 1, minWidth: 100, borderRight: '1px solid var(--border)', position: 'relative' }}>
                                {/* Header */}
                                <div style={{ height: 40, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface2)', position: 'sticky', top: 0, zIndex: 20 }}>
                                    <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>{day.substring(0, 3)}</span>
                                </div>

                                {/* Grid container */}
                                <div style={{ position: 'relative', height: HOURS.length * 60 }}>
                                    {/* Hour grid lines */}
                                    {HOURS.map(h => (
                                        <div key={h}
                                            style={{ height: 60, borderBottom: '1px dashed rgba(255,255,255,0.05)', cursor: userRole === 'teen' ? 'pointer' : 'default' }}
                                            onClick={() => userRole === 'teen' && openNew(day, h)}
                                        />
                                    ))}

                                    {/* Render blocks */}
                                    {dayBlocks.map((b, bi) => (
                                        <div
                                            key={b.id || bi}
                                            style={{
                                                ...getBlockStyle(b.startTime, b.endTime),
                                                background: TYPE_BG[b.type],
                                                border: `1px solid ${TYPE_BORDER[b.type]}`,
                                                borderRadius: 6,
                                                padding: '4px',
                                                cursor: 'pointer',
                                                borderLeft: `3px solid ${TYPE_COLOR[b.type]}`,
                                                overflow: 'hidden',
                                                transition: 'transform 0.15s ease'
                                            }}
                                            onClick={(e) => { e.stopPropagation(); openEdit(b); }}
                                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
                                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                                                <span style={{ fontSize: 12 }}>{TYPE_EMOJI[b.type]}</span>
                                                <span style={{ fontSize: 10, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.subject}</span>
                                            </div>
                                            <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{b.startTime}-{b.endTime}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
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
                            {userRole === 'teen' ? (
                                <>
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
                                        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>Tarea a realizar</label>
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
                                </>
                            ) : (
                                <>
                                    {/* Render read-only info for parents */}
                                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                                        <span style={{ fontSize: 32 }}>{TYPE_EMOJI[newBlock.type]}</span>
                                        <div>
                                            <div style={{ fontSize: 18, fontWeight: 800 }}>{newBlock.subject}</div>
                                            <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{newBlock.day} de {newBlock.startTime} a {newBlock.endTime}</div>
                                        </div>
                                    </div>
                                    {newBlock.task && (
                                        <div style={{ padding: 12, background: 'var(--surface2)', borderRadius: 10 }}>
                                            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Tarea o descripción</div>
                                            <div style={{ fontSize: 14 }}>{newBlock.task}</div>
                                        </div>
                                    )}
                                    <button type="button" className="btn btn-ghost" style={{ width: '100%', marginTop: 8 }} onClick={() => setShowModal(false)}>Cerrar</button>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
