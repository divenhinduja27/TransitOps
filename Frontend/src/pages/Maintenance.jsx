import React from 'react';

const Maintenance = () => {
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
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #1b110a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #3f3229;
            border-radius: 10px;
        }
        .bento-grid {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            gap: 16px;
        }
        .glass-card {
            background: rgba(30, 30, 30, 0.6);
            backdrop-filter: blur(12px);
            border: 1px solid #2e2e2e;
        }

      `}</style>
      
      <main className="flex-1 ml-[260px] min-h-screen bg-background">

<header className="docked full-width top-0 sticky z-40 bg-background flex justify-between items-center w-full px-margin-desktop py-md border-b border-outline-variant">
<div className="flex items-center gap-6">
<div className="relative group">
<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant">
<span className="material-symbols-outlined text-md">search</span>
</span>
<input className="bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-sm focus:border-primary focus:ring-0 w-64 transition-all" placeholder="Search fleet or tickets..." type="text"/>
</div>
</div>
<div className="flex items-center gap-4">
<button className="px-4 py-2 rounded-lg border border-outline-variant text-sm font-medium hover:bg-surface-container-high transition-all active:opacity-80">
                    Add Vehicle
                </button>
<button className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-all active:opacity-80">
                    New Trip
                </button>
<div className="flex items-center gap-2 border-l border-outline-variant pl-4 ml-2">
<span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors" data-icon="notifications">notifications</span>
<span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors" data-icon="help_outline">help_outline</span>
<div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden ml-2 border border-outline-variant">
<img className="w-full h-full object-cover" data-alt="A professional headshot of a logistics fleet manager, mid-40s, with a focused expression, set against a blurred high-tech logistics control room background with multiple screens. The lighting is dramatic and cool-toned, reflecting a modern industrial ERP environment." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJLq0hHsgfs4eB4nM4CrDT37G6NTpJoW2sfU097xh7fsHjTQxtCgm8AGv0PTRX0sqk4aYPNENvlpFRGfn1JoERN-_HrD_ok-N-jq1kdCEEaDq7F0fFdXQ0H6Tf2G6iA-CrfzBNGJCsIs49lOnJHjpN5s8ycHW425Q2rgFetmroYt_0TASRs99VX49jqPI9BfYl873jykMh90AyDx4l1NlV0bdCcnUMh7BX16dHmXI87Egqn90OZ2OrxQ"/>
</div>
</div>
</div>
</header>

<div className="p-margin-desktop max-w-7xl mx-auto">

<div className="mb-8">
<h2 className="font-headline-lg text-headline-lg text-on-surface">Maintenance Command</h2>
<p className="text-on-surface-variant font-body-md text-body-md">Real-time oversight of fleet health and service logs.</p>
</div>

<div className="bento-grid mb-gutter">

<div className="col-span-12 md:col-span-4 glass-card rounded-xl p-6 flex flex-col justify-between">
<div>
<span className="text-on-surface-variant text-xs uppercase tracking-widest font-bold">Monthly Spend</span>
<div className="flex items-end gap-3 mt-2">
<span className="font-display-lg text-display-lg text-primary">$42,850</span>
<span className="text-green-400 text-sm font-bold flex items-center gap-1 mb-2">
<span className="material-symbols-outlined text-xs">trending_down</span> 4.2%
                            </span>
</div>
</div>
<div className="mt-4 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-primary w-2/3"></div>
</div>
</div>

<div className="col-span-12 md:col-span-4 glass-card rounded-xl p-6 border-l-4 border-l-secondary">
<div className="flex justify-between items-start">
<div>
<span className="text-on-surface-variant text-xs uppercase tracking-widest font-bold">Currently In Shop</span>
<div className="font-display-lg text-display-lg text-on-surface mt-2">12</div>
</div>
<div className="bg-secondary/10 p-3 rounded-lg">
<span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>build</span>
</div>
</div>
<p className="text-on-surface-variant text-sm mt-4">3 vehicles are critical priority.</p>
</div>

<div className="col-span-12 md:col-span-4 glass-card rounded-xl p-6">
<div className="flex justify-between items-start">
<div>
<span className="text-on-surface-variant text-xs uppercase tracking-widest font-bold">Scheduled (Next 7d)</span>
<div className="font-display-lg text-display-lg text-on-surface mt-2">08</div>
</div>
<div className="bg-tertiary/10 p-3 rounded-lg">
<span className="material-symbols-outlined text-tertiary">calendar_today</span>
</div>
</div>
<p className="text-on-surface-variant text-sm mt-4">Preventative maintenance scheduled.</p>
</div>
</div>

<div className="bento-grid">

<section className="col-span-12 lg:col-span-4 glass-card rounded-xl p-6">
<div className="flex items-center gap-3 mb-6">
<span className="material-symbols-outlined text-primary">add_task</span>
<h3 className="font-title-lg text-title-lg text-on-surface">Service Request</h3>
</div>
<form className="space-y-4" onsubmit="event.preventDefault(); alert('Request submitted to dispatch.');">
<div>
<label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wide">Select Vehicle</label>
<select className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface p-2.5 focus:border-primary focus:ring-0 transition-all text-sm">
<option>VOL-2940 (Heavy Haul)</option>
<option>FRE-1122 (Express Box)</option>
<option>KEN-0043 (Long Distance)</option>
<option>PETER-88 (Refuse Truck)</option>
</select>
</div>
<div className="grid grid-cols-2 gap-4">
<div>
<label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wide">Issue Type</label>
<select className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface p-2.5 focus:border-primary focus:ring-0 transition-all text-sm">
<option>Engine</option>
<option>Brakes</option>
<option>Tires</option>
<option>Electrical</option>
<option>Scheduled</option>
</select>
</div>
<div>
<label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wide">Priority</label>
<select className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface p-2.5 focus:border-primary focus:ring-0 transition-all text-sm">
<option>Low</option>
<option>Normal</option>
<option>Critical</option>
</select>
</div>
</div>
<div>
<label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wide">Requested Date</label>
<input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface p-2.5 focus:border-primary focus:ring-0 transition-all text-sm" type="date"/>
</div>
<div>
<label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wide">Issue Details</label>
<textarea className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface p-2.5 focus:border-primary focus:ring-0 transition-all text-sm custom-scrollbar" placeholder="Describe symptoms..." rows="3"></textarea>
</div>
<button className="w-full bg-primary-container text-on-primary-container py-3 rounded-lg font-bold hover:scale-[1.02] active:scale-[0.98] transition-all mt-2" type="submit">
                            Submit Service Request
                        </button>
</form>

<div className="mt-8 p-4 bg-error-container/20 border border-error/30 rounded-lg">
<div className="flex items-center gap-2 text-error mb-2">
<span className="material-symbols-outlined text-sm">error</span>
<span className="text-xs font-bold uppercase tracking-wider">Critical Alert</span>
</div>
<p className="text-on-error-container text-xs leading-relaxed">
                            Vehicle **FRE-1122** reported critical engine vibration 10m ago. Immediate shop dispatch required.
                        </p>
</div>
</section>

<section className="col-span-12 lg:col-span-8 glass-card rounded-xl overflow-hidden flex flex-col">
<div className="p-6 border-b border-outline-variant flex justify-between items-center">
<h3 className="font-title-lg text-title-lg text-on-surface">Service Log &amp; Fleet Status</h3>
<div className="flex gap-2">
<button className="p-2 hover:bg-surface-container-high rounded-md transition-colors">
<span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
</button>
<button className="p-2 hover:bg-surface-container-high rounded-md transition-colors">
<span className="material-symbols-outlined text-on-surface-variant">download</span>
</button>
</div>
</div>
<div className="overflow-x-auto flex-1">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low/50">
<th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant">Vehicle</th>
<th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant">Service Date</th>
<th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant">Type</th>
<th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant text-right">Cost</th>
<th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant">Status</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">

<tr className="hover:bg-surface-container-high/40 transition-colors group bg-secondary/5">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
<div>
<div className="font-bold text-on-surface text-sm">VOL-2940</div>
<div className="text-[11px] text-on-surface-variant">Volvo FH16</div>
</div>
</div>
</td>
<td className="px-6 py-4 text-sm text-on-surface-variant">Oct 24, 2023</td>
<td className="px-6 py-4">
<span className="text-xs px-2 py-1 bg-surface-container-highest border border-outline-variant rounded">Transmission Repair</span>
</td>
<td className="px-6 py-4 text-sm text-on-surface font-mono text-right">$3,420.00</td>
<td className="px-6 py-4">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-secondary/10 text-secondary border border-secondary/20">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                                            In Progress
                                        </span>
</td>
</tr>

<tr className="hover:bg-surface-container-high/40 transition-colors group">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-2 h-2 rounded-full bg-outline-variant"></div>
<div>
<div className="font-bold text-on-surface text-sm">KEN-0043</div>
<div className="text-[11px] text-on-surface-variant">Kenworth T680</div>
</div>
</div>
</td>
<td className="px-6 py-4 text-sm text-on-surface-variant">Oct 28, 2023</td>
<td className="px-6 py-4">
<span className="text-xs px-2 py-1 bg-surface-container-highest border border-outline-variant rounded">Brake Pad Replacement</span>
</td>
<td className="px-6 py-4 text-sm text-on-surface font-mono text-right">$850.00</td>
<td className="px-6 py-4">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-surface-container-highest text-on-surface-variant border border-outline-variant">
<span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant"></span>
                                            Scheduled
                                        </span>
</td>
</tr>

<tr className="hover:bg-surface-container-high/40 transition-colors group">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-2 h-2 rounded-full bg-outline-variant"></div>
<div>
<div className="font-bold text-on-surface text-sm">PETER-88</div>
<div className="text-[11px] text-on-surface-variant">Peterbilt 579</div>
</div>
</div>
</td>
<td className="px-6 py-4 text-sm text-on-surface-variant">Oct 20, 2023</td>
<td className="px-6 py-4">
<span className="text-xs px-2 py-1 bg-surface-container-highest border border-outline-variant rounded">Full Inspection</span>
</td>
<td className="px-6 py-4 text-sm text-on-surface font-mono text-right">$1,200.00</td>
<td className="px-6 py-4">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-green-500/10 text-green-400 border border-green-500/20">
<span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                            Completed
                                        </span>
</td>
</tr>

<tr className="hover:bg-surface-container-high/40 transition-colors group bg-secondary/5">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
<div>
<div className="font-bold text-on-surface text-sm">FRE-1122</div>
<div className="text-[11px] text-on-surface-variant">Freightliner Cascadia</div>
</div>
</div>
</td>
<td className="px-6 py-4 text-sm text-on-surface-variant">Oct 24, 2023</td>
<td className="px-6 py-4">
<span className="text-xs px-2 py-1 bg-surface-container-highest border border-outline-variant rounded">Oil Leak Fix</span>
</td>
<td className="px-6 py-4 text-sm text-on-surface font-mono text-right">$450.00</td>
<td className="px-6 py-4">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-secondary/10 text-secondary border border-secondary/20">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                                            In Shop
                                        </span>
</td>
</tr>

<tr className="hover:bg-surface-container-high/40 transition-colors group">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-2 h-2 rounded-full bg-outline-variant"></div>
<div>
<div className="font-bold text-on-surface text-sm">VOL-2938</div>
<div className="text-[11px] text-on-surface-variant">Volvo FH12</div>
</div>
</div>
</td>
<td className="px-6 py-4 text-sm text-on-surface-variant">Oct 18, 2023</td>
<td className="px-6 py-4">
<span className="text-xs px-2 py-1 bg-surface-container-highest border border-outline-variant rounded">Tire Rotation</span>
</td>
<td className="px-6 py-4 text-sm text-on-surface font-mono text-right">$220.00</td>
<td className="px-6 py-4">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-green-500/10 text-green-400 border border-green-500/20">
<span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                            Completed
                                        </span>
</td>
</tr>
</tbody>
</table>
</div>
<div className="p-4 bg-surface-container-low border-t border-outline-variant flex items-center justify-between">
<span className="text-xs text-on-surface-variant">Showing 5 of 124 service records</span>
<div className="flex gap-1">
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
<button className="w-8 h-8 flex items-center justify-center rounded bg-primary-container text-on-primary-container font-bold text-xs">1</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high text-xs">2</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high text-xs">3</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
</div>
</div>
</section>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-gutter">
<div className="glass-card rounded-xl p-4 flex items-center gap-4">
<div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
<span className="material-symbols-outlined text-primary">speed</span>
</div>
<div>
<div className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">Fleet Availability</div>
<div className="text-xl font-bold text-on-surface">88.4%</div>
</div>
</div>
<div className="glass-card rounded-xl p-4 flex items-center gap-4">
<div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
<span className="material-symbols-outlined text-secondary">verified</span>
</div>
<div>
<div className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">Safety Compliance</div>
<div className="text-xl font-bold text-on-surface">99.1%</div>
</div>
</div>
<div className="glass-card rounded-xl p-4 flex items-center gap-4">
<div className="w-12 h-12 bg-tertiary/20 rounded-full flex items-center justify-center">
<span className="material-symbols-outlined text-tertiary">history</span>
</div>
<div>
<div className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">Avg Shop Time</div>
<div className="text-xl font-bold text-on-surface">1.4 Days</div>
</div>
</div>
</div>
</div>
</main>
    </>
  );
};

export default Maintenance;
