
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1.6, 1.8, 1.8, -1.6],
  showAxis: true,
  showGrid: false,
  keepAspectRatio: true,
  init: (board) => {
    // Cercle unité
    const circle = board.create('circle', [[0, 0], 1], { 
      strokeColor: '#94a3b8', 
      strokeWidth: 2,
      dash: 0 
    });
    
    // Point M sur le cercle (interactif)
    const M = board.create('glider', [0.707, 0.707, circle], {
      name: '', 
      size: 5, 
      color: '#3b82f6'
    });
    board.create('text', [() => M.X() + 0.1, () => M.Y() + 0.12, '\\(M\\)'], 
      { fontSize: 13, color: '#3b82f6', useMathJax: true });

    // Rayon OM
    board.create('segment', [[0, 0], M], { strokeColor: '#64748b', strokeWidth: 1.5 });

    // Projections (pointillés)
    board.create('segment', [M, [() => M.X(), 0]], { strokeColor: '#ef4444', dash: 3, strokeWidth: 1.5 });
    board.create('segment', [M, [0, () => M.Y()]], { strokeColor: '#10b981', dash: 3, strokeWidth: 1.5 });

    // Cosinus (segment sur l'axe X) - en rouge
    board.create('segment', [[0, 0], [() => M.X(), 0]], {
      strokeColor: '#ef4444', 
      strokeWidth: 4
    });
    
    // Sinus (segment sur l'axe Y) - en vert
    board.create('segment', [[0, 0], [0, () => M.Y()]], {
      strokeColor: '#10b981', 
      strokeWidth: 4
    });
    
    // Points de projection
    board.create('point', [() => M.X(), 0], { size: 3, color: '#ef4444', fixed: true, name: '' });
    board.create('point', [0, () => M.Y()], { size: 3, color: '#10b981', fixed: true, name: '' });

    // Affichage dynamique LaTeX
    board.create('text', [1.1, 1.5, () => `\\(\\cos(\\alpha) = ${M.X().toFixed(2)}\\)`], {
      fontSize: 13,
      color: '#ef4444',
      useMathJax: true,
      fixed: true
    });
    
    board.create('text', [1.1, 1.2, () => `\\(\\sin(\\alpha) = ${M.Y().toFixed(2)}\\)`], {
      fontSize: 13,
      color: '#10b981',
      useMathJax: true,
      fixed: true
    });
    
    // Angle alpha
    const I = board.create('point', [1, 0], { visible: false, fixed: true });
    board.create('angle', [I, [0, 0], M], { 
      name: '', 
      radius: 0.25, 
      fillColor: '#dbeafe',
      strokeColor: '#3b82f6'
    });
    board.create('text', [0.2, 0.15, '\\(\\alpha\\)'], 
      { fontSize: 12, color: '#3b82f6', useMathJax: true });
  }
};

export default graphConfig;
