import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const ERPContext = createContext(null);

<<<<<<< HEAD
const INITIAL_VEHICLES = [
  { id: 'V-101', registrationNumber: 'VAN-05', make: 'Chevrolet', model: 'Express Cargo', type: 'Container', capacity: 4500, status: 'In Shop', lastServiceDate: '2026-07-07' },
  { id: 'V-102', registrationNumber: 'TRUCK-11', make: 'BharatBenz', model: 'Gigashield 4023T', type: 'Heavy Truck', capacity: 18000, status: 'Available', lastServiceDate: '2026-06-15' },
  { id: 'V-103', registrationNumber: 'MINI-03', make: 'Tata', model: 'Ace Gold', type: 'Cargo Van', capacity: 2000, status: 'In Shop', lastServiceDate: '2026-07-10' },
  { id: 'V-104', registrationNumber: 'HR-55-XY-0045', make: 'Mahindra', model: 'Blazo X 35', type: 'Tanker', capacity: 20000, status: 'Available', lastServiceDate: '2026-07-01' },
  { id: 'V-105', registrationNumber: 'MH-43-P-8821', make: 'Volvo', model: 'FMX 460', type: 'Dumper', capacity: 16000, status: 'Available', lastServiceDate: '2026-07-09' },
  { id: 'V-106', registrationNumber: 'GJ-01-ZZ-5645', make: 'Eicher', model: 'Pro 6028', type: 'Cargo Van', capacity: 8000, status: 'Available', lastServiceDate: '2026-05-22' },
  { id: 'V-107', registrationNumber: 'WB-20-AB-1234', make: 'Tata', model: 'Ultra T.16', type: 'Box Truck', capacity: 10000, status: 'Available', lastServiceDate: '2026-06-30' },
  { id: 'V-108', registrationNumber: 'TN-07-CD-5678', make: 'Scania', model: 'R500', type: 'Trailer', capacity: 28000, status: 'Available', lastServiceDate: '2026-07-11' }
];

const INITIAL_DRIVERS = [
  { id: 'D-201', name: 'Alex', licenseNumber: 'DL-88213', category: 'LMV', licenseExpiry: '2028-12', phone: '9876543210', tripCompletion: '96%', safetyStatus: 'Available', status: 'Available' },
  { id: 'D-202', name: 'John', licenseNumber: 'DL-44120', category: 'HMV', licenseExpiry: '2025-03', phone: '9822012345', tripCompletion: '81%', safetyStatus: 'Suspended', status: 'Suspended' },
  { id: 'D-203', name: 'Priya', licenseNumber: 'DL-77031', category: 'LMV', licenseExpiry: '2027-08', phone: '9911023456', tripCompletion: '99%', safetyStatus: 'On Trip', status: 'On Trip' },
  { id: 'D-204', name: 'Suresh', licenseNumber: 'DL-90045', category: 'HMV', licenseExpiry: '2027-01', phone: '9744034567', tripCompletion: '88%', safetyStatus: 'Available', status: 'Off Duty' }
];

const INITIAL_TRIPS = [
  { id: 'T-1001', tripId: 'TRP-1001', vehicleId: 'V-103', driverId: 'D-203', origin: 'Mumbai Port (JNPT)', destination: 'Pune Logistics Park', cargoWeight: 18000, status: 'Dispatched', startDate: '2026-07-11', endDate: '', plannedDistance: 120 },
  { id: 'T-1002', tripId: 'TRP-1002', vehicleId: 'V-107', driverId: 'D-201', origin: 'Delhi Cargo Hub', destination: 'Jaipur Industrial Area', cargoWeight: 9500, status: 'Completed', startDate: '2026-07-12', endDate: '2026-07-12', plannedDistance: 270 },
  { id: 'T-1003', tripId: 'TRP-1003', vehicleId: 'V-101', driverId: 'D-201', origin: 'Kolkata Port', destination: 'Patna Warehouse', cargoWeight: 24000, status: 'Completed', startDate: '2026-07-08', endDate: '2026-07-10', plannedDistance: 580 },
  { id: 'T-1004', tripId: 'TRP-1004', vehicleId: 'V-102', driverId: 'D-204', origin: 'Chennai Dockyard', destination: 'Bangalore Depot', cargoWeight: 15000, status: 'Completed', startDate: '2026-07-05', endDate: '2026-07-07', plannedDistance: 350 },
  { id: 'T-1005', tripId: 'TRP-1005', vehicleId: 'V-108', driverId: 'D-204', origin: 'Bangalore Logistics Park', destination: 'Hyderabad Terminal', cargoWeight: 20000, status: 'Completed', startDate: '2026-07-02', endDate: '2026-07-04', plannedDistance: 620 }
];

const INITIAL_MAINTENANCE = [
  { id: 'M-301', vehicleId: 'V-101', serviceType: 'Oil Change', cost: 2500, startDate: '2026-07-07', endDate: '', status: 'In Progress' },
  { id: 'M-302', vehicleId: 'V-102', serviceType: 'Engine Repair', cost: 18000, startDate: '2026-06-12', endDate: '2026-06-15', status: 'Completed' },
  { id: 'M-303', vehicleId: 'V-103', serviceType: 'Tyre Replace', cost: 6200, startDate: '2026-07-10', endDate: '', status: 'In Progress' }
];
=======
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
  if (s === 'ON_TRIP') return 'Active';
  if (s === 'OFF_DUTY') return 'Off Duty';
  if (s === 'SUSPENDED') return 'Suspended';
  return 'Available';
};

const mapDriverStatusToBackend = (s) => {
  if (s === 'Available') return 'AVAILABLE';
  if (s === 'Active') return 'ON_TRIP';
  if (s === 'Off Duty') return 'OFF_DUTY';
  if (s === 'Suspended') return 'SUSPENDED';
  return 'AVAILABLE';
};
>>>>>>> 3072d1da07f9d9356275c5824af5480929cf9d7a

const mapTripStatusFromBackend = (s) => {
  if (s === 'DRAFT') return 'Pending';
  if (s === 'DISPATCHED') return 'Dispatched';
  if (s === 'COMPLETED') return 'Completed';
  if (s === 'CANCELLED') return 'Cancelled';
  return 'Pending';
};

// Object Translators
const mapVehicleFromBackend = (v) => ({
  id: v.id,
  registrationNumber: v.registrationNumber,
  make: v.model ? v.model.split(' ')[0] : 'Tata',
  model: v.model || '',
  type: v.type || 'Container',
  capacity: v.maxLoadCapacity || 10000,
  odometer: v.odometer || 0,
  acquisitionCost: v.acquisitionCost || 0,
  status: mapVehicleStatusFromBackend(v.status),
  region: v.region || 'West',
  lastServiceDate: ''
});

const mapDriverFromBackend = (d) => ({
  id: d.id,
  name: d.name || '',
  licenseNumber: d.licenseNumber || '',
  licenseExpiry: d.licenseExpiryDate || '',
  status: mapDriverStatusFromBackend(d.status),
  phone: d.contactNumber || '',
  safetyScore: d.safetyScore || 5.0
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
      model: updatedVehicle.model,
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
<<<<<<< HEAD
  const addDriver = (driver) => {
    let licenseExpiryStr = driver.licenseExpiry;
    if (licenseExpiryStr.length === 7) { // format YYYY-MM
      const parts = licenseExpiryStr.split('-');
      licenseExpiryStr = `${parts[0]}-${parts[1]}-01`;
    }
    const expiryDate = new Date(licenseExpiryStr);
    const today = new Date();
    
    let safetyStatus = driver.safetyStatus || 'Available';
    let status = driver.status || 'Available';

    if (expiryDate < today) {
      safetyStatus = 'Suspended';
      status = 'Suspended';
    }

    const newDriver = {
      ...driver,
      id: `D-${Date.now().toString().slice(-3)}`,
      category: driver.category || 'LMV',
      tripCompletion: driver.tripCompletion || '100%',
      safetyStatus,
      status
=======
  const addDriver = async (driver) => {
    const backendData = {
      name: driver.name,
      licenseNumber: driver.licenseNumber,
      licenseCategory: driver.licenseCategory || 'Class A',
      licenseExpiryDate: driver.licenseExpiry,
      contactNumber: driver.phone,
      safetyScore: Number(driver.safetyScore) || 5.0
>>>>>>> 3072d1da07f9d9356275c5824af5480929cf9d7a
    };
    const res = await api.post('/drivers', backendData);
    const mapped = mapDriverFromBackend(res.data);
    setDrivers(prev => [...prev, mapped]);
    return mapped;
  };

<<<<<<< HEAD
  const editDriver = (updatedDriver) => {
    let expiryStr = updatedDriver.licenseExpiry;
    if (expiryStr.length === 7) {
      const parts = expiryStr.split('-');
      expiryStr = `${parts[0]}-${parts[1]}-01`;
    }
    const expiryDate = new Date(expiryStr);
    const today = new Date();
    
    let safetyStatus = updatedDriver.safetyStatus;
    let status = updatedDriver.status;

    if (expiryDate < today) {
      safetyStatus = 'Suspended';
      status = 'Suspended';
    }

    setDrivers(prev => prev.map(d => d.id === updatedDriver.id ? { 
      ...d, 
      ...updatedDriver, 
      safetyStatus, 
      status 
    } : d));
=======
  const editDriver = async (updatedDriver) => {
    const backendData = {
      name: updatedDriver.name,
      licenseNumber: updatedDriver.licenseNumber,
      licenseCategory: updatedDriver.licenseCategory || 'Class A',
      licenseExpiryDate: updatedDriver.licenseExpiry,
      contactNumber: updatedDriver.phone,
      safetyScore: Number(updatedDriver.safetyScore) || 5.0,
      status: mapDriverStatusToBackend(updatedDriver.status)
    };
    const res = await api.put(`/drivers/${updatedDriver.id}`, backendData);
    const mapped = mapDriverFromBackend(res.data);
    setDrivers(prev => prev.map(d => d.id === updatedDriver.id ? mapped : d));
>>>>>>> 3072d1da07f9d9356275c5824af5480929cf9d7a
  };

  const deleteDriver = async (id) => {
    await api.delete(`/drivers/${id}`);
    setDrivers(prev => prev.filter(d => d.id !== id));
  };

  // --- TRIP ACTIONS ---
<<<<<<< HEAD
  const createTrip = (trip) => {
    const vehicle = vehicles.find(v => v.id === trip.vehicleId);
    if (!vehicle) throw new Error('Vehicle not found.');
    if (vehicle.status !== 'Available') {
      throw new Error(`Vehicle is not available. Current status: ${vehicle.status}`);
    }

    const driver = drivers.find(d => d.id === trip.driverId);
    if (!driver) throw new Error('Driver not found.');

    // Check expiry
    let expiryStr = driver.licenseExpiry;
    if (expiryStr.length === 7) {
      expiryStr = `${expiryStr}-01`;
    }
    const today = new Date();
    if (new Date(expiryStr) < today || driver.safetyStatus === 'Suspended') {
      throw new Error('Cannot assign driver. Driving license has expired or driver is suspended.');
    }

    const weight = Number(trip.cargoWeight);
    if (weight > vehicle.capacity) {
      throw new Error(`Cargo weight (${weight} kg) exceeds vehicle capacity (${vehicle.capacity} kg).`);
    }

    const newTrip = {
      id: `T-${Date.now().toString().slice(-3)}`,
      tripId: `TRP-${Date.now().toString().slice(-4)}`,
      vehicleId: trip.vehicleId,
      driverId: trip.driverId,
      origin: trip.origin,
      destination: trip.destination,
      cargoWeight: weight,
      status: trip.status || 'Dispatched', // default to dispatched
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      plannedDistance: Number(trip.plannedDistance) || 0
=======
  const createTrip = async (trip) => {
    const backendData = {
      source: trip.origin,
      destination: trip.destination,
      vehicleId: Number(trip.vehicleId),
      driverId: Number(trip.driverId),
      cargoWeight: Number(trip.cargoWeight),
      plannedDistance: Number(trip.cost) / 50 || 120
>>>>>>> 3072d1da07f9d9356275c5824af5480929cf9d7a
    };
    const res = await api.post('/trips', backendData);
    const mapped = mapTripFromBackend(res.data);
    setTrips(prev => [...prev, mapped]);

<<<<<<< HEAD
    setTrips(prev => [...prev, newTrip]);

    if (newTrip.status === 'Dispatched') {
      // Automatically lock vehicle and driver
      setVehicles(prev => prev.map(v => v.id === trip.vehicleId ? { ...v, status: 'Dispatched' } : v));
      setDrivers(prev => prev.map(d => d.id === trip.driverId ? { ...d, safetyStatus: 'On Trip', status: 'On Trip' } : d));
=======
    if (trip.status === 'Dispatched') {
      await updateTripStatus(mapped.id, 'Dispatched');
>>>>>>> 3072d1da07f9d9356275c5824af5480929cf9d7a
    }
    return mapped;
  };

<<<<<<< HEAD
  const updateTripStatus = (tripId, status) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;

      const oldStatus = t.status;
      const vehicleId = t.vehicleId;
      const driverId = t.driverId;

      let startDate = t.startDate;
      let endDate = t.endDate;

      if (status === 'Dispatched' && oldStatus !== 'Dispatched') {
        startDate = new Date().toISOString().split('T')[0];
        setVehicles(vPrev => vPrev.map(v => v.id === vehicleId ? { ...v, status: 'Dispatched' } : v));
        setDrivers(dPrev => dPrev.map(d => d.id === driverId ? { ...d, safetyStatus: 'On Trip', status: 'On Trip' } : d));
      } else if (status === 'Completed' && oldStatus !== 'Completed') {
        endDate = new Date().toISOString().split('T')[0];
        setVehicles(vPrev => vPrev.map(v => v.id === vehicleId ? { ...v, status: 'Available' } : v));
        setDrivers(dPrev => dPrev.map(d => d.id === driverId ? { ...d, safetyStatus: 'Available', status: 'Available' } : d));
      } else if (status === 'Cancelled' && oldStatus === 'Dispatched') {
        setVehicles(vPrev => vPrev.map(v => v.id === vehicleId ? { ...v, status: 'Available' } : v));
        setDrivers(dPrev => dPrev.map(d => d.id === driverId ? { ...d, safetyStatus: 'Available', status: 'Available' } : d));
      }

      return {
        ...t,
        status,
        startDate,
        endDate
=======
  const updateTripStatus = async (tripId, status, details = {}) => {
    let res;
    if (status === 'Dispatched') {
      res = await api.put(`/trips/${tripId}/dispatch`);
    } else if (status === 'Completed') {
      const backendData = {
        finalOdometer: Number(details.finalOdometer) || 0,
        fuelConsumed: Number(details.fuelConsumed) || 0,
        fuelCost: details.fuelCost ? Number(details.fuelCost) : null
>>>>>>> 3072d1da07f9d9356275c5824af5480929cf9d7a
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
<<<<<<< HEAD
  const createMaintenanceRecord = (record) => {
    const vehicle = vehicles.find(v => v.id === record.vehicleId);
    if (!vehicle) throw new Error('Vehicle not found.');
    if (vehicle.status === 'Dispatched') {
      throw new Error('Cannot put vehicle in maintenance. It is active on an ongoing trip.');
    }

    const recStatus = record.status || 'In Progress';
    const finishDate = recStatus === 'Completed' ? (record.startDate || new Date().toISOString().split('T')[0]) : '';

    const newRecord = {
      id: `M-${Date.now().toString().slice(-3)}`,
      vehicleId: record.vehicleId,
      serviceType: record.serviceType,
      cost: Number(record.cost),
      startDate: record.startDate || new Date().toISOString().split('T')[0],
      endDate: finishDate,
      status: recStatus
=======
  const createMaintenanceRecord = async (record) => {
    const backendData = {
      vehicleId: Number(record.vehicleId),
      description: record.serviceType,
      cost: Number(record.cost)
>>>>>>> 3072d1da07f9d9356275c5824af5480929cf9d7a
    };
    const res = await api.post('/maintenance', backendData);
    const mapped = mapMaintenanceFromBackend(res.data);
    setMaintenance(prev => [...prev, mapped]);

<<<<<<< HEAD
    setMaintenance(prev => [...prev, newRecord]);

    // Automatically transition vehicle status: In Shop if In Progress, Available if Completed
    const vehicleStatus = recStatus === 'Completed' ? 'Available' : 'In Shop';
    setVehicles(prev => prev.map(v => v.id === record.vehicleId ? { ...v, status: vehicleStatus, lastServiceDate: recStatus === 'Completed' ? (record.startDate || new Date().toISOString().split('T')[0]) : v.lastServiceDate } : v));
    return newRecord;
=======
    // Re-fetch vehicles to synchronize status update to 'In Shop'
    const vehiclesRes = await api.get('/vehicles');
    setVehicles(vehiclesRes.data.map(mapVehicleFromBackend));
    return mapped;
>>>>>>> 3072d1da07f9d9356275c5824af5480929cf9d7a
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

  const getVehicleOperationalCost = (vehicleId) => {
    const numId = Number(vehicleId);
    const fuelCost = fuelLogs.filter(f => Number(f.vehicleId) === numId).reduce((sum, f) => sum + f.cost, 0);
    const serviceCost = maintenance.filter(m => Number(m.vehicleId) === numId).reduce((sum, m) => sum + m.cost, 0);
    const miscCost = expenses.filter(e => Number(e.vehicleId) === numId).reduce((sum, e) => sum + e.amount, 0);
    return fuelCost + serviceCost + miscCost;
  };

  const getVehicleRevenue = (vehicleId) => {
    const numId = Number(vehicleId);
    return trips.filter(t => Number(t.vehicleId) === numId && t.status === 'Completed').reduce((sum, t) => sum + (t.cost * 1.4), 0);
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
