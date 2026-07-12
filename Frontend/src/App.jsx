import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import ERPLayout from './layouts/ERPLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import TripManagement from './pages/TripManagement';
import VehicleRegistry from './pages/VehicleRegistry';
import DriverManagement from './pages/DriverManagement';
import Maintenance from './pages/Maintenance';
import FuelExpenses from './pages/FuelExpenses';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Components & Providers
import ProtectedRoute from './components/ProtectedRoute';
import { ERPProvider } from './context/ERPContext';

function App() {
  return (
    <ERPProvider>
      <Router>
        <Routes>
          {/* Redirect root to /dashboard (which redirects to /login if unauthenticated) */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Auth pages (no Sidebar) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected ERP pages with Sidebar */}
          <Route element={<ProtectedRoute />}>
            <Route element={<ERPLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/fleet" element={<VehicleRegistry />} />
              <Route path="/drivers" element={<DriverManagement />} />
              <Route path="/trips" element={<TripManagement />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/fuel-expenses" element={<FuelExpenses />} />
              <Route path="/analytics" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ERPProvider>
  );
}

export default App;
