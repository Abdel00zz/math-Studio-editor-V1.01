
import React, { useState } from 'react';
import { Revision, RevisionSection, RevisionBlock, MediaData } from '../../types';
import { LatexInput } from '../EditorFields';
import { MathPreview } from '../MathPreview';
import { GraphPreview } from '../GraphPreview';
import { Icons } from './EditorIcons';
import { MediaModal } from './MediaModal';
import { EditorProps, findGraphCode } from './EditorUtils';

export const RevisionEditor: React.FC<EditorProps<Revision>> = ({ data, onChange, graphFiles }) => {
  const [editStates, setEditStates] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [currentBlockTarget, setCurrentBlockTarget] = useState<{sIdx: number, bIdx: number} | null>(null);

  const toggleEdit = (id: string) => setEditStates(prev => ({ ...prev, [id]: !prev[id] }));

  const updateSection = (idx: number, s: RevisionSection) => {
    const newSecs = [...data.sections];
    newSecs[idx] = s;
    onChange({ ...data, sections: newSecs });
  };

  const openMediaModal = (sIdx: number, bIdx: number) => {
    setCurrentBlockTarget({ sIdx, bIdx });
    setModalOpen(true);
  };

  const handleMediaSave = (m: MediaData) => {
    if (!currentBlockTarget) return;
    const { sIdx, bIdx } = currentBlockTarget;
    const newSecs = [...data.sections];
    newSecs[sIdx].blocks[bIdx].media = m;
    onChange({ ...data, sections: newSecs });
  };

  const getCurrentMedia = () => {
    if (!currentBlockTarget) return undefined;
    const { sIdx, bIdx } = currentBlockTarget;
    return data.sections[sIdx].blocks[bIdx].media;
  };

  const getTypeStyle = (type: string) => {
    const map: Record<string, string> = {
      definition: 'bg-slate-800 text-white border-slate-800',
      theorem: 'bg-indigo-600 text-white border-indigo-600',
      property: 'bg-emerald-600 text-white border-emerald-600',
      example: 'bg-amber-500 text-white border-amber-500',
      method: 'bg-sky-500 text-white border-sky-500',
      method_principle: 'bg-sky-600 text-white border-sky-600',
      method_steps: 'bg-sky-50 text-sky-700 border-sky-200',
      technique: 'bg-teal-600 text-white border-teal-600',
      remark: 'bg-violet-500 text-white border-violet-500',
      warning: 'bg-rose-600 text-white border-rose-600',
      proof: 'bg-slate-600 text-white border-slate-600',
      intuition: 'bg-orange-600 text-white border-orange-600',
      summary: 'bg-blue-800 text-white border-blue-800',
      culture: 'bg-pink-600 text-white border-pink-600',
      graph: 'bg-indigo-500 text-white border-indigo-500',
      text: 'bg-slate-200 text-slate-700 border-slate-200',
      note: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    };
    return map[type] || 'bg-slate-100 text-slate-600 border-slate-200';
  };

  const getBorderColor = (type: string) => {
    const map: Record<string, string> = {
      definition: 'border-slate-800',
      theorem: 'border-indigo-600',
      property: 'border-emerald-600',
      example: 'border-amber-400',
      method: 'border-sky-500',
    };
    return map[type] || 'border-slate-200';
  };

  const blockTypes = [
    'text', 'definition', 'theorem', 'property', 'example', 
    'method', 'method_principle', 'method_steps', 'technique', 
    'remark', 'warning', 'proof', 'note', 'intuition', 'summary', 'culture', 'graph'
  ];

  return (
    <div className="max-w-5xl mx-auto pb-24">
      <MediaModal isOpen={modalOpen} onClose={() => setModalOpen(false)} media={getCurrentMedia()} onSave={handleMediaSave} />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Revision Sheet</h2>
        <input 
          className="w-full text-4xl font-extrabold text-slate-900 placeholder-slate-300 border-none outline-none bg-transparent mb-2 tracking-tight"
          placeholder="Enter Sheet Title"
          value={data.header.title}
          onChange={e => onChange({...data, header: {...data.header, title: e.target.value}})}
        />
        <input 
          className="w-full text-xl text-slate-500 placeholder-slate-300 border-none outline-none bg-transparent"
          placeholder="Add a subtitle or description..."
          value={data.header.subtitle || ''}
          onChange={e => onChange({...data, header: {...data.header, subtitle: e.target.value}})}
        />
      </div>

      <div className="space-y-12">
        {data.sections.map((sec, sIdx) => (
          <div key={sIdx} className="relative group/sec">
             <div className="flex justify-between items-end mb-6 pb-2 border-b border-slate-200/70">
                <div className="flex-1 flex gap-3 items-baseline">
                  <span className="text-2xl font-black text-slate-200 select-none">{sIdx + 1}.</span>
                  <div className="flex-1 text-2xl font-bold text-slate-800">
                    <MathPreview content={sec.title} isTitle />
                  </div>
                </div>
                 <button 
                  onClick={() => onChange({...data, sections: data.sections.filter((_, i) => i !== sIdx)})}
                  className="flex-shrink-0 text-xs text-slate-400 hover:text-red-600 font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors"
                 >Delete Section</button>
             </div>

             <div className="space-y-4">
               {sec.blocks.map((block, bIdx) => {
                  const blockId = `${sIdx}-${bIdx}`;
                  const isEditing = editStates[blockId];
                  const typeLabel = block.type.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                  const typeStyle = getTypeStyle(block.type);
                  const borderColor = getBorderColor(block.type);
                  const graphCode = findGraphCode(block.graphId, graphFiles);

                  return (
                   <div key={bIdx} className={`bg-white rounded-xl border-2 shadow-sm transition-all duration-300 group ${borderColor} ${isEditing ? 'ring-4 ring-indigo-50 shadow-lg' : 'hover:shadow-md'}`}>
                       <div className="flex justify-between items-center px-4 py-2 border-b border-slate-50 bg-slate-50/50 rounded-t-xl">
                         <div className="flex items-center gap-3 flex-1 mr-4 overflow-hidden">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap flex-shrink-0 border ${typeStyle}`}>
                              {typeLabel}
                            </span>
                            
                            {isEditing ? (
                                <div className="flex-1 flex gap-2 items-center">
                                  <select 
                                    value={block.type}
                                    onChange={(e) => {
                                      const newBlocks = [...sec.blocks];
                                      newBlocks[bIdx] = {...block, type: e.target.value as any};
                                      updateSection(sIdx, {...sec, blocks: newBlocks});
                                    }}
                                    className="text-xs border border-slate-200 bg-white rounded px-2 py-1 text-slate-700 cursor-pointer outline-none focus:ring-1 focus:ring-indigo-200 uppercase font-bold"
                                  >
                                    {blockTypes.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                                  </select>
                                  <input 
                                      className="flex-1 min-w-[100px] text-sm font-bold text-slate-900 bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-indigo-50/20 transition-all" 
                                      placeholder="Title (optional)..."
                                      value={block.title || ''}
                                      onChange={e => {
                                         const newBlocks = [...sec.blocks];
                                         newBlocks[bIdx] = {...block, title: e.target.value};
                                         updateSection(sIdx, {...sec, blocks: newBlocks});
                                      }}
                                  />
                                  <input 
                                      className="w-24 text-xs text-slate-500 bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-indigo-500" 
                                      placeholder="Graph ID..."
                                      value={block.graphId || ''}
                                      onChange={e => {
                                         const newBlocks = [...sec.blocks];
                                         newBlocks[bIdx] = {...block, graphId: e.target.value};
                                         updateSection(sIdx, {...sec, blocks: newBlocks});
                                      }}
                                  />
                                </div>
                            ) : (
                                <div 
                                    className="flex items-center gap-2 text-sm font-bold text-slate-800 cursor-text truncate group/title"
                                    onDoubleClick={() => toggleEdit(blockId)}
                                    title="Double click to edit title"
                                >
                                    {block.title ? <MathPreview content={block.title} isTitle /> : <span className="opacity-0 group-hover/title:opacity-100 text-slate-300 italic text-xs transition-opacity">No title</span>}
                                </div>
                            )}
                         </div>

                         <div className="flex items-center gap-1 opacity-100 flex-shrink-0">
                             <button onClick={() => toggleEdit(blockId)} className={`px-3 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide transition-all ${!isEditing ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' : 'text-slate-500 hover:bg-slate-100'}`}>
                               {!isEditing ? <><Icons.Edit /> Edit</> : <><Icons.Eye /> View</>}
                             </button>
                             <div className="w-px h-3 bg-slate-200 mx-2"></div>
                             
                             <button 
                               onClick={() => openMediaModal(sIdx, bIdx)}
                               className={`p-1.5 rounded-md transition ${block.media ? 'text-indigo-500 bg-indigo-50 hover:bg-indigo-100' : 'text-slate-300 hover:text-indigo-500 hover:bg-slate-50'}`}
                             >
                                <Icons.Image />
                             </button>

                             <button onClick={() => updateSection(sIdx, {...sec, blocks: sec.blocks.filter((_, i) => i !== bIdx)})} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded"><Icons.Trash /></button>
                         </div>
                       </div>

                       <div className="px-5 pb-5 pt-3">
                         {!isEditing ? (
                           <>
                            {graphCode && (
                                <GraphPreview graphCode={graphCode} caption={block.graphCaption} fullWidth={block.type === 'graph'} />
                            )}
                            
                            {block.type === 'method_steps' ? (
                               <div className="space-y-2">
                                  {(Array.isArray(block.content) ? block.content : [block.content]).map((step, i) => (
                                    <div key={i} className="flex gap-3">
                                       <span className="font-bold text-sky-600 text-sm mt-0.5">{i+1}.</span>
                                       <div className="flex-1"><MathPreview content={step} /></div>
                                    </div>
                                  ))}
                               </div>
                            ) : (
                               <MathPreview content={Array.isArray(block.content) ? block.content.join('\n') : block.content} media={block.media} />
                            )}
                           </>
                         ) : (
                           <div className="space-y-4">
                              <LatexInput 
                                value={Array.isArray(block.content) ? block.content.join('\n') : block.content} 
                                onChange={v => {
                                  const newBlocks = [...sec.blocks];
                                  if (block.type === 'method_steps') {
                                     newBlocks[bIdx] = {...block, content: v.split('\n')};
                                  } else {
                                     newBlocks[bIdx] = {...block, content: v};
                                  }
                                  updateSection(sIdx, {...sec, blocks: newBlocks});
                                }}
                                multiline
                                placeholder="Block content (LaTeX supported)..."
                                className="w-full bg-slate-50/50"
                                rows={6}
                              />
                           </div>
                         )}
                       </div>
                   </div>
                 );
               })}
             </div>

             <div className="mt-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
                <div className="flex gap-2 items-center opacity-60 group-hover/sec:opacity-100 transition-opacity min-w-max">
                   <span className="text-xs font-bold text-slate-300 uppercase mr-2 sticky left-0 bg-slate-50 z-10 px-2">Quick Add</span>
                   {blockTypes.map((t) => (
                     <button 
                       key={t}
                       onClick={() => {
                         const newBlock: RevisionBlock = { type: t as any, content: '' };
                         updateSection(sIdx, { ...sec, blocks: [...sec.blocks, newBlock] });
                         const newIdx = sec.blocks.length;
                         setEditStates(prev => ({ ...prev, [`${sIdx}-${newIdx}`]: true }));
                       }}
                       className={`text-[10px] uppercase font-bold px-3 py-1.5 rounded-full transition shadow-sm border border-slate-100 hover:scale-105 hover:shadow-md ${getTypeStyle(t)}`}
                     >
                       + {t.replace('_', ' ')}
                     </button>
                   ))}
                </div>
             </div>
          </div>
        ))}
        
        <button 
          onClick={() => onChange({ ...data, sections: [...data.sections, { id: `s${Date.now()}`, title: 'New Section', category: 'course', blocks: [] }]})}
          className="w-full py-6 border-2 border-dashed border-slate-200 text-slate-400 font-bold rounded-xl hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition flex items-center justify-center gap-2 mt-8 group"
        >
          <span className="bg-slate-100 text-slate-400 rounded-full p-1 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors"><Icons.Plus /></span> Add Section
        </button>
      </div>
    </div>
  );
};
