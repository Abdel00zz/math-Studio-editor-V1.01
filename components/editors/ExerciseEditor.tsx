
import React, { useState } from 'react';
import { Exercise, Question, MediaData } from '../../types';
import { LatexInput } from '../EditorFields';
import { MathPreview } from '../MathPreview';
import { GraphPreview } from '../GraphPreview';
import { Icons } from './EditorIcons';
import { MediaModal } from './MediaModal';
import { EditorProps, findGraphCode } from './EditorUtils';

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
