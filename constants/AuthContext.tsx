import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  reload,
} from 'firebase/auth';
import {
  doc, setDoc, getDoc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from './firebase';

// ── Types ─────────────────────────────────────────────────────────────────────
export type UserProfile = {
  uid:       string;
  email:     string;
  username:  string;
  phone:     string;
  address:   string;
  bio:       string;
  dob:       string;
  createdAt: any;
  updatedAt: any;
};

type AuthContextType = {
  user:        User | null;
  profile:     UserProfile | null;
  isLoading:   boolean;
  signUp:      (email: string, password: string, extra: { username: string; phone: string }) => Promise<void>;
  logIn:       (email: string, password: string) => Promise<void>;
  logOut:      () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshUser: () => Promise<void>;
};

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,      setUser]      = useState<User | null>(null);
  const [profile,   setProfile]   = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Firestore profile for logged-in user
  const fetchProfile = useCallback(async (uid: string) => {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) setProfile(snap.data() as UserProfile);
    } catch (e) {
      console.error('fetchProfile error:', e);
    }
  }, []);

  // Listen for Firebase auth state — fires on login, logout, and app restart
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchProfile(firebaseUser.uid);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, [fetchProfile]);

  // Sign Up — creates Auth user + Firestore profile document
  const signUp = useCallback(async (
    email: string,
    password: string,
    extra: { username: string; phone: string }
  ) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const newProfile: UserProfile = {
      uid:       credential.user.uid,
      email:     email.toLowerCase(),
      username:  extra.username,
      phone:     extra.phone,
      address:   '',
      bio:       '',
      dob:       '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'users', credential.user.uid), newProfile);
    setProfile(newProfile);
  }, []);

  // Log In
  const logIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will fire and fetch the profile automatically
  }, []);

  // Log Out
  const logOut = useCallback(async () => {
    await signOut(auth);
    setProfile(null);
  }, []);

  // Update profile fields in Firestore
  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('No authenticated user');
    const ref = doc(db, 'users', user.uid);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
    setProfile((prev) => prev ? { ...prev, ...data } : prev);
  }, [user]);

  // Force reload the Firebase user (useful after first-tap login bug)
  const refreshUser = useCallback(async () => {
    if (auth.currentUser) {
      await reload(auth.currentUser);
      setUser({ ...auth.currentUser });
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user, profile, isLoading,
      signUp, logIn, logOut, updateProfile, refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}