
import React, { useState, useEffect } from 'react';
import { Exercise, Question, Quiz, QuizQuestion, Revision, RevisionBlock, RevisionSection, SubQuestion, MediaData, QuizOption, QuizOrderItem, QuizStep } from '../types';
import { LatexInput } from './EditorFields';
import { MathPreview } from './MathPreview';
import { GraphPreview } from './GraphPreview';

// --- Icons ---
const Icons = {
  Up: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>,
  Down: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Eye: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  Edit: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Plus: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  Image: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Upload: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
  Graph: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
};

// --- Props ---
interface EditorProps<T> {
  data: T;
  onChange: (d: T) => void;
  graphFiles?: Map<string, { content: string }>;
  graphIndex?: any;
}

// --- Helper to find graph code ---
const findGraphCode = (graphId: string | undefined, graphFiles?: Map<string, { content: string }>) => {
  if (!graphId || !graphFiles) return null;
  // 1. Exact match (e.g. "graphs/1bac/mygraph.ts")
  if (graphFiles.has(graphId)) return graphFiles.get(graphId)?.content;
  
  // 2. Fuzzy match by filename
  for (const [path, file] of graphFiles.entries()) {
    // Check if path ends with graphId.ts or simply contains graphId
    if (path.includes(graphId) && (path.endsWith('.ts') || path.endsWith('.js'))) {
      return file.content;
    }
  }
  return null;
};

// --- Modals ---

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  media?: MediaData;
  onSave: (m: MediaData) => void;
}

const MediaModal: React.FC<MediaModalProps> = ({ isOpen, onClose, media, onSave }) => {
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


// --- Shared Helper ---
function moveItem<T>(arr: T[], index: number, direction: -1 | 1): T[] {
  const newArr = [...arr];
  if (index + direction < 0 || index + direction >= newArr.length) return newArr;
  [newArr[index], newArr[index + direction]] = [newArr[index + direction], newArr[index]];
  return newArr;
}

// ==========================================
// EXERCISE EDITOR
// ==========================================
export const ExerciseEditor: React.FC<EditorProps<Exercise>> = ({ data, onChange, graphFiles }) => {
  const [editStates, setEditStates] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [currentMediaTarget, setCurrentMediaTarget] = useState<{qIdx: number, sqIdx?: number} | null>(null);

  const toggleEdit = (id: string) => {
    setEditStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const updateQuestion = (idx: number, q: Question) => {
    const newQs = [...data.questions];
    newQs[idx] = q;
    onChange({ ...data, questions: newQs });
  };

  const deleteQuestion = (idx: number) => {
    if (!confirm('Delete this question?')) return;
    onChange({ ...data, questions: data.questions.filter((_, i) => i !== idx) });
  };

  const openMediaModal = (qIdx: number, sqIdx?: number) => {
    setCurrentMediaTarget({ qIdx, sqIdx });
    setModalOpen(true);
  };

  const handleMediaSave = (m: MediaData) => {
    if (!currentMediaTarget) return;
    const { qIdx, sqIdx } = currentMediaTarget;
    const newQs = [...data.questions];
    
    if (sqIdx !== undefined) {
       newQs[qIdx].subQuestions![sqIdx].media = m;
    } else {
       newQs[qIdx].media = m;
    }
    onChange({ ...data, questions: newQs });
  };

  const getCurrentMedia = () => {
    if (!currentMediaTarget) return undefined;
    const { qIdx, sqIdx } = currentMediaTarget;
    if (sqIdx !== undefined) return data.questions[qIdx].subQuestions?.[sqIdx]?.media;
    return data.questions[qIdx].media;
  };

  return (
    <div className="max-w-5xl mx-auto pb-24">
      <MediaModal isOpen={modalOpen} onClose={() => setModalOpen(false)} media={getCurrentMedia()} onSave={handleMediaSave} />
      
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 relative z-10">
          <span className="bg-indigo-50 text-indigo-600 p-2 rounded-lg border border-indigo-100"><Icons.Edit /></span>
          Exercise Metadata
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 relative z-10">
          <LatexInput label="Topic" value={data.topic} onChange={v => onChange({...data, topic: v})} placeholder="e.g. Linear Algebra" />
          <LatexInput label="Unique ID" value={data.id} onChange={v => onChange({...data, id: v})} placeholder="e.g. ex-001" />
          <div className="w-full">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 ml-1">Session Date</label>
            <div className="relative bg-white rounded-lg border border-slate-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 overflow-hidden">
               <input 
                  type="date"
                  className="w-full p-3 text-sm font-mono text-slate-800 bg-transparent outline-none"
                  value={data.sessionDate ? data.sessionDate.split('T')[0] : ''}
                  onChange={(e) => onChange({...data, sessionDate: e.target.value})}
               />
            </div>
          </div>
        </div>
        <div className="relative z-10">
           <LatexInput label="Context / Statement" value={data.context || ''} onChange={v => onChange({...data, context: v})} multiline rows={3} />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-bold text-slate-700 text-lg">Questions <span className="text-slate-400 text-sm font-normal ml-2">{data.questions.length} items</span></h3>
          <button 
            onClick={() => onChange({...data, questions: [...data.questions, { id: `q${Date.now()}`, type: 'question', content: '' }]})} 
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition shadow-lg shadow-slate-200/50 active:translate-y-0.5"
          >
            <Icons.Plus /> Add Question
          </button>
        </div>
        
        {data.questions.map((q, idx) => {
          const qId = q.id || String(idx);
          const isEditing = editStates[qId];
          const graphCode = findGraphCode(q.graphId, graphFiles);

          return (
            <div key={qId} className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isEditing ? 'border-indigo-200 shadow-md ring-1 ring-indigo-50' : 'border-slate-200 shadow-sm hover:shadow-md'}`}>
              <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-white to-slate-50 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-md bg-slate-800 text-white text-xs font-bold shadow-sm">{idx + 1}</span>
                  {isEditing && (
                    <div className="flex gap-2 animate-in fade-in slide-in-from-left-2">
                      <select 
                        value={q.type}
                        onChange={(e) => updateQuestion(idx, {...q, type: e.target.value as any})}
                        className="text-xs font-medium uppercase tracking-wide border border-slate-200 bg-white rounded px-2 py-1 text-slate-600 cursor-pointer outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100"
                      >
                        <option value="question">Question</option>
                        <option value="text">Text Only</option>
                        <option value="partie">Part</option>
                      </select>
                      <input 
                        className="text-xs font-mono w-24 px-2 py-1 border border-slate-200 rounded focus:border-indigo-400 outline-none" 
                        value={q.graphId || ''} 
                        onChange={(e) => updateQuestion(idx, {...q, graphId: e.target.value})} 
                        placeholder="Graph ID..." 
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleEdit(qId)} className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide ${!isEditing ? 'bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100' : 'bg-slate-100 text-slate-500 border border-transparent hover:bg-slate-200'}`}>
                    {!isEditing ? <><Icons.Edit /> Edit</> : <><Icons.Eye /> View</>}
                  </button>
                  <div className="w-px h-4 bg-slate-200 mx-2"></div>
                  
                  {/* Image Button in Toolbar */}
                  <button 
                    onClick={() => openMediaModal(idx)}
                    className={`p-1.5 rounded-md transition ${q.media ? 'text-indigo-500 bg-indigo-50 hover:bg-indigo-100' : 'text-slate-300 hover:text-indigo-500 hover:bg-slate-50'}`}
                    title="Manage Image"
                  >
                    <Icons.Image />
                  </button>
                  
                  <button onClick={() => deleteQuestion(idx)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition"><Icons.Trash /></button>
                </div>
              </div>

              <div className="p-6">
                {!isEditing ? (
                  <div className="animate-in fade-in duration-300">
                    {graphCode && (
                        <GraphPreview graphCode={graphCode} caption={q.graphCaption} />
                    )}
                    <MathPreview content={q.content} media={q.media} />
                    
                    {q.subQuestions?.length ? (
                      <div className="mt-4 pl-4 border-l-2 border-indigo-100 space-y-4">
                        {q.subQuestions.map((sq, sqIdx) => (
                           <div key={sqIdx} className="flex gap-3">
                              <span className="text-xs font-bold text-indigo-400 pt-1">{sq.id})</span>
                              <div className="flex-1">
                                <MathPreview content={sq.content} media={sq.media} />
                                {sq.hint && <div className="text-xs text-slate-400 mt-1 italic pl-2 border-l-2 border-slate-100">Hint: {sq.hint}</div>}
                              </div>
                           </div>
                        ))}
                      </div>
                    ) : null}

                    {q.hint && (
                      <div className="mt-4 pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-1.5 py-0.5 rounded">Hint</span>
                        </div>
                        <MathPreview content={q.hint} className="text-sm text-slate-500 italic" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-5 animate-in slide-in-from-top-2 duration-200">
                    <LatexInput value={q.content} onChange={v => updateQuestion(idx, {...q, content: v})} multiline rows={4} placeholder="Type your question content in LaTeX..." />
                    
                    {q.type !== 'partie' && (
                      <LatexInput label="Hint" value={q.hint || ''} onChange={v => updateQuestion(idx, {...q, hint: v})} multiline rows={2} />
                    )}

                    {/* Sub Questions Edit */}
                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">Sub-Questions</span>
                        <button onClick={() => {
                          const newQs = [...data.questions];
                          const subQs = [...(newQs[idx].subQuestions || [])];
                          subQs.push({ id: String.fromCharCode(97 + subQs.length), content: '' });
                          newQs[idx] = { ...newQs[idx], subQuestions: subQs };
                          onChange({ ...data, questions: newQs });
                        }} className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100 font-bold border border-indigo-100 transition-colors">+ Add Sub-Q</button>
                      </div>
                      <div className="space-y-4 pl-4 border-l-2 border-slate-100">
                         {q.subQuestions?.map((sq, sqIdx) => (
                           <div key={sqIdx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 relative group transition-colors hover:border-indigo-200 hover:bg-indigo-50/30">
                              <div className="flex gap-2 mb-2">
                                <input className="w-10 text-xs font-bold p-1 rounded border border-slate-200 text-center focus:border-indigo-400 outline-none" value={sq.id} onChange={(e) => {
                                  const newQs = [...data.questions];
                                  newQs[idx].subQuestions![sqIdx].id = e.target.value;
                                  onChange({...data, questions: newQs});
                                }} />
                                <div className="flex-1"></div>
                                {/* SubQuestion Image Button */}
                                <button onClick={() => openMediaModal(idx, sqIdx)} className={`p-1 rounded hover:bg-white ${sq.media ? 'text-indigo-500' : 'text-slate-300'}`}><Icons.Image /></button>
                                <button onClick={() => {
                                  const newQs = [...data.questions];
                                  newQs[idx].subQuestions = newQs[idx].subQuestions!.filter((_, i) => i !== sqIdx);
                                  onChange({...data, questions: newQs});
                                }} className="text-slate-400 hover:text-red-500 transition-colors"><Icons.Trash /></button>
                              </div>
                              <LatexInput value={sq.content} onChange={(v) => {
                                const newQs = [...data.questions];
                                newQs[idx].subQuestions![sqIdx].content = v;
                                onChange({...data, questions: newQs});
                              }} placeholder="Sub-question content..." multiline rows={2} className="mb-2" />
                           </div>
                         ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// REVISION EDITOR
// ==========================================
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
    // simplified mapping for borders
    const map: Record<string, string> = {
      definition: 'border-slate-800',
      theorem: 'border-indigo-600',
      property: 'border-emerald-600',
      example: 'border-amber-400',
      method: 'border-sky-500',
      // ... others can fallback
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

// ==========================================
// QUIZ EDITOR
// ==========================================
export const QuizEditor: React.FC<EditorProps<Quiz>> = ({ data, onChange }) => {
     // Safe metadata access to prevent crashes with optional metadata files
     const safeMetadata = data.metadata || { title: '', chapter: '', level: '', total_questions: data.questions.length };

     const updateQuestion = (idx: number, q: QuizQuestion) => {
        const newQs = [...data.questions];
        newQs[idx] = q;
        onChange({...data, questions: newQs, metadata: {...safeMetadata, total_questions: newQs.length}});
     };
   
     const addQuestion = () => {
       const newQs = [...(data.questions || []), { id: `q${Date.now()}`, type: 'mcq' as const, question: '', options: [] }];
       onChange({
         ...data, 
         questions: newQs,
         metadata: {...safeMetadata, total_questions: newQs.length}
       });
     };
   
     return (
       <div className="max-w-5xl mx-auto pb-24">
         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-full bg-emerald-50 opacity-50"></div>
           <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 relative z-10">
             <span className="bg-emerald-50 text-emerald-600 p-2 rounded-lg border border-emerald-100">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </span>
             Quiz Metadata
           </h2>
           <div className="grid grid-cols-2 gap-6 relative z-10">
              <LatexInput 
                value={safeMetadata.title} 
                onChange={v => onChange({...data, metadata: {...safeMetadata, title: v}})} 
                label="Quiz Title" 
                placeholder="e.g. Limits & Continuity" 
              />
              <LatexInput 
                value={safeMetadata.chapter} 
                onChange={v => onChange({...data, metadata: {...safeMetadata, chapter: v}})} 
                label="Chapter ID" 
                placeholder="e.g. ch-01" 
              />
           </div>
         </div>
   
         <div className="space-y-6">
           {data.questions.map((q, idx) => (
             <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-emerald-200 transition-all hover:shadow-md">
                <div className="flex justify-between items-center mb-6">
                   <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">Q{idx+1}</span>
                      <select 
                         value={q.type} 
                         onChange={e => updateQuestion(idx, {...q, type: e.target.value as any})}
                         className="text-sm font-semibold bg-slate-100 border-none rounded-lg px-3 py-1.5 cursor-pointer hover:bg-slate-200 outline-none uppercase tracking-wide text-slate-600 focus:ring-2 focus:ring-emerald-100"
                       >
                         <option value="mcq">Multiple Choice</option>
                         <option value="true-false">True / False</option>
                         <option value="input">Input Answer</option>
                         <option value="error-spotting">Error Spotting</option>
                         <option value="order">Ordering</option>
                       </select>
                   </div>
                   <button onClick={() => {
                      const qs = data.questions.filter((_, i) => i !== idx);
                      onChange({...data, questions: qs, metadata: {...safeMetadata, total_questions: qs.length}});
                   }} className="text-slate-300 hover:text-red-500 transition"><Icons.Trash /></button>
                </div>
   
                <div className="mb-6">
                    <LatexInput value={q.question || q.prompt || ''} onChange={v => updateQuestion(idx, {...q, question: v})} multiline rows={2} placeholder="Question text (LaTeX supported)..." />
                </div>
                
                {/* MCQ & True/False Interface */}
                {(q.type === 'mcq' || q.type === 'true-false') && (
                  <div className="pl-4 border-l-2 border-slate-100 space-y-4">
                     <div className="text-xs font-bold uppercase text-slate-400 tracking-widest">Options</div>
                     {q.options?.map((opt, oIdx) => (
                       <div key={oIdx} className="flex gap-4 items-start group/opt">
                          <input 
                           type="checkbox" 
                           checked={opt.is_correct || opt.isCorrect} 
                           onChange={e => {
                             const newOpts = [...(q.options || [])];
                             if(q.type === 'true-false') newOpts.forEach(o => o.isCorrect = false); 
                             newOpts[oIdx] = {...opt, isCorrect: e.target.checked}; // Standardize on isCorrect
                             updateQuestion(idx, {...q, options: newOpts});
                           }}
                           className="mt-3 w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300 cursor-pointer"
                          />
                          <div className="flex-1 space-y-2">
                             <LatexInput value={opt.text} onChange={v => {
                                 const newOpts = [...(q.options || [])];
                                 newOpts[oIdx] = {...opt, text: v};
                                 updateQuestion(idx, {...q, options: newOpts});
                               }} placeholder="Answer option..." className="bg-slate-50/50"
                             />
                             <input 
                               className="w-full text-xs text-slate-500 border-b border-transparent bg-transparent py-1 focus:border-emerald-300 outline-none transition-colors"
                               value={opt.explanation || ''}
                               onChange={e => {
                                 const newOpts = [...(q.options || [])];
                                 newOpts[oIdx] = {...opt, explanation: e.target.value};
                                 updateQuestion(idx, {...q, options: newOpts});
                               }}
                               placeholder="Specific explanation for this option (optional)"
                             />
                          </div>
                          <button onClick={() => updateQuestion(idx, {...q, options: q.options?.filter((_, i) => i !== oIdx)})} className="mt-2 text-slate-300 hover:text-red-400 opacity-0 group-hover/opt:opacity-100 transition"><Icons.Trash /></button>
                       </div>
                     ))}
                     <button onClick={() => updateQuestion(idx, {...q, options: [...(q.options||[]), {text: '', is_correct: false}]})} className="text-xs text-emerald-600 font-bold hover:bg-emerald-50 px-3 py-1.5 rounded transition flex items-center gap-1">+ Add Option</button>
                  </div>
                )}
   
                <div className="mt-6 pt-6 border-t border-slate-50">
                   <LatexInput label="Global Explanation / Feedback" value={q.explanation || ''} onChange={v => updateQuestion(idx, {...q, explanation: v})} multiline rows={2} placeholder="Explain the reasoning..." />
                </div>
             </div>
           ))}
           <button onClick={addQuestion} className="w-full py-6 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-200/50 transition flex items-center justify-center gap-2 group transform active:scale-[0.99]">
             <span className="bg-slate-700 rounded-full p-1 group-hover:bg-slate-600 transition-colors"><Icons.Plus /></span> Add Question
           </button>
         </div>
       </div>
     );
};
