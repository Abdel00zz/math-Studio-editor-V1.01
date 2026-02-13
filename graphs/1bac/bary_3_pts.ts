
import { GeometryGraphConfig } from "../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-2, 5, 8, -4],
  showAxis: false,
  showGrid: false,
  init: (board) => {
    const A = board.create('point', [0, 0], { name: 'A', size: 3, color: '#1e293b' });
    const B = board.create('point', [6, 0], { name: 'B', size: 3, color: '#1e293b' });
    const C = board.create('point', [3, 4], { name: 'C', size: 3, color: '#1e293b' });

    // Triangle
    board.create('polygon', [A, B, C], { fillColor: '#e0e7ff', fillOpacity: 0.3, borders: { strokeColor: '#4338ca' } });

    // Milieux
    const I = board.create('midpoint', [B, C], { name: 'I', size: 2, color: '#94a3b8', label: {visible: false} });
    const J = board.create('midpoint', [A, C], { name: 'J', size: 2, color: '#94a3b8', label: {visible: false} });
    const K = board.create('midpoint', [A, B], { name: 'K', size: 2, color: '#94a3b8', label: {visible: false} });

    // Médianes
    board.create('segment', [A, I], { strokeColor: '#94a3b8', dash: 2 });
    board.create('segment', [B, J], { strokeColor: '#94a3b8', dash: 2 });
    board.create('segment', [C, K], { strokeColor: '#94a3b8', dash: 2 });

    // Centre de gravité G (Isobarycentre)
    board.create('point', [
      () => (A.X() + B.X() + C.X()) / 3,
      () => (A.Y() + B.Y() + C.Y()) / 3
    ], { name: 'G', color: '#ef4444', size: 4 });
    
    // Texte LaTeX
    board.create('text', [3, -1, "\\[ \\overrightarrow{GA} + \\overrightarrow{GB} + \\overrightarrow{GC} = \\vec{0} \\]"], { 
      fontSize: 14,
      color: '#ef4444', 
      useMathJax: true,
      fixed: true,
      parse: false,
      anchorX: 'middle',
      anchorY: 'top'
    });
  }
};

export default graphConfig;
