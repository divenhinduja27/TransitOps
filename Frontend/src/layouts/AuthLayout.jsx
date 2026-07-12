import { Outlet } from 'react-router-dom';

/**
 * AuthLayout - a clean, centered layout for authentication pages
 * (Login, Register, etc.) without Navbar/Footer.
 */
const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <Outlet />

      <style>{`
        .auth-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
