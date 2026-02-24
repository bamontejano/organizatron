import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import QRCode from 'qrcode.react';

export default function PerfilPage() {
    const {
        profile,
        userRole,
        focos,
        savings,
        level,
        streaks,
        family,
        familyId,
        isLinked,
        linkCode,
        familyMembers,
        generateFamilyCode,
        linkFamily,
        linkError,
        linkLoading,
        logout,
    } = useApp();

    const [codeInput, setCodeInput] = useState('');
    const [codeResult, setCodeResult] = useState('');
    const [newCode, setNewCode] = useState('');
    const [notifEmail, setNotifEmail] = useState(true);
    const [soundOn, setSoundOn] = useState(true);
    const [showDanger, setShowDanger] = useState(false);

    const levelNames = ['', 'Inicio', 'Explorador', 'Constante', 'Maestro del Enfoque', 'Sabio', 'Leyenda'];
    const xpToNext = [100, 150, 250, 500, 1000, 2000][Math.min(level - 1, 5)];
    const displayCode = newCode || linkCode;

    const handleRegenCode = async () => {
        const c = await generateFamilyCode();
        if (c) setNewCode(c);
    };

    const handleLinkFamily = async (e) => {
        e.preventDefault();
        if (codeInput.length !== 6) return;
        const result = await linkFamily(codeInput.toUpperCase());
        if (result.success) setCodeResult('✅ ¡Familia vinculada correctamente!');
    };

    if (!profile) return (
        <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
            <div style={{ color: 'var(--text-muted)' }}>Cargando perfil…</div>
        </div>
    );

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <div className="page-title">⚙️ Mi Perfil y Familia</div>
                    <div className="page-subtitle">{profile.email}</div>
                </div>
                <button className="btn btn-ghost" style={{ color: '#fb7185' }} onClick={logout}>🚪 Cerrar sesión</button>
            </div>

            <div className="grid-2" style={{ gap: 20 }}>
                {/* ── LEFT COLUMN ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {/* Profile card */}
                    <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                            <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg,#7c3aed,#f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0 }}>
                                {userRole === 'parent' ? '👨‍👩‍👦' : '🎒'}
                            </div>
                            <div>
                                <div style={{ fontSize: 20, fontWeight: 900 }}>{profile.displayName}</div>
                                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{profile.email}</div>
                                <span className="pill pill-purple" style={{ marginTop: 6, display: 'inline-flex' }}>
                                    {userRole === 'parent' ? '👨‍👩‍👦 Padre/Madre' : '🎒 Alumno'}
                                </span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                            {[
                                { label: '🔆 Focos', value: focos, color: '#f59e0b' },
                                { label: '💰 Ahorro', value: `${savings} 🔆`, color: '#10b981' },
                                { label: '🔥 Racha', value: `${streaks.study}d`, color: '#fb7185' },
                            ].map(s => (
                                <div key={s.label} style={{ textAlign: 'center', padding: '14px 8px', background: 'var(--surface2)', borderRadius: 12, border: '1px solid var(--border)' }}>
                                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3, fontWeight: 600 }}>{s.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* XP bar */}
                        {userRole === 'teen' && (
                            <div style={{ marginTop: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                                    <span style={{ fontWeight: 700, color: '#a78bfa' }}>Nv.{level} {levelNames[level]}</span>
                                    <span style={{ color: 'var(--text-muted)', fontFamily: "'Space Mono',monospace" }}>{focos}/{xpToNext}</span>
                                </div>
                                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${Math.min((focos / xpToNext) * 100, 100)}%`, background: 'linear-gradient(90deg,#7c3aed,#f59e0b)', borderRadius: 100 }} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* App settings */}
                    <div className="card">
                        <div className="card-title">🔧 Ajustes de la app</div>
                        {[
                            { label: 'Notificaciones por email', state: notifEmail, set: setNotifEmail },
                            { label: 'Sonidos del temporizador', state: soundOn, set: setSoundOn },
                        ].map(s => (
                            <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                                <span style={{ fontSize: 13, fontWeight: 600 }}>{s.label}</span>
                                <div className={`toggle-switch${s.state ? ' on' : ''}`} onClick={() => s.set(v => !v)}>
                                    <div className="toggle-knob" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Danger zone */}
                    <div className="card" style={{ borderColor: 'rgba(244,63,94,0.2)' }}>
                        <div className="card-title" style={{ color: '#fb7185' }}>⚠️ Zona peligrosa</div>
                        {!showDanger ? (
                            <button className="btn btn-danger" onClick={() => setShowDanger(true)}>Mostrar opciones</button>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Estas acciones son irreversibles. Asegúrate antes de continuar.</p>
                                <button className="btn btn-danger" onClick={logout}>🚪 Cerrar sesión en todos los dispositivos</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── RIGHT COLUMN: Family system ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {/* PARENT: show link code + QR */}
                    {userRole === 'parent' && (
                        <div className="card">
                            <div className="card-title">👨‍👩‍👦 Código de vinculación familiar</div>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.7 }}>
                                Comparte este código con tu hijo/a para que pueda unirse a tu familia. El código caduca cuando generas uno nuevo.
                            </p>

                            {displayCode ? (
                                <>
                                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                                        <div className="family-code" style={{ display: 'inline-block', marginBottom: 16 }}>{displayCode}</div>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <QRCode
                                                value={`focusfamily://link/${displayCode}`}
                                                size={150}
                                                bgColor="transparent"
                                                fgColor="#a78bfa"
                                                level="H"
                                            />
                                        </div>
                                    </div>
                                    <button className="btn btn-ghost" style={{ width: '100%' }} onClick={handleRegenCode}>
                                        🔄 Generar nuevo código
                                    </button>
                                </>
                            ) : (
                                <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleRegenCode}>
                                    🔑 Generar código de vinculación
                                </button>
                            )}

                            {/* Family members */}
                            {familyMembers.length > 0 && (
                                <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>👥 Miembros vinculados</div>
                                    {familyMembers.map(m => (
                                        <div key={m.uid} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                                            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                                                {m.role === 'teen' ? '🎒' : '👨‍👩‍👦'}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 13, fontWeight: 700 }}>{m.name}</div>
                                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.email}</div>
                                            </div>
                                            <span className={`pill pill-${m.role === 'teen' ? 'purple' : 'green'}`} style={{ marginLeft: 'auto' }}>
                                                {m.role === 'teen' ? 'Alumno' : 'Padre'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TEEN: enter link code */}
                    {userRole === 'teen' && (
                        <div className="card">
                            <div className="card-title">🤝 Vinculación familiar</div>

                            {isLinked ? (
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 12, marginBottom: 16 }}>
                                        <span style={{ fontSize: 24 }}>✅</span>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 800 }}>Familia vinculada</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Tu cuenta está conectada a la cuenta de tus padres.</div>
                                        </div>
                                    </div>
                                    {/* Family members */}
                                    {familyMembers.length > 0 && (
                                        <>
                                            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>👥 Tu familia</div>
                                            {familyMembers.map(m => (
                                                <div key={m.uid} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                                                        {m.role === 'teen' ? '🎒' : '👨‍👩‍👦'}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: 13, fontWeight: 700 }}>{m.name}</div>
                                                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.role === 'parent' ? 'Padre/Madre' : 'Hermano/a'}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.7 }}>
                                        Pide a tus padres el <strong style={{ color: 'var(--text)' }}>código de 6 letras</strong> que aparece en su perfil e introdúcelo aquí para vincular tu cuenta.
                                    </p>
                                    <form onSubmit={handleLinkFamily} style={{ display: 'flex', gap: 10 }}>
                                        <input
                                            className="form-input mono"
                                            placeholder="CÓDIGO"
                                            value={codeInput}
                                            onChange={e => setCodeInput(e.target.value.toUpperCase().slice(0, 6))}
                                            maxLength={6}
                                            style={{ flex: 1, textAlign: 'center', fontSize: 20, letterSpacing: 8, fontWeight: 700 }}
                                        />
                                        <button type="submit" className="btn btn-primary" disabled={codeInput.length !== 6 || linkLoading}>
                                            {linkLoading ? '…' : '🔗'}
                                        </button>
                                    </form>
                                    {(linkError || codeResult) && (
                                        <div style={{ marginTop: 10, padding: '10px 14px', background: codeResult ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)', border: `1px solid ${codeResult ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}`, borderRadius: 10, fontSize: 13, fontWeight: 700, color: codeResult ? 'var(--accent3)' : '#fb7185' }}>
                                            {codeResult || linkError}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* Ethics card */}
                    <div className="card" style={{ borderColor: 'rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.04)' }}>
                        <div className="card-title">🛡️ Diseño ético</div>
                        <ul style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 2, paddingLeft: 20 }}>
                            <li>Los hijos/as no son monitorizados sin su conocimiento</li>
                            <li>Los datos de estudio son del alumno, no de los padres</li>
                            <li>Sin publicidad ni perfil psicológico</li>
                            <li>El alumno puede desvincularse cuando quiera</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
