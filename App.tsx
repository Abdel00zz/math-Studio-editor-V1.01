
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Manifest, ClassData, ProjectState, VirtualFile, ContentType, Exercise, Revision, Quiz, FileSystemDirectoryHandle, FileSystemHandle, FileSystemFileHandle } from './types';
import { ExerciseEditor, RevisionEditor, QuizEditor } from './components/Editors';

// --- Icons ---
const Icons = {
  Menu: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  Close: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Plus: () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>,
  Minus: () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>,
  Folder: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>,
  File: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Puzzle: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>,
  Undo: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>,
  Redo: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" /></svg>,
  Graph: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>,
  Upload: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
  Save: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>,
  Disk: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg> // Placeholder for save icon if needed, reusing upload for now
};

const SaveIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>;
const DiskIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17a5 5 0 01-.916-9.916 5.002 5.002 0 019.832 0A5.002 5.002 0 0116 17m-7-5l3-3m0 0l3 3m-3-3v12" /></svg>; // Actually Cloud upload or Disk
const RealDiskIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>;

const SaveDiskIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2h2m3-4H9a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-3.172a2 2 0 01-1.414-.586l-.828-.828A2 2 0 009.172 2H9z" /></svg>;

// Robust check to guess file type
const detectType = (json: any): ContentType => {
  if (json.header && json.sections) return 'revision';
  if (json.metadata && json.questions) return 'quiz';
  if (json.questions && Array.isArray(json.questions)) return 'exercise';
  return 'unknown';
};

// Polyfill check for File System Access API
const supportsFileSystemAccess = 'showDirectoryPicker' in window;

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

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [manifestCandidates, setManifestCandidates] = useState<VirtualFile[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  // History State for Undo/Redo
  const [history, setHistory] = useState<{past: ProjectState[], future: ProjectState[]}>({ past: [], future: [] });

  const directoryInputRef = useRef<HTMLInputElement>(null);
  const graphDirectoryInputRef = useRef<HTMLInputElement>(null);

  // --- Helper: Toggle Tree Nodes ---
  const toggleNode = (id: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // --- File System Handlers ---

  // Standard Upload (Read-only / Download to save)
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
      const vFile: VirtualFile = {
        path,
        name: file.name,
        content: text,
        isDir: false
      };
      
      filesMap.set(path, vFile);

      if (file.name.endsWith('.json')) {
        jsonFiles.push(vFile);
        if (file.name === 'manifest.json' && !manifestData) {
           try {
             manifestData = JSON.parse(text);
           } catch (e) { console.warn("Found manifest.json but invalid", e); }
        }
      }
    }

    finishLoad(filesMap, manifestData, jsonFiles, 'readonly');
  };

  // Native File System Access (Live Edit)
  const handleNativeFolderOpen = async () => {
    try {
      // @ts-ignore - TS might not know showDirectoryPicker yet
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

  const processDirectoryHandle = async (
    dirHandle: FileSystemDirectoryHandle, 
    pathPrefix: string, 
    filesMap: Map<string, VirtualFile>,
    jsonFiles: VirtualFile[],
    setManifest: (m: Manifest) => void
  ) => {
    for await (const entry of dirHandle.values()) {
      const entryPath = pathPrefix ? `${pathPrefix}/${entry.name}` : entry.name;
      
      if (entry.kind === 'file') {
        if (entry.name.includes('.DS_Store') || entry.name.startsWith('.')) continue;
        
        const fileHandle = entry as FileSystemFileHandle;
        const file = await fileHandle.getFile();
        const text = await file.text();
        
        const vFile: VirtualFile = {
          path: entryPath,
          name: entry.name,
          content: text,
          isDir: false,
          handle: fileHandle // Store the handle!
        };
        
        filesMap.set(entryPath, vFile);

        if (entry.name.endsWith('.json')) {
          jsonFiles.push(vFile);
          if (entry.name === 'manifest.json') {
             try {
               setManifest(JSON.parse(text));
             } catch (e) { console.warn("Invalid manifest", e); }
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
      setProject(prev => ({
        ...prev,
        manifest: manifestData,
        files: filesMap,
        activePath: null,
        unsavedChanges: new Set(),
        mode
      }));
      setManifestCandidates([]);
    } else {
      if (jsonFiles.length === 0) {
        alert("No JSON files found in this folder.");
        return;
      }
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
        const vFile: VirtualFile = {
            path,
            name: file.name,
            content: text,
            isDir: false
        };

        if (file.name === 'graphs-index.json') {
             try {
                 graphIndexData = JSON.parse(text);
             } catch (e) { console.warn("Invalid graphs-index.json", e); }
        }

        graphFilesMap.set(path, vFile);
        graphFilesMap.set(file.name.replace(/\.(ts|js)$/, ''), vFile); 
     }
     
     setProject(prev => ({
         ...prev,
         graphFiles: graphFilesMap,
         graphIndex: graphIndexData || prev.graphIndex
     }));
     
     alert(`Graph Library loaded! ${graphFilesMap.size / 2} graphs indexed.`);
  };

  const selectManifest = (file: VirtualFile) => {
    try {
      const data = JSON.parse(file.content);
      if (!data.classes && !Array.isArray(data.classes)) {
        if(!confirm("This file doesn't look like a valid manifest (missing 'classes' array). Load anyway?")) return;
      }
      setProject(p => ({
        ...p,
        manifest: data,
        activePath: null,
        unsavedChanges: new Set()
      }));
      setManifestCandidates([]);
    } catch (e) {
      alert("Failed to parse selected file as JSON.");
    }
  };

  const loadFile = (path: string) => {
    let foundKey: string | undefined;
    if (project.files.has(path)) foundKey = path;
    else {
      // Fuzzy search
      for (const key of project.files.keys()) {
        if (key.endsWith(path) || (path.startsWith('./') && key.endsWith(path.slice(2)))) {
          foundKey = key;
          break;
        }
      }
    }

    if (foundKey) {
      setProject(p => ({ ...p, activePath: foundKey! }));
      if (window.innerWidth < 768) setSidebarOpen(false);
    } else {
      console.warn(`File not found in index: ${path}`);
    }
  };

  const handleSaveContent = useCallback((newContentObj: any) => {
    if (!project.activePath) return;
    const jsonString = JSON.stringify(newContentObj, null, 2);
    
    setProject(currentProject => {
      const activePath = currentProject.activePath;
      if (!activePath) return currentProject;

      // Push history
      setHistory(h => ({
        past: [...h.past, currentProject],
        future: []
      }));

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
    
    setHistory({
      past: newPast,
      future: [project, ...history.future]
    });
    setProject(previous);
  };

  const redo = () => {
    if (history.future.length === 0) return;
    const next = history.future[0];
    const newFuture = history.future.slice(1);

    setHistory({
      past: [...history.past, project],
      future: newFuture
    });
    setProject(next);
  };

  const performSave = async () => {
    if (!project.activePath) return;
    const file = project.files.get(project.activePath);
    if (!file) return;

    if (project.mode === 'live' && file.handle) {
      // Write directly to disk
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
        
        // Visual feedback could be added here (toast)
        setTimeout(() => setIsSaving(false), 500);
      } catch (e) {
        console.error("Save failed", e);
        alert("Failed to save to disk. Permission denied or file locked.");
        setIsSaving(false);
      }
    } else {
      // Fallback download
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

  // --- Screens ---

  // 1. Manifest Selection Screen
  if (manifestCandidates.length > 0) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
         <div className="max-w-2xl w-full bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Select Project Manifest</h2>
            <p className="text-slate-500 mb-6">Select the entry point file for your project.</p>
            <div className="max-h-[400px] overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white">
               {manifestCandidates.map((f) => (
                 <button key={f.path} onClick={() => selectManifest(f)} className="w-full text-left px-4 py-3 hover:bg-indigo-50 flex justify-between items-center group transition-colors">
                   <div>
                     <div className="font-mono text-sm font-semibold text-slate-700 group-hover:text-indigo-700">{f.name}</div>
                     <div className="text-[10px] text-slate-400 truncate max-w-md">{f.path}</div>
                   </div>
                   <span className="text-indigo-600 opacity-0 group-hover:opacity-100 text-sm font-bold px-2">Select &rarr;</span>
                 </button>
               ))}
            </div>
            <div className="mt-6 flex justify-between items-center">
               <button onClick={() => { setManifestCandidates([]); setProject(p => ({...p, files: new Map()})); }} className="text-slate-400 hover:text-slate-600 text-sm font-medium">Cancel</button>
            </div>
         </div>
      </div>
    );
  }

  // 2. Initial Upload Screen
  if (!project.manifest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
           <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-white shadow-2xl shadow-indigo-200/50 mb-8 border border-white/50 backdrop-blur-sm relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                 <span className="text-5xl bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-purple-600 font-black select-none">M+</span>
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Math<span className="text-indigo-600">+</span> Studio</h1>
              <p className="text-lg text-slate-500 font-medium">Ultra-modern editor for mathematical curricula.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {supportsFileSystemAccess ? (
                 <div 
                   className="bg-white rounded-3xl p-8 shadow-xl shadow-indigo-100 border border-indigo-100 cursor-pointer hover:border-indigo-400 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group text-center relative overflow-hidden"
                   onClick={handleNativeFolderOpen}
                 >
                    <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl uppercase tracking-widest">Recommended</div>
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <SaveDiskIcon />
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg mb-2">Open Project (Live Edit)</h3>
                    <p className="text-sm text-slate-400">Directly edit files on your disk. Changes are saved instantly.</p>
                 </div>
              ) : null}

              <div 
                 className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 cursor-pointer hover:border-slate-400 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group text-center"
                 onClick={() => directoryInputRef.current?.click()}
              >
                  <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icons.Folder />
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg mb-2">Standard Upload</h3>
                  <p className="text-sm text-slate-400">Load a folder in memory. You must download files to save them.</p>
              </div>
           </div>

           <div className={`mt-6 mx-auto max-w-sm ${project.graphFiles.size > 0 ? 'opacity-50' : ''}`}>
              <div 
                 className={`bg-white/50 rounded-2xl p-4 border border-slate-200 cursor-pointer hover:border-emerald-300 hover:bg-white transition-all duration-300 group flex items-center gap-4`}
                 onClick={() => graphDirectoryInputRef.current?.click()}
              >
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <Icons.Graph />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-slate-800 text-sm">Graphs Library</h3>
                    <p className="text-[10px] text-slate-400">
                      {project.graphFiles.size > 0 ? `${project.graphFiles.size / 2} Graphs Loaded ✓` : "Optional: Load TS graphs."}
                    </p>
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
            
            <div className="mt-12 text-center">
               <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest opacity-50">Version 3.1 • Live Editing Enabled</p>
            </div>
        </div>
      </div>
    );
  }

  // --- Main Editor Logic ---

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
        default: editorContent = <div className="text-center p-10 text-slate-400">Unknown file format</div>;
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
      <aside className={`
        fixed inset-y-0 left-0 z-30 bg-[#0f172a] text-slate-400 flex flex-col transition-all duration-300 ease-in-out border-r border-slate-800
        ${sidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full md:w-0 md:translate-x-0 overflow-hidden'}
      `}>
        {/* Minimal Header */}
        <div className="h-14 flex items-center justify-between px-4 bg-[#0f172a] border-b border-slate-800 shrink-0">
          <div className="font-bold text-slate-200 tracking-tight text-sm truncate flex items-center gap-2">
            <span className="text-indigo-500 font-black">M+</span> Studio
            {project.mode === 'live' && <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[9px] font-bold uppercase border border-indigo-500/30">Live</span>}
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 rounded hover:bg-slate-800 text-slate-500"><Icons.Close /></button>
        </div>
        
        {/* Tree View */}
        <div className={`flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent`}>
           <div className="mb-4">
             <button 
               onClick={() => graphDirectoryInputRef.current?.click()}
               className="w-full py-2 px-3 bg-slate-800/30 border border-dashed border-slate-700 rounded-lg hover:border-emerald-500/50 hover:bg-slate-800 flex items-center gap-2 group transition-all"
             >
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
              <button 
                onClick={() => toggleNode(cls.id)}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-[11px] font-bold text-slate-400 hover:text-white uppercase tracking-wider hover:bg-slate-800/50 rounded transition-colors group"
              >
                <span className="bg-slate-800/50 p-0.5 rounded text-slate-600 group-hover:text-slate-300 transition-colors">{expandedNodes.has(cls.id) ? <Icons.Minus /> : <Icons.Plus />}</span>
                <span className="truncate">{cls.title}</span>
              </button>

              {expandedNodes.has(cls.id) && (
                <div className="ml-2 pl-2 border-l border-slate-800/50 mt-1 space-y-1">
                   {(() => {
                      let classFileKey = '';
                      for (const k of project.files.keys()) if (k.endsWith(cls.path) || k === cls.path) classFileKey = k;
                      
                      if (!classFileKey) return <div className="text-[10px] text-rose-500 px-2 italic">Missing Manifest File</div>;

                      try {
                        const classData = JSON.parse(project.files.get(classFileKey)!.content) as ClassData;
                        return classData.chapters?.map(ch => (
                           <div key={ch.id} className="mb-1">
                              <button 
                                onClick={() => toggleNode(ch.id)}
                                className="w-full flex items-center gap-2 px-2 py-1 text-xs font-medium text-slate-500 hover:text-slate-300 hover:bg-slate-800/30 rounded transition-colors"
                              >
                                <span className="opacity-50 scale-75">{expandedNodes.has(ch.id) ? <Icons.Minus /> : <Icons.Plus />}</span>
                                <span className="truncate text-slate-400">{ch.title}</span>
                              </button>

                              {expandedNodes.has(ch.id) && (
                                <div className="ml-2 space-y-0.5 mt-0.5 animate-in slide-in-from-left-1 duration-200 border-l border-slate-800/30 pl-2">
                                   {ch.revisions?.map(r => (
                                     <button 
                                       key={r.path} 
                                       onClick={() => loadFile(r.path)}
                                       className={`w-full text-left text-[11px] py-1 px-2 rounded-sm flex items-center gap-2 truncate transition-all ${project.activePath?.endsWith(r.path) ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                     >
                                       <span className={`w-1 h-1 rounded-full ${project.activePath?.endsWith(r.path) ? 'bg-white' : 'bg-indigo-500'}`}></span>
                                       {r.path.split('/').pop()?.replace('.json', '')}
                                     </button>
                                   ))}
                                   {ch.exercises?.map(e => (
                                     <button 
                                       key={e.path} 
                                       onClick={() => loadFile(e.path)}
                                       className={`w-full text-left text-[11px] py-1 px-2 rounded-sm flex items-center gap-2 truncate transition-all ${project.activePath?.endsWith(e.path) ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                     >
                                       <span className={`w-1 h-1 rounded-full ${project.activePath?.endsWith(e.path) ? 'bg-white' : 'bg-emerald-500'}`}></span>
                                       {e.path.split('/').pop()?.replace('.json', '')}
                                     </button>
                                   ))}
                                    {ch.quizzes?.map(q => (
                                     <button 
                                       key={q.path} 
                                       onClick={() => loadFile(q.path)}
                                       className={`w-full text-left text-[11px] py-1 px-2 rounded-sm flex items-center gap-2 truncate transition-all ${project.activePath?.endsWith(q.path) ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                     >
                                       <span className={`${project.activePath?.endsWith(q.path) ? 'text-white' : 'text-amber-500'}`}><Icons.Puzzle /></span>
                                       {q.path.split('/').pop()?.replace('.json', '')}
                                     </button>
                                   ))}
                                </div>
                              )}
                           </div>
                        ));
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
        
        {/* Topbar */}
        <header className="h-14 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex justify-between items-center px-4 flex-shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                <Icons.Menu />
             </button>
             <div className="flex flex-col">
               <span className="text-sm font-bold text-slate-800 truncate max-w-[200px] md:max-w-md">
                 {project.activePath ? project.files.get(project.activePath)?.name : 'Welcome'}
               </span>
               {project.activePath && project.unsavedChanges.has(project.activePath) && (
                 <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider flex items-center gap-1 animate-pulse">
                   <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Unsaved
                 </span>
               )}
             </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Undo / Redo */}
            <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
               <button 
                  onClick={undo} 
                  disabled={history.past.length === 0}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded disabled:opacity-30 disabled:cursor-not-allowed transition"
                  title="Undo"
               >
                 <Icons.Undo />
               </button>
               <div className="w-px bg-slate-300 my-1"></div>
               <button 
                  onClick={redo} 
                  disabled={history.future.length === 0}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded disabled:opacity-30 disabled:cursor-not-allowed transition"
                  title="Redo"
               >
                 <Icons.Redo />
               </button>
            </div>

            <button 
              onClick={performSave}
              disabled={!project.activePath || isSaving}
              className={`text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
                ${canLiveSave ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-900 hover:bg-slate-800'}
              `}
            >
              {isSaving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <span className="hidden md:inline">{canLiveSave ? 'Save to Disk' : 'Download'}</span>
                  {canLiveSave ? <SaveDiskIcon /> : <Icons.Upload />}
                </>
              )}
            </button>
          </div>
        </header>

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
           <div className="max-w-5xl mx-auto h-full">
             {editorContent}
           </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 md:hidden animate-in fade-in"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default App;
