
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-3, 7, 6, -2],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // 1. Fonction f(x) = (x^2 - x)*e^(-x) + x
    const f = board.create('functiongraph', [
      (x: number) => (x * x - x) * Math.exp(-x) + x,
      -3, 6
    ], { strokeColor: '#3b82f6', strokeWidth: 2, name: 'f' });

    // 2. Asymptote oblique D: y = x
    board.create('line', [[0, 0], [1, 1]], {
      strokeColor: '#10b981',
      dash: 2,
      strokeWidth: 1.5
    });
    board.create('text', [4.5, 5.2, "(D): y = x"], { color: '#10b981', fontSize: 12 });

    // 3. Minimum en A(0, 0) - Origine
    board.create('point', [0, 0], {
      name: 'O',
      size: 3,
      color: '#ef4444',
      fixed: true,
      label: { offset: [-15, -15] }
    });

    // 4. Point (1, 1) - intersection avec D
    board.create('point', [1, 1], {
      name: '',
      size: 2,
      color: '#f59e0b',
      fixed: true
    });

    // 5. Point d'inflexion I1(1, f(1))
    const f1 = 0 * Math.exp(-1) + 1; // = 1
    board.create('point', [1, f1], {
      name: 'I₁',
      size: 3,
      color: '#8b5cf6',
      fixed: true,
      label: { offset: [-15, 10] }
    });

    // 6. Point d'inflexion I2(4, f(4))
    const f4 = (16 - 4) * Math.exp(-4) + 4; // ≈ 4.22
    board.create('point', [4, f4], {
      name: 'I₂',
      size: 3,
      color: '#8b5cf6',
      fixed: true,
      label: { offset: [5, 10] }
    });

    // 7. Zone où (C) est au-dessus de (D) - indication
    board.create('text', [-1.5, 2, "\\( (C) > (D) \\)"], {
      color: '#64748b',
      fontSize: 10,
      useMathJax: true
    });

    // 8. Zone où (C) est en dessous de (D)
    board.create('text', [0.5, 0.3, "\\( (C) < (D) \\)"], {
      color: '#64748b',
      fontSize: 10,
      useMathJax: true
    });

    // 9. Labels de la courbe
    board.create('text', [5, 6.5, "\\( (C_f) \\)"], {
      color: '#3b82f6',
      fontSize: 14,
      useMathJax: true
    });
  }
};

export default graphConfig;
