import { useEffect, useRef } from 'react';
import { authService } from '@services/auth.service';
import { useAuthStore } from '@store/authStore';
import type { LoginCredentials, RegisterData } from '@services/auth.service';

export const useAuth = () => {
    const {
        user,
        session,
        profile,
        isLoading,
        isAuthenticated,
        setUser,
        setSession,
        setProfile,
        setLoading,
        logout: logoutStore
    } = useAuthStore();

    // Ref para garantizar que initAuth solo se ejecuta una vez (evita race condition)
    const initialized = useRef(false);

    // Inicializar autenticación al montar
    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const initAuth = async () => {
            setLoading(true);

            try {
                const currentSession = await authService.getCurrentSession();
                const currentUser = await authService.getCurrentUser();

                if (currentUser && currentSession) {
                    setUser(currentUser);
                    setSession(currentSession);

                    // Obtener perfil
                    const userProfile = await authService.getUserProfile(currentUser.id);
                    setProfile(userProfile);
                } else {
                    // No hay sesión activa — aseguramos estado limpio
                    setUser(null);
                    setSession(null);
                    setProfile(null);
                }
            } catch (error) {
                console.error('Error al inicializar autenticación:', error);
                setUser(null);
                setSession(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        // Suscribirse a cambios de autenticación
        const { data: { subscription } } = authService.onAuthStateChange(
            async (event, session) => {
                console.log('Auth event:', event);

                // Solo actualizamos desde el listener si ya terminó la inicialización
                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    const userProfile = await authService.getUserProfile(session.user.id);
                    setProfile(userProfile);
                } else {
                    setProfile(null);
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = async (credentials: LoginCredentials) => {
        setLoading(true);
        try {
            const { user, session } = await authService.login(credentials);
            setUser(user);
            setSession(session);

            if (user) {
                const userProfile = await authService.getUserProfile(user.id);
                setProfile(userProfile);
            }

            return { user, session };
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: RegisterData) => {
        setLoading(true);
        try {
            const { user, session } = await authService.register(data);
            setUser(user);
            setSession(session);

            if (user) {
                const userProfile = await authService.getUserProfile(user.id);
                setProfile(userProfile);
            }

            return { user, session };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await authService.logout();
            logoutStore();
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (email: string) => {
        return authService.resetPassword(email);
    };

    const updatePassword = async (newPassword: string) => {
        return authService.updatePassword(newPassword);
    };

    return {
        user,
        session,
        profile,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        resetPassword,
        updatePassword,
    };
};
