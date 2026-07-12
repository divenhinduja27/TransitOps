import React, { useState, useEffect } from 'react';
import { useERP } from '../context/ERPContext';
import Header from '../components/Header';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

const Reports = () => {
  const { 
    vehicles, 
    trips, 
    fuelLogs, 
    expenses, 
    maintenance,
    getVehicleFuelCost,
    getVehicleMaintenanceCost,
    getVehicleTollCost,
    getVehicleMiscCost,
    getVehicleOperationalCost,
    getVehicleRevenue
  } = useERP();

  const { theme } = useTheme();

  // ----------------------------------------------------
  // Global Analytics Filters States
  // ----------------------------------------------------
  const [selectedVehicle, setSelectedVehicle] = useState('All');
  const [selectedVehicleType, setSelectedVehicleType] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTripStatus, setSelectedTripStatus] = useState('All');

  // Backend Integration States
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedVehicle !== 'All') params.vehicleId = selectedVehicle;
      if (selectedVehicleType !== 'All') params.type = selectedVehicleType;
      if (selectedRegion !== 'All') params.region = selectedRegion;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (selectedTripStatus !== 'All') params.tripStatus = selectedTripStatus;

      const res = await api.get('/analytics/summary', { params });
      setAnalyticsData(res.data);
    } catch (err) {
      console.error('Failed to fetch analytics summary:', err);
      setError('Failed to load server analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedVehicle, selectedVehicleType, selectedRegion, startDate, endDate, selectedTripStatus]);

  // Fleet Utilization range filter state ('week', 'month', 'quarter', 'year')
  const [utilizationRange, setUtilizationRange] = useState('month');

  // Interactive tooltip state
  const [tooltip, setTooltip] = useState(null); // { x, y, label, value }

  // Helpers to classify regions
  const getVehicleRegion = (reg) => {
    if (!reg) return 'West';
    const prefix = reg.slice(0, 2).toUpperCase();
    if (prefix === 'MH' || prefix === 'GJ') return 'West';
    if (prefix === 'DL' || prefix === 'HR') return 'North';
    if (prefix === 'KA' || prefix === 'TN') return 'South';
    if (prefix === 'WB') return 'East';
    return 'West';
  };

  const getTripRegion = (trip) => {
    const loc = (trip.origin + ' ' + trip.destination).toLowerCase();
    if (loc.includes('mumbai') || loc.includes('pune') || loc.includes('gujarat') || loc.includes('mh') || loc.includes('gj')) return 'West';
    if (loc.includes('delhi') || loc.includes('jaipur') || loc.includes('hr') || loc.includes('dl')) return 'North';
    if (loc.includes('kolkata') || loc.includes('patna') || loc.includes('wb')) return 'East';
    if (loc.includes('bangalore') || loc.includes('chennai') || loc.includes('hyderabad') || loc.includes('ka') || loc.includes('tn')) return 'South';
    return 'West';
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedVehicle('All');
    setSelectedVehicleType('All');
    setSelectedRegion('All');
    setStartDate('');
    setEndDate('');
    setSelectedTripStatus('All');
  };

  // ----------------------------------------------------
  // Filtered Dataset Calculations
  // ----------------------------------------------------
  const filteredVehicles = vehicles.filter(v => {
    const matchesVehicle = selectedVehicle === 'All' || v.id === selectedVehicle;
    const matchesType = selectedVehicleType === 'All' || v.type === selectedVehicleType;
    const matchesRegion = selectedRegion === 'All' || getVehicleRegion(v.registrationNumber) === selectedRegion;
    return matchesVehicle && matchesType && matchesRegion;
  });

  const filteredTrips = trips.filter(t => {
    const matchesVehicle = selectedVehicle === 'All' || t.vehicleId === selectedVehicle;
    const matchesStatus = selectedTripStatus === 'All' || t.status === selectedTripStatus;
    const matchesRegion = selectedRegion === 'All' || getTripRegion(t) === selectedRegion;
    
    let matchesDate = true;
    if (startDate) matchesDate = matchesDate && (t.startDate >= startDate);
    if (endDate) matchesDate = matchesDate && (t.startDate <= endDate);

    // Filter by type if vehicle type selected
    const v = vehicles.find(veh => veh.id === t.vehicleId);
    const matchesType = selectedVehicleType === 'All' || (v && v.type === selectedVehicleType);

    return matchesVehicle && matchesStatus && matchesRegion && matchesDate && matchesType;
  });

  const filteredFuelLogs = fuelLogs.filter(f => {
    const matchesVehicle = selectedVehicle === 'All' || f.vehicleId === selectedVehicle;
    const v = vehicles.find(veh => veh.id === f.vehicleId);
    const matchesType = selectedVehicleType === 'All' || (v && v.type === selectedVehicleType);
    const matchesRegion = selectedRegion === 'All' || (v && getVehicleRegion(v.registrationNumber) === selectedRegion);
    
    let matchesDate = true;
    if (startDate) matchesDate = matchesDate && (f.date >= startDate);
    if (endDate) matchesDate = matchesDate && (f.date <= endDate);

    return matchesVehicle && matchesType && matchesRegion && matchesDate;
  });

  const filteredExpenses = expenses.filter(e => {
    const matchesVehicle = selectedVehicle === 'All' || e.vehicleId === selectedVehicle;
    const v = vehicles.find(veh => veh.id === e.vehicleId);
    const matchesType = selectedVehicleType === 'All' || (v && v.type === selectedVehicleType);
    const matchesRegion = selectedRegion === 'All' || (v && getVehicleRegion(v.registrationNumber) === selectedRegion);

    let matchesDate = true;
    if (startDate) matchesDate = matchesDate && (e.date >= startDate);
    if (endDate) matchesDate = matchesDate && (e.date <= endDate);

    return matchesVehicle && matchesType && matchesRegion && matchesDate;
  });

  const filteredMaintenance = maintenance.filter(m => {
    const matchesVehicle = selectedVehicle === 'All' || m.vehicleId === selectedVehicle;
    const v = vehicles.find(veh => veh.id === m.vehicleId);
    const matchesType = selectedVehicleType === 'All' || (v && v.type === selectedVehicleType);
    const matchesRegion = selectedRegion === 'All' || (v && getVehicleRegion(v.registrationNumber) === selectedRegion);

    let matchesDate = true;
    if (startDate) matchesDate = matchesDate && (m.startDate >= startDate);
    if (endDate) matchesDate = matchesDate && (m.startDate <= endDate);

    return matchesVehicle && matchesType && matchesRegion && matchesDate;
  });

  // ----------------------------------------------------
  // 1. KPI Widget Calculations
  // ----------------------------------------------------
  
  // Fuel Efficiency (Average km/L from logs, mock fallback if empty)
  const totalLiters = filteredFuelLogs.reduce((sum, f) => sum + Number(f.liters), 0);
  const totalDistance = filteredFuelLogs.reduce((sum, f) => sum + (Number(f.odometer) > 1000 ? 550 : 0), 0); 
  
  const avgFuelEfficiency = analyticsData 
    ? analyticsData.averageFuelEfficiency.toFixed(1)
    : (totalLiters > 0 ? (totalDistance / totalLiters).toFixed(1) : '8.5');

  // Fleet Utilization (%)
  const totalVehiclesCount = filteredVehicles.length;
  const activeVehiclesCount = filteredVehicles.filter(v => v.status === 'Dispatched').length;
  
  const fleetUtilization = analyticsData 
    ? Math.round(analyticsData.fleetUtilization)
    : (totalVehiclesCount > 0 ? Math.round((activeVehiclesCount / totalVehiclesCount) * 100) : 0);

  // Operational Cost (₹)
  const opexFuel = analyticsData 
    ? analyticsData.fuelCost 
    : filteredFuelLogs.reduce((sum, f) => sum + Number(f.cost), 0);
    
  const opexMaintenance = analyticsData 
    ? analyticsData.maintenanceCost 
    : filteredMaintenance.reduce((sum, m) => sum + Number(m.cost), 0);
    
  const opexTolls = analyticsData 
    ? analyticsData.tollCost 
    : filteredExpenses.filter(e => e.type === 'Toll Charges').reduce((sum, e) => sum + Number(e.amount), 0);
    
  const opexMisc = analyticsData 
    ? analyticsData.miscCost 
    : filteredExpenses.filter(e => e.type !== 'Toll Charges').reduce((sum, e) => sum + Number(e.amount), 0);
    
  const totalOpex = Number(opexFuel) + Number(opexMaintenance) + Number(opexTolls) + Number(opexMisc);

  // Vehicle ROI (%) = (Revenue / Opex) * 100
  const totalRevenue = filteredTrips.filter(t => t.status === 'Completed').reduce((sum, t) => sum + (Number(t.cost) * 1.4), 0);
  
  const overallROI = analyticsData 
    ? Math.round(analyticsData.overallRoi)
    : (totalOpex > 0 ? Math.round((totalRevenue / totalOpex) * 100) : 0);

  // ----------------------------------------------------
  // CSV / PDF / Print Exports
  // ----------------------------------------------------
  const handleExportCSV = async () => {
    try {
      const params = {};
      if (selectedVehicle !== 'All') params.vehicleId = selectedVehicle;
      if (selectedVehicleType !== 'All') params.type = selectedVehicleType;
      if (selectedRegion !== 'All') params.region = selectedRegion;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (selectedTripStatus !== 'All') params.tripStatus = selectedTripStatus;

      const response = await api.get('/analytics/export/csv', {
        params,
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'TransitOps_Analytics_Report.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('CSV Export failed:', err);
      alert('Failed to export CSV report.');
    }
  };

  const handleExportPDF = async () => {
    try {
      const params = {};
      if (selectedVehicle !== 'All') params.vehicleId = selectedVehicle;
      if (selectedVehicleType !== 'All') params.type = selectedVehicleType;
      if (selectedRegion !== 'All') params.region = selectedRegion;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (selectedTripStatus !== 'All') params.tripStatus = selectedTripStatus;

      const response = await api.get('/analytics/export/pdf', {
        params,
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'TransitOps_Analytics_Report.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('PDF Export failed:', err);
      alert('Failed to export PDF report.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // ----------------------------------------------------
  // Interactive SVG Data Sets
  // ----------------------------------------------------

  // 1. Fuel Efficiency Monthly Line Data
  const efficiencyData = analyticsData
    ? analyticsData.monthlyTrends.map(t => ({ label: t.month, value: t.fuelEfficiency }))
    : [
        { label: 'Jan', value: 8.2 },
        { label: 'Feb', value: 9.1 },
        { label: 'Mar', value: 8.8 },
        { label: 'Apr', value: 9.5 },
        { label: 'May', value: 10.2 },
        { label: 'Jun', value: 9.8 },
        { label: 'Jul', value: 10.5 }
      ];

  // 2. Fleet Utilization Area Data based on Range selection
  const getUtilizationData = () => {
    if (analyticsData) {
      return analyticsData.monthlyTrends.map(t => ({ label: t.month, value: t.utilization }));
    }
    switch (utilizationRange) {
      case 'week':
        return [
          { label: 'Mon', value: 72 },
          { label: 'Tue', value: 78 },
          { label: 'Wed', value: 85 },
          { label: 'Thu', value: 80 },
          { label: 'Fri', value: 88 },
          { label: 'Sat', value: 65 },
          { label: 'Sun', value: 60 }
        ];
      case 'quarter':
        return [
          { label: 'Month 1', value: 74 },
          { label: 'Month 2', value: 82 },
          { label: 'Month 3', value: 89 }
        ];
      case 'year':
        return [
          { label: 'Q1', value: 70 },
          { label: 'Q2', value: 78 },
          { label: 'Q3', value: 85 },
          { label: 'Q4', value: 82 }
        ];
      case 'month':
      default:
        return [
          { label: 'Wk 1', value: 75 },
          { label: 'Wk 2', value: 82 },
          { label: 'Wk 3', value: 80 },
          { label: 'Wk 4', value: 85 }
        ];
    }
  };
  const utilizationData = getUtilizationData();

  // 3. Operational Cost Monthly Stacked Bar Data
  const stackedOpexData = analyticsData
    ? analyticsData.monthlyTrends.map(t => ({
        month: t.month,
        fuel: t.month === 'Jul' ? Number(opexFuel) : 22000,
        maint: t.month === 'Jul' ? Number(opexMaintenance) : 8000,
        toll: t.month === 'Jul' ? Number(opexTolls) : 4000,
        misc: t.month === 'Jul' ? Number(opexMisc) : 2000
      }))
    : [
        { month: 'Jan', fuel: 22000, maint: 8000, toll: 4000, misc: 2000 },
        { month: 'Feb', fuel: 24000, maint: 12000, toll: 4500, misc: 2500 },
        { month: 'Mar', fuel: 26000, maint: 6000, toll: 4200, misc: 3000 },
        { month: 'Apr', fuel: 28000, maint: 15000, toll: 5000, misc: 4000 },
        { month: 'May', fuel: 32000, maint: 10000, toll: 5500, misc: 3500 },
        { month: 'Jun', fuel: 30000, maint: 18000, toll: 6000, misc: 4500 },
        { month: 'Jul', fuel: Number(opexFuel) || 35000, maint: Number(opexMaintenance) || 12000, toll: Number(opexTolls) || 5000, misc: Number(opexMisc) || 3000 }
      ];

  // 5. Monthly Profit Data (Revenue - Operational Cost)
  const monthlyProfitData = analyticsData
    ? analyticsData.monthlyTrends.map(t => ({
        month: t.month,
        revenue: Number(t.revenue),
        opex: Number(t.opex),
        profit: Number(t.profit)
      }))
    : [
        { month: 'Jan', revenue: 48000, opex: 36000, profit: 12000 },
        { month: 'Feb', revenue: 52000, opex: 43000, profit: 9000 },
        { month: 'Mar', revenue: 50000, opex: 39200, profit: 10800 },
        { month: 'Apr', revenue: 65000, opex: 52000, profit: 13000 },
        { month: 'May', revenue: 70000, opex: 51000, profit: 19000 },
        { month: 'Jun', revenue: 72000, opex: 58500, profit: 13500 },
        { month: 'Jul', revenue: Math.round(totalRevenue) || 78000, opex: Math.round(totalOpex) || 55000, profit: Math.round(totalRevenue - totalOpex) || 23000 }
      ];

  const maxProfitVal = Math.max(...monthlyProfitData.map(d => d.profit), 30000);
  const profitCoords = monthlyProfitData.map((d, idx) => {
    const step = 460 / (monthlyProfitData.length - 1);
    const cx = 20 + idx * step;
    const cy = 180 - (d.profit / maxProfitVal) * 140;
    return { cx, cy, ...d };
  });

  const profitLinePath = profitCoords.reduce((path, pt, idx) => {
    return path + `${idx === 0 ? 'M' : 'L'} ${pt.cx} ${pt.cy}`;
  }, '');

  const profitAreaPath = profitCoords.reduce((path, pt, idx) => {
    return path + `${idx === 0 ? 'M' : 'L'} ${pt.cx} ${pt.cy}`;
  }, '') + ` L ${profitCoords[profitCoords.length - 1].cx} 180 L ${profitCoords[0].cx} 180 Z`;

  // 4. Vehicle ROI Data
  const sortedVehicleROI = analyticsData
    ? analyticsData.vehiclePerformance.map(v => ({
        reg: v.registrationNumber,
        roi: Math.round(v.roi)
      })).sort((a, b) => b.roi - a.roi)
    : vehicles.map(v => {
        const cost = getVehicleOperationalCost(v.id);
        const rev = getVehicleRevenue(v.id);
        const roiFactor = cost > 0 ? Math.round((rev / cost) * 100) : 0;
        return {
          reg: v.registrationNumber,
          roi: roiFactor
        };
      }).sort((a, b) => b.roi - a.roi);

  // Return ROI threshold color
  const getROIColor = (roi) => {
    if (roi >= 150) return '#10B981'; // Green
    if (roi >= 100) return '#FF8A00'; // Orange
    return '#EF4444'; // Red
  };

  if (loading && !analyticsData) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0E0E0E]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#ff8a00] border-t-transparent"></div>
          <p className="text-sm font-semibold text-gray-400">Loading TransitOps Analytics...</p>
        </div>
      </div>
    );
  }

  if (error && !analyticsData) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0E0E0E] text-white">
        <div className="glass-card p-8 rounded-xl max-w-md text-center space-y-4">
          <span className="material-symbols-outlined text-[#EF4444] text-[48px]">error</span>
          <h3 className="text-xl font-bold">Analytics Loading Error</h3>
          <p className="text-sm text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#ff8a00] rounded-lg text-sm font-bold hover:bg-[#ff8a00]/90 transition"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .glass-card {
            background: var(--bg-card);
            backdrop-filter: blur(16px);
            border: 1px solid var(--border-color);
            transition: all 250ms ease;
        }
        .metric-glow {
            text-shadow: 0 0 15px rgba(255, 138, 0, 0.1);
        }
        .filter-select, .filter-input {
            background-color: var(--bg-app);
            border: 1px solid var(--border-color);
            color: var(--color-text-primary);
            font-size: 0.75rem;
            border-radius: 6px;
            padding: 6px 12px;
            outline: none;
            transition: border-color 0.2s;
        }
        .filter-select:focus, .filter-input:focus {
            border-color: #ff8a00;
        }
        .chart-grid-line {
            stroke: var(--border-color);
            opacity: 0.4;
        }
        .chart-label {
            fill: var(--color-text-muted);
            font-size: 10px;
            font-weight: 500;
        }
        @media print {
            aside, header, .filter-panel, .export-buttons {
                display: none !important;
            }
            main {
                margin-left: 0 !important;
                padding: 0 !important;
                background-color: #ffffff !important;
                color: #000000 !important;
                width: 100% !important;
            }
            .glass-card {
                background: #ffffff !important;
                border: 1px solid #cccccc !important;
                box-shadow: none !important;
                page-break-inside: avoid !important;
            }
        }
      `}</style>

      <main className="ml-[260px] min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--color-text-secondary)] transition-all duration-200">
        <Header 
          title="Analytics & Operations Reports" 
          subtitle="Enterprise operational efficiency, opex audits, and ROI evaluations"
        />

        <div className="p-6 space-y-6 flex-grow relative">
          
          {/* Global Analytics Filters */}
          <div className="filter-panel glass-card p-4 rounded-xl border border-[var(--border-color)] flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Vehicle filter */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-wider">Vehicle</label>
                <select 
                  className="filter-select"
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                >
                  <option value="All">All Vehicles</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.registrationNumber}</option>
                  ))}
                </select>
              </div>

              {/* Vehicle Type filter */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-wider">Vehicle Type</label>
                <select 
                  className="filter-select"
                  value={selectedVehicleType}
                  onChange={(e) => setSelectedVehicleType(e.target.value)}
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

              {/* Region filter */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-wider">Region</label>
                <select 
                  className="filter-select"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  <option value="All">All Regions</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                </select>
              </div>

              {/* Trip Status filter */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-wider">Trip Status</label>
                <select 
                  className="filter-select"
                  value={selectedTripStatus}
                  onChange={(e) => setSelectedTripStatus(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Date Range filters */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-wider">Start Date</label>
                <input 
                  type="date" 
                  className="filter-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-wider">End Date</label>
                <input 
                  type="date" 
                  className="filter-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <button 
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 text-xs text-[#ff8a00] hover:text-[#ffb77f] font-semibold border border-[#ff8a00]/30 hover:border-[#ff8a00] rounded-lg px-4 py-2 bg-[#ff8a00]/5 transition-all self-end h-[34px] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              Reset Filters
            </button>
          </div>

          {/* Export Actions Bar */}
          <div className="export-buttons flex justify-between items-center bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-xl">
            <h4 className="text-sm font-bold text-[var(--color-text-primary)]">Reporting Controls</h4>
            <div className="flex gap-3">
              <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 border border-[var(--border-color)] rounded-lg text-xs font-semibold hover:bg-[var(--bg-app)] text-[var(--color-text-primary)] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                Export CSV
              </button>
              <button 
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 border border-[var(--border-color)] rounded-lg text-xs font-semibold hover:bg-[var(--bg-app)] text-[var(--color-text-primary)] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                Export PDF
              </button>
              <button 
                onClick={handlePrint}
                className="bg-[#ff8a00] text-black px-5 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                Print Report
              </button>
            </div>
          </div>

          {/* Top KPI Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Fuel Efficiency */}
            <div className="glass-card p-6 rounded-xl flex flex-col justify-between">
              <span className="text-[var(--color-text-muted)] text-xs font-bold uppercase tracking-wider">Avg Fuel Efficiency</span>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[var(--color-text-primary)] metric-glow">{avgFuelEfficiency}</span>
                <span className="text-xs text-[var(--color-text-muted)]">km/L</span>
              </div>
            </div>

            {/* Fleet Utilization */}
            <div className="glass-card p-6 rounded-xl flex flex-col justify-between">
              <span className="text-[var(--color-text-muted)] text-xs font-bold uppercase tracking-wider">Fleet Utilization</span>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[var(--color-text-primary)] metric-glow">{fleetUtilization}%</span>
                <span className="text-xs text-[var(--color-text-muted)]">active ratio</span>
              </div>
            </div>

            {/* Operational Cost */}
            <div className="glass-card p-6 rounded-xl flex flex-col justify-between">
              <span className="text-[var(--color-text-muted)] text-xs font-bold uppercase tracking-wider">Total Operational Cost</span>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[var(--color-text-primary)] metric-glow">₹{totalOpex.toLocaleString()}</span>
              </div>
            </div>

            {/* Vehicle ROI */}
            <div className="glass-card p-6 rounded-xl flex flex-col justify-between">
              <span className="text-[var(--color-text-muted)] text-xs font-bold uppercase tracking-wider">Overall Return on Investment</span>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[var(--color-text-primary)] metric-glow">{overallROI}%</span>
                <span className="text-xs text-[var(--color-text-muted)]">ROI ratio</span>
              </div>
            </div>
          </div>

          {/* Interactive Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Chart 1: Monthly Net Profit (Interactive Bar Chart) */}
            <div className="glass-card p-6 rounded-xl space-y-4 relative col-span-1">
              <div>
                <h3 className="text-sm font-bold text-[var(--color-text-primary)]">Monthly Net Profit</h3>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Net profit profile (Revenue - Operational Cost) logged monthly</p>
              </div>

              {/* Chart SVG wrapper */}
              <div className="h-64 flex items-center justify-center relative w-full pt-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  {[40, 90, 140].map((y, idx) => (
                    <line key={idx} x1="0" y1={y} x2="500" y2={y} className="chart-grid-line" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3" />
                  ))}

                  {/* Render Profit Bars */}
                  {profitCoords.map((item, idx) => {
                    const barWidth = 30;
                    const step = 420 / 6;
                    const x = 30 + idx * step;
                    
                    const height = (item.profit / maxProfitVal) * 140;
                    const y = 180 - height;

                    return (
                      <rect 
                        key={idx}
                        x={x} 
                        y={y} 
                        width={barWidth} 
                        height={height} 
                        fill="#10B981" 
                        rx="4"
                        className="cursor-pointer hover:opacity-90 hover:scale-x-105 transition-all origin-bottom"
                        onMouseEnter={(e) => {
                          const rect = e.target.getBoundingClientRect();
                          setTooltip({
                            x: rect.left + window.scrollX - 250,
                            y: rect.top + window.scrollY - 100,
                            label: `${item.month} - Net Profit`,
                            value: `₹${Math.round(item.profit).toLocaleString()} (Rev: ₹${Math.round(item.revenue).toLocaleString()})`
                          });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    );
                  })}
                </svg>

                {/* Y Axis Labels */}
                <div className="absolute left-0 h-[180px] top-4 flex flex-col justify-between text-[9px] text-[var(--color-text-muted)] pointer-events-none">
                  <span>₹{Math.round(maxProfitVal).toLocaleString()}</span>
                  <span>₹{Math.round(maxProfitVal * 0.6).toLocaleString()}</span>
                  <span>₹{Math.round(maxProfitVal * 0.3).toLocaleString()}</span>
                  <span>₹0</span>
                </div>
              </div>

              {/* X Axis Labels */}
              <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] px-10 font-semibold uppercase tracking-wider pt-2 border-t border-[var(--border-color)]/20">
                {monthlyProfitData.map((item, idx) => (
                  <span key={idx}>{item.month}</span>
                ))}
              </div>
            </div>

            {/* Chart 2: Fuel Efficiency (Interactive Line Chart) */}
            <div className="glass-card p-6 rounded-xl space-y-4 relative">
              <div>
                <h3 className="text-sm font-bold text-[var(--color-text-primary)]">Fuel Efficiency Profile</h3>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Average efficiency (km/L) plotted monthly</p>
              </div>

              {/* Chart SVG wrapper */}
              <div className="h-64 flex items-center justify-center relative w-full pt-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  {[40, 90, 140].map((y, idx) => (
                    <line key={idx} x1="0" y1={y} x2="500" y2={y} className="chart-grid-line" stroke="#2E2E2E" strokeWidth="1" strokeDasharray="3" />
                  ))}
                  
                  {/* Line Path */}
                  <path 
                    d="M 20 160 L 95 140 L 175 148 L 255 130 L 335 110 L 415 120 L 480 100" 
                    fill="none" 
                    stroke="#ff8a00" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                  />

                  {/* Interactive Circles */}
                  {efficiencyData.map((item, idx) => {
                    const coords = [
                      [20, 160], [95, 140], [175, 148], [255, 130], [335, 110], [415, 120], [480, 100]
                    ];
                    const [cx, cy] = coords[idx];
                    return (
                      <circle 
                        key={idx}
                        cx={cx} 
                        cy={cy} 
                        r="6" 
                        fill="#ff8a00" 
                        stroke={theme === 'dark' ? '#1E1E1E' : '#FFFFFF'}
                        strokeWidth="2"
                        className="cursor-pointer hover:scale-125 transition-transform"
                        onMouseEnter={(e) => {
                          const rect = e.target.getBoundingClientRect();
                          setTooltip({
                            x: rect.left + window.scrollX - 250,
                            y: rect.top + window.scrollY - 100,
                            label: item.label,
                            value: `${item.value} km/L`
                          });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    );
                  })}
                </svg>

                {/* Y Axis Labels */}
                <div className="absolute left-0 h-[180px] top-4 flex flex-col justify-between text-[9px] text-[var(--color-text-muted)] pointer-events-none">
                  <span>12 km/L</span>
                  <span>8 km/L</span>
                  <span>4 km/L</span>
                  <span>0 km/L</span>
                </div>
              </div>

              {/* X Axis Labels */}
              <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] px-6 font-semibold uppercase tracking-wider pt-2">
                {efficiencyData.map((item, idx) => (
                  <span key={idx}>{item.label}</span>
                ))}
              </div>
            </div>

            {/* Chart 2: Fleet Utilization (Interactive Area Chart) */}
            <div className="glass-card p-6 rounded-xl space-y-4 relative">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-[var(--color-text-primary)]">Fleet Utilization Area</h3>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Utilization ratios across timelines</p>
                </div>
                {/* Range filters */}
                <div className="flex gap-1.5 bg-[var(--bg-app)] p-1 rounded-lg border border-[var(--border-color)]">
                  {['week', 'month', 'quarter', 'year'].map(r => (
                    <button
                      key={r}
                      onClick={() => setUtilizationRange(r)}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-all cursor-pointer ${
                        utilizationRange === r 
                          ? 'bg-[#ff8a00] text-black' 
                          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart SVG wrapper */}
              <div className="h-64 flex items-center justify-center relative w-full pt-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                  {[40, 90, 140].map((y, idx) => (
                    <line key={idx} x1="0" y1={y} x2="500" y2={y} className="chart-grid-line" stroke="#2E2E2E" strokeWidth="1" strokeDasharray="3" />
                  ))}

                  {/* Draw Area */}
                  <path 
                    d="M 20 180 L 20 120 L 150 90 L 280 110 L 400 80 L 480 100 L 480 180 Z" 
                    fill="url(#utilizationGrad)" 
                    opacity="0.25"
                  />
                  <path 
                    d="M 20 120 L 150 90 L 280 110 L 400 80 L 480 100" 
                    fill="none" 
                    stroke="#10B981" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                  />

                  {/* Interactive Nodes */}
                  {utilizationData.map((item, idx) => {
                    const step = 460 / (utilizationData.length - 1);
                    const cx = 20 + idx * step;
                    // Mock coordinates matching path peak approximations
                    const cy = 180 - (item.value / 100) * 120;
                    return (
                      <circle 
                        key={idx}
                        cx={cx} 
                        cy={cy} 
                        r="6" 
                        fill="#10B981" 
                        stroke={theme === 'dark' ? '#1E1E1E' : '#FFFFFF'}
                        strokeWidth="2"
                        className="cursor-pointer hover:scale-125 transition-transform"
                        onMouseEnter={(e) => {
                          const rect = e.target.getBoundingClientRect();
                          setTooltip({
                            x: rect.left + window.scrollX - 250,
                            y: rect.top + window.scrollY - 100,
                            label: item.label,
                            value: `Utilization: ${item.value}%`
                          });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    );
                  })}

                  <defs>
                    <linearGradient id="utilizationGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Y Axis Labels */}
                <div className="absolute left-0 h-[180px] top-4 flex flex-col justify-between text-[9px] text-[var(--color-text-muted)] pointer-events-none">
                  <span>100%</span>
                  <span>60%</span>
                  <span>30%</span>
                  <span>0%</span>
                </div>
              </div>

              {/* X Axis Labels */}
              <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] px-6 font-semibold uppercase tracking-wider pt-2">
                {utilizationData.map((item, idx) => (
                  <span key={idx}>{item.label}</span>
                ))}
              </div>
            </div>

            {/* Chart 3: Operational Cost (Interactive Stacked Bar Chart) */}
            <div className="glass-card p-6 rounded-xl space-y-4 relative">
              <div>
                <h3 className="text-sm font-bold text-[var(--color-text-primary)]">Monthly Operational Expenditures</h3>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Breakdown of Fuel, Maintenance, Toll, and Misc Costs</p>
              </div>

              {/* Chart SVG wrapper */}
              <div className="h-64 flex items-center justify-center relative w-full pt-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                  {[40, 90, 140].map((y, idx) => (
                    <line key={idx} x1="0" y1={y} x2="500" y2={y} className="chart-grid-line" stroke="#2E2E2E" strokeWidth="1" strokeDasharray="3" />
                  ))}

                  {/* Render Stacked Bars */}
                  {stackedOpexData.map((data, idx) => {
                    const barWidth = 30;
                    const step = 420 / 6;
                    const x = 30 + idx * step;
                    
                    // Normalize height factor (max sum is ~80k, mapping to max height of 150)
                    const factor = 150 / 80000;

                    const hFuel = data.fuel * factor;
                    const hMaint = data.maint * factor;
                    const hToll = data.toll * factor;
                    const hMisc = data.misc * factor;

                    // Compute vertical stacked starting points
                    const yFuel = 180 - hFuel;
                    const yMaint = yFuel - hMaint;
                    const yToll = yMaint - hToll;
                    const yMisc = yToll - hMisc;

                    return (
                      <g key={idx}>
                        {/* Fuel */}
                        <rect 
                          x={x} y={yFuel} width={barWidth} height={hFuel} fill="#FF8A00" rx="2" className="cursor-pointer hover:opacity-90"
                          onMouseEnter={(e) => {
                            const rect = e.target.getBoundingClientRect();
                            setTooltip({
                              x: rect.left + window.scrollX - 250, y: rect.top + window.scrollY - 100,
                              label: `${data.month} - Fuel`, value: `₹${data.fuel.toLocaleString()}`
                            });
                          }}
                          onMouseLeave={() => setTooltip(null)}
                        />
                        {/* Maintenance */}
                        <rect 
                          x={x} y={yMaint} width={barWidth} height={hMaint} fill="#EF4444" rx="2" className="cursor-pointer hover:opacity-90"
                          onMouseEnter={(e) => {
                            const rect = e.target.getBoundingClientRect();
                            setTooltip({
                              x: rect.left + window.scrollX - 250, y: rect.top + window.scrollY - 100,
                              label: `${data.month} - Maintenance`, value: `₹${data.maint.toLocaleString()}`
                            });
                          }}
                          onMouseLeave={() => setTooltip(null)}
                        />
                        {/* Tolls */}
                        <rect 
                          x={x} y={yToll} width={barWidth} height={hToll} fill="#3B82F6" rx="2" className="cursor-pointer hover:opacity-90"
                          onMouseEnter={(e) => {
                            const rect = e.target.getBoundingClientRect();
                            setTooltip({
                              x: rect.left + window.scrollX - 250, y: rect.top + window.scrollY - 100,
                              label: `${data.month} - Tolls`, value: `₹${data.toll.toLocaleString()}`
                            });
                          }}
                          onMouseLeave={() => setTooltip(null)}
                        />
                        {/* Misc */}
                        <rect 
                          x={x} y={yMisc} width={barWidth} height={hMisc} fill="#A855F7" rx="2" className="cursor-pointer hover:opacity-90"
                          onMouseEnter={(e) => {
                            const rect = e.target.getBoundingClientRect();
                            setTooltip({
                              x: rect.left + window.scrollX - 250, y: rect.top + window.scrollY - 100,
                              label: `${data.month} - Miscellaneous`, value: `₹${data.misc.toLocaleString()}`
                            });
                          }}
                          onMouseLeave={() => setTooltip(null)}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Y Axis Labels */}
                <div className="absolute left-0 h-[180px] top-4 flex flex-col justify-between text-[9px] text-[var(--color-text-muted)] pointer-events-none">
                  <span>₹80,000</span>
                  <span>₹50,000</span>
                  <span>₹20,000</span>
                  <span>₹0</span>
                </div>
              </div>

              {/* X Axis Labels & Legends */}
              <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] px-10 font-semibold uppercase tracking-wider pt-2 border-b border-[var(--border-color)]/20 pb-3">
                {stackedOpexData.map((d, idx) => (
                  <span key={idx}>{d.month}</span>
                ))}
              </div>

              <div className="flex justify-center gap-4 text-[9px] font-bold uppercase text-[var(--color-text-muted)]">
                <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#FF8A00] rounded"></span>Fuel</div>
                <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#EF4444] rounded"></span>Maint.</div>
                <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#3B82F6] rounded"></span>Toll</div>
                <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#A855F7] rounded"></span>Misc</div>
              </div>
            </div>

            {/* Chart 4: Vehicle ROI (Interactive Horizontal Bar Chart) */}
            <div className="glass-card p-6 rounded-xl space-y-4 relative">
              <div>
                <h3 className="text-sm font-bold text-[var(--color-text-primary)]">Asset Return on Investment (ROI)</h3>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-1">ROI rates by vehicles (sorted highest to lowest)</p>
              </div>

              <div className="space-y-4 pt-2 overflow-y-auto max-h-[220px] pr-2">
                {sortedVehicleROI.map((v, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span className="font-mono text-[var(--color-text-primary)]">{v.reg}</span>
                      <span style={{ color: getROIColor(v.roi) }} className="font-bold">
                        {v.roi}%
                      </span>
                    </div>
                    {/* Horizontal Bar */}
                    <div className="w-full bg-[var(--bg-app)] border border-[var(--border-color)] h-3 rounded-full overflow-hidden relative">
                      <div 
                        className="h-full rounded-full transition-all duration-500 cursor-pointer"
                        style={{ 
                          width: `${Math.min(v.roi, 200)/2}%`, // cap visual bar at 200% for space
                          backgroundColor: getROIColor(v.roi) 
                        }}
                        onMouseEnter={(e) => {
                          const rect = e.target.getBoundingClientRect();
                          setTooltip({
                            x: rect.left + window.scrollX - 250,
                            y: rect.top + window.scrollY - 100,
                            label: v.reg,
                            value: `ROI: ${v.roi}%`
                          });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Legends */}
              <div className="flex justify-center gap-4 text-[9px] font-bold uppercase text-[var(--color-text-muted)] border-t border-[var(--border-color)]/20 pt-3">
                <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#10B981] rounded"></span>High (&ge; 150%)</div>
                <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#FF8A00] rounded"></span>Medium (100% - 149%)</div>
                <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#EF4444] rounded"></span>Low (&lt; 100%)</div>
              </div>
            </div>

          </div>

          {/* Floating Tooltip Component */}
          {tooltip && (
            <div 
              className="absolute z-50 bg-[var(--bg-card)] border border-[var(--border-color)] px-3 py-1.5 rounded-lg shadow-2xl text-xs pointer-events-none text-[var(--color-text-primary)]"
              style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
            >
              <div className="font-bold text-[#ff8a00]">{tooltip.label}</div>
              <div className="text-[var(--color-text-secondary)] mt-0.5">{tooltip.value}</div>
            </div>
          )}

        </div>
      </main>
    </>
  );
};

export default Reports;
