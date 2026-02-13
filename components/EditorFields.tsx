import React from 'react';

interface LatexInputProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  className?: string;
}

export const LatexInput: React.FC<LatexInputProps> = ({ 
  label, 
  value, 
  onChange, 
  multiline = false, 
  rows = 3,
  placeholder = "Type LaTeX content here...",
  className = ""
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 ml-1">
          {label}
        </label>
      )}
      
      <div className="relative group transition-all duration-200 ease-in-out">
        <div className={`
          absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg opacity-0 
          group-focus-within:opacity-20 transition duration-500 blur
        `}></div>
        
        <div className="relative bg-white rounded-lg border border-slate-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 overflow-hidden">
          {multiline ? (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              rows={rows}
              className="w-full p-4 text-sm font-mono text-slate-800 placeholder-slate-400 bg-transparent outline-none resize-y leading-relaxed"
              placeholder={placeholder}
            />
          ) : (
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full p-3 text-sm font-mono text-slate-800 placeholder-slate-400 bg-transparent outline-none"
              placeholder={placeholder}
            />
          )}
        </div>
      </div>
    </div>
  );
};
