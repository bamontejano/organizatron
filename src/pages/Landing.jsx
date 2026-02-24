import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Landing() {
    const { setUserRole } = useApp();
    const [selected, setSelected] = useState(null);
    const navigate = useNavigate();

    const handleStart = () => {
        if (!selected) return;
        setUserRole(selected);
        navigate('/');
    };

    return (
        <div className="landing-wrap">
            <div className="ob-card">
                <div className="ob-logo">📡 Focus Family</div>
                <h1 className="ob-title">Focus Family</h1>
                <p className="ob-subtitle">La app que une el estudio inteligente con la economía familiar. ¿Quién eres hoy?</p>

                <div className="role-cards">
                    <div className={`role-card${selected === 'teen' ? ' selected' : ''}`} onClick={() => setSelected('teen')}>
                        <span className="role-emoji">🎒</span>
                        <div className="role-label">Alumno</div>
                        <div className="role-desc">Gestiona tu tiempo, gana Focos y sube de nivel</div>
                    </div>
                    <div className={`role-card${selected === 'parent' ? ' selected' : ''}`} onClick={() => setSelected('parent')}>
                        <span className="role-emoji">👨‍👩‍👦</span>
                        <div className="role-label">Padre/Madre</div>
                        <div className="role-desc">Supervisa el progreso y establece pactos familiares</div>
                    </div>
                </div>

                {selected && (
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.7 }}>
                        {selected === 'teen'
                            ? '📱 Racha de estudio, Pomodoro, economía de Focos, rankings y más'
                            : '🔒 Visibilidad del progreso, pactos y recompensas — sin espiar'
                        }
                    </div>
                )}

                <button
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '16px', fontSize: 16, opacity: selected ? 1 : 0.5, cursor: selected ? 'pointer' : 'not-allowed' }}
                    onClick={handleStart}
                    disabled={!selected}
                >
                    {selected ? `Entrar como ${selected === 'teen' ? 'Alumno 🎒' : 'Familia 👨‍👩‍👦'}` : 'Selecciona tu rol'}
                </button>

                <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    🛡️ <strong style={{ color: 'var(--accent3)' }}>Diseño ético:</strong> Transparencia total. Tu hijo sabe exactamente qué ves. Sin vigilancia — solo apoyo.
                </div>
            </div>
        </div>
    );
}
