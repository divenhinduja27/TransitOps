import React, { createContext, useContext, useState, useEffect } from 'react';

const ERPContext = createContext(null);

const INITIAL_VEHICLES = [
  { id: 'V-101', registrationNumber: 'MH-12-GQ-4432', make: 'Volvo', model: 'FH16 Heavy Container', type: 'Container', capacity: 25000, status: 'Available', lastServiceDate: '2026-05-10' },
  { id: 'V-102', registrationNumber: 'DL-1C-AH-9821', make: 'Tata', model: 'Signa 2823.K', type: 'Heavy Truck', capacity: 18000, status: 'Available', lastServiceDate: '2026-06-15' },
  { id: 'V-103', registrationNumber: 'KA-03-MM-7110', make: 'BharatBenz', model: 'Gigashield 4023T', type: 'Flatbed', capacity: 22000, status: 'Dispatched', lastServiceDate: '2026-06-20' },
  { id: 'V-104', registrationNumber: 'HR-55-XY-0045', make: 'Mahindra', model: 'Blazo X 35', type: 'Tanker', capacity: 20000, status: 'Available', lastServiceDate: '2026-07-01' },
  { id: 'V-105', registrationNumber: 'MH-43-P-8821', make: 'Volvo', model: 'FMX 460', type: 'Dumper', capacity: 16000, status: 'In Shop', lastServiceDate: '2026-07-09' },
  { id: 'V-106', registrationNumber: 'GJ-01-ZZ-5645', make: 'Eicher', model: 'Pro 6028', type: 'Cargo Van', capacity: 8000, status: 'Available', lastServiceDate: '2026-05-22' },
  { id: 'V-107', registrationNumber: 'WB-20-AB-1234', make: 'Tata', model: 'Ultra T.16', type: 'Box Truck', capacity: 10000, status: 'Dispatched', lastServiceDate: '2026-06-30' },
  { id: 'V-108', registrationNumber: 'TN-07-CD-5678', make: 'Scania', model: 'R500', type: 'Trailer', capacity: 28000, status: 'Available', lastServiceDate: '2026-07-11' }
];

const INITIAL_DRIVERS = [
  { id: 'D-201', name: 'Rajesh Kumar', licenseNumber: 'DL-14202100456', licenseExpiry: '2028-12-10', status: 'Available', phone: '+91 98765 43210' },
  { id: 'D-202', name: 'Sandeep Singh', licenseNumber: 'HR-26201900891', licenseExpiry: '2027-08-15', status: 'Available', phone: '+91 99112 23344' },
  { id: 'D-203', name: 'Amit Sharma', licenseNumber: 'KA-51202300012', licenseExpiry: '2026-03-20', status: 'Expired', phone: '+91 98223 34455' },
  { id: 'D-204', name: 'Vijay Yadav', licenseNumber: 'MH-12201800561', licenseExpiry: '2029-01-30', status: 'Available', phone: '+91 97665 43210' },
  { id: 'D-205', name: 'Gurnam Singh', licenseNumber: 'PB-65201500344', licenseExpiry: '2025-06-05', status: 'Suspended', phone: '+91 94112 88990' },
  { id: 'D-206', name: 'Arjun Patil', licenseNumber: 'MH-43202200455', licenseExpiry: '2031-10-15', status: 'Active', phone: '+91 95443 12345' },
  { id: 'D-207', name: 'Anil Banerjee', licenseNumber: 'WB-02202000234', licenseExpiry: '2027-11-20', status: 'Active', phone: '+91 98300 12345' },
  { id: 'D-208', name: 'Pradeep Pillai', licenseNumber: 'TN-01202400982', licenseExpiry: '2026-08-05', status: 'Available', phone: '+91 91760 98765' }
];

const INITIAL_TRIPS = [
  { id: 'T-1001', tripId: 'TRP-1001', vehicleId: 'V-103', driverId: 'D-206', origin: 'Mumbai Port (JNPT)', destination: 'Pune Logistics Park', cargoWeight: 18000, status: 'Dispatched', startDate: '2026-07-11', endDate: '', cost: 12500 },
  { id: 'T-1002', tripId: 'TRP-1002', vehicleId: 'V-107', driverId: 'D-207', origin: 'Delhi Cargo Hub', destination: 'Jaipur Industrial Area', cargoWeight: 9500, status: 'Dispatched', startDate: '2026-07-12', endDate: '', cost: 8900 },
  { id: 'T-1003', tripId: 'TRP-1003', vehicleId: 'V-101', driverId: 'D-201', origin: 'Kolkata Port', destination: 'Patna Warehouse', cargoWeight: 24000, status: 'Completed', startDate: '2026-07-08', endDate: '2026-07-10', cost: 22000 },
  { id: 'T-1004', tripId: 'TRP-1004', vehicleId: 'V-102', driverId: 'D-202', origin: 'Chennai Dockyard', destination: 'Bangalore Depot', cargoWeight: 15000, status: 'Completed', startDate: '2026-07-05', endDate: '2026-07-07', cost: 14000 },
  { id: 'T-1005', tripId: 'TRP-1005', vehicleId: 'V-108', driverId: 'D-208', origin: 'Bangalore Logistics Park', destination: 'Hyderabad Terminal', cargoWeight: 20000, status: 'Completed', startDate: '2026-07-02', endDate: '2026-07-04', cost: 18000 }
];

const INITIAL_MAINTENANCE = [
  { id: 'M-301', vehicleId: 'V-105', serviceType: 'Engine Overhaul & Oil Filter Replacement', cost: 45000, startDate: '2026-07-09', endDate: '', status: 'In Progress' },
  { id: 'M-302', vehicleId: 'V-102', serviceType: 'Brake Pad Replacement & Suspension Alignment', cost: 12000, startDate: '2026-06-12', endDate: '2026-06-15', status: 'Completed' }
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
    return local ? JSON.parse(local) : INITIAL_VEHICLES;
  });

  const [drivers, setDrivers] = useState(() => {
    const local = localStorage.getItem('erp_drivers');
    return local ? JSON.parse(local) : INITIAL_DRIVERS;
  });

  const [trips, setTrips] = useState(() => {
    const local = localStorage.getItem('erp_trips');
    return local ? JSON.parse(local) : INITIAL_TRIPS;
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
    const expiryDate = new Date(driver.licenseExpiry);
    const today = new Date();
    let status = 'Available';
    if (expiryDate < today) {
      status = 'Expired';
    }
    const newDriver = {
      ...driver,
      id: `D-${Date.now().toString().slice(-3)}`,
      status
    };
    setDrivers(prev => [...prev, newDriver]);
    return newDriver;
  };

  const editDriver = (updatedDriver) => {
    const expiryDate = new Date(updatedDriver.licenseExpiry);
    const today = new Date();
    let status = updatedDriver.status;
    if (expiryDate < today) {
      status = 'Expired';
    } else if (status === 'Expired') {
      status = 'Available';
    }
    setDrivers(prev => prev.map(d => d.id === updatedDriver.id ? { ...d, ...updatedDriver, status } : d));
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
    if (driver.status !== 'Available') {
      throw new Error(`Driver is not available. Current status: ${driver.status}`);
    }

    const today = new Date();
    if (new Date(driver.licenseExpiry) < today) {
      throw new Error('Cannot assign driver. Driving license has expired.');
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
      status: trip.status || 'Draft',
      startDate: trip.status === 'Dispatched' ? new Date().toISOString().split('T')[0] : '',
      endDate: '',
      cost: Number(trip.cost) || 0
    };

    setTrips(prev => [...prev, newTrip]);

    if (newTrip.status === 'Dispatched') {
      // Automatically lock vehicle and driver
      setVehicles(prev => prev.map(v => v.id === trip.vehicleId ? { ...v, status: 'Dispatched' } : v));
      setDrivers(prev => prev.map(d => d.id === trip.driverId ? { ...d, status: 'Active' } : d));
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
        setDrivers(dPrev => dPrev.map(d => d.id === driverId ? { ...d, status: 'Active' } : d));
      } else if (status === 'Completed' && oldStatus !== 'Completed') {
        endDate = new Date().toISOString().split('T')[0];
        setVehicles(vPrev => vPrev.map(v => v.id === vehicleId ? { ...v, status: 'Available' } : v));
        setDrivers(dPrev => dPrev.map(d => d.id === driverId ? { ...d, status: 'Available' } : d));
      } else if (status === 'Cancelled' && oldStatus === 'Dispatched') {
        setVehicles(vPrev => vPrev.map(v => v.id === vehicleId ? { ...v, status: 'Available' } : v));
        setDrivers(dPrev => dPrev.map(d => d.id === driverId ? { ...d, status: 'Available' } : d));
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

    const newRecord = {
      id: `M-${Date.now().toString().slice(-3)}`,
      vehicleId: record.vehicleId,
      serviceType: record.serviceType,
      cost: Number(record.cost),
      startDate: record.startDate || new Date().toISOString().split('T')[0],
      endDate: '',
      status: 'In Progress'
    };

    setMaintenance(prev => [...prev, newRecord]);

    // Automatically set vehicle to "In Shop"
    setVehicles(prev => prev.map(v => v.id === record.vehicleId ? { ...v, status: 'In Shop' } : v));
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
