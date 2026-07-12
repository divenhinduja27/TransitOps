import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('manager');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth transition to dashboard
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative bg-[#111111] text-[#f3dfd1] font-sans overflow-hidden w-full">
      {/* Inline styles for local effects */}
      <style>{`
        .login-card {
            background-color: #1E1E1E;
            border: 1px solid #2E2E2E;
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .input-field {
            background-color: #161616;
            border: 1px solid #2E2E2E;
            transition: all 0.2s ease-in-out;
        }

        .input-field:focus {
            border-color: #ff8a00;
            outline: none;
            box-shadow: 0 0 0 1px #ff8a00;
        }

        .btn-primary {
            background-color: #ff8a00;
            transition: transform 0.1s active, opacity 0.2s;
        }
        .btn-primary:active {
            transform: scale(0.98);
        }

        .glow {
            position: absolute;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(255, 138, 0, 0.05) 0%, rgba(17, 17, 17, 0) 70%);
            border-radius: 50%;
            z-index: 0;
            pointer-events: none;
        }
      `}</style>

      {/* Atmospheric Background Elements */}
      <div className="glow top-[-10%] left-[-10%]"></div>
      <div className="glow bottom-[-10%] right-[-10%]"></div>

      <main className="w-full max-w-[420px] px-6 z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-10 space-y-2">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#ff8a00] text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
            <h1 className="font-headline-md text-headline-md font-extrabold tracking-tight text-on-surface">TransitOps</h1>
          </div>
          <p className="font-label-md text-label-md uppercase tracking-[0.2em] text-on-surface-variant/60">Logistics Command Center</p>
        </div>

        {/* Login Card */}
        <div className="login-card p-8 rounded-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Role Selector (RBAC) */}
            <div className="space-y-2">
              <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="role">Access Level</label>
              <div className="relative">
                <select 
                  className="input-field w-full h-12 px-4 rounded-lg font-body-md text-on-surface appearance-none cursor-pointer" 
                  id="role" 
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="manager">Manager</option>
                  <option value="dispatcher">Dispatcher</option>
                  <option value="driver">Driver</option>
                  <option value="admin">System Administrator</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="email">Corporate Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">alternate_email</span>
                <input 
                  className="input-field w-full h-12 pl-12 pr-4 rounded-lg font-body-md text-on-surface placeholder:text-on-surface-variant/30" 
                  id="email" 
                  name="email" 
                  placeholder="name@transitops.com" 
                  required 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="password">Security Key</label>
                <a className="font-label-sm text-label-sm text-[#ff8a00] hover:underline" href="#">Forgot?</a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">lock</span>
                <input 
                  className="input-field w-full h-12 pl-12 pr-12 rounded-lg font-body-md text-on-surface placeholder:text-on-surface-variant/30" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  required 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface" onClick={togglePassword} type="button">
                  <span className="material-symbols-outlined text-[20px]" id="eyeIcon">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3">
              <input 
                className="w-4 h-4 rounded border-[#2E2E2E] bg-[#161616] text-[#ff8a00] focus:ring-0 focus:ring-offset-0" 
                id="remember" 
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label className="font-body-sm text-body-sm text-on-surface-variant select-none" htmlFor="remember">Stay logged in for 24 hours</label>
            </div>

            {/* Submit Button */}
            <button 
              className="btn-primary w-full h-12 rounded-lg font-title-md text-title-md text-black font-bold flex items-center justify-center gap-2 hover:opacity-90 active:opacity-100 transition-all disabled:opacity-80" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Initialize Session</span>
                  <span className="material-symbols-outlined text-[20px]">login</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Info */}
        <footer className="mt-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-6">
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors" href="#">Privacy Protocol</a>
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors" href="#">Terminal Support</a>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant/40">TransitOps v4.2.0-stable | Logistics Command Infrastructure</p>
        </footer>
      </main>

      {/* Side Decoration (Hidden on small screens) */}
      <div className="hidden xl:block absolute right-12 top-1/2 -translate-y-1/2 w-80 space-y-6">
        <div className="p-6 rounded-lg border border-[#2E2E2E] bg-[#1A1A1A]/50 backdrop-blur-sm">
          <h3 className="font-title-md text-title-md text-[#ff8a00] mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">verified_user</span>
            System Status
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-body-sm text-on-surface-variant">Active Fleets</span>
              <span className="text-body-sm font-bold text-on-surface">1,204</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-body-sm text-on-surface-variant">Nodes Online</span>
              <span className="text-body-sm font-bold text-on-surface">99.98%</span>
            </div>
            <div className="w-full bg-[#111111] h-1 rounded-full mt-4 overflow-hidden">
              <div className="bg-[#ff8a00] h-full w-4/5"></div>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-lg border border-[#2E2E2E] bg-[#1A1A1A]/50 backdrop-blur-sm">
          <h3 className="font-title-md text-title-md text-on-surface mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">hub</span>
            Global Network
          </h3>
          <div className="aspect-video w-full rounded bg-[#111111] overflow-hidden relative">
            <div className="absolute inset-0 opacity-30 grayscale contrast-125">
              <div className="w-full h-full bg-[#111111] flex items-center justify-center text-xs text-on-surface-variant/40 border border-[#2E2E2E]">Map Visualization</div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <span className="material-symbols-outlined text-[#ff8a00] animate-pulse text-[32px]">sensors</span>
                <span className="font-label-sm text-label-sm mt-1 text-[#ff8a00]">SCANNING...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
