import { supabase, handleSupabaseError } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    fullName: string;
}

export interface UserProfile {
    id: string;
    full_name: string | null;
    role_id: string | null;
    department: string | null;
    position: string | null;
    avatar_url: string | null;
    preferences: any;
    is_active: boolean;
}

class AuthService {
    /**
     * Iniciar sesión con email y contraseña
     */
    async login({ email, password }: LoginCredentials) {
        try {
            // Workaround: GoTrue bypass via RPC.
            // Se usa `any` porque el cliente Supabase no infiere Args correctamente para RPC custom.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: rpcData, error } = await (supabase as any).rpc('login', {
                email,
                password,
            }) as {
                data: { access_token: string; refresh_token: string | null; user: { id: string; email: string;[key: string]: unknown } };
                error: Error | null;
            };

            if (error) throw error;

            const data = rpcData;

            // Manually set the session in Supabase client
            const { error: sessionError } = await supabase.auth.setSession({
                access_token: data.access_token,
                refresh_token: data.refresh_token || '',
            });

            if (sessionError) throw sessionError;

            return {
                user: data.user as unknown as User,
                session: { access_token: data.access_token, refresh_token: data.refresh_token || '', user: data.user } as unknown as Session
            };
        } catch (error) {
            console.error('Login error:', error);
            throw new Error(handleSupabaseError(error));
        }
    }

    /**
     * Registrar nuevo usuario (solo admin puede crear usuarios)
     */
    async register({ email, password, fullName }: RegisterData) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

            if (error) throw error;

            return { user: data.user, session: data.session };
        } catch (error) {
            throw new Error(handleSupabaseError(error));
        }
    }

    /**
     * Cerrar sesión
     */
    async logout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            throw new Error(handleSupabaseError(error));
        }
    }

    /**
     * Recuperar contraseña
     */
    async resetPassword(email: string) {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;
        } catch (error) {
            throw new Error(handleSupabaseError(error));
        }
    }

    /**
     * Actualizar contraseña
     */
    async updatePassword(newPassword: string) {
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) throw error;
        } catch (error) {
            throw new Error(handleSupabaseError(error));
        }
    }

    /**
     * Obtener usuario actual
     */
    async getCurrentUser(): Promise<User | null> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            return user;
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            return null;
        }
    }

    /**
     * Obtener sesión actual
     */
    async getCurrentSession(): Promise<Session | null> {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            return session;
        } catch (error) {
            console.error('Error al obtener sesión:', error);
            return null;
        }
    }

    /**
     * Obtener perfil del usuario
     */
    async getUserProfile(userId: string): Promise<UserProfile | null> {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;

            return data;
        } catch (error) {
            console.error('Error al obtener perfil:', error);
            return null;
        }
    }

    /**
   * Actualizar perfil del usuario
   * TODO: Fix Supabase type inference issue
   */
    /*
    async updateUserProfile(userId: string, updates: Record<string, any>) {
      try {
        // Workaround: Use from().update() with explicit column selection
        const updateQuery = supabase
          .from('user_profiles')
          .update(updates);
        
        const { data, error } = await updateQuery
          .eq('id', userId)
          .select()
          .single();
  
        if (error) throw error;
  
        return data;
      } catch (error) {
        throw new Error(handleSupabaseError(error));
      }
    }
    */

    /**
     * Suscribirse a cambios de autenticación
     */
    onAuthStateChange(callback: (event: string, session: Session | null) => void) {
        return supabase.auth.onAuthStateChange((event: string, session: Session | null) => {
            callback(event, session);
        });
    }
}

export const authService = new AuthService();
