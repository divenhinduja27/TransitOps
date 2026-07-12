import React, { useState } from 'react';
import Header from '../components/Header';

const Settings = () => {
  // Mock Settings States
  const [notifications, setNotifications] = useState({
    smsAlerts: true,
    emailSummaries: false,
    maintenanceAlarms: true,
    tripUpdates: true
  });

  const [departments, setDepartments] = useState({
    dispatchHubName: 'Region A-12 Control Center',
    primaryTimezone: 'Asia/Kolkata (IST)',
    maxHoursPerShift: '12',
    enableAutoRerouting: true
  });

  const [permissions, setPermissions] = useState([
    { role: 'Administrator', read: true, write: true, delete: true, dispatch: true },
    { role: 'Manager', read: true, write: true, delete: false, dispatch: true },
    { role: 'Dispatcher', read: true, write: false, delete: false, dispatch: true },
    { role: 'Driver', read: true, write: false, delete: false, dispatch: false }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setSuccessMsg('Configurations successfully committed to database.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleTogglePermission = (index, field) => {
    setPermissions(prev => prev.map((p, idx) => 
      idx === index ? { ...p, [field]: !p[field] } : p
    ));
  };

  return (
    <>
      <style>{`
        .glass-card {
            background: rgba(30, 30, 30, 0.6);
            backdrop-filter: blur(12px);
            border: 1px solid #2E2E2E;
        }
        .form-input {
            background-color: #161616;
            border: 1px solid #2E2E2E;
            color: #e6e1e2;
            width: 100%;
            height: 40px;
            padding: 0 12px;
            border-radius: 6px;
            outline: none;
            transition: border-color 0.2s;
        }
        .form-input:focus {
            border-color: #ff8a00;
        }
      `}</style>

      <main className="ml-[260px] min-h-screen flex flex-col bg-[#111111] text-[#e6e1e2]">
        <Header 
          title="Command Settings" 
          subtitle="Configure system permissions, alerts protocols, and regional depots"
          searchPlaceholder="Search system config keys..."
          searchValue={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
        />

        <form onSubmit={handleSave} className="p-6 space-y-6 flex-grow">
          {successMsg && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-sm flex items-center gap-3">
              <span className="material-symbols-outlined">check_circle</span>
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* RBAC Table */}
            <div className="glass-card p-6 rounded-xl border border-[#2E2E2E] space-y-4">
              <h3 className="text-base font-bold border-b border-[#2E2E2E] pb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff8a00]">admin_panel_settings</span>
                Role-Based Access Control (RBAC)
              </h3>
              <p className="text-xs text-on-surface-variant/80">Configure authorization policy parameters across operational groups.</p>
              
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#2E2E2E] text-on-surface-variant/60 text-xs font-bold uppercase">
                      <th className="py-2 px-1">Role</th>
                      <th className="py-2 text-center">Read</th>
                      <th className="py-2 text-center">Write</th>
                      <th className="py-2 text-center">Delete</th>
                      <th className="py-2 text-center">Dispatch</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2E2E2E]/40">
                    {permissions.map((p, idx) => (
                      <tr key={p.role} className="hover:bg-[#1E1E1E]/40 transition-colors">
                        <td className="py-3 px-1 font-semibold">{p.role}</td>
                        <td className="py-3 text-center">
                          <input 
                            type="checkbox" 
                            checked={p.read} 
                            onChange={() => handleTogglePermission(idx, 'read')}
                            className="w-4 h-4 rounded border-[#2E2E2E] bg-[#161616] text-[#ff8a00] focus:ring-0" 
                          />
                        </td>
                        <td className="py-3 text-center">
                          <input 
                            type="checkbox" 
                            checked={p.write} 
                            onChange={() => handleTogglePermission(idx, 'write')}
                            className="w-4 h-4 rounded border-[#2E2E2E] bg-[#161616] text-[#ff8a00] focus:ring-0" 
                          />
                        </td>
                        <td className="py-3 text-center">
                          <input 
                            type="checkbox" 
                            checked={p.delete} 
                            disabled={p.role === 'Administrator'}
                            onChange={() => handleTogglePermission(idx, 'delete')}
                            className="w-4 h-4 rounded border-[#2E2E2E] bg-[#161616] text-[#ff8a00] focus:ring-0 disabled:opacity-30" 
                          />
                        </td>
                        <td className="py-3 text-center">
                          <input 
                            type="checkbox" 
                            checked={p.dispatch} 
                            onChange={() => handleTogglePermission(idx, 'dispatch')}
                            className="w-4 h-4 rounded border-[#2E2E2E] bg-[#161616] text-[#ff8a00] focus:ring-0" 
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Department Settings */}
            <div className="glass-card p-6 rounded-xl border border-[#2E2E2E] space-y-4">
              <h3 className="text-base font-bold border-b border-[#2E2E2E] pb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff8a00]">business</span>
                Department & Regional Node Settings
              </h3>
              
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs text-on-surface-variant font-bold uppercase">Dispatch Hub Name</label>
                  <input
                    className="form-input"
                    type="text"
                    required
                    value={departments.dispatchHubName}
                    onChange={(e) => setDepartments({ ...departments, dispatchHubName: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant font-bold uppercase">Primary Timezone</label>
                    <select
                      className="form-input bg-[#161616]"
                      value={departments.primaryTimezone}
                      onChange={(e) => setDepartments({ ...departments, primaryTimezone: e.target.value })}
                    >
                      <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
                      <option value="UTC/GMT">UTC/GMT</option>
                      <option value="US/Eastern">US/Eastern</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant font-bold uppercase">Max Shift Length (hours)</label>
                    <input
                      className="form-input"
                      type="number"
                      required
                      value={departments.maxHoursPerShift}
                      onChange={(e) => setDepartments({ ...departments, maxHoursPerShift: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    id="autoReroute"
                    type="checkbox"
                    checked={departments.enableAutoRerouting}
                    onChange={(e) => setDepartments({ ...departments, enableAutoRerouting: e.target.checked })}
                    className="w-4 h-4 rounded border-[#2E2E2E] bg-[#161616] text-[#ff8a00] focus:ring-0"
                  />
                  <label htmlFor="autoReroute" className="text-xs text-on-surface select-none">
                    Enable Autonomous Emergency Rerouting Protocols
                  </label>
                </div>
              </div>
            </div>

            {/* Notification settings */}
            <div className="glass-card p-6 rounded-xl border border-[#2E2E2E] space-y-4">
              <h3 className="text-base font-bold border-b border-[#2E2E2E] pb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff8a00]">notifications_active</span>
                Automated Alert Summaries & Notifications
              </h3>
              <p className="text-xs text-on-surface-variant/80">Configure alert routing logic for dispatch pipelines.</p>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-on-surface">SMS Critical Alerts</label>
                    <p className="text-[10px] text-on-surface-variant/80">Ping dispatch operators on driver license expiry/suspension.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.smsAlerts}
                    onChange={(e) => setNotifications({ ...notifications, smsAlerts: e.target.checked })}
                    className="w-4 h-4 rounded border-[#2E2E2E] bg-[#161616] text-[#ff8a00] focus:ring-0"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-on-surface">Email Summaries</label>
                    <p className="text-[10px] text-on-surface-variant/80">Send daily fuel opex and maintenance status logs.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.emailSummaries}
                    onChange={(e) => setNotifications({ ...notifications, emailSummaries: e.target.checked })}
                    className="w-4 h-4 rounded border-[#2E2E2E] bg-[#161616] text-[#ff8a00] focus:ring-0"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-on-surface">Maintenance Alarms</label>
                    <p className="text-[10px] text-on-surface-variant/80">Flag vehicles that exceed 30 days without safety inspections.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.maintenanceAlarms}
                    onChange={(e) => setNotifications({ ...notifications, maintenanceAlarms: e.target.checked })}
                    className="w-4 h-4 rounded border-[#2E2E2E] bg-[#161616] text-[#ff8a00] focus:ring-0"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-on-surface">Real-time Trip Updates</label>
                    <p className="text-[10px] text-on-surface-variant/80">Push web notification when a route changes phase.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.tripUpdates}
                    onChange={(e) => setNotifications({ ...notifications, tripUpdates: e.target.checked })}
                    className="w-4 h-4 rounded border-[#2E2E2E] bg-[#161616] text-[#ff8a00] focus:ring-0"
                  />
                </div>
              </div>
            </div>
            
            {/* Save Options */}
            <div className="glass-card p-6 rounded-xl border border-[#2E2E2E] flex flex-col justify-center items-center text-center space-y-4">
              <span className="material-symbols-outlined text-[48px] text-[#ff8a00] animate-pulse">settings</span>
              <div>
                <h4 className="font-bold text-sm">Save Console Settings</h4>
                <p className="text-xs text-on-surface-variant/80 max-w-xs mt-1">
                  Commit and deploy system changes across the local and remote logistics dispatch network.
                </p>
              </div>
              <button
                type="submit"
                className="bg-[#ff8a00] text-black px-6 py-2.5 rounded-full font-bold hover:opacity-90 active:scale-95 transition-all text-sm cursor-pointer"
              >
                Commit Changes
              </button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
};

export default Settings;
