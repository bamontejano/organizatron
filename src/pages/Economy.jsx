import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const REWARDS_CATALOG = [];

export default function Economy() {
    const { focos, loans, takeLoan, redeemReward } = useApp();

    const [loanAmount, setLoanAmount] = useState('');
    const [msg, setMsg] = useState('');

    const show = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

    const handleLoan = (e) => {
        e.preventDefault();
        const n = parseInt(loanAmount, 10);
        if (!n || n <= 0) { show('❌ cantidad inválida'); return; }
        takeLoan(n);
        setLoanAmount('');
        show(`✅ Préstamo de ${n} Focos solicitado`);
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <div className="page-title">🪙 Economía</div>
                    <div className="page-subtitle">Tu cartera de Focos y bazar de recompensas</div>
                </div>
            </div>

            {/* Wallet header */}
            <div className="economy-header">
                <span className="wallet-icon">💰</span>
                <div>
                    <div className="wallet-balance">{focos}</div>
                    <div className="wallet-label">Focos disponibles</div>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginLeft: 'auto' }}>
                    <div style={{ textAlign: 'center', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', padding: '10px 20px', borderRadius: 12 }}>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 24, fontWeight: 700, color: '#fb7185' }}>{loans}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Préstamo</div>
                    </div>
                </div>
            </div>

            {msg && (
                <div style={{ padding: '12px 16px', borderRadius: 12, background: msg.startsWith('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)', border: `1px solid ${msg.startsWith('✅') ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}`, marginBottom: 16, fontSize: 13, fontWeight: 700 }}>
                    {msg}
                </div>
            )}

            <div className="grid-2" style={{ gap: 20, marginBottom: 24 }}>
                {/* Loan */}
                <div className="card">
                    <div className="card-title">💳 Préstamo familiar</div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.6 }}>Pide un préstamo de Focos a cuenta de trabajo futuro. Se devuelve con estudio o tareas del hogar.</p>
                    <form onSubmit={handleLoan} style={{ display: 'flex', gap: 10 }}>
                        <input
                            type="number"
                            className="form-input"
                            placeholder="Cantidad a pedir"
                            value={loanAmount}
                            onChange={e => setLoanAmount(e.target.value)}
                            min="1"
                        />
                        <button type="submit" className="btn btn-ghost" style={{ flexShrink: 0 }}>Pedir</button>
                    </form>
                    <div style={{ marginTop: 14, fontSize: 12, color: 'var(--text-muted)' }}>Préstamo pendiente: <strong style={{ color: '#fb7185', fontFamily: "'Space Mono',monospace" }}>{loans} 🔆</strong></div>
                </div>
            </div>

            {/* Rewards */}
            <div className="section-title">🎁 Bazar de Premios</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {REWARDS_CATALOG.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>🎁</div>
                        <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>El bazar está vacío</div>
                        <div style={{ fontSize: 14 }}>Tus padres pueden añadir recompensas conectándose desde su cuenta familiar.</div>
                    </div>
                ) : (
                    REWARDS_CATALOG.map(r => {
                        const canAfford = focos >= r.cost;
                        return (
                            <div key={r.id} className="reward-item" style={{ opacity: canAfford ? 1 : 0.6 }}>
                                <span className="reward-emoji">{r.emoji}</span>
                                <div className="reward-info">
                                    <div className="reward-name">{r.name}</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                                    <div className="reward-cost">{r.cost} 🔆</div>
                                    <span className={`reward-cat ${r.cat}`}>{r.cat}</span>
                                    <button
                                        className={`btn ${canAfford ? 'btn-primary' : 'btn-ghost'}`}
                                        style={{ fontSize: 12, padding: '6px 14px' }}
                                        disabled={!canAfford}
                                        onClick={() => { if (redeemReward(r.id, r.name, r.cost)) show(`🎉 "${r.name}" canjeado`); }}
                                    >
                                        {canAfford ? 'Canjear' : 'Sin Focos'}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div >
    );
}
