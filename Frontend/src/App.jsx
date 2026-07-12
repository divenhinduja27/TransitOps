import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import ERPLayout from './layouts/ERPLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TripManagement from './pages/TripManagement';
import VehicleRegistry from './pages/VehicleRegistry';
import DriverManagement from './pages/DriverManagement';
import Maintenance from './pages/Maintenance';
import FuelExpenses from './pages/FuelExpenses';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages with Navbar + Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Auth pages (no Navbar/Footer) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* ERP pages with Sidebar */}
        <Route element={<ERPLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/fleet" element={<VehicleRegistry />} />
          <Route path="/drivers" element={<DriverManagement />} />
          <Route path="/trips" element={<TripManagement />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/fuel-expenses" element={<FuelExpenses />} />
          <Route path="/analytics" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
