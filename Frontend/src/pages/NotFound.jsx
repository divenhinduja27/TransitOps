import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

const NotFound = () => {
  return (
    <div className="not-found-page fade-in">
      <div className="not-found-content">
        <h1 className="error-code">404</h1>
        <h2>Page Not Found</h2>
        <p>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link to={ROUTES.HOME} className="btn btn-primary">
          Go Home
        </Link>
      </div>

      <style>{`
        .not-found-page {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: var(--spacing-xl);
        }

        .not-found-content {
          max-width: 480px;
        }

        .error-code {
          font-size: 8rem;
          font-weight: 800;
          line-height: 1;
          background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--spacing-md);
        }

        .not-found-content h2 {
          margin-bottom: var(--spacing-md);
        }

        .not-found-content p {
          color: var(--color-gray-500);
          margin-bottom: var(--spacing-xl);
        }
      `}</style>
    </div>
  );
};

export default NotFound;
