import React, { useState } from 'react';
import { useERP } from '../context/ERPContext';
import Header from '../components/Header';

const TripManagement = () => {
  const { vehicles, drivers, trips, createTrip, updateTripStatus } = useERP();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    vehicleId: '',
    driverId: '',
    origin: '',
    destination: '',
    cargoWeight: '',
    plannedDistance: '',
    status: 'Dispatched'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Toast Notifications State
  const [toasts, setToasts] = useState([]);

  const showToast = (message, title = 'Notification', icon = 'notifications') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, title, icon }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  // Complete Trip modal state
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completeTripId, setCompleteTripId] = useState(null);
  const [completionData, setCompletionData] = useState({
    finalOdometer: '',
    fuelConsumed: '',
    fuelCost: ''
  });

  // Check if driver license is expired
  const isLicenseExpired = (expiryDate) => {
    if (!expiryDate) return false;
    let expStr = expiryDate;
    if (expStr.length === 7) { // format YYYY-MM
      expStr = `${expStr}-01`;
    }
    return new Date(expStr) < new Date();
  };

  // Dropdown options
  const availableVehicles = vehicles.filter(v => v.status === 'Available');
  const availableDrivers = drivers.filter(d => 
    d.status === 'Available' && 
    d.safetyStatus === 'Available' && 
    !isLicenseExpired(d.licenseExpiry)
  );

  const handleUpdateStatus = async (tripId, status, details = {}) => {
    setError('');
    setSuccess('');
    try {
      const trip = trips.find(t => t.id === tripId);
      const label = trip ? trip.tripId : `TRP-${tripId}`;
      await updateTripStatus(tripId, status, details);
      setSuccess(`Trip status updated to ${status}.`);
      showToast(`${label} status set to ${status} successfully.`, 'Status Updated', 'change_circle');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleOpenCompleteModal = (tripId) => {
    setCompleteTripId(tripId);
    setCompletionData({
      finalOdometer: '',
      fuelConsumed: '',
      fuelCost: ''
    });
    setError('');
    setSuccess('');
    setShowCompleteModal(true);
  };

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const trip = trips.find(t => t.id === completeTripId);
      const label = trip ? trip.tripId : `TRP-${completeTripId}`;
      await updateTripStatus(completeTripId, 'Completed', completionData);
      setSuccess('Trip successfully completed.');
      showToast(`${label} completed. Operator safety log and fuel metrics saved.`, 'Trip Completed', 'task_alt');
      setShowCompleteModal(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.vehicleId) {
      setError('Please select a vehicle.');
      return;
    }
    if (!formData.driverId) {
      setError('Please select an available driver.');
      return;
    }

    try {
      const newTrip = await createTrip(formData);
      setSuccess(`Trip ${newTrip.tripId} successfully dispatched.`);
      showToast(`${newTrip.tripId} dispatched successfully to ${formData.destination}.`, 'Route Active', 'local_shipping');
      setFormData({
        vehicleId: '',
        driverId: '',
        origin: '',
        destination: '',
        cargoWeight: '',
        plannedDistance: '',
        status: 'Dispatched'
      });
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  // Find info helpers
  const getVehicleInfo = (id) => vehicles.find(v => v.id === id);
  const getDriverInfo = (id) => drivers.find(d => d.id === id);

  const filteredTrips = trips.filter(t => {
    const matchesSearch = 
      t.tripId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <>
      <style>{`
        .glass-card {
            background: var(--bg-card);
            backdrop-filter: blur(12px);
            border: 1px solid var(--border-color);
            transition: all 250ms ease;
        }
        .form-input {
            background-color: var(--bg-app);
            border: 1px solid var(--border-color);
            color: var(--color-text-primary);
            width: 100%;
            height: 40px;
            padding: 0 12px;
            border-radius: 6px;
            outline: none;
            transition: all 250ms ease;
        }
        .form-input:focus {
            border-color: #ff8a00;
        }
        @keyframes slideIn {
            from {
                transform: translateX(120%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .animate-slide-in {
            animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes toastProgress {
            from {
                width: 100%;
            }
            to {
                width: 0%;
            }
        }
        .toast-progress {
            animation: toastProgress 4.5s linear forwards;
        }
      `}</style>

      <main className="ml-[260px] min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--color-text-secondary)] transition-all duration-200">
        <Header 
          title="Dispatch Board" 
          subtitle="Deploy fleet assets, assign crew, and monitor active lines"
          searchPlaceholder="Search trip boards by ID, depot..."
          searchValue={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="p-6 flex flex-col xl:flex-row gap-6 flex-grow">
          {/* LEFT: Dispatch Form */}
          <div className="xl:w-1/3 space-y-6">
            <div className="glass-card p-6 rounded-xl border border-[var(--border-color)]">
              <h3 className="text-base font-bold mb-6 pb-2 border-b border-[var(--border-color)] flex items-center gap-2 text-[var(--color-text-primary)]">
                <span className="material-symbols-outlined text-[#ff8a00]">edit_document</span>
                New Trip Dispatcher
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
                {/* Vehicle Selection */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-xs text-on-surface-variant font-bold uppercase">Assign Vehicle</label>
                    <span className="text-[10px] text-green-500 font-bold">{availableVehicles.length} available</span>
                  </div>
                  <select
                    className="form-input bg-[#161616]"
                    required
                    value={formData.vehicleId}
                    onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                  >
                    <option value="">-- Choose Available Vehicle --</option>
                    {availableVehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.registrationNumber} ({v.make} - Cap: {v.capacity} kg)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Driver Selection */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-xs text-on-surface-variant font-bold uppercase">Assign Driver</label>
                    <span className="text-[10px] text-green-500 font-bold">{availableDrivers.length} available</span>
                  </div>
                  <select
                    className="form-input bg-[#161616]"
                    required
                    value={formData.driverId}
                    onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                  >
                    <option value="">-- Choose Available Driver --</option>
                    {availableDrivers.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} (Lic Expiry: {d.licenseExpiry})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Routing info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant font-bold uppercase">Origin</label>
                    <input
                      className="form-input"
                      type="text"
                      required
                      placeholder="e.g. Mumbai Port"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant font-bold uppercase">Destination</label>
                    <input
                      className="form-input"
                      type="text"
                      required
                      placeholder="e.g. Pune Depot"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    />
                  </div>
                </div>

                {/* Weights & Distance */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant font-bold uppercase">Cargo Weight (kg)</label>
                    <input
                      className="form-input"
                      type="number"
                      required
                      placeholder="e.g. 15000"
                      value={formData.cargoWeight}
                      onChange={(e) => setFormData({ ...formData, cargoWeight: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant font-bold uppercase">Planned Distance (km)</label>
                    <input
                      className="form-input"
                      type="number"
                      required
                      placeholder="e.g. 120"
                      value={formData.plannedDistance}
                      onChange={(e) => setFormData({ ...formData, plannedDistance: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-[#ff8a00] text-black font-bold rounded-lg hover:opacity-90 active:scale-98 transition-all pt-1 flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                  Initialize Command Line
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: Trip Roster */}
          <div className="flex-grow space-y-4">
            <div className="glass-card p-6 rounded-xl border border-[var(--border-color)] flex flex-col h-full">
              <h3 className="text-base font-bold mb-4 pb-2 border-b border-[var(--border-color)] flex items-center gap-2 text-[var(--color-text-primary)]">
                <span className="material-symbols-outlined text-[#ff8a00]">list_alt</span>
                Dispatched Routes & Manifests
              </h3>

              <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
                {filteredTrips.length === 0 ? (
                  <p className="text-center py-12 text-[var(--color-text-muted)]">No dispatch manifests logged.</p>
                ) : (
                  filteredTrips.map(trip => {
                    const vehicle = getVehicleInfo(trip.vehicleId);
                    const driver = getDriverInfo(trip.driverId);
                    return (
                      <div key={trip.id} className="bg-[var(--bg-app)] border border-[var(--border-color)] p-4 rounded-lg flex flex-col sm:flex-row justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-bold text-primary">{trip.tripId}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              trip.status === 'Completed' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                              trip.status === 'Dispatched' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' :
                              trip.status === 'Cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                              'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                            }`}>
                              {trip.status}
                            </span>
                          </div>
                          <div className="text-sm font-semibold">
                            {trip.origin} → {trip.destination}
                          </div>
                          <div className="grid grid-cols-2 gap-x-6 text-xs text-on-surface-variant/80">
                            <div>
                              <span className="font-bold">Truck:</span> {vehicle ? vehicle.registrationNumber : trip.vehicleId} ({vehicle?.make})
                            </div>
                            <div>
                              <span className="font-bold">Operator:</span> {driver ? driver.name : trip.driverId}
                            </div>
                            <div>
                              <span className="font-bold">Cargo:</span> {trip.cargoWeight} kg
                            </div>
                            <div>
                              <span className="font-bold">Date:</span> {trip.startDate || 'Draft Phase'} {trip.endDate && `to ${trip.endDate}`}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-row sm:flex-col justify-end items-center sm:items-end gap-2">
                          <span className="text-sm font-mono font-bold text-[#ff8a00] mb-0 sm:mb-2">{trip.plannedDistance ? `${trip.plannedDistance} km` : 'N/A'}</span>
                          <div className="flex gap-2">
                            {trip.status === 'Pending' && (
                              <button
                                onClick={() => handleUpdateStatus(trip.id, 'Dispatched')}
                                className="bg-[#ff8a00] text-black px-3 py-1 rounded text-xs font-bold hover:opacity-90 transition-all cursor-pointer"
                              >
                                Dispatch
                              </button>
                            )}
                            {trip.status === 'Dispatched' && (
                              <>
                                <button
                                  onClick={() => handleOpenCompleteModal(trip.id)}
                                  className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded text-xs font-bold hover:bg-green-500/30 transition-all cursor-pointer"
                                >
                                  Complete
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(trip.id, 'Cancelled')}
                                  className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded text-xs font-bold hover:bg-red-500/30 transition-all cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
        {/* COMPLETE TRIP MODAL */}
        {showCompleteModal && (
          <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="glass-card w-full max-w-md rounded-xl p-6 relative border border-white/10 shadow-2xl">
              <h3 className="text-lg font-bold border-b border-[#2E2E2E] pb-3 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff8a00]">task_alt</span>
                Complete Trip & Record Metrics
              </h3>
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs flex gap-2">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  <span>{error}</span>
                </div>
              )}
              <form onSubmit={handleCompleteSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-xs text-on-surface-variant/80 font-bold uppercase">Final Odometer (km)</label>
                  <input
                    className="form-input"
                    type="number"
                    required
                    placeholder="e.g. 12500"
                    value={completionData.finalOdometer}
                    onChange={(e) => setCompletionData({ ...completionData, finalOdometer: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant/80 font-bold uppercase">Fuel Consumed (Liters)</label>
                    <input
                      className="form-input"
                      type="number"
                      required
                      placeholder="e.g. 150"
                      value={completionData.fuelConsumed}
                      onChange={(e) => setCompletionData({ ...completionData, fuelConsumed: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant/80 font-bold uppercase">Fuel Cost ($)</label>
                    <input
                      className="form-input"
                      type="number"
                      required
                      placeholder="e.g. 14250"
                      value={completionData.fuelCost}
                      onChange={(e) => setCompletionData({ ...completionData, fuelCost: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-4 border-t border-[#2E2E2E]">
                  <button
                    type="button"
                    onClick={() => setShowCompleteModal(false)}
                    className="px-4 py-2 bg-transparent text-on-surface-variant hover:text-white text-sm font-semibold rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-green-500 text-black text-sm font-bold rounded hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                  >
                    Complete Trip
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Floating Toast Notification Container */}
        <div className="fixed top-6 right-6 z-[9999] space-y-3 pointer-events-none">
          {toasts.map(toast => (
            <div 
              key={toast.id}
              className="pointer-events-auto p-4 rounded-xl border border-green-500/20 bg-black/90 max-w-sm animate-slide-in relative overflow-hidden shadow-2xl flex items-center gap-3 text-xs"
              style={{
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)',
                minWidth: '320px'
              }}
            >
              <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 text-green-400 shrink-0">
                <span className="material-symbols-outlined text-[18px]">{toast.icon}</span>
              </div>
              <div className="flex-grow pr-4">
                <div className="font-bold text-white tracking-wide">{toast.title}</div>
                <div className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{toast.message}</div>
              </div>
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-gray-500 hover:text-white transition shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
              {/* Progress countdown indicator */}
              <div className="absolute bottom-0 left-0 h-0.5 bg-green-500 toast-progress"></div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default TripManagement;
