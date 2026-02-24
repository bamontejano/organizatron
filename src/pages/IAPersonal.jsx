import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const NOTIFICATIONS = [
    { icon: '🔥', title: '¡Racha en peligro!', msg: 'Llevas 5 días seguidos. No rompas la racha hoy.', time: 'Hace 2h', type: 'warning' },
    { icon: '📐', title: 'Examen en 3 días', msg: 'Recuerda repasar derivadas. Tu mejor hora es a las 16:30.', time: 'Hace 4h', type: 'exam' },
    { icon: '💎', title: '¡Bloque perfecto!', msg: 'Estudio de Física sin interrupciones. +15 Focos ganados.', time: 'Ayer 17:30', type: 'success' },
    { icon: '📈', title: 'Mejora detectada', msg: 'Esta semana estudias un 23% más que la semana pasada. ¡Bien!', time: 'Lun 17 Feb', type: 'info' },
];

const WEEKLY_ADVICE = [
    { day: 'Hoy', icon: '💡', title: 'Empieza Matemáticas a las 16:30', desc: 'Tu franja con menos interrupciones históricamente.' },
    { day: 'Ayer', icon: '⚠️', title: 'Patrón de fatiga detectado', desc: 'Los jueves rindes menos. Considera descansar antes del repaso.' },
    { day: 'Mié', icon: '🏆', title: '¡Semana perfecta va!', desc: 'Si estudias hoy superas tu récord de bloques perfectos semanales.' },
];

const NOTIF_COLOR = {
    warning: 'rgba(245,158,11,0.1)',
    exam: 'rgba(244,63,94,0.08)',
    success: 'rgba(16,185,129,0.08)',
    info: 'rgba(124,58,237,0.08)',
};
const NOTIF_BORDER = {
    warning: 'rgba(245,158,11,0.2)',
    exam: 'rgba(244,63,94,0.15)',
    success: 'rgba(16,185,129,0.15)',
    info: 'rgba(124,58,237,0.2)',
};

export default function IAPersonal() {
    const { addFocos } = useApp();
    const [dismissed, setDismissed] = useState(false);
    const [toggles, setToggles] = useState({ consejo: true, franja: true, patron: true, celebracion: true });
    const [notifTime, setNotifTime] = useState('15:30 (al salir del cole)');

    const toggle = (key) => setToggles(t => ({ ...t, [key]: !t[key] }));

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <div className="page-title">🧠 IA Personal</div>
                    <div className="page-subtitle">Consejos del día basados en cómo estudias</div>
                </div>
                <div style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(245,158,11,0.1))', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 10, padding: '10px 16px', fontSize: 12, fontWeight: 700, color: '#a78bfa' }}>
                    38 sesiones analizadas
                </div>
            </div>

            {/* Main Tip */}
            {!dismissed && (
                <div style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.18),rgba(245,158,11,0.1))', border: '1px solid rgba(124,58,237,0.4)', borderRadius: 20, padding: 28, marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: -30, right: -30, fontSize: 120, opacity: 0.05 }}>💡</div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                        <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg,#7c3aed,#f59e0b)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0, boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>💡</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Consejo de hoy · Lunes 24 Feb</div>
                            <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 10, lineHeight: 1.3 }}>Hoy es tu mejor día para Matemáticas — empieza a las 16:30</div>
                            <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 16 }}>
                                Los lunes de tarde son tu franja con menos interrupciones históricamente. Tienes el examen en 3 días, es el momento ideal para el repaso final.
                            </div>
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => { addFocos(5); setDismissed(true); }}>
                                    ✅ Entendido (+5 🔆)
                                </button>
                                <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => setDismissed(true)}>
                                    Descartar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Feed */}
            <div className="section-title">Notificaciones de hoy</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {NOTIFICATIONS.map((n, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 14, background: NOTIF_COLOR[n.type], border: `1px solid ${NOTIF_BORDER[n.type]}`, borderRadius: 12 }}>
                        <span style={{ fontSize: 22, flexShrink: 0 }}>{n.icon}</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 800 }}>{n.title}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{n.msg}</div>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{n.time}</div>
                    </div>
                ))}
            </div>

            {/* Weekly advice history */}
            <div className="section-title">Consejos de esta semana</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
                {WEEKLY_ADVICE.map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12 }}>
                        <span style={{ fontSize: 22 }}>{a.icon}</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{a.day}</span>
                                <span style={{ fontSize: 13, fontWeight: 800 }}>{a.title}</span>
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{a.desc}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Preferences */}
            <div className="section-title">Configurar notificaciones</div>
            <div className="card">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {[
                        ['consejo', 'Consejo del día', 'Un insight personalizado cada mañana'],
                        ['franja', 'Alerta de franja óptima', 'Aviso cuando empieza tu mejor hora para estudiar'],
                        ['patron', 'Patrón detectado', 'Cuando la IA detecta algo relevante en tu comportamiento'],
                        ['celebracion', 'Celebración de mejora', 'Cuando superas una de tus marcas personales'],
                    ].map(([key, label, sub]) => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 700 }}>{label}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>
                            </div>
                            <div className={`toggle-switch${toggles[key] ? ' on' : ''}`} onClick={() => toggle(key)}>
                                <div className="toggle-knob" />
                            </div>
                        </div>
                    ))}
                    {/* Time picker */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 700 }}>Hora de envío</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Cuándo recibir el consejo del día</div>
                        </div>
                        <select value={notifTime} onChange={e => setNotifTime(e.target.value)} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, padding: '8px 12px', fontFamily: 'inherit', cursor: 'pointer' }}>
                            <option>07:30 (al levantarse)</option>
                            <option>08:00</option>
                            <option>15:30 (al salir del cole)</option>
                            <option>16:00</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
