
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-2, 5, 8, -3],
  showAxis: false,
  showGrid: false,
  init: (board) => {
    const A = board.create('point', [0, 0], { name: 'A', color: '#1e293b' });
    const B = board.create('point', [6, 0], { name: 'B', color: '#1e293b' });
    const C = board.create('point', [2, 3], { name: 'C', color: '#1e293b' });

    // Triangle
    board.create('polygon', [A, B, C], { borders: { strokeColor: '#334155' } });

    // Milieu I
    const I = board.create('midpoint', [A, B], { name: 'I', color: '#10b981' });

    // Médiane
    board.create('segment', [C, I], { strokeColor: '#ef4444', strokeWidth: 2, dash: 2 });

    // Labels
    board.create('text', [() => (A.X()+I.X())/2, -0.3, "//"], { color: '#10b981' });
    board.create('text', [() => (I.X()+B.X())/2, -0.3, "//"], { color: '#10b981' });

    // Formule
    board.create('text', [-1, 4, "\\[ CA^2 + CB^2 = 2CI^2 + \\frac{1}{2}AB^2 \\]"], { 
        fontSize: 15, 
        color: '#334155', 
        useMathJax: true,
        fixed: true 
    });
  }
};

export default graphConfig;
