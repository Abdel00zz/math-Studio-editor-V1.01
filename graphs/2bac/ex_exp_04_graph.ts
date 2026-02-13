
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-5, 3, 3, -8],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // 1. Fonction f(x) = x + 1 - (x^2 + 1)*e^x
    const f = board.create('functiongraph', [
      (x: number) => x + 1 - (x * x + 1) * Math.exp(x),
      -5, 2
    ], { strokeColor: '#3b82f6', strokeWidth: 2, name: 'f' });

    // 2. Asymptote oblique D: y = x + 1 en -∞
    board.create('line', [[0, 1], [1, 2]], {
      strokeColor: '#10b981',
      dash: 2,
      strokeWidth: 1.5
    });
    board.create('text', [-4, -2.5, "(D): y = x + 1"], { color: '#10b981', fontSize: 12 });

    // 3. Maximum en A(0, 0)
    board.create('point', [0, 0], {
      name: 'A(0,0)',
      size: 3,
      color: '#ef4444',
      fixed: true,
      label: { offset: [10, 10] }
    });

    // 4. Tangente horizontale en A
    board.create('segment', [[-2, 0], [1, 0]], {
      strokeColor: '#f59e0b',
      dash: 3,
      strokeWidth: 1
    });

    // 5. Point d'inflexion I1(-3, f(-3))
    const fMinus3 = -3 + 1 - (9 + 1) * Math.exp(-3); // ≈ -2.5
    board.create('point', [-3, fMinus3], {
      name: 'I₁',
      size: 3,
      color: '#8b5cf6',
      fixed: true,
      label: { offset: [-15, -10] }
    });

    // 6. Point d'inflexion I2(-1, f(-1))
    const fMinus1 = -1 + 1 - (1 + 1) * Math.exp(-1); // ≈ -0.74
    board.create('point', [-1, fMinus1], {
      name: 'I₂',
      size: 3,
      color: '#8b5cf6',
      fixed: true,
      label: { offset: [10, 10] }
    });

    // 7. Indication: (C) toujours sous (D)
    board.create('text', [-3.5, -1, "\\( (C_f) < (D) \\)"], {
      color: '#64748b',
      fontSize: 10,
      useMathJax: true
    });

    // 8. Labels de la courbe
    board.create('text', [1, -5, "\\( (C_f) \\)"], {
      color: '#3b82f6',
      fontSize: 14,
      useMathJax: true
    });

    // 9. Branche parabolique vers -∞
    board.create('text', [1.5, -7, "\\( \\searrow -\\infty \\)"], {
      color: '#64748b',
      fontSize: 12,
      useMathJax: true
    });
  }
};

export default graphConfig;
