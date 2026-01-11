import React, { useState } from 'react';
import { ShieldAlert, Cpu, Sparkles } from 'lucide-react';
import { getSecurityAnalysis } from '../services/geminiService';

export const AnalysisPanel: React.FC = () => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    // Simulate analyzing the "current environment"
    const context = "User is attempting to remove a verified email address from a high-value account using a session cookie. The account has 2FA enabled. The bypass method selected involves mimicking a 13+ account session.";
    const result = await getSecurityAnalysis(context);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-5 shadow-lg relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-[#00a2ff]" size={18} />
          <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wide">AI Security Analysis</h3>
        </div>
        {!analysis && !loading && (
          <button 
            onClick={runAnalysis}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#00a2ff]/10 hover:bg-[#00a2ff]/20 border border-[#00a2ff]/30 rounded text-[#00a2ff] text-xs font-medium transition-all"
          >
            <Sparkles size={12} />
            Run Diagnostics
          </button>
        )}
      </div>

      <div className="min-h-[100px] bg-[#050505] rounded border border-[#151515] p-4 relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-4">
             <Cpu className="text-[#00a2ff] animate-spin" size={24} />
             <span className="text-xs text-gray-500 font-mono animate-pulse">Querying Neural Engine...</span>
          </div>
        ) : analysis ? (
          <div className="prose prose-invert max-w-none">
             <p className="font-mono text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
               {analysis}
             </p>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-xs text-gray-600 font-mono">System standby. Awaiting manual trigger.</p>
          </div>
        )}
      </div>

      <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
        <Cpu size={100} className="text-[#00a2ff]" />
      </div>
    </div>
  );
};