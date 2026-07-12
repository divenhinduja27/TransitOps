import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      if (username.trim() === 'admin' && password === 'pass') {
        localStorage.setItem('token', 'mock-transitops-erp-token');
        localStorage.setItem('user', JSON.stringify({ username: 'admin', role: 'Administrator' }));
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    }, 800);
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
          {error && (
            <div className="mb-6 p-4 bg-error-container/30 border border-error/50 text-error rounded-lg flex items-center gap-3 text-sm">
              <span className="material-symbols-outlined text-[20px]">error_outline</span>
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="space-y-2">
              <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="username">Username</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">person</span>
                <input 
                  className="input-field w-full h-12 pl-12 pr-4 rounded-lg font-body-md text-on-surface placeholder:text-on-surface-variant/30" 
                  id="username" 
                  name="username" 
                  placeholder="admin" 
                  required 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="password">Security Key</label>
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

            {/* Submit Button */}
            <button 
              className="btn-primary w-full h-12 rounded-lg font-title-md text-title-md text-black font-bold flex items-center justify-center gap-2 hover:opacity-90 active:opacity-100 transition-all disabled:opacity-80 cursor-pointer" 
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
          <p className="font-label-sm text-label-sm text-on-surface-variant/40">TransitOps v4.2.0-stable | Logistics Command Infrastructure</p>
        </footer>
      </main>
    </div>
  );
};

export default Login;
