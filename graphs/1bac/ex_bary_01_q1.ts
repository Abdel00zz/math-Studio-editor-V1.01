
import { GeometryGraphConfig } from "../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-2, 5, 14, -5],
  showAxis: false,
  showGrid: true,
  init: (board) => {
    // Points de base
    const A = board.create('point', [1, 3], { name: 'A', size: 3, color: '#1e293b' });
    const B = board.create('point', [0, 0], { name: 'B', size: 3, color: '#1e293b' });
    const C = board.create('point', [4, 0], { name: 'C', size: 3, color: '#1e293b' });

    // Triangle ABC
    board.create('polygon', [A, B, C], { 
        fillColor: '#e0e7ff', 
        borders: { strokeColor: '#1e293b', strokeWidth: 1 } 
    });

    // Construction de I : BI = 3BC
    // Le point I est sur la droite (BC)
    const I = board.create('point', [
        () => B.X() + 3 * (C.X() - B.X()),
        () => B.Y() + 3 * (C.Y() - B.Y())
    ], { name: 'I', color: '#ef4444', size: 4 });

    // Demi-droite [BC) pour visualiser l'alignement et la proportion
    board.create('line', [B, C], { 
        strokeColor: '#94a3b8', 
        dash: 2, 
        straightFirst: false, 
        straightLast: true 
    });

    // Vecteurs pour illustrer la relation BI = 3BC
    board.create('arrow', [B, C], { strokeColor: '#3b82f6', strokeWidth: 2, name: 'BC' });
    // On ne trace pas tout le vecteur BI pour ne pas surcharger, mais on montre la position
    
    // Label LaTeX spécifique à cette question
    board.create('text', [6, 1, "\\[ \\overrightarrow{BI} = 3\\overrightarrow{BC} \\]"], {
        color: '#ef4444',
        useMathJax: true,
        fixed: true,
        parse: false,
        anchorY: 'top'
    });
  }
};

export default graphConfig;
