import { GeometryGraphConfig, JSXGraphBoard } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 5, 5, -1],
  showAxis: true,
  showGrid: true,
  keepAspectRatio: true,
  init: (board: JSXGraphBoard) => {
    // Origine O
    const O = board.create('point', [0, 0], { name: '', color: '#1f2937', size: 4, fixed: true });
    board.create('text', [-0.3, -0.3, '\\(O\\)'], { fontSize: 13, useMathJax: true, fixed: true });
    
    // Point z mobile
    const z = board.create('point', [3, 2], { name: '', color: '#ef4444', size: 5 });
    board.create('text', [() => z.X() + 0.2, () => z.Y() + 0.25, '\\(M(z)\\)'], 
      { fontSize: 13, color: '#ef4444', useMathJax: true });
    
    // Segment OM = module
    board.create('segment', [O, z], { strokeColor: '#3b82f6', strokeWidth: 3 });
    
    // Projections
    board.create('segment', [z, [() => z.X(), 0]], { strokeColor: '#94a3b8', dash: 2 });
    board.create('segment', [z, [0, () => z.Y()]], { strokeColor: '#94a3b8', dash: 2 });
    
    // Label du module sur le segment
    board.create('text', [() => z.X()/2 - 0.3, () => z.Y()/2 + 0.3, 
      () => `\\(|z| = ${Math.sqrt(z.X()**2 + z.Y()**2).toFixed(2)}\\)`
    ], { fontSize: 13, color: '#3b82f6', useMathJax: true });
    
    // Coordonnées
    board.create('text', [() => z.X(), -0.4, () => `\\(a = ${z.X().toFixed(1)}\\)`], 
      { fontSize: 11, color: '#64748b', useMathJax: true, anchorX: 'middle' });
    board.create('text', [-0.6, () => z.Y(), () => `\\(b = ${z.Y().toFixed(1)}\\)`], 
      { fontSize: 11, color: '#64748b', useMathJax: true });
    
    // Formule pédagogique
    board.create('text', [0.5, 4.5, '\\(|z| = \\sqrt{a^2 + b^2}\\)'], 
      { fontSize: 15, color: '#1e293b', useMathJax: true, fixed: true });
  }
};

export default graphConfig;
