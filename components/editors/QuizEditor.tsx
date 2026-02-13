
import React from 'react';
import { Quiz, QuizQuestion } from '../../types';
import { LatexInput } from '../EditorFields';
import { Icons } from './EditorIcons';
import { EditorProps } from './EditorUtils';

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
