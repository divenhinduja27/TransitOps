import React, { useState } from 'react';
import Header from '../components/Header';
import { useERP } from '../context/ERPContext';
import useAuth from '../hooks/useAuth';

const Settings = () => {
  const { user } = useAuth();
  const { 
    currency, 
    updateCurrency, 
    distanceUnit, 
    updateDistanceUnit 
  } = useERP();

  // Load configuration settings from localStorage or fallback to defaults
  const [depotName, setDepotName] = useState(() => {
    return localStorage.getItem('erp_depot_name') || 'Gandhinagar Depot GJ4';
  });

  const [localCurrency, setLocalCurrency] = useState(currency);
  const [localDistanceUnit, setLocalDistanceUnit] = useState(distanceUnit);
  const [successMsg, setSuccessMsg] = useState('');

  const userDisplayName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user?.email?.split('@')[0] || 'Operator');
  const userRoleLabel = user?.role === 'ROLE_FLEET_MANAGER' ? 'Fleet Manager' : user?.role === 'ROLE_DRIVER' ? 'Dispatcher' : 'Operator';

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('erp_depot_name', depotName);
    updateCurrency(localCurrency);
    updateDistanceUnit(localDistanceUnit);
    setSuccessMsg('System operational profiles successfully saved.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const depotOptions = [
    'Gandhinagar Depot GJ4',
    'Mumbai Port (JNPT)',
    'Delhi Cargo Hub',
    'Chennai Dockyard',
    'Bangalore Depot',
    'Kolkata Port'
  ];

  const currencyOptions = [
    'INR (Rs)',
    'USD ($)',
    'EUR (€)',
    'GBP (£)'
  ];

  const distanceOptions = [
    'Kilometers',
    'Miles',
    'Nautical Miles'
  ];

  return (
    <>
      <style>{`
        .glass-card {
          background: var(--bg-card);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-color);
        }
        .form-select {
          background-color: var(--bg-app);
          border: 1px solid var(--border-color);
          color: var(--color-text-primary);
          width: 100%;
          height: 46px;
          padding: 0 16px;
          border-radius: 8px;
          outline: none;
          transition: all 0.2s ease-in-out;
          font-size: 0.8125rem;
          cursor: pointer;
          appearance: none;
          background-repeat: no-repeat;
          background-position: right 16px center;
          background-size: 16px;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
        }
        .form-select:focus {
          border-color: #ff8a00;
          box-shadow: 0 0 0 2px rgba(255, 138, 0, 0.1);
        }
        .glow-bullet {
          box-shadow: 0 0 8px #ff8a00;
        }
      `}</style>

      <main className="ml-[260px] min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--color-text-secondary)]">
        <Header 
          title="Settings & Config" 
          actions={
            <div className="flex items-center gap-3 mr-4">
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">{userDisplayName}</span>
              <span className="bg-sky-500/10 text-sky-400 border border-sky-500/30 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full">
                {userRoleLabel}
              </span>
            </div>
          }
        />

        <div className="p-8 space-y-6 flex-grow max-w-5xl mx-auto w-full">
          {successMsg && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-3 animate-fade-in">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span className="font-semibold">{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* General Settings Column */}
            <div className="glass-card p-8 rounded-2xl border border-[var(--border-color)] flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#ff8a00] mb-1">
                    General
                  </h3>
                  <p className="text-[10px] text-[var(--color-text-muted)]">Configure global parameters and depot metrics.</p>
                </div>

                <form onSubmit={handleSave} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider">Depot Name</label>
                    <select
                      className="form-select"
                      value={depotName}
                      onChange={(e) => setDepotName(e.target.value)}
                    >
                      {depotOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider">Currency</label>
                    <select
                      className="form-select"
                      value={localCurrency}
                      onChange={(e) => setLocalCurrency(e.target.value)}
                    >
                      {currencyOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider">Distance Unit</label>
                    <select
                      className="form-select"
                      value={localDistanceUnit}
                      onChange={(e) => setLocalDistanceUnit(e.target.value)}
                    >
                      {distanceOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-2.5 rounded-full font-bold hover:shadow-lg hover:shadow-blue-500/10 active:scale-95 transition-all text-xs cursor-pointer duration-200"
                    >
                      Save changes
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Profile/System Summary Column */}
            <div className="glass-card p-8 rounded-2xl border border-[var(--border-color)] flex flex-col justify-between relative overflow-hidden">
              {/* background highlights */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff8a00]/5 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#ff8a00] mb-1">
                    System Metrics Preview
                  </h3>
                  <p className="text-[10px] text-[var(--color-text-muted)]">Real-time status display of selected ERP parameters.</p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center py-3 border-b border-[var(--border-color)]">
                    <span className="text-xs text-[var(--color-text-muted)]">Operational Node</span>
                    <span className="text-xs text-[var(--color-text-primary)] font-semibold">{depotName}</span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-[var(--border-color)]">
                    <span className="text-xs text-[var(--color-text-muted)]">Billing Currency</span>
                    <span className="text-xs text-[var(--color-text-primary)] font-semibold font-mono">{localCurrency}</span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-[var(--border-color)]">
                    <span className="text-xs text-[var(--color-text-muted)]">Metric Scaling</span>
                    <span className="text-xs text-[#ff8a00] font-semibold">{localDistanceUnit}</span>
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <span className="text-xs text-[var(--color-text-muted)]">System Link Status</span>
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping glow-bullet"></span>
                      Synchronized
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--bg-app)] p-4 rounded-xl border border-[var(--border-color)] flex gap-3 text-[10px] text-[var(--color-text-muted)] items-start leading-relaxed mt-6">
                <span className="material-symbols-outlined text-[#ff8a00] text-[18px] shrink-0">info</span>
                <p>
                  These config properties govern routing calculations, fuel expense summaries, and billing computations throughout the dashboard interface.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Settings;
