import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import toast from 'react-hot-toast';

export const Login = () => {
    const navigate = useNavigate();
    const { login, isLoading, resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Por favor completa todos los campos');
            return;
        }

        try {
            await login({ email, password });
            toast.success('¡Bienvenido a TETRAEDRO!');
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.message || 'Error al iniciar sesión');
        }
    };

    const handleForgotPassword = async () => {
        const resetEmail = email.trim() || window.prompt('Ingresa tu correo electrónico:') || '';
        if (!resetEmail) return;

        try {
            await resetPassword(resetEmail);
            toast.success(`Se envió un correo de recuperación a ${resetEmail}`);
        } catch (error: any) {
            toast.error(error.message || 'Error al enviar el correo de recuperación');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-secondary-900 dark:to-secondary-800 px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                        TETRAEDRO
                    </h1>
                    <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
                        Sistema de Gestión Empresarial v3.0
                    </p>
                </div>

                <div className="bg-white dark:bg-secondary-800 shadow-card rounded-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
                            >
                                Correo electrónico
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-secondary-700 dark:border-secondary-600 dark:text-white"
                                placeholder="usuario@empresa.com"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
                            >
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-secondary-700 dark:border-secondary-600 dark:text-white"
                                placeholder="••••••••"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-secondary-700 dark:text-secondary-300"
                                >
                                    Recordarme
                                </label>
                            </div>

                            <div className="flex items-center">
                                <Link to="/register-company" className="text-sm font-medium text-blue-600 hover:text-blue-500 mr-4">
                                    Registrar empresa
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                                >
                                    ¿Olvidaste tu contraseña?
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-secondary-600 dark:text-secondary-400">
                    © 2026 TETRAEDRO v3.0. Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
};
