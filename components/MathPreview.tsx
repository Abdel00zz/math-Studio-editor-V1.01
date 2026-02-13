import React, { useEffect, useRef } from 'react';
import { MediaData } from '../types';

interface MathPreviewProps {
  content: string | string[];
  className?: string;
  placeholder?: string;
  media?: MediaData;
  isTitle?: boolean; // If true, render inline without paragraph spacing
}

// Declare global MathJax
declare global {
  interface Window {
    MathJax: {
      typesetPromise: (elements: HTMLElement[]) => Promise<void>;
    };
  }
}

const renderMedia = (m: MediaData) => {
  if (!m || !m.src) return '';
  
  const w = m.width ? `width: ${m.width}${typeof m.width === 'number' ? 'px' : ''};` : 'max-width: 100%;';
  
  let containerStyle = '';
  let imgStyle = `border-radius: 8px; display: block; width: 100%; height: auto;`;
  
  if (m.style?.frame === 'modern') {
    containerStyle += 'border: 1px solid #e2e8f0; border-radius: 12px; padding: 6px; background: #fff;';
    imgStyle = `border-radius: 8px; display: block; width: 100%;`;
  } else if (m.style?.frame === 'polaroid') {
    containerStyle += 'border: 1px solid #e2e8f0; border-radius: 2px; padding: 8px 8px 30px; background: #fff; transform: rotate(-1deg);';
  } else if (m.style?.frame === 'simple') {
    imgStyle += 'border: 1px solid #cbd5e1;';
  }

  if (m.style?.shadow) {
    const s = m.style.shadow;
    const shadowVal = s === 'sm' ? '0 2px 4px' : s === 'md' ? '0 4px 6px -1px' : '0 10px 15px -3px';
    containerStyle += `box-shadow: ${shadowVal} rgba(0,0,0,0.1);`;
  }

  let wrapperClass = 'relative my-4';
  let wrapperStyle = containerStyle;

  if (m.position === 'float-left' || m.position === 'left') {
    wrapperStyle += `float: left; margin-right: 1.5rem; margin-bottom: 0.5rem; ${w}`;
  } else if (m.position === 'float-right' || m.position === 'right') {
    wrapperStyle += `float: right; margin-left: 1.5rem; margin-bottom: 0.5rem; ${w}`;
  } else if (m.position === 'hero' || m.position === 'top' || m.position === 'bottom') {
    wrapperStyle += `width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; margin-left: auto; margin-right: auto; max-width: ${m.width || '100%'};`;
  } else {
    wrapperStyle += `display: inline-block; ${w}`;
  }

  return `
    <div class="${wrapperClass}" style="${wrapperStyle}">
      <img src="${m.src}" alt="${m.alt || ''}" style="${imgStyle}" onerror="this.style.display='none'" />
      ${m.caption ? `<div class="text-[10px] text-slate-500 mt-2 text-center font-medium tracking-tight">${m.caption}</div>` : ''}
    </div>
  `;
};

const processLatexToHtml = (rawInput: string | string[]) => {
  let html = Array.isArray(rawInput) ? rawInput.join('\n') : (rawInput || '');
  if (!html) return '';

  // 1. Protect Math blocks (display and inline)
  const maths: string[] = [];
  const protect = (m: string) => { maths.push(m); return `\x00M${maths.length-1}\x00`; };
  
  html = html.replace(/\$\$[\s\S]*?\$\$/g, protect);
  html = html.replace(/\\\[[\s\S]*?\\\]/g, protect);
  html = html.replace(/\$(?:[^$\\]|\\.)+\$/g, protect);
  html = html.replace(/\\\((?:[^)\\]|\\.)*\\\)/g, protect);

  // 2. Structural Formatting
  html = html.replace(/\\par\b/g, '<div class="h-3"></div>');
  html = html.replace(/\\\\/g, '<br/>');
  html = html.replace(/\\newline\b/g, '<br/>');
  html = html.replace(/\\smallskip\b/g, '<div class="h-2"></div>');
  html = html.replace(/\\medskip\b/g, '<div class="h-4"></div>');
  html = html.replace(/\\bigskip\b/g, '<div class="h-8"></div>');

  // 3. Lists
  html = html.replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g, (_, body) => {
    const items = body.split('\\item').filter((s: string) => s.trim().length > 0);
    const listItems = items.map((item: string) => `<li class="pl-1">${item.trim()}</li>`).join('');
    return `<ol class="list-decimal list-outside ml-5 space-y-1 my-2 pl-2 marker:text-slate-400 marker:font-bold">${listItems}</ol>`;
  });
  html = html.replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, (_, body) => {
    const items = body.split('\\item').filter((s: string) => s.trim().length > 0);
    const listItems = items.map((item: string) => `<li class="pl-1">${item.trim()}</li>`).join('');
    return `<ul class="list-disc list-outside ml-5 space-y-1 my-2 pl-2 marker:text-slate-300">${listItems}</ul>`;
  });

  // 4. Custom Pedagogical Macros (Matches your JSON usage)
  html = html.replace(/\\method\b/g, '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-50 text-sky-700 text-[10px] font-bold uppercase tracking-wider border border-sky-100 mr-2 mb-1 shadow-sm"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>Méthode</span>');
  html = html.replace(/\\tip\b/g, '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider border border-amber-100 mr-2 mb-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>Astuce</span>');
  html = html.replace(/\\step\b/g, '<div class="mt-2 mb-1 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest"><span class="h-px flex-1 bg-slate-200"></span>Étape<span class="h-px flex-1 bg-slate-200"></span></div>');
  html = html.replace(/\\conclusion\b/g, '<div class="mt-3 pl-3 border-l-2 border-emerald-400 text-emerald-800 font-medium bg-emerald-50/50 p-2 rounded-r text-sm"><span class="font-bold uppercase text-[10px] tracking-wide text-emerald-600 block mb-1">Conclusion</span>');

  // 5. Text Styling Macros
  html = html.replace(/\\blueb\{([^{}]*)\}/g, '<span class="text-blue-700 font-bold">$1</span>');
  html = html.replace(/\\redb\{([^{}]*)\}/g, '<span class="text-red-700 font-bold">$1</span>');
  html = html.replace(/\\gray\{([^{}]*)\}/g, '<span class="text-slate-400">$1</span>');
  
  html = html.replace(/\\textbf\{([^{}]*)\}/g, '<strong class="font-bold text-slate-900">$1</strong>');
  html = html.replace(/\\textit\{([^{}]*)\}/g, '<em class="italic text-slate-600">$1</em>');
  html = html.replace(/\\underline\{([^{}]*)\}/g, '<u class="underline decoration-slate-300 underline-offset-2">$1</u>');
  html = html.replace(/\\textsc\{([^{}]*)\}/g, '<span class="font-variant-small-caps tracking-wide">$1</span>');
  html = html.replace(/\\texttt\{([^{}]*)\}/g, '<code class="bg-slate-100 px-1 py-0.5 rounded text-sm font-mono text-slate-700">$1</code>');

  // 6. Interactive/Placeholder Macros
  html = html.replace(/\\blank\{([^{}]*)\}/g, '<span class="inline-block border-b-2 border-dashed border-indigo-300 text-indigo-600 px-1 mx-0.5 font-bold min-w-[20px] text-center bg-indigo-50/30 rounded-t-sm cursor-help hover:bg-indigo-100 transition-colors select-all" title="Réponse">$1</span>');
  html = html.replace(/\\boxed\{([^{}]*)\}/g, '<span class="inline-block border-2 border-slate-800 px-3 py-1 my-1 rounded shadow-sm bg-white font-bold text-slate-900">$1</span>');

  // Restore Math
  html = html.replace(/\x00M(\d+)\x00/g, (_, i) => maths[+i]);

  return html;
};

export const MathPreview: React.FC<MathPreviewProps> = ({ content, className = '', placeholder, media, isTitle = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Render content
      const mediaHtml = media ? renderMedia(media) : '';
      const processedHtml = processLatexToHtml(content);
      
      if (isTitle) {
         // Titles should typically be single line or behave inline-block
         containerRef.current.innerHTML = processedHtml.replace(/<div class="h-3"><\/div>|<br\/>/g, ' '); 
      } else {
         containerRef.current.innerHTML = mediaHtml + processedHtml || `<span class="text-slate-300 italic select-none">${placeholder || '...'}</span>`;
      }
      
      // Typeset MathJax
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([containerRef.current]).catch((err) => {
          console.debug("MathJax error:", err);
        });
      }
    }
  }, [content, placeholder, media, isTitle]);

  return (
    <div 
      ref={containerRef} 
      className={`${isTitle ? 'inline-block' : 'prose prose-slate prose-p:my-1 prose-headings:my-2 max-w-none text-slate-700 leading-relaxed'} ${className} clearfix`} 
    />
  );
};
