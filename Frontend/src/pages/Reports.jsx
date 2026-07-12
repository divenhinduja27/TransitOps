import React, { useState } from 'react';
import { useERP } from '../context/ERPContext';
import Header from '../components/Header';

const Reports = () => {
  const { vehicles, trips, fuelLogs, expenses, maintenance, getVehicleOperationalCost, getVehicleRevenue } = useERP();
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Operational Cost Totals
  const totalFuelCost = fuelLogs.reduce((sum, f) => sum + f.cost, 0);
  const totalMaintenanceCost = maintenance.reduce((sum, m) => sum + m.cost, 0);
  const totalMiscExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalOperationalCost = totalFuelCost + totalMaintenanceCost + totalMiscExpenses;

  // 2. Revenue Totals
  // We assume Completed trips earn revenue
  const totalTripRevenue = trips.filter(t => t.status === 'Completed').reduce((sum, t) => sum + (t.cost * 1.4), 0);
  const netProfit = totalTripRevenue - totalOperationalCost;
  const profitMarginRatio = totalTripRevenue > 0 ? Math.round((netProfit / totalTripRevenue) * 100) : 0;

  // 3. Fleet Metrics
  const totalVehicles = vehicles.length;
  const dispatchedVehicles = vehicles.filter(v => v.status === 'Dispatched').length;
  const fleetUtilization = totalVehicles > 0 ? Math.round((dispatchedVehicles / totalVehicles) * 100) : 0;

  // 4. Top Cost Vehicles list
  const vehicleCosts = vehicles.map(v => {
    const cost = getVehicleOperationalCost(v.id);
    const revenue = getVehicleRevenue(v.id);
    const roi = cost > 0 ? (revenue / cost).toFixed(2) : 'N/A';
    return {
      ...v,
      totalCost: cost,
      totalRevenue: revenue,
      roi
    };
  });

  const sortedByCost = [...vehicleCosts].sort((a, b) => b.totalCost - a.totalCost);

  // Filter list by search query (registration number)
  const filteredVehicles = vehicleCosts.filter(v => 
    v.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.make.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          title="Reports & Analytics" 
          subtitle="Enterprise operational efficiency, fuel ROI, and cost allocation"
          searchPlaceholder="Search vehicle ROI stats..."
          searchValue={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="p-6 space-y-6 flex-grow">
          {/* Main KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-xl flex flex-col justify-between">
              <span className="text-on-surface-variant/80 text-xs font-bold uppercase tracking-wider">Total Revenue</span>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-green-400 metric-glow">₹{totalTripRevenue.toLocaleString()}</span>
                <p className="text-[10px] text-on-surface-variant/60 mt-1">From completed manifests</p>
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl flex flex-col justify-between">
              <span className="text-on-surface-variant/80 text-xs font-bold uppercase tracking-wider">Operational Expenditures</span>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-red-400 metric-glow">₹{totalOperationalCost.toLocaleString()}</span>
                <p className="text-[10px] text-on-surface-variant/60 mt-1">Fuel + maintenance + tolls</p>
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl flex flex-col justify-between">
              <span className="text-on-surface-variant/80 text-xs font-bold uppercase tracking-wider">Net Operating Profit</span>
              <div className="mt-4">
                <span className={`text-3xl font-extrabold metric-glow ${netProfit >= 0 ? 'text-[#ff8a00]' : 'text-red-400'}`}>
                  ₹{netProfit.toLocaleString()}
                </span>
                <p className="text-[10px] text-on-surface-variant/60 mt-1">Profit margin: {profitMarginRatio}%</p>
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl flex flex-col justify-between">
              <span className="text-on-surface-variant/80 text-xs font-bold uppercase tracking-wider">Fleet Utilization</span>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-cyan-400 metric-glow">{fleetUtilization}%</span>
                <p className="text-[10px] text-on-surface-variant/60 mt-1">{dispatchedVehicles} of {totalVehicles} en route</p>
              </div>
            </div>
          </div>

          {/* Breakdown Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cost Allocation Chart Mock */}
            <div className="glass-card p-6 rounded-xl space-y-4">
              <h3 className="text-sm font-bold border-b border-[#2E2E2E] pb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff8a00]">pie_chart</span>
                Cost Allocation breakdown
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Fuel Expenses (₹{totalFuelCost.toLocaleString()})</span>
                    <span className="font-bold">{totalOperationalCost > 0 ? Math.round((totalFuelCost/totalOperationalCost)*100) : 0}%</span>
                  </div>
                  <div className="w-full bg-[#2E2E2E] h-2 rounded-full overflow-hidden">
                    <div className="bg-yellow-500 h-full" style={{ width: `${(totalFuelCost/totalOperationalCost)*100 || 0}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Maintenance Shops (₹{totalMaintenanceCost.toLocaleString()})</span>
                    <span className="font-bold">{totalOperationalCost > 0 ? Math.round((totalMaintenanceCost/totalOperationalCost)*100) : 0}%</span>
                  </div>
                  <div className="w-full bg-[#2E2E2E] h-2 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full" style={{ width: `${(totalMaintenanceCost/totalOperationalCost)*100 || 0}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Tolls & Permit Fees (₹{totalMiscExpenses.toLocaleString()})</span>
                    <span className="font-bold">{totalOperationalCost > 0 ? Math.round((totalMiscExpenses/totalOperationalCost)*100) : 0}%</span>
                  </div>
                  <div className="w-full bg-[#2E2E2E] h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full" style={{ width: `${(totalMiscExpenses/totalOperationalCost)*100 || 0}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#2E2E2E] pt-4 text-xs text-on-surface-variant/80 space-y-2">
                <p>📊 Operations budget is fully optimized.</p>
                <p>⛽ Fuel costs are the main driver of fleet expenditures.</p>
              </div>
            </div>

            {/* Top Cost Vehicles List */}
            <div className="glass-card p-6 rounded-xl space-y-4 lg:col-span-2">
              <h3 className="text-sm font-bold border-b border-[#2E2E2E] pb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff8a00]">trending_down</span>
                Top Cost Heavy Vehicles
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#2E2E2E] text-on-surface-variant/60 text-xs font-bold uppercase">
                      <th className="py-2.5 px-2">Vehicle</th>
                      <th className="py-2.5 px-2">Type</th>
                      <th className="py-2.5 px-2 text-right">Opex (₹)</th>
                      <th className="py-2.5 px-2 text-right">Revenue (₹)</th>
                      <th className="py-2.5 px-2 text-right">ROI Ratio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2E2E2E]/40">
                    {sortedByCost.slice(0, 5).map(v => (
                      <tr key={v.id} className="hover:bg-[#1E1E1E]/40 transition-colors">
                        <td className="py-3 px-2 font-mono font-bold text-primary">{v.registrationNumber}</td>
                        <td className="py-3 px-2 text-xs">{v.make} ({v.type})</td>
                        <td className="py-3 px-2 text-right font-mono text-red-400">₹{v.totalCost.toLocaleString()}</td>
                        <td className="py-3 px-2 text-right font-mono text-green-400">₹{v.totalRevenue.toLocaleString()}</td>
                        <td className="py-3 px-2 text-right font-mono font-bold text-on-surface">{v.roi}x</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Vehicle ROI Detailed Table */}
          <div className="glass-card p-6 rounded-xl space-y-4">
            <h3 className="text-sm font-bold border-b border-[#2E2E2E] pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ff8a00]">insights</span>
              Full Fleet Return on Investment (ROI) Registry
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#2E2E2E] text-on-surface-variant/60 text-xs font-bold uppercase bg-[#161616]/40">
                    <th className="py-3 px-4">Registration</th>
                    <th className="py-3 px-4">Model Details</th>
                    <th className="py-3 px-4 text-right">Operational Cost (₹)</th>
                    <th className="py-3 px-4 text-right">Generated Revenue (₹)</th>
                    <th className="py-3 px-4 text-right font-bold">ROI Factor</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2E2E2E]/40">
                  {filteredVehicles.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-6 text-center text-on-surface-variant/40">No stats match the criteria.</td>
                    </tr>
                  ) : (
                    filteredVehicles.map(v => (
                      <tr key={v.id} className="hover:bg-[#1E1E1E]/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-primary">{v.registrationNumber}</td>
                        <td className="py-3 px-4 text-xs">{v.make} {v.model} ({v.type})</td>
                        <td className="py-3 px-4 text-right font-mono text-red-400">₹{v.totalCost.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-mono text-green-400">₹{v.totalRevenue.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold">
                          <span className={`px-2 py-0.5 rounded ${
                            v.roi === 'N/A' ? 'bg-[#1E1E1E] text-on-surface-variant' :
                            Number(v.roi) > 1.5 ? 'bg-green-500/10 text-green-400' :
                            Number(v.roi) >= 1.0 ? 'bg-cyan-500/10 text-cyan-400' :
                            'bg-red-500/10 text-red-400'
                          }`}>
                            {v.roi === 'N/A' ? 'N/A' : `${v.roi}x`}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                            v.status === 'Available' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                            v.status === 'Dispatched' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' :
                            'bg-red-500/10 text-red-400 border border-red-500/30'
                          }`}>
                            {v.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Reports;
