import { useAuth } from '../../contexts/AuthContext';
import { Menu, LogOut, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { debugApi } from '../../utils/api-client';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-gray-900 dark:text-white">API Testing Tool</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
            </button>
            <button
              onClick={async () => {
                try {
                  const res = await debugApi.echo({ now: Date.now() });
                  // show a quick feedback
                  // eslint-disable-next-line no-alert
                  alert('Debug echo OK — check console for details');
                  console.log('[DEBUG ECHO]', res.data);
                } catch (err) {
                  // eslint-disable-next-line no-alert
                  alert('Debug echo failed — see console');
                  console.error('[DEBUG ECHO ERROR]', err);
                }
              }}
              className="ml-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Test API connectivity"
            >
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 12h-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 22v-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 12h4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
