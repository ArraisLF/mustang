import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { useDarkMode } from '../context/useDarkMode';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="bg-primary dark:bg-dark-surface border-b border-primary-dark dark:border-dark-border sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <h1
          className="text-white text-xl font-bold cursor-pointer"
          onClick={() => navigate('/')}
        >
          Mustang
        </h1>

        {user ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-accent text-primary font-bold flex items-center justify-center text-sm">
                {user.firstName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
              </div>
              <svg
                className={`w-4 h-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-surface rounded-lg shadow-lg border border-gray-200 dark:border-dark-border py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-dark-border">
                  <p className="text-sm font-medium text-gray-900 dark:text-dark-text truncate">
                    {user.displayName || `${user.firstName} ${user.lastName}`}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-dark-text-secondary truncate">
                    {user.email}
                  </p>
                </div>

                <button
                  onClick={() => {
                    toggleDarkMode();
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-surface-hover transition-colors"
                >
                  <span className="flex items-center gap-2">
                    {darkMode ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    )}
                    {darkMode ? 'Modo claro' : 'Modo escuro'}
                  </span>
                  <div className={`w-9 h-5 rounded-full transition-colors ${darkMode ? 'bg-accent' : 'bg-gray-300'} relative`}>
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${darkMode ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </div>
                </button>

                <div className="border-t border-gray-100 dark:border-dark-border">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-surface-hover transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="text-white text-sm hover:opacity-80 transition-opacity"
          >
            Entrar
          </button>
        )}
      </div>
    </header>
  );
}
