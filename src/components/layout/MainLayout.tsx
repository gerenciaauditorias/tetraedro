import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const MainLayout = () => {
    return (
        <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
