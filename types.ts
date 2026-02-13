
export interface Manifest {
  classes: ClassRef[];
  version?: string;
}

export interface ClassRef {
  id: string;
  title: string;
  path: string;
}

export interface ClassData {
  id: string;
  title: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  section: 'analyse' | 'algebre' | 'geometrie' | 'probabilites' | 'autre';
  exercises?: ContentRef[];
  revisions?: ContentRef[];
  quizzes?: ContentRef[];
  quizCount?: number;
}

export interface ContentRef {
  id: string;
  path: string;
  methodsPath?: string;
  difficulty?: 'facile' | 'moyen' | 'difficile';
}

// --- Content Types ---

export type ContentType = 'exercise' | 'revision' | 'quiz' | 'unknown';

export interface MediaData {
  src: string;
  alt?: string;
  caption?: string;
  width?: string;
  height?: string;
  position?: 'inline' | 'left' | 'right' | 'top' | 'bottom' | 'float-left' | 'float-right' | 'hero';
  style?: {
    frame?: 'none' | 'simple' | 'modern' | 'polaroid';
    shadow?: 'none' | 'sm' | 'md' | 'lg';
  };
}

export interface Exercise {
  id: string;
  topic: string;
  sessionDate?: string;
  requiresRedaction?: boolean;
  context?: string;
  questions: Question[];
}

export interface Question {
  id: string;
  type: 'question' | 'text' | 'partie';
  content: string;
  hint?: string;
  subQuestions?: SubQuestion[];
  media?: MediaData;
  graphId?: string; // Added for graph integration
  graphCaption?: string;
}

export interface SubQuestion {
  id: string;
  content: string;
  hint?: string;
  media?: MediaData;
  graphId?: string; // Added for graph integration
}

export interface Revision {
  header: {
    title: string;
    subtitle?: string;
    context?: string;
  };
  sections: RevisionSection[];
}

export interface RevisionSection {
  id: string;
  title: string;
  category: 'course' | 'method';
  blocks: RevisionBlock[];
}

export interface RevisionBlock {
  type: 'text' | 'definition' | 'theorem' | 'property' | 'example' | 'method' | 'method_principle' | 'method_steps' | 'remark' | 'warning' | 'proof' | 'note' | 'graph' | 'technique' | 'intuition' | 'summary' | 'culture';
  title?: string;
  content: string | string[];
  graphId?: string;
  graphCaption?: string;
  media?: MediaData;
}

export interface Quiz {
  metadata: {
    title: string;
    chapter: string;
    level: string;
    total_questions: number;
  };
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  type: 'mcq' | 'true-false' | 'order' | 'input' | 'error-spotting';
  question: string;
  context?: string;
  section?: string;
  category?: string;
  options?: QuizOption[];
  explanation?: string;
  isTrue?: boolean; // For true-false
  steps?: QuizStep[]; // For error-spotting
  items?: QuizOrderItem[]; // For ordering
  placeholder?: string; // For input
  correctAnswers?: string[]; // For input
}

export interface QuizOption {
  text: string;
  is_correct: boolean;
  explanation?: string;
}

export interface QuizStep {
  id?: string;
  text: string;
  isError: boolean;
  correction?: string;
}

export interface QuizOrderItem {
  id: string;
  text: string;
  correctOrder: number;
}

// --- App State Types ---

// Polyfills for File System Access API
export interface FileSystemHandle {
  kind: 'file' | 'directory';
  name: string;
}

export interface FileSystemFileHandle extends FileSystemHandle {
  kind: 'file';
  getFile(): Promise<File>;
  createWritable(): Promise<FileSystemWritableFileStream>;
}

export interface FileSystemDirectoryHandle extends FileSystemHandle {
  kind: 'directory';
  values(): AsyncIterable<FileSystemHandle>;
}

export interface FileSystemWritableFileStream extends WritableStream {
  write(data: string | BufferSource | Blob): Promise<void>;
  close(): Promise<void>;
}

export interface VirtualFile {
  path: string;
  name: string;
  content: string; // JSON string
  isDir: boolean;
  handle?: FileSystemFileHandle; // Handle for direct disk writing
}

export interface ProjectState {
  manifest: Manifest | null;
  files: Map<string, VirtualFile>; // Content files (JSON)
  graphFiles: Map<string, VirtualFile>; // Graph files (TS)
  graphIndex: any | null; // The parsed graphs-index.json
  activePath: string | null;
  unsavedChanges: Set<string>;
  mode: 'readonly' | 'live'; // New mode to track if we can write to disk
}

// --- Graph Types ---

export type JSXGraphBoard = any;

export interface GeometryGraphConfig {
  type: 'geometry';
  boundingBox?: [number, number, number, number];
  showAxis?: boolean;
  showGrid?: boolean;
  keepAspectRatio?: boolean;
  init: (board: JSXGraphBoard) => void;
}

export interface FunctionGraphConfig {
  f: (x: number) => number | null;
  domain: [number, number];
  range: [number, number];
  steps?: number;
  verticalAsymptotes?: number[];
  otherAsymptotes?: {
    f: (x: number) => number;
    label?: string;
    color?: string;
    strokeDasharray?: string;
    initiallyHidden?: boolean;
  }[];
  pointsOfInterest?: {
    x: number;
    y: number;
    label: string;
    color: string;
  }[];
  labels?: { x: string; y: string };
}

export type GraphConfig = FunctionGraphConfig;
