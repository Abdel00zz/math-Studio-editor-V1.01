
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
  title?: string; // Added title for auto-discovery display
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
  graphId?: string;
  graphCaption?: string;
}

export interface SubQuestion {
  id: string;
  content: string;
  hint?: string;
  media?: MediaData;
  graphId?: string;
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
  metadata?: { // Made optional for robust loading
    title: string;
    chapter: string;
    level?: string;
    total_questions?: number;
  };
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  type: 'mcq' | 'true-false' | 'order' | 'input' | 'error-spotting';
  question?: string; // Sometimes called 'prompt' in some JSONs
  prompt?: string; // Alternate key
  context?: string;
  section?: string;
  category?: string;
  options?: QuizOption[];
  explanation?: string;
  isTrue?: boolean;
  steps?: QuizStep[];
  items?: QuizOrderItem[];
  placeholder?: string;
  correctAnswers?: string[];
}

export interface QuizOption {
  text: string;
  is_correct?: boolean; // Can be is_correct or isCorrect
  isCorrect?: boolean;
  explanation?: string;
}

export interface QuizStep {
  id?: string;
  text: string;
  isError?: boolean;
  correction?: string;
}

export interface QuizOrderItem {
  id: string;
  text: string;
  correctOrder: number;
}

// --- App State Types ---

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
  content: string;
  isDir: boolean;
  handle?: FileSystemFileHandle;
}

export interface ProjectState {
  manifest: Manifest | null;
  files: Map<string, VirtualFile>;
  graphFiles: Map<string, VirtualFile>;
  graphIndex: any | null;
  activePath: string | null;
  unsavedChanges: Set<string>;
  mode: 'readonly' | 'live';
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
  labels?: { x: string; y: string };
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

export type GraphConfig = FunctionGraphConfig | GeometryGraphConfig;
