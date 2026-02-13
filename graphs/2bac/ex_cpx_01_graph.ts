
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-5, 10, 8, -6],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // Points définis dans l'exercice
    // a = -2 + 2i
    const A = board.create('point', [-2, 2], { name: '', color: '#1e293b', size: 4 });
    board.create('text', [-2.8, 2.3, '\\(A\\)'], { fontSize: 13, useMathJax: true });
    
    // b = 4 - 4i
    const B = board.create('point', [4, -4], { name: '', color: '#1e293b', size: 4 });
    board.create('text', [4.3, -4.3, '\\(B\\)'], { fontSize: 13, useMathJax: true });
    
    // c = 4 + 8i
    const C = board.create('point', [4, 8], { name: '', color: '#1e293b', size: 4 });
    board.create('text', [4.3, 8.3, '\\(C\\)'], { fontSize: 13, useMathJax: true });

    // Triangle ABC rectangle isocèle en A
    board.create('polygon', [A, B, C], { 
      fillColor: '#e0e7ff', 
      fillOpacity: 0.4,
      borders: { strokeColor: '#3b82f6', strokeWidth: 2 } 
    });
    
    // Angle droit en A
    board.create('angle', [B, A, C], { type: 'square', name: '' });

    // Omega milieu de [BC]
    const Omega = board.create('midpoint', [B, C], { name: '', color: '#ef4444', size: 4 });
    board.create('text', [4.5, 2.3, '\\(\\Omega\\)'], { fontSize: 13, color: '#ef4444', useMathJax: true });

    // Cercle circonscrit
    board.create('circle', [Omega, C], { strokeColor: '#10b981', dash: 2, strokeWidth: 2 });
    
    // Rayon avec label LaTeX
    board.create('segment', [Omega, C], { strokeColor: '#10b981', dash: 3, strokeWidth: 1.5 });
    board.create('text', [5.5, 5.5, '\\(R = 6\\)'], { fontSize: 12, color: '#10b981', useMathJax: true });
    
    // Affixes
    board.create('text', [-4.5, 9, '\\(a = -2 + 2i\\)'], { fontSize: 11, color: '#64748b', useMathJax: true, fixed: true });
    board.create('text', [-4.5, 8.2, '\\(b = 4 - 4i\\)'], { fontSize: 11, color: '#64748b', useMathJax: true, fixed: true });
    board.create('text', [-4.5, 7.4, '\\(c = 4 + 8i\\)'], { fontSize: 11, color: '#64748b', useMathJax: true, fixed: true });
  }
};

export default graphConfig;
