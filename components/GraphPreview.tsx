
import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    JXG: any;
  }
}

interface GraphPreviewProps {
  graphCode: string;
  caption?: string;
  fullWidth?: boolean;
}

export const GraphPreview: React.FC<GraphPreviewProps> = ({ graphCode, caption, fullWidth = false }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const boardInstance = useRef<any>(null);

  useEffect(() => {
    if (!boardRef.current || !window.JXG) return;
    
    // Clean up previous board
    if (boardInstance.current) {
        try {
           window.JXG.JSXGraph.freeBoard(boardInstance.current);
        } catch(e) {
           // Ignore cleanup errors
        }
        boardInstance.current = null;
    }
    
    // Clear the container
    boardRef.current.innerHTML = ''; 

    const id = `jxgbox-${Math.random().toString(36).substr(2, 9)}`;
    boardRef.current.id = id;

    try {
      // 1. Basic cleaning: remove imports
      let cleanCode = graphCode.replace(/import .*?;/g, '');

      // 2. TypeScript Stripping
      // Specific replacements for complex types observed in the codebase
      cleanCode = cleanCode.replace(/:\s*number\s*\|\s*null/g, '');
      
      // Generic type stripping: matches ": Type"
      // We ensure the type starts with a letter or underscore to avoid matching 
      // object properties like "boundingBox: [-1, ...]" or "showAxis: true"
      // which would otherwise be stripped and cause syntax errors.
      // We also use a lookahead to avoid stripping keywords if they happen to match.
      cleanCode = cleanCode.replace(/:\s*(?!true\b|false\b|null\b|undefined\b)[a-zA-Z_][a-zA-Z0-9_<>\[\]]*/g, '');
      
      // Remove "as Type" assertions
      cleanCode = cleanCode.replace(/ as [a-zA-Z0-9_<>]+/g, '');

      // 3. Handle Exports
      // Support "export const graphConfig =" pattern
      if (/export\s+const\s+graphConfig\s*=/.test(cleanCode)) {
         cleanCode = cleanCode.replace(/export\s+const\s+graphConfig\s*=/, 'return ');
         // Remove any trailing export default to avoid syntax errors
         cleanCode = cleanCode.replace(/export\s+default\s+.*?;?/g, '');
      } else {
         // Support "const config = ...; export default config;" pattern
         // We simply replace "export default" with "return" to return the object
         cleanCode = cleanCode.replace(/export\s+default/g, 'return');
      }

      // Wrap in a function
      const createConfig = new Function(`
        try {
          ${cleanCode}
        } catch(e) {
          console.error("Code evaluation error", e);
          return null;
        }
      `);
      
      const config = createConfig();

      if (config && (config.init || config.f)) {
        // Initialize board
        const bbox = config.boundingBox || [-5, 5, 5, -5];
        const showAxis = config.showAxis ?? true;
        const showGrid = config.showGrid ?? true;
        const keepAspectRatio = config.keepAspectRatio ?? false;
        
        const board = window.JXG.JSXGraph.initBoard(id, {
          boundingbox: bbox,
          axis: showAxis,
          grid: showGrid,
          keepaspectratio: keepAspectRatio,
          showCopyright: false,
          pan: { enabled: true, needShift: false },
          zoom: { enabled: true, needShift: false },
          defaultAxes: {
            y: {
                name: config.labels?.y || 'y',
                withLabel: true,
                label: { position: 'rt', offset: [-10, -5] }
            },
            x: {
                name: config.labels?.x || 'x',
                withLabel: true,
                label: { position: 'rt', offset: [-5, 10] }
            }
          }
        });

        if (config.type === 'geometry' && config.init) {
           config.init(board);
        } else if (config.f) {
           // Helper for function graphs (standardized in types but logic was missing)
           board.create('functiongraph', [config.f, config.domain?.[0]??-10, config.domain?.[1]??10], {
             strokeWidth: 2, strokeColor: '#3b82f6'
           });
           
           if (config.pointsOfInterest) {
             config.pointsOfInterest.forEach((p: any) => {
               board.create('point', [p.x, p.y], { name: p.label, color: p.color, size: 3, fixed: true });
             });
           }
           
           if (config.otherAsymptotes) {
             config.otherAsymptotes.forEach((a: any) => {
               board.create('functiongraph', [a.f], { 
                 strokeColor: a.color, dash: a.strokeDasharray === '5 5' ? 2 : 0, strokeWidth: 1 
               });
             });
           }
        }

        boardInstance.current = board;
        setError(null);
      } else {
        throw new Error("Invalid graph configuration returned.");
      }
    } catch (err: any) {
      console.error("Graph render error details:", err);
      setError(err.message);
    }

  }, [graphCode]);

  return (
    <div className={`my-6 flex flex-col items-center group transition-all duration-300 ${fullWidth ? 'w-full' : ''}`}>
      <div className={`
        relative bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden
        ${fullWidth ? 'w-full h-[500px]' : 'w-full max-w-lg h-[400px]'}
        group-hover:shadow-md group-hover:border-indigo-200 transition-all duration-300
      `}>
        <div 
          ref={boardRef} 
          className="w-full h-full jxgbox"
          style={{ borderRadius: '1rem' }}
        />
        
        {/* Loading/Empty State overlay if needed could go here */}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50/90 p-6 text-center">
            <div>
              <div className="text-red-500 font-bold mb-2">Graphic Render Error</div>
              <div className="text-xs text-slate-500 font-mono bg-slate-100 p-2 rounded">{error}</div>
            </div>
          </div>
        )}
      </div>
      
      {caption && (
        <div className="mt-3 flex items-center gap-2 px-4 py-1 bg-slate-50 rounded-full border border-slate-100 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          <span className="text-xs text-slate-500 font-medium tracking-wide">{caption}</span>
        </div>
      )}
    </div>
  );
};
