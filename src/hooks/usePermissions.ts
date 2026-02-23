import { useAuthStore } from '@store/authStore';

/**
 * ⚠️ ADVERTENCIA: Este hook está en modo "stub temporal".
 * hasRole() y hasPermission() SIEMPRE retornan true si el usuario
 * tiene un role_id asignado, sin verificar el rol específico.
 *
 * TODO: Implementar verificación real cuando la tabla `roles` esté
 * disponible en el profile (ej: profile.role_name o join con roles).
 */
export const usePermissions = () => {
    const { profile } = useAuthStore();

    const hasRole = (roleName: string): boolean => {
        if (!profile?.role_id) return false;
        // STUB: Sin acceso al nombre del rol desde el profile actual.
        // Retorna true para cualquier rol asignado.
        // TODO: comparar con profile.role?.name cuando esté disponible.
        void roleName;
        return true;
    };

    const hasPermission = (requiredPermission: string): boolean => {
        if (!profile?.role_id) return false;
        // STUB: Sin tabla de permisos implementada aún.
        // TODO: verificar contra permissions JSON del rol.
        void requiredPermission;
        return true;
    };

    const isAdmin = (): boolean => {
        return hasRole('admin');
    };

    const isQualityManager = (): boolean => {
        return hasRole('quality_manager');
    };

    const isProjectManager = (): boolean => {
        return hasRole('project_manager');
    };

    const isAuditor = (): boolean => {
        return hasRole('auditor');
    };

    return {
        hasRole,
        hasPermission,
        isAdmin,
        isQualityManager,
        isProjectManager,
        isAuditor,
    };
};
