
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-5, 12, 6, -1],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // 1. Fonction f(x) = 2 + 8*((x-2)/x)^2 * e^(x-4) sur R*
    const f = board.create('functiongraph', [
      (x: number) => {
        if (Math.abs(x) < 0.1) return NaN; // Éviter l'asymptote en 0
        const ratio = (x - 2) / x;
        return 2 + 8 * ratio * ratio * Math.exp(x - 4);
      },
      -5, 5.5
    ], { strokeColor: '#3b82f6', strokeWidth: 2, name: 'f' });

    // 2. Asymptote horizontale y = 2 en -∞
    board.create('line', [[0, 2], [1, 2]], {
      strokeColor: '#10b981',
      dash: 2,
      strokeWidth: 1
    });
    board.create('text', [-4, 2.4, "y = 2"], { color: '#10b981', fontSize: 12 });

    // 3. Asymptote verticale x = 0
    board.create('line', [[0, 0], [0, 1]], {
      strokeColor: '#f59e0b',
      dash: 2,
      strokeWidth: 1
    });
    board.create('text', [0.2, 10, "x = 0"], { color: '#f59e0b', fontSize: 12 });

    // 4. Minimum en A(2, 2)
    board.create('point', [2, 2], {
      name: 'A(2,2)',
      size: 3,
      color: '#ef4444',
      fixed: true,
      label: { offset: [10, -10] }
    });

    // 5. Tangente horizontale en A(2, 2)
    board.create('segment', [[0.5, 2], [4, 2]], {
      strokeColor: '#ef4444',
      dash: 3,
      strokeWidth: 1
    });

    // 6. Labels de la courbe
    board.create('text', [3.5, 8, "\\( (C) \\)"], {
      color: '#3b82f6',
      fontSize: 14,
      useMathJax: true
    });

    // 7. Indication branche parabolique en +∞
    board.create('text', [4.5, 10, "\\( \\nearrow +\\infty \\)"], {
      color: '#64748b',
      fontSize: 12,
      useMathJax: true
    });
  }
};

export default graphConfig;
