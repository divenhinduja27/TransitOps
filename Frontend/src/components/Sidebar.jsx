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


    </aside>
  );
};

export default Sidebar;
