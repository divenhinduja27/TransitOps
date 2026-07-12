import React, { useState } from 'react';
import { useERP } from '../context/ERPContext';
import Header from '../components/Header';

const VehicleRegistry = () => {
  const { vehicles, addVehicle, editVehicle, deleteVehicle } = useERP();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  
  // Forms state
  const [formData, setFormData] = useState({
    registrationNumber: '',
    make: '',
    model: '',
    type: 'Container',
    capacity: '',
    lastServiceDate: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');

  // Handle Add Form Submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      addVehicle(formData);
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Edit Form Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      editVehicle(currentVehicle);
      setShowEditModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      registrationNumber: '',
      make: '',
      model: '',
      type: 'Container',
      capacity: '',
      lastServiceDate: new Date().toISOString().split('T')[0]
    });
    setError('');
  };

  const openEditModal = (vehicle) => {
    setCurrentVehicle({ ...vehicle });
    setError('');
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle from the registry?')) {
      try {
        deleteVehicle(id);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Filtered List
  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = 
      v.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <style>{`
        .glass-panel {
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
          title="Vehicle Registry" 
          subtitle="Manage enterprise fleet assets"
          searchPlaceholder="Search vehicles by reg#, brand..."
          searchValue={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          actions={
            <button 
              onClick={() => { resetForm(); setShowAddModal(true); }}
              className="bg-[#ff8a00] text-black px-5 py-2 rounded-full font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 text-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Vehicle
            </button>
          }
        />

        <div className="p-6 space-y-6 flex-grow">
          {/* Controls Bar */}
          <div className="flex justify-between items-center bg-[#1A1A1A]/40 border border-[#2E2E2E] p-4 rounded-xl">
            <div className="flex items-center gap-4">
              <span className="text-xs text-on-surface-variant font-bold uppercase">Status Filter:</span>
              <div className="flex gap-2">
                {['All', 'Available', 'Dispatched', 'In Shop'].map(status => (
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
              Showing {filteredVehicles.length} of {vehicles.length} assets
            </div>
          </div>

          {/* Fleet Inventory Table */}
          <div className="glass-panel rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#2E2E2E] text-on-surface-variant/60 text-xs font-bold uppercase bg-[#161616]/40">
                    <th className="py-4 px-4">Registration</th>
                    <th className="py-4 px-4">Manufacturer & Model</th>
                    <th className="py-4 px-4">Type</th>
                    <th className="py-4 px-4 text-right">Max Load Capacity</th>
                    <th className="py-4 px-4">Last Service</th>
                    <th className="py-4 px-4 text-center">Status</th>
                    <th className="py-4 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2E2E2E]/40">
                  {filteredVehicles.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-on-surface-variant/40">
                        No fleet vehicles match the active filters.
                      </td>
                    </tr>
                  ) : (
                    filteredVehicles.map(vehicle => (
                      <tr key={vehicle.id} className="hover:bg-[#1E1E1E]/40 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-primary">{vehicle.registrationNumber}</td>
                        <td className="py-4 px-4">
                          <span className="font-semibold text-on-surface">{vehicle.make}</span>
                          <span className="text-xs text-on-surface-variant/80 ml-2">({vehicle.model})</span>
                        </td>
                        <td className="py-4 px-4 text-xs">
                          <span className="bg-[#1E1E1E] border border-[#2E2E2E] px-2 py-1 rounded text-on-surface-variant">
                            {vehicle.type}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right font-mono font-bold">{(vehicle.capacity).toLocaleString()} kg</td>
                        <td className="py-4 px-4 text-xs font-mono text-on-surface-variant/80">{vehicle.lastServiceDate || 'N/A'}</td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${
                            vehicle.status === 'Available' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                            vehicle.status === 'Dispatched' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' :
                            'bg-red-500/10 text-red-400 border border-red-500/30'
                          }`}>
                            {vehicle.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button 
                              onClick={() => openEditModal(vehicle)}
                              className="p-1.5 text-on-surface-variant hover:text-white bg-[#1E1E1E] border border-[#2E2E2E] rounded hover:border-[#ff8a00] transition-all cursor-pointer"
                              title="Edit Vehicle"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                            </button>
                            <button 
                              onClick={() => handleDelete(vehicle.id)}
                              className="p-1.5 text-red-400 hover:text-red-300 bg-[#1E1E1E] border border-[#2E2E2E] rounded hover:border-red-500 transition-all cursor-pointer"
                              title="Delete Vehicle"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
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

        {/* ADD VEHICLE MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="glass-panel w-full max-w-md rounded-xl p-6 relative">
              <h3 className="text-lg font-bold border-b border-[#2E2E2E] pb-3 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff8a00]">directions_car</span>
                Register New Fleet Vehicle
              </h3>
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs flex gap-2">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  <span>{error}</span>
                </div>
              )}
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-on-surface-variant/80 font-bold uppercase">Registration Number</label>
                  <input
                    className="form-input font-mono uppercase"
                    type="text"
                    required
                    placeholder="e.g. MH-12-AB-1234"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant/80 font-bold uppercase">Make (Brand)</label>
                    <input
                      className="form-input"
                      type="text"
                      required
                      placeholder="Volvo, Tata..."
                      value={formData.make}
                      onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant/80 font-bold uppercase">Model</label>
                    <input
                      className="form-input"
                      type="text"
                      required
                      placeholder="FH16, Signa..."
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant/80 font-bold uppercase">Vehicle Type</label>
                    <select
                      className="form-input bg-[#161616] text-on-surface"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="Container">Container</option>
                      <option value="Heavy Truck">Heavy Truck</option>
                      <option value="Flatbed">Flatbed</option>
                      <option value="Tanker">Tanker</option>
                      <option value="Dumper">Dumper</option>
                      <option value="Cargo Van">Cargo Van</option>
                      <option value="Box Truck">Box Truck</option>
                      <option value="Trailer">Trailer</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant/80 font-bold uppercase">Max Capacity (kg)</label>
                    <input
                      className="form-input"
                      type="number"
                      required
                      placeholder="e.g. 20000"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-on-surface-variant/80 font-bold uppercase">Last Service Date</label>
                  <input
                    className="form-input"
                    type="date"
                    required
                    value={formData.lastServiceDate}
                    onChange={(e) => setFormData({ ...formData, lastServiceDate: e.target.value })}
                  />
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
                    Save Vehicle
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT VEHICLE MODAL */}
        {showEditModal && currentVehicle && (
          <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="glass-panel w-full max-w-md rounded-xl p-6 relative">
              <h3 className="text-lg font-bold border-b border-[#2E2E2E] pb-3 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff8a00]">edit</span>
                Modify Vehicle Registry
              </h3>
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs flex gap-2">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  <span>{error}</span>
                </div>
              )}
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-on-surface-variant/80 font-bold uppercase">Registration Number</label>
                  <input
                    className="form-input font-mono uppercase"
                    type="text"
                    required
                    value={currentVehicle.registrationNumber}
                    onChange={(e) => setCurrentVehicle({ ...currentVehicle, registrationNumber: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant/80 font-bold uppercase">Make (Brand)</label>
                    <input
                      className="form-input"
                      type="text"
                      required
                      value={currentVehicle.make}
                      onChange={(e) => setCurrentVehicle({ ...currentVehicle, make: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant/80 font-bold uppercase">Model</label>
                    <input
                      className="form-input"
                      type="text"
                      required
                      value={currentVehicle.model}
                      onChange={(e) => setCurrentVehicle({ ...currentVehicle, model: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant/80 font-bold uppercase">Vehicle Type</label>
                    <select
                      className="form-input bg-[#161616] text-on-surface"
                      value={currentVehicle.type}
                      onChange={(e) => setCurrentVehicle({ ...currentVehicle, type: e.target.value })}
                    >
                      <option value="Container">Container</option>
                      <option value="Heavy Truck">Heavy Truck</option>
                      <option value="Flatbed">Flatbed</option>
                      <option value="Tanker">Tanker</option>
                      <option value="Dumper">Dumper</option>
                      <option value="Cargo Van">Cargo Van</option>
                      <option value="Box Truck">Box Truck</option>
                      <option value="Trailer">Trailer</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant/80 font-bold uppercase">Max Capacity (kg)</label>
                    <input
                      className="form-input"
                      type="number"
                      required
                      value={currentVehicle.capacity}
                      onChange={(e) => setCurrentVehicle({ ...currentVehicle, capacity: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-on-surface-variant/80 font-bold uppercase">Last Service Date</label>
                  <input
                    className="form-input"
                    type="date"
                    required
                    value={currentVehicle.lastServiceDate}
                    onChange={(e) => setCurrentVehicle({ ...currentVehicle, lastServiceDate: e.target.value })}
                  />
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

export default VehicleRegistry;
