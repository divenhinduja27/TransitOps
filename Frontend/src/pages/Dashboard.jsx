import React from 'react';

const Dashboard = () => {
  return (
    <>
      {/* Page Specific Styles */}
      <style>{`
        body {
            font-family: 'Inter', sans-serif;
            background-color: #111111;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-card {
            background: rgba(30, 30, 30, 0.8);
            backdrop-filter: blur(8px);
            border: 1px solid #2E2E2E;
        }
        .metric-glow {
            text-shadow: 0 0 15px rgba(255, 138, 0, 0.3);
        }
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-track {
            background: #1A1A1A;
        }
        ::-webkit-scrollbar-thumb {
            background: #2E2E2E;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #3E3E3E;
        }

      `}</style>
      
      <main className="ml-[260px] min-h-screen">

<header className="sticky top-0 z-40 w-full px-6 py-4 bg-background border-b border-outline-variant flex justify-between items-center">
<div className="flex items-center gap-6">
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input className="bg-surface-container-lowest border border-outline-variant rounded-full pl-10 pr-4 py-2 text-body-sm w-80 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="Search trips, vehicles, or drivers..." type="text"/>
</div>
</div>
<div className="flex items-center gap-4">
<button className="bg-primary text-on-primary-fixed-variant px-6 py-2 rounded-full font-title-md text-title-md hover:opacity-90 active:opacity-80 transition-all flex items-center gap-2">
<span className="material-symbols-outlined text-[20px]">add</span>
                    New Trip
                </button>
<button className="border border-outline-variant text-on-surface px-6 py-2 rounded-full font-title-md text-title-md hover:bg-surface-container-highest transition-all">
                    Add Vehicle
                </button>
<div className="flex items-center gap-2 ml-4">
<button className="p-2 text-on-surface-variant hover:text-on-surface transition-all relative">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
</button>
<button className="p-2 text-on-surface-variant hover:text-on-surface transition-all">
<span className="material-symbols-outlined">help_outline</span>
</button>
</div>
<div className="w-10 h-10 rounded-full border border-outline overflow-hidden ml-2">
<img className="w-full h-full object-cover" data-alt="A professional portrait of a senior logistics operations manager with a sharp, modern appearance, set against a blurred high-tech dispatch center background with dark grey and vibrant orange ambient lighting to match the TransitOps brand identity." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe_kAxsznHQH4QW4j4HqvxKTlq4nRn_BIFhqFNF69eRgXe3D_j8t_zmfI3E7AapvJlDPTgY4ge-0tRs4sq8OSYjU9MTq_rxCyM0aOI5T1p9SK3I5l3UwJHVfsIX25hC7PbxmA4SEFZK5OEq2gilzxrH9PzyWHrO4P-TLONtOvjDWxOFbocab4K3W_sxAVRsTP0OMrKvbKPZG2jAWlpYX1huooUuoUVGZz6wleRa69N2keogNpGVujCLw"/>
</div>
</div>
</header>

<div className="p-6 space-y-6">

<div className="flex flex-col gap-1">
<h2 className="font-headline-lg text-headline-lg font-extrabold text-on-surface tracking-tight">Logistics Command</h2>
<p className="text-on-surface-variant font-body-md">Real-time operational overview for <span className="text-primary font-bold">Region A-12</span></p>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">

<div className="glass-card p-4 rounded-xl flex flex-col justify-between">
<div className="flex justify-between items-start">
<span className="text-on-surface-variant font-label-md">Active Vehicles</span>
<span className="material-symbols-outlined text-primary text-[20px]">directions_car</span>
</div>
<div className="mt-4">
<span className="font-display-lg text-display-lg text-on-surface metric-glow">142</span>
<div className="flex items-center gap-1 text-[11px] text-green-500 mt-1">
<span className="material-symbols-outlined text-[14px]">trending_up</span>
<span>+4.2%</span>
</div>
</div>
</div>

<div className="glass-card p-4 rounded-xl flex flex-col justify-between">
<div className="flex justify-between items-start">
<span className="text-on-surface-variant font-label-md">Available</span>
<span className="material-symbols-outlined text-green-400 text-[20px]">check_circle</span>
</div>
<div className="mt-4">
<span className="font-display-lg text-display-lg text-on-surface metric-glow">28</span>
<p className="text-[11px] text-on-surface-variant mt-1">Ready for dispatch</p>
</div>
</div>

<div className="glass-card p-4 rounded-xl flex flex-col justify-between border-l-4 border-l-error">
<div className="flex justify-between items-start">
<span className="text-on-surface-variant font-label-md">Maintenance</span>
<span className="material-symbols-outlined text-error text-[20px]">build</span>
</div>
<div className="mt-4">
<span className="font-display-lg text-display-lg text-on-surface">12</span>
<div className="flex items-center gap-1 text-[11px] text-error mt-1">
<span className="material-symbols-outlined text-[14px]">warning</span>
<span>3 Urgent</span>
</div>
</div>
</div>

<div className="glass-card p-4 rounded-xl flex flex-col justify-between">
<div className="flex justify-between items-start">
<span className="text-on-surface-variant font-label-md">Active Trips</span>
<span className="material-symbols-outlined text-secondary text-[20px]">route</span>
</div>
<div className="mt-4">
<span className="font-display-lg text-display-lg text-on-surface metric-glow">86</span>
<p className="text-[11px] text-on-surface-variant mt-1">On-time: 94%</p>
</div>
</div>

<div className="glass-card p-4 rounded-xl flex flex-col justify-between">
<div className="flex justify-between items-start">
<span className="text-on-surface-variant font-label-md">Pending Trips</span>
<span className="material-symbols-outlined text-on-surface-variant text-[20px]">pending_actions</span>
</div>
<div className="mt-4">
<span className="font-display-lg text-display-lg text-on-surface">34</span>
<p className="text-[11px] text-on-surface-variant mt-1">Next hour: 12</p>
</div>
</div>

<div className="glass-card p-4 rounded-xl flex flex-col justify-between">
<div className="flex justify-between items-start">
<span className="text-on-surface-variant font-label-md">Drivers On Duty</span>
<span className="material-symbols-outlined text-primary text-[20px]">badge</span>
</div>
<div className="mt-4">
<span className="font-display-lg text-display-lg text-on-surface metric-glow">158</span>
<p className="text-[11px] text-on-surface-variant mt-1">2 standby</p>
</div>
</div>

<div className="glass-card p-4 rounded-xl flex flex-col justify-between bg-primary-container/10">
<div className="flex justify-between items-start">
<span className="text-on-surface-variant font-label-md">Utilization</span>
<span className="material-symbols-outlined text-primary text-[20px]">speed</span>
</div>
<div className="mt-4">
<span className="font-display-lg text-display-lg text-primary">82%</span>
<div className="w-full bg-surface-container rounded-full h-1 mt-2">
<div className="bg-primary h-1 rounded-full" style={{ width: "82%" }}></div>
</div>
</div>
</div>
</div>

<div className="grid grid-cols-12 gap-6">

<div className="col-span-12 lg:col-span-8 space-y-4">
<div className="flex justify-between items-end">
<h3 className="font-title-lg text-title-lg text-on-surface">Recent Activity</h3>
<a className="text-primary text-label-md hover:underline" href="#">View All Trips</a>
</div>
<div className="glass-card rounded-xl overflow-hidden">
<table className="w-full text-left">
<thead className="bg-surface-container-highest/30">
<tr>
<th className="px-6 py-4 font-label-md text-on-surface-variant uppercase tracking-wider">Trip ID</th>
<th className="px-6 py-4 font-label-md text-on-surface-variant uppercase tracking-wider">Vehicle</th>
<th className="px-6 py-4 font-label-md text-on-surface-variant uppercase tracking-wider">Driver</th>
<th className="px-6 py-4 font-label-md text-on-surface-variant uppercase tracking-wider">Destination</th>
<th className="px-6 py-4 font-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
<th className="px-6 py-4 font-label-md text-on-surface-variant uppercase tracking-wider">ETA</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr className="hover:bg-surface-container-high/50 transition-colors cursor-pointer group">
<td className="px-6 py-4 text-body-sm font-bold text-primary">#TR-8821</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[18px] text-on-surface-variant">local_shipping</span>
<span className="text-body-sm font-medium">Frt-829 (XL)</span>
</div>
</td>
<td className="px-6 py-4 text-body-sm">Marcus Chen</td>
<td className="px-6 py-4 text-body-sm">Chicago Hub, IL</td>
<td className="px-6 py-4">
<span className="px-3 py-1 bg-secondary-container/20 border border-secondary-container text-on-secondary-container rounded-full text-[11px] font-bold">IN TRANSIT</span>
</td>
<td className="px-6 py-4 text-body-sm font-medium">14:20 PM</td>
</tr>
<tr className="hover:bg-surface-container-high/50 transition-colors cursor-pointer">
<td className="px-6 py-4 text-body-sm font-bold text-primary">#TR-8822</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[18px] text-on-surface-variant">local_shipping</span>
<span className="text-body-sm font-medium">Frt-112 (MD)</span>
</div>
</td>
<td className="px-6 py-4 text-body-sm">Sarah Jenkins</td>
<td className="px-6 py-4 text-body-sm">Detroit Depot, MI</td>
<td className="px-6 py-4">
<span className="px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-500 rounded-full text-[11px] font-bold">COMPLETED</span>
</td>
<td className="px-6 py-4 text-body-sm text-on-surface-variant">—</td>
</tr>
<tr className="hover:bg-surface-container-high/50 transition-colors cursor-pointer">
<td className="px-6 py-4 text-body-sm font-bold text-primary">#TR-8825</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[18px] text-on-surface-variant">local_shipping</span>
<span className="text-body-sm font-medium">Frt-404 (LG)</span>
</div>
</td>
<td className="px-6 py-4 text-body-sm">David Miller</td>
<td className="px-6 py-4 text-body-sm">Nashville SE</td>
<td className="px-6 py-4">
<span className="px-3 py-1 bg-error-container/20 border border-error-container text-error rounded-full text-[11px] font-bold">DELAYED</span>
</td>
<td className="px-6 py-4 text-body-sm font-medium text-error">16:45 PM</td>
</tr>
<tr className="hover:bg-surface-container-high/50 transition-colors cursor-pointer">
<td className="px-6 py-4 text-body-sm font-bold text-primary">#TR-8829</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[18px] text-on-surface-variant">local_shipping</span>
<span className="text-body-sm font-medium">Frt-092 (SM)</span>
</div>
</td>
<td className="px-6 py-4 text-body-sm">Elena Rodriguez</td>
<td className="px-6 py-4 text-body-sm">Milwaukee Hub</td>
<td className="px-6 py-4">
<span className="px-3 py-1 bg-surface-container-highest border border-outline-variant text-on-surface-variant rounded-full text-[11px] font-bold">SCHEDULED</span>
</td>
<td className="px-6 py-4 text-body-sm font-medium">18:00 PM</td>
</tr>
</tbody>
</table>
</div>
</div>

<div className="col-span-12 lg:col-span-4 space-y-6">

<div className="glass-card rounded-xl p-6">
<h3 className="font-title-md text-title-md text-on-surface mb-4">Command Center</h3>
<div className="grid grid-cols-2 gap-3">
<button className="flex flex-col items-center justify-center p-4 bg-primary text-on-primary-fixed-variant rounded-lg gap-2 hover:brightness-110 active:scale-95 transition-all">
<span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
<span className="text-label-md font-bold">Dispatch Now</span>
</button>
<button className="flex flex-col items-center justify-center p-4 border border-outline-variant hover:bg-surface-container-high rounded-lg gap-2 active:scale-95 transition-all">
<span className="material-symbols-outlined text-[28px]">calendar_month</span>
<span className="text-label-md">Schedule</span>
</button>
<button className="flex flex-col items-center justify-center p-4 border border-outline-variant hover:bg-surface-container-high rounded-lg gap-2 active:scale-95 transition-all">
<span className="material-symbols-outlined text-[28px]">handyman</span>
<span className="text-label-md">Maintenance</span>
</button>
<button className="flex flex-col items-center justify-center p-4 border border-outline-variant hover:bg-surface-container-high rounded-lg gap-2 active:scale-95 transition-all">
<span className="material-symbols-outlined text-[28px]">description</span>
<span className="text-label-md">Reports</span>
</button>
</div>
</div>

<div className="glass-card rounded-xl p-6 relative overflow-hidden">
<div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
<h3 className="font-title-md text-title-md text-on-surface mb-6">Fleet Health Distribution</h3>
<div className="flex justify-center items-center h-48 relative">

<div className="relative w-40 h-40">
<svg className="w-full h-full" viewbox="0 0 36 36">
<path className="stroke-surface-container-highest" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke-width="3"></path>
<path className="stroke-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke-dasharray="75, 100" stroke-linecap="round" stroke-width="3"></path>
<path className="stroke-error" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke-dasharray="8, 100" stroke-dashoffset="-75" stroke-linecap="round" stroke-width="3"></path>
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
<span className="text-display-lg font-extrabold text-on-surface leading-tight">182</span>
<span className="text-[10px] text-on-surface-variant font-bold uppercase">Total Units</span>
</div>
</div>
</div>
<div className="mt-6 grid grid-cols-2 gap-4">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-primary"></div>
<span className="text-body-sm text-on-surface-variant">Optimal: 75%</span>
</div>
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-surface-container-highest"></div>
<span className="text-body-sm text-on-surface-variant">Idle: 17%</span>
</div>
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-error"></div>
<span className="text-body-sm text-on-surface-variant">Critical: 8%</span>
</div>
</div>
</div>

<div className="glass-card rounded-xl p-6">
<div className="flex justify-between items-center mb-4">
<h3 className="font-title-md text-title-md text-on-surface">Operations Feed</h3>
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined text-[20px]">filter_list</span>
</button>
</div>
<div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">

<div className="flex gap-4 p-3 rounded-lg hover:bg-surface-container-high transition-colors">
<div className="mt-1 w-2 h-2 rounded-full bg-error shrink-0"></div>
<div className="space-y-1">
<p className="text-body-sm font-bold text-on-surface">Critical Engine Alert</p>
<p className="text-body-sm text-on-surface-variant leading-tight">Vehicle Frt-404 reporting oil pressure failure in Segment-B.</p>
<p className="text-[10px] text-on-surface-variant font-medium">2 mins ago</p>
</div>
</div>

<div className="flex gap-4 p-3 rounded-lg hover:bg-surface-container-high transition-colors border-l border-primary/20">
<div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0"></div>
<div className="space-y-1">
<p className="text-body-sm font-bold text-on-surface">New Trip Assigned</p>
<p className="text-body-sm text-on-surface-variant leading-tight">Driver Marcus Chen confirmed Trip #TR-8821 dispatch.</p>
<p className="text-[10px] text-on-surface-variant font-medium">15 mins ago</p>
</div>
</div>

<div className="flex gap-4 p-3 rounded-lg hover:bg-surface-container-high transition-colors">
<div className="mt-1 w-2 h-2 rounded-full bg-secondary shrink-0"></div>
<div className="space-y-1">
<p className="text-body-sm font-bold text-on-surface">Weather Advisory</p>
<p className="text-body-sm text-on-surface-variant leading-tight">Severe thunderstorm warning for Ohio route corridor.</p>
<p className="text-[10px] text-on-surface-variant font-medium">45 mins ago</p>
</div>
</div>

<div className="flex gap-4 p-3 rounded-lg hover:bg-surface-container-high transition-colors">
<div className="mt-1 w-2 h-2 rounded-full bg-green-400 shrink-0"></div>
<div className="space-y-1">
<p className="text-body-sm font-bold text-on-surface">Maintenance Complete</p>
<p className="text-body-sm text-on-surface-variant leading-tight">Vehicle Frt-211 cleared for active duty after routine check.</p>
<p className="text-[10px] text-on-surface-variant font-medium">1 hour ago</p>
</div>
</div>
</div>
</div>
</div>
</div>

<div className="col-span-12 glass-card rounded-2xl h-[400px] overflow-hidden relative border border-outline-variant">
<div className="absolute top-6 left-6 z-10 bg-surface-container-lowest/90 backdrop-blur-md p-4 rounded-xl border border-outline-variant shadow-2xl">
<h4 className="font-title-md text-title-md text-on-surface mb-2">Fleet Geospatial View</h4>
<div className="flex flex-col gap-2">
<div className="flex items-center gap-3">
<span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span>
<span className="text-body-sm font-medium">142 In Transit</span>
</div>
<div className="flex items-center gap-3">
<span className="w-3 h-3 rounded-full bg-on-surface-variant"></span>
<span className="text-body-sm font-medium">28 Idle at Hubs</span>
</div>
</div>
</div>
<div className="w-full h-full bg-cover bg-center grayscale opacity-60" data-alt="A highly detailed satellite navigation map view showing a complex logistics network across a dark, stylized city landscape. Minimalist digital glowing orange lines connect various shipping hubs and transit routes, with tiny pulsing dots representing active freight vehicles in real-time. The overall mood is high-tech, precise, and sophisticated." style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDP7u89OZ8Wu98xNuimYd31zUYU0W6UaIF80j_J0rBT5aY1V824RS2ScBoH9bqBPgsM6ed1M4xq7xPw3ATqWRI1jZX_5ZJBqJGSeRqgp_IiaXppXS5t2jH6JAS6Uaaujex7EhEILor-ShM6lG-9RmSkpcmwbvetI6Yg1PL-DvcEjhLUzSAFt3t9TOTHAzI9TF0zpdVnSnEq3fYM5vrca47Jd2qlc9VbJ1I92ADF63g70X_YudoUtFKOBA')" }}></div>

<div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
<button className="w-10 h-10 bg-surface-container-lowest rounded-lg border border-outline-variant flex items-center justify-center text-on-surface hover:bg-primary hover:text-on-primary transition-all">
<span className="material-symbols-outlined">add</span>
</button>
<button className="w-10 h-10 bg-surface-container-lowest rounded-lg border border-outline-variant flex items-center justify-center text-on-surface hover:bg-primary hover:text-on-primary transition-all">
<span className="material-symbols-outlined">remove</span>
</button>
<button className="w-10 h-10 bg-surface-container-lowest rounded-lg border border-outline-variant flex items-center justify-center text-on-surface hover:bg-primary hover:text-on-primary transition-all">
<span className="material-symbols-outlined">my_location</span>
</button>
</div>
</div>
</div>
</main>
    </>
  );
};

export default Dashboard;
