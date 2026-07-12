import React from 'react';

const Settings = () => {
  return (
    <>
      {/* Page Specific Styles */}
      <style>{`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        ::-webkit-scrollbar-track {
            background: #1b110a;
        }
        ::-webkit-scrollbar-thumb {
            background: #3f3229;
            border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #564334;
        }
        .bento-card {
            background: #1e1e1e;
            border: 1px solid #2e2e2e;
            transition: all 0.2s ease;
        }

      `}</style>
      
      <main className="ml-[260px] min-h-screen flex flex-col relative">

<header className="sticky top-0 z-40 bg-background border-b border-outline-variant flex justify-between items-center w-full px-6 py-4">
<div className="flex items-center gap-4 flex-1">
<div className="relative w-full max-w-md">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-2 pl-10 pr-4 text-body-md focus:outline-none focus:border-primary transition-colors" placeholder="Search settings, users, or permissions..." type="text"/>
</div>
</div>
<div className="flex items-center gap-6">
<div className="flex items-center gap-4 text-on-surface-variant">
<button className="hover:bg-surface-container-highest p-2 rounded-full transition-all">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="hover:bg-surface-container-highest p-2 rounded-full transition-all">
<span className="material-symbols-outlined">help_outline</span>
</button>
</div>
<div className="flex items-center gap-3 pl-6 border-l border-outline-variant">
<img className="w-9 h-9 rounded-full object-cover border border-primary" data-alt="A professional portrait of a senior logistics administrator, a middle-aged woman with glasses and a friendly, authoritative expression, wearing a dark navy blazer, set against a blurred modern office background with soft orange lighting accents to match the TransitOps brand identity." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRyk0uFyOJEJYeZD_xfKjIqR3vquE4-Fgva_7aoODF_EVowCmjLJ8IjRuJHJG9QK7AeWHgFOukMcyVPKCvSOsYkJMIVyyxFUGEhVXU3H-rGiEkOr-GLkk9CGQQDEDemK554NIMpKAEPSW2wZU8D11F7wfCBLipVOdEmk_cX75HHnCsFwtzpMkZK8lSG1A5yLRyo34NdwSFDwtsdbM-Yx8RLM1t_Yh_jw_sSCKU_VmNPOJBnHkZxWF-Ww"/>
<div className="hidden lg:block">
<p className="text-label-md text-on-surface font-bold leading-tight">Elena Vance</p>
<p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">System Administrator</p>
</div>
</div>
</div>
</header>

<section className="p-6 lg:p-8 flex-1 max-w-7xl mx-auto w-full">
<div className="mb-8 flex justify-between items-end">
<div>
<h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">System Settings</h2>
<p className="text-body-md text-on-surface-variant">Configure enterprise preferences and manage role-based access control.</p>
</div>
<button className="bg-primary-container text-on-primary-fixed px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all">
<span className="material-symbols-outlined">save</span>
                    Save Changes
                </button>
</div>
<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

<div className="xl:col-span-1 space-y-6">
<div className="bento-card p-6 rounded-xl">
<div className="flex items-center gap-3 mb-6">
<span className="material-symbols-outlined text-primary">language</span>
<h3 className="font-title-lg text-title-lg">Regional Settings</h3>
</div>
<div className="space-y-4">
<div>
<label className="block text-label-md text-on-surface-variant mb-1.5">System Timezone</label>
<select className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-2.5 px-3 text-body-md focus:border-primary outline-none">
<option>UTC -05:00 Eastern Time (US &amp; Canada)</option>
<option>UTC +00:00 Greenwich Mean Time</option>
<option>UTC +01:00 Central European Time</option>
<option>UTC +08:00 Singapore Standard Time</option>
</select>
</div>
<div>
<label className="block text-label-md text-on-surface-variant mb-1.5">Date Format</label>
<select className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-2.5 px-3 text-body-md focus:border-primary outline-none">
<option>MM/DD/YYYY</option>
<option>DD/MM/YYYY</option>
<option>YYYY-MM-DD</option>
</select>
</div>
<div>
<label className="block text-label-md text-on-surface-variant mb-1.5">Units of Measurement</label>
<div className="grid grid-cols-2 gap-2">
<button className="bg-primary text-on-primary py-2 rounded-lg text-label-md font-bold">Imperial (mi, gal)</button>
<button className="bg-surface-container-lowest border border-outline-variant text-on-surface-variant py-2 rounded-lg text-label-md font-bold hover:border-outline transition-colors">Metric (km, L)</button>
</div>
</div>
</div>
</div>
<div className="bento-card p-6 rounded-xl">
<div className="flex items-center gap-3 mb-6">
<span className="material-symbols-outlined text-primary">notifications_active</span>
<h3 className="font-title-lg text-title-lg">Global Notifications</h3>
</div>
<div className="space-y-4">
<div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/30">
<div>
<p className="font-bold text-on-surface">Emergency Alerts</p>
<p className="text-xs text-on-surface-variant">SMS &amp; Push for breakdown/safety events</p>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input defaultChecked="" className="sr-only peer" type="checkbox"/>
<div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
<div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/30">
<div>
<p className="font-bold text-on-surface">Maintenance Reminders</p>
<p className="text-xs text-on-surface-variant">Weekly fleet health email digest</p>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input defaultChecked="" className="sr-only peer" type="checkbox"/>
<div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
<div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/30">
<div>
<p className="font-bold text-on-surface">Financial Reports</p>
<p className="text-xs text-on-surface-variant">Notify when fuel invoices are uploaded</p>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input className="sr-only peer" type="checkbox"/>
<div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
</div>
</div>
</div>

<div className="xl:col-span-2">
<div className="bento-card rounded-xl flex flex-col h-full overflow-hidden">
<div className="p-6 border-b border-outline-variant bg-surface-container-low/50">
<div className="flex items-center justify-between">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary">security</span>
<div>
<h3 className="font-title-lg text-title-lg">RBAC Permission Matrix</h3>
<p className="text-body-sm text-on-surface-variant">Define module access levels by organizational role.</p>
</div>
</div>
<button className="flex items-center gap-2 text-label-md font-bold text-primary hover:underline">
<span className="material-symbols-outlined text-[18px]">add</span>
                                    Custom Role
                                </button>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-lowest">
<th className="px-6 py-4 text-label-md font-bold text-on-surface-variant uppercase tracking-wider">Module</th>
<th className="px-6 py-4 text-center">
<div className="flex flex-col items-center">
<span className="text-label-md font-extrabold text-primary">Fleet Manager</span>
<span className="text-[10px] text-on-surface-variant font-medium">L3 Admin</span>
</div>
</th>
<th className="px-6 py-4 text-center">
<div className="flex flex-col items-center">
<span className="text-label-md font-extrabold text-on-surface">Dispatcher</span>
<span className="text-[10px] text-on-surface-variant font-medium">L2 Operations</span>
</div>
</th>
<th className="px-6 py-4 text-center">
<div className="flex flex-col items-center">
<span className="text-label-md font-extrabold text-on-surface">Safety Officer</span>
<span className="text-[10px] text-on-surface-variant font-medium">L2 Audit</span>
</div>
</th>
<th className="px-6 py-4 text-center">
<div className="flex flex-col items-center">
<span className="text-label-md font-extrabold text-on-surface">Financial Analyst</span>
<span className="text-[10px] text-on-surface-variant font-medium">L1 Viewer</span>
</div>
</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/30">

<tr className="hover:bg-surface-container-high/40 transition-colors">
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-on-surface-variant">local_shipping</span>
<span className="font-bold">Fleet Management</span>
</div>
</td>
<td className="px-6 py-5 text-center">
<input defaultChecked="" className="w-5 h-5 rounded border-outline-variant bg-surface-container-lowest text-primary-container focus:ring-primary-container" type="checkbox"/>
</td>
<td className="px-6 py-5 text-center">
<input defaultChecked="" className="w-5 h-5 rounded border-outline-variant bg-surface-container-lowest text-primary-container focus:ring-primary-container" type="checkbox"/>
</td>
<td className="px-6 py-5 text-center">
<input defaultChecked="" className="w-5 h-5 rounded border-outline-variant bg-surface-container-lowest text-primary-container focus:ring-primary-container" type="checkbox"/>
</td>
<td className="px-6 py-5 text-center">
<input className="w-5 h-5 rounded border-outline-variant bg-surface-container-lowest text-primary-container focus:ring-primary-container" type="checkbox"/>
</td>
</tr>

<tr className="hover:bg-surface-container-high/40 transition-colors">
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-on-surface-variant">person_pin_circle</span>
<span className="font-bold">Driver Database</span>
</div>
</td>
<td className="px-6 py-5 text-center">
<input defaultChecked="" className="w-5 h-5 rounded border-outline-variant bg-surface-container-lowest text-primary-container focus:ring-primary-container" type="checkbox"/>
</td>
<td className="px-6 py-5 text-center">
<input defaultChecked="" className="w-5 h-5 rounded border-outline-variant bg-surface-container-lowest text-primary-container focus:ring-primary-container" type="checkbox"/>
</td>
<td className="px-6 py-5 text-center">
<input defaultChecked="" className="w-5 h-5 rounded border-outline-variant bg-surface-container-lowest text-primary-container focus:ring-primary-container" type="checkbox"/>
</td>
<td className="px-6 py-5 text-center">
<input className="w-5 h-5 rounded border-outline-variant bg-surface-container-lowest text-primary-container focus:ring-primary-container" type="checkbox"/>
</td>
</tr>

<tr className="hover:bg-surface-container-high/40 transition-colors">
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-on-surface-variant">route</span>
<span className="font-bold">Trip Dispatch</span>
</div>
</td>
<td className="px-6 py-5 text-center">
<input defaultChecked="" className="w-5 h-5 rounded border-outline-variant bg-surface-container-lowest text-primary-container focus:ring-primary-container" type="checkbox"/>
</td>
<td className="px-6 py-5 text-center">
<input defaultChecked="" className="w-5 h-5 rounded border-outline-variant bg-surface-container-lowest text-primary-container focus:ring-primary-container" type="checkbox"/>
</td>
<td className="px-6 py-5 text-center">
<input className="w-5 h-5 rounded border-outline-variant bg-surface-container-lowest text-primary-container focus:ring-primary-container" type="checkbox"/>
</td>
<td className="px-6 py-5 text-center">
<input className="w-5 h-5 rounded border-outline-variant bg-surface-container-lowest text-primary-container focus:ring-primary-container" type="checkbox"/>
</td>
</tr>

<tr className="hover:bg-surface-container-high/40 transition-colors">
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-on-surface-variant">build</span>
<span className="font-bold">Maintenance Logs</span>
</div>
</td>
<td className="px-6 py-5 text-center">
<input defaultChecked="" className="w-5 h-5 rounded border-outline-variant bg-surface-container-lowest text-primary-container focus:ring-primary-container" type="checkbox"/>
</td>
<td className="px-6 py-5 text-center">
<input className="w-5 h-5 rounded border-outline-variant bg-surface-container-lowest text-primary-container focus:ring-primary-container" type="checkbox"/>
</td>
<td className="px-6 py-5 text-center">
<input defaultChecked="" className="w-5 h-5 rounded border-outline-variant bg-surface-container-lowest text-primary-container focus:ring-primary-container" type="checkbox"/>
</td>
<td className="px-6 py-5 text-center">
<input className="w-5 h-5 rounded border-outline-variant bg-surface-container-lowest text-primary-container focus:ring-primary-container" type="checkbox"/>
</td>
</tr>

<tr className="hover:bg-surface-container-high/40 transition-colors">
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-on-surface-variant">payments</span>
<span className="font-bold">Financials &amp; Fuel</span>
</div>
</td>
<td className="px-6 py-5 text-center">
<input defaultChecked="" className="w-5 h-5 rounded border-outline-variant bg-surface-container-lowest text-primary-container focus:ring-primary-container" type="checkbox"/>
</td>
<td className="px-6 py-5 text-center">
<input className="w-5 h-5 rounded border-outline-variant bg-surface-container-lowest text-primary-container focus:ring-primary-container" type="checkbox"/>
</td>
<td className="px-6 py-5 text-center">
<input className="w-5 h-5 rounded border-outline-variant bg-surface-container-lowest text-primary-container focus:ring-primary-container" type="checkbox"/>
</td>
<td className="px-6 py-5 text-center">
<input defaultChecked="" className="w-5 h-5 rounded border-outline-variant bg-surface-container-lowest text-primary-container focus:ring-primary-container" type="checkbox"/>
</td>
</tr>
</tbody>
</table>
</div>
<div className="mt-auto p-6 bg-surface-container-lowest flex items-center justify-between border-t border-outline-variant/30">
<div className="flex items-center gap-2 text-xs text-on-surface-variant italic">
<span className="material-symbols-outlined text-[14px]">info</span>
                                Settings updated 2 hours ago by admin_elena
                            </div>
<div className="flex gap-4">
<button className="text-label-md font-bold text-on-surface-variant hover:text-on-surface transition-colors">Discard Draft</button>
<button className="text-label-md font-bold text-primary hover:opacity-80 transition-opacity">Export RBAC Schema</button>
</div>
</div>
</div>
</div>
</div>

<div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
<div className="bg-surface-container p-4 rounded-lg border border-outline-variant/30 flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center">
<span className="material-symbols-outlined text-secondary text-[20px]">group</span>
</div>
<div>
<p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Active Users</p>
<p className="text-title-md font-bold">128</p>
</div>
</div>
<div className="bg-surface-container p-4 rounded-lg border border-outline-variant/30 flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center">
<span className="material-symbols-outlined text-tertiary text-[20px]">vpn_key</span>
</div>
<div>
<p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Active API Keys</p>
<p className="text-title-md font-bold">14</p>
</div>
</div>
<div className="bg-surface-container p-4 rounded-lg border border-outline-variant/30 flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-error-container/20 flex items-center justify-center">
<span className="material-symbols-outlined text-error text-[20px]">event_busy</span>
</div>
<div>
<p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Pending Revocations</p>
<p className="text-title-md font-bold">0</p>
</div>
</div>
<div className="bg-surface-container p-4 rounded-lg border border-outline-variant/30 flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center">
<span className="material-symbols-outlined text-primary text-[20px]">sync</span>
</div>
<div>
<p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Last Sync</p>
<p className="text-title-md font-bold">4m ago</p>
</div>
</div>
</div>
</section>

<div className="absolute bottom-4 right-4 pointer-events-none opacity-10">
<span className="font-display-lg text-[120px] select-none text-primary font-extrabold leading-none">RBAC</span>
</div>
</main>
    </>
  );
};

export default Settings;
