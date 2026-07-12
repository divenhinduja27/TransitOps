import React, { useState } from 'react';
import { useERP } from '../context/ERPContext';
import Header from '../components/Header';

const VehicleRegistry = () => {
  const { 
    vehicles, 
    addVehicle, 
    editVehicle, 
    deleteVehicle,
    getVehicleHealthScore,
    getVehicleHealthAnalysis,
    getVehicleOperationalCost,
    getVehicleRevenue
  } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Drawer/Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAnalysisDrawer, setShowAnalysisDrawer] = useState(false);
  const [drawerVehicleId, setDrawerVehicleId] = useState(null);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  
  // Forms state
  const [formData, setFormData] = useState({
    registrationNumber: '',
    make: '',
    model: '',
    type: 'Container',
    capacity: '',
    odometer: '',
    acquisitionCost: '',
    region: 'West'
  });
  const [error, setError] = useState('');

  // Handle Add Form Submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await addVehicle(formData);
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  // Handle Edit Form Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await editVehicle(currentVehicle);
      setShowEditModal(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      registrationNumber: '',
      make: '',
      model: '',
      type: 'Container',
      capacity: '',
      odometer: '',
      acquisitionCost: '',
      region: 'West'
    });
    setError('');
  };

  const openEditModal = (vehicle) => {
    setCurrentVehicle({
      ...vehicle,
      odometer: vehicle.odometer || 0,
      acquisitionCost: vehicle.acquisitionCost || 0,
      region: vehicle.region || 'West'
    });
    setError('');
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle from the registry?')) {
      try {
        await deleteVehicle(id);
      } catch (err) {
        alert(err.response?.data?.error || err.message);
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
      `}</style>

      <main className="ml-[260px] min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--color-text-secondary)] transition-all duration-200">
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
          <div className="flex justify-between items-center bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-xl">
            <div className="flex items-center gap-4">
              <span className="text-xs text-[var(--color-text-muted)] font-bold uppercase">Status Filter:</span>
              <div className="flex gap-2">
                {['All', 'Available', 'Dispatched', 'In Shop'].map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      statusFilter === status 
                        ? 'bg-[#ff8a00]/15 text-[#ff8a00] border border-[#ff8a00]/30' 
                        : 'bg-[var(--bg-app)] text-[var(--color-text-muted)] hover:bg-[var(--bg-card)] border border-[var(--border-color)]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-xs text-[var(--color-text-muted)] font-semibold">
              Showing {filteredVehicles.length} of {vehicles.length} assets
            </div>
          </div>

          {/* Fleet Inventory Table */}
          <div className="glass-panel rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-color)] text-[var(--color-text-muted)] text-xs font-bold uppercase bg-[var(--bg-app)]/40">
                    <th className="py-4 px-4">Registration</th>
                    <th className="py-4 px-4">Manufacturer & Model</th>
                    <th className="py-4 px-4">Type</th>
                    <th className="py-4 px-4 text-right">Max Capacity</th>
                    <th className="py-4 px-4 text-right">Odometer</th>
                    <th className="py-4 px-4 text-right">Acq. Cost</th>
                    <th className="py-4 px-4">Region</th>
                    <th className="py-4 px-4 text-center">Status</th>
                    <th className="py-4 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]/40">
                  {filteredVehicles.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="py-12 text-center text-on-surface-variant/40">
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
                        <td className="py-4 px-4 text-right font-mono">{(vehicle.odometer || 0).toLocaleString()} km</td>
                        <td className="py-4 px-4 text-right font-mono">${(vehicle.acquisitionCost || 0).toLocaleString()}</td>
                        <td className="py-4 px-4 text-xs font-semibold text-on-surface-variant/90">{vehicle.region || 'N/A'}</td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${
                            vehicle.status === 'Available' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                            vehicle.status === 'Dispatched' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' :
                            vehicle.status === 'In Shop' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' :
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

          {/* Fleet Health Overview Section */}
          <div className="space-y-4 mt-8">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff8a00]">health_and_safety</span>
                Fleet Health Analytics
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">Live wear index, fuel audit tracking, and recommended service protocols (sorted lowest health to highest).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-2">
              {[...filteredVehicles]
                .map(v => {
                  const score = getVehicleHealthScore(v.id);
                  const analysis = getVehicleHealthAnalysis(v.id);
                  const opex = getVehicleOperationalCost(v.id);
                  const revenue = getVehicleRevenue(v.id);
                  const roi = opex > 0 ? Math.round((revenue / opex) * 100) : 100;
                  return { vehicle: v, score, analysis, opex, roi };
                })
                .sort((a, b) => a.score - b.score)
                .map(({ vehicle, score, analysis, opex, roi }) => {
                  const color = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : score >= 40 ? '#FF8A00' : '#EF4444';
                  const label = score >= 80 ? 'Healthy' : score >= 60 ? 'Needs Attention' : score >= 40 ? 'Service Recommended' : 'Critical';
                  
                  return (
                    <div key={vehicle.id} className="glass-panel p-5 rounded-xl border border-[var(--border-color)] space-y-4 hover:shadow-lg transition-all relative overflow-hidden group">
                      {/* Top status indicator strip */}
                      <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: color }}></div>

                      <div className="flex justify-between items-start pt-1">
                        <div>
                          <h4 className="font-mono font-bold text-[var(--color-text-primary)]">{vehicle.registrationNumber}</h4>
                          <span className="text-[10px] text-[var(--color-text-muted)]">{vehicle.make} ({vehicle.model})</span>
                        </div>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                          vehicle.status === 'Available' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                          vehicle.status === 'Dispatched' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' :
                          vehicle.status === 'In Shop' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' :
                          'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}>
                          {vehicle.status}
                        </span>
                      </div>

                      {/* Health Score Circular & Bar Indicator */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold" style={{ color: color }}>{label}</span>
                          <span className="font-mono font-bold text-[var(--color-text-primary)]">{score}/100</span>
                        </div>
                        {/* Animated Horizontal Progress Bar */}
                        <div className="w-full bg-[var(--bg-app)] border border-[var(--border-color)] h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ 
                              width: `${score}%`, 
                              backgroundColor: color 
                            }}
                          />
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[11px] pt-1 text-[var(--color-text-secondary)] border-t border-[var(--border-color)]/20">
                        <div>
                          <span className="text-[10px] text-[var(--color-text-muted)] block uppercase font-semibold">Last Maintenance</span>
                          <span className="font-medium">{analysis.lastMaintenanceDate || 'None logged'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--color-text-muted)] block uppercase font-semibold">Recommended Service</span>
                          <span className="font-medium text-[#ff8a00]">{analysis.nextRecommendedService}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--color-text-muted)] block uppercase font-semibold">Fuel Efficiency</span>
                          <span className="font-medium">{analysis.fuelEfficiency}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--color-text-muted)] block uppercase font-semibold">Operational Cost</span>
                          <span className="font-medium font-mono">₹{opex.toLocaleString()}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[10px] text-[var(--color-text-muted)] block uppercase font-semibold">Vehicle ROI</span>
                          <span className="font-bold text-[var(--color-text-primary)]">{roi}%</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => { setDrawerVehicleId(vehicle.id); setShowAnalysisDrawer(true); }}
                        className="w-full py-2 bg-[var(--bg-app)] hover:bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--color-text-primary)] hover:border-[#ff8a00] rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[15px]">troubleshoot</span>
                        View Analysis
                      </button>
                    </div>
                  );
                })}
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant/80 font-bold uppercase">Odometer (km)</label>
                    <input
                      className="form-input"
                      type="number"
                      required
                      placeholder="e.g. 15000"
                      value={formData.odometer}
                      onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant/80 font-bold uppercase">Acquisition Cost ($)</label>
                    <input
                      className="form-input"
                      type="number"
                      required
                      placeholder="e.g. 45000"
                      value={formData.acquisitionCost}
                      onChange={(e) => setFormData({ ...formData, acquisitionCost: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-on-surface-variant/80 font-bold uppercase">Region</label>
                  <input
                    className="form-input"
                    type="text"
                    required
                    placeholder="e.g. West, North-East"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant/80 font-bold uppercase">Odometer (km)</label>
                    <input
                      className="form-input"
                      type="number"
                      required
                      value={currentVehicle.odometer}
                      onChange={(e) => setCurrentVehicle({ ...currentVehicle, odometer: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant/80 font-bold uppercase">Acquisition Cost ($)</label>
                    <input
                      className="form-input"
                      type="number"
                      required
                      value={currentVehicle.acquisitionCost}
                      onChange={(e) => setCurrentVehicle({ ...currentVehicle, acquisitionCost: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant/80 font-bold uppercase">Region</label>
                    <input
                      className="form-input"
                      type="text"
                      required
                      value={currentVehicle.region}
                      onChange={(e) => setCurrentVehicle({ ...currentVehicle, region: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant/80 font-bold uppercase">Status</label>
                    <select
                      className="form-input bg-[#161616]"
                      value={currentVehicle.status}
                      onChange={(e) => setCurrentVehicle({ ...currentVehicle, status: e.target.value })}
                    >
                      <option value="Available">Available</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="In Shop">In Shop</option>
                      <option value="Retired">Retired</option>
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

        {/* VIEW ANALYSIS DRAWER */}
        {showAnalysisDrawer && drawerVehicleId && (() => {
          const v = vehicles.find(veh => veh.id === drawerVehicleId);
          if (!v) return null;
          const score = getVehicleHealthScore(v.id);
          const analysis = getVehicleHealthAnalysis(v.id);
          const color = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : score >= 40 ? '#FF8A00' : '#EF4444';
          const label = score >= 80 ? 'Healthy' : score >= 60 ? 'Needs Attention' : score >= 40 ? 'Service Recommended' : 'Critical';

          return (
            <div className="fixed inset-0 bg-black/75 z-50 flex justify-end backdrop-blur-sm transition-all duration-300">
              <div className="bg-[var(--bg-card)] border-l border-[var(--border-color)] w-full max-w-md h-full p-6 relative flex flex-col justify-between shadow-2xl animate-slide-in">
                <div>
                  <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-4 mb-6">
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#ff8a00]">analytics</span>
                      Health Audit: {v.registrationNumber}
                    </h3>
                    <button 
                      onClick={() => setShowAnalysisDrawer(false)}
                      className="p-1 rounded hover:bg-[var(--bg-app)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Score Ring Summary */}
                    <div className="flex items-center gap-4 bg-[var(--bg-app)]/50 p-4 rounded-xl border border-[var(--border-color)]">
                      <div 
                        className="w-16 h-16 rounded-full border-4 flex items-center justify-center font-mono text-lg font-bold"
                        style={{ borderColor: color, color: color }}
                      >
                        {score}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[var(--color-text-primary)]">{label}</h4>
                        <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">Overall Health Rating Index</p>
                      </div>
                    </div>

                    {/* Breakdown Reasons */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Diagnostic Logs</h4>
                      <div className="space-y-2">
                        {analysis.reasons.map((r, idx) => (
                          <div 
                            key={idx} 
                            className={`p-3 rounded-lg border text-xs flex gap-2.5 items-start ${
                              r.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                              r.type === 'warning' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                              'bg-red-500/10 border-red-500/20 text-red-400'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[16px] mt-0.5">
                              {r.type === 'success' ? 'check_circle' : r.type === 'warning' ? 'warning' : 'cancel'}
                            </span>
                            <span>{r.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Live Parameters */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Live Metrics</h4>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-[var(--bg-app)]/40 p-3 rounded-lg border border-[var(--border-color)]">
                          <span className="text-[var(--color-text-muted)] text-[10px] block uppercase font-semibold">Fuel Efficiency</span>
                          <span className="font-bold text-[var(--color-text-primary)] mt-0.5 block">{analysis.fuelEfficiency}</span>
                        </div>
                        <div className="bg-[var(--bg-app)]/40 p-3 rounded-lg border border-[var(--border-color)]">
                          <span className="text-[var(--color-text-muted)] text-[10px] block uppercase font-semibold">Odo Limit</span>
                          <span className="font-bold text-[var(--color-text-primary)] mt-0.5 block">{(v.odometer || 0).toLocaleString()} km</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[var(--border-color)] pt-4 mt-6">
                  <button 
                    onClick={() => setShowAnalysisDrawer(false)}
                    className="w-full py-2.5 bg-[#ff8a00] hover:bg-[#e07b00] text-black font-bold rounded-lg text-sm transition-all cursor-pointer"
                  >
                    Dismiss Audit
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </main>
    </>
  );
};

export default VehicleRegistry;
