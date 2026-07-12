import { APP_NAME } from '../utils/constants';

const Dashboard = () => {
  return (
    <div className="dashboard-page fade-in">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to your {APP_NAME} dashboard</p>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon">🚌</div>
          <div className="stat-info">
            <h3>0</h3>
            <p>Active Vehicles</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📍</div>
          <div className="stat-info">
            <h3>0</h3>
            <p>Routes</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>0</h3>
            <p>Drivers</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>0</h3>
            <p>Trips Today</p>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-page {
          padding: var(--spacing-xl);
        }

        .dashboard-header {
          margin-bottom: var(--spacing-2xl);
        }

        .dashboard-header h1 {
          margin-bottom: var(--spacing-xs);
        }

        .dashboard-header p {
          color: var(--color-gray-500);
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: var(--spacing-lg);
        }

        .stat-card {
          background: var(--color-white);
          border-radius: var(--radius-xl);
          padding: var(--spacing-lg);
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--color-gray-200);
          transition: transform var(--transition-base), box-shadow var(--transition-base);
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .stat-icon {
          font-size: 2rem;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-gray-100);
          border-radius: var(--radius-lg);
        }

        .stat-info h3 {
          font-size: var(--font-size-2xl);
          font-weight: 700;
        }

        .stat-info p {
          font-size: var(--font-size-sm);
          color: var(--color-gray-500);
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
