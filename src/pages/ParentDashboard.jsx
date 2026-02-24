import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import QRCode from 'qrcode.react';

const DIALOG_SUGGESTIONS = [
    { icon: '💬', text: '"¿Cómo te fue esta semana con los estudios? ¿Hubo algo que te costó más?"' },
    { icon: '🤝', text: '"Hemos acordado el pacto de mates. ¿Hay algún tema en el que necesites ayuda extra?"' },
    { icon: '🎉', text: '"Esta semana ganaste muchos Focos, ¿quieres celebrarlo este fin de semana?"' },
];

export default function ParentDashboard() {
    const { profile, family, familyMembers, isLinked, linkCode, generateFamilyCode } = useApp();
    const [copiedCode, setCopiedCode] = useState(false);
    const [generatingCode, setGeneratingCode] = useState(false);

    const teenMembers = familyMembers.filter(m => m.role === 'teen');
    const displayCode = linkCode;

    const copyCode = () => {
        if (displayCode) {
            navigator.clipboard.writeText(displayCode).catch(() => { });
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        }
    };

    const handleGenCode = async () => {
        setGeneratingCode(true);
        await generateFamilyCode();
        setGeneratingCode(false);
    };

    return (
        <div className="page">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <div style={{ fontSize: 12, color: '#a78bfa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>PANEL FAMILIAR</div>
                    <h1 style={{ fontSize: 26, fontWeight: 900 }}>Hola, familia 👨‍👩‍👦</h1>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <Link to="/pactos" className="btn btn-primary" style={{ fontSize: 13 }}>🤝 Gestionar pactos</Link>
                    <Link to="/rewards" className="btn btn-ghost" style={{ fontSize: 13 }}>🎁 Recompensas</Link>
                </div>
            </div>

            {/* Child overview — show all linked teens */}
            {teenMembers.length === 0 ? (
                <div className="card" style={{ marginBottom: 20, textAlign: 'center', padding: 40 }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>👨‍👩‍👦</div>
                    <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Sin hijos vinculados</div>
                    <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.7 }}>
                        Genera un código de vinculación y compártelo con tu hijo/a para que se una a la familia.
                    </div>
                    <Link to="/perfil" className="btn btn-primary">🔑 Ir a vinculación</Link>
                </div>
            ) : (
                teenMembers.map(teen => (
                    <div key={teen.uid} className="card" style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                            <div className="child-avatar">🎒</div>
                            <div>
                                <div style={{ fontSize: 18, fontWeight: 900 }}>{teen.name}</div>
                                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{teen.email}</div>
                            </div>
                            <span style={{ marginLeft: 'auto', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, color: 'var(--accent3)' }}>✅ Vinculado</span>
                        </div>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            <Link to="/pactos" className="btn btn-primary" style={{ fontSize: 13 }}>+ Nuevo pacto</Link>
                            <Link to="/ia" className="btn btn-ghost" style={{ fontSize: 13 }}>📊 Informes IA</Link>
                            <Link to="/focos-solidarios" className="btn btn-ghost" style={{ fontSize: 13 }}>🫶 Focos Solidarios</Link>
                        </div>
                    </div>
                ))
            )}

            <div className="grid-2" style={{ gap: 20, marginBottom: 20 }}>
                {/* Family code — use real linkCode from Firestore */}
                <div className="card">
                    <div className="card-title">🔗 Código de vinculación</div>
                    {displayCode ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                            <div style={{ background: 'white', padding: 14, borderRadius: 14 }}>
                                <QRCode value={`focusfamily://link/${displayCode}`} size={130} />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Código manual</div>
                                <div className="family-code" style={{ fontSize: 20, letterSpacing: 4 }}>{displayCode}</div>
                            </div>
                            <button className="btn btn-ghost" style={{ fontSize: 12, width: '100%' }} onClick={copyCode}>
                                {copiedCode ? '✅ Copiado' : '📋 Copiar código'}
                            </button>
                            <button className="btn btn-ghost" style={{ fontSize: 12, width: '100%', opacity: 0.7 }} onClick={handleGenCode} disabled={generatingCode}>
                                {generatingCode ? '⏳ Generando…' : '🔄 Nuevo código'}
                            </button>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>🔑</div>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.6 }}>Genera un código para vincular con tu hijo/a</div>
                            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleGenCode} disabled={generatingCode}>
                                {generatingCode ? '⏳ Generando…' : 'Generar código'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Dialogue suggestions */}
                <div className="card">
                    <div className="card-title">💬 Sugerencias de diálogo</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {DIALOG_SUGGESTIONS.map((d, i) => (
                            <div key={i} className="dialog-suggestion">
                                <span className="dialog-icon">{d.icon}</span>
                                <p className="dialog-text">{d.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Ethics card */}
            <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 16, padding: 20 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 28 }}>🛡️</span>
                    <div>
                        <div style={{ fontSize: 15, fontWeight: 900, marginBottom: 4 }}>Transparencia y privacidad</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                            Alejandro sabe exactamente qué datos compartes. No accedes a sus conversaciones privadas, solo a métricas de estudio que él autoriza. Refuerza la confianza con diálogo abierto.
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
