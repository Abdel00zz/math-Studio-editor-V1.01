
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 4.5, 4.5, -1.5],
  showAxis: true,
  showGrid: true,
  keepAspectRatio: true,
  init: (board) => {
    const O = board.create('point', [0, 0], { name: '', fixed: true, visible: false });
    const I = board.create('point', [1, 0], { visible: false, fixed: true });
    
    // Point M interactif
    const M = board.create('point', [2.5, 2], { name: '', color: '#3b82f6', size: 5 });
    board.create('text', [() => M.X() + 0.15, () => M.Y() + 0.2, '\\(M(z)\\)'], 
      { fontSize: 13, color: '#3b82f6', useMathJax: true });

    // Module r = OM
    board.create('segment', [O, M], { strokeColor: '#3b82f6', strokeWidth: 3 });
    board.create('text', [() => M.X()/2 - 0.4, () => M.Y()/2 + 0.3, 
      () => `\\(r = ${Math.sqrt(M.X()**2 + M.Y()**2).toFixed(2)}\\)`
    ], { fontSize: 12, color: '#3b82f6', useMathJax: true });

    // Argument theta
    board.create('angle', [I, O, M], { 
      name: '', 
      radius: 0.7, 
      fillColor: '#fef3c7', 
      strokeColor: '#f59e0b',
      strokeWidth: 2
    });
    board.create('text', [0.55, 0.35, '\\(\\theta\\)'], 
      { fontSize: 13, color: '#f59e0b', useMathJax: true });

    // Projections
    board.create('segment', [M, [() => M.X(), 0]], { strokeColor: '#94a3b8', dash: 2 });
    board.create('segment', [M, [0, () => M.Y()]], { strokeColor: '#94a3b8', dash: 2 });

    // Coordonnées
    board.create('text', [() => M.X(), -0.35, () => `\\(a\\)`], 
      { fontSize: 12, color: '#64748b', useMathJax: true, anchorX: 'middle' });
    board.create('text', [-0.35, () => M.Y(), () => `\\(b\\)`], 
      { fontSize: 12, color: '#64748b', useMathJax: true });
    
    // Forme trigonométrique
    board.create('text', [0.3, 4, '\\(z = r(\\cos\\theta + i\\sin\\theta)\\)'], 
      { fontSize: 14, color: '#1e293b', useMathJax: true, fixed: true });
    
    // Forme exponentielle
    board.create('text', [0.3, 3.5, '\\(z = re^{i\\theta}\\)'], 
      { fontSize: 14, color: '#10b981', useMathJax: true, fixed: true });
  }
};

export default graphConfig;
