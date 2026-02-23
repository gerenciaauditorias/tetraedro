import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Session } from '@supabase/supabase-js';
import type { UserProfile } from '@services/auth.service';

interface AuthState {
    user: User | null;
    session: Session | null;
    profile: UserProfile | null;
    isLoading: boolean;
    isAuthenticated: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setSession: (session: Session | null) => void;
    setProfile: (profile: UserProfile | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            session: null,
            profile: null,
            isLoading: true,
            isAuthenticated: false,

            setUser: (user) => set({
                user,
                isAuthenticated: !!user
            }),

            setSession: (session) => set({ session }),

            setProfile: (profile) => set({ profile }),

            setLoading: (loading) => set({ isLoading: loading }),

            logout: () => set({
                user: null,
                session: null,
                profile: null,
                isAuthenticated: false
            }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                session: state.session,
                profile: state.profile,
            }),
            // Recalcula isAuthenticated al rehidratar desde localStorage
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.isAuthenticated = !!state.user;
                    state.isLoading = false; // Nunca arrancar bloqueado tras rehidratación
                }
            },
        }
    )
);
