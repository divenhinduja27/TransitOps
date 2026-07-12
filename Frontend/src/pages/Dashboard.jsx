import React, { useState } from 'react';
import { useERP } from '../context/ERPContext';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { vehicles, drivers, trips, maintenance } = useERP();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // KPI Calculations
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(v => v.status === 'Dispatched').length;
  const availableVehicles = vehicles.filter(v => v.status === 'Available').length;
  const inShopVehicles = vehicles.filter(v => v.status === 'In Shop').length;
  
  const totalDrivers = drivers.length;
  const availableDrivers = drivers.filter(d => d.status === 'Available').length;
  const activeTripsCount = trips.filter(t => t.status === 'Dispatched').length;

  const fleetUtilization = totalVehicles > 0 
    ? Math.round((activeVehicles / totalVehicles) * 100) 
    : 0;

  // Filtered Trips for Table
  const filteredTrips = trips.filter(trip => {
    const matchesSearch = 
      trip.tripId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || trip.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get vehicle registration for a trip
  const getVehicleReg = (vehicleId) => {
    const v = vehicles.find(veh => veh.id === vehicleId);
    return v ? v.registrationNumber : vehicleId;
  };

  // Get driver name for a trip
  const getDriverName = (driverId) => {
    const d = drivers.find(drv => drv.id === driverId);
    return d ? d.name : driverId;
  };

  return (
    <>
      <style>{`
        .glass-card {
            background: rgba(30, 30, 30, 0.6);
            backdrop-filter: blur(12px);
            border: 1px solid #2E2E2E;
        }
        .metric-glow {
            text-shadow: 0 0 15px rgba(255, 138, 0, 0.25);
        }
      `}</style>

      <main className="ml-[260px] min-h-screen flex flex-col bg-[#111111] text-[#e6e1e2]">
        <Header 
          title="Logistics Command" 
          subtitle="Real-time operational command console"
          searchPlaceholder="Search trips, origins, destinations..."
          searchValue={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          actions={
            <div className="flex items-center gap-3">
              <Link to="/trips" className="bg-[#ff8a00] text-black px-5 py-2 rounded-full font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-[18px]">add</span>
                Dispatch Trip
              </Link>
              <Link to="/fleet" className="border border-[#2E2E2E] bg-[#1E1E1E] text-on-surface px-5 py-2 rounded-full font-semibold hover:bg-[#2E2E2E] transition-all text-sm">
                Add Vehicle
              </Link>
            </div>
          }
        />

        <div className="p-6 space-y-6 flex-grow">
          {/* KPI Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            <div className="glass-card p-4 rounded-xl flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-on-surface-variant/80 text-xs font-semibold uppercase tracking-wider">Active Fleets</span>
                <span className="material-symbols-outlined text-[#ff8a00] text-[20px]">local_shipping</span>
              </div>
              <div className="mt-4">
                <span className="font-display-lg text-3xl font-extrabold text-on-surface metric-glow">{activeVehicles}</span>
                <p className="text-[10px] text-on-surface-variant/60 mt-1">out of {totalVehicles} total</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-on-surface-variant/80 text-xs font-semibold uppercase tracking-wider">Available Fleet</span>
                <span className="material-symbols-outlined text-green-400 text-[20px]">check_circle</span>
              </div>
              <div className="mt-4">
                <span className="font-display-lg text-3xl font-extrabold text-on-surface metric-glow">{availableVehicles}</span>
                <p className="text-[10px] text-green-500/80 mt-1">Ready for dispatch</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-on-surface-variant/80 text-xs font-semibold uppercase tracking-wider">In Maintenance</span>
                <span className="material-symbols-outlined text-red-400 text-[20px]">build</span>
              </div>
              <div className="mt-4">
                <span className="font-display-lg text-3xl font-extrabold text-on-surface metric-glow">{inShopVehicles}</span>
                <p className="text-[10px] text-red-400/80 mt-1">Undergoing service</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-on-surface-variant/80 text-xs font-semibold uppercase tracking-wider">Total Drivers</span>
                <span className="material-symbols-outlined text-blue-400 text-[20px]">badge</span>
              </div>
              <div className="mt-4">
                <span className="font-display-lg text-3xl font-extrabold text-on-surface metric-glow">{totalDrivers}</span>
                <p className="text-[10px] text-on-surface-variant/60 mt-1">{availableDrivers} available</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-on-surface-variant/80 text-xs font-semibold uppercase tracking-wider">Ongoing Trips</span>
                <span className="material-symbols-outlined text-cyan-400 text-[20px]">route</span>
              </div>
              <div className="mt-4">
                <span className="font-display-lg text-3xl font-extrabold text-on-surface metric-glow">{activeTripsCount}</span>
                <p className="text-[10px] text-cyan-400/80 mt-1">Currently en route</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl flex flex-col justify-between col-span-1 lg:col-span-2">
              <div className="flex justify-between items-start">
                <span className="text-on-surface-variant/80 text-xs font-semibold uppercase tracking-wider">Fleet Utilization</span>
                <span className="material-symbols-outlined text-yellow-400 text-[20px]">analytics</span>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-on-surface metric-glow">{fleetUtilization}%</span>
                  <span className="text-xs text-on-surface-variant/60">dispatched ratio</span>
                </div>
                <div className="w-full bg-[#2E2E2E] h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-[#ff8a00] h-full" style={{ width: `${fleetUtilization}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Stats Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Trips Table */}
            <div className="glass-card p-6 rounded-xl lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center border-b border-[#2E2E2E] pb-3">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ff8a00]">history</span>
                  Recent Trip Actions
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-on-surface-variant/60 font-semibold">Filter:</span>
                  <select 
                    className="bg-[#161616] border border-[#2E2E2E] rounded px-2 py-1 text-xs text-on-surface outline-none focus:border-[#ff8a00]"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Draft">Draft</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#2E2E2E] text-on-surface-variant/60 text-xs font-semibold uppercase">
                      <th className="py-3 px-2">Trip ID</th>
                      <th className="py-3 px-2">Vehicle</th>
                      <th className="py-3 px-2">Driver</th>
                      <th className="py-3 px-2">Route</th>
                      <th className="py-3 px-2 text-right">Cargo</th>
                      <th className="py-3 px-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2E2E2E]/40">
                    {filteredTrips.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-on-surface-variant/40">No trips match the filters.</td>
                      </tr>
                    ) : (
                      filteredTrips.slice(0, 8).map((trip) => (
                        <tr key={trip.id} className="hover:bg-[#1E1E1E]/50 transition-colors">
                          <td className="py-3 px-2 font-mono font-bold text-xs text-primary">{trip.tripId}</td>
                          <td className="py-3 px-2 text-xs font-mono">{getVehicleReg(trip.vehicleId)}</td>
                          <td className="py-3 px-2 text-xs">{getDriverName(trip.driverId)}</td>
                          <td className="py-3 px-2 text-xs">{trip.origin} → {trip.destination}</td>
                          <td className="py-3 px-2 text-xs text-right font-mono font-bold">{(trip.cargoWeight).toLocaleString()} kg</td>
                          <td className="py-3 px-2 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              trip.status === 'Completed' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                              trip.status === 'Dispatched' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' :
                              trip.status === 'Cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                              'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                            }`}>
                              {trip.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vehicle Status Summary */}
            <div className="glass-card p-6 rounded-xl space-y-4">
              <h3 className="text-lg font-bold border-b border-[#2E2E2E] pb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff8a00]">settings_suggest</span>
                Vehicle & Driver Deployments
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-on-surface-variant/80">Dispatched Vehicles</span>
                    <span className="font-bold">{activeVehicles} / {totalVehicles}</span>
                  </div>
                  <div className="w-full bg-[#2E2E2E] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#ff8a00] h-full" style={{ width: `${(activeVehicles/totalVehicles)*100 || 0}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-on-surface-variant/80">In Shop for Service</span>
                    <span className="font-bold">{inShopVehicles} / {totalVehicles}</span>
                  </div>
                  <div className="w-full bg-[#2E2E2E] h-2 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full" style={{ width: `${(inShopVehicles/totalVehicles)*100 || 0}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-on-surface-variant/80">Available Vehicles</span>
                    <span className="font-bold">{availableVehicles} / {totalVehicles}</span>
                  </div>
                  <div className="w-full bg-[#2E2E2E] h-2 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: `${(availableVehicles/totalVehicles)*100 || 0}%` }}></div>
                  </div>
                </div>

                <div className="border-t border-[#2E2E2E] pt-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-on-surface-variant/60 tracking-wider">Resource Allocation</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1E1E1E] p-3 rounded-lg border border-[#2E2E2E]">
                      <span className="text-[10px] text-on-surface-variant/75 uppercase font-semibold">Active Drivers</span>
                      <p className="text-xl font-bold mt-1 text-on-surface metric-glow">{drivers.filter(d => d.status === 'Active').length}</p>
                    </div>
                    <div className="bg-[#1E1E1E] p-3 rounded-lg border border-[#2E2E2E]">
                      <span className="text-[10px] text-on-surface-variant/75 uppercase font-semibold">Suspended/Expired</span>
                      <p className="text-xl font-bold mt-1 text-red-400 metric-glow">{drivers.filter(d => d.status === 'Suspended' || d.status === 'Expired').length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
