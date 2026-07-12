import React from 'react';

const TripManagement = () => {
  return (
    <>
      {/* Page Specific Styles */}
      <style>{`
        body {
            font-family: 'Inter', sans-serif;
            background-color: #111111;
            color: #f3dfd1;
            overflow-x: hidden;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #1a1a1a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #2e2e2e;
            border-radius: 10px;
        }
        .trip-card-gradient {
            background: linear-gradient(135deg, rgba(30, 30, 30, 1) 0%, rgba(26, 26, 26, 1) 100%);
        }
        .status-pill {
            backdrop-filter: blur(4px);
        }

      `}</style>
      
      <main className="flex-1 ml-[260px] min-h-screen flex flex-col">

<header className="sticky top-0 z-40 w-full flex justify-between items-center px-6 py-4 bg-background/80 backdrop-blur-md border-b border-outline-variant">
<div className="flex items-center gap-6">
<h2 className="font-title-lg text-title-lg text-primary">Dispatch Board</h2>
<div className="relative w-72">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input className="w-full bg-surface-container-lowest border border-outline-variant rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="Search trips, drivers, or vehicles..." type="text"/>
</div>
</div>
<div className="flex items-center gap-4">
<button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-all">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-all">
<span className="material-symbols-outlined">help_outline</span>
</button>
<div className="h-8 w-[1px] bg-outline-variant mx-2"></div>
<button className="bg-primary text-on-primary px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all">
<span className="material-symbols-outlined text-[20px]">add</span>
<span>New Trip</span>
</button>
</div>
</header>

<div className="p-6 flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">

<section className="lg:w-1/3 xl:w-1/4 flex flex-col gap-6">
<div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 shadow-xl">
<h3 className="font-title-md text-title-md text-on-surface mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-primary">edit_document</span>
                        Trip Information
                    </h3>
<form className="space-y-5">
<div className="space-y-1.5">
<label className="text-xs font-semibold text-on-surface-variant uppercase">Origin</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">location_on</span>
<input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-9 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none" type="text" defaultValue="San Francisco Terminal A"/>
</div>
</div>
<div className="space-y-1.5">
<label className="text-xs font-semibold text-on-surface-variant uppercase">Destination</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">flag</span>
<input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-9 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="Enter destination..." type="text"/>
</div>
</div>
<div className="grid grid-cols-2 gap-4">
<div className="space-y-1.5">
<label className="text-xs font-semibold text-on-surface-variant uppercase">Vehicle</label>
<select className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none appearance-none">
<option>TRK-9021 (Volvo FH)</option>
<option>TRK-4432 (Freightliner)</option>
<option>VAN-1102 (Mercedes Sprinter)</option>
</select>
</div>
<div className="space-y-1.5">
<label className="text-xs font-semibold text-on-surface-variant uppercase">Driver</label>
<select className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none appearance-none">
<option>Marcus Chen</option>
<option>Sarah Johnson</option>
<option>David Miller</option>
</select>
</div>
</div>
<div className="space-y-1.5">
<label className="text-xs font-semibold text-on-surface-variant uppercase">Schedule</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">calendar_today</span>
<input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-9 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none text-on-surface" type="datetime-local"/>
</div>
</div>
<div className="pt-4 flex gap-3">
<button className="flex-1 px-4 py-3 border border-outline-variant rounded-lg font-semibold text-sm hover:bg-surface-container-high transition-all" type="button">Save Draft</button>
<button className="flex-1 px-4 py-3 bg-primary-container text-on-primary-container rounded-lg font-bold text-sm shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" type="submit">Dispatch Trip</button>
</div>
</form>
</div>

<div className="bg-gradient-to-br from-secondary-container/20 to-transparent border border-secondary-container/30 rounded-xl p-5">
<h4 className="text-xs font-bold text-secondary uppercase mb-3 flex items-center justify-between">
                        Efficiency Optimizer
                        <span className="material-symbols-outlined text-sm">bolt</span>
</h4>
<p className="text-sm text-on-surface-variant leading-relaxed mb-4">Route optimization suggests 12% fuel savings by rerouting via I-80 due to current weather patterns.</p>
<div className="flex items-center gap-2">
<div className="h-2 flex-1 bg-surface-container rounded-full overflow-hidden">
<div className="h-full bg-secondary w-3/4"></div>
</div>
<span className="text-xs font-bold text-secondary">75% Score</span>
</div>
</div>
</section>

<section className="flex-1 flex flex-col gap-4 overflow-hidden">
<div className="flex items-center justify-between">
<div className="flex gap-2">
<button className="px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface text-sm font-semibold border border-outline-variant">All Trips (24)</button>
<button className="px-4 py-1.5 rounded-full text-on-surface-variant text-sm font-medium hover:bg-surface-container transition-all">Dispatched (12)</button>
<button className="px-4 py-1.5 rounded-full text-on-surface-variant text-sm font-medium hover:bg-surface-container transition-all">Delayed (2)</button>
</div>
<div className="flex items-center gap-2 text-on-surface-variant">
<span className="text-xs font-medium">Auto-refresh in 45s</span>
<span className="material-symbols-outlined text-sm animate-spin">sync</span>
</div>
</div>
<div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-4 overflow-y-auto custom-scrollbar pr-2">

<div className="trip-card-gradient border border-outline-variant rounded-xl p-5 flex flex-col gap-4 group hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden">
<div className="absolute top-0 right-0 p-3">
<span className="status-pill px-3 py-1 bg-secondary-container/40 text-secondary text-[10px] font-bold rounded-full border border-secondary/30 uppercase tracking-tighter">Dispatched</span>
</div>
<div className="flex gap-4">
<div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
</div>
<div>
<h4 className="font-title-md text-on-surface">#TRP-7729-OP</h4>
<p className="text-xs text-on-surface-variant">Volvo VNL 860 • Marcus Chen</p>
</div>
</div>
<div className="grid grid-cols-2 gap-6 relative">
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-[1px] bg-outline-variant"></div>
<div className="space-y-1">
<p className="text-[10px] uppercase font-bold text-on-surface-variant">Origin</p>
<p className="text-sm font-semibold">Port of Seattle, WA</p>
</div>
<div className="space-y-1 text-right">
<p className="text-[10px] uppercase font-bold text-on-surface-variant">Destination</p>
<p className="text-sm font-semibold">Denver Depot, CO</p>
</div>
</div>

<div className="space-y-2 pt-2">
<div className="flex justify-between items-end">
<span className="text-[10px] font-bold text-on-surface-variant uppercase">Live Status: En Route</span>
<span className="text-xs font-bold text-primary">640 / 1,320 mi</span>
</div>
<div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
<div className="h-full bg-primary w-[48%] rounded-full shadow-[0_0_8px_rgba(255,183,127,0.4)]"></div>
</div>
<div className="flex justify-between text-[10px] font-medium text-on-surface-variant/60">
<span>4:00 AM Departure</span>
<span>ETA: Tomorrow 9:30 AM</span>
</div>
</div>
</div>

<div className="bg-surface-container-lowest/50 border border-dashed border-outline-variant rounded-xl p-5 flex flex-col gap-4 opacity-75 hover:opacity-100 transition-all cursor-pointer">
<div className="absolute top-0 right-0 p-3">
<span className="status-pill px-3 py-1 bg-surface-variant text-on-surface-variant text-[10px] font-bold rounded-full border border-outline-variant uppercase tracking-tighter">Draft</span>
</div>
<div className="flex gap-4">
<div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
<span className="material-symbols-outlined">pending_actions</span>
</div>
<div>
<h4 className="font-title-md text-on-surface">#TRP-8801-OP</h4>
<p className="text-xs text-on-surface-variant">Awaiting vehicle &amp; driver assignment</p>
</div>
</div>
<div className="grid grid-cols-2 gap-6 relative">
<div className="space-y-1">
<p className="text-[10px] uppercase font-bold text-on-surface-variant">Origin</p>
<p className="text-sm font-semibold">Austin Hub, TX</p>
</div>
<div className="space-y-1 text-right">
<p className="text-[10px] uppercase font-bold text-on-surface-variant">Destination</p>
<p className="text-sm font-semibold">Phoenix Warehouse, AZ</p>
</div>
</div>
<div className="mt-2 flex gap-2">
<button className="text-[11px] font-bold text-primary uppercase hover:underline">Complete Details</button>
<span className="text-on-surface-variant opacity-40">•</span>
<button className="text-[11px] font-bold text-error uppercase hover:underline">Cancel Trip</button>
</div>
</div>

<div className="bg-surface-container-low/30 border border-outline-variant rounded-xl p-5 flex flex-col gap-4 opacity-80 hover:opacity-100 transition-all cursor-pointer relative">
<div className="absolute top-0 right-0 p-3">
<span className="status-pill px-3 py-1 bg-tertiary-container/20 text-tertiary text-[10px] font-bold rounded-full border border-tertiary/30 uppercase tracking-tighter">Completed</span>
</div>
<div className="flex gap-4">
<div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center text-tertiary">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
</div>
<div>
<h4 className="font-title-md text-on-surface">#TRP-6612-OP</h4>
<p className="text-xs text-on-surface-variant">Freightliner Cascadia • Sarah Johnson</p>
</div>
</div>
<div className="grid grid-cols-2 gap-6">
<div className="space-y-1">
<p className="text-[10px] uppercase font-bold text-on-surface-variant">Delivered To</p>
<p className="text-sm font-semibold">Chicago Logistics Ctr</p>
</div>
<div className="space-y-1 text-right">
<p className="text-[10px] uppercase font-bold text-on-surface-variant">Fuel Efficiency</p>
<p className="text-sm font-semibold text-tertiary">7.8 MPG (High)</p>
</div>
</div>
</div>

<div className="bg-error-container/10 border border-error/40 rounded-xl p-5 flex flex-col gap-4 group hover:border-error transition-all cursor-pointer relative overflow-hidden">
<div className="absolute top-0 right-0 p-3">
<span className="status-pill px-3 py-1 bg-error/20 text-error text-[10px] font-bold rounded-full border border-error/30 uppercase tracking-tighter">Delayed</span>
</div>
<div className="flex gap-4">
<div className="w-12 h-12 rounded-lg bg-error-container/20 flex items-center justify-center text-error animate-pulse">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
</div>
<div>
<h4 className="font-title-md text-on-surface">#TRP-5541-OP</h4>
<p className="text-xs text-on-surface-variant">Peterbilt 579 • David Miller</p>
</div>
</div>
<div className="space-y-1">
<p className="text-xs text-error font-medium">Mechanical Alert: Cooling system pressure drop detected.</p>
<div className="flex items-center gap-3 mt-2">
<button className="bg-error text-white text-[10px] font-bold px-3 py-1 rounded hover:bg-error/80 transition-all uppercase">Emergency Dispatch</button>
<button className="text-[10px] font-bold text-on-surface-variant uppercase hover:text-on-surface">Contact Driver</button>
</div>
</div>
</div>
</div>
</section>
</div>
</main>
    </>
  );
};

export default TripManagement;
