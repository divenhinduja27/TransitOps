import { Navigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

/**
 * ProtectedRoute wraps routes that require authentication.
 * If the user is not authenticated, they are redirected to the login page.
 *
 * Usage:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *   </Route>
 *
 * For now, this checks localStorage for a token.
 * Replace with your actual auth logic (e.g., useAuth hook, context, etc.).
 */
import { Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
