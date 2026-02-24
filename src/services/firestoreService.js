/**
 * firestoreService.js
 * All Firestore operations: users, families, sessions.
 */
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
    onSnapshot,
    serverTimestamp,
    arrayUnion,
    increment,
} from 'firebase/firestore';
import { db } from '../firebase';

// ── HELPERS ──────────────────────────────────────────────────────────────────

/** Generate a random 6-char uppercase link code */
function generateLinkCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ── USER PROFILE ─────────────────────────────────────────────────────────────

/**
 * Create a user profile document in /users/{uid}
 */
export async function createUserProfile(uid, { email, displayName, role, familyId }) {
    await setDoc(doc(db, 'users', uid), {
        email,
        displayName,
        role,
        familyId: familyId || null,
        focos: role === 'teen' ? 50 : 0,
        savings: 0,
        loans: 0,
        level: 1,
        streaks: { study: 0, perfect: 0 },
        createdAt: serverTimestamp(),
    });
}

/**
 * Fetch a user profile once.
 * @returns {object|null}
 */
export async function getUserProfile(uid) {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? { uid, ...snap.data() } : null;
}

/**
 * Subscribe to real-time user profile changes.
 * @returns unsubscribe function
 */
export function subscribeToUserProfile(uid, callback) {
    return onSnapshot(doc(db, 'users', uid), (snap) => {
        if (snap.exists()) callback({ uid, ...snap.data() });
    });
}

/**
 * Update specific fields in the user profile.
 */
export async function updateUserProfile(uid, updates) {
    await updateDoc(doc(db, 'users', uid), updates);
}

/**
 * Add/remove Focos for a user (uses atomic increment).
 */
export async function addFocosToUser(uid, amount) {
    await updateDoc(doc(db, 'users', uid), {
        focos: increment(amount),
    });
}

// ── FAMILY ───────────────────────────────────────────────────────────────────

/**
 * Create a new family document. Called when a parent registers.
 * @returns {{ familyId, linkCode }}
 */
export async function createFamily(parentUid, parentEmail, parentName) {
    const familyId = `fam_${parentUid.substring(0, 8)}`;
    const linkCode = generateLinkCode();

    await setDoc(doc(db, 'families', familyId), {
        parentUid,
        parentEmail,
        parentName,
        linkCode,
        memberUids: [parentUid],
        members: [{
            uid: parentUid,
            role: 'parent',
            name: parentName,
            email: parentEmail,
            joinedAt: new Date().toISOString(),
        }],
        createdAt: serverTimestamp(),
    });

    // Also set familyId on the parent's user profile
    await updateDoc(doc(db, 'users', parentUid), { familyId });

    return { familyId, linkCode };
}

/**
 * Subscribe to real-time family data.
 */
export function subscribeToFamily(familyId, callback) {
    return onSnapshot(doc(db, 'families', familyId), (snap) => {
        if (snap.exists()) callback({ familyId, ...snap.data() });
    });
}

/**
 * Find a family by its linkCode.
 * @returns {{ familyId, ...familyData } | null}
 */
export async function findFamilyByCode(linkCode) {
    const q = query(
        collection(db, 'families'),
        where('linkCode', '==', linkCode.toUpperCase())
    );
    const snaps = await getDocs(q);
    if (snaps.empty) return null;
    const snap = snaps.docs[0];
    return { familyId: snap.id, ...snap.data() };
}

/**
 * Teen links to a family using a linkCode.
 * Updates both the family document and the teen's user profile.
 * @returns {{ success: boolean, familyId?: string, error?: string }}
 */
export async function linkTeenToFamily(teenUid, teenName, teenEmail, linkCode) {
    // 1. Find family by code
    const family = await findFamilyByCode(linkCode);
    if (!family) {
        return { success: false, error: 'Código no encontrado. Pide a tus padres que lo comprueben.' };
    }

    const { familyId } = family;

    // 2. Check teen isn't already linked to another family
    const userSnap = await getDoc(doc(db, 'users', teenUid));
    if (userSnap.exists() && userSnap.data().familyId) {
        return { success: false, error: 'Ya estás vinculado a una familia.' };
    }

    // 3. Add teen to family
    await updateDoc(doc(db, 'families', familyId), {
        memberUids: arrayUnion(teenUid),
        members: arrayUnion({
            uid: teenUid,
            role: 'teen',
            name: teenName,
            email: teenEmail,
            joinedAt: new Date().toISOString(),
        }),
    });

    // 4. Update teen's profile with familyId
    await updateDoc(doc(db, 'users', teenUid), { familyId });

    return { success: true, familyId };
}

/**
 * Regenerate the link code for a family (parent action).
 */
export async function regenerateLinkCode(familyId) {
    const newCode = generateLinkCode();
    await updateDoc(doc(db, 'families', familyId), { linkCode: newCode });
    return newCode;
}

// ── PACTOS ───────────────────────────────────────────────────────────────────

/**
 * Create a new pact proposal from a parent.
 */
export async function createPacto(familyId, parentUid, pactData) {
    const pactRef = doc(collection(db, 'pactos'));
    await setDoc(pactRef, {
        ...pactData,
        familyId,
        parentUid,
        status: 'pending', // pending, active, completed
        progress: 0,
        createdAt: serverTimestamp(),
    });
    return pactRef.id;
}

/**
 * Subscribe to all pacts for a family.
 */
export function subscribeToPactos(familyId, callback) {
    const q = query(
        collection(db, 'pactos'),
        where('familyId', '==', familyId)
    );
    return onSnapshot(q, (snaps) => {
        const pacts = snaps.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(pacts);
    });
}

/**
 * Update a pact (e.g., accept, add progress, complete).
 */
export async function updatePacto(pactoId, updates) {
    await updateDoc(doc(db, 'pactos', pactoId), updates);
}

// ── PLANNER (BLOCKS) ─────────────────────────────────────────────────────────

/**
 * Subscribe to blocks for a user.
 */
export function subscribeToBlocks(uid, callback) {
    return onSnapshot(doc(db, 'planner', uid), (snap) => {
        if (snap.exists()) {
            callback(snap.data().blocks || []);
        } else {
            callback([]);
        }
    });
}

/**
 * Save all blocks for a user.
 */
export async function saveBlocks(uid, blocks) {
    await setDoc(doc(db, 'planner', uid), {
        blocks,
        updatedAt: serverTimestamp()
    }, { merge: true });
}

// ── SESSIONS ─────────────────────────────────────────────────────────────────

/**
 * Log a completed study session.
 */
export async function logStudySession(uid, { subject, duration, focosEarned, emotion, interrupted }) {
    const sessionRef = doc(collection(db, 'sessions'));
    await setDoc(sessionRef, {
        userId: uid,
        subject,
        duration,          // minutes
        focosEarned,
        emotion: emotion || null,
        interrupted: interrupted || false,
        completedAt: serverTimestamp(),
    });

    // Update user stats
    await updateDoc(doc(db, 'users', uid), {
        focos: increment(focosEarned),
        'streaks.study': increment(1),
    });
}

/**
 * Get all sessions for a user in the last N days.
 */
export async function getUserSessions(uid, days = 365) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const q = query(
        collection(db, 'sessions'),
        where('userId', '==', uid),
        where('completedAt', '>=', since)
    );
    const snaps = await getDocs(q);
    return snaps.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Subscribe to all sessions for a user.
 */
export function subscribeToSessions(uid, callback) {
    const q = query(
        collection(db, 'sessions'),
        where('userId', '==', uid)
    );
    return onSnapshot(q, (snaps) => {
        const sessions = snaps.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(sessions);
    });
}
