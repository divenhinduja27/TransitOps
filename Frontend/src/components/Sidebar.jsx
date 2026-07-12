import { NavLink } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink
          to={ROUTES.DASHBOARD}
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          📊 Dashboard
        </NavLink>
        {/* Add more sidebar links as needed */}
      </nav>

      <style>{`
        .sidebar {
          width: 240px;
          min-height: calc(100vh - 64px);
          background: var(--color-white);
          border-right: 1px solid var(--color-gray-200);
          padding: var(--spacing-lg) 0;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
          padding: 0 var(--spacing-sm);
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-md);
          font-size: var(--font-size-sm);
          font-weight: 500;
          color: var(--color-gray-600);
          border-radius: var(--radius-lg);
          text-decoration: none;
          transition: all var(--transition-fast);
        }

        .sidebar-link:hover {
          background: var(--color-gray-100);
          color: var(--color-primary);
        }

        .sidebar-link.active {
          background: rgba(79, 70, 229, 0.08);
          color: var(--color-primary);
          font-weight: 600;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
