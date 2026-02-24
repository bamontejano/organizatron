/**
 * authService.js
 * Handles Firebase Authentication: register, login, logout, current user.
 */
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase';
import { createUserProfile, createFamily } from './firestoreService';

/**
 * Register a new user.
 * @param {string} email
 * @param {string} password
 * @param {string} displayName
 * @param {'teen'|'parent'} role
 * @returns {Promise<{user, familyId?, linkCode?}>}
 */
export async function registerUser(email, password, displayName, role) {
    // 1. Create Firebase Auth user
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    // 2. Set display name
    await updateProfile(user, { displayName });

    let familyId = null;
    let linkCode = null;

    // 3. Create user profile in Firestore first (with familyId = null initially)
    await createUserProfile(user.uid, {
        email,
        displayName,
        role,
        familyId: null, // will be updated if it's a parent
    });

    // 4. If parent: create the family document
    // (createFamily automatically updates the user's document with the new familyId)
    if (role === 'parent') {
        const family = await createFamily(user.uid, email, displayName);
        familyId = family.familyId;
        linkCode = family.linkCode;
    }

    return { user, familyId, linkCode };
}

/**
 * Login existing user.
 */
export async function loginUser(email, password) {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
}

/**
 * Logout current user.
 */
export async function logoutUser() {
    await signOut(auth);
}

/**
 * Subscribe to auth state changes.
 * @param {function} callback
 * @returns unsubscribe function
 */
export function onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
}
