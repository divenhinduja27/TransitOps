import React from 'react';

const Reports = () => {
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
        .chart-container {
            background: linear-gradient(145deg, #1e1e1e 0%, #161616 100%);
            border: 1px solid #2e2e2e;
        }
        .bento-grid {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            gap: 16px;
        }
        .bento-card {
            background-color: #1e1e1e;
            border: 1px solid #2e2e2e;
            border-radius: 12px;
            overflow: hidden;
            transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .bento-card:hover {
            border-color: #ff8a00;
        }
        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #111111; }
        ::-webkit-scrollbar-thumb { background: #3f3229; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #ff8a00; }

      `}</style>
      
      <main className="flex-1 ml-[260px] min-h-screen flex flex-col">

<header className="sticky top-0 z-40 bg-background flex justify-between items-center w-full px-margin-desktop py-md border-b border-outline-variant">
<div className="flex items-center gap-6">
<div className="relative">
<span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-[20px]">search</span>
<input className="bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-body-sm w-80 focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none" placeholder="Search analytics..." type="text"/>
</div>
</div>
<div className="flex items-center gap-4">
<button className="px-4 py-2 border border-outline-variant rounded-lg text-body-sm font-medium hover:bg-surface-container-highest transition-all">Add Vehicle</button>
<button className="px-4 py-2 bg-primary-container text-on-primary-fixed font-bold rounded-lg text-body-sm active:opacity-80 transition-all">New Trip</button>
<div className="flex items-center gap-2 ml-2">
<button className="p-2 text-on-surface-variant hover:bg-surface-container-highest rounded-full transition-all">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="p-2 text-on-surface-variant hover:bg-surface-container-highest rounded-full transition-all">
<span className="material-symbols-outlined">help_outline</span>
</button>
</div>
<div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant ml-2 cursor-pointer">
<img className="w-full h-full object-cover" data-alt="A professional close-up headshot of a logistics manager in a modern, high-tech office environment. The lighting is crisp and cool-toned, reflecting a dark UI aesthetic with subtle orange highlights. The background features blurred digital screens displaying logistics maps and data charts, emphasizing a command-center atmosphere." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCy5yeb9xWT0i9MPp4N6bRa0dI6DQqihYSsGNwqibNqTEbsDuHvzBcmCz5_6phM8NKPjUclt3Juoi8eDahyJSIFcoH7UJ7pnWqZGgBUrB1QvtKrhs-y08bRjrI1Mpc84kjzMBKM3JWNN8SdusyCtUrYiYl5O8S4kTDTTzz-TDy8gcp9z2TljKr2QE3NB52heUJ-o276Y8AbQ7zeJ_kk9NtmjXqVQfBJFESVWeE5--bThATWD_i_i21x6Q"/>
</div>
</div>
</header>

<div className="p-margin-desktop">

<div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
<div>
<h2 className="font-headline-lg text-headline-lg text-primary">Reports &amp; Analytics</h2>
<p className="text-on-surface-variant text-body-md mt-1">Real-time performance metrics and efficiency tracking.</p>
</div>
<div className="flex items-center gap-3">
<div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant">
<button className="px-4 py-1.5 text-label-md rounded-md bg-secondary-container text-on-secondary-container transition-all">Daily</button>
<button className="px-4 py-1.5 text-label-md rounded-md text-on-surface-variant hover:text-on-surface transition-all">Weekly</button>
<button className="px-4 py-1.5 text-label-md rounded-md text-on-surface-variant hover:text-on-surface transition-all">Monthly</button>
<button className="px-4 py-1.5 text-label-md rounded-md text-on-surface-variant hover:text-on-surface transition-all">Yearly</button>
</div>
<div className="flex gap-2">
<button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-label-md font-bold text-on-surface-variant hover:border-primary transition-all">
<span className="material-symbols-outlined text-[18px]">download</span>
                            CSV
                        </button>
<button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-label-md font-bold text-on-surface-variant hover:border-primary transition-all">
<span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                            PDF
                        </button>
</div>
</div>
</div>

<div className="bento-grid">

<div className="col-span-12 lg:col-span-4 bento-card p-6 flex flex-col justify-between relative overflow-hidden">
<div className="relative z-10">
<div className="flex justify-between items-start mb-4">
<h3 className="text-title-md text-primary uppercase tracking-wider font-bold">ROI Analysis</h3>
<span className="px-2 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] rounded-full font-bold">+12.4% vs LY</span>
</div>
<div className="space-y-1">
<p className="text-on-surface-variant text-label-md">Net Profit Margin</p>
<p className="text-display-lg font-display-lg text-white">24.8%</p>
</div>
</div>
<div className="mt-8 pt-6 border-t border-outline-variant/30 relative z-10">
<div className="grid grid-cols-2 gap-4">
<div>
<p className="text-on-surface-variant text-[11px] uppercase font-bold tracking-tighter">Gross Revenue</p>
<p className="text-title-md">$1.24M</p>
</div>
<div>
<p className="text-on-surface-variant text-[11px] uppercase font-bold tracking-tighter">Op Expenses</p>
<p className="text-title-md text-error">$412K</p>
</div>
</div>
</div>

<div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
</div>

<div className="col-span-12 lg:col-span-8 bento-card p-6">
<div className="flex justify-between items-center mb-6">
<h3 className="text-title-md font-bold">Fleet Utilization</h3>
<div className="flex items-center gap-4 text-label-sm text-on-surface-variant">
<span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-primary rounded-sm"></span> Active</span>
<span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-secondary rounded-sm"></span> In Maintenance</span>
</div>
</div>
<div className="h-48 flex items-end justify-between gap-2 px-2">

<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="w-full bg-secondary-fixed-dim/20 rounded-t-sm h-[30%] relative"></div>
<div className="w-full bg-primary rounded-t-sm h-[60%] group-hover:h-[65%] transition-all duration-300"></div>
<span className="text-[10px] text-on-surface-variant font-bold mt-2">MON</span>
</div>
<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="w-full bg-secondary-fixed-dim/20 rounded-t-sm h-[20%] relative"></div>
<div className="w-full bg-primary rounded-t-sm h-[75%] group-hover:h-[80%] transition-all duration-300"></div>
<span className="text-[10px] text-on-surface-variant font-bold mt-2">TUE</span>
</div>
<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="w-full bg-secondary-fixed-dim/20 rounded-t-sm h-[40%] relative"></div>
<div className="w-full bg-primary rounded-t-sm h-[50%] group-hover:h-[55%] transition-all duration-300"></div>
<span className="text-[10px] text-on-surface-variant font-bold mt-2">WED</span>
</div>
<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="w-full bg-secondary-fixed-dim/20 rounded-t-sm h-[15%] relative"></div>
<div className="w-full bg-primary rounded-t-sm h-[82%] group-hover:h-[87%] transition-all duration-300"></div>
<span className="text-[10px] text-on-surface-variant font-bold mt-2">THU</span>
</div>
<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="w-full bg-secondary-fixed-dim/20 rounded-t-sm h-[10%] relative"></div>
<div className="w-full bg-primary rounded-t-sm h-[90%] group-hover:h-[95%] transition-all duration-300"></div>
<span className="text-[10px] text-on-surface-variant font-bold mt-2">FRI</span>
</div>
<div className="flex-1 flex flex-col items-center gap-2 group opacity-50">
<div className="w-full bg-secondary-fixed-dim/20 rounded-t-sm h-[60%] relative"></div>
<div className="w-full bg-primary rounded-t-sm h-[30%] group-hover:h-[35%] transition-all duration-300"></div>
<span className="text-[10px] text-on-surface-variant font-bold mt-2">SAT</span>
</div>
<div className="flex-1 flex flex-col items-center gap-2 group opacity-50">
<div className="w-full bg-secondary-fixed-dim/20 rounded-t-sm h-[70%] relative"></div>
<div className="w-full bg-primary rounded-t-sm h-[20%] group-hover:h-[25%] transition-all duration-300"></div>
<span className="text-[10px] text-on-surface-variant font-bold mt-2">SUN</span>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-7 bento-card p-6">
<div className="flex justify-between items-center mb-6">
<div>
<h3 className="text-title-md font-bold">Fuel Efficiency Trends</h3>
<p className="text-on-surface-variant text-xs">Avg mpg across the active fleet</p>
</div>
<div className="text-right">
<p className="text-title-lg text-primary">6.4 <span className="text-xs text-on-surface-variant">mpg</span></p>
<p className="text-[10px] text-green-400 font-bold">Optimal Range</p>
</div>
</div>
<div className="h-64 relative w-full overflow-hidden rounded-lg bg-surface-container-lowest/50 border border-outline-variant/30">

<svg className="w-full h-full" preserveaspectratio="none" viewbox="0 0 800 200">
<defs>
<lineargradient id="lineGradient" x1="0%" x2="0%" y1="0%" y2="100%">
<stop offset="0%" style={{ stopColor: "rgba(255, 138, 0, 0.4)", stopOpacity: "1" }}></stop>
<stop offset="100%" style={{ stopColor: "rgba(255, 138, 0, 0)", stopOpacity: "1" }}></stop>
</lineargradient>
</defs>
<path d="M0 150 Q 100 130, 200 160 T 400 100 T 600 140 T 800 80 L 800 200 L 0 200 Z" fill="url(#lineGradient)"></path>
<path d="M0 150 Q 100 130, 200 160 T 400 100 T 600 140 T 800 80" fill="transparent" stroke="#ff8a00" stroke-width="3"></path>

<circle cx="200" cy="160" fill="#ffffff" r="4"></circle>
<circle cx="400" cy="100" fill="#ffffff" r="4"></circle>
<circle cx="600" cy="140" fill="#ffffff" r="4"></circle>
<circle cx="800" cy="80" fill="#ffffff" r="4"></circle>
</svg>

<div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none opacity-10">
<div className="border-t border-on-surface w-full"></div>
<div className="border-t border-on-surface w-full"></div>
<div className="border-t border-on-surface w-full"></div>
<div className="border-t border-on-surface w-full"></div>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-5 bento-card p-6">
<h3 className="text-title-md font-bold mb-6">Operational Cost Breakdown</h3>
<div className="space-y-6">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin-slow flex-shrink-0" style={{ animationDuration: "10s" }}></div>
<div className="flex-1">
<div className="flex justify-between items-center mb-1">
<p className="text-body-md font-medium">Fuel &amp; Tolls</p>
<p className="text-body-md font-bold">42%</p>
</div>
<div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
<div className="bg-primary h-full w-[42%]"></div>
</div>
</div>
</div>
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-full border-4 border-secondary border-l-transparent animate-spin-slow flex-shrink-0" style={{ animationDuration: "15s" }}></div>
<div className="flex-1">
<div className="flex justify-between items-center mb-1">
<p className="text-body-md font-medium">Labor &amp; Driver Pay</p>
<p className="text-body-md font-bold">35%</p>
</div>
<div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
<div className="bg-secondary h-full w-[35%]"></div>
</div>
</div>
</div>
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-full border-4 border-tertiary border-b-transparent animate-spin-slow flex-shrink-0" style={{ animationDuration: "12s" }}></div>
<div className="flex-1">
<div className="flex justify-between items-center mb-1">
<p className="text-body-md font-medium">Maintenance &amp; Repairs</p>
<p className="text-body-md font-bold">18%</p>
</div>
<div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
<div className="bg-tertiary h-full w-[18%]"></div>
</div>
</div>
</div>
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-full border-4 border-outline border-r-transparent animate-spin-slow flex-shrink-0" style={{ animationDuration: "20s" }}></div>
<div className="flex-1">
<div className="flex justify-between items-center mb-1">
<p className="text-body-md font-medium">Insurance &amp; Misc</p>
<p className="text-body-md font-bold">5%</p>
</div>
<div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
<div className="bg-outline h-full w-[5%]"></div>
</div>
</div>
</div>
</div>
</div>

<div className="col-span-12 bento-card h-[400px] relative">
<div className="w-full h-full bg-cover bg-center grayscale opacity-60" data-alt="A dark-themed, high-resolution digital map interface of a bustling logistics network. Lines of orange and blue light connect major transport hubs across a metropolitan area at night. Small glowing dots representing active fleet vehicles move along defined transit corridors. The style is technical, minimal, and authoritative, like a mission control display." style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC_rP8oepqHkVBhUEQTzFS9bC2gB_Dsk9hXIUqbIfM0G0fhktOwpVoXSPUcOv3Ldn_fFOO4a-bx-pGNk53iLivgpgwhO2gu5NsduUnxDZOoug00BI-CmAchiflrMG0CgMY4MMqT--qxh93nSWO02uuQw3PlB1DXXgnVmjpL2HFRC23JREI1btTmsQ0Yr27-By5v5gqJVpZYcyLRXdNZhJuU0T_2m0OUWEI7Mx5Eno61RLxGQRD2zP7jzQ')" }}></div>
<div className="absolute top-6 left-6 z-10 bg-surface-container/90 backdrop-blur-md p-4 rounded-xl border border-outline-variant shadow-2xl">
<div className="flex items-center gap-3 mb-3">
<span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
<h4 className="text-label-md font-bold uppercase tracking-widest text-primary">Live Operations</h4>
</div>
<div className="space-y-4">
<div className="flex justify-between gap-8">
<span className="text-body-sm text-on-surface-variant">Active Trips</span>
<span className="text-body-sm font-bold">142</span>
</div>
<div className="flex justify-between gap-8">
<span className="text-body-sm text-on-surface-variant">Delayed</span>
<span className="text-body-sm font-bold text-error">4</span>
</div>
<div className="flex justify-between gap-8">
<span className="text-body-sm text-on-surface-variant">Fleet Health</span>
<span className="text-body-sm font-bold text-secondary">98.2%</span>
</div>
</div>
<button className="w-full mt-4 py-2 bg-surface-container-highest text-on-surface font-bold text-label-md rounded-lg hover:bg-primary hover:text-on-primary transition-all">View Fleet Detail</button>
</div>
<div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background via-transparent to-transparent"></div>
</div>
</div>

<div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
<div className="p-6 bg-surface-container-low rounded-xl border border-outline-variant flex items-center gap-4">
<div className="p-3 bg-primary/10 rounded-lg">
<span className="material-symbols-outlined text-primary">speed</span>
</div>
<div>
<p className="text-on-surface-variant text-label-md font-bold uppercase">Avg Transit Speed</p>
<p className="text-title-lg">52.4 mph</p>
</div>
</div>
<div className="p-6 bg-surface-container-low rounded-xl border border-outline-variant flex items-center gap-4">
<div className="p-3 bg-secondary/10 rounded-lg">
<span className="material-symbols-outlined text-secondary">timer</span>
</div>
<div>
<p className="text-on-surface-variant text-label-md font-bold uppercase">Dock Wait Time</p>
<p className="text-title-lg">18.5 min</p>
</div>
</div>
<div className="p-6 bg-surface-container-low rounded-xl border border-outline-variant flex items-center gap-4">
<div className="p-3 bg-tertiary/10 rounded-lg">
<span className="material-symbols-outlined text-tertiary">inventory_2</span>
</div>
<div>
<p className="text-on-surface-variant text-label-md font-bold uppercase">Cargo Integrity</p>
<p className="text-title-lg">99.94%</p>
</div>
</div>
</div>
</div>
<footer className="mt-auto py-8 px-margin-desktop text-center border-t border-outline-variant/30">
<p className="text-on-surface-variant text-body-sm opacity-50">© 2024 TransitOps Logistics Systems. All reports encrypted and verified.</p>
</footer>
</main>
    </>
  );
};

export default Reports;
