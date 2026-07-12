import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

const Home = () => {
  return (
    <div className="home-page fade-in">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>
              Welcome to <span className="highlight">TransitOps</span>
            </h1>
            <p className="hero-subtitle">
              Streamline your transit operations with our powerful management
              platform. Monitor, manage, and optimize your fleet in real time.
            </p>
            <div className="hero-actions">
              <Link to={ROUTES.REGISTER} className="btn btn-primary">
                Get Started
              </Link>
              <Link to={ROUTES.LOGIN} className="btn btn-secondary">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .hero {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: linear-gradient(135deg, var(--color-gray-50) 0%, var(--color-gray-100) 100%);
        }

        .hero-content {
          max-width: 640px;
          margin: 0 auto;
        }

        .hero-content h1 {
          font-size: var(--font-size-4xl);
          margin-bottom: var(--spacing-lg);
        }

        .highlight {
          background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: var(--font-size-lg);
          color: var(--color-gray-500);
          margin-bottom: var(--spacing-xl);
          line-height: 1.8;
        }

        .hero-actions {
          display: flex;
          gap: var(--spacing-md);
          justify-content: center;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
};

export default Home;
