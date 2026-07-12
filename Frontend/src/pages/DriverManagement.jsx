import React, { useState } from 'react';
import { useERP } from '../context/ERPContext';
import Header from '../components/Header';

const DriverManagement = () => {
  const { drivers, addDriver, editDriver, deleteDriver } = useERP();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentDriver, setCurrentDriver] = useState(null);
  
  // Forms state
  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    category: 'LMV',
    licenseExpiry: '',
    phone: '',
    tripCompletion: '100%',
    safetyStatus: 'Available',
    status: 'Available'
  });
  const [error, setError] = useState('');

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await addDriver(formData);
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await editDriver(currentDriver);
      setShowEditModal(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      licenseNumber: '',
      category: 'LMV',
      licenseExpiry: '',
      phone: '',
      tripCompletion: '100%',
      safetyStatus: 'Available',
      status: 'Available'
    });
    setError('');
  };

  const openEditModal = (driver) => {
    setCurrentDriver({ ...driver });
    setError('');
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        await deleteDriver(id);
      } catch (err) {
        alert(err.response?.data?.error || err.message);
      }
    }
  };

  // Check if license is expired
  const isLicenseExpired = (expiryDate) => {
    if (!expiryDate) return false;
    let expStr = expiryDate;
    if (expStr.length === 7) { // format YYYY-MM
      expStr = `${expStr}-01`;
    }
    return new Date(expStr) < new Date();
  };

  // Format expiry for display (e.g., YYYY-MM -> MM/YYYY)
  const formatExpiry = (expiryDate) => {
    if (!expiryDate) return '';
    const parts = expiryDate.split('-');
    if (parts.length >= 2) {
      return `${parts[1]}/${parts[0]}`;
    }
    return expiryDate;
  };

  // Mask middle contact digits for preview matching blueprint style (e.g. 98765xxxxx)
  const formatContact = (phone) => {
    if (!phone) return '';
    const clean = phone.replace(/[^0-9]/g, '');
    if (clean.length >= 5) {
      return clean.slice(0, 5) + 'xxxxx';
    }
    return phone;
  };

  // Filtered List
  const filteredDrivers = drivers.filter(d => {
    const matchesSearch = 
      (d.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.licenseNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.phone || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Dynamic counter calculators for bottom TOGGLE STAT bar
  const getStatusCount = (statusVal) => {
    return drivers.filter(d => d.status === statusVal).length;
  };

  const handleStatusToggleClick = (statusVal) => {
    if (statusFilter === statusVal) {
      setStatusFilter('All');
    } else {
      setStatusFilter(statusVal);
    }
  };

  // CSS badges styled specifically matching blueprint colors
  const getSafetyBadgeClass = (sStatus, expired) => {
    if (expired || sStatus === 'Suspended') {
      return 'bg-orange-500/15 text-orange-400 border border-orange-500/30';
    }
    if (sStatus === 'On Trip') {
      return 'bg-[#204c5a] text-cyan-300 border border-[#204c5a]';
    }
    return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
  };

  const getGeneralStatusBadgeClass = (status, expired) => {
    if (expired || status === 'Suspended') {
      return 'bg-orange-500/15 text-orange-400 border border-orange-500/30';
    }
    if (status === 'On Trip') {
      return 'bg-[#204c5a] text-cyan-300 border border-[#204c5a]';
    }
    if (status === 'Off Duty') {
      return 'bg-zinc-500/15 text-zinc-400 border border-zinc-500/30';
    }
    return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
  };

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
        .table-row {
          border-bottom: 1px solid var(--border-color);
          transition: background 0.2s;
        }
        .table-row:hover {
          background-color: var(--bg-app);
        }
      `}</style>

      <main className="ml-[260px] min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--color-text-secondary)] transition-all duration-200">
        <Header 
          title="Drivers & Safety Profiles" 
          subtitle="Manage operator licensing, safety clearance, and deployment logs"
          searchPlaceholder="Search..."
          searchValue={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="p-6 space-y-6 flex-grow flex flex-col justify-between">
          
          {/* Main Content Area */}
          <div className="space-y-6">
            
            {/* Action Bar */}
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff8a00]">badge</span>
                Operator Registry
              </h3>
              
              <button 
                onClick={() => { resetForm(); setShowAddModal(true); }}
                className="bg-[#ff8a00] hover:bg-[#e07b00] text-black px-6 py-2 rounded-full font-bold hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 text-xs shadow-lg shadow-orange-500/10 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">person_add</span>
                Add Driver
              </button>
            </div>

            {/* Drivers Table matching Blueprint */}
            <div className="glass-card rounded-xl border border-[var(--border-color)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] text-[var(--color-text-muted)] font-bold uppercase tracking-wider bg-white/[0.01]">
                      <th className="py-4 px-6">Driver</th>
                      <th className="py-4 px-6">License No.</th>
                      <th className="py-4 px-6">Category</th>
                      <th className="py-4 px-6">Expiry</th>
                      <th className="py-4 px-6">Contact</th>
                      <th className="py-4 px-6">Trip Compl.</th>
                      <th className="py-4 px-6">Safety</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDrivers.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="py-12 text-center text-on-surface-variant/40">
                          No active driver profiles match the search parameters.
                        </td>
                      </tr>
                    ) : (
                      filteredDrivers.map(driver => {
                        const expired = isLicenseExpired(driver.licenseExpiry);
                        return (
                          <tr key={driver.id} className="table-row">
                            <td className="py-4 px-6 font-semibold text-white">{driver.name}</td>
                            <td className="py-4 px-6 font-mono text-on-surface-variant/90">{driver.licenseNumber}</td>
                            <td className="py-4 px-6 font-semibold text-[#ff8a00]/90">{driver.category || 'LMV'}</td>
                            <td className="py-4 px-6 font-mono">
                              <span className={expired ? 'text-orange-400 font-bold' : ''}>
                                {formatExpiry(driver.licenseExpiry)}
                              </span>
                              {expired && <span className="ml-1 text-[10px] text-orange-400 font-extrabold uppercase">Expired</span>}
                            </td>
                            <td className="py-4 px-6 font-mono text-on-surface-variant/85">{formatContact(driver.phone)}</td>
                            <td className="py-4 px-6 font-bold">{driver.tripCompletion || '100%'}</td>
                            <td className="py-4 px-6">
                              <span className={`px-3 py-1 rounded-lg font-bold text-[10px] ${getSafetyBadgeClass(driver.safetyStatus, expired)}`}>
                                {expired ? 'Suspended' : driver.safetyStatus || 'Available'}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-3 py-1 rounded-lg font-bold text-[10px] ${getGeneralStatusBadgeClass(driver.status, expired)}`}>
                                {expired ? 'Suspended' : driver.status || 'Available'}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right space-x-2">
                              <button 
                                onClick={() => openEditModal(driver)}
                                className="px-2.5 py-1 bg-white/[0.03] border border-white/[0.08] hover:border-[#ff8a00]/50 hover:text-white rounded transition-all cursor-pointer inline-flex items-center gap-1"
                                title="Edit Profile"
                              >
                                <span className="material-symbols-outlined text-[14px]">edit</span>
                              </button>
                              <button 
                                onClick={() => handleDelete(driver.id)}
                                className="px-2.5 py-1 bg-white/[0.03] border border-white/[0.08] hover:border-red-500/50 hover:text-red-400 rounded transition-all cursor-pointer inline-flex items-center gap-1"
                                title="Delete Profile"
                              >
                                <span className="material-symbols-outlined text-[14px]">delete</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Bottom Control Bar with Counters */}
          <div className="space-y-3 pt-6 border-t border-[#2E2E2E]/60">
            
            {/* TOGGLE STAT Row with counters */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant/60">Toggle Stat:</span>
              
              <button
                onClick={() => setStatusFilter('All')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border flex items-center gap-2 ${
                  statusFilter === 'All'
                    ? 'bg-[#1E1E24] text-white border-white/20'
                    : 'bg-[#141416]/40 text-on-surface-variant/60 border-white/[0.03] hover:text-white hover:bg-[#1E1E24]'
                }`}
              >
                <span>All</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold ${
                  statusFilter === 'All' ? 'bg-white/20 text-white' : 'bg-white/5 text-on-surface-variant/50'
                }`}>
                  {drivers.length}
                </span>
              </button>

              <button
                onClick={() => handleStatusToggleClick('Available')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border flex items-center gap-2 ${
                  statusFilter === 'Available'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                    : 'bg-[#141416]/40 text-on-surface-variant/60 border-white/[0.03] hover:text-emerald-400 hover:bg-emerald-500/10'
                }`}
              >
                <span>Available</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold ${
                  statusFilter === 'Available' ? 'bg-emerald-500/30 text-emerald-400' : 'bg-emerald-500/5 text-emerald-500/30'
                }`}>
                  {getStatusCount('Available')}
                </span>
              </button>

              <button
                onClick={() => handleStatusToggleClick('On Trip')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border flex items-center gap-2 ${
                  statusFilter === 'On Trip'
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                    : 'bg-[#141416]/40 text-on-surface-variant/60 border-white/[0.03] hover:text-cyan-400 hover:bg-cyan-500/10'
                }`}
              >
                <span>On Trip</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold ${
                  statusFilter === 'On Trip' ? 'bg-cyan-500/30 text-cyan-400' : 'bg-cyan-500/5 text-cyan-500/30'
                }`}>
                  {getStatusCount('On Trip')}
                </span>
              </button>

              <button
                onClick={() => handleStatusToggleClick('Off Duty')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border flex items-center gap-2 ${
                  statusFilter === 'Off Duty'
                    ? 'bg-zinc-500/20 text-zinc-400 border-zinc-500/40'
                    : 'bg-[#141416]/40 text-on-surface-variant/60 border-white/[0.03] hover:text-zinc-400 hover:bg-[#1E1E24]'
                }`}
              >
                <span>Off Duty</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold ${
                  statusFilter === 'Off Duty' ? 'bg-zinc-500/30 text-zinc-300' : 'bg-zinc-500/5 text-zinc-500/30'
                }`}>
                  {getStatusCount('Off Duty')}
                </span>
              </button>

              <button
                onClick={() => handleStatusToggleClick('Suspended')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border flex items-center gap-2 ${
                  statusFilter === 'Suspended'
                    ? 'bg-orange-500/20 text-orange-400 border-orange-500/40 shadow-lg shadow-orange-500/5'
                    : 'bg-[#141416]/40 text-on-surface-variant/60 border-white/[0.03] hover:text-orange-400 hover:bg-orange-500/10'
                }`}
              >
                <span>Suspended</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold ${
                  statusFilter === 'Suspended' ? 'bg-orange-500/30 text-orange-400' : 'bg-orange-500/5 text-orange-500/30'
                }`}>
                  {getStatusCount('Suspended')}
                </span>
              </button>
            </div>
          </div>

        </div>

        {/* ADD DRIVER MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="glass-card w-full max-w-md rounded-xl p-6 relative border border-white/10 shadow-2xl">
              <h3 className="text-base font-bold border-b border-[#2E2E2E] pb-3 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff8a00]">person_add</span>
                Add Operator Profile
              </h3>
              {error && (
                <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg text-xs flex gap-2">
                  <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
                  <span>{error}</span>
                </div>
              )}
              <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-on-surface-variant/80 font-bold uppercase">Driver Full Name</label>
                  <input
                    className="form-input"
                    type="text"
                    required
                    placeholder="Alex"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-on-surface-variant/80 font-bold uppercase">Contact Number</label>
                    <input
                      className="form-input"
                      type="text"
                      required
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-on-surface-variant/80 font-bold uppercase">License Number</label>
                    <input
                      className="form-input font-mono"
                      type="text"
                      required
                      placeholder="DL-88213"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-on-surface-variant/80 font-bold uppercase">License Category</label>
                    <select
                      className="form-input bg-[#161616]"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="LMV">LMV (Light Motor)</option>
                      <option value="HMV">HMV (Heavy Motor)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-on-surface-variant/80 font-bold uppercase">License Expiry (YYYY-MM)</label>
                    <input
                      className="form-input"
                      type="month"
                      required
                      value={formData.licenseExpiry}
                      onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-on-surface-variant/80 font-bold uppercase">Trip Completion Rate (%)</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="e.g. 96%"
                      value={formData.tripCompletion}
                      onChange={(e) => setFormData({ ...formData, tripCompletion: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-on-surface-variant/80 font-bold uppercase">Safety Status</label>
                    <select
                      className="form-input bg-[#161616]"
                      value={formData.safetyStatus}
                      onChange={(e) => setFormData({ ...formData, safetyStatus: e.target.value })}
                    >
                      <option value="Available">Available</option>
                      <option value="Suspended">Suspended</option>
                      <option value="On Trip">On Trip</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-on-surface-variant/80 font-bold uppercase">General Status</label>
                  <select
                    className="form-input bg-[#161616]"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Available">Available</option>
                    <option value="Suspended">Suspended</option>
                    <option value="On Trip">On Trip</option>
                    <option value="Off Duty">Off Duty</option>
                  </select>
                </div>
                <div className="flex gap-3 justify-end pt-4 border-t border-[var(--border-color)] mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] font-semibold rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#ff8a00] text-black font-bold rounded hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                  >
                    Save Driver
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT DRIVER MODAL */}
        {showEditModal && currentDriver && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="glass-card w-full max-w-md rounded-xl p-6 relative border border-[var(--border-color)] shadow-2xl">
              <h3 className="text-base font-bold border-b border-[var(--border-color)] pb-3 mb-4 flex items-center gap-2 text-[var(--color-text-primary)]">
                <span className="material-symbols-outlined text-[#ff8a00]">edit</span>
                Modify Driver Profile
              </h3>
              {error && (
                <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg text-xs flex gap-2">
                  <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
                  <span>{error}</span>
                </div>
              )}
              <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-on-surface-variant/80 font-bold uppercase">Driver Full Name</label>
                  <input
                    className="form-input"
                    type="text"
                    required
                    value={currentDriver.name}
                    onChange={(e) => setCurrentDriver({ ...currentDriver, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-on-surface-variant/80 font-bold uppercase">Contact Number</label>
                    <input
                      className="form-input"
                      type="text"
                      required
                      value={currentDriver.phone}
                      onChange={(e) => setCurrentDriver({ ...currentDriver, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-on-surface-variant/80 font-bold uppercase">License Number</label>
                    <input
                      className="form-input font-mono"
                      type="text"
                      required
                      value={currentDriver.licenseNumber}
                      onChange={(e) => setCurrentDriver({ ...currentDriver, licenseNumber: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-on-surface-variant/80 font-bold uppercase">License Category</label>
                    <select
                      className="form-input bg-[#161616]"
                      value={currentDriver.category || 'LMV'}
                      onChange={(e) => setCurrentDriver({ ...currentDriver, category: e.target.value })}
                    >
                      <option value="LMV">LMV (Light Motor)</option>
                      <option value="HMV">HMV (Heavy Motor)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-on-surface-variant/80 font-bold uppercase">License Expiry (YYYY-MM)</label>
                    <input
                      className="form-input"
                      type="month"
                      required
                      value={currentDriver.licenseExpiry}
                      onChange={(e) => setCurrentDriver({ ...currentDriver, licenseExpiry: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-on-surface-variant/80 font-bold uppercase">Trip Completion Rate (%)</label>
                    <input
                      className="form-input"
                      type="text"
                      value={currentDriver.tripCompletion || '100%'}
                      onChange={(e) => setCurrentDriver({ ...currentDriver, tripCompletion: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-on-surface-variant/80 font-bold uppercase">Safety Status</label>
                    <select
                      className="form-input bg-[#161616]"
                      value={currentDriver.safetyStatus || 'Available'}
                      onChange={(e) => setCurrentDriver({ ...currentDriver, safetyStatus: e.target.value })}
                    >
                      <option value="Available">Available</option>
                      <option value="Suspended">Suspended</option>
                      <option value="On Trip">On Trip</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-on-surface-variant/80 font-bold uppercase">General Status</label>
                  <select
                    className="form-input bg-[#161616]"
                    value={currentDriver.status || 'Available'}
                    onChange={(e) => setCurrentDriver({ ...currentDriver, status: e.target.value })}
                  >
                    <option value="Available">Available</option>
                    <option value="Suspended">Suspended</option>
                    <option value="On Trip">On Trip</option>
                    <option value="Off Duty">Off Duty</option>
                  </select>
                </div>
                <div className="flex gap-3 justify-end pt-4 border-t border-[var(--border-color)] mt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] font-semibold rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#ff8a00] text-black font-bold rounded hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                  >
                    Apply Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default DriverManagement;
