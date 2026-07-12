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
    licenseExpiry: '',
    phone: '',
    status: 'Available'
  });
  const [error, setError] = useState('');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      addDriver(formData);
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      editDriver(currentDriver);
      setShowEditModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      licenseNumber: '',
      licenseExpiry: '',
      phone: '',
      status: 'Available'
    });
    setError('');
  };

  const openEditModal = (driver) => {
    setCurrentDriver({ ...driver });
    setError('');
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        deleteDriver(id);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Filtered List
  const filteredDrivers = drivers.filter(d => {
    const matchesSearch = 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Check if license is expired
  const isLicenseExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

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
          title="Driver Management" 
          subtitle="Manage logistics operators and license status"
          searchPlaceholder="Search drivers by name, phone..."
          searchValue={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          actions={
            <button 
              onClick={() => { resetForm(); setShowAddModal(true); }}
              className="bg-[#ff8a00] text-black px-5 py-2 rounded-full font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 text-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              Add Driver
            </button>
          }
        />

        <div className="p-6 space-y-6 flex-grow">
          {/* Controls Bar */}
          <div className="flex justify-between items-center bg-[#1A1A1A]/40 border border-[#2E2E2E] p-4 rounded-xl">
            <div className="flex items-center gap-4">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Status Filter:</span>
              <div className="flex gap-2">
                {['All', 'Available', 'Active', 'Suspended', 'Expired'].map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      statusFilter === status 
                        ? 'bg-secondary-container text-on-secondary-container' 
                        : 'bg-[#1E1E1E] text-on-surface-variant hover:bg-[#2E2E2E]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-xs text-on-surface-variant font-semibold">
              Showing {filteredDrivers.length} of {drivers.length} operators
            </div>
          </div>

          {/* Drivers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {filteredDrivers.length === 0 ? (
              <div className="col-span-full py-12 text-center text-on-surface-variant/40 border border-dashed border-[#2E2E2E] rounded-xl bg-[#1A1A1A]/20">
                No active driver profiles match the filter options.
              </div>
            ) : (
              filteredDrivers.map(driver => {
                const expired = isLicenseExpired(driver.licenseExpiry);
                return (
                  <div key={driver.id} className="glass-card p-6 rounded-xl relative flex flex-col justify-between border border-[#2E2E2E] hover:border-[#ff8a00]/30 transition-all">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-base text-on-surface">{driver.name}</h4>
                        <span className="text-xs text-on-surface-variant/75 font-mono">{driver.id}</span>
                      </div>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                        driver.status === 'Available' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                        driver.status === 'Active' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' :
                        driver.status === 'Suspended' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' :
                        'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        {driver.status}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 border-t border-[#2E2E2E]/60 pt-3 mb-5 text-xs text-on-surface-variant/90">
                      <div className="flex justify-between">
                        <span>Phone:</span>
                        <span className="text-on-surface font-semibold">{driver.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>License#:</span>
                        <span className="text-on-surface font-mono font-semibold">{driver.licenseNumber}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>License Expiry:</span>
                        <span className={`font-mono font-semibold ${expired ? 'text-red-400' : 'text-on-surface'}`}>
                          {driver.licenseExpiry} {expired && '(EXPIRED)'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 justify-end border-t border-[#2E2E2E]/60 pt-3">
                      <button 
                        onClick={() => openEditModal(driver)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E1E1E] text-on-surface border border-[#2E2E2E] hover:border-[#ff8a00] rounded text-xs transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(driver.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E1E1E] text-red-400 border border-[#2E2E2E] hover:border-red-500 rounded text-xs transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ADD DRIVER MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="glass-card w-full max-w-md rounded-xl p-6 relative">
              <h3 className="text-lg font-bold border-b border-[#2E2E2E] pb-3 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff8a00]">person_add</span>
                Add Operator Profile
              </h3>
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs flex gap-2">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  <span>{error}</span>
                </div>
              )}
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-on-surface-variant/80 font-bold uppercase">Driver Full Name</label>
                  <input
                    className="form-input"
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant/80 font-bold uppercase">Phone Number</label>
                    <input
                      className="form-input"
                      type="text"
                      required
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant/80 font-bold uppercase">License Number</label>
                    <input
                      className="form-input font-mono"
                      type="text"
                      required
                      placeholder="DL-XXXXXXXXXXX"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant/80 font-bold uppercase">License Expiry Date</label>
                    <input
                      className="form-input"
                      type="date"
                      required
                      value={formData.licenseExpiry}
                      onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant/80 font-bold uppercase">Initial Status</label>
                    <select
                      className="form-input bg-[#161616]"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Available">Available</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-4 border-t border-[#2E2E2E]">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-transparent text-on-surface-variant hover:text-white text-sm font-semibold rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#ff8a00] text-black text-sm font-bold rounded hover:opacity-90 active:scale-95 transition-all cursor-pointer"
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
          <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="glass-card w-full max-w-md rounded-xl p-6 relative">
              <h3 className="text-lg font-bold border-b border-[#2E2E2E] pb-3 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff8a00]">edit</span>
                Modify Driver Profile
              </h3>
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs flex gap-2">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  <span>{error}</span>
                </div>
              )}
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-on-surface-variant/80 font-bold uppercase">Driver Full Name</label>
                  <input
                    className="form-input"
                    type="text"
                    required
                    value={currentDriver.name}
                    onChange={(e) => setCurrentDriver({ ...currentDriver, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant/80 font-bold uppercase">Phone Number</label>
                    <input
                      className="form-input"
                      type="text"
                      required
                      value={currentDriver.phone}
                      onChange={(e) => setCurrentDriver({ ...currentDriver, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant/80 font-bold uppercase">License Number</label>
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
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant/80 font-bold uppercase">License Expiry Date</label>
                    <input
                      className="form-input"
                      type="date"
                      required
                      value={currentDriver.licenseExpiry}
                      onChange={(e) => setCurrentDriver({ ...currentDriver, licenseExpiry: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant/80 font-bold uppercase">Status</label>
                    <select
                      className="form-input bg-[#161616]"
                      value={currentDriver.status}
                      onChange={(e) => setCurrentDriver({ ...currentDriver, status: e.target.value })}
                    >
                      <option value="Available">Available</option>
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Expired">Expired (Overridden by Date)</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-4 border-t border-[#2E2E2E]">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-transparent text-on-surface-variant hover:text-white text-sm font-semibold rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#ff8a00] text-black text-sm font-bold rounded hover:opacity-90 active:scale-95 transition-all cursor-pointer"
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
