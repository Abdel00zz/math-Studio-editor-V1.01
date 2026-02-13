import { GeometryGraphConfig, JSXGraphBoard } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1.5, 3.5, 4, -3.5],
  showAxis: true,
  showGrid: true,
  keepAspectRatio: true,
  init: (board: JSXGraphBoard) => {
    // Point z interactif
    const z = board.create('point', [2, 1.5], { name: '', color: '#ef4444', size: 5 });
    board.create('text', [() => z.X() + 0.15, () => z.Y() + 0.25, '\\(M(z)\\)'], 
      { fontSize: 13, color: '#ef4444', useMathJax: true });
    
    // Son conjugué z̄ (symétrique / axe réel)
    const zBar = board.create('point', [() => z.X(), () => -z.Y()], 
      { name: '', color: '#3b82f6', size: 5 });
    board.create('text', [() => zBar.X() + 0.15, () => zBar.Y() - 0.35, '\\(M\'(\\bar{z})\\)'], 
      { fontSize: 13, color: '#3b82f6', useMathJax: true });
    
    // Segment de symétrie
    board.create('segment', [z, zBar], { strokeColor: '#94a3b8', dash: 3, strokeWidth: 1.5 });
    
    // Point milieu (sur l'axe réel)
    board.create('point', [() => z.X(), 0], { size: 3, color: '#f59e0b', fixed: true, name: '' });
    
    // Valeurs affichées
    board.create('text', [0.5, 3, () => `\\(z = ${z.X().toFixed(1)} + ${z.Y().toFixed(1)}i\\)`], 
      { fontSize: 14, color: '#ef4444', useMathJax: true, fixed: true });
    board.create('text', [0.5, 2.5, () => `\\(\\bar{z} = ${z.X().toFixed(1)} - ${z.Y().toFixed(1)}i\\)`], 
      { fontSize: 14, color: '#3b82f6', useMathJax: true, fixed: true });
    
    // Note pédagogique
    board.create('text', [0.5, -3, '\\(\\bar{z}\\) est le symétrique de \\(z\\) par rapport à \\((O, \\vec{u})\\)'], 
      { fontSize: 12, color: '#64748b', useMathJax: true, fixed: true });
  }
};

export default graphConfig;
