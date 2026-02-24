/**
 * AppContext.jsx
 * Global state powered by Firebase Auth + Firestore.
 *
 * Data flow:
 *  onAuthChange → subscribe to /users/{uid} → subscribe to /families/{familyId}
 *  Also subscribes to /planner/{uid} (blocks), /pactos, and /sessions.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthChange, logoutUser } from '../services/authService';
import {
    subscribeToUserProfile,
    subscribeToFamily,
    subscribeToPactos,
    subscribeToBlocks,
    subscribeToSessions,
    updateUserProfile,
    addFocosToUser,
    linkTeenToFamily,
    regenerateLinkCode,
    createFamily,
    createPacto,
    updatePacto,
    saveBlocks,
    logStudySession,
} from '../services/firestoreService';

const AppContext = createContext();

export function AppProvider({ children }) {
    // ── Auth & Profile ────────────────────────────────────────────────────────
    const [authUser, setAuthUser] = useState(undefined); // undefined = loading
    const [profile, setProfile] = useState(null);      // /users/{uid}
    const [family, setFamily] = useState(null);      // /families/{familyId}
    const [pactos, setPactos] = useState([]);        // /pactos (filtered by familyId)
    const [blocks, setBlocks] = useState([]);        // /planner/{uid}
    const [sessions, setSessions] = useState([]);        // /sessions (filtered by uid)
    const [loading, setLoading] = useState(true);

    // ── Classroom & UI State ──────────────────────────────────────────────────
    const [isClassroomLinked, setIsClassroomLinked] = useState(false);
    const [classroomTasks, setClassroomTasks] = useState([]);
    const [linkError, setLinkError] = useState('');
    const [linkLoading, setLinkLoading] = useState(false);

    // ── Subscriptions ─────────────────────────────────────────────────────────
    useEffect(() => {
        let unsubProfile = null;
        let unsubFamily = null;
        let unsubPactos = null;
        let unsubBlocks = null;
        let unsubSessions = null;

        const unsubAuth = onAuthChange(async (firebaseUser) => {
            setAuthUser(firebaseUser);

            // Clean up previous subscriptions
            if (unsubProfile) unsubProfile();
            if (unsubFamily) unsubFamily();
            if (unsubPactos) unsubPactos();
            if (unsubBlocks) unsubBlocks();
            if (unsubSessions) unsubSessions();

            if (!firebaseUser) {
                setProfile(null);
                setFamily(null);
                setPactos([]);
                setBlocks([]);
                setSessions([]);
                setLoading(false);
                return;
            }

            // 1. Subscribe to user profile (real-time)
            unsubProfile = subscribeToUserProfile(firebaseUser.uid, (profileData) => {
                setProfile(profileData);

                // 2. If user has a familyId, subscribe to family & pactos
                if (profileData.familyId) {
                    if (unsubFamily) unsubFamily();
                    unsubFamily = subscribeToFamily(profileData.familyId, (familyData) => {
                        setFamily(familyData);
                    });

                    if (unsubPactos) unsubPactos();
                    unsubPactos = subscribeToPactos(profileData.familyId, (pactosData) => {
                        setPactos(pactosData);
                    });
                } else {
                    setFamily(null);
                    setPactos([]);
                }
                setLoading(false);
            });

            // 3. Subscribe to blocks (real-time)
            unsubBlocks = subscribeToBlocks(firebaseUser.uid, (blocksData) => {
                setBlocks(blocksData);
            });

            // 4. Subscribe to sessions (real-time)
            unsubSessions = subscribeToSessions(firebaseUser.uid, (sessionsData) => {
                setSessions(sessionsData);
            });
        });

        return () => {
            unsubAuth();
            if (unsubProfile) unsubProfile();
            if (unsubFamily) unsubFamily();
            if (unsubPactos) unsubPactos();
            if (unsubBlocks) unsubBlocks();
            if (unsubSessions) unsubSessions();
        };
    }, []);

    // ── Derived values ────────────────────────────────────────────────────────
    const userRole = profile?.role ?? null;
    const focos = profile?.focos ?? 0;
    const savings = profile?.savings ?? 0;
    const loans = profile?.loans ?? 0;
    const level = profile?.level ?? 1;
    const streaks = profile?.streaks ?? { study: 0, perfect: 0 };
    const familyId = profile?.familyId ?? null;
    const isLinked = !!familyId;
    const linkCode = family?.linkCode ?? '';
    const familyMembers = (family?.members ?? []).filter(m => m.uid !== authUser?.uid);

    // ── Actions ───────────────────────────────────────────────────────────────

    const addFocos = useCallback(async (amount) => {
        if (!authUser) return;
        await addFocosToUser(authUser.uid, amount);

        const newTotal = focos + amount;
        const newLevel =
            newTotal >= 2000 ? 6 :
                newTotal >= 1000 ? 5 :
                    newTotal >= 500 ? 4 :
                        newTotal >= 250 ? 3 :
                            newTotal >= 100 ? 2 : 1;

        if (newLevel > level) {
            await updateUserProfile(authUser.uid, { level: newLevel });
        }
    }, [authUser, focos, level]);

    const transferToSavings = useCallback(async (amount) => {
        if (!authUser || amount > focos) return false;
        await updateUserProfile(authUser.uid, {
            focos: focos - amount,
            savings: savings + amount,
        });
        return true;
    }, [authUser, focos, savings]);

    const takeLoan = useCallback(async (amount) => {
        if (!authUser || amount <= 0 || amount > 200 || loans > 0) return false;
        await updateUserProfile(authUser.uid, {
            focos: focos + amount,
            loans: amount,
        });
        return true;
    }, [authUser, focos, loans]);

    const redeemReward = useCallback(async (_id, _name, cost) => {
        if (!authUser || focos < cost) return false;
        await addFocosToUser(authUser.uid, -cost);
        return true;
    }, [authUser, focos]);

    // ── Family Actions ────────────────────────────────────────────────────────
    const generateFamilyCode = useCallback(async () => {
        if (!authUser || !familyId) return;
        return await regenerateLinkCode(familyId);
    }, [authUser, familyId]);

    const linkFamily = useCallback(async (code) => {
        if (!authUser || !profile) return { success: false, error: 'No autenticado' };
        setLinkLoading(true);
        setLinkError('');
        const res = await linkTeenToFamily(authUser.uid, profile.displayName, profile.email, code);
        if (!res.success) setLinkError(res.error);
        setLinkLoading(false);
        return res;
    }, [authUser, profile]);

    const initFamily = useCallback(async () => {
        if (!authUser || !profile || familyId) return;
        await createFamily(authUser.uid, profile.email, profile.displayName);
    }, [authUser, profile, familyId]);

    // ── Pactos ───────────────────────────────────────────────────────────────
    const proposePacto = useCallback(async (pactData) => {
        if (!authUser || !familyId) return;
        await createPacto(familyId, authUser.uid, pactData);
    }, [authUser, familyId]);

    const acceptPacto = useCallback(async (pactoId) => {
        await updatePacto(pactoId, { status: 'active' });
    }, []);

    const updatePactoProgress = useCallback(async (pactoId, newProgress) => {
        await updatePacto(pactoId, { progress: newProgress });
    }, []);

    // ── Planner (Firestore) ──────────────────────────────────────────────────
    const addBlock = async (block) => {
        if (!authUser) return;
        const newBlocks = [...blocks, { ...block, id: Date.now() }];
        await saveBlocks(authUser.uid, newBlocks);
    };

    const updateBlock = async (updated) => {
        if (!authUser) return;
        const newBlocks = blocks.map(b => b.id === updated.id ? updated : b);
        await saveBlocks(authUser.uid, newBlocks);
    };

    const removeBlock = async (id) => {
        if (!authUser) return;
        const newBlocks = blocks.filter(b => b.id !== id);
        await saveBlocks(authUser.uid, newBlocks);
    };

    // ── Sessions ───────────────────────────────────────────────────────────────
    const logSession = useCallback(async (sessionData) => {
        if (!authUser) return;
        await logStudySession(authUser.uid, sessionData);
    }, [authUser]);

    // ── Classroom (Mock Sync) ──────────────────────────────────────────────────
    const syncClassroom = useCallback(async () => {
        setIsClassroomLinked(true);
        const mockTasks = [
            { id: 'c1', title: 'Ensayo Revolución Industrial', course: 'Historia', dueDate: 'Mañana', points: 25 },
            { id: 'c2', title: 'Ejercicios de Matrices', course: 'Matemáticas', dueDate: 'Viernes', points: 15 },
        ];
        setClassroomTasks(mockTasks);
        if (authUser) {
            const newBlocks = [
                ...blocks,
                { id: 'cb1', day: 'Miércoles', startTime: '16:00', endTime: '17:30', subject: 'Historia', type: 'study', task: 'Classroom: Ensayo', isClassroom: true }
            ];
            await saveBlocks(authUser.uid, newBlocks);
        }
        await addFocos(5);
    }, [authUser, blocks, addFocos]);

    const logout = useCallback(async () => {
        await logoutUser();
    }, []);

    const value = {
        authUser, profile, loading, userRole, focos, savings, loans, level, streaks,
        family, familyId, isLinked, linkCode, familyMembers, linkError, linkLoading,
        pactos, blocks, sessions,
        addFocos, transferToSavings, takeLoan, redeemReward,
        generateFamilyCode, linkFamily, initFamily,
        proposePacto, acceptPacto, updatePactoProgress,
        addBlock, updateBlock, removeBlock,
        logSession,
        isClassroomLinked, classroomTasks, syncClassroom,
        logout
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}
