import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, LayoutDashboard, ScanLine, BookOpen, TrendingUp, Settings, LogOut, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  user: any;
  onLogout: () => void;
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/scan', label: 'Scan Waste', icon: ScanLine },
  { path: '/guide', label: 'Sorting Guide', icon: BookOpen },
  { path: '/impact', label: 'My Impact', icon: TrendingUp },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Layout({ children, user, onLogout }: LayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-primary-800 text-white transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex items-center gap-3 border-b border-primary-700">
          <Leaf className="w-8 h-8 text-accent-500" />
          <div>
            <h1 className="font-bold text-lg">EcoSort</h1>
            <p className="text-xs text-primary-200">Waste Sorting AI</p>
          </div>
          <button className="lg:hidden ml-auto" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-white/20 text-white' : 'text-primary-200 hover:bg-white/10'}`}>
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-700">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-primary-200 truncate">{user.email}</p>
            </div>
            <button onClick={onLogout} className="text-primary-200 hover:text-white" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)}><Menu className="w-6 h-6 text-gray-700" /></button>
          <Leaf className="w-6 h-6 text-accent-500" />
          <h1 className="font-bold text-primary-800">EcoSort</h1>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
