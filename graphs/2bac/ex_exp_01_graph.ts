
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-4, 5, 6, -2],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // 1. Fonction f(x) = 2 - x*e^(-x+1)
    const f = board.create('functiongraph', [
      (x: number) => 2 - x * Math.exp(-x + 1),
      -4, 6
    ], { strokeColor: '#3b82f6', strokeWidth: 2, name: 'f' });

    // 2. Asymptote horizontale y = 2 en +∞
    board.create('line', [[0, 2], [1, 2]], {
      strokeColor: '#10b981',
      dash: 2,
      strokeWidth: 1
    });
    board.create('text', [4, 2.3, "y = 2"], { color: '#10b981', fontSize: 12 });

    // 3. Minimum en A(1, 1)
    board.create('point', [1, 1], {
      name: 'A(1,1)',
      size: 3,
      color: '#ef4444',
      fixed: true,
      label: { offset: [5, -15] }
    });

    // 4. Tangente horizontale en A(1, 1)
    board.create('line', [[0, 1], [1, 1]], {
      strokeColor: '#f59e0b',
      dash: 3,
      strokeWidth: 1
    });

    // 5. Point d'inflexion I(2, f(2))
    const f2 = 2 - 2 * Math.exp(-1); // ≈ 1.26
    board.create('point', [2, f2], {
      name: 'I',
      size: 3,
      color: '#8b5cf6',
      fixed: true,
      label: { offset: [5, 10] }
    });

    // 6. Droite y = x (pour la symétrie de la réciproque)
    board.create('line', [[0, 0], [1, 1]], {
      strokeColor: '#94a3b8',
      dash: 2,
      strokeWidth: 1
    });
    board.create('text', [3.5, 4, "y = x"], { color: '#94a3b8', fontSize: 10 });

    // 7. Restriction g sur ]-∞, 1] et sa réciproque (symétrie)
    const gInverse = board.create('functiongraph', [
      (y: number) => {
        // Symétrie par rapport à y = x: échanger x et y
        // On trace x = f(y) pour y ≤ 1
        return 2 - y * Math.exp(-y + 1);
      },
      -2, 1
    ], { strokeColor: '#ec4899', strokeWidth: 2, dash: 2 });

    // 8. Labels
    board.create('text', [0.5, 4, "\\( (C) \\)"], {
      color: '#3b82f6',
      fontSize: 14,
      useMathJax: true
    });

    board.create('text', [4, 0.5, "\\( (C_{g^{-1}}) \\)"], {
      color: '#ec4899',
      fontSize: 12,
      useMathJax: true
    });
  }
};

export default graphConfig;
