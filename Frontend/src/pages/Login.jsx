import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement login API call
    console.log('Login submitted:', formData);
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your TransitOps account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary auth-btn">
            Sign In
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link to={ROUTES.REGISTER}>Create one</Link>
        </p>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--color-gray-100) 0%, var(--color-gray-200) 100%);
          padding: var(--spacing-lg);
        }

        .auth-card {
          background: var(--color-white);
          border-radius: var(--radius-2xl);
          padding: var(--spacing-2xl);
          width: 100%;
          max-width: 420px;
          box-shadow: var(--shadow-xl);
        }

        .auth-header {
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }

        .auth-header h2 {
          margin-bottom: var(--spacing-xs);
        }

        .auth-header p {
          color: var(--color-gray-500);
          font-size: var(--font-size-sm);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .form-group label {
          font-size: var(--font-size-sm);
          font-weight: 500;
          color: var(--color-gray-700);
        }

        .auth-btn {
          width: 100%;
          padding: var(--spacing-md);
          margin-top: var(--spacing-sm);
        }

        .auth-footer {
          text-align: center;
          margin-top: var(--spacing-lg);
          font-size: var(--font-size-sm);
          color: var(--color-gray-500);
        }
      `}</style>
    </div>
  );
};

export default Login;
