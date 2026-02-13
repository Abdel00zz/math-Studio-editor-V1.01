import { GeometryGraphConfig, JSXGraphBoard } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-3.5, 3.5, 3.5, -3.5],
  showAxis: true,
  showGrid: true,
  keepAspectRatio: true,
  init: (board: JSXGraphBoard) => {
    // Labels des axes en LaTeX
    board.create('text', [-3.2, 3.2, '\\(\\mathrm{Im}\\)'], { fontSize: 15, useMathJax: true, fixed: true });
    board.create('text', [3.1, -0.4, '\\(\\mathrm{Re}\\)'], { fontSize: 15, useMathJax: true, fixed: true });
    
    // Point z interactif
    const z = board.create('point', [2, 1.5], { name: '', color: '#ef4444', size: 5 });
    board.create('text', [() => z.X() + 0.2, () => z.Y() + 0.3, 
      () => `\\(z = ${z.X().toFixed(1)} + ${z.Y().toFixed(1)}i\\)`
    ], { fontSize: 13, color: '#ef4444', useMathJax: true });
    
    // Projections avec lignes pointillées
    board.create('segment', [z, [() => z.X(), 0]], { strokeColor: '#94a3b8', dash: 2, strokeWidth: 1.5 });
    board.create('segment', [z, [0, () => z.Y()]], { strokeColor: '#94a3b8', dash: 2, strokeWidth: 1.5 });
    
    // Points de projection sur les axes
    board.create('point', [() => z.X(), 0], { size: 3, color: '#64748b', fixed: true, name: '' });
    board.create('point', [0, () => z.Y()], { size: 3, color: '#64748b', fixed: true, name: '' });
    
    // Labels des coordonnées
    board.create('text', [() => z.X(), -0.4, () => `\\(${z.X().toFixed(1)}\\)`], 
      { fontSize: 12, color: '#475569', useMathJax: true, anchorX: 'middle' });
    board.create('text', [-0.5, () => z.Y(), () => `\\(${z.Y().toFixed(1)}i\\)`], 
      { fontSize: 12, color: '#475569', useMathJax: true, anchorY: 'middle' });
    
    // Formule pédagogique
    board.create('text', [-3, -3, '\\(z = a + bi \\quad (a, b \\in \\mathbb{R})\\)'], 
      { fontSize: 14, color: '#1e293b', useMathJax: true, fixed: true });
  }
};

export default graphConfig;
