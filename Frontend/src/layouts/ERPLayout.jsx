import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const ERPLayout = () => {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Sidebar />
      <div className="flex flex-col min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default ERPLayout;
