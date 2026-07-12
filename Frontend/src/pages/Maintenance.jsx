import React, { useState } from 'react';
import { useERP } from '../context/ERPContext';
import Header from '../components/Header';

const Maintenance = () => {
  const { vehicles, maintenance, createMaintenanceRecord, completeMaintenanceRecord } = useERP();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    vehicleId: '',
    serviceType: '',
    cost: '',
    startDate: new Date().toISOString().split('T')[0],
    status: 'In Progress'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dropdown list (Exclude currently Dispatched vehicles)
  const maintainableVehicles = vehicles.filter(v => v.status !== 'Dispatched');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.vehicleId) {
      setError('Please select a vehicle to service.');
      return;
    }

    try {
      createMaintenanceRecord(formData);
      setSuccess('Maintenance job successfully logged.');
      setFormData({
        vehicleId: '',
        serviceType: '',
        cost: '',
        startDate: new Date().toISOString().split('T')[0],
        status: 'In Progress'
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResolve = (id) => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (window.confirm('Mark this maintenance ticket as completed? This will restore vehicle to Available status.')) {
      completeMaintenanceRecord(id, todayStr);
    }
  };

  const getVehicleReg = (vehicleId) => {
    const v = vehicles.find(veh => veh.id === vehicleId);
    return v ? v.registrationNumber : vehicleId;
  };

  // Filtered maintenance logs
  const filteredLogs = maintenance.filter(log => {
    const reg = getVehicleReg(log.vehicleId).toLowerCase();
    const type = log.serviceType.toLowerCase();
    const search = searchQuery.toLowerCase();
    return reg.includes(search) || type.includes(search);
  });

  return (
    <>
      <style>{`
        .glass-card {
            background: rgba(30, 30, 30, 0.6);
            backdrop-filter: blur(12px);
            border: 1px solid #2E2E2E;
        }
        .form-input {
            background-color: #161616;
            border: 1px solid #2E2E2E;
            color: #e6e1e2;
            width: 100%;
            height: 40px;
            padding: 0 12px;
            border-radius: 6px;
            outline: none;
            transition: border-color 0.2s;
        }
        .form-input:focus {
            border-color: #ff8a00;
        }
        .table-row {
          border-bottom: 1px solid #2E2E2E;
          transition: background 0.2s;
        }
        .table-row:hover {
          background-color: rgba(255, 255, 255, 0.02);
        }
      `}</style>

      <main className="ml-[260px] min-h-screen flex flex-col bg-[#111111] text-[#e6e1e2]">
        <Header 
          title="Maintenance Depot" 
          subtitle="Record vehicle maintenance logs and monitor active shop tickets"
          searchPlaceholder="Search maintenance by registration..."
          searchValue={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="p-6 flex flex-col xl:flex-row gap-6 flex-grow">
          {/* LEFT: Log Service Record Form */}
          <div className="xl:w-1/3 space-y-6">
            <div className="glass-card p-6 rounded-xl border border-[#2E2E2E]">
              <h3 className="text-base font-bold mb-6 pb-2 border-b border-[#2E2E2E] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff8a00]">build</span>
                Log Service Record
              </h3>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs flex gap-2">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-xs flex gap-2">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Vehicle Choice */}
                <div className="space-y-1">
                  <label className="text-xs text-on-surface-variant font-bold uppercase">Vehicle</label>
                  <select
                    className="form-input bg-[#161616]"
                    required
                    value={formData.vehicleId}
                    onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                  >
                    <option value="">-- Choose Vehicle --</option>
                    {maintainableVehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.registrationNumber} ({v.make} - Status: {v.status})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Service Type */}
                <div className="space-y-1">
                  <label className="text-xs text-on-surface-variant font-bold uppercase">Service Type</label>
                  <input
                    className="form-input"
                    type="text"
                    required
                    placeholder="e.g. Oil Change"
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  />
                </div>

                {/* Service budget cost & Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant font-bold uppercase">Cost</label>
                    <input
                      className="form-input"
                      type="number"
                      required
                      placeholder="2500"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant font-bold uppercase">Date</label>
                    <input
                      className="form-input"
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* Status Dropdown Option added as requested */}
                <div className="space-y-1">
                  <label className="text-xs text-on-surface-variant font-bold uppercase">Status</label>
                  <select
                    className="form-input bg-[#161616]"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="In Progress">Active (In Shop)</option>
                    <option value="Completed">Completed (Available)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-[#ff8a00] hover:bg-[#e07b00] text-black font-bold rounded-lg hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  <span className="material-symbols-outlined text-[20px]">save</span>
                  Save
                </button>
              </form>

            </div>
          </div>

          {/* RIGHT: Service Log Table matching Blueprint */}
          <div className="flex-grow space-y-4">
            <div className="glass-card p-6 rounded-xl border border-[#2E2E2E] flex flex-col h-full">
              <h3 className="text-base font-bold mb-4 pb-2 border-b border-[#2E2E2E] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff8a00]">list_alt</span>
                Service Logs
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#2E2E2E] text-zinc-400 font-bold uppercase tracking-wider bg-white/[0.01]">
                      <th className="py-4 px-6 text-[10px] font-bold tracking-wider text-zinc-400">Vehicle</th>
                      <th className="py-4 px-6 text-[10px] font-bold tracking-wider text-zinc-400">Service</th>
                      <th className="py-4 px-6 text-[10px] font-bold tracking-wider text-zinc-400">Cost</th>
                      <th className="py-4 px-6 text-[10px] font-bold tracking-wider text-zinc-400 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-12 text-center text-on-surface-variant/40">
                          No registered service tickets.
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map(log => (
                        <tr key={log.id} className="table-row">
                          <td className="py-4 px-6 font-semibold text-white whitespace-nowrap">
                            <span className="inline-block px-2.5 py-1 bg-zinc-800/80 text-zinc-200 border border-zinc-700/60 rounded text-[11px] font-mono tracking-wide uppercase shadow-sm">
                              {getVehicleReg(log.vehicleId)}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-zinc-300">
                            {log.serviceType}
                          </td>
                          <td className="py-4 px-6 font-mono font-bold text-zinc-100 whitespace-nowrap text-sm">
                            ₹{log.cost.toLocaleString()}
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2.5 flex-nowrap">
                              {log.status === 'Completed' ? (
                                <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                  Completed
                                </span>
                              ) : (
                                <>
                                  <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
                                    In Shop
                                  </span>
                                  <button
                                    onClick={() => handleResolve(log.id)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-black hover:bg-emerald-400 font-extrabold rounded-md text-[10px] uppercase tracking-wider cursor-pointer shadow-md hover:shadow-emerald-500/20 transition-all active:scale-95 whitespace-nowrap"
                                    title="Complete Service Log"
                                  >
                                    <span className="material-symbols-outlined text-[12px] font-black">check</span>
                                    Resolve
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Maintenance;
