import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { useERP } from '../context/ERPContext';

const Header = ({ title, subtitle, searchPlaceholder, searchValue, onSearchChange, actions }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { drivers } = useERP();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userAvatar = user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256";
  const userDisplayName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user?.email?.split('@')[0] || 'Operator');

  // Compute notifications for expired or expiring licenses
  const getNotifications = () => {
    const list = [];
    const today = new Date();
    
    drivers.forEach(d => {
      if (!d.licenseExpiryDate) return;
      
      const expiry = new Date(d.licenseExpiryDate);
      const isExpired = expiry < today;
      
      // Calculate remaining days
      const diffTime = expiry - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const isExpiringSoon = diffDays <= 30 && diffDays >= 0;
      
      const isCurrentUserDriver = d.userEmail && user?.email && d.userEmail.toLowerCase() === user.email.toLowerCase();
      
      // Drivers only see their own alerts. Admins/Managers see all.
      const shouldNotify = user?.role === 'ROLE_DRIVER' ? isCurrentUserDriver : true;
      
      if (shouldNotify) {
        if (isExpired) {
          list.push({
            id: `expired-${d.id}`,
            driverName: d.name,
            licenseNumber: d.licenseNumber,
            message: isCurrentUserDriver 
              ? `Your driver's license (${d.licenseNumber}) has EXPIRED. You are restricted from trip assignments.`
              : `Driver ${d.name}'s license (${d.licenseNumber}) has EXPIRED.`,
            type: 'danger',
            isSelf: isCurrentUserDriver
          });
        } else if (isExpiringSoon) {
          list.push({
            id: `expiring-${d.id}`,
            driverName: d.name,
            licenseNumber: d.licenseNumber,
            message: isCurrentUserDriver 
              ? `Your driver's license (${d.licenseNumber}) is expiring in ${diffDays} days (${d.licenseExpiryDate}).`
              : `Driver ${d.name}'s license (${d.licenseNumber}) expires in ${diffDays} days.`,
            type: 'warning',
            isSelf: isCurrentUserDriver
          });
        }
      }
    });
    
    return list;
  };

  const notifications = getNotifications();
  const hasNotifications = notifications.length > 0;
  const selfAlerts = notifications.filter(n => n.isSelf);

  return (
    <div className="w-full flex flex-col sticky top-0 z-40">
      {/* Persistent warning banner for driver with license issues */}
      {selfAlerts.map(n => (
        <div 
          key={n.id} 
          className={`w-full py-2 px-6 text-center text-xs font-bold border-b transition-all duration-300 flex items-center justify-center gap-2 ${
            n.type === 'danger' 
              ? 'bg-rose-500/25 text-rose-400 border-rose-500/35' 
              : 'bg-amber-500/25 text-amber-400 border-amber-500/35'
          }`}
        >
          <span className="material-symbols-outlined text-[16px] animate-pulse">
            {n.type === 'danger' ? 'report' : 'warning'}
          </span>
          <span>{n.message}</span>
        </div>
      ))}

      <header className="w-full px-6 py-4 bg-[var(--bg-app)]/80 backdrop-blur-md border-b border-[var(--border-color)] flex justify-between items-center transition-all duration-200">
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
              className="bg-[#161616] dark:bg-[#161616] light:bg-[#FFFFFF] border border-[var(--border-color)] rounded-full pl-10 pr-4 py-2 text-body-sm w-full focus:ring-1 focus:ring-[#ff8a00] focus:border-[#ff8a00] outline-none transition-all text-[var(--color-text-primary)]"
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
            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className="material-symbols-outlined">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-all relative cursor-pointer flex items-center justify-center"
              title="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
              {hasNotifications && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff8a00] text-black font-extrabold text-[9px] rounded-full flex items-center justify-center shadow-md">
                  {notifications.length}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3 border-b border-[var(--border-color)]/30 flex justify-between items-center bg-white/[0.01]">
                  <span className="text-xs font-bold text-[var(--color-text-primary)] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#ff8a00]">notifications</span>
                    System Notifications
                  </span>
                  {hasNotifications && (
                    <span className="text-[9px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded font-extrabold uppercase">
                      Alerts
                    </span>
                  )}
                </div>
                
                <div className="max-h-64 overflow-y-auto divide-y divide-[var(--border-color)]/10">
                  {!hasNotifications ? (
                    <div className="p-6 text-center text-[var(--color-text-muted)] text-xs">
                      <span className="material-symbols-outlined text-[28px] block mb-1 opacity-40">notifications_off</span>
                      No active compliance alerts.
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`p-3 text-xs flex items-start gap-2.5 hover:bg-white/[0.01] transition-all ${
                          n.type === 'danger' ? 'border-l-4 border-rose-500' : 'border-l-4 border-amber-500'
                        }`}
                      >
                        <span className={`material-symbols-outlined shrink-0 text-[18px] mt-0.5 ${
                          n.type === 'danger' ? 'text-rose-400' : 'text-amber-400'
                        }`}>
                          {n.type === 'danger' ? 'report' : 'warning'}
                        </span>
                        <div className="space-y-0.5">
                          <p className="font-medium text-[var(--color-text-primary)] leading-normal">
                            {n.message}
                          </p>
                          {n.isSelf && (
                            <span className="inline-block text-[9px] bg-rose-500/10 text-rose-400 font-extrabold uppercase px-1 rounded mt-1">
                              Action Required
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
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
  </div>
);
};

export default Header;
