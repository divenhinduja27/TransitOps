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
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-low flex flex-col py-6 z-50 border-r border-outline-variant/20">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-container rounded flex items-center justify-center">
            <span className="material-symbols-outlined text-[#ff8a00] text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_shipping
            </span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary">TransitOps</h1>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
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
                  ? 'bg-secondary-container text-on-secondary-container scale-[0.98]'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
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
        <div className="mx-4 mb-2 p-3 bg-surface-container border border-outline-variant/10 rounded-lg flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-outline-variant/30">
            <img 
              src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-xs text-on-surface truncate">
              {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user.email?.split('@')[0] || 'Operator')}
            </p>
            <p className="text-[9px] text-on-surface-variant/80 font-bold uppercase tracking-wider truncate">
              {user.role ? user.role.replace('ROLE_', '').replace('_', ' ').toLowerCase() : 'Operator'}
            </p>
          </div>
        </div>
      )}

      <div className="mt-auto border-t border-outline-variant/30 pt-4 flex flex-col gap-1 font-semibold">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-secondary-container text-on-secondary-container'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`
          }
        >
          <span className="material-symbols-outlined">account_circle</span>
          <span className="font-body-md text-body-md">Profile</span>
        </NavLink>
        <a
          href="/login"
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 mx-2 text-error hover:bg-surface-container-high/50 rounded-lg transition-colors duration-200"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-body-md text-body-md">Logout</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
