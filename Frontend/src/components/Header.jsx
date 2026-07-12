import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Header = ({ title, subtitle, searchPlaceholder, searchValue, onSearchChange, actions }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userAvatar = user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256";
  const userDisplayName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user?.email?.split('@')[0] || 'Operator');

  return (
    <header className="sticky top-0 z-40 w-full px-6 py-4 bg-[#141314]/85 backdrop-blur-md border-b border-[#2E2E2E] flex justify-between items-center">
      <div className="flex items-center gap-6">
        <div>
          <h2 className="font-title-lg text-title-lg text-primary">{title}</h2>
          {subtitle && <p className="text-xs text-on-surface-variant/70 mt-0.5">{subtitle}</p>}
        </div>

        {searchPlaceholder && (
          <div className="relative w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              className="bg-surface-container-lowest border border-outline-variant rounded-full pl-10 pr-4 py-2 text-body-sm w-full focus:ring-1 focus:ring-[#ff8a00] focus:border-[#ff8a00] outline-none transition-all text-on-surface"
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
          <button className="p-2 text-on-surface-variant hover:text-on-surface transition-all relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#ff8a00] rounded-full"></span>
          </button>
          <button className="p-2 text-on-surface-variant hover:text-on-surface transition-all">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
        </div>

        {/* Clickable Profile Dropdown */}
        <div className="relative group ml-2">
          <button className="flex items-center gap-2 w-10 h-10 rounded-full border border-outline-variant overflow-hidden focus:outline-none cursor-pointer">
            <img
              className="w-full h-full object-cover"
              src={userAvatar}
              alt="User Avatar"
            />
          </button>
          {/* Outer hover wrapper to bridge the gap between button and menu */}
          <div className="absolute right-0 top-full pt-1.5 w-48 hidden group-hover:block z-50">
            <div className="bg-surface-container border border-outline-variant rounded-lg shadow-xl py-1">
              <div className="px-4 py-2 border-b border-outline-variant/30">
                <p className="text-xs text-on-surface-variant">Logged in as</p>
                <p className="text-sm font-semibold text-on-surface truncate">{userDisplayName}</p>
              </div>
              
              <Link
                to="/profile"
                className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-high flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">account_circle</span>
                My Profile
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-error hover:bg-surface-container-high flex items-center gap-2 transition-colors cursor-pointer border-t border-outline-variant/20"
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
