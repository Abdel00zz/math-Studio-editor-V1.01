
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 5, 7, -3],
  showAxis: false,
  showGrid: false,
  init: (board) => {
    const A = board.create('point', [1, 1], { name: 'A', color: '#1e293b' });
    const B = board.create('point', [5, 1], { name: 'B', color: '#1e293b' });
    const C = board.create('point', [2, 3], { name: 'C', color: '#1e293b' });

    // Triangle
    board.create('polygon', [A, B, C], { 
        fillColor: '#e0e7ff', 
        borders: { strokeColor: '#334155', strokeWidth: 2 } 
    });

    // Angle A
    board.create('angle', [B, A, C], { 
        name: 'α', 
        radius: 0.8, 
        fillColor: '#f59e0b', 
        strokeColor: '#f59e0b' 
    });

    // Labels des côtés
    board.create('text', [() => (A.X()+B.X())/2, () => (A.Y()+B.Y())/2 - 0.3, "c"], { fontSize: 16 });
    board.create('text', [() => (A.X()+C.X())/2 - 0.3, () => (A.Y()+C.Y())/2, "b"], { fontSize: 16 });
    board.create('text', [() => (B.X()+C.X())/2 + 0.2, () => (B.Y()+C.Y())/2 + 0.2, "a"], { fontSize: 16, color: '#ef4444', fontWeight: 'bold' });

    // Formule
    board.create('text', [0.5, 4.5, "\\[ a^2 = b^2 + c^2 - 2bc \\cos \\alpha \\]"], { 
        fontSize: 16, 
        color: '#ef4444', 
        useMathJax: true, 
        fixed: true 
    });
  }
};

export default graphConfig;
