
import { MediaData } from '../../types';

export interface EditorProps<T> {
  data: T;
  onChange: (d: T) => void;
  graphFiles?: Map<string, { content: string }>;
  graphIndex?: any;
}

export const findGraphCode = (graphId: string | undefined, graphFiles?: Map<string, { content: string }>) => {
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
