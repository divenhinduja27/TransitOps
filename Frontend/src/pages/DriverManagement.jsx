import React from 'react';

const DriverManagement = () => {
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
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        ::-webkit-scrollbar-track {
            background: #1A1A1A;
        }
        ::-webkit-scrollbar-thumb {
            background: #3E3E3E;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #ffb77f;
        }
        .glass-card {
            background: rgba(30, 30, 30, 0.6);
            backdrop-filter: blur(12px);
            border: 1px solid #2E2E2E;
        }

      `}</style>
      
      <main className="ml-[260px] min-h-screen flex flex-col">

<header className="sticky top-0 z-40 bg-background flex justify-between items-center w-full px-margin-desktop py-md border-b border-outline-variant">
<div className="flex items-center gap-gutter flex-1">
<div className="relative w-full max-w-md">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-2 pl-10 pr-4 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Search drivers by name, license or status..." type="text"/>
</div>
</div>
<div className="flex items-center gap-md">
<button className="px-4 py-2 border border-outline-variant rounded-lg text-on-surface font-title-md hover:bg-surface-container-highest transition-all flex items-center gap-2">
<span className="material-symbols-outlined text-[20px]">add_circle</span>
                    Add Vehicle
                </button>
<button className="px-6 py-2 bg-primary-container text-on-primary-container rounded-lg font-title-md hover:opacity-90 active:opacity-80 transition-all flex items-center gap-2">
<span className="material-symbols-outlined text-[20px]">person_add</span>
                    Add Driver
                </button>
<div className="h-8 w-[1px] bg-outline-variant mx-2"></div>
<button className="p-2 text-on-surface-variant hover:bg-surface-container-highest rounded-full transition-all relative">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
</button>
<div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant">
<img className="w-full h-full object-cover" data-alt="A professional headshot of a mature fleet operations manager wearing a crisp white shirt in a dimly lit, high-tech command center. The lighting is dramatic and cinematic, with cool blue and warm orange rim light reflecting off sleek glass surfaces. The style is hyper-realistic with sharp focus and a shallow depth of field." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC25xqxZxfH5GoEBO3LEl8Ymi6YC6ZZgA5ctHLhHMpSeGyP7ZGqRubFKs-NGgFsmkTe24GfJfwKYwNo7Y5Sn2XxH9s-6jnS27K_wFTKvefdixqoBtKjWsKujgJcDZjbBb7xlVQgf-gEILcKz1gPcqEnsWJKllj0xVNHB55B1RKngbkhSUk2GCxQHZNjNFly1RIRUUkixbTPDvNKUVcV3Zpl8LZN2sZ_T4l0mAZOOJGfM2dXHsJLTEy-YA"/>
</div>
</div>
</header>

<div className="p-margin-desktop space-y-lg">

<div className="flex flex-col md:flex-row justify-between items-end gap-md">
<div>
<h2 className="font-headline-lg text-headline-lg text-on-background">Driver Management</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Oversee and manage your active logistics personnel.</p>
</div>
<div className="flex gap-md">
<div className="px-4 py-3 glass-card rounded-xl flex items-center gap-4 min-w-[160px]">
<div className="w-10 h-10 bg-secondary-container/20 rounded-lg flex items-center justify-center text-secondary">
<span className="material-symbols-outlined">group</span>
</div>
<div>
<p className="font-label-md text-label-md text-on-surface-variant">Total Drivers</p>
<p className="font-title-lg text-title-lg text-on-surface">124</p>
</div>
</div>
<div className="px-4 py-3 glass-card rounded-xl flex items-center gap-4 min-w-[160px]">
<div className="w-10 h-10 bg-primary-container/20 rounded-lg flex items-center justify-center text-primary">
<span className="material-symbols-outlined">verified_user</span>
</div>
<div>
<p className="font-label-md text-label-md text-on-surface-variant">Avg Safety</p>
<p className="font-title-lg text-title-lg text-on-surface">94.2%</p>
</div>
</div>
</div>
</div>

<div className="bg-surface-container-low rounded-xl border border-outline-variant overflow-hidden shadow-2xl">
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-lowest border-b border-outline-variant">
<th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Driver Name</th>
<th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">License &amp; Expiry</th>
<th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Safety Score</th>
<th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Contact Info</th>
<th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
<th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/30">

<tr className="hover:bg-surface-container transition-colors group">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg overflow-hidden border border-outline-variant">
<img className="w-full h-full object-cover" data-alt="Close-up portrait of a smiling young male truck driver in a professional uniform. The lighting is warm and natural, coming from a setting sun. The background shows a blurred commercial truck and a depot. High-density, professional photography style with vibrant orange tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvmivnqRpwSi00pyCpk_zZ0s7PW4z5w8NADQyktOhilLTifrcUko-c4fpJeUbyXMa1M7gu93CR21XgAH2RjhEnB5EqS4Q8B1RnKooQ1lpUW-c7irb2RzM6E6i8SdB1X_kFpEswxv9EN5ya22RdKY8k8O4I5kzLk77CI_XPwvCZAezXJcbrT3gA75XtUldNZc8FMq_xvHzkMg-U0b1RdjlVN9t6HeVWr5Gif80pOJeocqzjfBhDg7_p8g"/>
</div>
<div>
<p className="font-title-md text-title-md text-on-surface">Marcus Sterling</p>
<p className="font-label-md text-label-md text-on-surface-variant">ID: #DR-8821</p>
</div>
</div>
</td>
<td className="px-6 py-4">
<div>
<p className="font-body-md text-body-md text-on-surface">TX-22910-B</p>
<p className="font-label-md text-label-md text-error">Exp: Oct 12, 2024</p>
</div>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="w-24 h-2 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-primary-container" style={{ width: "98%" }}></div>
</div>
<span className="font-title-md text-title-md text-primary">98</span>
</div>
</td>
<td className="px-6 py-4">
<div>
<p className="font-body-md text-body-md text-on-surface">m.sterling@ops.com</p>
<p className="font-label-md text-label-md text-on-surface-variant">+1 (555) 012-3456</p>
</div>
</td>
<td className="px-6 py-4">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/10 border border-secondary-container text-secondary font-label-md text-label-md">
<span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                                        On Trip
                                    </span>
</td>
<td className="px-6 py-4 text-right">
<div className="flex justify-end gap-2">
<button className="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface-variant transition-all">
<span className="material-symbols-outlined">visibility</span>
</button>
<button className="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface-variant transition-all">
<span className="material-symbols-outlined">edit</span>
</button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container transition-colors group">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg overflow-hidden border border-outline-variant">
<img className="w-full h-full object-cover" data-alt="Portrait of a female logistics driver with a confident expression. She is wearing a modern reflective vest over dark tactical clothing. The lighting is cool-toned, industrial interior with neon cyan accents. High-contrast, sharp detail, cinematic lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZBB4mfT84pgvx2HudSCQC_EhdSLxTGIULm--AInnB8MGdSLADBuPwg9Cs3L8qhDgU6bZ3NQyjJictLhqBwIXjyXVrJnd78mHiXHyuAX_C7HRsPfaM2w-tBw4nOE1GnLvh4cNDmjTRqubhWVsaTDhxlZSLoPCzLiGpZqkazr3diqJB5NmgVl-MCBFK3Ximkv44ZoYMP9NYujXKzpVh_RQzLsufiiVKQBGiF9BQJd9clSUTu7DRLmVQWQ"/>
</div>
<div>
<p className="font-title-md text-title-md text-on-surface">Elena Rodriguez</p>
<p className="font-label-md text-label-md text-on-surface-variant">ID: #DR-9012</p>
</div>
</div>
</td>
<td className="px-6 py-4">
<div>
<p className="font-body-md text-body-md text-on-surface">CA-98112-A</p>
<p className="font-label-md text-label-md text-on-surface-variant">Exp: Jan 20, 2026</p>
</div>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="w-24 h-2 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-primary-container" style={{ width: "82%" }}></div>
</div>
<span className="font-title-md text-title-md text-primary">82</span>
</div>
</td>
<td className="px-6 py-4">
<div>
<p className="font-body-md text-body-md text-on-surface">elena.r@ops.com</p>
<p className="font-label-md text-label-md text-on-surface-variant">+1 (555) 987-6543</p>
</div>
</td>
<td className="px-6 py-4">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/10 border border-primary text-primary font-label-md text-label-md">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                        Active
                                    </span>
</td>
<td className="px-6 py-4 text-right">
<div className="flex justify-end gap-2">
<button className="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface-variant transition-all">
<span className="material-symbols-outlined">visibility</span>
</button>
<button className="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface-variant transition-all">
<span className="material-symbols-outlined">edit</span>
</button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container transition-colors group">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg overflow-hidden border border-outline-variant">
<img className="w-full h-full object-cover" data-alt="Portrait of an experienced male driver with a salt-and-pepper beard. He is leaning against a high-tech electric freight vehicle. The environment is a clean, modern parking facility with soft overhead LED panel lighting. Palette of deep greys, blacks, and electric orange highlights." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt_9qH1xOYLAr1z5Mr22QXBOxv8lMegkk_H8w9mV2I4PofWpUUrzmXdckyQQfqmbrDlbY0f9nSEQ_KvA-4KV0CpnCaQ1QbI9ovC0KqMzugZDuVcDFrKt3yE9yebyfboOeUC_XKo7d4mWi935a5M999nqVptfQYWqEOvB0z6eyDSitIk-5Ed-xO2TZO5BTLdKr8kbvWTnSAQLSSKYlsGcyOsIB6ArA_uKXlzsVMDQ-CUMxoD0RDI1j9Uw"/>
</div>
<div>
<p className="font-title-md text-title-md text-on-surface">David Chen</p>
<p className="font-label-md text-label-md text-on-surface-variant">ID: #DR-4450</p>
</div>
</div>
</td>
<td className="px-6 py-4">
<div>
<p className="font-body-md text-body-md text-on-surface">NY-55621-C</p>
<p className="font-label-md text-label-md text-on-surface-variant">Exp: Mar 15, 2027</p>
</div>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="w-24 h-2 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-primary-container" style={{ width: "95%" }}></div>
</div>
<span className="font-title-md text-title-md text-primary">95</span>
</div>
</td>
<td className="px-6 py-4">
<div>
<p className="font-body-md text-body-md text-on-surface">d.chen@ops.com</p>
<p className="font-label-md text-label-md text-on-surface-variant">+1 (555) 234-5678</p>
</div>
</td>
<td className="px-6 py-4">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-outline-variant/20 border border-outline-variant text-on-surface-variant font-label-md text-label-md">
<span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant/40"></span>
                                        Off Duty
                                    </span>
</td>
<td className="px-6 py-4 text-right">
<div className="flex justify-end gap-2">
<button className="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface-variant transition-all">
<span className="material-symbols-outlined">visibility</span>
</button>
<button className="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface-variant transition-all">
<span className="material-symbols-outlined">edit</span>
</button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container transition-colors group">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg overflow-hidden border border-outline-variant">
<img className="w-full h-full object-cover" data-alt="Cinematic portrait of a focused female driver in a heavy-duty logistics vehicle cabin at night. Dashboard lights cast a soft amber and blue glow on her face. The style is technical minimalism, high-key contrast against a deep black background. Professional photography." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOejYsEenEW1DEIOvk9EOvdokNYkeObve4hgVRx4K2UTK6E0h3R3wWI8rP6BrZApz973kHv5NJfghIYLzV95FdQ5vh4rmymmMWuJwVrra-_xHHVrcP9w1h6_GLzsJI3VlBfipnFYJe3xL8o1A68093h1oWkWQGWHUD-3rL9WDV2qNlF1iKE46UIn621He3eMFHkDfDxtzjayhSxy7SAO_5w4ygu7smBEsGS4Efd34twnuIpBspB87MBQ"/>
</div>
<div>
<p className="font-title-md text-title-md text-on-surface">Sarah Jenkins</p>
<p className="font-label-md text-label-md text-on-surface-variant">ID: #DR-7719</p>
</div>
</div>
</td>
<td className="px-6 py-4">
<div>
<p className="font-body-md text-body-md text-on-surface">WA-11092-B</p>
<p className="font-label-md text-label-md text-on-surface-variant">Exp: Aug 30, 2025</p>
</div>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="w-24 h-2 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-primary-container" style={{ width: "89%" }}></div>
</div>
<span className="font-title-md text-title-md text-primary">89</span>
</div>
</td>
<td className="px-6 py-4">
<div>
<p className="font-body-md text-body-md text-on-surface">s.jenkins@ops.com</p>
<p className="font-label-md text-label-md text-on-surface-variant">+1 (555) 765-4321</p>
</div>
</td>
<td className="px-6 py-4">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/10 border border-secondary-container text-secondary font-label-md text-label-md">
<span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                                        On Trip
                                    </span>
</td>
<td className="px-6 py-4 text-right">
<div className="flex justify-end gap-2">
<button className="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface-variant transition-all">
<span className="material-symbols-outlined">visibility</span>
</button>
<button className="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface-variant transition-all">
<span className="material-symbols-outlined">edit</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>

<div className="bg-surface-container-lowest px-6 py-4 flex items-center justify-between border-t border-outline-variant">
<p className="font-body-sm text-body-sm text-on-surface-variant">Showing 1 to 4 of 124 drivers</p>
<div className="flex gap-2">
<button className="p-1 px-3 border border-outline-variant rounded hover:bg-surface-container-high text-on-surface transition-all">
<span className="material-symbols-outlined text-[18px]">chevron_left</span>
</button>
<button className="p-1 px-3 bg-primary-container text-on-primary-container rounded font-label-md text-label-md">1</button>
<button className="p-1 px-3 border border-outline-variant rounded hover:bg-surface-container-high text-on-surface transition-all font-label-md text-label-md">2</button>
<button className="p-1 px-3 border border-outline-variant rounded hover:bg-surface-container-high text-on-surface transition-all font-label-md text-label-md">3</button>
<button className="p-1 px-3 border border-outline-variant rounded hover:bg-surface-container-high text-on-surface transition-all">
<span className="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-lg">

<div className="col-span-1 md:col-span-2 glass-card rounded-xl p-lg flex items-center justify-between">
<div className="flex items-center gap-md">
<div className="w-12 h-12 bg-error-container/20 rounded-full flex items-center justify-center text-error">
<span className="material-symbols-outlined">warning</span>
</div>
<div>
<h4 className="font-title-md text-title-md text-on-surface">Compliance Alerts</h4>
<p className="font-body-md text-body-md text-on-surface-variant">3 drivers have licenses expiring within 30 days.</p>
</div>
</div>
<button className="px-4 py-2 bg-error text-on-error rounded-lg font-label-md text-label-md hover:opacity-90">Review Compliance</button>
</div>

<div className="glass-card rounded-xl p-lg bg-surface-container-high">
<h4 className="font-title-md text-title-md text-on-surface mb-sm">Driver Efficiency</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-md">Download detailed weekly performance logs.</p>
<button className="w-full py-2 border border-primary text-primary rounded-lg font-label-md text-label-md hover:bg-primary/5 transition-all">Export CSV</button>
</div>
</div>
</div>

<footer className="mt-auto p-margin-desktop border-t border-outline-variant">
<div className="flex justify-between items-center opacity-50">
<p className="font-label-md text-label-md">© 2024 TransitOps Logistics ERP</p>
<div className="flex gap-md">
<a className="font-label-md text-label-md hover:text-primary" href="#">Support</a>
<a className="font-label-md text-label-md hover:text-primary" href="#">System Status</a>
</div>
</div>
</footer>
</main>
    </>
  );
};

export default DriverManagement;
