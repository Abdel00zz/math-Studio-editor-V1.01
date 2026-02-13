import { GeometryGraphConfig, JSXGraphBoard } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 4, 4, -1],
  showAxis: true,
  showGrid: true,
  keepAspectRatio: true,
  init: (board: JSXGraphBoard) => {
    // Point M(z) interactif
    const M = board.create('point', [2.5, 2], { name: '', color: '#ef4444', size: 5 });
    board.create('text', [() => M.X() + 0.15, () => M.Y() + 0.2, '\\(M(z)\\)'], 
      { fontSize: 13, color: '#ef4444', useMathJax: true });
    
    // Projections avec lignes pointillées
    board.create('segment', [M, [() => M.X(), 0]], { strokeColor: '#10b981', dash: 2, strokeWidth: 2 });
    board.create('segment', [M, [0, () => M.Y()]], { strokeColor: '#3b82f6', dash: 2, strokeWidth: 2 });
    
    // Points de projection
    board.create('point', [() => M.X(), 0], { size: 4, color: '#10b981', fixed: true, name: '' });
    board.create('point', [0, () => M.Y()], { size: 4, color: '#3b82f6', fixed: true, name: '' });
    
    // Labels avec coordonnées
    board.create('text', [() => M.X(), -0.35, () => `\\(\\mathrm{Re}(z) = ${M.X().toFixed(1)}\\)`], 
      { fontSize: 11, color: '#10b981', useMathJax: true, anchorX: 'middle' });
    board.create('text', [-0.1, () => M.Y(), () => `\\(\\mathrm{Im}(z) = ${M.Y().toFixed(1)}\\)`], 
      { fontSize: 11, color: '#3b82f6', useMathJax: true, anchorX: 'right' });
    
    // Notation complexe
    board.create('text', [0.5, 3.5, () => `\\(z = ${M.X().toFixed(1)} + ${M.Y().toFixed(1)}i\\)`], 
      { fontSize: 15, color: '#1e293b', useMathJax: true, fixed: true });
  }
};

export default graphConfig;
