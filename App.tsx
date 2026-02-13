
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Manifest, ClassData, ProjectState, VirtualFile, ContentType, Exercise, Revision, Quiz, FileSystemDirectoryHandle, FileSystemHandle, FileSystemFileHandle, ContentRef } from './types';
import { ExerciseEditor, RevisionEditor, QuizEditor, Icons } from './components/Editors';

// Polyfill check for File System Access API
const supportsFileSystemAccess = 'showDirectoryPicker' in window && window.self === window.top;

const detectType = (json: any): ContentType => {
  if (json.header && json.sections) return 'revision';
  if (json.metadata && json.questions) return 'quiz';
  if (json.questions && Array.isArray(json.questions)) {
     const hasQuizTypes = json.questions.some((q: any) => 
       ['mcq', 'true-false', 'order', 'error-spotting'].includes(q.type) || q.options || q.correctAnswers
     );
     if (hasQuizTypes) return 'quiz';
     return 'exercise';
  }
  return 'unknown';
};

const App: React.FC = () => {
  const [project, setProject] = useState<ProjectState>({
    manifest: null,
    files: new Map(),
    graphFiles: new Map(),
    graphIndex: null,
    activePath: null,
    unsavedChanges: new Set(),
    mode: 'readonly'
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [manifestCandidates, setManifestCandidates] = useState<VirtualFile[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [history, setHistory] = useState<{past: ProjectState[], future: ProjectState[]}>({ past: [], future: [] });

  const directoryInputRef = useRef<HTMLInputElement>(null);
  const graphDirectoryInputRef = useRef<HTMLInputElement>(null);

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const findFilesByPattern = (pattern: string): VirtualFile[] => {
     const results: VirtualFile[] = [];
     project.files.forEach((file) => {
        if (file.path.includes(pattern) && file.name.endsWith('.json') && !file.name.includes('manifest')) {
           results.push(file);
        }
     });
     return results;
  };

  const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const filesMap = new Map<string, VirtualFile>();
    let manifestData: Manifest | null = null;
    const jsonFiles: VirtualFile[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const path = file.webkitRelativePath || file.name;
      if (path.includes('/.') || path.includes('node_modules')) continue;

      const text = await file.text();
      const vFile: VirtualFile = { path, name: file.name, content: text, isDir: false };
      filesMap.set(path, vFile);

      if (file.name.endsWith('.json')) {
        jsonFiles.push(vFile);
        if (file.name === 'manifest.json' && !manifestData) {
           try { manifestData = JSON.parse(text); } catch (e) { console.warn("Invalid manifest", e); }
        }
      }
    }
    finishLoad(filesMap, manifestData, jsonFiles, 'readonly');
  };

  const handleNativeFolderOpen = async () => {
    try {
      // @ts-ignore
      const dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
      const filesMap = new Map<string, VirtualFile>();
      let manifestData: Manifest | null = null;
      const jsonFiles: VirtualFile[] = [];
      await processDirectoryHandle(dirHandle, '', filesMap, jsonFiles, (man) => manifestData = man);
      finishLoad(filesMap, manifestData, jsonFiles, 'live');
    } catch (e) {
      console.error("Error accessing file system:", e);
      alert("Could not access folder. Check permissions or use Standard Upload.");
    }
  };

  const processDirectoryHandle = async (dirHandle: FileSystemDirectoryHandle, pathPrefix: string, filesMap: Map<string, VirtualFile>, jsonFiles: VirtualFile[], setManifest: (m: Manifest) => void) => {
    for await (const entry of dirHandle.values()) {
      const entryPath = pathPrefix ? `${pathPrefix}/${entry.name}` : entry.name;
      if (entry.kind === 'file') {
        if (entry.name.includes('.DS_Store') || entry.name.startsWith('.')) continue;
        const fileHandle = entry as FileSystemFileHandle;
        const file = await fileHandle.getFile();
        const text = await file.text();
        const vFile: VirtualFile = { path: entryPath, name: entry.name, content: text, isDir: false, handle: fileHandle };
        filesMap.set(entryPath, vFile);
        if (entry.name.endsWith('.json')) {
          jsonFiles.push(vFile);
          if (entry.name === 'manifest.json') {
             try { setManifest(JSON.parse(text)); } catch (e) { console.warn("Invalid manifest", e); }
          }
        }
      } else if (entry.kind === 'directory') {
        if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
        await processDirectoryHandle(entry as FileSystemDirectoryHandle, entryPath, filesMap, jsonFiles, setManifest);
      }
    }
  };

  const finishLoad = (filesMap: Map<string, VirtualFile>, manifestData: Manifest | null, jsonFiles: VirtualFile[], mode: 'readonly' | 'live') => {
    if (manifestData) {
      setProject(prev => ({ ...prev, manifest: manifestData, files: filesMap, activePath: null, unsavedChanges: new Set(), mode }));
      setManifestCandidates([]);
    } else {
      if (jsonFiles.length === 0) { alert("No JSON files found."); return; }
      setManifestCandidates(jsonFiles);
      setProject(prev => ({ ...prev, files: filesMap, mode }));
    }
  };

  const handleGraphFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const fileList = e.target.files;
     if (!fileList || fileList.length === 0) return;
     const graphFilesMap = new Map<string, VirtualFile>();
     let graphIndexData: any = null;
     for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const path = file.webkitRelativePath || file.name;
        if (path.includes('/.') || path.includes('node_modules')) continue;
        const text = await file.text();
        const vFile: VirtualFile = { path, name: file.name, content: text, isDir: false };
        if (file.name === 'graphs-index.json') {
             try { graphIndexData = JSON.parse(text); } catch (e) { console.warn("Invalid graphs-index", e); }
        }
        graphFilesMap.set(path, vFile);
        graphFilesMap.set(file.name.replace(/\.(ts|js)$/, ''), vFile); 
     }
     setProject(prev => ({ ...prev, graphFiles: graphFilesMap, graphIndex: graphIndexData || prev.graphIndex }));
     alert(`Graph Library loaded! ${graphFilesMap.size / 2} graphs indexed.`);
  };

  const selectManifest = (file: VirtualFile) => {
    try {
      const data = JSON.parse(file.content);
      if (!data.classes && !Array.isArray(data.classes)) {
        if(!confirm("Invalid manifest format. Load anyway?")) return;
      }
      setProject(p => ({ ...p, manifest: data, activePath: null, unsavedChanges: new Set() }));
      setManifestCandidates([]);
    } catch (e) { alert("Failed to parse JSON."); }
  };

  const loadFile = (path: string) => {
    let foundKey: string | undefined;
    if (project.files.has(path)) foundKey = path;
    else {
      for (const key of project.files.keys()) {
        if (key.endsWith(path) || (path.startsWith('./') && key.endsWith(path.slice(2)))) {
          foundKey = key; break;
        }
      }
    }
    if (foundKey) {
      setProject(p => ({ ...p, activePath: foundKey! }));
      if (window.innerWidth < 768) setSidebarOpen(false);
    } else {
      console.warn(`File not found: ${path}`);
    }
  };

  const handleSaveContent = useCallback((newContentObj: any) => {
    if (!project.activePath) return;
    const jsonString = JSON.stringify(newContentObj, null, 2);
    setProject(currentProject => {
      const activePath = currentProject.activePath;
      if (!activePath) return currentProject;
      setHistory(h => ({ past: [...h.past, currentProject], future: [] }));
      const newFiles = new Map<string, VirtualFile>(currentProject.files);
      const currentFile = newFiles.get(activePath);
      if (currentFile) {
        newFiles.set(activePath, { ...currentFile, content: jsonString });
        const newUnsaved = new Set(currentProject.unsavedChanges);
        newUnsaved.add(activePath);
        return { ...currentProject, files: newFiles, unsavedChanges: newUnsaved };
      }
      return currentProject;
    });
  }, [project.activePath]);

  const undo = () => {
    if (history.past.length === 0) return;
    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, -1);
    setHistory({ past: newPast, future: [project, ...history.future] });
    setProject(previous);
  };

  const redo = () => {
    if (history.future.length === 0) return;
    const next = history.future[0];
    const newFuture = history.future.slice(1);
    setHistory({ past: [...history.past, project], future: newFuture });
    setProject(next);
  };

  const performSave = async () => {
    if (!project.activePath) return;
    const file = project.files.get(project.activePath);
    if (!file) return;
    if (project.mode === 'live' && file.handle) {
      try {
        setIsSaving(true);
        const writable = await file.handle.createWritable();
        await writable.write(file.content);
        await writable.close();
        setProject(p => {
          const next = new Set(p.unsavedChanges);
          next.delete(p.activePath!);
          return { ...p, unsavedChanges: next };
        });
        setTimeout(() => setIsSaving(false), 500);
      } catch (e) {
        alert("Save failed. Permission denied or file locked.");
        setIsSaving(false);
      }
    } else {
      const blob = new Blob([file.content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setProject(p => {
         const next = new Set(p.unsavedChanges);
         next.delete(p.activePath!);
         return { ...p, unsavedChanges: next };
      });
    }
  };

  // --- RENDERING ---

  if (manifestCandidates.length > 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
         <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Manifest Selection</h2>
            <p className="text-slate-500 mb-6">Which file serves as the entry point?</p>
            <div className="max-h-[400px] overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-50 bg-slate-50">
               {manifestCandidates.map((f) => (
                 <button key={f.path} onClick={() => selectManifest(f)} className="w-full text-left px-4 py-3 hover:bg-white flex justify-between items-center group transition-all">
                   <div>
                     <div className="font-mono text-sm font-semibold text-slate-700 group-hover:text-indigo-600">{f.name}</div>
                     <div className="text-[10px] text-slate-400 truncate max-w-md">{f.path}</div>
                   </div>
                   <span className="text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                 </button>
               ))}
            </div>
            <button onClick={() => { setManifestCandidates([]); setProject(p => ({...p, files: new Map()})); }} className="mt-6 text-slate-400 hover:text-slate-600 text-sm">Cancel</button>
         </div>
      </div>
    );
  }

  // --- NEW LANDING PAGE ---
  if (!project.manifest) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col relative overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-700">
        
        {/* Background Mesh Gradient */}
        <div className="absolute top-0 left-0 right-0 h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/50 via-slate-50/20 to-transparent pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-48 -left-24 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl pointer-events-none"></div>

        <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-200">M+</div>
             <span className="font-bold text-lg tracking-tight text-slate-800">Studio</span>
           </div>
           <div className="text-xs font-medium text-slate-400 uppercase tracking-widest">v3.3.0</div>
        </nav>

        <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 max-w-7xl mx-auto w-full">
           <div className="text-center mb-16 max-w-2xl mx-auto animate-in slide-in-from-bottom-8 duration-700 fade-in">
              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                 Curriculum <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Reimagined.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-500 leading-relaxed">
                The advanced editor for structured mathematical content. <br className="hidden md:block"/>
                JSON-based, LaTeX-powered, and built for performance.
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl animate-in slide-in-from-bottom-8 duration-700 delay-150 fade-in fill-mode-backwards">
              
              {/* Card 1: Standard Upload */}
              <div 
                onClick={() => directoryInputRef.current?.click()}
                className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 cursor-pointer overflow-hidden"
              >
                 <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                 </div>
                 <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 mb-6 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                       <Icons.Folder />
                    </div>
                    <div>
                       <h3 className="text-xl font-bold text-slate-900 mb-2">Standard Load</h3>
                       <p className="text-sm text-slate-500 leading-relaxed">Load a local folder into memory. Ideal for quick edits and single exports.</p>
                    </div>
                 </div>
              </div>

              {/* Card 2: Live Edit */}
              {supportsFileSystemAccess && (
              <div 
                onClick={handleNativeFolderOpen}
                className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-300 border border-slate-100 cursor-pointer overflow-hidden ring-1 ring-transparent hover:ring-indigo-100"
              >
                 <div className="absolute top-4 right-4">
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                    </span>
                 </div>
                 <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div>
                       <h3 className="text-xl font-bold text-slate-900 mb-2">Live Workspace</h3>
                       <p className="text-sm text-slate-500 leading-relaxed">Direct disk access. Edits are saved instantly to your file system.</p>
                    </div>
                 </div>
              </div>
              )}

              {/* Card 3: Graph Library */}
              <div 
                onClick={() => graphDirectoryInputRef.current?.click()}
                className={`group relative bg-slate-50 rounded-3xl p-8 shadow-inner border border-slate-100 cursor-pointer transition-all duration-300 ${project.graphFiles.size > 0 ? 'opacity-60 grayscale' : 'hover:bg-white hover:shadow-lg'}`}
              >
                 <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 mb-6 border border-slate-100 group-hover:border-emerald-100 group-hover:bg-emerald-50 transition-colors">
                       <Icons.Graph />
                    </div>
                    <div>
                       <h3 className="text-xl font-bold text-slate-900 mb-2">Graph Library</h3>
                       <p className="text-sm text-slate-500 leading-relaxed">
                         {project.graphFiles.size > 0 
                           ? `${project.graphFiles.size / 2} graphs indexed & ready.` 
                           : "Load your JSXGraph collection (optional)."}
                       </p>
                    </div>
                 </div>
              </div>
           </div>
           
           <input type="file" ref={directoryInputRef} onChange={handleFolderUpload} className="hidden" 
              // @ts-ignore
              webkitdirectory="" directory="" multiple="" 
            />
            <input type="file" ref={graphDirectoryInputRef} onChange={handleGraphFolderUpload} className="hidden" 
              // @ts-ignore
              webkitdirectory="" directory="" multiple="" 
            />

           <footer className="mt-20 text-center text-slate-400 text-sm font-medium">
             <p>© 2024 Math+ Studio. Optimized for Chrome & Edge.</p>
           </footer>
        </main>
      </div>
    );
  }

  // --- MAIN EDITOR ---

  let editorContent = null;
  let activeFile = project.activePath ? project.files.get(project.activePath) : null;

  if (activeFile) {
    try {
      const parsedContent = JSON.parse(activeFile.content);
      const type = detectType(parsedContent);
      switch (type) {
        case 'exercise': editorContent = <ExerciseEditor data={parsedContent as Exercise} onChange={handleSaveContent} graphFiles={project.graphFiles} graphIndex={project.graphIndex} />; break;
        case 'revision': editorContent = <RevisionEditor data={parsedContent as Revision} onChange={handleSaveContent} graphFiles={project.graphFiles} graphIndex={project.graphIndex} />; break;
        case 'quiz': editorContent = <QuizEditor data={parsedContent as Quiz} onChange={handleSaveContent} graphFiles={project.graphFiles} graphIndex={project.graphIndex} />; break;
        default: editorContent = <div className="text-center p-10 text-slate-400">Unknown file format. Detected: {type}</div>;
      }
    } catch (e) {
      editorContent = <div className="text-center p-10 text-rose-500 font-bold">Invalid JSON Syntax</div>;
    }
  } else {
    editorContent = (
      <div className="flex flex-col items-center justify-center h-full text-slate-300">
        <div className="w-32 h-32 bg-slate-100 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner"><Icons.Folder /></div>
        <p className="text-xl font-bold text-slate-400 mb-2">No file selected</p>
        <p className="text-sm text-slate-300">Select a file from the sidebar to start editing</p>
      </div>
    );
  }

  const canLiveSave = project.mode === 'live' && activeFile?.handle;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 bg-[#0f172a] text-slate-400 flex flex-col transition-all duration-300 ease-in-out border-r border-slate-800 ${sidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full md:w-0 md:translate-x-0 overflow-hidden'}`}>
        <div className="h-14 flex items-center justify-between px-4 bg-[#0f172a] border-b border-slate-800 shrink-0">
          <div className="font-bold text-slate-200 tracking-tight text-sm truncate flex items-center gap-2">
            <span className="text-indigo-500 font-black">M+</span> Studio
            {project.mode === 'live' && <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[9px] font-bold uppercase border border-indigo-500/30">Live</span>}
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 rounded hover:bg-slate-800 text-slate-500"><Icons.Close /></button>
        </div>
        
        <div className={`flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent`}>
           <div className="mb-4">
             <button onClick={() => graphDirectoryInputRef.current?.click()} className="w-full py-2 px-3 bg-slate-800/30 border border-dashed border-slate-700 rounded-lg hover:border-emerald-500/50 hover:bg-slate-800 flex items-center gap-2 group transition-all">
                <span className={`text-emerald-500 ${project.graphFiles.size > 0 ? '' : 'opacity-50'}`}><Icons.Graph /></span>
                <span className="text-xs font-bold text-slate-400 group-hover:text-slate-200">Load Graphs</span>
             </button>
             <input type="file" ref={graphDirectoryInputRef} onChange={handleGraphFolderUpload} className="hidden" 
                // @ts-ignore
                webkitdirectory="" directory="" multiple="" 
             />
           </div>

          {project.manifest && project.manifest.classes.map(cls => (
            <div key={cls.id} className="mb-1">
              <button onClick={() => toggleNode(cls.id)} className="w-full flex items-center gap-2 px-2 py-1.5 text-[11px] font-bold text-slate-400 hover:text-white uppercase tracking-wider hover:bg-slate-800/50 rounded transition-colors group">
                <span className="bg-slate-800/50 p-0.5 rounded text-slate-600 group-hover:text-slate-300 transition-colors">{expandedNodes.has(cls.id) ? <Icons.Minus /> : <Icons.Plus />}</span>
                <span className="truncate">{cls.title}</span>
              </button>
              {expandedNodes.has(cls.id) && (
                <div className="ml-2 pl-2 border-l border-slate-800/50 mt-1 space-y-1">
                   {(() => {
                      let classFileKey = '';
                      for (const k of project.files.keys()) if (k.endsWith(cls.path) || k === cls.path) classFileKey = k;
                      if (!classFileKey) return <div className="text-[10px] text-rose-500 px-2 italic">Missing Manifest</div>;
                      try {
                        const classData = JSON.parse(project.files.get(classFileKey)!.content) as ClassData;
                        return classData.chapters?.map(ch => {
                           // Auto-discovery logic
                           const chapterPathSeg = `/${ch.id}/`;
                           const quizFiles = findFilesByPattern(`${chapterPathSeg}quiz/`);
                           const autoQuizzes: ContentRef[] = quizFiles.map(f => ({ id: f.name.replace('.json',''), title: f.name.replace('.json','').replace(/_/g, ' '), path: f.path }));
                           const existingQuizzes = ch.quizzes || [];
                           const allQuizzes = [...existingQuizzes];
                           autoQuizzes.forEach(aq => { if (!allQuizzes.find(eq => eq.path === aq.path || eq.path.endsWith(aq.path))) allQuizzes.push(aq); });

                           return (
                           <div key={ch.id} className="mb-1">
                              <button onClick={() => toggleNode(ch.id)} className="w-full flex items-center gap-2 px-2 py-1 text-xs font-medium text-slate-500 hover:text-slate-300 hover:bg-slate-800/30 rounded transition-colors">
                                <span className="opacity-50 scale-75">{expandedNodes.has(ch.id) ? <Icons.Minus /> : <Icons.Plus />}</span>
                                <span className="truncate text-slate-400">{ch.title}</span>
                              </button>
                              {expandedNodes.has(ch.id) && (
                                <div className="ml-2 space-y-0.5 mt-0.5 animate-in slide-in-from-left-1 duration-200 border-l border-slate-800/30 pl-2">
                                   {ch.revisions?.map(r => (
                                     <button key={r.path} onClick={() => loadFile(r.path)} className={`w-full text-left text-[11px] py-1 px-2 rounded-sm flex items-center gap-2 truncate transition-all ${project.activePath?.endsWith(r.path) ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                                       <span className={`w-1 h-1 rounded-full ${project.activePath?.endsWith(r.path) ? 'bg-white' : 'bg-indigo-500'}`}></span>
                                       {r.title || r.path.split('/').pop()?.replace('.json', '')}
                                     </button>
                                   ))}
                                   {ch.exercises?.map(e => (
                                     <button key={e.path} onClick={() => loadFile(e.path)} className={`w-full text-left text-[11px] py-1 px-2 rounded-sm flex items-center gap-2 truncate transition-all ${project.activePath?.endsWith(e.path) ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                                       <span className={`w-1 h-1 rounded-full ${project.activePath?.endsWith(e.path) ? 'bg-white' : 'bg-emerald-500'}`}></span>
                                       {e.title || e.path.split('/').pop()?.replace('.json', '')}
                                     </button>
                                   ))}
                                   {allQuizzes.map(q => (
                                     <button key={q.path} onClick={() => loadFile(q.path)} className={`w-full text-left text-[11px] py-1 px-2 rounded-sm flex items-center gap-2 truncate transition-all ${project.activePath?.endsWith(q.path) ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                                       <span className={`${project.activePath?.endsWith(q.path) ? 'text-white' : 'text-amber-500'}`}><Icons.Puzzle /></span>
                                       {q.title || q.path.split('/').pop()?.replace('.json', '')}
                                     </button>
                                   ))}
                                </div>
                              )}
                           </div>
                        )});
                      } catch (e) { return null; }
                   })()}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col h-full overflow-hidden relative bg-slate-50 transition-all duration-300 ${sidebarOpen ? 'md:ml-72' : 'ml-0'}`}>
        <header className="h-14 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex justify-between items-center px-4 flex-shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"><Icons.Menu /></button>
             <div className="flex flex-col">
               <span className="text-sm font-bold text-slate-800 truncate max-w-[200px] md:max-w-md">{project.activePath ? project.files.get(project.activePath)?.name : 'Welcome'}</span>
               {project.activePath && project.unsavedChanges.has(project.activePath) && <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider flex items-center gap-1 animate-pulse"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Unsaved</span>}
             </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
               <button onClick={undo} disabled={history.past.length === 0} className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded disabled:opacity-30 disabled:cursor-not-allowed transition" title="Undo"><Icons.Undo /></button>
               <div className="w-px bg-slate-300 my-1"></div>
               <button onClick={redo} disabled={history.future.length === 0} className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded disabled:opacity-30 disabled:cursor-not-allowed transition" title="Redo"><Icons.Redo /></button>
            </div>
            <button onClick={performSave} disabled={!project.activePath || isSaving} className={`text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${canLiveSave ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-900 hover:bg-slate-800'}`}>
              {isSaving ? <span>Saving...</span> : <><span className="hidden md:inline">{canLiveSave ? 'Save to Disk' : 'Download'}</span>{canLiveSave ? <Icons.Disk /> : <Icons.Upload />}</>}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
           <div className="max-w-5xl mx-auto h-full">{editorContent}</div>
        </div>
      </main>

      {sidebarOpen && <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 md:hidden animate-in fade-in" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  );
};

export default App;
