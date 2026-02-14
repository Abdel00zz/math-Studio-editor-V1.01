
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Manifest, ClassData, ProjectState, VirtualFile, ContentType, Exercise, Revision, Quiz, FileSystemDirectoryHandle, FileSystemHandle, FileSystemFileHandle, ContentRef } from './types';
import { ExerciseEditor, RevisionEditor, QuizEditor, Icons } from './components/Editors';

const supportsFileSystemAccess = 'showDirectoryPicker' in window && window.self === window.top;

const detectType = (json: any): ContentType => {
  if (json.header && json.sections) return 'revision';
  if (json.metadata && json.questions) return 'quiz';
  if (json.questions && Array.isArray(json.questions)) {
     const hasQuizTypes = json.questions.some((q: any) => 
       ['mcq', 'true-false', 'order', 'error-spotting'].includes(q.type) || q.options || q.correctAnswers || q.isTrue !== undefined
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

  // Amélioration de la recherche de fichiers (plus flexible sur les chemins)
  const findFilesByPattern = (chapterId: string, typeFolder: string): VirtualFile[] => {
     const results: VirtualFile[] = [];
     const normalizedId = chapterId.toLowerCase();
     project.files.forEach((file) => {
        const path = file.path.toLowerCase();
        if (path.includes(`/${normalizedId}/`) && path.includes(`/${typeFolder}/`) && file.name.endsWith('.json') && !file.name.includes('manifest')) {
           results.push(file);
        }
     });
     return results;
  };

  const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const filesMap = new Map<string, VirtualFile>();
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
      }
    }
    
    // On laisse toujours l'utilisateur choisir si plusieurs manifests ou aucun manifest.json exact à la racine
    const manifests = jsonFiles.filter(f => f.name.includes('manifest'));
    if (manifests.length === 1) {
       selectManifest(manifests[0], filesMap, 'readonly');
    } else {
       setProject(p => ({ ...p, files: filesMap, mode: 'readonly' }));
       setManifestCandidates(jsonFiles);
    }
  };

  // Fix: Added missing handleGraphFolderUpload function to resolve "Cannot find name 'handleGraphFolderUpload'" error
  const handleGraphFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const graphFilesMap = new Map<string, VirtualFile>();

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const path = file.webkitRelativePath || file.name;
      if (path.includes('/.') || path.includes('node_modules')) continue;

      // Filter for TypeScript/JavaScript graph configuration files
      if (file.name.endsWith('.ts') || file.name.endsWith('.js')) {
        const text = await file.text();
        const vFile: VirtualFile = { path, name: file.name, content: text, isDir: false };
        graphFilesMap.set(path, vFile);
      }
    }
    
    setProject(p => ({ ...p, graphFiles: graphFilesMap }));
  };

  const handleNativeFolderOpen = async () => {
    try {
      // @ts-ignore
      const dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
      const filesMap = new Map<string, VirtualFile>();
      const jsonFiles: VirtualFile[] = [];
      await processDirectoryHandle(dirHandle, '', filesMap, jsonFiles);
      
      const manifests = jsonFiles.filter(f => f.name.includes('manifest'));
      if (manifests.length === 1) {
         selectManifest(manifests[0], filesMap, 'live');
      } else {
         setProject(p => ({ ...p, files: filesMap, mode: 'live' }));
         setManifestCandidates(jsonFiles);
      }
    } catch (e) {
      console.error("Error accessing file system:", e);
    }
  };

  const processDirectoryHandle = async (dirHandle: FileSystemDirectoryHandle, pathPrefix: string, filesMap: Map<string, VirtualFile>, jsonFiles: VirtualFile[]) => {
    for await (const entry of dirHandle.values()) {
      const entryPath = pathPrefix ? `${pathPrefix}/${entry.name}` : entry.name;
      if (entry.kind === 'file') {
        if (entry.name.startsWith('.')) continue;
        const fileHandle = entry as FileSystemFileHandle;
        const file = await fileHandle.getFile();
        const text = await file.text();
        const vFile: VirtualFile = { path: entryPath, name: entry.name, content: text, isDir: false, handle: fileHandle };
        filesMap.set(entryPath, vFile);
        if (entry.name.endsWith('.json')) jsonFiles.push(vFile);
      } else if (entry.kind === 'directory') {
        if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
        await processDirectoryHandle(entry as FileSystemDirectoryHandle, entryPath, filesMap, jsonFiles);
      }
    }
  };

  const selectManifest = (file: VirtualFile, filesMap?: Map<string, VirtualFile>, modeOverride?: 'live' | 'readonly') => {
    try {
      const data = JSON.parse(file.content);
      
      // Fix: Auto-discover graph files from the provided map if it exists to populate the graph library automatically
      const sourceMap = filesMap || project.files;
      const discoveredGraphs = new Map<string, VirtualFile>();
      sourceMap.forEach((f, p) => {
        if (p.endsWith('.ts') || p.endsWith('.js')) discoveredGraphs.set(p, f);
      });

      setProject(p => ({ 
        ...p, 
        manifest: data, 
        files: filesMap || p.files,
        graphFiles: discoveredGraphs.size > 0 ? discoveredGraphs : p.graphFiles,
        mode: modeOverride || p.mode,
        activePath: null, 
        unsavedChanges: new Set() 
      }));
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
    setHistory({ past: history.past.slice(0, -1), future: [project, ...history.future] });
    setProject(previous);
  };

  const redo = () => {
    if (history.future.length === 0) return;
    const next = history.future[0];
    setHistory({ past: [...history.past, project], future: history.future.slice(1) });
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
      } catch (e) { alert("Save failed."); setIsSaving(false); }
    } else {
      const blob = new Blob([file.content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = file.name;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setProject(p => {
         const next = new Set(p.unsavedChanges);
         next.delete(p.activePath!);
         return { ...p, unsavedChanges: next };
      });
    }
  };

  if (manifestCandidates.length > 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
         <div className="max-w-2xl w-full bg-white rounded-[2rem] shadow-2xl p-10 border border-slate-100">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Configuration du Projet</h2>
              <p className="text-slate-500 font-medium">Veuillez sélectionner le fichier <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600">manifest.json</code> qui servira d'index pour votre structure de cours.</p>
            </div>
            <div className="max-h-[400px] overflow-y-auto border border-slate-100 rounded-2xl divide-y divide-slate-50 bg-slate-50/50">
               {manifestCandidates.map((f) => (
                 <button key={f.path} onClick={() => selectManifest(f)} className="w-full text-left px-6 py-4 hover:bg-white flex justify-between items-center group transition-all">
                   <div className="overflow-hidden">
                     <div className="font-mono text-sm font-bold text-slate-700 group-hover:text-indigo-600 truncate">{f.name}</div>
                     <div className="text-[10px] text-slate-400 truncate mt-1">{f.path}</div>
                   </div>
                   <span className="shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">→</span>
                 </button>
               ))}
            </div>
            <button onClick={() => { setManifestCandidates([]); setProject(p => ({...p, files: new Map()})); }} className="mt-8 text-slate-400 hover:text-slate-600 text-sm font-bold uppercase tracking-widest transition-colors w-full text-center">Annuler l'importation</button>
         </div>
      </div>
    );
  }

  if (!project.manifest) {
    return (
      <div className="min-h-screen bg-[#fcfcfd] text-slate-900 flex flex-col relative overflow-hidden font-sans selection:bg-indigo-100">
        <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/40 rounded-full blur-[120px] pointer-events-none"></div>
        
        <nav className="relative z-10 flex justify-between items-center px-10 py-8 max-w-7xl mx-auto w-full">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-2xl">M+</div>
             <span className="font-bold text-xl tracking-tighter text-slate-900">Math+ <span className="text-slate-400 font-medium">Studio</span></span>
           </div>
           <div className="px-4 py-1.5 rounded-full bg-white border border-slate-100 shadow-sm text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Edition Professionnelle v3.4</div>
        </nav>

        <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 max-w-7xl mx-auto w-full">
           <div className="text-center mb-20 animate-in slide-in-from-bottom-10 duration-1000 fade-in">
              <h1 className="text-6xl md:text-8xl font-[900] text-slate-950 mb-8 tracking-[-0.04em] leading-[0.9]">
                 Créer sans <br/>
                 <span className="text-indigo-600 italic">compromis.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-500 font-medium max-w-xl mx-auto leading-relaxed opacity-80">
                L'éditeur ultra-optimisé pour les mathématiques modernes. <br/>
                Structurez vos cours, générez vos quiz et prévisualisez en LaTeX.
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full max-w-5xl animate-in slide-in-from-bottom-10 duration-1000 delay-200 fade-in fill-mode-backwards">
              
              <div 
                onClick={() => directoryInputRef.current?.click()}
                className="md:col-span-4 group relative bg-white rounded-[2.5rem] p-10 shadow-sm hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 border border-slate-100 cursor-pointer overflow-hidden"
              >
                 <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 mb-20 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 group-hover:scale-110">
                    <Icons.Folder />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Chargement Standard</h3>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">Importez un dossier local pour une session d'édition rapide et sécurisée.</p>
                 </div>
              </div>

              {supportsFileSystemAccess && (
              <div 
                onClick={handleNativeFolderOpen}
                className="md:col-span-5 group relative bg-slate-950 rounded-[2.5rem] p-10 shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 cursor-pointer overflow-hidden"
              >
                 <div className="absolute top-6 right-8">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                      <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Temps Réel</span>
                    </div>
                 </div>
                 <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-20 group-hover:bg-indigo-500 transition-all duration-500 group-hover:rotate-12">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Espace de Travail Live</h3>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">L'éditeur se synchronise directement avec vos fichiers sur le disque dur.</p>
                 </div>
              </div>
              )}

              <div 
                onClick={() => graphDirectoryInputRef.current?.click()}
                className="md:col-span-3 group relative bg-white rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 cursor-pointer flex flex-col justify-between"
              >
                 <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <Icons.Graph />
                 </div>
                 <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Graphiques</h3>
                    <p className="text-xs text-slate-400 font-medium">Bibliothèque JSXGraph.</p>
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

           <footer className="mt-32 text-slate-300 text-[10px] font-bold uppercase tracking-[0.3em]">
             Optimisé pour la rapidité • Vercel Ready
           </footer>
        </main>
      </div>
    );
  }

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
        default: editorContent = <div className="text-center p-10 text-slate-400">Format inconnu : {type}</div>;
      }
    } catch (e) {
      editorContent = <div className="text-center p-10 text-rose-500 font-bold">Erreur de syntaxe JSON</div>;
    }
  } else {
    editorContent = (
      <div className="flex flex-col items-center justify-center h-full animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-xl border border-slate-50 text-slate-200">
          <Icons.File />
        </div>
        <p className="text-xl font-black text-slate-900 mb-2 tracking-tight">En attente de sélection</p>
        <p className="text-sm text-slate-400 font-medium">Choisissez un chapitre dans la barre latérale pour commencer.</p>
      </div>
    );
  }

  const canLiveSave = project.mode === 'live' && activeFile?.handle;

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] text-slate-900 font-sans">
      <aside className={`fixed inset-y-0 left-0 z-30 bg-slate-950 text-slate-400 flex flex-col transition-all duration-300 ease-in-out border-r border-white/5 ${sidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full md:w-0 md:translate-x-0 overflow-hidden'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
          <div className="font-black text-white tracking-tighter text-lg flex items-center gap-2">
            <span className="text-indigo-500">M+</span> Studio
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1.5 rounded-lg hover:bg-white/10 text-slate-500"><Icons.Close /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
           <div className="mb-6 space-y-2">
             <button onClick={() => setProject(p => ({...p, manifest: null, activePath: null}))} className="w-full py-2.5 px-4 bg-white/5 rounded-xl hover:bg-white/10 flex items-center gap-3 transition-all group">
                <span className="text-slate-500 group-hover:text-indigo-400"><Icons.Undo /></span>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Changer Manifeste</span>
             </button>
             <button onClick={() => graphDirectoryInputRef.current?.click()} className="w-full py-2.5 px-4 bg-white/5 border border-dashed border-white/10 rounded-xl hover:bg-white/10 flex items-center gap-3 transition-all group">
                <span className={`text-emerald-500 ${project.graphFiles.size > 0 ? 'animate-pulse' : 'opacity-30'}`}><Icons.Graph /></span>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Bibliothèque Graphique</span>
             </button>
           </div>

          {project.manifest && project.manifest.classes.map(cls => (
            <div key={cls.id} className="mb-3">
              <button onClick={() => toggleNode(cls.id)} className="w-full flex items-center gap-3 px-3 py-2 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors group">
                <span className="bg-white/5 p-1 rounded-md text-slate-600 group-hover:text-slate-300 transition-colors">{expandedNodes.has(cls.id) ? <Icons.Minus /> : <Icons.Plus />}</span>
                <span className="truncate">{cls.title}</span>
              </button>
              {expandedNodes.has(cls.id) && (
                <div className="ml-4 pl-4 border-l border-white/5 mt-2 space-y-1.5">
                   {(() => {
                      let classFileKey = '';
                      for (const k of project.files.keys()) if (k.endsWith(cls.path) || k === cls.path) classFileKey = k;
                      if (!classFileKey) return <div className="text-[10px] text-rose-500/50 px-2 italic">Fichier manquant</div>;
                      try {
                        const classData = JSON.parse(project.files.get(classFileKey)!.content) as ClassData;
                        return classData.chapters?.map(ch => {
                           // Correction de l'auto-discovery (plus robuste)
                           const autoExercises = findFilesByPattern(ch.id, 'exercises');
                           const autoRevisions = findFilesByPattern(ch.id, 'revisions');
                           const autoQuizzes = findFilesByPattern(ch.id, 'quiz');

                           // Fusion intelligentes avec les données du manifeste
                           const allEx = [...(ch.exercises || [])];
                           autoExercises.forEach(ae => { if(!allEx.find(e => e.path.endsWith(ae.name))) allEx.push({ id: ae.name, path: ae.path }); });
                           
                           const allRev = [...(ch.revisions || [])];
                           autoRevisions.forEach(ar => { if(!allRev.find(r => r.path.endsWith(ar.name))) allRev.push({ id: ar.name, path: ar.path }); });

                           const allQuiz = [...(ch.quizzes || [])];
                           autoQuizzes.forEach(aq => { if(!allQuiz.find(q => q.path.endsWith(aq.name))) allQuiz.push({ id: aq.name, path: aq.path }); });

                           return (
                           <div key={ch.id} className="mb-2">
                              <button onClick={() => toggleNode(ch.id)} className="w-full flex items-center gap-3 px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                <span className="opacity-30 scale-75">{expandedNodes.has(ch.id) ? <Icons.Minus /> : <Icons.Plus />}</span>
                                <span className="truncate">{ch.title}</span>
                              </button>
                              {expandedNodes.has(ch.id) && (
                                <div className="ml-4 space-y-1 mt-2 animate-in slide-in-from-left-2 duration-300 border-l border-white/5 pl-4">
                                   {allRev.map(r => (
                                     <button key={r.path} onClick={() => loadFile(r.path)} className={`w-full text-left text-[11px] py-1.5 px-3 rounded-lg flex items-center gap-2 truncate transition-all ${project.activePath?.endsWith(r.path) ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
                                       <span className={`w-1 h-1 rounded-full ${project.activePath?.endsWith(r.path) ? 'bg-white' : 'bg-indigo-50'}`}></span>
                                       {r.id.replace('.json','').replace(/_/g,' ')}
                                     </button>
                                   ))}
                                   {allEx.map(e => (
                                     <button key={e.path} onClick={() => loadFile(e.path)} className={`w-full text-left text-[11px] py-1.5 px-3 rounded-lg flex items-center gap-2 truncate transition-all ${project.activePath?.endsWith(e.path) ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
                                       <span className={`w-1 h-1 rounded-full ${project.activePath?.endsWith(e.path) ? 'bg-white' : 'bg-emerald-500'}`}></span>
                                       {e.id.replace('.json','').replace(/_/g,' ')}
                                     </button>
                                   ))}
                                   {allQuiz.map(q => (
                                     <button key={q.path} onClick={() => loadFile(q.path)} className={`w-full text-left text-[11px] py-1.5 px-3 rounded-lg flex items-center gap-3 truncate transition-all ${project.activePath?.endsWith(q.path) ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
                                       <span className={`${project.activePath?.endsWith(q.path) ? 'text-white' : 'text-amber-500'}`}><Icons.Puzzle /></span>
                                       {q.id.replace('.json','').replace(/_/g,' ')}
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

      <main className={`flex-1 flex flex-col h-full overflow-hidden relative transition-all duration-300 ${sidebarOpen ? 'md:ml-80' : 'ml-0'}`}>
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 flex justify-between items-center px-8 flex-shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-6">
             <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"><Icons.Menu /></button>
             <div className="flex flex-col">
               <span className="text-sm font-black text-slate-900 truncate max-w-[200px] md:max-w-md tracking-tight">{project.activePath ? project.files.get(project.activePath)?.name : 'Tableau de Bord'}</span>
               {project.activePath && project.unsavedChanges.has(project.activePath) && <span className="text-[10px] text-amber-600 font-black uppercase tracking-widest flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Modifications non enregistrées</span>}
             </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200/50 shadow-inner">
               <button onClick={undo} disabled={history.past.length === 0} className="p-2 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg disabled:opacity-20 transition-all" title="Annuler"><Icons.Undo /></button>
               <div className="w-px bg-slate-200 mx-1 my-1.5"></div>
               <button onClick={redo} disabled={history.future.length === 0} className="p-2 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg disabled:opacity-20 transition-all" title="Rétablir"><Icons.Redo /></button>
            </div>
            <button onClick={performSave} disabled={!project.activePath || isSaving} className={`text-white text-xs font-black uppercase tracking-widest px-6 py-2.5 rounded-xl transition-all shadow-xl flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] ${canLiveSave ? 'bg-indigo-600 shadow-indigo-200' : 'bg-slate-950 shadow-slate-200'}`}>
              {isSaving ? <span className="animate-pulse">Enregistrement...</span> : <><span className="hidden md:inline">{canLiveSave ? 'Sauvegarder' : 'Télécharger'}</span>{canLiveSave ? <Icons.Disk /> : <Icons.Upload />}</>}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-12 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent bg-slate-50/30">
           <div className="max-w-5xl mx-auto h-full">{editorContent}</div>
        </div>
      </main>

      {sidebarOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-20 md:hidden animate-in fade-in duration-300" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  );
};

export default App;
