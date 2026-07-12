import React from 'react';

const FuelExpenses = () => {
  return (
    <>
      {/* Page Specific Styles */}
      <style>{`
        body {
            font-family: 'Inter', sans-serif;
            background-color: #111111;
            color: #f3dfd1;
            margin: 0;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        /* Custom scrollbar for data-heavy views */
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
        /* Glassmorphism subtle effect */
        .glass-card {
            background: rgba(30, 30, 30, 0.6);
            backdrop-filter: blur(12px);
            border: 1px solid #2e2e2e;
        }
        .data-row:hover {
            background-color: #252525;
        }

      `}</style>
      
      <main className="ml-[260px] min-h-screen flex flex-col">

<header className="flex justify-between items-center w-full px-margin-desktop py-md sticky top-0 bg-background/80 backdrop-blur-md z-40 border-b border-outline-variant">
<div className="flex items-center gap-lg">
<div className="relative group">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input className="bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-4 py-2 w-80 focus:outline-none focus:border-primary text-body-sm transition-all" placeholder="Search logs, vehicles, or costs..." type="text"/>
</div>
</div>
<div className="flex items-center gap-md">
<button className="bg-primary-container text-on-primary-fixed-variant px-4 py-2 rounded-lg font-title-md text-title-md flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all">
<span className="material-symbols-outlined">add</span>
                    New Trip
                </button>
<div className="flex items-center gap-sm">
<button className="p-2 text-on-surface-variant hover:bg-surface-container-highest rounded-full transition-all">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="p-2 text-on-surface-variant hover:bg-surface-container-highest rounded-full transition-all">
<span className="material-symbols-outlined">help_outline</span>
</button>
<div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant ml-2">
<img className="w-full h-full object-cover" data-alt="A professional headshot of a logistics fleet manager, mid-40s with a focused expression, in a high-tech control center environment. The lighting is soft and cinematic with cool blue and warm orange tones, maintaining a high-end corporate ERP aesthetic. The background features blurred digital monitors displaying data charts." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbJYdqEimnOFXsUVbDWtfy-q5lYeak5p2cwvgg38_l57PuTLY98eYTQh5BQAnYhZthu61GwriXq4RbQW942br59P5V53qfr9h8uTT1U7_3UCnmmQLg_ls3sHv3V1XHmCC_2xrTio6mFg4KkLWWKBiAWAeLDocJtw1kXKm84hDNzoj7V91XNRQjECWiFs4x2xdtPlzNtq_WfM2XfonvDDaAhQQmRwEqxR-JhG_DcmPE34J3XzbfDIw1SA"/>
</div>
</div>
</div>
</header>

<div className="p-margin-desktop space-y-xl">

<div className="grid grid-cols-12 gap-gutter">

<div className="col-span-12 lg:col-span-8 relative overflow-hidden rounded-xl glass-card p-xl flex flex-col justify-between">
<div className="relative z-10">
<div className="flex justify-between items-start">
<div>
<h2 className="font-title-md text-title-md text-on-surface-variant mb-1 uppercase tracking-wider">Total Operational Cost (Monthly)</h2>
<p className="font-display-lg text-display-lg text-primary">$142,580.42</p>
</div>
<div className="bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 flex items-center gap-1">
<span className="material-symbols-outlined text-sm">trending_up</span>
<span className="font-label-md text-label-md">12.4% vs Last Month</span>
</div>
</div>
<div className="mt-xl grid grid-cols-3 gap-lg">
<div className="p-md bg-surface-container/50 rounded-lg border border-outline-variant">
<p className="font-label-md text-label-md text-on-surface-variant mb-1">Fuel Consumption</p>
<p className="font-headline-md text-headline-md">$84,120.00</p>
</div>
<div className="p-md bg-surface-container/50 rounded-lg border border-outline-variant">
<p className="font-label-md text-label-md text-on-surface-variant mb-1">Maintenance</p>
<p className="font-headline-md text-headline-md">$32,450.12</p>
</div>
<div className="p-md bg-surface-container/50 rounded-lg border border-outline-variant">
<p className="font-label-md text-label-md text-on-surface-variant mb-1">Taxes &amp; Insurance</p>
<p className="font-headline-md text-headline-md">$26,010.30</p>
</div>
</div>
</div>

<div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
<span className="material-symbols-outlined text-[120px]">payments</span>
</div>
</div>

<div className="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
<button className="flex-1 glass-card rounded-xl p-lg flex flex-col items-center justify-center gap-sm group hover:border-primary transition-all">
<div className="w-14 h-14 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-3xl">local_gas_station</span>
</div>
<h3 className="font-title-lg text-title-lg">Log Fuel</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant text-center px-6">Record a new fueling event for any vehicle in the fleet.</p>
</button>
<button className="flex-1 glass-card rounded-xl p-lg flex flex-col items-center justify-center gap-sm group hover:border-primary transition-all">
<div className="w-14 h-14 bg-surface-container-high text-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform border border-outline-variant">
<span className="material-symbols-outlined text-3xl">receipt_long</span>
</div>
<h3 className="font-title-lg text-title-lg">Record Expense</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant text-center px-6">Log insurance, parts, taxes, or general operational costs.</p>
</button>
</div>
</div>

<div className="flex items-center justify-between border-b border-outline-variant pb-base">
<div className="flex gap-lg">
<button className="font-title-md text-title-md text-primary border-b-2 border-primary pb-3 px-2">Fuel Logs</button>
<button className="font-title-md text-title-md text-on-surface-variant hover:text-on-surface pb-3 px-2">Operational Expenses</button>
<button className="font-title-md text-title-md text-on-surface-variant hover:text-on-surface pb-3 px-2">Tax Reports</button>
</div>
<div className="flex items-center gap-md">
<button className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant bg-surface-container-high px-3 py-1.5 rounded-lg border border-outline-variant">
<span className="material-symbols-outlined text-sm">filter_list</span>
                        Filter
                    </button>
<button className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant bg-surface-container-high px-3 py-1.5 rounded-lg border border-outline-variant">
<span className="material-symbols-outlined text-sm">download</span>
                        Export CSV
                    </button>
</div>
</div>

<div className="grid grid-cols-12 gap-gutter">

<div className="col-span-12 xl:col-span-8 space-y-md">
<div className="flex items-center justify-between">
<h3 className="font-headline-md text-headline-md">Recent Fuel Logs</h3>
<a className="text-primary font-label-md text-label-md hover:underline" href="#">View All Logs</a>
</div>
<div className="glass-card rounded-xl overflow-hidden">
<table className="w-full text-left border-collapse">
<thead className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant">
<tr>
<th className="px-md py-4 font-label-md text-label-md uppercase tracking-wider">Vehicle</th>
<th className="px-md py-4 font-label-md text-label-md uppercase tracking-wider">Date</th>
<th className="px-md py-4 font-label-md text-label-md uppercase tracking-wider">Volume (L)</th>
<th className="px-md py-4 font-label-md text-label-md uppercase tracking-wider">Price/Unit</th>
<th className="px-md py-4 font-label-md text-label-md uppercase tracking-wider">Station</th>
<th className="px-md py-4 font-label-md text-label-md uppercase tracking-wider text-right">Total</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr className="data-row transition-colors">
<td className="px-md py-4">
<div className="flex items-center gap-sm">
<div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center">
<span className="material-symbols-outlined text-sm">local_shipping</span>
</div>
<div>
<p className="font-body-md text-body-md font-semibold">T-4509 (Freightliner)</p>
<p className="font-label-md text-label-md text-on-surface-variant">Fleet Alpha</p>
</div>
</div>
</td>
<td className="px-md py-4 font-body-md text-body-md">Oct 24, 2023</td>
<td className="px-md py-4 font-body-md text-body-md">450.50</td>
<td className="px-md py-4 font-body-md text-body-md">$1.42</td>
<td className="px-md py-4 font-body-md text-body-md">Shell Express - Sector 4</td>
<td className="px-md py-4 font-body-md text-body-md font-bold text-right">$639.71</td>
</tr>
<tr className="data-row transition-colors">
<td className="px-md py-4">
<div className="flex items-center gap-sm">
<div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center">
<span className="material-symbols-outlined text-sm">local_shipping</span>
</div>
<div>
<p className="font-body-md text-body-md font-semibold">T-8821 (Volvo FH16)</p>
<p className="font-label-md text-label-md text-on-surface-variant">Fleet Beta</p>
</div>
</div>
</td>
<td className="px-md py-4 font-body-md text-body-md">Oct 23, 2023</td>
<td className="px-md py-4 font-body-md text-body-md">620.00</td>
<td className="px-md py-4 font-body-md text-body-md">$1.39</td>
<td className="px-md py-4 font-body-md text-body-md">TruckStop Hub</td>
<td className="px-md py-4 font-body-md text-body-md font-bold text-right">$861.80</td>
</tr>
<tr className="data-row transition-colors">
<td className="px-md py-4">
<div className="flex items-center gap-sm">
<div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center">
<span className="material-symbols-outlined text-sm">local_shipping</span>
</div>
<div>
<p className="font-body-md text-body-md font-semibold">T-1022 (Kenworth)</p>
<p className="font-label-md text-label-md text-on-surface-variant">Fleet Alpha</p>
</div>
</div>
</td>
<td className="px-md py-4 font-body-md text-body-md">Oct 23, 2023</td>
<td className="px-md py-4 font-body-md text-body-md">310.25</td>
<td className="px-md py-4 font-body-md text-body-md">$1.45</td>
<td className="px-md py-4 font-body-md text-body-md">BP Marine Center</td>
<td className="px-md py-4 font-body-md text-body-md font-bold text-right">$449.86</td>
</tr>
<tr className="data-row transition-colors">
<td className="px-md py-4">
<div className="flex items-center gap-sm">
<div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center">
<span className="material-symbols-outlined text-sm">local_shipping</span>
</div>
<div>
<p className="font-body-md text-body-md font-semibold">T-5567 (Scania R)</p>
<p className="font-label-md text-label-md text-on-surface-variant">Fleet Gamma</p>
</div>
</div>
</td>
<td className="px-md py-4 font-body-md text-body-md">Oct 22, 2023</td>
<td className="px-md py-4 font-body-md text-body-md">580.00</td>
<td className="px-md py-4 font-body-md text-body-md">$1.40</td>
<td className="px-md py-4 font-body-md text-body-md">Route66 Logistics Stop</td>
<td className="px-md py-4 font-body-md text-body-md font-bold text-right">$812.00</td>
</tr>
</tbody>
</table>
</div>
</div>

<div className="col-span-12 xl:col-span-4 space-y-md">
<div className="flex items-center justify-between">
<h3 className="font-headline-md text-headline-md">Operational Costs</h3>
<a className="text-primary font-label-md text-label-md hover:underline" href="#">Full Report</a>
</div>
<div className="glass-card rounded-xl p-md">
<div className="space-y-sm">

<div className="p-md bg-surface-container/30 rounded-lg border border-outline-variant flex justify-between items-center group hover:bg-surface-container/60 transition-all">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-full bg-on-tertiary-fixed-variant/20 text-tertiary flex items-center justify-center">
<span className="material-symbols-outlined">shield</span>
</div>
<div>
<p className="font-body-md text-body-md font-semibold">Annual Fleet Insurance</p>
<p className="font-label-md text-label-md text-on-surface-variant">Oct 20, 2023 • Paid</p>
</div>
</div>
<p className="font-title-md text-title-md text-primary">$18,400</p>
</div>

<div className="p-md bg-surface-container/30 rounded-lg border border-outline-variant flex justify-between items-center group hover:bg-surface-container/60 transition-all">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-full bg-error-container/20 text-error flex items-center justify-center">
<span className="material-symbols-outlined">build</span>
</div>
<div>
<p className="font-body-md text-body-md font-semibold">Engine Replacement (T-4509)</p>
<p className="font-label-md text-label-md text-on-surface-variant">Oct 18, 2023 • Maintenance</p>
</div>
</div>
<p className="font-title-md text-title-md text-primary">$4,250</p>
</div>

<div className="p-md bg-surface-container/30 rounded-lg border border-outline-variant flex justify-between items-center group hover:bg-surface-container/60 transition-all">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-full bg-secondary-container/20 text-secondary flex items-center justify-center">
<span className="material-symbols-outlined">description</span>
</div>
<div>
<p className="font-body-md text-body-md font-semibold">Quarterly Road Tax</p>
<p className="font-label-md text-label-md text-on-surface-variant">Oct 15, 2023 • Compliance</p>
</div>
</div>
<p className="font-title-md text-title-md text-primary">$3,120</p>
</div>

<div className="p-md bg-surface-container/30 rounded-lg border border-outline-variant flex justify-between items-center group hover:bg-surface-container/60 transition-all">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-full bg-on-tertiary-fixed-variant/20 text-tertiary flex items-center justify-center">
<span className="material-symbols-outlined">shopping_cart</span>
</div>
<div>
<p className="font-body-md text-body-md font-semibold">Spare Parts Inventory</p>
<p className="font-label-md text-label-md text-on-surface-variant">Oct 12, 2023 • Parts</p>
</div>
</div>
<p className="font-title-md text-title-md text-primary">$2,840</p>
</div>
</div>
<div className="mt-lg pt-lg border-t border-outline-variant">
<div className="flex justify-between items-center">
<span className="font-body-md text-body-md text-on-surface-variant">Total Sub-expenses</span>
<span className="font-headline-md text-headline-md text-on-surface">$28,610.00</span>
</div>
</div>
</div>
</div>
</div>

<div className="grid grid-cols-12 gap-gutter">
<div className="col-span-12 lg:col-span-4 glass-card rounded-xl p-lg relative overflow-hidden">
<h4 className="font-title-md text-title-md mb-4">Fuel Efficiency by Fleet</h4>
<div className="space-y-md">
<div className="space-y-xs">
<div className="flex justify-between text-label-md">
<span>Fleet Alpha</span>
<span>78% Optimal</span>
</div>
<div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-primary rounded-full" style={{ width: "78%" }}></div>
</div>
</div>
<div className="space-y-xs">
<div className="flex justify-between text-label-md">
<span>Fleet Beta</span>
<span>92% Optimal</span>
</div>
<div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-primary rounded-full" style={{ width: "92%" }}></div>
</div>
</div>
<div className="space-y-xs">
<div className="flex justify-between text-label-md">
<span>Fleet Gamma</span>
<span>64% Optimal</span>
</div>
<div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-error rounded-full" style={{ width: "64%" }}></div>
</div>
</div>
</div>
</div>
<div className="col-span-12 lg:col-span-8 glass-card rounded-xl p-lg flex flex-col justify-center relative overflow-hidden">
<div className="absolute inset-0 opacity-20 pointer-events-none">

<div className="w-full h-full" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #ff8a00 0%, transparent 50%), radial-gradient(circle at 80% 80%, #0566d9 0%, transparent 50%)", filter: "blur(60px)" }}></div>
</div>
<div className="relative z-10 flex items-center justify-between">
<div>
<h4 className="font-headline-md text-headline-md mb-2">Predictive Maintenance AI</h4>
<p className="font-body-md text-body-md text-on-surface-variant max-w-lg">Our ML model suggests increasing maintenance budgets by 8% next month to avoid critical vehicle downtime based on current fuel degradation logs.</p>
</div>
<button className="bg-surface-container-highest text-on-surface px-6 py-2.5 rounded-lg border border-outline font-title-md text-title-md hover:bg-surface-bright transition-all">
                            Review AI Analysis
                        </button>
</div>
</div>
</div>
</div>

<footer className="mt-auto px-margin-desktop py-lg border-t border-outline-variant flex justify-between items-center text-on-surface-variant opacity-60">
<p className="font-label-md text-label-md">© 2024 TransitOps Logistics ERP. All systems operational.</p>
<div className="flex gap-lg font-label-md text-label-md">
<a className="hover:text-primary transition-colors" href="#">Privacy Protocol</a>
<a className="hover:text-primary transition-colors" href="#">Audit Logs</a>
<a className="hover:text-primary transition-colors" href="#">API Status</a>
</div>
</footer>
</main>
    </>
  );
};

export default FuelExpenses;
