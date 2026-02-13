
// This file is now a barrel file to export specific editors
// The monolithic logic has been split into:
// - components/editors/ExerciseEditor.tsx
// - components/editors/RevisionEditor.tsx
// - components/editors/QuizEditor.tsx
// - components/editors/MediaModal.tsx
// - components/editors/EditorIcons.tsx

export { ExerciseEditor } from './editors/ExerciseEditor';
export { RevisionEditor } from './editors/RevisionEditor';
export { QuizEditor } from './editors/QuizEditor';
export { MediaModal } from './editors/MediaModal';
export { Icons } from './editors/EditorIcons';
