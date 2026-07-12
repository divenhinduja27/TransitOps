import React, { useState, useEffect, useRef } from 'react';
import { useERP } from '../context/ERPContext';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

// GPS Coordinate mapping for major logistics nodes
const CITY_COORDS = {
  'Mumbai Port (JNPT)': [19.0760, 72.8777],
  'Pune Logistics Park': [18.5204, 73.8567],
  'Delhi Cargo Hub': [28.6139, 77.2090],
  'Jaipur Industrial Area': [26.9124, 75.7873],
  'Kolkata Port': [22.5726, 88.3639],
  'Patna Warehouse': [25.5941, 85.1376],
  'Chennai Dockyard': [13.0827, 80.2707],
  'Bangalore Depot': [12.9716, 77.5946],
  'Bangalore Logistics Park': [12.9716, 77.5946],
  'Hyderabad Terminal': [17.3850, 78.4867]
};

const Dashboard = () => {
  const { vehicles, drivers, trips } = useERP();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dashboard Filters
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('All');
  const [vehicleStatusFilter, setVehicleStatusFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  // Table Status Filter (Independent or Combined)
  const [statusFilter, setStatusFilter] = useState('All');

  // Map View Layer Mode: 'road' or 'satellite'
  const [mapView, setMapView] = useState('road');

  // Reset Filters handler
  const handleResetFilters = () => {
    setVehicleTypeFilter('All');
    setVehicleStatusFilter('All');
    setRegionFilter('All');
    setStartDateFilter('');
    setEndDateFilter('');
    setStatusFilter('All');
    setSearchQuery('');
  };

  // Helper: Get vehicle region based on state code in registration plate
  const getVehicleRegion = (reg) => {
    if (!reg) return 'West';
    const prefix = reg.slice(0, 2).toUpperCase();
    if (prefix === 'MH' || prefix === 'GJ') return 'West';
    if (prefix === 'DL' || prefix === 'HR') return 'North';
    if (prefix === 'KA' || prefix === 'TN') return 'South';
    if (prefix === 'WB') return 'East';
    return 'West'; // Fallback
  };

  // Helper: Get trip region based on origin/destination
  const getTripRegion = (trip) => {
    const loc = (trip.origin + ' ' + trip.destination).toLowerCase();
    if (loc.includes('mumbai') || loc.includes('pune') || loc.includes('gujarat') || loc.includes('mh') || loc.includes('gj')) return 'West';
    if (loc.includes('delhi') || loc.includes('jaipur') || loc.includes('hr') || loc.includes('dl')) return 'North';
    if (loc.includes('kolkata') || loc.includes('patna') || loc.includes('wb')) return 'East';
    if (loc.includes('bangalore') || loc.includes('chennai') || loc.includes('hyderabad') || loc.includes('ka') || loc.includes('tn')) return 'South';
    return 'West';
  };

  // Helper: Get driver region based on phone pattern (dummy mapping for consistency)
  const getDriverRegion = (phone) => {
    if (!phone) return 'West';
    const lastDigit = phone.slice(-1);
    if (['0', '1', '2'].includes(lastDigit)) return 'West';
    if (['3', '4'].includes(lastDigit)) return 'North';
    if (['5', '6'].includes(lastDigit)) return 'East';
    return 'South';
  };

  // ----------------------------------------------------
  // Dynamic Filtering Logic
  // ----------------------------------------------------
  
  // Filter vehicles list dynamically
  const filteredVehicles = vehicles.filter(v => {
    const matchesType = vehicleTypeFilter === 'All' || v.type === vehicleTypeFilter;
    const matchesStatus = vehicleStatusFilter === 'All' || v.status === vehicleStatusFilter;
    const matchesRegion = regionFilter === 'All' || getVehicleRegion(v.registrationNumber) === regionFilter;
    return matchesType && matchesStatus && matchesRegion;
  });

  // Filter trips list dynamically
  const filteredTrips = trips.filter(trip => {
    const v = vehicles.find(veh => veh.id === trip.vehicleId);
    
    const matchesSearch = 
      trip.tripId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesVehicleType = vehicleTypeFilter === 'All' || (v && v.type === vehicleTypeFilter);
    const matchesVehicleStatus = vehicleStatusFilter === 'All' || (v && v.status === vehicleStatusFilter);
    const matchesRegion = regionFilter === 'All' || getTripRegion(trip) === regionFilter;
    
    let matchesDate = true;
    if (startDateFilter && trip.startDate) {
      matchesDate = matchesDate && (trip.startDate >= startDateFilter);
    }
    if (endDateFilter && trip.startDate) {
      matchesDate = matchesDate && (trip.startDate <= endDateFilter);
    }
    
    const matchesStatusSelect = statusFilter === 'All' || trip.status === statusFilter;

    return matchesSearch && matchesVehicleType && matchesVehicleStatus && matchesRegion && matchesDate && matchesStatusSelect;
  });

  // Filter drivers list dynamically
  const filteredDrivers = drivers.filter(d => {
    return regionFilter === 'All' || getDriverRegion(d.phone) === regionFilter;
  });

  // ----------------------------------------------------
  // KPI Calculations (based on filtered lists)
  // ----------------------------------------------------
  const totalVehicles = filteredVehicles.length;
  const activeVehicles = filteredVehicles.filter(v => v.status === 'Dispatched').length;
  const availableVehicles = filteredVehicles.filter(v => v.status === 'Available').length;
  const inShopVehicles = filteredVehicles.filter(v => v.status === 'In Shop').length;
  const retiredVehicles = filteredVehicles.filter(v => v.status === 'Retired').length;
  
  const totalDrivers = filteredDrivers.length;
  const availableDrivers = filteredDrivers.filter(d => d.status === 'Available').length;
  
  const activeTripsCount = filteredTrips.filter(t => t.status === 'Dispatched').length;
  const pendingTripsCount = filteredTrips.filter(t => t.status === 'Pending').length;

  const fleetUtilization = totalVehicles > 0 
    ? Math.round((activeVehicles / totalVehicles) * 100) 
    : 0;

  // ----------------------------------------------------
  // Helpers for table lookups
  // ----------------------------------------------------
  const getVehicleReg = (vehicleId) => {
    const v = vehicles.find(veh => veh.id === vehicleId);
    return v ? v.registrationNumber : vehicleId;
  };

  const getDriverName = (driverId) => {
    const d = drivers.find(drv => drv.id === driverId);
    return d ? d.name : driverId;
  };

  // ETA Helper based on trip details
  const getTripETA = (trip) => {
    if (trip.status === 'Completed') return <span className="text-[#10B981] font-semibold">Delivered</span>;
    if (trip.status === 'Cancelled') return <span className="text-[#9CA3AF]">N/A</span>;
    if (trip.status === 'Dispatched') {
      if (trip.tripId === 'TRP-1001') return '45 min';
      if (trip.tripId === 'TRP-1002') return '1 hr 10 min';
      return '2 hr 15 min';
    }
    return <span className="text-[#A855F7] font-semibold">Awaiting Vehicle</span>;
  };

  // Status pills styler based on rules
  const getStatusPillClass = (status) => {
    switch (status) {
      case 'Available':
      case 'Completed':
        return 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30';
      case 'Dispatched':
      case 'On Trip':
        return 'bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30';
      case 'Pending':
        return 'bg-[#A855F7]/15 text-[#A855F7] border border-[#A855F7]/30';
      case 'In Shop':
        return 'bg-[#FF8A00]/15 text-[#FF8A00] border border-[#FF8A00]/30';
      case 'Retired':
        return 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30';
      case 'Draft':
      default:
        return 'bg-[#9CA3AF]/15 text-[#9CA3AF] border border-[#9CA3AF]/30';
    }
  };

  // ----------------------------------------------------
  // Real-time Vehicle movement animation simulation
  // ----------------------------------------------------
  const [animationProgress, setAnimationProgress] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationProgress(prev => {
        const next = { ...prev };
        trips.forEach(t => {
          if (t.status === 'Dispatched') {
            const current = next[t.id] || 0.1;
            // Advance progress by 3% every 5 seconds, looping back to 0.1 once finished
            next[t.id] = current >= 0.95 ? 0.1 : current + 0.03;
          }
        });
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [trips]);

  // ----------------------------------------------------
  // Leaflet Map Integration
  // ----------------------------------------------------
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef({});
  const polylinesRef = useRef({});

  // Initialize Map
  useEffect(() => {
    if (!window.L || !mapRef.current || mapInstance.current) return;

    // Center Leaflet map dynamically covering India logistics hub centers
    const map = window.L.map(mapRef.current, {
      center: [21.1458, 79.0882], // Nagpur (geographic center of India)
      zoom: 5,
      zoomControl: false
    });

    window.L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial tile layer setup (Road theme)
    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CartoDB'
    }).addTo(map);

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update map base layer (Road vs Satellite view)
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !window.L) return;

    map.eachLayer((layer) => {
      if (layer instanceof window.L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    if (mapView === 'road') {
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB'
      }).addTo(map);
    } else {
      window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri'
      }).addTo(map);
    }
  }, [mapView]);

  // Synchronize Markers & Polylines with Filtered Data and Animation Loop
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !window.L) return;

    // Clear existing markers, polylines, and circles
    Object.values(markersRef.current).forEach(m => map.removeLayer(m));
    Object.values(polylinesRef.current).forEach(p => map.removeLayer(p));
    markersRef.current = {};
    polylinesRef.current = {};

    filteredVehicles.forEach(v => {
      // Find if this vehicle has an active dispatched route
      const trip = trips.find(t => t.vehicleId === v.id && t.status === 'Dispatched');
      let currentLatLng = null;
      let routePoints = null;

      if (trip) {
        const origin = CITY_COORDS[trip.origin] || [19.0760, 72.8777];
        const dest = CITY_COORDS[trip.destination] || [18.5204, 73.8567];
        const progress = animationProgress[trip.id] || 0.1;

        // Calculate animated vehicle location between origin & destination coordinates
        const lat = origin[0] + (dest[0] - origin[0]) * progress;
        const lng = origin[1] + (dest[1] - origin[1]) * progress;
        currentLatLng = [lat, lng];
        routePoints = [origin, dest];
      } else {
        // Fallback static coordinate depending on vehicle registration region
        const region = getVehicleRegion(v.registrationNumber);
        if (region === 'North') currentLatLng = [28.6139, 77.2090]; // Delhi Hub
        else if (region === 'South') currentLatLng = [12.9716, 77.5946]; // Bangalore Hub
        else if (region === 'East') currentLatLng = [22.5726, 88.3639]; // Kolkata Hub
        else currentLatLng = [19.0760, 72.8777]; // Mumbai Hub (West)
      }

      // Draw route lines and endpoint anchors for vehicles en route
      if (routePoints) {
        // Draw route polyline
        const polyline = window.L.polyline(routePoints, {
          color: '#3B82F6',
          weight: 2,
          opacity: 0.6,
          dashArray: '4, 8'
        }).addTo(map);
        polylinesRef.current[`line_${v.id}`] = polyline;

        // Origin marker (Circle anchor)
        const originCircle = window.L.circleMarker(routePoints[0], {
          radius: 4,
          fillColor: '#9CA3AF',
          color: '#111111',
          weight: 1.5,
          opacity: 0.9,
          fillOpacity: 0.9
        }).addTo(map);
        markersRef.current[`origin_${v.id}`] = originCircle;

        // Destination marker (Circle anchor)
        const destCircle = window.L.circleMarker(routePoints[1], {
          radius: 4,
          fillColor: '#FF8A00',
          color: '#111111',
          weight: 1.5,
          opacity: 0.9,
          fillOpacity: 0.9
        }).addTo(map);
        markersRef.current[`dest_${v.id}`] = destCircle;
      }

      // Choose Marker color depending on status
      let markerColor = '#10B981'; // Green (Available)
      if (v.status === 'Dispatched') markerColor = '#3B82F6'; // Blue (On Trip)
      else if (v.status === 'In Shop') markerColor = '#FF8A00'; // Orange (In Maintenance)
      else if (v.status === 'Retired') markerColor = '#EF4444'; // Red (Retired)

      // DivIcon for animated and custom-colored pulsing marker
      const customIcon = window.L.divIcon({
        html: `
          <div style="position: relative; width: 14px; height: 14px;">
            <span style="display: block; width: 14px; height: 14px; background-color: ${markerColor}; border: 2px solid #FFFFFF; border-radius: 50%; box-shadow: 0 0 8px ${markerColor};"></span>
            ${v.status === 'Dispatched' ? `<span style="position: absolute; top: 0; left: 0; display: block; width: 14px; height: 14px; background-color: ${markerColor}; border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.6; z-index: -1;"></span>` : ''}
          </div>
        `,
        className: 'custom-leaflet-marker',
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      // Construct detailed statistics inside vehicle popups
      const speedValue = v.status === 'Dispatched' ? '65 km/h' : '0 km/h';
      const fuelLevel = v.status === 'In Shop' ? '12%' : v.status === 'Dispatched' ? '78%' : '90%';
      const destinationVal = trip ? trip.destination : 'N/A';
      const etaVal = trip ? (trip.tripId === 'TRP-1001' ? '45 min' : trip.tripId === 'TRP-1002' ? '1 hr 10 min' : '2 hr 15 min') : 'N/A';
      const driverName = trip ? getDriverName(trip.driverId) : 'N/A';

      const popupContent = `
        <div style="font-family: 'Inter', sans-serif; font-size: 11px; width: 180px; padding: 2px; color: #FFFFFF;">
          <div style="border-bottom: 1px solid #2E2E2E; padding-bottom: 4px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
            <strong style="color: #ff8a00; font-family: monospace; font-size: 12px;">${v.registrationNumber}</strong>
            <span style="font-size: 9px; padding: 1px 6px; border-radius: 4px; background-color: ${markerColor}20; color: ${markerColor}; border: 1px solid ${markerColor}40; font-weight: bold; text-transform: uppercase;">
              ${v.status === 'Dispatched' ? 'On Trip' : v.status}
            </span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 4px; line-height: 1.4;">
            <span style="color: #9CA3AF;">Driver:</span> <strong style="text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${driverName}</strong>
            <span style="color: #9CA3AF;">Speed:</span> <strong style="text-align: right; font-family: monospace;">${speedValue}</strong>
            <span style="color: #9CA3AF;">Fuel:</span> <strong style="text-align: right; font-family: monospace; color: ${parseFloat(fuelLevel) < 20 ? '#EF4444' : '#FFFFFF'}">${fuelLevel}</strong>
            ${trip ? `
              <span style="color: #9CA3AF;">Destination:</span> <strong style="text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${destinationVal}</strong>
              <span style="color: #9CA3AF;">ETA:</span> <strong style="text-align: right; color: #10B981;">${etaVal}</strong>
            ` : ''}
          </div>
        </div>
      `;

      const marker = window.L.marker(currentLatLng, { icon: customIcon })
        .bindPopup(popupContent, {
          closeButton: false,
          className: 'custom-leaflet-popup'
        })
        .addTo(map);

      markersRef.current[v.id] = marker;
    });

  }, [filteredVehicles, filteredTrips, animationProgress]);

  return (
    <>
      <style>{`
        .glass-card {
            background: rgba(22, 22, 22, 0.7);
            backdrop-filter: blur(16px);
            border: 1px solid #2E2E2E;
        }
        .metric-glow {
            text-shadow: 0 0 15px rgba(255, 138, 0, 0.15);
        }
        .filter-select, .filter-input {
            background-color: #161616;
            border: 1px solid #2E2E2E;
            color: #FFFFFF;
            font-size: 0.75rem;
            border-radius: 6px;
            padding: 6px 12px;
            outline: none;
            transition: border-color 0.2s;
        }
        .filter-select:focus, .filter-input:focus {
            border-color: #ff8a00;
        }
        /* Custom Leaflet Map styling overrides to align with dark UI theme */
        .leaflet-container {
            background-color: #111111 !important;
            outline: none;
        }
        .custom-leaflet-popup .leaflet-popup-content-wrapper {
            background: #161616 !important;
            color: #FFFFFF !important;
            border: 1px solid #2E2E2E !important;
            border-radius: 8px !important;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6) !important;
            padding: 2px !important;
        }
        .custom-leaflet-popup .leaflet-popup-content {
            margin: 8px 12px !important;
        }
        .custom-leaflet-popup .leaflet-popup-tip {
            background: #161616 !important;
            border-left: 1px solid #2E2E2E !important;
            border-bottom: 1px solid #2E2E2E !important;
        }
        .leaflet-bar {
            border: 1px solid #2E2E2E !important;
            border-radius: 6px !important;
            overflow: hidden;
        }
        .leaflet-bar a {
            background-color: #1E1E1E !important;
            color: #FFFFFF !important;
            border-bottom: 1px solid #2E2E2E !important;
            transition: background-color 0.2s;
        }
        .leaflet-bar a:hover {
            background-color: #2E2E2E !important;
            color: #ff8a00 !important;
        }
      `}</style>

      <main className="ml-[260px] min-h-screen flex flex-col bg-[#111111] text-[#e6e1e2]">
        <Header 
          title="Logistics Command" 
          subtitle="Real-time operational command console"
          searchPlaceholder="Search trips by manifest ID..."
          searchValue={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          actions={
            <div className="flex items-center gap-3">
              <Link to="/trips" className="bg-[#ff8a00] text-black px-5 py-2 rounded-full font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-[18px]">add</span>
                Dispatch Trip
              </Link>
              <Link to="/fleet" className="border border-[#2E2E2E] bg-[#1E1E1E] text-white px-5 py-2 rounded-full font-semibold hover:bg-[#2E2E2E] transition-all text-sm">
                Add Vehicle
              </Link>
            </div>
          }
        />

        <div className="p-6 space-y-6 flex-grow">

          {/* 1. Dashboard Filters Section */}
          <div className="glass-card p-4 rounded-xl border border-[#2E2E2E] flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Vehicle Type Filter */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-wider">Vehicle Type</label>
                <select
                  className="filter-select"
                  value={vehicleTypeFilter}
                  onChange={(e) => setVehicleTypeFilter(e.target.value)}
                >
                  <option value="All">All Types</option>
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

              {/* Vehicle Status Filter */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-wider">Vehicle Status</label>
                <select
                  className="filter-select"
                  value={vehicleStatusFilter}
                  onChange={(e) => setVehicleStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Available">Available</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="In Shop">In Shop</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>

              {/* Region Filter */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-wider">Region</label>
                <select
                  className="filter-select"
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                >
                  <option value="All">All Regions</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                </select>
              </div>

              {/* Date range filters */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-wider">Start Date</label>
                <input
                  type="date"
                  className="filter-input"
                  value={startDateFilter}
                  onChange={(e) => setStartDateFilter(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-wider">End Date</label>
                <input
                  type="date"
                  className="filter-input"
                  value={endDateFilter}
                  onChange={(e) => setEndDateFilter(e.target.value)}
                />
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-xs text-[#ff8a00] hover:text-[#ffb77f] font-semibold border border-[#ff8a00]/30 hover:border-[#ff8a00] rounded-lg px-4 py-2 bg-[#ff8a00]/5 transition-all self-end h-[34px] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              Reset Filters
            </button>
          </div>

          {/* 2. KPI Dashboard Cards (8 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
            {/* Active Fleets */}
            <div className="glass-card p-4 rounded-xl flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <span className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider">Active Fleets</span>
                <span className="material-symbols-outlined text-[#3B82F6] text-[20px]">local_shipping</span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-[#FFFFFF] metric-glow">{activeVehicles}</span>
                <p className="text-[10px] text-[#9CA3AF] mt-1">out of {totalVehicles} total</p>
              </div>
            </div>

            {/* Available Fleet */}
            <div className="glass-card p-4 rounded-xl flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <span className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider">Available Fleet</span>
                <span className="material-symbols-outlined text-[#10B981] text-[20px]">check_circle</span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-[#FFFFFF] metric-glow">{availableVehicles}</span>
                <p className="text-[10px] text-[#10B981]/80 mt-1">Ready for dispatch</p>
              </div>
            </div>

            {/* In Maintenance */}
            <div className="glass-card p-4 rounded-xl flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <span className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider">In Maintenance</span>
                <span className="material-symbols-outlined text-[#FF8A00] text-[20px]">build</span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-[#FFFFFF] metric-glow">{inShopVehicles}</span>
                <p className="text-[10px] text-[#FF8A00]/80 mt-1">Undergoing service</p>
              </div>
            </div>

            {/* Pending Trips */}
            <div className="glass-card p-4 rounded-xl flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <span className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider">Pending Trips</span>
                <span className="material-symbols-outlined text-[#A855F7] text-[20px]">pending</span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-[#FFFFFF] metric-glow">{pendingTripsCount}</span>
                <p className="text-[10px] text-[#A855F7]/80 mt-1">Awaiting dispatch</p>
              </div>
            </div>

            {/* Total Drivers */}
            <div className="glass-card p-4 rounded-xl flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <span className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider">Total Drivers</span>
                <span className="material-symbols-outlined text-[#3B82F6] text-[20px]">badge</span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-[#FFFFFF] metric-glow">{totalDrivers}</span>
                <p className="text-[10px] text-[#9CA3AF] mt-1">{availableDrivers} available</p>
              </div>
            </div>

            {/* Ongoing Trips */}
            <div className="glass-card p-4 rounded-xl flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <span className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider">Ongoing Trips</span>
                <span className="material-symbols-outlined text-cyan-400 text-[20px]">route</span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-[#FFFFFF] metric-glow">{activeTripsCount}</span>
                <p className="text-[10px] text-cyan-400/80 mt-1">Currently en route</p>
              </div>
            </div>

            {/* Fleet Utilization */}
            <div className="glass-card p-4 rounded-xl flex flex-col justify-between h-full col-span-1 sm:col-span-2">
              <div className="flex justify-between items-start">
                <span className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider">Fleet Utilization</span>
                <span className="material-symbols-outlined text-yellow-400 text-[20px]">analytics</span>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#FFFFFF] metric-glow">{fleetUtilization}%</span>
                  <span className="text-xs text-[#9CA3AF]">dispatched ratio</span>
                </div>
                <div className="w-full bg-[#2E2E2E] h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-[#ff8a00] h-full" style={{ width: `${fleetUtilization}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Stats Section (Trips & Progress Bars) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Recent Trips Table */}
            <div className="glass-card p-6 rounded-xl lg:col-span-2 space-y-4 flex flex-col justify-between">
              <div className="flex justify-between items-center border-b border-[#2E2E2E] pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ff8a00]">history</span>
                  Recent Trip Actions
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#9CA3AF] font-semibold">Filter:</span>
                  <select 
                    className="bg-[#161616] border border-[#2E2E2E] rounded px-2 py-1 text-xs text-white outline-none focus:border-[#ff8a00]"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Draft">Draft</option>
                    <option value="Pending">Pending</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto flex-grow pt-2">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#2E2E2E] text-[#9CA3AF] text-xs font-semibold uppercase">
                      <th className="py-3 px-2">Trip ID</th>
                      <th className="py-3 px-2">Vehicle</th>
                      <th className="py-3 px-2">Driver</th>
                      <th className="py-3 px-2">Route</th>
                      <th className="py-3 px-2 text-right">Cargo</th>
                      <th className="py-3 px-2 text-center">ETA</th>
                      <th className="py-3 px-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2E2E2E]/40 text-[#D1D5DB]">
                    {filteredTrips.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-8 text-center text-[#9CA3AF]">No trips match the filters.</td>
                      </tr>
                    ) : (
                      filteredTrips.slice(0, 8).map((trip) => (
                        <tr key={trip.id} className="hover:bg-[#1E1E1E]/50 transition-colors">
                          <td className="py-3 px-2 font-mono font-bold text-xs text-[#ff8a00]">{trip.tripId}</td>
                          <td className="py-3 px-2 text-xs font-mono text-[#D1D5DB]">{getVehicleReg(trip.vehicleId)}</td>
                          <td className="py-3 px-2 text-xs text-[#D1D5DB]">{getDriverName(trip.driverId)}</td>
                          <td className="py-3 px-2 text-xs text-[#D1D5DB]">{trip.origin} → {trip.destination}</td>
                          <td className="py-3 px-2 text-xs text-right font-mono font-bold text-[#D1D5DB]">{(trip.cargoWeight).toLocaleString()} kg</td>
                          <td className="py-3 px-2 text-xs text-center text-[#D1D5DB]">{getTripETA(trip)}</td>
                          <td className="py-3 px-2 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusPillClass(trip.status)}`}>
                              {trip.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fleet Status Distribution Progress Bars */}
            <div className="glass-card p-6 rounded-xl space-y-6 flex flex-col justify-between">
              <div className="border-b border-[#2E2E2E] pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ff8a00]">bar_chart</span>
                  Fleet Status Distribution
                </h3>
                <p className="text-[10px] text-[#9CA3AF] mt-1">Live overview of assets activity</p>
              </div>

              <div className="space-y-6 flex-grow flex flex-col justify-center">
                {/* Available Vehicles progress bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#D1D5DB] font-semibold">Available Vehicles</span>
                    <span className="text-[#10B981] font-bold">{availableVehicles} ({totalVehicles > 0 ? Math.round((availableVehicles/totalVehicles)*100) : 0}%)</span>
                  </div>
                  <div className="w-full bg-[#1E1E1E] border border-[#2E2E2E] h-3.5 rounded-full overflow-hidden">
                    <div className="bg-[#10B981] h-full rounded-full transition-all duration-500" style={{ width: `${(availableVehicles/totalVehicles)*100 || 0}%` }}></div>
                  </div>
                </div>

                {/* On Trip progress bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#D1D5DB] font-semibold">On Trip</span>
                    <span className="text-[#3B82F6] font-bold">{activeVehicles} ({totalVehicles > 0 ? Math.round((activeVehicles/totalVehicles)*100) : 0}%)</span>
                  </div>
                  <div className="w-full bg-[#1E1E1E] border border-[#2E2E2E] h-3.5 rounded-full overflow-hidden">
                    <div className="bg-[#3B82F6] h-full rounded-full transition-all duration-500" style={{ width: `${(activeVehicles/totalVehicles)*100 || 0}%` }}></div>
                  </div>
                </div>

                {/* In Maintenance progress bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#D1D5DB] font-semibold">In Maintenance</span>
                    <span className="text-[#FF8A00] font-bold">{inShopVehicles} ({totalVehicles > 0 ? Math.round((inShopVehicles/totalVehicles)*100) : 0}%)</span>
                  </div>
                  <div className="w-full bg-[#1E1E1E] border border-[#2E2E2E] h-3.5 rounded-full overflow-hidden">
                    <div className="bg-[#FF8A00] h-full rounded-full transition-all duration-500" style={{ width: `${(inShopVehicles/totalVehicles)*100 || 0}%` }}></div>
                  </div>
                </div>

                {/* Retired progress bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#D1D5DB] font-semibold">Retired</span>
                    <span className="text-[#EF4444] font-bold">{retiredVehicles} ({totalVehicles > 0 ? Math.round((retiredVehicles/totalVehicles)*100) : 0}%)</span>
                  </div>
                  <div className="w-full bg-[#1E1E1E] border border-[#2E2E2E] h-3.5 rounded-full overflow-hidden">
                    <div className="bg-[#EF4444] h-full rounded-full transition-all duration-500" style={{ width: `${(retiredVehicles/totalVehicles)*100 || 0}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Modern Charts & Interactive Live Map */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Weekly Dispatch Activity Chart (Custom SVG Line Chart) */}
            <div className="glass-card p-6 rounded-xl lg:col-span-2 space-y-4 border border-[#2E2E2E]">
              <div className="border-b border-[#2E2E2E] pb-3 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#ff8a00]">insights</span>
                    Weekly Dispatch Activity
                  </h3>
                  <p className="text-[10px] text-[#9CA3AF] mt-1">Total trips completed vs dispatched over the week</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold text-[#D1D5DB]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded bg-[#ff8a00]"></div>
                    <span>Dispatched</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded bg-[#10B981]"></div>
                    <span>Completed</span>
                  </div>
                </div>
              </div>

              {/* Custom SVG Line Chart */}
              <div className="h-64 flex items-center justify-center relative w-full pt-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="40" x2="500" y2="40" stroke="#2E2E2E" strokeWidth="1" strokeDasharray="3" />
                  <line x1="0" y1="90" x2="500" y2="90" stroke="#2E2E2E" strokeWidth="1" strokeDasharray="3" />
                  <line x1="0" y1="140" x2="500" y2="140" stroke="#2E2E2E" strokeWidth="1" strokeDasharray="3" />

                  {/* Dispatched Area Under Line */}
                  <path d="M 0 160 Q 80 80, 160 110 T 320 60 T 500 40 L 500 180 L 0 180 Z" fill="url(#dispatchedGradient)" opacity="0.06" />
                  
                  {/* Dispatched Line */}
                  <path d="M 0 160 Q 80 80, 160 110 T 320 60 T 500 40" fill="none" stroke="#ff8a00" strokeWidth="3.5" strokeLinecap="round" />

                  {/* Completed Line */}
                  <path d="M 0 180 Q 80 140, 160 130 T 320 90 T 500 50" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />

                  {/* Data Points */}
                  <circle cx="80" cy="120" r="5" fill="#ff8a00" stroke="#111111" strokeWidth="1.5" />
                  <circle cx="240" cy="85" r="5" fill="#ff8a00" stroke="#111111" strokeWidth="1.5" />
                  <circle cx="400" cy="50" r="5" fill="#ff8a00" stroke="#111111" strokeWidth="1.5" />

                  <circle cx="80" cy="160" r="4.5" fill="#10B981" stroke="#111111" strokeWidth="1.5" />
                  <circle cx="240" cy="110" r="4.5" fill="#10B981" stroke="#111111" strokeWidth="1.5" />
                  <circle cx="400" cy="70" r="4.5" fill="#10B981" stroke="#111111" strokeWidth="1.5" />

                  {/* Gradients */}
                  <defs>
                    <linearGradient id="dispatchedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff8a00" />
                      <stop offset="100%" stopColor="#ff8a00" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Y Axis Labels */}
                <div className="absolute left-0 h-[180px] top-4 flex flex-col justify-between text-[10px] text-[#9CA3AF] pointer-events-none">
                  <span>50 Trips</span>
                  <span>30 Trips</span>
                  <span>10 Trips</span>
                  <span>0 Trips</span>
                </div>
              </div>

              {/* X Axis Labels */}
              <div className="flex justify-between text-[10px] text-[#9CA3AF] px-6 font-semibold uppercase tracking-wider pt-2">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>

            {/* Google Maps-style Live Interactive Map */}
            <div className="glass-card rounded-xl overflow-hidden relative border border-[#2E2E2E] min-h-[350px] flex flex-col justify-between">
              {/* Map Header Control Panel */}
              <div className="absolute top-4 left-4 z-[1000] bg-[#161616]/95 backdrop-blur-md p-3 rounded-lg border border-[#2E2E2E] shadow-2xl flex flex-col gap-2">
                <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping"></span>
                  Live Fleet Tracker
                </h4>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setMapView('road')} 
                    className={`px-2 py-1 text-[9px] font-bold rounded uppercase transition-all cursor-pointer ${mapView === 'road' ? 'bg-[#ff8a00] text-black' : 'bg-[#1E1E1E] text-white border border-[#2E2E2E] hover:bg-[#2E2E2E]'}`}
                  >
                    Road Map
                  </button>
                  <button 
                    onClick={() => setMapView('satellite')} 
                    className={`px-2 py-1 text-[9px] font-bold rounded uppercase transition-all cursor-pointer ${mapView === 'satellite' ? 'bg-[#ff8a00] text-black' : 'bg-[#1E1E1E] text-white border border-[#2E2E2E] hover:bg-[#2E2E2E]'}`}
                  >
                    Satellite
                  </button>
                </div>
              </div>

              {/* Leaflet Mount Container */}
              <div ref={mapRef} className="w-full h-full flex-grow min-h-[350px] z-10" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
