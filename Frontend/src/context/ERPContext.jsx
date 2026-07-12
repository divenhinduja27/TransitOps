import React, { createContext, useContext, useState, useEffect } from 'react';

const ERPContext = createContext(null);

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

const INITIAL_FUEL_LOGS = [
  { id: 'FL-401', vehicleId: 'V-101', date: '2026-07-09', liters: 120, cost: 11400, odometer: 24500 },
  { id: 'FL-402', vehicleId: 'V-103', date: '2026-07-11', liters: 150, cost: 14250, odometer: 12300 },
  { id: 'FL-403', vehicleId: 'V-107', date: '2026-07-12', liters: 80, cost: 7600, odometer: 34100 },
  { id: 'FL-404', vehicleId: 'V-102', date: '2026-07-06', liters: 90, cost: 8550, odometer: 18900 }
];

const INITIAL_EXPENSES = [
  { id: 'E-501', vehicleId: 'V-103', type: 'Toll Charges', amount: 2400, date: '2026-07-11', description: 'NH-4 Toll Tax for Pune Trip' },
  { id: 'E-502', vehicleId: 'V-107', type: 'Driver Allowance', amount: 1500, date: '2026-07-12', description: 'Meal & Night Halt Allowance' },
  { id: 'E-503', vehicleId: 'V-101', type: 'State Permit Fee', amount: 4500, date: '2026-07-08', description: 'UP State Entry Permit' }
];

export const ERPProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState(() => {
    const local = localStorage.getItem('erp_vehicles');
    let loaded = local ? JSON.parse(local) : INITIAL_VEHICLES;
    const hasRetired = loaded.some(v => v.status === 'Retired');
    if (!hasRetired) {
      loaded = [
        ...loaded,
        { id: 'V-109', registrationNumber: 'MH-12-RS-9981', make: 'Ashok Leyland', model: 'Taurus 2518', type: 'Dumper', capacity: 15000, status: 'Retired', lastServiceDate: '2025-10-12' },
        { id: 'V-110', registrationNumber: 'DL-3C-BB-0092', make: 'Tata', model: 'LPT 1613', type: 'Cargo Van', capacity: 9000, status: 'Retired', lastServiceDate: '2024-04-18' }
      ];
    }
    return loaded;
  });

  const [drivers, setDrivers] = useState(() => {
    const local = localStorage.getItem('erp_drivers');
    return local ? JSON.parse(local) : INITIAL_DRIVERS;
  });

  const [trips, setTrips] = useState(() => {
    const local = localStorage.getItem('erp_trips');
    let loaded = local ? JSON.parse(local) : INITIAL_TRIPS;
    const hasPending = loaded.some(t => t.status === 'Pending');
    if (!hasPending) {
      loaded = [
        ...loaded,
        { id: 'T-1006', tripId: 'TRP-1006', vehicleId: 'V-104', driverId: 'D-204', origin: 'Bangalore Depot', destination: 'Chennai Dockyard', cargoWeight: 12000, status: 'Pending', startDate: '2026-07-12', endDate: '', cost: 11000 }
      ];
    }
    return loaded;
  });

  const [maintenance, setMaintenance] = useState(() => {
    const local = localStorage.getItem('erp_maintenance');
    return local ? JSON.parse(local) : INITIAL_MAINTENANCE;
  });

  const [fuelLogs, setFuelLogs] = useState(() => {
    const local = localStorage.getItem('erp_fuel_logs');
    return local ? JSON.parse(local) : INITIAL_FUEL_LOGS;
  });

  const [expenses, setExpenses] = useState(() => {
    const local = localStorage.getItem('erp_expenses');
    return local ? JSON.parse(local) : INITIAL_EXPENSES;
  });

  useEffect(() => {
    localStorage.setItem('erp_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('erp_drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('erp_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('erp_maintenance', JSON.stringify(maintenance));
  }, [maintenance]);

  useEffect(() => {
    localStorage.setItem('erp_fuel_logs', JSON.stringify(fuelLogs));
  }, [fuelLogs]);

  useEffect(() => {
    localStorage.setItem('erp_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // --- VEHICLE ACTIONS ---
  const addVehicle = (vehicle) => {
    const exists = vehicles.some(
      v => v.registrationNumber.toLowerCase().replace(/\s+/g, '') === 
           vehicle.registrationNumber.toLowerCase().replace(/\s+/g, '')
    );
    if (exists) {
      throw new Error(`Vehicle registration number ${vehicle.registrationNumber} already exists.`);
    }
    const newVehicle = {
      ...vehicle,
      id: `V-${Date.now().toString().slice(-3)}`,
      capacity: Number(vehicle.capacity),
      status: 'Available'
    };
    setVehicles(prev => [...prev, newVehicle]);
    return newVehicle;
  };

  const editVehicle = (updatedVehicle) => {
    const exists = vehicles.some(
      v => v.id !== updatedVehicle.id &&
           v.registrationNumber.toLowerCase().replace(/\s+/g, '') === 
           updatedVehicle.registrationNumber.toLowerCase().replace(/\s+/g, '')
    );
    if (exists) {
      throw new Error(`Vehicle registration number ${updatedVehicle.registrationNumber} already exists.`);
    }
    setVehicles(prev => prev.map(v => v.id === updatedVehicle.id ? { ...v, ...updatedVehicle, capacity: Number(updatedVehicle.capacity) } : v));
  };

  const deleteVehicle = (id) => {
    const activeTrip = trips.some(t => t.vehicleId === id && t.status === 'Dispatched');
    if (activeTrip) {
      throw new Error(`Cannot delete vehicle. It is currently dispatched on an active trip.`);
    }
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  // --- DRIVER ACTIONS ---
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
    };
    setDrivers(prev => [...prev, newDriver]);
    return newDriver;
  };

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
  };

  const deleteDriver = (id) => {
    const activeTrip = trips.some(t => t.driverId === id && t.status === 'Dispatched');
    if (activeTrip) {
      throw new Error(`Cannot delete driver. They are currently active on a dispatched trip.`);
    }
    setDrivers(prev => prev.filter(d => d.id !== id));
  };

  // --- TRIP ACTIONS ---
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
    };

    setTrips(prev => [...prev, newTrip]);

    if (newTrip.status === 'Dispatched') {
      // Automatically lock vehicle and driver
      setVehicles(prev => prev.map(v => v.id === trip.vehicleId ? { ...v, status: 'Dispatched' } : v));
      setDrivers(prev => prev.map(d => d.id === trip.driverId ? { ...d, safetyStatus: 'On Trip', status: 'On Trip' } : d));
    }

    return newTrip;
  };

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
      };
    }));
  };

  // --- MAINTENANCE ACTIONS ---
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
    };

    setMaintenance(prev => [...prev, newRecord]);

    // Automatically transition vehicle status: In Shop if In Progress, Available if Completed
    const vehicleStatus = recStatus === 'Completed' ? 'Available' : 'In Shop';
    setVehicles(prev => prev.map(v => v.id === record.vehicleId ? { ...v, status: vehicleStatus, lastServiceDate: recStatus === 'Completed' ? (record.startDate || new Date().toISOString().split('T')[0]) : v.lastServiceDate } : v));
    return newRecord;
  };

  const completeMaintenanceRecord = (id, endDate) => {
    setMaintenance(prev => prev.map(m => {
      if (m.id !== id) return m;

      const finishDate = endDate || new Date().toISOString().split('T')[0];
      // Restore vehicle to Available
      setVehicles(vPrev => vPrev.map(v => v.id === m.vehicleId ? { ...v, status: 'Available', lastServiceDate: finishDate } : v));

      return {
        ...m,
        status: 'Completed',
        endDate: finishDate
      };
    }));
  };

  // --- FUEL & EXPENSE ACTIONS ---
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

  // --- UTILS & CALCULATORS ---
  const getVehicleOperationalCost = (vehicleId) => {
    const fuelCost = fuelLogs.filter(f => f.vehicleId === vehicleId).reduce((sum, f) => sum + f.cost, 0);
    const serviceCost = maintenance.filter(m => m.vehicleId === vehicleId).reduce((sum, m) => sum + m.cost, 0);
    const miscCost = expenses.filter(e => e.vehicleId === vehicleId).reduce((sum, e) => sum + e.amount, 0);
    return fuelCost + serviceCost + miscCost;
  };

  const getVehicleRevenue = (vehicleId) => {
    // We assume completed trips earn revenue equal to their cost + a mock profit margin (e.g. 1.5 * trip cost)
    return trips.filter(t => t.vehicleId === vehicleId && t.status === 'Completed').reduce((sum, t) => sum + (t.cost * 1.4), 0);
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
