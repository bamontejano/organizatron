import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function PomodoroPage() {
    const { focos, addFocos, logSession } = useApp();
    const [secondsLeft, setSecondsLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [pomodoroNum, setPomodoroNum] = useState(1);
    const [completed, setCompleted] = useState(0);
    const [sessionFocos, setSessionFocos] = useState(0);
    const [interruptions, setInterruptions] = useState(0);
    const [subject, setSubject] = useState('📐 Matemáticas - Derivadas');
    const [emotion, setEmotion] = useState(null);
    const [interruptionLog, setInterruptionLog] = useState([]);
    const [showReward, setShowReward] = useState(false);
    const [rewardAmount, setRewardAmount] = useState(0);
    const intervalRef = useRef(null);

    const TOTAL = isBreak ? 5 * 60 : 25 * 60;
    const progress = ((TOTAL - secondsLeft) / TOTAL) * 440;
    const dashOffset = 440 - Math.min(progress, 440);

    const pad = (n) => n.toString().padStart(2, '0');
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setSecondsLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current);
                        setIsRunning(false);
                        handleComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning]);

    // Detect interruptions (visibility change)
    useEffect(() => {
        const handleVisibility = () => {
            if (document.hidden && isRunning) {
                setInterruptions(p => p + 1);
                setInterruptionLog(log => [...log, new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })]);
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);
        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, [isRunning]);

    const handleComplete = async () => {
        if (!isBreak) {
            // Recompensa aleatoria basada en el nivel de cumplimiento (interrupciones)
            let earned = 0;
            if (interruptions === 0) {
                // Sesión perfecta (oro): 12 a 18 focos
                earned = Math.floor(Math.random() * (18 - 12 + 1)) + 12;
            } else if (interruptions <= 2) {
                // Interrupciones menores (plata): 6 a 11 focos
                earned = Math.floor(Math.random() * (11 - 6 + 1)) + 6;
            } else {
                // Tantas interrupciones (bronce): 2 a 5 focos
                earned = Math.floor(Math.random() * (5 - 2 + 1)) + 2;
            }

            // Log to Firestore
            await logSession({
                subject,
                duration: 25, // Fixed pomodoro duration
                focosEarned: earned,
                emotion: null, // Set via the emotion grid later or handle here
                interrupted: interruptions > 0
            });

            // Local state updates for UI
            setSessionFocos(p => p + earned);
            setCompleted(p => p + 1);
            setPomodoroNum(p => p + 1);
            setIsBreak(true);
            setSecondsLeft(5 * 60);

            setRewardAmount(earned);
            setShowReward(true);
        } else {
            setIsBreak(false);
            setSecondsLeft(25 * 60);
            setInterruptions(0);
            setInterruptionLog([]);
        }
    };

    const toggleTimer = () => setIsRunning(p => !p);

    const resetTimer = () => {
        setIsRunning(false);
        setIsBreak(false);
        setSecondsLeft(25 * 60);
        setInterruptions(0);
        setInterruptionLog([]);
    };

    const subjects = [
        '📐 Matemáticas - Derivadas',
        '🔬 Física - Cinemática',
        '📖 Historia - Revolución Industrial',
        '🇬🇧 Inglés - Grammar',
        '🎨 Lengua - Análisis sintáctico',
    ];

    const emotions = [
        { key: 'genial', emoji: '😊', label: 'Genial' },
        { key: 'regular', emoji: '😐', label: 'Regular' },
        { key: 'costado', emoji: '😫', label: 'Costó' },
        { key: 'cansado', emoji: '😴', label: 'Cansado' },
        { key: 'frustrado', emoji: '😤', label: 'Frustrado' },
        { key: 'enfocado', emoji: '🧠', label: 'Enfocado' },
    ];

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <div className="page-title">⏱️ Modo Estudio</div>
                    <div className="page-subtitle">Técnica Pomodoro · 25 min enfoque / 5 min descanso</div>
                </div>
                <div className="focos-badge">
                    <span className="focos-icon">🔆</span>
                    <div>
                        <div className="focos-count">{focos}</div>
                        <div className="focos-label">FOCOS</div>
                    </div>
                </div>
            </div>

            <div className="grid-2" style={{ gap: 20 }}>
                {/* Timer Card */}
                <div className="pomodoro-card">
                    <div className="card-title" style={{ width: '100%', justifyContent: 'center' }}>Sesión activa</div>
                    <div className="timer-subject">{subject}</div>

                    <div className="timer-ring">
                        <svg width="160" height="160" viewBox="0 0 160 160">
                            <defs>
                                <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#7c3aed" />
                                    <stop offset="100%" stopColor="#f59e0b" />
                                </linearGradient>
                            </defs>
                            <circle cx="80" cy="80" r="70" />
                            <circle
                                className="progress"
                                cx="80" cy="80" r="70"
                                style={{ strokeDashoffset: dashOffset, stroke: 'url(#timerGrad)' }}
                            />
                        </svg>
                        <div className="timer-time">
                            <div className="timer-display-text">{pad(mins)}:{pad(secs)}</div>
                            <div className="timer-phase">{isBreak ? 'DESCANSO' : 'ENFOQUE'}</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-muted)', justifyContent: 'center' }}>
                        <span>🍅 Pomodoro <strong style={{ color: '#fb923c' }}>{pomodoroNum}</strong> de 4</span>
                        <span>|</span>
                        <span>💎 <strong style={{ color: 'var(--accent3)' }}>{interruptions} interrupciones</strong></span>
                    </div>

                    <div className="timer-controls">
                        <button className="btn btn-ghost" onClick={resetTimer}>↺ Reset</button>
                        <button className="btn btn-primary" onClick={toggleTimer}>
                            {isRunning ? '⏸ Pausar' : '▶ Iniciar'}
                        </button>
                    </div>
                </div>

                {/* Config + Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Config */}
                    <div className="card">
                        <div className="card-title">Configurar sesión</div>
                        <div style={{ marginBottom: 12 }}>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>MATERIA</div>
                            <select
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                className="form-input"
                                style={{ cursor: 'pointer' }}
                            >
                                {subjects.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Session stats */}
                    <div className="card">
                        <div className="card-title">Registro de sesión</div>
                        <div className="grid-2">
                            <div style={{ background: 'rgba(16,185,129,0.1)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 24, fontWeight: 900, color: 'var(--accent3)' }}>{completed}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, fontWeight: 600 }}>Pomodoros hoy</div>
                            </div>
                            <div style={{ background: 'rgba(245,158,11,0.1)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 24, fontWeight: 900, color: 'var(--focos)' }}>{sessionFocos}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, fontWeight: 600 }}>Focos ganados</div>
                            </div>
                        </div>
                        <div style={{ marginTop: 12, background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.15)', borderRadius: 10, padding: 12 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#fb7185', marginBottom: 6 }}>⚠️ Interrupciones</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                {interruptionLog.length === 0
                                    ? 'Sin interrupciones 💎'
                                    : interruptionLog.map((t, i) => <div key={i}>• {t}</div>)
                                }
                            </div>
                        </div>
                    </div>

                    {/* Emotion */}
                    <div className="card">
                        <div className="card-title">Emoción al terminar</div>
                        <div className="emotion-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                            {emotions.map(e => (
                                <div
                                    key={e.key}
                                    className={`emotion-btn${emotion === e.key ? ' selected' : ''}`}
                                    onClick={() => setEmotion(e.key)}
                                >
                                    {e.emoji}
                                    <span className="emotion-label">{e.label}</span>
                                </div>
                            ))}
                        </div>
                        {emotion && (
                            <button
                                className="btn btn-success"
                                style={{ width: '100%', marginTop: 10 }}
                                onClick={async () => {
                                    await addFocos(2);
                                    // Optionally update the last session with this emotion
                                    setEmotion(null);
                                }}
                            >
                                Guardar (+2 🔆)
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showReward && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.5, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: 'spring', bounce: 0.6 }}
                            style={{
                                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                                padding: '40px', borderRadius: '24px', textAlign: 'center',
                                border: '2px solid rgba(139, 92, 246, 0.5)',
                                boxShadow: '0 20px 50px rgba(139, 92, 246, 0.4)',
                                maxWidth: '90%', width: '400px'
                            }}
                        >
                            <motion.div
                                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                style={{ fontSize: '64px', marginBottom: '20px' }}
                            >
                                🎁
                            </motion.div>
                            <h2 style={{ color: 'white', margin: '0 0 10px 0', fontSize: '24px' }}>¡Pomodoro completado!</h2>
                            <p style={{ color: '#a5b4fc', marginBottom: '30px', fontSize: '15px' }}>Tu nivel de enfoque determinó esta recompensa...</p>

                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.8, type: 'spring', bounce: 0.7 }}
                                style={{
                                    fontSize: '56px', fontWeight: '900', color: '#fbbf24',
                                    textShadow: '0 0 30px rgba(251, 191, 36, 0.6)',
                                    marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                                }}
                            >
                                +{rewardAmount} <span style={{ fontSize: '36px' }}>🔆</span>
                            </motion.div>

                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', fontSize: '18px', padding: '14px', background: 'linear-gradient(90deg, #8b5cf6, #d946ef)', border: 'none', color: 'white', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                                onClick={() => setShowReward(false)}
                            >
                                Reclamar Focos
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
