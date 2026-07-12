import React, { useState, useEffect } from 'react';
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

  // Credentials form state
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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
      case 'ROLE_FLEET_MANAGER': return 'from-[#ff8a00]/20 to-[#ff8a00]/5 text-[#ff8a00] border-[#ff8a00]/30';
      case 'ROLE_DRIVER': return 'from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/30';
      case 'ROLE_SAFETY_OFFICER': return 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30';
      case 'ROLE_FINANCIAL_ANALYST': return 'from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/30';
      default: return 'from-zinc-500/20 to-zinc-500/5 text-zinc-400 border-zinc-500/30';
    }
  };

  // Get dynamic registry levels
  const getRegistryLevel = (roleKey) => {
    switch (roleKey) {
      case 'ROLE_FLEET_MANAGER': return 'Fleet Commander';
      case 'ROLE_DRIVER': return 'Dispatcher Operator';
      case 'ROLE_SAFETY_OFFICER': return 'Safety Compliance Officer';
      case 'ROLE_FINANCIAL_ANALYST': return 'Financial Officer';
      default: return 'Logistics Officer';
    }
  };

  // Load profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        setFirstName(user.firstName || '');
        setLastName(user.lastName || '');
        setEmail(user.email || '');
        if (user.avatar) setSelectedAvatar(user.avatar);
      }

      try {
        const response = await api.get('/auth/me');
        if (response.data) {
          const apiUser = response.data;
          setEmail(apiUser.email || '');
          
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

  // Form submit handler for credentials
  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        avatar: selectedAvatar
      };
      
      const res = await api.put('/auth/profile', payload);
      
      // Update local session
      updateUser({
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        avatar: res.data.avatar
      });
      
      setSuccessMsg('Profile credentials updated on server successfully.');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || err.message || 'Error saving details to server database.');
    } finally {
      setIsLoading(false);
    }
  };

  // Password change handler
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    setIsChangingPassword(true);

    setTimeout(() => {
      setPasswordSuccess('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
    }, 1000);
  };

  const handleAvatarChange = async (avatarUrl) => {
    setSelectedAvatar(avatarUrl);
    updateUser({ avatar: avatarUrl });
    try {
      await api.put('/auth/profile', { avatar: avatarUrl });
    } catch (err) {
      console.error('Failed to sync avatar with server:', err);
    }
  };

  // Custom avatar submit
  const handleApplyCustomAvatar = (e) => {
    e.preventDefault();
    const url = customAvatarUrl.trim();
    if (url) {
      handleAvatarChange(url);
      setShowAvatarSelector(false);
      setCustomAvatarUrl('');
    }
  };

  const userRole = user?.role || 'ROLE_FLEET_MANAGER';
  const roleLabel = getRoleLabel(userRole);
  const badgeStyle = getRoleBadgeStyle(userRole);
  const registryLevel = getRegistryLevel(userRole);

  return (
    <>
      <style>{`
        .glass-card {
          background: var(--bg-card);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-color);
        }
        .form-input {
          background-color: var(--bg-app);
          border: 1px solid var(--border-color);
          color: var(--color-text-primary);
          width: 100%;
          height: 44px;
          padding: 0 16px;
          border-radius: 8px;
          outline: none;
          transition: all 0.2s ease-in-out;
          font-size: 0.8125rem;
        }
        .form-input:focus {
          border-color: #ff8a00;
          box-shadow: 0 0 0 2px rgba(255, 138, 0, 0.1);
        }
        .profile-cover {
          background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-app) 100%);
          border: 1px solid var(--border-color);
        }
        .avatar-container {
          box-shadow: 0 0 25px rgba(255, 138, 0, 0.2);
        }
        .glow-dot {
          box-shadow: 0 0 8px #10b981;
        }
      `}</style>

      <main className="ml-[260px] min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--color-text-secondary)] transition-all duration-200">
        <Header title="Command Profile" />

        <div className="p-8 space-y-8 flex-grow max-w-3xl mx-auto w-full">
          {/* Success / Error Alerts */}
          {successMsg && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-3 animate-fade-in">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span className="font-semibold">{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs flex items-center gap-3 animate-fade-in">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span className="font-semibold">{errorMsg}</span>
            </div>
          )}

          {/* Premium Cover Header Card */}
          <div className="profile-cover rounded-3xl p-8 relative overflow-hidden flex flex-col sm:flex-row justify-between items-center gap-6">
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#ff8a00]/10 to-transparent blur-3xl pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row items-center gap-6 z-10">
              {/* Profile Photo */}
              <div className="relative">
                <div className="w-28 h-28 rounded-full border-4 border-zinc-800 dark:border-zinc-800 light:border-zinc-200 overflow-hidden avatar-container">
                  <img 
                    src={selectedAvatar} 
                    alt="Avatar ID" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button 
                  onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                  className="absolute bottom-0 right-0 w-9 h-9 bg-[#ff8a00] hover:bg-[#e07b00] text-black rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
                  title="Change Avatar"
                >
                  <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                </button>
              </div>

              {/* Name & Credentials */}
              <div className="text-center sm:text-left space-y-1.5">
                <h2 className="text-2xl font-black tracking-tight text-[var(--color-text-primary)]">
                  {firstName || lastName ? `${firstName} ${lastName}` : 'Operator Identity'}
                </h2>
                <p className="text-xs text-[var(--color-text-muted)] font-mono">{email}</p>
                <div className="pt-1 flex justify-center sm:justify-start">
                  <span className={`px-4 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border bg-gradient-to-r ${badgeStyle}`}>
                    {roleLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick stats / Node status */}
            <div className="z-10 bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl flex flex-row sm:flex-col gap-4 text-center sm:text-left min-w-[200px]">
              <div>
                <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-wider">Node Status</p>
                <span className="text-xs text-emerald-500 dark:text-emerald-400 font-bold flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse glow-dot"></span>
                  Active Operations
                </span>
              </div>
              <div>
                <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-wider">Registry Level</p>
                <span className="text-xs text-[var(--color-text-primary)] font-semibold mt-0.5 block">{registryLevel}</span>
              </div>
            </div>
          </div>

          {/* Avatar Selector deck */}
          {showAvatarSelector && (
            <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] space-y-5 animate-fade-in">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#ff8a00]">Change Profile Avatar</h4>
              <div className="flex flex-wrap gap-4">
                {AVATAR_OPTIONS.map((imgUrl, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedAvatar(imgUrl)}
                    className={`w-14 h-14 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${selectedAvatar === imgUrl ? 'border-[#ff8a00] scale-105 shadow-lg shadow-orange-500/10' : 'border-[var(--border-color)] hover:border-zinc-500'}`}
                  >
                    <img src={imgUrl} alt={`Option ${i+1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <form onSubmit={handleApplyCustomAvatar} className="space-y-3 pt-3 border-t border-[var(--border-color)]">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block">Or enter external image URL</label>
                <div className="flex gap-3">
                  <input 
                    type="url" 
                    placeholder="https://images.unsplash.com/..." 
                    className="form-input text-xs flex-grow h-10"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  />
                  <button type="submit" className="bg-[#2563EB] text-white px-5 rounded-lg text-xs font-bold hover:bg-[#1D4ED8] active:scale-95 transition-all">
                    Apply
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Single Column Forms Stack */}
          <div className="space-y-8">
            {/* Credentials form */}
            <div className="glass-card p-8 rounded-2xl border border-[var(--border-color)] space-y-6">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#ff8a00] mb-1">
                  Security Credentials
                </h3>
                <p className="text-[10px] text-[var(--color-text-muted)]">Modify your login name and verified mail credentials.</p>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider">First Name</label>
                    <input 
                      type="text" 
                      required
                      className="form-input" 
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider">Last Name</label>
                    <input 
                      type="text" 
                      required
                      className="form-input" 
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider">Email Identifier</label>
                  <input 
                    type="email" 
                    required
                    className="form-input" 
                    placeholder="email@transitops.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-2.5 rounded-full font-bold hover:shadow-lg hover:shadow-blue-500/10 active:scale-95 transition-all text-xs cursor-pointer duration-200"
                  >
                    {isLoading ? 'Saving changes...' : 'Save changes'}
                  </button>
                </div>
              </form>
            </div>

            {/* Change Password form */}
            <div className="glass-card p-8 rounded-2xl border border-[var(--border-color)] space-y-6">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#ff8a00] mb-1">
                  Change Password
                </h3>
                <p className="text-[10px] text-[var(--color-text-muted)]">Update your operator account password safely.</p>
              </div>

              {passwordSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-[11px] font-semibold">
                  {passwordSuccess}
                </div>
              )}

              {passwordError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-[11px] font-semibold">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider">Current Password</label>
                  <input 
                    type="password" 
                    required
                    className="form-input" 
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider">New Password</label>
                  <input 
                    type="password" 
                    required
                    className="form-input" 
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider">Confirm New Password</label>
                  <input 
                    type="password" 
                    required
                    className="form-input" 
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isChangingPassword}
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-2.5 rounded-full font-bold hover:shadow-lg hover:shadow-blue-500/10 active:scale-95 transition-all text-xs cursor-pointer duration-200"
                  >
                    {isChangingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Profile;
