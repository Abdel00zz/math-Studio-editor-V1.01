
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1.5, 3.5, 4, -3.5],
  showAxis: true,
  showGrid: true,
  keepAspectRatio: true,
  init: (board) => {
    const O = board.create('point', [0, 0], { visible: false, fixed: true });
    
    // Point M(z)
    const M = board.create('point', [2.5, 2], { name: '', color: '#3b82f6', size: 5 });
    board.create('text', [() => M.X() + 0.2, () => M.Y() + 0.2, '\\(M(z)\\)'], 
      { fontSize: 13, color: '#3b82f6', useMathJax: true });
    
    // Segment OM
    board.create('segment', [O, M], { strokeColor: '#3b82f6', strokeWidth: 2 });

    // Point M'(z̄) symétrique
    const M_bar = board.create('point', [() => M.X(), () => -M.Y()], 
      { name: '', color: '#ef4444', size: 5 });
    board.create('text', [() => M_bar.X() + 0.2, () => M_bar.Y() - 0.3, "\\(M'(\\bar{z})\\)"], 
      { fontSize: 13, color: '#ef4444', useMathJax: true });

    // Segment OM'
    board.create('segment', [O, M_bar], { strokeColor: '#ef4444', strokeWidth: 2 });

    // Pointillés verticaux (axe de symétrie)
    board.create('segment', [M, M_bar], { strokeColor: '#94a3b8', dash: 3, strokeWidth: 1.5 });
    
    // Point sur l'axe
    board.create('point', [() => M.X(), 0], { size: 3, color: '#f59e0b', fixed: true, name: '' });

    // Propriété : |z| = |z̄|
    board.create('text', [0.5, 3, '\\(|z| = |\\bar{z}|\\)'], 
      { fontSize: 14, color: '#10b981', useMathJax: true, fixed: true });
    
    // Propriété : arg(z̄) = -arg(z)
    board.create('text', [0.5, 2.5, '\\(\\arg(\\bar{z}) = -\\arg(z)\\)'], 
      { fontSize: 13, color: '#64748b', useMathJax: true, fixed: true });
  }
};

export default graphConfig;
