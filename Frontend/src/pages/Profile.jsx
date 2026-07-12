import { useState, useEffect } from 'react';
import Header from '../components/Header';
import api from '../services/api';
import useAuth from '../hooks/useAuth';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256'
];

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Role display label mapping
  const getRoleLabel = (roleKey) => {
    switch (roleKey) {
      case 'ROLE_FLEET_MANAGER': return 'Fleet Manager';
      case 'ROLE_DRIVER': return 'Dispatcher';
      case 'ROLE_SAFETY_OFFICER': return 'Safety Officer';
      case 'ROLE_FINANCIAL_ANALYST': return 'Financial Analyst';
      default: return 'Operator';
    }
  };

  // Role display color badges
  const getRoleBadgeStyle = (roleKey) => {
    switch (roleKey) {
      case 'ROLE_FLEET_MANAGER': return 'bg-[#ff8a00]/15 text-[#ff8a00] border-[#ff8a00]/30';
      case 'ROLE_DRIVER': return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 'ROLE_SAFETY_OFFICER': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'ROLE_FINANCIAL_ANALYST': return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      default: return 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30';
    }
  };

  // Get accessible modules lists
  const getAccessibleModules = (roleKey) => {
    switch (roleKey) {
      case 'ROLE_FLEET_MANAGER': return ['Dashboard', 'Fleet Registry', 'Maintenance Operations', 'System Settings'];
      case 'ROLE_DRIVER': return ['Dashboard', 'Trips Dispatch', 'Drivers Roster'];
      case 'ROLE_SAFETY_OFFICER': return ['Dashboard', 'Drivers Roster', 'Compliance Reports'];
      case 'ROLE_FINANCIAL_ANALYST': return ['Dashboard', 'Fuel Logbook', 'Expenses Command', 'Analytics Hub'];
      default: return ['Dashboard'];
    }
  };

  // Load profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      // 1. First populate from auth context / local storage
      if (user) {
        setFirstName(user.firstName || '');
        setLastName(user.lastName || '');
        setEmail(user.email || '');
        if (user.avatar) setSelectedAvatar(user.avatar);
      }

      // 2. Fetch fresh profile from backend API to sync
      try {
        const response = await api.get('/auth/me');
        if (response.data) {
          const apiUser = response.data;
          // email is backend username
          setEmail(apiUser.email || '');
          
          // Try to split email for placeholder names if empty
          if (!firstName) {
            const parts = (apiUser.email || '').split('@')[0].split('.');
            setFirstName(parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'Operator');
            setLastName(parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '');
          }
        }
      } catch (err) {
        console.warn("Backend profile sync unavailable, running in offline sandbox:", err.message);
      }
    };

    loadProfile();
  }, [user]);

  // Form submit handler
  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    // Simulate saving changes
    setTimeout(() => {
      try {
        const updatedDetails = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          avatar: selectedAvatar
        };

        // Update local session
        updateUser(updatedDetails);
        
        setSuccessMsg('Profile changes saved successfully to local command hub.');
      } catch (err) {
        setErrorMsg('Error committing details to memory storage.');
      } finally {
        setIsLoading(false);
      }
    }, 800);
  };

  // Custom avatar submit
  const handleApplyCustomAvatar = (e) => {
    e.preventDefault();
    if (customAvatarUrl.trim()) {
      setSelectedAvatar(customAvatarUrl.trim());
      setShowAvatarSelector(false);
      setCustomAvatarUrl('');
    }
  };

  const userRole = user?.role || 'ROLE_FLEET_MANAGER';
  const roleLabel = getRoleLabel(userRole);
  const badgeStyle = getRoleBadgeStyle(userRole);
  const modules = getAccessibleModules(userRole);

  return (
    <>
      <style>{`
        .glass-card {
          background: var(--bg-card);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-color);
          transition: all 250ms ease;
        }

        .avatar-glow {
          box-shadow: 0 0 20px rgba(255, 138, 0, 0.15);
        }

        .form-input {
          background-color: var(--bg-app);
          border: 1px solid var(--border-color);
          color: var(--color-text-primary);
          width: 100%;
          height: 42px;
          padding: 0 14px;
          border-radius: 8px;
          outline: none;
          transition: all 2.2s ease-in-out;
        }

        .form-input:focus {
          border-color: #ff8a00;
          box-shadow: 0 0 0 1px #ff8a00;
        }
      `}</style>

      <main className="ml-[260px] min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--color-text-secondary)] transition-all duration-200">
        <Header 
          title="Command Profile" 
          subtitle="Manage your operator credentials, avatar identifier, and node clearance"
        />

        <div className="p-6 space-y-6 flex-grow">
          
          {/* Alerts */}
          {successMsg && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-sm flex items-center gap-3 animate-fade-in">
              <span className="material-symbols-outlined">check_circle</span>
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-error-container/20 border border-error/50 text-error rounded-lg text-sm flex items-center gap-3 animate-fade-in">
              <span className="material-symbols-outlined">error_outline</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN: Hero Panel (Avatar Selection & Metadata) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-card p-6 rounded-xl border border-[var(--border-color)] flex flex-col items-center text-center relative overflow-hidden">
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#ff8a00]"></div>
                
                {/* Avatar container */}
                <div className="relative group mt-4">
                  <div className="w-28 h-28 rounded-full border-2 border-[var(--border-color)] overflow-hidden avatar-glow">
                    <img 
                      src={selectedAvatar} 
                      alt="Avatar ID" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button 
                    onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-[#ff8a00] hover:bg-[#ff8a00]/90 text-black rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-transform"
                    title="Change Avatar"
                  >
                    <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                  </button>
                </div>

                {/* Name and Role Info */}
                <div className="mt-5 space-y-2">
                  <h3 className="text-xl font-bold text-on-surface">
                    {firstName || lastName ? `${firstName} ${lastName}` : 'Operator Identity'}
                  </h3>
                  <p className="text-xs text-on-surface-variant font-medium">{email}</p>
                  
                  <div className="pt-2 flex justify-center">
                    <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border ${badgeStyle}`}>
                      {roleLabel}
                    </span>
                  </div>
                </div>

                {/* Avatar selector modal-like dropdown inline */}
                {showAvatarSelector && (
                  <div className="mt-6 p-4 border-t border-[var(--border-color)] w-full space-y-4 animate-fade-in bg-[var(--bg-app)]/80 rounded-lg">
                    <p className="text-xs font-semibold text-[var(--color-text-muted)]">Select Registry Avatar:</p>
                    <div className="flex justify-center gap-3">
                      {AVATAR_OPTIONS.map((imgUrl, i) => (
                        <button 
                          key={i} 
                          onClick={() => setSelectedAvatar(imgUrl)}
                          className={`w-10 h-10 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${selectedAvatar === imgUrl ? 'border-[#ff8a00] scale-105' : 'border-[var(--border-color)] hover:border-on-surface-variant'}`}
                        >
                          <img src={imgUrl} alt={`Option ${i+1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>

                    <form onSubmit={handleApplyCustomAvatar} className="space-y-2 pt-2 border-t border-[var(--border-color)]/50">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] text-left">Or Paste Image URL:</p>
                      <div className="flex gap-2">
                        <input 
                          type="url" 
                          placeholder="https://..." 
                          className="form-input text-xs flex-grow h-8"
                          value={customAvatarUrl}
                          onChange={(e) => setCustomAvatarUrl(e.target.value)}
                        />
                        <button type="submit" className="bg-[#ff8a00] text-black text-xs font-bold px-3 rounded-lg hover:opacity-90 active:scale-95 transition-all">
                          Apply
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Registry Metadata statistics card */}
                <div className="w-full mt-8 border-t border-[var(--border-color)]/60 pt-5 text-left space-y-3.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/50">Registry Details</h4>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant/70">Clearance Status</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active Node
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant/70">Terminal Location</span>
                    <span className="text-on-surface font-semibold">Hub Delta-4 (HQ)</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant/70">Security Protocol</span>
                    <span className="text-[#ff8a00] font-mono font-bold uppercase">SHA-256 ENA</span>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT COLUMN: Profile details form & Clearance overview */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Form editing card */}
              <div className="glass-card p-6 rounded-xl border border-[var(--border-color)]">
                <h3 className="text-base font-bold border-b border-[var(--border-color)] pb-3.5 flex items-center gap-2 text-[var(--color-text-primary)]">
                  <span className="material-symbols-outlined text-[#ff8a00]">manage_accounts</span>
                  Credentials Registry
                </h3>
                
                <form onSubmit={handleSave} className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">First Name</label>
                      <input 
                        type="text" 
                        required
                        className="form-input" 
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">Last Name</label>
                      <input 
                        type="text" 
                        required
                        className="form-input" 
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">Email Identifier</label>
                    <input 
                      type="email" 
                      required
                      className="form-input" 
                      placeholder="john.doe@transitops.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="bg-[#ff8a00] text-black font-bold text-sm px-6 py-2.5 rounded-lg hover:opacity-90 active:scale-98 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                          <span>Committing...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">save</span>
                          <span>Save Credentials</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Security Scope summary card */}
              <div className="glass-card p-6 rounded-xl border border-[var(--border-color)] space-y-4">
                <h3 className="text-base font-bold border-b border-[var(--border-color)] pb-3 flex items-center gap-2 text-[var(--color-text-primary)]">
                  <span className="material-symbols-outlined text-[#ff8a00]">security</span>
                  Role Permissions Authorization
                </h3>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Your profile has clearance to access the following ERP modules based on your role: <span className="font-bold text-[var(--color-text-primary)]">{roleLabel}</span>.
                </p>

                {/* Modules pills grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {modules.map((mod, idx) => (
                    <div 
                      key={idx} 
                      className="bg-[var(--bg-card)] border border-[var(--border-color)] px-3.5 py-3 rounded-lg flex items-center gap-2 text-xs font-semibold text-[var(--color-text-primary)] hover:border-[#ff8a00]/40 transition-colors animate-fade-in"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff8a00]"></span>
                      <span>{mod}</span>
                    </div>
                  ))}
                </div>

                {/* Security details note banner */}
                <div className="bg-[var(--bg-app)] p-4 rounded-lg border border-[var(--border-color)] flex items-start gap-3 mt-4 text-xs text-[var(--color-text-secondary)]">
                  <span className="material-symbols-outlined text-[#ff8a00] text-[20px] shrink-0 mt-0.5">info</span>
                  <div>
                    <p className="font-bold text-[var(--color-text-primary)]">Need a role change?</p>
                    <p className="mt-0.5 leading-relaxed">
                      Role clearances are governed by Active Directory domain security policies. Please contact the Operations Admin to escalate permissions or request new module additions.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>
    </>
  );
};

export default Profile;
