
import React, { useState, useEffect } from 'react';
import { MediaData } from '../../types';
import { Icons } from './EditorIcons';

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  media?: MediaData;
  onSave: (m: MediaData) => void;
}

export const MediaModal: React.FC<MediaModalProps> = ({ isOpen, onClose, media, onSave }) => {
  const [data, setData] = useState<MediaData>({ src: '', position: 'inline', width: '50%', style: { frame: 'modern', shadow: 'sm' } });
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [previewSrc, setPreviewSrc] = useState<string>('');

  useEffect(() => {
    if (isOpen && media) {
      setData(media);
      setPreviewSrc(media.src);
    } else if (isOpen && !media) {
      setData({ src: '', position: 'inline', width: '50%', style: { frame: 'modern', shadow: 'sm' } });
      setPreviewSrc('');
    }
  }, [isOpen, media]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 transform transition-all scale-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg"><Icons.Image /></span>
            Media Manager
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1 rounded-full transition">✕</button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Left Column: Controls */}
           <div className="space-y-6">
              
              {/* Tabs */}
              <div className="flex p-1 bg-slate-100 rounded-lg">
                <button 
                  onClick={() => setTab('upload')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${tab === 'upload' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Import File
                </button>
                <button 
                  onClick={() => setTab('url')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${tab === 'url' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  External URL
                </button>
              </div>

              {/* Source Input */}
              <div>
                {tab === 'upload' ? (
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors group cursor-pointer relative">
                    <input type="file" onChange={(e) => {
                       const file = e.target.files?.[0];
                       if(file) {
                         const path = `/data/assets/${file.name}`;
                         setData({...data, src: path});
                         setPreviewSrc(URL.createObjectURL(file));
                       }
                    }} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                    <div className="text-indigo-500 mb-2 group-hover:scale-110 transition-transform duration-200"><Icons.Upload /></div>
                    <div className="text-xs font-bold text-slate-600">Click to Browse</div>
                    <div className="text-[10px] text-slate-400">PNG, JPG, GIF</div>
                    {data.src && <div className="mt-2 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded inline-block truncate max-w-full">{data.src}</div>}
                  </div>
                ) : (
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Image URL</label>
                    <input 
                      value={data.src}
                      onChange={e => { setData({...data, src: e.target.value}); setPreviewSrc(e.target.value); }}
                      className="w-full text-xs p-2 border border-slate-300 rounded focus:border-indigo-500 outline-none transition-shadow focus:ring-2 focus:ring-indigo-100"
                      placeholder="https://..."
                    />
                  </div>
                )}
              </div>

              {/* Width Slider */}
              <div>
                 <div className="flex justify-between mb-1">
                   <label className="text-[10px] font-bold text-slate-400 uppercase">Size (Width)</label>
                   <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-1 rounded">{data.width}</span>
                 </div>
                 <input 
                   type="range" min="10" max="100" step="5" 
                   value={parseInt(data.width || '50')} 
                   onChange={(e) => setData({...data, width: `${e.target.value}%`})}
                   className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                 />
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-2">
                 <input 
                    className="text-xs p-2 border border-slate-200 rounded outline-none focus:border-indigo-400"
                    placeholder="Caption"
                    value={data.caption || ''}
                    onChange={e => setData({...data, caption: e.target.value})}
                 />
                 <input 
                    className="text-xs p-2 border border-slate-200 rounded outline-none focus:border-indigo-400"
                    placeholder="Alt Text"
                    value={data.alt || ''}
                    onChange={e => setData({...data, alt: e.target.value})}
                 />
              </div>
           </div>

           {/* Right Column: Preview */}
           <div className="bg-slate-100 rounded-xl border border-slate-200 p-4 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-20"></div>
              <div className="absolute top-2 left-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preview</div>
              {previewSrc ? (
                <div className={`transition-all duration-300 ${data.style?.frame === 'polaroid' ? 'p-2 bg-white shadow-lg rotate-1 border' : ''} ${data.style?.frame === 'modern' ? 'p-1 bg-white rounded-lg shadow-md border' : ''}`}>
                   <img 
                    src={previewSrc} 
                    alt="Preview" 
                    className="max-w-full max-h-[250px] object-contain shadow-sm rounded-sm" 
                    style={{ width: data.width === '100%' ? '200px' : 'auto' }}
                   />
                   {data.caption && <div className="text-center text-[10px] text-slate-500 mt-2 font-medium">{data.caption}</div>}
                </div>
              ) : (
                <div className="text-slate-300 flex flex-col items-center">
                   <Icons.Image />
                   <span className="text-xs mt-2">No image selected</span>
                </div>
              )}
           </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition">Cancel</button>
          <button 
            onClick={() => { onSave(data); onClose(); }} 
            disabled={!data.src}
            className="px-6 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            Save Media
          </button>
        </div>
      </div>
    </div>
  );
};
