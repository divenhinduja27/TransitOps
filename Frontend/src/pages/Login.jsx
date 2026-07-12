import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { ROUTES } from '../utils/constants';
import { authenticateLocalUser } from '../utils/authDb';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
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

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setInfoMessage('');

    try {
      // 1. Prioritize authenticating via live Spring Boot backend API
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password: password
      });

      const { accessToken, roles, firstName, lastName } = response.data;
      const userRole = roles && roles.length > 0 ? roles[0] : 'ROLE_DRIVER';
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify({
        email: email.trim(),
        role: userRole,
        firstName: firstName || email.split('@')[0],
        lastName: lastName || ''
      }));

      setInfoMessage('API connection authenticated. Synced with database cluster.');
      setTimeout(() => navigate(ROUTES.DASHBOARD), 800);
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || err.response.data || 'Invalid credentials');
        setIsLoading(false);
        return;
      }

      console.warn("Backend auth offline or invalid credentials, checking virtual secure sandbox:", err.message);

      // 2. Fallback to Local Virtual Database in LocalStorage
      setTimeout(() => {
        setIsLoading(false);
        const result = authenticateLocalUser(email, password);
        
        if (result.success) {
          localStorage.setItem('token', 'mock-transitops-erp-token');
          localStorage.setItem('user', JSON.stringify({
            email: result.user.email,
            role: result.user.role,
            firstName: result.user.firstName,
            lastName: result.user.lastName
          }));
          
          setInfoMessage('Secure Sandbox Session authorized. Virtual database linked.');
          setTimeout(() => navigate(ROUTES.DASHBOARD), 1000);
        } else {
          setError('Invalid credentials');
        }
      }, 600);
      return;
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[var(--bg-app)] text-[var(--color-text-secondary)] font-sans overflow-x-hidden w-full relative transition-all duration-250">
      <style>{`
        .glass-card {
          background: var(--bg-card);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border-color);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
          transition: all 250ms ease;
        }

        .input-field {
          background-color: var(--bg-app);
          border: 1px solid var(--border-color);
          color: var(--color-text-primary);
          transition: all 0.25s ease-in-out;
        }

        .input-field:focus {
          border-color: #ff8a00;
          box-shadow: 0 0 10px rgba(255, 138, 0, 0.15);
          outline: none;
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
      <div className="gradient-bg w-[400px] h-[400px] bg-indigo-600/5 -top-40 -left-40"></div>
      <div className="gradient-bg w-[500px] h-[500px] bg-amber-500/5 -bottom-40 -right-40"></div>

      {/* LEFT PANEL: Live Logistics Telemetry Map/Command Console */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 select-none relative border-r border-[var(--border-color)] bg-[var(--bg-sidebar)] transition-all duration-250">
        
        {/* Header Branding */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-[#ff8a00] to-[#e07b00] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/15">
            <span className="material-symbols-outlined text-black text-[26px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_shipping
            </span>
          </div>
          <div>
            <h1 className="font-headline text-xl font-extrabold tracking-tight text-[var(--color-text-primary)] leading-none">TransitOps</h1>
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
            <h2 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight leading-snug">
              Global Logistics Network Terminal
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] max-w-sm leading-relaxed">
              Real-time synchronization with active vehicle nodes, fuel allocation registries, and routing analytics.
            </p>
          </div>

          {/* Map Grid Simulator (Stunning visual effect using pure HTML/CSS) */}
          <div className="h-44 w-full bg-[var(--bg-app)] border border-[var(--border-color)] rounded-xl relative overflow-hidden flex items-center justify-center p-4">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(128,128,128,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(128,128,128,0.03)_1px,transparent_1px)] bg-[size:16px_16px]"></div>
            
            {/* Network Node Dots */}
            <span className="absolute top-[25%] left-[30%] w-2 h-2 bg-[#ff8a00] rounded-full glow-dot text-[#ff8a00]"></span>
            <span className="absolute top-[40%] left-[65%] w-2 h-2 bg-indigo-500 rounded-full glow-dot text-indigo-400"></span>
            <span className="absolute bottom-[35%] left-[15%] w-1.5 h-1.5 bg-emerald-400 rounded-full glow-dot text-emerald-400 animate-pulse"></span>
            <span className="absolute bottom-[20%] left-[50%] w-2 h-2 bg-[#ff8a00] rounded-full glow-dot text-[#ff8a00]"></span>
            <span className="absolute top-[60%] left-[80%] w-1.5 h-1.5 bg-rose-400 rounded-full glow-dot text-rose-400 animate-pulse"></span>

            {/* Scanning Laser Line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ff8a00]/30 to-transparent" style={{
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
            <div className="absolute bottom-2 left-3 text-[9px] font-mono text-[var(--color-text-muted)] space-y-0.5">
              <div>&gt; CONNECT_SUITE_ESTABLISHED</div>
              <div>&gt; SCANNING DEPOT_NODE_ALPHA... ACTIVE</div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-3 rounded-lg">
              <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase">Network Load</p>
              <p className="text-lg font-mono font-bold text-[var(--color-text-primary)] mt-1">{networkLoad}%</p>
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-3 rounded-lg">
              <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase">Active Depots</p>
              <p className="text-lg font-mono font-bold text-[#ff8a00] mt-1">{activeNodes}</p>
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-3 rounded-lg">
              <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase">Cargo In-Transit</p>
              <p className="text-lg font-mono font-bold text-[var(--color-text-primary)] mt-1">{(inTransitCargo / 1000).toFixed(1)}k T</p>
            </div>
          </div>
        </div>

        {/* Footer info in left panel */}
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]/50">
          <span>TransitOps v4.8.0</span>
          <span>Security Protocol L-3</span>
        </div>
      </div>

      {/* RIGHT PANEL: Interactive Form Arena */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center items-center px-6 py-12 z-10 relative overflow-y-auto min-h-screen">
        <div className="w-full max-w-[460px] space-y-6">

          {/* Mobile logo branding */}
          <div className="flex flex-col items-center lg:hidden mb-4 space-y-1.5">
            <div className="w-12 h-12 bg-gradient-to-br from-[#ff8a00] to-[#e07b00] rounded-xl flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-[#0B0B0D] text-[28px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_shipping
              </span>
            </div>
            <h1 className="font-headline text-2xl font-black text-[var(--color-text-primary)]">TransitOps</h1>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#ff8a00]">Command Infrastructure</p>
          </div>

          <div className="space-y-1.5 text-center lg:text-left">
            <h2 className="text-2xl font-extrabold tracking-tight text-[var(--color-text-primary)]">Access Gateway</h2>
            <p className="text-xs text-[var(--color-text-muted)]">Secure authentication credentials required</p>
          </div>

          {/* Error and Info Notices */}
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl flex items-start gap-3 text-xs animate-shake">
              <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error_outline</span>
              <span>{error}</span>
            </div>
          )}

          {infoMessage && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-start gap-3 text-xs">
              <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">verified_user</span>
              <span>{infoMessage}</span>
            </div>
          )}

          {/* Frosted Glass login form card */}
          <div className="glass-card p-8 rounded-2xl space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase tracking-wider font-bold text-[var(--color-text-muted)]" htmlFor="email">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-[18px]">mail</span>
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

              {/* Password Key */}
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase tracking-wider font-bold text-[var(--color-text-muted)]" htmlFor="password">Security Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-[18px]">lock</span>
                  <input 
                    className="input-field w-full h-11 pl-11 pr-11 rounded-lg text-xs" 
                    id="password" 
                    placeholder="••••••••" 
                    required 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]" onClick={togglePassword} type="button">
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember checkbox */}
              <div className="flex items-center justify-between text-[11px] font-semibold pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[var(--border-color)] bg-[var(--bg-app)] text-[#ff8a00] focus:ring-0 cursor-pointer"
                  />
                  <span>Remember Gateway</span>
                </label>
                <a href="#forgot" className="text-indigo-400 hover:text-indigo-300 transition-colors" onClick={(e) => { e.preventDefault(); alert("Access recovery requires operator key validation. Please request your system administrator."); }}>
                  Recover Key?
                </a>
              </div>

              {/* Submit Sign In */}
              <button 
                className="w-full h-11 rounded-lg font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-[#ff8a00] to-[#f47c00] hover:opacity-95 text-black hover:shadow-lg hover:shadow-orange-500/10 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer text-xs mt-2" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                    <span>Validating Clearance...</span>
                  </>
                ) : (
                  <>
                    <span>Initialize Session</span>
                    <span className="material-symbols-outlined text-[16px]">login</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2 text-xs font-semibold text-[var(--color-text-muted)]">
              New node operator?{' '}
              <Link to="/register" className="text-[#ff8a00] hover:underline">
                Create Account
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Login;
