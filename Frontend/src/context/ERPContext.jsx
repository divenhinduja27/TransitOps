import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const ERPContext = createContext(null);

// Status Translation Helpers
const mapVehicleStatusFromBackend = (s) => {
  if (s === 'AVAILABLE') return 'Available';
  if (s === 'ON_TRIP') return 'Dispatched';
  if (s === 'IN_SHOP') return 'In Shop';
  if (s === 'RETIRED') return 'Retired';
  return 'Available';
};

const mapVehicleStatusToBackend = (s) => {
  if (s === 'Available') return 'AVAILABLE';
  if (s === 'Dispatched') return 'ON_TRIP';
  if (s === 'In Shop') return 'IN_SHOP';
  if (s === 'Retired') return 'RETIRED';
  return 'AVAILABLE';
};

const mapDriverStatusFromBackend = (s) => {
  if (s === 'AVAILABLE') return 'Available';
  if (s === 'ON_TRIP') return 'On Trip';
  if (s === 'OFF_DUTY') return 'Off Duty';
  if (s === 'SUSPENDED') return 'Suspended';
  return 'Available';
};

const mapDriverStatusToBackend = (s) => {
  if (s === 'Available') return 'AVAILABLE';
  if (s === 'On Trip') return 'ON_TRIP';
  if (s === 'Active') return 'ON_TRIP';
  if (s === 'Off Duty') return 'OFF_DUTY';
  if (s === 'Suspended') return 'SUSPENDED';
  return 'AVAILABLE';
};

const mapTripStatusFromBackend = (s) => {
  if (s === 'DRAFT') return 'Pending';
  if (s === 'DISPATCHED') return 'Dispatched';
  if (s === 'COMPLETED') return 'Completed';
  if (s === 'CANCELLED') return 'Cancelled';
  return 'Pending';
};

// Object Translators
const mapVehicleFromBackend = (v) => {
  const parts = v.model ? v.model.trim().split(/\s+/) : [];
  const make = parts[0] || 'Tata';
  const model = parts.length > 1 ? parts.slice(1).join(' ') : (parts[0] || '');
  return {
    id: v.id,
    registrationNumber: v.registrationNumber,
    make: make,
    model: model,
    type: v.type || 'Container',
    capacity: v.maxLoadCapacity || 10000,
    odometer: v.odometer || 0,
    acquisitionCost: v.acquisitionCost || 0,
    status: mapVehicleStatusFromBackend(v.status),
    region: v.region || 'West',
    lastServiceDate: ''
  };
};

const mapDriverFromBackend = (d) => ({
  id: d.id,
  name: d.name || '',
  licenseNumber: d.licenseNumber || '',
  category: d.licenseCategory || 'LMV',
  licenseExpiry: d.licenseExpiryDate ? d.licenseExpiryDate.substring(0, 7) : '',
  status: mapDriverStatusFromBackend(d.status),
  phone: d.contactNumber || '',
  safetyScore: d.safetyScore || 5.0,
  safetyStatus: mapDriverStatusFromBackend(d.status),
  tripCompletion: d.tripCompletion || '100%',
  userEmail: d.userEmail || '',
  userId: d.userId || null,
  licenseExpiryDate: d.licenseExpiryDate || ''
});

const mapTripFromBackend = (t) => ({
  id: t.id,
  tripId: `TRP-${1000 + t.id}`,
  vehicleId: t.vehicleId,
  driverId: t.driverId,
  origin: t.source || '',
  destination: t.destination || '',
  cargoWeight: t.cargoWeight || 0,
  status: mapTripStatusFromBackend(t.status),
  startDate: t.dispatchedAt ? t.dispatchedAt.split('T')[0] : '',
  endDate: t.completedAt ? t.completedAt.split('T')[0] : '',
  cost: t.plannedDistance ? Math.round(t.plannedDistance * 50) : 0
});

const mapMaintenanceFromBackend = (m) => ({
  id: m.id,
  vehicleId: m.vehicleId,
  serviceType: m.description || '',
  cost: m.cost || 0,
  startDate: m.logDate ? m.logDate.split('T')[0] : '',
  endDate: m.closedAt ? m.closedAt.split('T')[0] : '',
  status: m.status === 'ACTIVE' ? 'In Progress' : 'Completed'
});

const mapFuelLogFromBackend = (f) => ({
  id: f.id,
  vehicleId: f.vehicleId,
  date: f.date || (f.logDate ? f.logDate.split('T')[0] : ''),
  liters: f.liters || 0,
  cost: f.cost || 0,
  odometer: f.odometer || 0
});

const mapExpenseFromBackend = (e) => ({
  id: e.id,
  vehicleId: e.vehicleId,
  type: e.type || 'Other',
  amount: e.amount || 0,
  date: e.date || (e.expenseDate ? e.expenseDate.split('T')[0] : ''),
  description: e.description || ''
});

export const ERPProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch initial data from backend REST APIs
  const fetchAllData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const [vehiclesRes, driversRes, tripsRes, maintRes, fuelRes, expenseRes] = await Promise.all([
        api.get('/vehicles'),
        api.get('/drivers'),
        api.get('/trips'),
        api.get('/maintenance'),
        api.get('/fuel-logs'),
        api.get('/expenses')
      ]);

      setVehicles(vehiclesRes.data.map(mapVehicleFromBackend));
      setDrivers(driversRes.data.map(mapDriverFromBackend));
      setTrips(tripsRes.data.map(mapTripFromBackend));
      setMaintenance(maintRes.data.map(mapMaintenanceFromBackend));
      setFuelLogs(fuelRes.data.map(mapFuelLogFromBackend));
      setExpenses(expenseRes.data.map(mapExpenseFromBackend));
    } catch (err) {
      console.error('Failed to fetch ERP data:', err);
      setError('Failed to connect to backend service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Listen to login/logout token changes
  useEffect(() => {
    const handleStorageChange = () => {
      fetchAllData();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // --- VEHICLE ACTIONS ---
  const addVehicle = async (vehicle) => {
    const backendData = {
      registrationNumber: vehicle.registrationNumber,
      model: `${vehicle.make} ${vehicle.model}`,
      type: vehicle.type,
      maxLoadCapacity: Number(vehicle.capacity),
      odometer: Number(vehicle.odometer) || 0,
      acquisitionCost: Number(vehicle.acquisitionCost) || 0,
      region: vehicle.region
    };
    const res = await api.post('/vehicles', backendData);
    const mapped = mapVehicleFromBackend(res.data);
    setVehicles(prev => [...prev, mapped]);
    return mapped;
  };

  const editVehicle = async (updatedVehicle) => {
    const backendData = {
      registrationNumber: updatedVehicle.registrationNumber,
      model: `${updatedVehicle.make} ${updatedVehicle.model}`,
      type: updatedVehicle.type,
      maxLoadCapacity: Number(updatedVehicle.capacity),
      odometer: Number(updatedVehicle.odometer) || 0,
      acquisitionCost: Number(updatedVehicle.acquisitionCost) || 0,
      region: updatedVehicle.region,
      status: mapVehicleStatusToBackend(updatedVehicle.status)
    };
    const res = await api.put(`/vehicles/${updatedVehicle.id}`, backendData);
    const mapped = mapVehicleFromBackend(res.data);
    setVehicles(prev => prev.map(v => v.id === updatedVehicle.id ? mapped : v));
  };

  const deleteVehicle = async (id) => {
    await api.delete(`/vehicles/${id}`);
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  // --- DRIVER ACTIONS ---
  const addDriver = async (driver) => {
    let licenseExpiryStr = driver.licenseExpiry;
    if (licenseExpiryStr && licenseExpiryStr.length === 7) { // format YYYY-MM
      const parts = licenseExpiryStr.split('-');
      licenseExpiryStr = `${parts[0]}-${parts[1]}-01`;
    }

    const backendData = {
      name: driver.name,
      licenseNumber: driver.licenseNumber,
      licenseCategory: driver.category || driver.licenseCategory || 'LMV',
      licenseExpiryDate: licenseExpiryStr,
      contactNumber: driver.phone,
      safetyScore: Number(driver.safetyScore) || 5.0,
      status: mapDriverStatusToBackend(driver.status || 'Available'),
      userEmail: driver.userEmail || ''
    };
    const res = await api.post('/drivers', backendData);
    const mapped = mapDriverFromBackend(res.data);
    setDrivers(prev => [...prev, mapped]);
    return mapped;
  };

  const editDriver = async (updatedDriver) => {
    let expiryStr = updatedDriver.licenseExpiry;
    if (expiryStr && expiryStr.length === 7) {
      const parts = expiryStr.split('-');
      expiryStr = `${parts[0]}-${parts[1]}-01`;
    }

    const backendData = {
      name: updatedDriver.name,
      licenseNumber: updatedDriver.licenseNumber,
      licenseCategory: updatedDriver.category || updatedDriver.licenseCategory || 'LMV',
      licenseExpiryDate: expiryStr,
      contactNumber: updatedDriver.phone,
      safetyScore: Number(updatedDriver.safetyScore) || 5.0,
      status: mapDriverStatusToBackend(updatedDriver.status),
      userEmail: updatedDriver.userEmail || ''
    };
    const res = await api.put(`/drivers/${updatedDriver.id}`, backendData);
    const mapped = mapDriverFromBackend(res.data);
    setDrivers(prev => prev.map(d => d.id === updatedDriver.id ? mapped : d));
  };

  // --- TRIP ACTIONS ---
  const createTrip = async (trip) => {
    const vehicle = vehicles.find(v => v.id === trip.vehicleId);
    if (vehicle && vehicle.status !== 'Available') {
      throw new Error(`Vehicle is not available. Current status: ${vehicle.status}`);
    }

    const driver = drivers.find(d => d.id === trip.driverId);
    if (driver) {
      let expiryStr = driver.licenseExpiry;
      if (expiryStr && expiryStr.length === 7) {
        expiryStr = `${expiryStr}-01`;
      }
      const today = new Date();
      if (expiryStr && (new Date(expiryStr) < today || driver.status === 'Suspended')) {
        throw new Error('Cannot assign driver. Driving license has expired or driver is suspended.');
      }
    }

    const weight = Number(trip.cargoWeight);
    if (vehicle && weight > vehicle.capacity) {
      throw new Error(`Cargo weight (${weight} kg) exceeds vehicle capacity (${vehicle.capacity} kg).`);
    }

    const backendData = {
      source: trip.origin,
      destination: trip.destination,
      vehicleId: Number(trip.vehicleId),
      driverId: Number(trip.driverId),
      cargoWeight: weight,
      plannedDistance: Number(trip.plannedDistance) || Number(trip.cost) / 50 || 120
    };
    const res = await api.post('/trips', backendData);
    const mapped = mapTripFromBackend(res.data);
    setTrips(prev => [...prev, mapped]);

    if (trip.status === 'Dispatched') {
      await updateTripStatus(mapped.id, 'Dispatched');
    }
    return mapped;
  };

  const updateTripStatus = async (tripId, status, details = {}) => {
    let res;
    if (status === 'Dispatched') {
      res = await api.put(`/trips/${tripId}/dispatch`);
    } else if (status === 'Completed') {
      const backendData = {
        finalOdometer: Number(details.finalOdometer) || 0,
        fuelConsumed: Number(details.fuelConsumed) || 0,
        fuelCost: details.fuelCost ? Number(details.fuelCost) : null
      };
      res = await api.put(`/trips/${tripId}/complete`, backendData);
    } else if (status === 'Cancelled') {
      res = await api.put(`/trips/${tripId}/cancel`);
    }

    if (res) {
      await fetchAllData();
    }
  };

  // --- MAINTENANCE ACTIONS ---
  const createMaintenanceRecord = async (record) => {
    const vehicle = vehicles.find(v => v.id === record.vehicleId);
    if (vehicle && vehicle.status === 'Dispatched') {
      throw new Error('Cannot put vehicle in maintenance. It is active on an ongoing trip.');
    }

    const backendData = {
      vehicleId: Number(record.vehicleId),
      description: record.serviceType,
      cost: Number(record.cost)
    };
    const res = await api.post('/maintenance', backendData);
    const mapped = mapMaintenanceFromBackend(res.data);
    setMaintenance(prev => [...prev, mapped]);

    // Re-fetch vehicles to synchronize status update to 'In Shop'
    const vehiclesRes = await api.get('/vehicles');
    setVehicles(vehiclesRes.data.map(mapVehicleFromBackend));
    return mapped;
  };

  const completeMaintenanceRecord = async (id, endDate) => {
    const res = await api.put(`/maintenance/${id}/complete`);
    const mapped = mapMaintenanceFromBackend(res.data);
    setMaintenance(prev => prev.map(m => m.id === id ? mapped : m));

    // Re-fetch vehicles to synchronize status update to 'Available'
    const vehiclesRes = await api.get('/vehicles');
    setVehicles(vehiclesRes.data.map(mapVehicleFromBackend));
  };

  // --- BACKEND API ACTIONS FOR FUEL/EXPENSES ---
  const addFuelLog = async (log) => {
    const backendData = {
      vehicleId: Number(log.vehicleId),
      liters: Number(log.liters),
      cost: Number(log.cost),
      odometer: Number(log.odometer),
      date: log.date
    };
    const res = await api.post('/fuel-logs', backendData);
    const mapped = mapFuelLogFromBackend(res.data);
    setFuelLogs(prev => [...prev, mapped]);

    // Odometer synchronization will affect vehicle details, refresh vehicles
    const vehiclesRes = await api.get('/vehicles');
    setVehicles(vehiclesRes.data.map(mapVehicleFromBackend));
    return mapped;
  };

  const addExpense = async (expense) => {
    const backendData = {
      vehicleId: Number(expense.vehicleId),
      type: expense.type,
      amount: Number(expense.amount),
      date: expense.date,
      description: expense.description
    };
    const res = await api.post('/expenses', backendData);
    const mapped = mapExpenseFromBackend(res.data);
    setExpenses(prev => [...prev, mapped]);
    return mapped;
  };

  // --- STATS CALCULATORS ---
  const getVehicleFuelCost = (vehicleId) => {
    const targetId = String(vehicleId);
    return fuelLogs
      .filter(f => String(f.vehicleId) === targetId)
      .reduce((sum, f) => sum + Number(f.cost), 0);
  };

  const getVehicleMaintenanceCost = (vehicleId) => {
    const targetId = String(vehicleId);
    return maintenance
      .filter(m => String(m.vehicleId) === targetId)
      .reduce((sum, m) => sum + Number(m.cost), 0);
  };

  const getVehicleTollCost = (vehicleId) => {
    const targetId = String(vehicleId);
    return expenses
      .filter(e => String(e.vehicleId) === targetId && e.type === 'Toll Charges')
      .reduce((sum, e) => sum + Number(e.amount), 0);
  };

  const getVehicleMiscCost = (vehicleId) => {
    const targetId = String(vehicleId);
    return expenses
      .filter(e => String(e.vehicleId) === targetId && e.type !== 'Toll Charges')
      .reduce((sum, e) => sum + Number(e.amount), 0);
  };

  const getVehicleOperationalCost = (vehicleId) => {
    return getVehicleFuelCost(vehicleId) +
           getVehicleMaintenanceCost(vehicleId) +
           getVehicleTollCost(vehicleId) +
           getVehicleMiscCost(vehicleId);
  };

  const getVehicleRevenue = (vehicleId) => {
    const targetId = String(vehicleId);
    return trips
      .filter(t => String(t.vehicleId) === targetId && t.status === 'Completed')
      .reduce((sum, t) => sum + (Number(t.cost) * 1.4), 0);
  };

  const getVehicleHealthScore = (vehicleId) => {
    const vehicle = vehicles.find(v => String(v.id) === String(vehicleId));
    if (!vehicle) return 80;

    // 1. Fuel Efficiency
    const logs = fuelLogs.filter(f => String(f.vehicleId) === String(vehicleId));
    const liters = logs.reduce((sum, f) => sum + Number(f.liters), 0);
    const dist = logs.reduce((sum, f) => sum + (Number(f.odometer) > 1000 ? 550 : 0), 0);
    const fuelEfficiency = liters > 0 ? (dist / liters) : 8.5;
    let effScore = 50;
    if (fuelEfficiency >= 12) effScore = 100;
    else if (fuelEfficiency <= 6) effScore = 0;
    else effScore = ((fuelEfficiency - 6) / 6) * 100;

    // 2. Maintenance Frequency
    const vehicleMaint = maintenance.filter(m => String(m.vehicleId) === String(vehicleId));
    let maintFreqScore = 100 - Math.min(vehicleMaint.length * 15, 60);

    // 3. Vehicle Downtime
    const inShop = vehicle.status === 'In Shop';
    let downtimeScore = inShop ? 40 : 100;

    // 4. Operational Cost
    const cost = getVehicleOperationalCost(vehicleId);
    let opexScore = 100;
    if (cost > 10000) opexScore = Math.max(30, 100 - ((cost - 10000) / 70000) * 70);

    // 5. Vehicle Age (simulated based on id)
    const age = (Number(vehicleId) % 5) + 1;
    let ageScore = 100 - (age * 10);

    // 6. Total Trips Completed
    const completedTrips = trips.filter(t => String(t.vehicleId) === String(vehicleId) && t.status === 'Completed').length;
    let tripsScore = 70 + Math.min(completedTrips * 6, 30);

    // 7. Odometer Reading
    const odo = Number(vehicle.odometer) || 0;
    let odoScore = 100;
    if (odo > 15000) odoScore = Math.max(30, 100 - ((odo - 15000) / 135000) * 70);

    const finalScore = Math.round(
      (effScore * 0.20) +
      (maintFreqScore * 0.15) +
      (downtimeScore * 0.15) +
      (opexScore * 0.15) +
      (ageScore * 0.10) +
      (tripsScore * 0.10) +
      (odoScore * 0.15)
    );

    return Math.min(100, Math.max(0, finalScore));
  };

  const getVehicleHealthAnalysis = (vehicleId) => {
    const vehicle = vehicles.find(v => String(v.id) === String(vehicleId));
    const analysis = { reasons: [] };
    if (!vehicle) return analysis;

    const logs = fuelLogs.filter(f => String(f.vehicleId) === String(vehicleId));
    const liters = logs.reduce((sum, f) => sum + Number(f.liters), 0);
    const dist = logs.reduce((sum, f) => sum + (Number(f.odometer) > 1000 ? 550 : 0), 0);
    const fuelEfficiency = liters > 0 ? (dist / liters) : 8.5;

    const vehicleMaint = maintenance.filter(m => String(m.vehicleId) === String(vehicleId));
    const inShop = vehicle.status === 'In Shop';
    const cost = getVehicleOperationalCost(vehicleId);
    const completedTrips = trips.filter(t => String(t.vehicleId) === String(vehicleId) && t.status === 'Completed').length;
    const odo = Number(vehicle.odometer) || 0;

    if (fuelEfficiency >= 9.5) {
      analysis.reasons.push({ type: 'success', text: `Good fuel efficiency (${fuelEfficiency.toFixed(1)} km/L)` });
    } else {
      analysis.reasons.push({ type: 'warning', text: `Suboptimal fuel efficiency (${fuelEfficiency.toFixed(1)} km/L)` });
    }

    if (vehicleMaint.length <= 1) {
      analysis.reasons.push({ type: 'success', text: `Low maintenance frequency (${vehicleMaint.length} records)` });
    } else {
      analysis.reasons.push({ type: 'warning', text: `High maintenance frequency (${vehicleMaint.length} records)` });
    }

    if (odo < 50000) {
      analysis.reasons.push({ type: 'success', text: `Low mileage (${odo.toLocaleString()} km)` });
    } else {
      analysis.reasons.push({ type: 'warning', text: `High odometer reading (${odo.toLocaleString()} km)` });
    }

    if (inShop) {
      analysis.reasons.push({ type: 'critical', text: 'Vehicle currently in service shop' });
    } else {
      analysis.reasons.push({ type: 'success', text: 'Vehicle currently active and available' });
    }

    if (cost < 30000) {
      analysis.reasons.push({ type: 'success', text: `Low operational expenditure (₹${cost.toLocaleString()})` });
    } else {
      analysis.reasons.push({ type: 'warning', text: `High operational cost (₹${cost.toLocaleString()})` });
    }

    const nextMaint = vehicleMaint.length > 0 ? 'Due in 15 days' : 'Due in 5 days';

    return {
      reasons: analysis.reasons,
      fuelEfficiency: `${fuelEfficiency.toFixed(1)} km/L`,
      lastMaintenanceDate: vehicleMaint.length > 0 ? vehicleMaint[vehicleMaint.length - 1].startDate : 'None logged',
      nextRecommendedService: nextMaint
    };
  };

  const getSmartVehicleRecommendations = (cargoWeight) => {
    const available = vehicles.filter(v => v.status === 'Available' && Number(v.capacity) >= Number(cargoWeight));
    
    const scored = available.map(v => {
      const health = getVehicleHealthScore(v.id);
      
      const logs = fuelLogs.filter(f => String(f.vehicleId) === String(v.id));
      const liters = logs.reduce((sum, f) => sum + Number(f.liters), 0);
      const dist = logs.reduce((sum, f) => sum + (Number(f.odometer) > 1000 ? 550 : 0), 0);
      const efficiency = liters > 0 ? (dist / liters) : 8.5;
      const efficiencyScore = Math.min(100, (efficiency / 12) * 100);

      const opex = getVehicleOperationalCost(v.id);
      const rev = getVehicleRevenue(v.id);
      const roi = opex > 0 ? (rev / opex) * 100 : 100;
      const roiScore = Math.min(100, (roi / 150) * 100);

      const costScore = opex > 50000 ? 30 : 100 - (opex / 50000) * 70;

      const distance = ((Number(v.id) * 4) % 18) + 2; 
      const distanceScore = 100 - (distance / 20) * 80;

      const capacityRatio = cargoWeight > 0 ? Number(v.capacity) / Number(cargoWeight) : 1;
      const capacityScore = capacityRatio > 3 ? 60 : 100 - (capacityRatio - 1) * 20;

      const finalScore = Math.round(
        (health * 0.25) +
        (efficiencyScore * 0.15) +
        (roiScore * 0.15) +
        (costScore * 0.15) +
        (distanceScore * 0.20) +
        (capacityScore * 0.10)
      );

      const eta = Math.round(distance * 1.5 + 5);

      const reasons = [];
      if (distance <= 6) reasons.push("✔ Closest Vehicle");
      if (health >= 85) reasons.push("✔ Highest Health Score");
      if (opex <= 20000) reasons.push("✔ Lowest Operational Cost");
      if (efficiency >= 10) reasons.push("✔ Excellent Fuel Efficiency");
      if (capacityRatio <= 1.5) reasons.push("✔ Capacity Matches Cargo");

      return {
        vehicle: v,
        score: finalScore,
        eta,
        distance,
        efficiency: `${efficiency.toFixed(1)} km/L`,
        health,
        opex,
        roi: Math.round(roi),
        reasons: reasons.slice(0, 5)
      };
    });

    return scored.sort((a, b) => b.score - a.score).slice(0, 3);
  };

  return (
    <ERPContext.Provider
      value={{
        vehicles,
        drivers,
        trips,
        maintenance,
        fuelLogs,
        expenses,
        loading,
        error,
        refreshData: fetchAllData,
        addVehicle,
        editVehicle,
        deleteVehicle,
        addDriver,
        editDriver,
        createTrip,
        updateTripStatus,
        createMaintenanceRecord,
        completeMaintenanceRecord,
        addFuelLog,
        addExpense,
        getVehicleFuelCost,
        getVehicleMaintenanceCost,
        getVehicleTollCost,
        getVehicleMiscCost,
        getVehicleOperationalCost,
        getVehicleRevenue,
        getVehicleHealthScore,
        getVehicleHealthAnalysis,
        getSmartVehicleRecommendations
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
};
