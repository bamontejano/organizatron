import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw, Shield, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function StudyMode({ task, onClose, onFinish }) {
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
    const [isActive, setIsActive] = useState(false);
    const { addFocos } = useApp();

    const handleFinished = () => {
        addFocos(15); // Perfect block reward
        if (onFinish) onFinish();
    };

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
            setIsActive(false);
            handleFinished();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-bg/95 backdrop-blur-xl flex items-center justify-center p-6"
        >
            <div className="max-w-md w-full flex flex-col items-center gap-12">
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                        <Shield size={16} />
                        <span className="text-xs font-black uppercase tracking-widest">Focus Mode Activo</span>
                    </div>
                    <h2 className="text-4xl font-black mb-2">{task || 'Sesión de Estudio'}</h2>
                    <p className="text-dim">Mantén la concentración para ganar 15 Focos</p>
                </div>

                {/* Timer Circle */}
                <div className="relative w-72 h-72 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle
                            cx="144"
                            cy="144"
                            r="130"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-white/5"
                        />
                        <motion.circle
                            cx="144"
                            cy="144"
                            r="130"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray="816.8"
                            animate={{ strokeDashoffset: 816.8 - (816.8 * progress) / 100 }}
                            transition={{ duration: 0.5, ease: "linear" }}
                            className="text-primary"
                        />
                    </svg>
                    <div className="text-center relative z-10">
                        <h3 className="text-6xl font-black font-mono tracking-tighter mb-1">
                            {formatTime(timeLeft)}
                        </h3>
                        <div className="flex items-center justify-center gap-2 text-primary">
                            <Clock size={16} />
                            <span className="text-sm font-bold">POMODORO 1/4</span>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setTimeLeft(25 * 60)}
                        className="p-4 rounded-2xl bg-white/5 text-dim hover:text-white transition-colors"
                    >
                        <RotateCcw size={24} />
                    </button>
                    <button
                        onClick={() => setIsActive(!isActive)}
                        className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/40 focus-pulse hover:scale-105 transition-transform"
                    >
                        {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                    </button>
                    <button
                        onClick={onClose}
                        className="p-4 rounded-2xl bg-white/5 text-dim hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Info label */}
                <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl flex items-start gap-3">
                    <Shield className="text-orange-400 mt-1 flex-shrink-0" size={18} />
                    <p className="text-xs text-orange-200/80 leading-relaxed italic">
                        El sistema está registrando tu presencia. Evita abrir redes sociales para obtener el bonus de bloqueo perfecto.
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
