import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { ROUTES } from '../utils/constants';
import { registerLocalUser } from '../utils/authDb';

const Register = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('ROLE_DRIVER'); // Default to Dispatcher/Driver
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Live Statistics states for Left Dashboard Preview (adds premium dynamic feel)
  const [networkLoad, setNetworkLoad] = useState(84);
  const [activeNodes, setActiveNodes] = useState(142);
  const [inTransitCargo, setInTransitCargo] = useState(48210);

  // Periodically fluctuate stats slightly to simulate live telemetry feeds
  useEffect(() => {
    const timer = setInterval(() => {
      setNetworkLoad(prev => Math.min(Math.max(prev + Math.floor(Math.random() * 5) - 2, 70), 98));
      setActiveNodes(prev => Math.min(Math.max(prev + Math.floor(Math.random() * 3) - 1, 138), 146));
      setInTransitCargo(prev => prev + Math.floor(Math.random() * 20) - 8);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Client-side validation
    if (password !== confirmPassword) {
      setError('Security credentials do not match.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Cryptographic key must be at least 6 characters.');
      setIsLoading(false);
      return;
    }

    try {
      // 1. Prioritize creating the account on the live Spring Boot backend API
      const response = await api.post('/auth/register', {
        email: email.trim(),
        password: password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        roles: [role]
      });

      setSuccess('Operator profile initialized in master database. Redirecting to Gateway...');
      setIsLoading(false);
      
      // Auto redirect to login page after 1.5s
      setTimeout(() => navigate(ROUTES.LOGIN), 1500);

    } catch (err) {
      if (err.response) {
        // Backend replied with a validation error or status error
        setError(err.response.data?.message || err.response.data || 'Registration failed.');
        setIsLoading(false);
        return;
      }

      console.warn("Backend registration offline or error, saving in local secure sandbox database:", err.message);

      // 2. Fallback to Local Virtual Storage Database in LocalStorage
      setTimeout(() => {
        setIsLoading(false);
        const result = registerLocalUser(email, password, firstName, lastName, role);
        
        if (result.success) {
          setSuccess('Secure Sandbox Profile compiled. Redirecting to Gateway...');
          setTimeout(() => navigate(ROUTES.LOGIN), 1500);
        } else {
          setError(result.error);
        }
      }, 800);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0B0B0D] text-[#e6e1e2] font-sans overflow-x-hidden w-full relative">
      <style>{`
        .glass-card {
          background: rgba(18, 18, 22, 0.45);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        }

        .input-field {
          background-color: rgba(22, 22, 26, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #ffffff;
          transition: all 0.25s ease-in-out;
        }

        .input-field:focus {
          border-color: #ff8a00;
          background-color: rgba(22, 22, 26, 0.95);
          box-shadow: 0 0 10px rgba(255, 138, 0, 0.15);
          outline: none;
        }

        .role-btn {
          background-color: rgba(20, 20, 25, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .role-btn.active {
          border-color: #ff8a00;
          background-color: rgba(255, 138, 0, 0.08);
          box-shadow: 0 0 12px rgba(255, 138, 0, 0.1);
        }

        .glow-dot {
          box-shadow: 0 0 8px currentColor;
        }

        .gradient-bg {
          position: absolute;
          border-radius: 50%;
          filter: blur(140px);
          z-index: 0;
          pointer-events: none;
        }
      `}</style>

      {/* Futuristic Background Blur Blobs */}
      <div className="gradient-bg w-[400px] h-[400px] bg-indigo-600/10 -top-40 -left-40"></div>
      <div className="gradient-bg w-[500px] h-[500px] bg-amber-500/5 -bottom-40 -right-40"></div>

      {/* LEFT PANEL: Live Logistics Telemetry Map/Command Console */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 select-none relative border-r border-white/[0.05] bg-gradient-to-b from-[#0E0E12] to-[#0A0A0C]">
        
        {/* Header Branding */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-[#ff8a00] to-[#e07b00] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/15">
            <span className="material-symbols-outlined text-[#0B0B0D] text-[26px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_shipping
            </span>
          </div>
          <div>
            <h1 className="font-headline text-xl font-extrabold tracking-tight text-white leading-none">TransitOps</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff8a00] mt-1.5">Command Infrastructure</p>
          </div>
        </div>

        {/* Live Network Dashboard Simulator */}
        <div className="my-auto space-y-8">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-[#ff8a00]/70 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live Telemetry Core
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight leading-snug">
              Initialize Operations Node
            </h2>
            <p className="text-xs text-on-surface-variant/70 max-w-sm leading-relaxed">
              Register a cryptographic operator profile and assign your clearance level within our global transit matrix.
            </p>
          </div>

          {/* Map Grid Simulator (Stunning visual effect using pure HTML/CSS) */}
          <div className="h-44 w-full bg-white/[0.01] border border-white/[0.05] rounded-xl relative overflow-hidden flex items-center justify-center p-4">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px]"></div>
            
            {/* Network Node Dots */}
            <span className="absolute top-[25%] left-[30%] w-2 h-2 bg-[#ff8a00] rounded-full glow-dot text-[#ff8a00]"></span>
            <span className="absolute top-[40%] left-[65%] w-2 h-2 bg-indigo-500 rounded-full glow-dot text-indigo-400"></span>
            <span className="absolute bottom-[35%] left-[15%] w-1.5 h-1.5 bg-emerald-400 rounded-full glow-dot text-emerald-400 animate-pulse"></span>
            <span className="absolute bottom-[20%] left-[50%] w-2 h-2 bg-[#ff8a00] rounded-full glow-dot text-[#ff8a00]"></span>
            <span className="absolute top-[60%] left-[80%] w-1.5 h-1.5 bg-rose-400 rounded-full glow-dot text-rose-400 animate-pulse"></span>

            {/* Scanning Laser Line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ff8a00]/30 to-transparent animate-[scan_4s_linear_infinite]" style={{
              animation: 'scan 4s linear infinite',
            }}></div>
            <style>{`
              @keyframes scan {
                0% { transform: translateY(0); }
                50% { transform: translateY(174px); }
                100% { transform: translateY(0); }
              }
            `}</style>

            {/* Dynamic Telemetry Log Feed Overlay */}
            <div className="absolute bottom-2 left-3 text-[9px] font-mono text-white/45 space-y-0.5">
              <div>&gt; READY_FOR_REGISTRATION_SESSION</div>
              <div>&gt; AWAITING SECURE OPERATOR UPLINK...</div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-lg">
              <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase">Network Load</p>
              <p className="text-lg font-mono font-bold text-white mt-1">{networkLoad}%</p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-lg">
              <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase">Active Depots</p>
              <p className="text-lg font-mono font-bold text-[#ff8a00] mt-1">{activeNodes}</p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-lg">
              <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase">Cargo In-Transit</p>
              <p className="text-lg font-mono font-bold text-[#e6e1e2] mt-1">{(inTransitCargo / 1000).toFixed(1)}k T</p>
            </div>
          </div>
        </div>

        {/* Footer info in left panel */}
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-white/30">
          <span>TransitOps v4.8.0</span>
          <span>Security Protocol L-3</span>
        </div>
      </div>

      {/* RIGHT PANEL: Interactive Registration Form */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center items-center px-6 py-12 z-10 relative overflow-y-auto min-h-screen">
        <div className="w-full max-w-[500px] space-y-5 my-auto">

          {/* Mobile logo branding */}
          <div className="flex flex-col items-center lg:hidden mb-4 space-y-1.5">
            <div className="w-12 h-12 bg-gradient-to-br from-[#ff8a00] to-[#e07b00] rounded-xl flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-[#0B0B0D] text-[28px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_shipping
              </span>
            </div>
            <h1 className="font-headline text-2xl font-black text-white">TransitOps</h1>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#ff8a00]">Command Infrastructure</p>
          </div>

          <div className="space-y-1 text-center lg:text-left">
            <h2 className="text-2xl font-extrabold tracking-tight text-white">Initialize Profile</h2>
            <p className="text-xs text-on-surface-variant/70">Create a new cryptographic node access profile</p>
          </div>

          {/* Error and Success Notices */}
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl flex items-start gap-3 text-xs animate-shake">
              <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error_outline</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-start gap-3 text-xs">
              <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">verified_user</span>
              <span>{success}</span>
            </div>
          )}

          {/* Frosted Glass registration form card */}
          <div className="glass-card p-6 md:p-8 rounded-2xl space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Names row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-on-surface-variant/80" htmlFor="firstName">First Name</label>
                  <input 
                    className="input-field w-full h-11 px-4 rounded-lg text-xs" 
                    id="firstName" 
                    placeholder="John" 
                    required 
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-on-surface-variant/80" htmlFor="lastName">Last Name</label>
                  <input 
                    className="input-field w-full h-11 px-4 rounded-lg text-xs" 
                    id="lastName" 
                    placeholder="Doe" 
                    required 
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase tracking-wider font-bold text-on-surface-variant/80" htmlFor="email">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/75 text-[18px]">mail</span>
                  <input 
                    className="input-field w-full h-11 pl-11 pr-4 rounded-lg text-xs" 
                    id="email" 
                    placeholder="operator@transitops.in" 
                    required 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Role cards block (Beautiful interactive buttons grid instead of native select dropdown) */}
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-wider font-bold text-on-surface-variant/80">Requested Role Clearance</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button" 
                    onClick={() => setRole('ROLE_FLEET_MANAGER')}
                    className={`role-btn p-3 rounded-lg flex flex-col items-center gap-1 text-center cursor-pointer ${role === 'ROLE_FLEET_MANAGER' ? 'active' : ''}`}
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#ff8a00]">local_shipping</span>
                    <span className="text-[9px] font-bold">Fleet Manager</span>
                  </button>

                  <button 
                    type="button" 
                    onClick={() => setRole('ROLE_DRIVER')}
                    className={`role-btn p-3 rounded-lg flex flex-col items-center gap-1 text-center cursor-pointer ${role === 'ROLE_DRIVER' ? 'active' : ''}`}
                  >
                    <span className="material-symbols-outlined text-[18px] text-cyan-400">route</span>
                    <span className="text-[9px] font-bold">Dispatcher</span>
                  </button>

                  <button 
                    type="button" 
                    onClick={() => setRole('ROLE_SAFETY_OFFICER')}
                    className={`role-btn p-3 rounded-lg flex flex-col items-center gap-1 text-center cursor-pointer ${role === 'ROLE_SAFETY_OFFICER' ? 'active' : ''}`}
                  >
                    <span className="material-symbols-outlined text-[18px] text-emerald-400">gavel</span>
                    <span className="text-[9px] font-bold">Safety Officer</span>
                  </button>

                  <button 
                    type="button" 
                    onClick={() => setRole('ROLE_FINANCIAL_ANALYST')}
                    className={`role-btn p-3 rounded-lg flex flex-col items-center gap-1 text-center cursor-pointer ${role === 'ROLE_FINANCIAL_ANALYST' ? 'active' : ''}`}
                  >
                    <span className="material-symbols-outlined text-[18px] text-purple-400">analytics</span>
                    <span className="text-[9px] font-bold">Financial Analyst</span>
                  </button>
                </div>
              </div>

              {/* Passwords row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-on-surface-variant/80" htmlFor="password">Security Password</label>
                  <input 
                    className="input-field w-full h-11 px-4 rounded-lg text-xs" 
                    id="password" 
                    placeholder="••••••••" 
                    required 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-on-surface-variant/80" htmlFor="confirmPassword">Confirm Password</label>
                  <input 
                    className="input-field w-full h-11 px-4 rounded-lg text-xs" 
                    id="confirmPassword" 
                    placeholder="••••••••" 
                    required 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Submit Sign Up */}
              <button 
                className="w-full h-11 rounded-lg font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-[#ff8a00] to-[#f47c00] hover:opacity-95 text-black hover:shadow-lg hover:shadow-orange-500/10 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer text-xs mt-2" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                    <span>Compiling Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Compile Clearance Profile</span>
                    <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2 text-xs font-semibold text-on-surface-variant/70">
              Already have an account?{' '}
              <Link to="/login" className="text-[#ff8a00] hover:underline">
                Sign In
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Register;
