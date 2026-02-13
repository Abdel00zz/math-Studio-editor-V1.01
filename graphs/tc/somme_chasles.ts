
import { GeometryGraphConfig } from "../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 5, 8, -2],
  showAxis: false,
  showGrid: true,
  init: (board) => {
    // Points A, B, C
    const A = board.create('point', [0, 1], { name: 'A', color: '#1e293b', size: 3 });
    const B = board.create('point', [3, 3], { name: 'B', color: '#1e293b', size: 3 });
    const C = board.create('point', [6, 1], { name: 'C', color: '#1e293b', size: 3 });

    // Vecteurs
    const vecAB = board.create('arrow', [A, B], { strokeColor: '#3b82f6', strokeWidth: 3 });
    const vecBC = board.create('arrow', [B, C], { strokeColor: '#3b82f6', strokeWidth: 3 });
    
    // Vecteur somme (Résultante)
    const vecAC = board.create('arrow', [A, C], { strokeColor: '#ef4444', strokeWidth: 4 });

    // Labels sur les vecteurs
    board.create('text', [() => (A.X()+B.X())/2, () => (A.Y()+B.Y())/2 + 0.5, "\\[ \\vec{u} \\]"], { 
        color: '#3b82f6', useMathJax: true 
    });
    board.create('text', [() => (B.X()+C.X())/2, () => (B.Y()+C.Y())/2 + 0.5, "\\[ \\vec{v} \\]"], { 
        color: '#3b82f6', useMathJax: true 
    });
    board.create('text', [() => (A.X()+C.X())/2, () => (A.Y()+C.Y())/2 - 0.5, "\\[ \\vec{u} + \\vec{v} \\]"], { 
        color: '#ef4444', useMathJax: true 
    });

    // Formule
    board.create('text', [1, -1, "\\[ \\overrightarrow{AB} + \\overrightarrow{BC} = \\overrightarrow{AC} \\]"], {
        fontSize: 16,
        color: '#ef4444',
        useMathJax: true,
        fixed: true
    });
  }
};

export default graphConfig;
