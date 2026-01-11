import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal as TerminalIcon } from 'lucide-react';

interface TerminalProps {
  logs: LogEntry[];
}

export const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg overflow-hidden shadow-lg relative group">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0f0f0f] border-b border-[#1f1f1f]">
        <div className="flex items-center gap-2">
          <TerminalIcon size={14} className="text-[#00a2ff]" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider"></span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500/20"></div>
          <div className="w-2 h-2 rounded-full bg-green-500/80 animate-pulse"></div>
        </div>
      </div>

      {/* Logs Area */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-1.5 scroll-smooth"
      >
        {logs.length === 0 && (
          <div className="text-gray-700 italic opacity-50">Waiting for process initialization...</div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-gray-600 shrink-0">[{log.timestamp}]</span>
            <span className={`break-all ${
              log.type === 'error' ? 'text-red-400' :
              log.type === 'success' ? 'text-green-400' :
              log.type === 'warning' ? 'text-yellow-400' :
              'text-gray-300'
            }`}>
              {log.type === 'success' && 'SUCCESS: '}
              {log.type === 'error' && 'CRITICAL: '}
              {log.message}
            </span>
          </div>
        ))}
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#00a2ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
};
