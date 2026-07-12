import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Fleet', path: '/fleet', icon: 'local_shipping' },
    { name: 'Drivers', path: '/drivers', icon: 'person_pin_circle' },
    { name: 'Trips', path: '/trips', icon: 'route' },
    { name: 'Maintenance', path: '/maintenance', icon: 'build' },
    { name: 'Fuel & Expenses', path: '/fuel-expenses', icon: 'local_gas_station' },
    { name: 'Analytics', path: '/analytics', icon: 'analytics' },
    { name: 'Settings', path: '/settings', icon: 'settings' }
  ];

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-[var(--bg-sidebar)] flex flex-col py-6 z-50 border-r border-[var(--border-color)] transition-all duration-200">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ff8a00]/10 rounded flex items-center justify-center border border-[#ff8a00]/20">
            <span className="material-symbols-outlined text-[#ff8a00] text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_shipping
            </span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-[var(--color-text-primary)]">TransitOps</h1>
            <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-bold">
              Smart Logistics ERP
            </p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-[#ff8a00]/15 text-[#ff8a00] font-bold scale-[0.98] border border-[#ff8a00]/20'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--bg-app)]'
              }`
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-body-md text-body-md">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Dynamic Mini Profile Card */}
      {user && (
        <div className="mx-4 mb-2 p-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-[var(--border-color)]">
            <img 
              src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-xs text-[var(--color-text-primary)] truncate">
              {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user.email?.split('@')[0] || 'Operator')}
            </p>
            <p className="text-[9px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider truncate">
              {user.role ? user.role.replace('ROLE_', '').replace('_', ' ').toLowerCase() : 'Operator'}
            </p>
          </div>
        </div>
      )}

      <div className="mt-auto border-t border-[var(--border-color)] pt-4 flex flex-col gap-1 font-semibold">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-[#ff8a00]/15 text-[#ff8a00] font-bold border border-[#ff8a00]/20'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--bg-app)]'
            }`
          }
        >
          <span className="material-symbols-outlined">account_circle</span>
          <span className="font-body-md text-body-md">Profile</span>
        </NavLink>
        <a
          href="/login"
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 mx-2 text-red-500 hover:bg-[var(--bg-app)] rounded-lg transition-colors duration-200"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-body-md text-body-md">Logout</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
