import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // TODO: Implement register API call
    console.log('Register submitted:', formData);
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join TransitOps and get started</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

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
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn btn-primary auth-btn">
            Create Account
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN}>Sign in</Link>
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

export default Register;
