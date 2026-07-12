import { Link, useLocation } from 'react-router-dom';
import { APP_NAME, ROUTES } from '../utils/constants';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={ROUTES.HOME} className="navbar-brand">
          🚌 {APP_NAME}
        </Link>

        <ul className="navbar-links">
          <li>
            <Link
              to={ROUTES.HOME}
              className={`nav-link ${isActive(ROUTES.HOME) ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to={ROUTES.DASHBOARD}
              className={`nav-link ${isActive(ROUTES.DASHBOARD) ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link to={ROUTES.LOGIN} className="btn btn-primary nav-btn">
              Sign In
            </Link>
          </li>
        </ul>
      </div>

      <style>{`
        .navbar {
          background: var(--color-white);
          border-bottom: 1px solid var(--color-gray-200);
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(12px);
          background: rgba(255, 255, 255, 0.9);
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--spacing-lg);
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }

        .navbar-brand {
          font-size: var(--font-size-xl);
          font-weight: 700;
          color: var(--color-gray-900);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .navbar-brand:hover {
          color: var(--color-primary);
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          list-style: none;
        }

        .nav-link {
          font-size: var(--font-size-sm);
          font-weight: 500;
          color: var(--color-gray-600);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-md);
          transition: color var(--transition-fast), background var(--transition-fast);
        }

        .nav-link:hover {
          color: var(--color-primary);
          background: var(--color-gray-100);
        }

        .nav-link.active {
          color: var(--color-primary);
          font-weight: 600;
        }

        .nav-btn {
          font-size: var(--font-size-sm);
          padding: var(--spacing-xs) var(--spacing-lg);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
