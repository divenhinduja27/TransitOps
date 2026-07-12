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
  tripCompletion: d.tripCompletion || '100%'
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

export const ERPProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Maintain local state for fuel/expenses since they are not supported by the backend yet
  const [fuelLogs, setFuelLogs] = useState(() => {
    const local = localStorage.getItem('erp_fuel_logs');
    return local ? JSON.parse(local) : [
      { id: 'FL-401', vehicleId: 1, date: '2026-07-09', liters: 120, cost: 11400, odometer: 24500 },
      { id: 'FL-402', vehicleId: 2, date: '2026-07-11', liters: 150, cost: 14250, odometer: 12300 }
    ];
  });

  const [expenses, setExpenses] = useState(() => {
    const local = localStorage.getItem('erp_expenses');
    return local ? JSON.parse(local) : [
      { id: 'E-501', vehicleId: 1, type: 'Toll Charges', amount: 2400, date: '2026-07-11', description: 'NH-4 Toll Tax for Pune Trip' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('erp_fuel_logs', JSON.stringify(fuelLogs));
  }, [fuelLogs]);

  useEffect(() => {
    localStorage.setItem('erp_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Fetch initial data from backend REST APIs
  const fetchAllData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const [vehiclesRes, driversRes, tripsRes, maintRes] = await Promise.all([
        api.get('/vehicles'),
        api.get('/drivers'),
        api.get('/trips'),
        api.get('/maintenance')
      ]);

      setVehicles(vehiclesRes.data.map(mapVehicleFromBackend));
      setDrivers(driversRes.data.map(mapDriverFromBackend));
      setTrips(tripsRes.data.map(mapTripFromBackend));
      setMaintenance(maintRes.data.map(mapMaintenanceFromBackend));
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
      status: mapDriverStatusToBackend(driver.status || 'Available')
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
      status: mapDriverStatusToBackend(updatedDriver.status)
    };
    const res = await api.put(`/drivers/${updatedDriver.id}`, backendData);
    const mapped = mapDriverFromBackend(res.data);
    setDrivers(prev => prev.map(d => d.id === updatedDriver.id ? mapped : d));
  };

  const deleteDriver = async (id) => {
    await api.delete(`/drivers/${id}`);
    setDrivers(prev => prev.filter(d => d.id !== id));
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

  // --- LOCAL MUTATIONS FOR FUEL/EXPENSES ---
  const addFuelLog = (log) => {
    const newLog = {
      ...log,
      id: `FL-${Date.now().toString().slice(-3)}`,
      liters: Number(log.liters),
      cost: Number(log.cost),
      odometer: Number(log.odometer)
    };
    setFuelLogs(prev => [...prev, newLog]);
    return newLog;
  };

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: `E-${Date.now().toString().slice(-3)}`,
      amount: Number(expense.amount)
    };
    setExpenses(prev => [...prev, newExpense]);
    return newExpense;
  };

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
        deleteDriver,
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
        getVehicleRevenue
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
