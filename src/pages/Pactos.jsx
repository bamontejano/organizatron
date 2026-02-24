import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const TYPE_ICONS = { bloques: '📦', dias: '📅', libre: '✨' };

export default function Pactos() {
    const {
        userRole,
        pactos,
        proposePacto,
        acceptPacto,
        updatePacto
    } = useApp();

    const [activeTab, setActiveTab] = useState('activos');
    const [showModal, setShowModal] = useState(false);
    const [editPacto, setEditPacto] = useState(null);

    // Modal state
    const [pTitle, setPTitle] = useState('');
    const [pGoal, setPGoal] = useState('');
    const [pType, setPType] = useState('bloques');
    const [pTarget, setPTarget] = useState('');
    const [pDeadline, setPDeadline] = useState('Esta semana');
    const [pReward, setPReward] = useState('');
    const [pFocos, setPFocos] = useState(100);
    const [pNote, setPNote] = useState('');

    const pactosActivos = pactos.filter(p => p.status === 'active');
    const pactosPropuestos = pactos.filter(p => p.status === 'pending');
    const pactosCompletados = pactos.filter(p => p.status === 'completed');

    const openModal = (pacto = null) => {
        if (pacto) {
            setEditPacto(pacto);
            setPTitle(pacto.title);
            setPGoal(pacto.goal);
            setPType(pacto.type);
            setPTarget(String(pacto.target));
            setPDeadline(pacto.deadline);
            setPReward(pacto.reward);
            setPFocos(pacto.focosBonus);
            setPNote(pacto.note || '');
        } else {
            setEditPacto(null);
            setPTitle('');
            setPGoal('');
            setPType('bloques');
            setPTarget('');
            setPDeadline('Esta semana');
            setPReward('');
            setPFocos(100);
            setPNote('');
        }
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    const handleSavePacto = async () => {
        const data = {
            title: pTitle,
            goal: pGoal,
            type: pType,
            target: Number(pTarget) || 0,
            deadline: pDeadline,
            reward: pReward,
            focosBonus: pFocos,
            note: pNote,
        };

        if (editPacto) {
            // Update logic if we wanted, but proposePacto is new
            // For now, let's just allow parents to propose new ones
            // and maybe later edit existing pending ones
        } else {
            await proposePacto(data);
        }
        closeModal();
    };

    const handleAccept = async (id) => {
        await acceptPacto(id);
    };

    const PactoCard = ({ p, showAcceptBtn = false }) => {
        const pct = p.target > 0 ? Math.min((p.progress / p.target) * 100, 100) : 0;
        return (
            <div className="pacto-card" style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 18 }}>{TYPE_ICONS[p.type] || '✨'}</span>
                            <span style={{ fontSize: 15, fontWeight: 800 }}>{p.title}</span>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.goal}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 18, fontWeight: 700, color: 'var(--focos)' }}>+{p.focosBonus} 🔆</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.deadline}</div>
                    </div>
                </div>

                {p.target > 0 && (
                    <>
                        <div className="pacto-bar-track">
                            <div className="pacto-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                            <span>{p.progress} / {p.target} {p.type === 'bloques' ? 'bloques' : 'días'}</span>
                            <span>{Math.round(pct)}%</span>
                        </div>
                    </>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                    <span style={{ fontSize: 12, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, padding: '3px 10px', color: 'var(--focos)', fontWeight: 700 }}>
                        🎁 {p.reward}
                    </span>
                    {p.note && <span style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic', flex: 1 }}>"{p.note}"</span>}
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    {showAcceptBtn && (
                        <button className="btn btn-primary" style={{ flex: 1, fontSize: 13 }} onClick={() => handleAccept(p.id)}>✅ Aceptar pacto</button>
                    )}
                    {userRole === 'parent' && p.status === 'pending' && (
                        <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => openModal(p)}>✏️ Editar</button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <div className="page-title">🤝 Rincón de Pactos</div>
                    <div className="page-subtitle">Acuerdos entre el alumno y la familia</div>
                </div>
                {userRole === 'parent' && (
                    <button className="btn btn-primary" onClick={() => openModal()}>+ Proponer pacto</button>
                )}
            </div>

            <div className="tab-bar">
                <div className={`tab${activeTab === 'activos' ? ' active' : ''}`} onClick={() => setActiveTab('activos')}>
                    🟢 En curso <span style={{ background: 'var(--accent)', color: 'white', fontSize: 10, padding: '2px 7px', borderRadius: 20, marginLeft: 6 }}>{pactosActivos.length}</span>
                </div>
                <div className={`tab${activeTab === 'propuestos' ? ' active' : ''}`} onClick={() => setActiveTab('propuestos')}>
                    🆕 Propuestos <span style={{ background: 'var(--focos)', color: '#0a0a0f', fontSize: 10, padding: '2px 7px', borderRadius: 20, marginLeft: 6 }}>{pactosPropuestos.length}</span>
                </div>
                <div className={`tab${activeTab === 'completados' ? ' active' : ''}`} onClick={() => setActiveTab('completados')}>
                    ✅ Completados
                </div>
            </div>

            {activeTab === 'activos' && (
                pactosActivos.length === 0
                    ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No hay pactos activos en este momento.</div>
                    : pactosActivos.map(p => <PactoCard key={p.id} p={p} />)
            )}

            {activeTab === 'propuestos' && (
                <>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
                        Pactos esperando tu respuesta. Puedes aceptarlos o pedir cambios.
                    </div>
                    {pactosPropuestos.length === 0
                        ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No hay pactos propuestos.</div>
                        : pactosPropuestos.map(p => <PactoCard key={p.id} p={p} showAcceptBtn={userRole === 'teen'} />)
                    }
                </>
            )}

            {activeTab === 'completados' && (
                pactosCompletados.length === 0
                    ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Todavía no has completado ningún pacto.</div>
                    : pactosCompletados.map(p => (
                        <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 14, marginBottom: 10 }}>
                            <span style={{ fontSize: 24 }}>✅</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 14, fontWeight: 800 }}>{p.title}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.reward}</div>
                            </div>
                            <span style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, color: 'var(--accent3)' }}>+{p.focosBonus} 🔆</span>
                        </div>
                    ))
            )}

            {/* Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={closeModal}>
                    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 28, maxWidth: 500, width: '92%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 22 }}>
                            <div style={{ fontSize: 18, fontWeight: 900 }}>{editPacto ? 'Editar pacto' : 'Nuevo pacto'}</div>
                            <span style={{ cursor: 'pointer', fontSize: 20, color: 'var(--text-muted)' }} onClick={closeModal}>✕</span>
                        </div>

                        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Título del pacto</label>
                        <input className="form-input" value={pTitle} onChange={e => setPTitle(e.target.value)} placeholder="ej: Semana de Matemáticas" style={{ margin: '6px 0 14px' }} />

                        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Objetivo</label>
                        <input className="form-input" value={pGoal} onChange={e => setPGoal(e.target.value)} placeholder="ej: 4 bloques sin interrupciones" style={{ margin: '6px 0 14px' }} />

                        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Tipo de reto</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, margin: '8px 0 16px' }}>
                            {[['bloques', '📦', 'Bloques', 'N bloques de estudio'], ['dias', '📅', 'Días seguidos', 'Racha de N días'], ['libre', '✨', 'Libre', 'Objetivo personalizado']].map(([type, icon, lbl, sub]) => (
                                <div key={type} onClick={() => setPType(type)} style={{ padding: '10px 6px', borderRadius: 10, border: `2px solid ${pType === type ? 'var(--accent)' : 'var(--border)'}`, background: pType === type ? 'rgba(124,58,237,0.12)' : 'var(--surface2)', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' }}>
                                    <div style={{ fontSize: 20 }}>{icon}</div>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa', marginTop: 4 }}>{lbl}</div>
                                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{sub}</div>
                                </div>
                            ))}
                        </div>

                        {pType !== 'libre' && (
                            <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Meta</label>
                                    <input type="number" className="form-input" value={pTarget} onChange={e => setPTarget(e.target.value)} placeholder="ej: 5" style={{ marginTop: 6 }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Plazo</label>
                                    <select className="form-input" value={pDeadline} onChange={e => setPDeadline(e.target.value)} style={{ marginTop: 6, cursor: 'pointer' }}>
                                        <option>Esta semana</option>
                                        <option>2 semanas</option>
                                        <option>Este mes</option>
                                        <option>Este trimestre</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Recompensa</label>
                        <input className="form-input" value={pReward} onChange={e => setPReward(e.target.value)} placeholder="ej: Noche de cine en casa" style={{ margin: '6px 0 14px' }} />

                        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Focos extra ({pFocos} 🔆)</label>
                        <input type="range" min="0" max="500" step="10" value={pFocos} onChange={e => setPFocos(Number(e.target.value))} style={{ width: '100%', margin: '8px 0 14px', accentColor: 'var(--accent)', cursor: 'pointer' }} />

                        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Mensaje (opcional)</label>
                        <input className="form-input" value={pNote} onChange={e => setPNote(e.target.value)} placeholder="ej: ¡Sabemos que puedes, ánimo!" style={{ margin: '6px 0 22px' }} />

                        <div style={{ display: 'flex', gap: 10 }}>
                            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={closeModal}>Cancelar</button>
                            <button className="btn btn-primary" style={{ flex: 2, padding: 14 }} onClick={handleSavePacto}>
                                {editPacto ? 'Guardar cambios' : 'Enviar pacto al alumno'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
