import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';

const Header = ({ title, subtitle, searchPlaceholder, searchValue, onSearchChange, actions }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userAvatar = user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256";
  const userDisplayName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user?.email?.split('@')[0] || 'Operator');

  return (
    <header className="sticky top-0 z-40 w-full px-6 py-4 bg-[var(--bg-app)]/80 backdrop-blur-md border-b border-[var(--border-color)] flex justify-between items-center transition-all duration-200">
      <div className="flex items-center gap-6">
        <div>
          <h2 className="font-title-lg text-title-lg text-[var(--color-text-primary)]">{title}</h2>
          {subtitle && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{subtitle}</p>}
        </div>

        {searchPlaceholder && (
          <div className="relative w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-[20px]">
              search
            </span>
            <input
              className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full pl-10 pr-4 py-2 text-body-sm w-full focus:ring-1 focus:ring-[#ff8a00] focus:border-[#ff8a00] outline-none transition-all text-[var(--color-text-primary)]"
              placeholder={searchPlaceholder}
              type="text"
              value={searchValue || ''}
              onChange={onSearchChange}
            />
          </div>
        )}
      </div>
 
      <div className="flex items-center gap-4">
        {actions}
        
        <div className="flex items-center gap-2 ml-4">
          <button 
            onClick={toggleTheme}
            className="flex items-center justify-center h-9 w-9 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm text-[var(--color-text-primary)] hover:border-[#ff8a00] hover:text-[#ff8a00] transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 700" }}>
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          
          <button className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-all relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#ff8a00] rounded-full"></span>
          </button>
          <button className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-all">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
        </div>

        {/* Clickable Profile Dropdown */}
        <div className="relative group ml-2">
          <button className="flex items-center gap-2 w-10 h-10 rounded-full border border-[var(--border-color)] overflow-hidden focus:outline-none cursor-pointer">
            <img
              className="w-full h-full object-cover"
              src={userAvatar}
              alt="User Avatar"
            />
          </button>
          {/* Outer hover wrapper to bridge the gap between button and menu */}
          <div className="absolute right-0 top-full pt-1.5 w-48 hidden group-hover:block z-50">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg shadow-xl py-1">
              <div className="px-4 py-2 border-b border-[var(--border-color)]/30">
                <p className="text-xs text-[var(--color-text-muted)]">Logged in as</p>
                <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">{userDisplayName}</p>
              </div>
              
              <Link
                to="/profile"
                className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--bg-app)] flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">account_circle</span>
                My Profile
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[var(--bg-app)] flex items-center gap-2 transition-colors cursor-pointer border-t border-[var(--border-color)]/20"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
