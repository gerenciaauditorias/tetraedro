import { useAuth } from '@hooks/useAuth';
import {
    TrendingUp,
    TrendingDown,
    AlertCircle,
    CheckCircle2,
    Clock,
    Users,
    FolderKanban,
    ClipboardCheck,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Datos de ejemplo para gráficos
const projectsData = [
    { name: 'Ene', completados: 4, enProgreso: 8, retrasados: 2 },
    { name: 'Feb', completados: 6, enProgreso: 7, retrasados: 1 },
    { name: 'Mar', completados: 5, enProgreso: 9, retrasados: 3 },
    { name: 'Abr', completados: 8, enProgreso: 6, retrasados: 2 },
];

const kpiData = [
    { name: 'Satisfacción Cliente', value: 92, maxValue: 100, unit: '%' },
    { name: 'Cumplimiento Plazos', value: 88, maxValue: 100, unit: '%' },
    { name: 'ROI Proyectos', value: 15, maxValue: 100, unit: '%' },
    { name: 'Horas Capacitación', value: 35, maxValue: 40, unit: 'h' },
];

const statusData = [
    { name: 'Completados', value: 23, color: '#22c55e' },
    { name: 'En Progreso', value: 30, color: '#3b82f6' },
    { name: 'Retrasados', value: 8, color: '#ef4444' },
    { name: 'Planificados', value: 12, color: '#f59e0b' },
];

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-card p-6">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                    {title}
                </p>
                <p className="mt-2 text-3xl font-bold text-secondary-900 dark:text-white">
                    {value}
                </p>
                <div className={`mt-2 flex items-center text-sm ${trend === 'up' ? 'text-success-600' : 'text-danger-600'}`}>
                    {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                    <span>{change}</span>
                </div>
            </div>
            <div className={`p-3 rounded-full ${trend === 'up' ? 'bg-success-100 dark:bg-success-900/20' : 'bg-danger-100 dark:bg-danger-900/20'}`}>
                <Icon className={`w-6 h-6 ${trend === 'up' ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`} />
            </div>
        </div>
    </div>
);

export const Dashboard = () => {
    const { profile } = useAuth();

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-soft p-6 text-white">
                <h1 className="text-2xl font-bold">
                    ¡Bienvenido, {profile?.full_name || 'Usuario'}!
                </h1>
                <p className="mt-2 text-primary-100">
                    Aquí está el resumen de tu sistema de gestión
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Proyectos Activos"
                    value="30"
                    change="+12% vs mes anterior"
                    icon={FolderKanban}
                    trend="up"
                />
                <StatCard
                    title="Auditorías Pendientes"
                    value="5"
                    change="-20% vs mes anterior"
                    icon={ClipboardCheck}
                    trend="up"
                />
                <StatCard
                    title="No Conformidades"
                    value="8"
                    change="+3 nuevas"
                    icon={AlertCircle}
                    trend="down"
                />
                <StatCard
                    title="Tareas Completadas"
                    value="142"
                    change="+8% esta semana"
                    icon={CheckCircle2}
                    trend="up"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Projects Chart */}
                <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-card p-6">
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                        Estado de Proyectos
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={projectsData}>
                            <CartesianGrid strokeDasharray="3 3" className="dark:stroke-secondary-700" />
                            <XAxis dataKey="name" className="dark:text-secondary-400" />
                            <YAxis className="dark:text-secondary-400" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--tooltip-bg)',
                                    border: '1px solid var(--tooltip-border)'
                                }}
                            />
                            <Bar dataKey="completados" fill="#22c55e" name="Completados" />
                            <Bar dataKey="enProgreso" fill="#3b82f6" name="En Progreso" />
                            <Bar dataKey="retrasados" fill="#ef4444" name="Retrasados" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Status Distribution */}
                <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-card p-6">
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                        Distribución de Proyectos
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* KPIs and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* KPIs */}
                <div className="lg:col-span-2 bg-white dark:bg-secondary-800 rounded-lg shadow-card p-6">
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                        KPIs Principales
                    </h3>
                    <div className="space-y-4">
                        {kpiData.map((kpi) => (
                            <div key={kpi.name}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                                        {kpi.name}
                                    </span>
                                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                                        {kpi.value}{kpi.unit}
                                    </span>
                                </div>
                                <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                                    <div
                                        className="bg-primary-600 h-2 rounded-full transition-all"
                                        style={{ width: `${Math.min((kpi.value / kpi.maxValue) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-card p-6">
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                        Actividad Reciente
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="p-2 bg-success-100 dark:bg-success-900/20 rounded-lg">
                                <CheckCircle2 className="w-4 h-4 text-success-600 dark:text-success-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-secondary-900 dark:text-white">
                                    Proyecto completado
                                </p>
                                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                                    Implementación ISO 9001
                                </p>
                                <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">
                                    Hace 2 horas
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="p-2 bg-warning-100 dark:bg-warning-900/20 rounded-lg">
                                <Clock className="w-4 h-4 text-warning-600 dark:text-warning-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-secondary-900 dark:text-white">
                                    Auditoría programada
                                </p>
                                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                                    Auditoría interna Q1
                                </p>
                                <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">
                                    Hace 5 horas
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="p-2 bg-danger-100 dark:bg-danger-900/20 rounded-lg">
                                <AlertCircle className="w-4 h-4 text-danger-600 dark:text-danger-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-secondary-900 dark:text-white">
                                    Nueva no conformidad
                                </p>
                                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                                    NC-2026-015
                                </p>
                                <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">
                                    Hace 1 día
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                                <Users className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-secondary-900 dark:text-white">
                                    Nuevo miembro del equipo
                                </p>
                                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                                    Juan Pérez - Auditor
                                </p>
                                <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">
                                    Hace 2 días
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-card p-6">
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                    Próximas Auditorías
                </h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                                    Código
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                                    Estado
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900 dark:text-white">
                                    AUD-2026-001
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-700 dark:text-secondary-300">
                                    Auditoría Interna Q1
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-700 dark:text-secondary-300">
                                    Interna
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-700 dark:text-secondary-300">
                                    15/02/2026
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-400">
                                        Planificada
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900 dark:text-white">
                                    AUD-2026-002
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-700 dark:text-secondary-300">
                                    Auditoría ISO 9001
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-700 dark:text-secondary-300">
                                    Externa
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-700 dark:text-secondary-300">
                                    28/02/2026
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400">
                                        En Progreso
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
