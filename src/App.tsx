import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@components/auth/ProtectedRoute';
import { MainLayout } from '@components/layout/MainLayout';
import { LoadingFallback } from '@components/common/LoadingFallback';
import { ToastConfig } from '@components/common/ToastConfig';

// Lazy load components
const Login = lazy(() => import('@components/auth/Login').then(module => ({ default: module.Login })));
const RegisterCompany = lazy(() => import('@pages/RegisterCompany').then(module => ({ default: module.RegisterCompany })));
const Dashboard = lazy(() => import('@pages/Dashboard').then(module => ({ default: module.Dashboard })));

function App() {
    return (
        <BrowserRouter>
            <ToastConfig />

            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register-company" element={<RegisterCompany />} />

                    {/* Protected Routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <MainLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />

                        {/* Placeholders para otras rutas */}
                        <Route path="processes" element={<div className="text-2xl font-bold">Procesos (En desarrollo)</div>} />
                        <Route path="projects" element={<div className="text-2xl font-bold">Proyectos (En desarrollo)</div>} />
                        <Route path="audits" element={<div className="text-2xl font-bold">Auditorías (En desarrollo)</div>} />
                        <Route path="quality/*" element={<div className="text-2xl font-bold">Calidad (En desarrollo)</div>} />
                        <Route path="kpis" element={<div className="text-2xl font-bold">KPIs (En desarrollo)</div>} />
                        <Route path="documents" element={<div className="text-2xl font-bold">Documentos (En desarrollo)</div>} />
                        <Route path="settings" element={<div className="text-2xl font-bold">Configuración (En desarrollo)</div>} />
                        <Route path="profile" element={<div className="text-2xl font-bold">Mi Perfil (En desarrollo)</div>} />
                    </Route>

                    {/* 404 */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
