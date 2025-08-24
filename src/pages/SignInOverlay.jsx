import React, { useState } from 'react';

// A helper component for the authentication buttons (remains unchanged)
const AuthButton = ({ className, icon, text, onClick }) => {
  const baseClasses = "group flex items-center justify-center w-full gap-[15px] rounded-xl border border-border bg-background py-[14px] px-5 font-semibold text-[1.1em] text-text transition-all duration-200 ease-in-out cursor-pointer";
  const interactiveClasses = "hover:border-primary hover:bg-primary/10 hover:-translate-y-0.5 hover:shadow-[0_6px_15px_rgba(var(--primary-rgb),0.2)] focus-visible:outline-none focus-visible:border-primary focus-visible:bg-primary/15 focus-visible:shadow-[0_0_0_3px_rgba(var(--primary-rgb),0.5)]";
  const iconClasses = `w-7 h-7 flex-shrink-0 transition-colors duration-200 ease-in-out ${className.includes('email') ? 'stroke-primary group-hover:stroke-primary' : 'fill-primary group-hover:fill-primary'}`;
  return (
    <button className={`${baseClasses} ${interactiveClasses} ${className}`} onClick={onClick}>
      {React.cloneElement(icon, { className: iconClasses })}
      <span>{text}</span>
    </button>
  );
};

function SignInOverlay({ onClose, onLoginSuccess }) {
  // State Management
  const [view, setView] = useState('initial');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  // API URL
  const API_URL = 'http://localhost:3001/api';

  // --- Handlers ---
  const handleViewChange = (newView) => {
    setView(newView);
    setError('');
    setSuccess('');
    setIsOtpSent(false);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      setSuccess(data.message);
      setIsOtpSent(true);
    } catch (err) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, otp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setSuccess(data.message);
      setTimeout(() => { // Switch to sign-in view after a delay
          handleViewChange('emailSignIn');
          setPassword(''); // Clear password field for login
      }, 2000);
    } catch (err) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogin = async (e) => {
      e.preventDefault();
      setError('');
      setSuccess('');
      setIsLoading(true);
      try {
          const response = await fetch(`${API_URL}/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.message);

          setSuccess(data.message);
          onLoginSuccess(email); // Pass email to parent component
      } catch (err) {
          setError(err.message || 'An error occurred.');
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex h-screen w-screen items-center justify-center bg-black/30 backdrop-blur-lg animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-[90%] max-w-[380px] rounded-lg bg-[rgba(73,66,85,0.4)] py-[30px] px-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.4)] ring-1 ring-border animate-slideIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- Feedback Messages --- */}
        {error && <p className="mb-4 rounded-md bg-red-500/30 p-2 text-sm text-red-200">{error}</p>}
        {success && <p className="mb-4 rounded-md bg-green-500/30 p-2 text-sm text-green-200">{success}</p>}

        {view === 'initial' && (
          <div className="flex flex-col gap-[15px] animate-fadeIn" key="auth-options">
             <AuthButton
              className="google"
              icon={<svg viewBox="0 0 24 24"><path d="M12.24 10.285V11.69h4.225c-.182 1.09-.775 2.053-1.775 2.716-.99.663-2.31 1.04-3.75 1.04-3.45 0-6.25-2.8-6.25-6.25s2.8-6.25 6.25-6.25c1.85 0 3.45.79 4.6 1.89l2.2-2.2c-1.5-1.4-3.5-2.2-5.8-2.2-4.95 0-9 4.05-9 9s4.05 9 9 9c4.95 0 8.5-3.5 8.5-8.75 0-.58-.06-1.14-.16-1.68h-8.34z"/></svg>}
              text="Continue with Google"
            />
            <AuthButton
              className="email"
              icon={<svg fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>}
              text="Continue with Email"
              onClick={() => handleViewChange('emailSignIn')}
            />
            <p className="mt-5 text-[0.85em] leading-snug text-text-secondary"></p>
            <p className="mt-2 text-[0.95em] leading-snug text-text-secondary">
              New to MaXFinder?{' '}
              <button className="font-semibold text-primary underline-offset-2 hover:underline" onClick={() => handleViewChange('signUp')}>SignUp</button>
            </p>
          </div>
        )}

        {view === 'emailSignIn' && (
          <form onSubmit={handleLogin} className="flex flex-col gap-5 animate-fadeIn" key="email-form">
            <input type="email" placeholder="yourname@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-lg border border-border bg-background py-[12px] px-5 text-[1.1em] text-text transition-all duration-200 ease-in-out placeholder:text-text-secondary placeholder:opacity-70 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/30" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-lg border border-border bg-background py-[12px] px-5 text-[1.1em] text-text transition-all duration-200 ease-in-out placeholder:text-text-secondary placeholder:opacity-70 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/30" />
            <div className="flex w-full justify-between gap-[15px]">
              <button type="button" className="flex-1 rounded-xl border border-border bg-[rgba(73,66,85,0.8)] py-[14px] px-5 font-semibold text-[1.1em] text-text-secondary transition-all hover:-translate-y-0.5 hover:border-text-secondary focus:outline-none" onClick={() => handleViewChange('initial')}>Back</button>
              <button type="submit" disabled={isLoading} className="flex-1 rounded-xl border-none bg-primary/70 py-[14px] px-5 font-semibold text-[1.1em] text-background transition-all hover:-translate-y-0.5 hover:bg-primary/[.9] disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? 'Signing In...' : 'Confirm'}
              </button>
            </div>
          </form>
        )}

        {view === 'signUp' && (
          <form onSubmit={handleRegister} className="flex flex-col gap-4 animate-fadeIn" key="signup-form">
            <input type="email" placeholder="yourname@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required readOnly={isOtpSent} className="w-full rounded-lg border border-border bg-background py-[12px] px-5 text-[1.1em] text-text read-only:bg-gray-700/50" />
            <input type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required readOnly={isOtpSent} className="w-full rounded-lg border border-border bg-background py-[12px] px-5 text-[1.1em] text-text read-only:bg-gray-700/50"/>
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required readOnly={isOtpSent} className="w-full rounded-lg border border-border bg-background py-[12px] px-5 text-[1.1em] text-text read-only:bg-gray-700/50"/>
            
            <div className="flex w-full items-center gap-[15px]">
                <button type="button" onClick={handleSendOtp} disabled={isLoading || isOtpSent} className="flex-shrink-0 rounded-xl border border-primary bg-primary/20 py-[8px] px-4 font-semibold text-[1em] text-primary transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? 'Sending...' : isOtpSent ? 'OTP Sent' : 'Send OTP'}
                </button>
                <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required disabled={!isOtpSent} className="flex-grow w-full rounded-lg border border-border bg-background py-[8px] px-5 text-[1.1em] text-text disabled:bg-gray-700/50" />
            </div>
            
            <div className="flex w-full justify-between gap-[15px] mt-2">
              <button type="button" className="flex-1 rounded-xl border border-border bg-[rgba(73,66,85,0.8)] py-[14px] px-5 font-semibold text-[1.1em] text-text-secondary transition-all hover:-translate-y-0.5 hover:border-text-secondary focus:outline-none" onClick={() => handleViewChange('initial')}>Back</button>
              <button type="submit" disabled={isLoading || !isOtpSent} className="flex-1 rounded-xl border-none bg-primary/70 py-[14px] px-5 font-semibold text-[1.1em] text-background transition-all hover:-translate-y-0.5 hover:bg-primary/[.9] disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? 'Registering...' : 'Confirm'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default SignInOverlay;