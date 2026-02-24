import React, { useState } from 'react';
import { registerUser, loginUser } from '../services/authService';

const TABS = ['login', 'register'];

export default function AuthPage() {
    const [tab, setTab] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('teen');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (tab === 'register') {
                if (!name.trim()) throw new Error('Introduce tu nombre');
                await registerUser(email, password, name.trim(), role);
            } else {
                await loginUser(email, password);
            }
            // AppContext will pick up the auth change — no redirect needed here
        } catch (err) {
            const MSGS = {
                'auth/email-already-in-use': 'Ese email ya está registrado. Inicia sesión.',
                'auth/invalid-email': 'Email no válido.',
                'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
                'auth/invalid-credential': 'Email o contraseña incorrectos.',
                'auth/user-not-found': 'No hay cuenta con ese email.',
                'auth/wrong-password': 'Contraseña incorrecta.',
            };
            setError(MSGS[err.code] || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="landing-wrap">
            <div className="ob-card" style={{ maxWidth: 440 }}>
                {/* Header */}
                <div className="ob-logo">📡 Focus Family</div>
                <h1 className="ob-title" style={{ marginBottom: 4 }}>Focus Family</h1>
                <p className="ob-subtitle">Estudio inteligente · Economía familiar · IA personal</p>

                {/* Tabs */}
                <div className="tab-bar" style={{ marginBottom: 24 }}>
                    {TABS.map(t => (
                        <div key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => { setTab(t); setError(''); }}>
                            {t === 'login' ? '🔑 Iniciar sesión' : '🆕 Crear cuenta'}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left' }}>

                    {/* Name (register only) */}
                    {tab === 'register' && (
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>Nombre</label>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="Tu nombre"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                    )}

                    {/* Email */}
                    <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>Email</label>
                        <input
                            className="form-input"
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoFocus={tab === 'login'}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>Contraseña</label>
                        <input
                            className="form-input"
                            type="password"
                            placeholder={tab === 'register' ? 'Mínimo 6 caracteres' : '••••••••'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Role selector (register only) */}
                    {tab === 'register' && (
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>¿Quién eres?</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                {[
                                    { value: 'teen', emoji: '🎒', label: 'Alumno/a', desc: 'Estudio y Focos' },
                                    { value: 'parent', emoji: '👨‍👩‍👦', label: 'Padre/Madre', desc: 'Panel familiar' },
                                ].map(r => (
                                    <div
                                        key={r.value}
                                        onClick={() => setRole(r.value)}
                                        style={{
                                            padding: '14px 12px',
                                            borderRadius: 12,
                                            border: `2px solid ${role === r.value ? 'var(--accent)' : 'var(--border)'}`,
                                            background: role === r.value ? 'rgba(124,58,237,0.12)' : 'var(--surface2)',
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        <div style={{ fontSize: 28, marginBottom: 6 }}>{r.emoji}</div>
                                        <div style={{ fontSize: 13, fontWeight: 800 }}>{r.label}</div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{r.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div style={{ padding: '10px 14px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 10, fontSize: 13, color: '#fb7185', fontWeight: 700 }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: 16, fontSize: 15, marginTop: 4 }}
                        disabled={loading}
                    >
                        {loading
                            ? '⏳ Cargando...'
                            : tab === 'login'
                                ? '🔑 Entrar'
                                : role === 'parent'
                                    ? '👨‍👩‍👦 Crear cuenta familiar'
                                    : '🎒 Crear cuenta de alumno'
                        }
                    </button>
                </form>

                {/* Ethics note */}
                {tab === 'register' && role === 'parent' && (
                    <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        🛡️ Al registrarte como padre/madre, se generará un <strong style={{ color: 'var(--accent3)' }}>código de vinculación</strong> único que tu hijo/a deberá introducir en su cuenta para conectar la familia.
                    </div>
                )}
            </div>
        </div>
    );
}
