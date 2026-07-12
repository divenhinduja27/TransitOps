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
    startDate: new Date().toISOString().split('T')[0]
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
      setSuccess('Maintenance job successfully logged. Vehicle set to "In Shop".');
      setFormData({
        vehicleId: '',
        serviceType: '',
        cost: '',
        startDate: new Date().toISOString().split('T')[0]
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

  const getVehicleName = (vehicleId) => {
    const v = vehicles.find(veh => veh.id === vehicleId);
    return v ? `${v.make} ${v.model}` : '';
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
          {/* LEFT: File Service Record */}
          <div className="xl:w-1/3 space-y-6">
            <div className="glass-card p-6 rounded-xl border border-[#2E2E2E]">
              <h3 className="text-base font-bold mb-6 pb-2 border-b border-[#2E2E2E] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff8a00]">build</span>
                New Maintenance Ticket
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

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Vehicle Choice */}
                <div className="space-y-1">
                  <label className="text-xs text-on-surface-variant font-bold uppercase">Select Fleet Vehicle</label>
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

                {/* Service type description */}
                <div className="space-y-1">
                  <label className="text-xs text-on-surface-variant font-bold uppercase">Service Details</label>
                  <textarea
                    className="form-input h-20 py-2 resize-none"
                    required
                    placeholder="e.g. Brake replacement, regular oil servicing..."
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  />
                </div>

                {/* Service budget cost */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant font-bold uppercase">Estimated Cost (₹)</label>
                    <input
                      className="form-input"
                      type="number"
                      required
                      placeholder="e.g. 5000"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant font-bold uppercase">Start Date</label>
                    <input
                      className="form-input"
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-red-500/20 text-red-400 border border-red-500/30 font-bold rounded-lg hover:bg-red-500/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  <span className="material-symbols-outlined text-[20px]">handyman</span>
                  Send Vehicle to Shop
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: Maintenance Logs */}
          <div className="flex-grow space-y-4">
            <div className="glass-card p-6 rounded-xl border border-[#2E2E2E] flex flex-col h-full">
              <h3 className="text-base font-bold mb-4 pb-2 border-b border-[#2E2E2E] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff8a00]">history</span>
                Maintenance Log History
              </h3>

              <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
                {filteredLogs.length === 0 ? (
                  <p className="text-center py-12 text-on-surface-variant/40">No maintenance tickets registered.</p>
                ) : (
                  filteredLogs.map(log => (
                    <div key={log.id} className="bg-[#1A1A1A]/70 border border-[#2E2E2E] p-4 rounded-lg flex flex-col sm:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold text-primary">{log.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                            log.status === 'Completed' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                            'bg-red-500/10 text-red-400 border border-red-500/30'
                          }`}>
                            {log.status}
                          </span>
                        </div>
                        <div className="text-sm font-semibold">
                          {getVehicleReg(log.vehicleId)}
                          <span className="text-xs text-on-surface-variant/80 font-normal ml-2">({getVehicleName(log.vehicleId)})</span>
                        </div>
                        <p className="text-xs text-on-surface-variant/90 font-medium">
                          <span className="text-on-surface font-bold">Issue:</span> {log.serviceType}
                        </p>
                        <div className="grid grid-cols-2 gap-x-6 text-[11px] text-on-surface-variant/75">
                          <div>
                            <span className="font-bold">Initiated:</span> {log.startDate}
                          </div>
                          <div>
                            <span className="font-bold">Resolved:</span> {log.endDate || 'Ongoing'}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row sm:flex-col justify-end items-center sm:items-end gap-2">
                        <span className="text-sm font-mono font-bold text-[#ff8a00] mb-0 sm:mb-2">₹{log.cost.toLocaleString()}</span>
                        {log.status === 'In Progress' && (
                          <button
                            onClick={() => handleResolve(log.id)}
                            className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded text-xs font-bold hover:bg-green-500/30 transition-all cursor-pointer"
                          >
                            Resolve Ticket
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Maintenance;
