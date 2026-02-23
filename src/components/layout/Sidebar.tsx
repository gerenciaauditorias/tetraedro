import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    GitBranch,
    FolderKanban,
    ClipboardCheck,
    Shield,
    TrendingUp,
    FileText,
    Settings,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
    {
        name: 'Dashboard',
        icon: LayoutDashboard,
        path: '/dashboard'
    },
    {
        name: 'Procesos',
        icon: GitBranch,
        path: '/processes'
    },
    {
        name: 'Proyectos',
        icon: FolderKanban,
        path: '/projects'
    },
    {
        name: 'Auditorías',
        icon: ClipboardCheck,
        path: '/audits'
    },
    {
        name: 'Calidad',
        icon: Shield,
        path: '/quality',
        submenu: [
            { name: 'No Conformidades', path: '/quality/non-conformities' },
            { name: 'Acciones Correctivas', path: '/quality/corrective-actions' },
            { name: 'Riesgos', path: '/quality/risks' },
        ]
    },
    {
        name: 'KPIs / BSC',
        icon: TrendingUp,
        path: '/kpis'
    },
    {
        name: 'Documentos',
        icon: FileText,
        path: '/documents'
    },
    {
        name: 'Configuración',
        icon: Settings,
        path: '/settings'
    },
];

export const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

    const toggleSubmenu = (menuName: string) => {
        setExpandedMenus(prev =>
            prev.includes(menuName)
                ? prev.filter(name => name !== menuName)
                : [...prev, menuName]
        );
    };

    return (
        <aside
            className={`
        ${isCollapsed ? 'w-20' : 'w-64'} 
        bg-white dark:bg-secondary-800 
        border-r border-secondary-200 dark:border-secondary-700 
        transition-all duration-300 
        flex flex-col
        h-screen sticky top-0
      `}
        >
            {/* Collapse Toggle */}
            <div className="flex items-center justify-end p-4 border-b border-secondary-200 dark:border-secondary-700">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
                    aria-label={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                    ) : (
                        <ChevronLeft className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {menuItems.map((item) => (
                    <div key={item.name}>
                        {item.submenu ? (
                            // Items con submenu: botón que solo expande/colapsa
                            <button
                                onClick={() => toggleSubmenu(item.name)}
                                className={`
                flex items-center w-full px-3 py-2.5 rounded-lg transition-colors
                text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700
                ${isCollapsed ? 'justify-center' : 'justify-start'}
              `}
                            >
                                <item.icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
                                {!isCollapsed && (
                                    <span className="font-medium">{item.name}</span>
                                )}
                            </button>
                        ) : (
                            // Items sin submenu: NavLink estándar
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => `
                flex items-center px-3 py-2.5 rounded-lg transition-colors
                ${isActive
                                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                        : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700'
                                    }
                ${isCollapsed ? 'justify-center' : 'justify-start'}
              `}
                            >
                                <item.icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
                                {!isCollapsed && (
                                    <span className="font-medium">{item.name}</span>
                                )}
                            </NavLink>
                        )}

                        {/* Submenu */}
                        {!isCollapsed && item.submenu && expandedMenus.includes(item.name) && (
                            <div className="ml-8 mt-1 space-y-1">
                                {item.submenu.map((subItem) => (
                                    <NavLink
                                        key={subItem.path}
                                        to={subItem.path}
                                        className={({ isActive }) => `
                      block px-3 py-2 rounded-lg text-sm transition-colors
                      ${isActive
                                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                                : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700'
                                            }
                    `}
                                    >
                                        {subItem.name}
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* Footer */}
            {!isCollapsed && (
                <div className="p-4 border-t border-secondary-200 dark:border-secondary-700">
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 text-center">
                        TETRAEDRO v3.0
                    </p>
                </div>
            )}
        </aside>
    );
};
