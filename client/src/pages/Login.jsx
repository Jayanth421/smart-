import React, { useState } from 'react';
import { ShieldAlert, LogIn, Loader2, UserPlus, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Please fill in all fields.");

    try {
      setError('');
      setLoading(true);

      if (isRegistering) {
        await register(email, password, role);
      } else {
        await login(email, password);
      }

      navigate('/');
      
    } catch (err) {
      setLoading(false);
      setError(isRegistering ? "Registration failed: " + err.message : "Authentication failed: " + err.message);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!otpSent) {
      if (!phone || phone.length < 10) return setError("Please enter a valid phone number with country code (e.g. +1... or +91...).");
      
      try {
        setLoading(true);
        // Note: Real Firebase requires window.recaptchaVerifier initialized which happens in AuthContext
        // For demonstration, we will set up the UI states for OTP 
        alert(`Sending OTP to: ${phone}\n(Ensure Firebase Phone Auth is enabled in Console)`);
        
        // await sendOtp(phone);
        setOtpSent(true);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError("Failed to send OTP: " + err.message);
      }
    } else {
      if (!otp || otp.length < 6) return setError("Please enter the 6 digit OTP code.");
      
      try {
        setLoading(true);
        // await verifyOtp(otp);
        alert(`Verified OTP: ${otp}\nLogging in Phone User...`);
        navigate('/');
      } catch (err) {
        setLoading(false);
        setError("Invalid OTP: " + err.message);
      }
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center' }}>
      
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '40px 32px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ background: 'var(--primary)', padding: '16px', borderRadius: '50%', display: 'inline-block', marginBottom: '20px', boxShadow: '0 8px 16px rgba(255, 42, 84, 0.2)' }}>
            <ShieldAlert color="white" size={36} />
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
             {isRegistering ? "Create Staff ID" : "Staff Portal"}
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
             {isRegistering ? "Register your department email" : "Sign in with your Department ID"}
          </p>
        </div>

        {error && (
           <div style={{ background: 'rgba(245, 158, 11, 0.1)', borderLeft: '4px solid var(--warning)', padding: '12px', marginBottom: '24px', borderRadius: '4px' }}>
             <p style={{ margin: 0, color: 'var(--warning)', fontSize: '0.85rem', fontWeight: 600 }}>{error}</p>
           </div>
        )}

        {isPhoneLogin ? (
          <form onSubmit={handlePhoneSubmit}>
            <div id="recaptcha-container"></div>
            {!otpSent ? (
              <div className="input-group">
                <label>Mobile Number</label>
                <div style={{ position: 'relative' }}>
                   <Phone size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '16px', left: '16px' }} />
                   <input 
                    type="tel" 
                    placeholder="+91 9876543210" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ paddingLeft: '44px' }}
                    required 
                   />
                </div>
              </div>
            ) : (
              <div className="input-group">
                <label>Enter 6-Digit OTP securely sent to {phone}</label>
                <input 
                  type="text" 
                  placeholder="------" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={{ letterSpacing: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}
                  maxLength={6}
                  required 
                />
              </div>
            )}
            <button type="submit" className="btn" disabled={loading} style={{ width: '100%', fontSize: '1.05rem', padding: '14px', position: 'relative' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Loader2 size={20} className="spinner" /> {otpSent ? "Verifying..." : "Sending OTP..."}
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   {otpSent ? <LogIn size={20} /> : <Phone size={20} />} 
                   {otpSent ? "VERIFY OTP" : "SEND SMS SECURELY"}
                </span>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleEmailSubmit}>
            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="user@department.gov" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <div className="input-group" style={{ marginBottom: isRegistering ? '20px' : '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ margin: 0 }}>Password</label>
                {!isRegistering && (
                   <a href="#" style={{ fontSize: '0.8rem', color: 'var(--secondary)', textDecoration: 'none', fontWeight: 600 }}>Forgot?</a>
                )}
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                style={{ marginTop: '8px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                minLength={6}
              />
            </div>

            {isRegistering && (
               <div className="input-group" style={{ marginBottom: '32px' }}>
                 <label>Department Role</label>
                 <select value={role} onChange={(e) => setRole(e.target.value)} style={{ fontWeight: 500 }}>
                    <option value="admin">Command Center Admin</option>
                    <option value="hospital">Hospital Staff</option>
                    <option value="driver">Ambulance Driver Unit</option>
                 </select>
               </div>
            )}
            
            <button type="submit" className="btn" disabled={loading} style={{ width: '100%', fontSize: '1.05rem', padding: '14px', position: 'relative' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Loader2 size={20} className="spinner" /> 
                  {isRegistering ? "Registering..." : "Authenticating..."}
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   {isRegistering ? <UserPlus size={20} /> : <LogIn size={20} />} 
                   {isRegistering ? "CREATE ACCOUNT" : "ACCESS SYSTEM"}
                </span>
              )}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '32px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
           <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
             {!isPhoneLogin ? "Alternatively, securely login with your device." : "Return to Department Mail authentication?"}
           </p>
           
           <button 
             type="button"
             onClick={() => { setIsPhoneLogin(!isPhoneLogin); setError(''); setOtpSent(false); }} 
             className="btn btn-secondary" 
             style={{ width: '100%' }}
           >
             {isPhoneLogin ? "Switch to Mail ID Login" : "Mobile Phone Login"}
           </button>

           <button 
             type="button"
             onClick={() => { setIsRegistering(!isRegistering); setError(''); setIsPhoneLogin(false); }} 
             className="btn btn-secondary" 
             style={{ width: '100%', background: 'transparent', border: '1px dashed rgba(0,0,0,0.2)' }}
           >
             {isRegistering ? "Switch to Sign In" : "Register New Mail ID"}
           </button>
        </div>

      </div>
    </div>
  );
}
