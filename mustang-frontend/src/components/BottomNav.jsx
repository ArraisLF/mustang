import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border z-50 md:hidden">
      <div className="max-w-2xl mx-auto flex justify-around items-center h-14">
        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 ${
            isActive('/') ? 'text-primary dark:text-accent' : 'text-gray-500 dark:text-dark-text-secondary'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs">Início</span>
        </button>

        <button
          onClick={() => navigate('/create')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 ${
            isActive('/create') ? 'text-primary dark:text-accent' : 'text-gray-500 dark:text-dark-text-secondary'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-xs">Publicar</span>
        </button>
      </div>
    </nav>
  );
}
