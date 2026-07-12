import React, { useState } from 'react';
import Header from '../components/Header';

const Settings = () => {
  // Load configuration settings from localStorage or fallback to blueprint defaults
  const [depotName, setDepotName] = useState(() => {
    return localStorage.getItem('erp_depot_name') || 'Gandhinagar Depot GJ4';
  });

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('erp_currency') || 'INR (Rs)';
  });

  const [distanceUnit, setDistanceUnit] = useState(() => {
    return localStorage.getItem('erp_distance_unit') || 'Kilometers';
  });

  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('erp_depot_name', depotName);
    localStorage.setItem('erp_currency', currency);
    localStorage.setItem('erp_distance_unit', distanceUnit);
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
          background: rgba(30, 30, 30, 0.45);
          backdrop-filter: blur(12px);
          border: 1px solid #2E2E2E;
        }
        .form-select {
          background-color: #161616;
          border: 1px solid #2E2E2E;
          color: #e6e1e2;
          width: 100%;
          height: 46px;
          padding: 0 16px;
          border-radius: 8px;
          outline: none;
          transition: all 0.2s ease-in-out;
          font-size: 0.8125rem;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          background-size: 16px;
        }
        .form-select:focus {
          border-color: #ff8a00;
          box-shadow: 0 0 0 2px rgba(255, 138, 0, 0.1);
        }
        .glow-bullet {
          box-shadow: 0 0 8px #ff8a00;
        }
      `}</style>

      <main className="ml-[260px] min-h-screen flex flex-col bg-[#111111] text-[#e6e1e2]">
        <Header 
          title="Settings & Config" 
          actions={
            <div className="flex items-center gap-3 mr-4">
              <span className="text-sm font-semibold text-white">Raven K.</span>
              <span className="bg-sky-500/10 text-sky-400 border border-sky-500/30 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full">
                Dispatcher
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
            <div className="glass-card p-8 rounded-2xl border border-[#2E2E2E] flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#ff8a00] mb-1">
                    General
                  </h3>
                  <p className="text-[10px] text-zinc-400">Configure global parameters and depot metrics.</p>
                </div>

                <form onSubmit={handleSave} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Depot Name</label>
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
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Currency</label>
                    <select
                      className="form-select"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      {currencyOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Distance Unit</label>
                    <select
                      className="form-select"
                      value={distanceUnit}
                      onChange={(e) => setDistanceUnit(e.target.value)}
                    >
                      {distanceOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-2.5  rounded-full font-bold hover:shadow-lg hover:shadow-blue-500/10 active:scale-95 transition-all text-xs cursor-pointer duration-200"
                    >
                      Save changes
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Profile/System Summary Column */}
            <div className="glass-card p-8 rounded-2xl border border-[#2E2E2E] flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#1E1E1E] to-[#121212]">
              {/* background highlights */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff8a00]/5 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#ff8a00] mb-1">
                    System Metrics Preview
                  </h3>
                  <p className="text-[10px] text-zinc-400">Real-time status display of selected ERP parameters.</p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center py-3 border-b border-zinc-800">
                    <span className="text-xs text-zinc-400">Operational Node</span>
                    <span className="text-xs text-white font-semibold">{depotName}</span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-zinc-800">
                    <span className="text-xs text-zinc-400">Billing Currency</span>
                    <span className="text-xs text-white font-semibold font-mono">{currency}</span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-zinc-800">
                    <span className="text-xs text-zinc-400">Metric Scaling</span>
                    <span className="text-xs text-[#ff8a00] font-semibold">{distanceUnit}</span>
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <span className="text-xs text-zinc-400">System Link Status</span>
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping glow-bullet"></span>
                      Synchronized
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#161616] p-4 rounded-xl border border-[#2E2E2E] flex gap-3 text-[10px] text-zinc-400 items-start leading-relaxed">
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
