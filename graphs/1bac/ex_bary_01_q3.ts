
import { GeometryGraphConfig } from "../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-2, 5, 14, -5],
  showAxis: false,
  showGrid: true,
  init: (board) => {
    // Points de base (identiques à Q1)
    const A = board.create('point', [1, 3], { name: 'A', size: 3, color: '#1e293b' });
    const B = board.create('point', [0, 0], { name: 'B', size: 3, color: '#1e293b' });
    const C = board.create('point', [4, 0], { name: 'C', size: 3, color: '#1e293b' });

    board.create('polygon', [A, B, C], { 
        fillColor: '#e0e7ff', 
        borders: { strokeColor: '#1e293b', strokeWidth: 1 } 
    });

    // Point I (Rappel Q1)
    const I = board.create('point', [
        () => B.X() + 3 * (C.X() - B.X()),
        () => B.Y() + 3 * (C.Y() - B.Y())
    ], { name: 'I', color: '#ef4444', size: 3 });

    board.create('line', [B, C], { strokeColor: '#94a3b8', dash: 2, straightFirst: false, straightLast: true });

    // Construction de G : AG = -1/2 AI
    // Cela signifie que A est le milieu de [GI] ou que G est le symétrique de I par rapport à A, 
    // ou plus simplement G est placé tel que A est entre G et I, et AG = 0.5 AI.
    // Attention au signe : AG = -1/2 AI => G est de l'autre côté de A par rapport à I.
    
    const G = board.create('point', [
        () => A.X() - 0.5 * (I.X() - A.X()),
        () => A.Y() - 0.5 * (I.Y() - A.Y())
    ], { name: 'G', color: '#10b981', size: 4 });

    // Droite (AI) pour montrer l'alignement A, G, I
    board.create('line', [A, I], { strokeColor: '#10b981', dash: 2, strokeWidth: 1, straightFirst: true, straightLast: false });

    // Label LaTeX spécifique à cette question
    board.create('text', [-1, 4, "\\[ \\overrightarrow{AG} = -\\frac{1}{2}\\overrightarrow{AI} \\]"], {
        color: '#10b981',
        useMathJax: true,
        fixed: true,
        parse: false,
        anchorY: 'top'
    });
  }
};

export default graphConfig;
