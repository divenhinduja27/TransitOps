import React from 'react';

const VehicleRegistry = () => {
  return (
    <>
      {/* Page Specific Styles */}
      <style>{`
        body {
            background-color: #111111;
            color: #f3dfd1;
            font-family: 'Inter', sans-serif;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        /* Custom scrollbar for data tables */
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        ::-webkit-scrollbar-track {
            background: #1b110a;
        }
        ::-webkit-scrollbar-thumb {
            background: #3f3229;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #564334;
        }
        .glass-panel {
            background: rgba(30, 30, 30, 0.7);
            backdrop-filter: blur(12px);
            border: 1px solid #2e2e2e;
        }

      `}</style>
      
      <main className="ml-[260px] min-h-screen flex flex-col">

<header className="flex justify-between items-center w-full px-margin-desktop py-md sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-outline-variant">
<div className="flex items-center gap-4 flex-1">
<div className="relative w-full max-w-md group">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
<input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-2 pl-10 pr-4 font-body-md text-on-surface focus:outline-none focus:border-primary transition-all" placeholder="Search vehicle registry..." type="text"/>
</div>
</div>
<div className="flex items-center gap-4">
<button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-on-surface font-title-md hover:bg-surface-container-highest transition-all active:opacity-80">
<span className="material-symbols-outlined">add</span>
                    Add Vehicle
                </button>
<button className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-title-md font-bold hover:opacity-90 transition-all active:opacity-80">
                    New Trip
                </button>
<div className="flex items-center gap-1 border-l border-outline-variant ml-2 pl-4">
<button className="p-2 text-on-surface-variant hover:bg-surface-container-highest rounded-full transition-all">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="p-2 text-on-surface-variant hover:bg-surface-container-highest rounded-full transition-all">
<span className="material-symbols-outlined">help_outline</span>
</button>
<div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant ml-2">
<img className="w-full h-full object-cover" data-alt="Close-up professional portrait of a senior logistics operations manager in a dark grey suit, set against a blurred background of a high-tech control room with orange data monitors. The lighting is dramatic and warm, reflecting the TransitOps brand colors and a focus on high-stakes transport management." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC4-Jpiennot8XXziFqN6KusOw0oY1J9pr0gPV6VziKugf4cI-C5_conIVo7jSrS7j-L5VStqhX5XxiZNJI2b8VwLDekVPbkfZ85wkbIqgQnyfpNoIeD61YmTwu5wHQzcGVVw2-vvKpoNIsuMNhswd-NH0ZkPBvoVzhYH2RzwvcIOeaEp1dOgXBpwplFuXdXdDFkvQZ7uN0tgUZxOSm6_8SboxFt6W9tYL_dp6AN47BHlPKQC-EPhM3A"/>
</div>
</div>
</div>
</header>

<div className="p-margin-desktop flex-1 flex flex-col gap-gutter">

<div className="flex justify-between items-end mb-2">
<div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Vehicle Registry</h2>
<p className="text-on-surface-variant font-body-md">Managing 124 active fleet assets</p>
</div>
<div className="flex gap-4">
<div className="flex flex-col items-end">
<span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Active Status</span>
<div className="flex items-baseline gap-2">
<span className="text-headline-md font-headline-md text-primary">88%</span>
<span className="text-tertiary font-body-sm">+2.4%</span>
</div>
</div>
<div className="w-px h-10 bg-outline-variant mx-2"></div>
<div className="flex flex-col items-end">
<span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">In Shop</span>
<div className="flex items-baseline gap-2">
<span className="text-headline-md font-headline-md text-error">4</span>
<span className="text-on-surface-variant font-body-sm">Vehicles</span>
</div>
</div>
</div>
</div>

<div className="flex items-center justify-between gap-4 glass-panel p-4 rounded-xl">
<div className="flex items-center gap-3">
<div className="relative group">
<select className="appearance-none bg-surface-container border border-outline-variant rounded-lg py-2 pl-4 pr-10 font-body-md text-on-surface focus:outline-none focus:border-primary transition-all cursor-pointer min-w-[180px]">
<option>Filter by Status</option>
<option>In Use</option>
<option>Available</option>
<option>Maintenance</option>
<option>In Shop</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
</div>
<div className="relative group">
<select className="appearance-none bg-surface-container border border-outline-variant rounded-lg py-2 pl-4 pr-10 font-body-md text-on-surface focus:outline-none focus:border-primary transition-all cursor-pointer min-w-[150px]">
<option>Model Type</option>
<option>Heavy Duty</option>
<option>Light Van</option>
<option>Cold Chain</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">filter_list</span>
</div>
</div>
<div className="flex items-center gap-2">
<button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg border border-outline-variant transition-all">
<span className="material-symbols-outlined">download</span>
</button>
<button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg border border-outline-variant transition-all">
<span className="material-symbols-outlined">print</span>
</button>
</div>
</div>

<div className="flex-1 bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden flex flex-col shadow-2xl">
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead className="bg-surface-container-low sticky top-0 z-10">
<tr>
<th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Vehicle ID</th>
<th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Model</th>
<th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Plate</th>
<th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Status</th>
<th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Driver</th>
<th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Fuel Level</th>
<th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Odometer</th>
<th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/30">

<tr className="hover:bg-surface-container transition-colors group">
<td className="px-6 py-4 font-body-md text-primary font-bold">TRK-2904</td>
<td className="px-6 py-4 font-body-md text-on-surface">Freightliner Cascadia 126</td>
<td className="px-6 py-4 font-body-md text-on-surface-variant">TX-492-BFG</td>
<td className="px-6 py-4">
<span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-secondary/10 border border-secondary text-secondary text-label-sm font-bold uppercase">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                                        In Use
                                    </span>
</td>
<td className="px-6 py-4 flex items-center gap-2">
<div className="w-6 h-6 rounded-full bg-surface-container-highest border border-outline-variant"></div>
<span className="font-body-md text-on-surface">Marcus Thorne</span>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden min-w-[60px]">
<div className="h-full bg-primary" style={{ width: "78%" }}></div>
</div>
<span className="font-label-md text-on-surface">78%</span>
</div>
</td>
<td className="px-6 py-4 font-body-md text-on-surface-variant">142,831 mi</td>
<td className="px-6 py-4 text-right">
<button className="p-1 text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>

<tr className="hover:bg-surface-container transition-colors group">
<td className="px-6 py-4 font-body-md text-primary font-bold">TRK-1102</td>
<td className="px-6 py-4 font-body-md text-on-surface">Volvo VNL 860</td>
<td className="px-6 py-4 font-body-md text-on-surface-variant">CA-811-QWZ</td>
<td className="px-6 py-4">
<span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-tertiary/10 border border-tertiary text-tertiary text-label-sm font-bold uppercase">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                                        Available
                                    </span>
</td>
<td className="px-6 py-4">
<span className="font-body-md text-on-surface-variant italic">Unassigned</span>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden min-w-[60px]">
<div className="h-full bg-primary" style={{ width: "42%" }}></div>
</div>
<span className="font-label-md text-on-surface">42%</span>
</div>
</td>
<td className="px-6 py-4 font-body-md text-on-surface-variant">89,204 mi</td>
<td className="px-6 py-4 text-right">
<button className="p-1 text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>

<tr className="hover:bg-surface-container transition-colors group">
<td className="px-6 py-4 font-body-md text-primary font-bold">VAN-084</td>
<td className="px-6 py-4 font-body-md text-on-surface">Mercedes Sprinter 3500</td>
<td className="px-6 py-4 font-body-md text-on-surface-variant">FL-229-JKP</td>
<td className="px-6 py-4">
<span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-surface-variant text-on-surface-variant border border-outline-variant text-label-sm font-bold uppercase">
<span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant"></span>
                                        Maintenance
                                    </span>
</td>
<td className="px-6 py-4 flex items-center gap-2">
<div className="w-6 h-6 rounded-full bg-surface-container-highest border border-outline-variant"></div>
<span className="font-body-md text-on-surface">S. Rodriguez</span>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden min-w-[60px]">
<div className="h-full bg-primary" style={{ width: "95%" }}></div>
</div>
<span className="font-label-md text-on-surface">95%</span>
</div>
</td>
<td className="px-6 py-4 font-body-md text-on-surface-variant">12,450 mi</td>
<td className="px-6 py-4 text-right">
<button className="p-1 text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>

<tr className="hover:bg-surface-container transition-colors group">
<td className="px-6 py-4 font-body-md text-primary font-bold">TRK-4409</td>
<td className="px-6 py-4 font-body-md text-on-surface">Peterbilt 579 UltraLoft</td>
<td className="px-6 py-4 font-body-md text-on-surface-variant">NY-005-TRX</td>
<td className="px-6 py-4">
<span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-error/10 border border-error text-error text-label-sm font-bold uppercase">
<span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                                        In Shop
                                    </span>
</td>
<td className="px-6 py-4">
<span className="font-body-md text-on-surface-variant italic">N/A</span>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden min-w-[60px]">
<div className="h-full bg-error" style={{ width: "12%" }}></div>
</div>
<span className="font-label-md text-error">12%</span>
</div>
</td>
<td className="px-6 py-4 font-body-md text-on-surface-variant">210,033 mi</td>
<td className="px-6 py-4 text-right">
<button className="p-1 text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>

<tr className="hover:bg-surface-container transition-colors group">
<td className="px-6 py-4 font-body-md text-primary font-bold">TRK-2905</td>
<td className="px-6 py-4 font-body-md text-on-surface">Freightliner Cascadia 126</td>
<td className="px-6 py-4 font-body-md text-on-surface-variant">TX-493-BFG</td>
<td className="px-6 py-4">
<span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-secondary/10 border border-secondary text-secondary text-label-sm font-bold uppercase">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                                        In Use
                                    </span>
</td>
<td className="px-6 py-4 flex items-center gap-2">
<div className="w-6 h-6 rounded-full bg-surface-container-highest border border-outline-variant"></div>
<span className="font-body-md text-on-surface">J. Henderson</span>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden min-w-[60px]">
<div className="h-full bg-primary" style={{ width: "65%" }}></div>
</div>
<span className="font-label-md text-on-surface">65%</span>
</div>
</td>
<td className="px-6 py-4 font-body-md text-on-surface-variant">156,220 mi</td>
<td className="px-6 py-4 text-right">
<button className="p-1 text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>

<tr className="hover:bg-surface-container transition-colors group">
<td className="px-6 py-4 font-body-md text-primary font-bold">TRK-3001</td>
<td className="px-6 py-4 font-body-md text-on-surface">Kenworth T680</td>
<td className="px-6 py-4 font-body-md text-on-surface-variant">WA-992-LLP</td>
<td className="px-6 py-4">
<span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-tertiary/10 border border-tertiary text-tertiary text-label-sm font-bold uppercase">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                                        Available
                                    </span>
</td>
<td className="px-6 py-4">
<span className="font-body-md text-on-surface-variant italic">Unassigned</span>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden min-w-[60px]">
<div className="h-full bg-primary" style={{ width: "82%" }}></div>
</div>
<span className="font-label-md text-on-surface">82%</span>
</div>
</td>
<td className="px-6 py-4 font-body-md text-on-surface-variant">45,391 mi</td>
<td className="px-6 py-4 text-right">
<button className="p-1 text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>

<div className="mt-auto bg-surface-container-low px-6 py-4 flex items-center justify-between border-t border-outline-variant">
<span className="text-body-sm text-on-surface-variant">Showing 1 to 6 of 124 entries</span>
<div className="flex gap-2">
<button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container-high transition-all text-on-surface-variant">Previous</button>
<button className="px-3 py-1 bg-primary text-on-primary font-bold rounded">1</button>
<button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container-high transition-all text-on-surface-variant">2</button>
<button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container-high transition-all text-on-surface-variant">3</button>
<span className="px-2 py-1 text-on-surface-variant">...</span>
<button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container-high transition-all text-on-surface-variant">Next</button>
</div>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mt-4">
<div className="glass-panel p-6 rounded-xl flex flex-col gap-2">
<div className="flex justify-between items-start">
<span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">local_gas_station</span>
<span className="text-tertiary font-label-md flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">trending_down</span> -4.2%
                        </span>
</div>
<span className="font-label-md text-on-surface-variant uppercase mt-2">Avg Fuel Efficiency</span>
<span className="font-headline-md text-on-surface">6.8 MPG</span>
</div>
<div className="glass-panel p-6 rounded-xl flex flex-col gap-2">
<div className="flex justify-between items-start">
<span className="material-symbols-outlined text-secondary bg-secondary/10 p-2 rounded-lg">warning</span>
<span className="text-error font-label-md flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">notification_important</span> Critical
                        </span>
</div>
<span className="font-label-md text-on-surface-variant uppercase mt-2">Maintenance Alerts</span>
<span className="font-headline-md text-on-surface">8 Pending</span>
</div>
<div className="glass-panel p-6 rounded-xl flex flex-col gap-2 relative overflow-hidden">
<div className="relative z-10">
<div className="flex justify-between items-start">
<span className="material-symbols-outlined text-tertiary bg-tertiary/10 p-2 rounded-lg">speed</span>
<span className="text-on-surface-variant font-label-md">Last 24h</span>
</div>
<span className="font-label-md text-on-surface-variant uppercase mt-2">Total Distance</span>
<span className="font-headline-md text-on-surface">14,204.5 mi</span>
</div>

<div className="absolute bottom-0 left-0 w-full h-12 opacity-30 bg-gradient-to-t from-tertiary/20 to-transparent"></div>
</div>
</div>
</div>

<footer className="px-margin-desktop py-4 flex justify-between items-center text-label-md text-on-surface-variant/40 border-t border-outline-variant/10">
<span>© 2024 TransitOps Logistics Systems v2.4.1</span>
<span className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-secondary"></span> System Online
            </span>
</footer>
</main>
    </>
  );
};

export default VehicleRegistry;
