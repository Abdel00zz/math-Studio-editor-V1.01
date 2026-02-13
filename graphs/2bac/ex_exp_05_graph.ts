
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-2, 6, 6, -3],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // 1. Fonction f(x) = -x + 5/2 - (1/2)*e^(x-2)*(e^(x-2) - 4)
    const f = board.create('functiongraph', [
      (x: number) => {
        const u = Math.exp(x - 2);
        return -x + 2.5 - 0.5 * u * (u - 4);
      },
      -2, 5.5
    ], { strokeColor: '#3b82f6', strokeWidth: 2, name: 'f' });

    // 2. Asymptote oblique Δ: y = -x + 5/2 en -∞
    board.create('line', [[0, 2.5], [1, 1.5]], {
      strokeColor: '#10b981',
      dash: 2,
      strokeWidth: 1.5
    });
    board.create('text', [-1, 4, "(Δ): y = -x + 5/2"], { color: '#10b981', fontSize: 11 });

    // 3. Point d'inflexion A(2, 2) avec tangente horizontale
    board.create('point', [2, 2], {
      name: 'A(2,2)',
      size: 3,
      color: '#ef4444',
      fixed: true,
      label: { offset: [10, 10] }
    });

    // 4. Ligne horizontale passant par A pour montrer la tangente
    board.create('segment', [[0, 2], [4, 2]], {
      strokeColor: '#f59e0b',
      dash: 3,
      strokeWidth: 1
    });

    // 5. Point d'intersection avec Δ: x = 2 + ln(4) ≈ 3.39
    const xIntersect = 2 + Math.log(4);
    const yIntersect = -xIntersect + 2.5;
    board.create('point', [xIntersect, yIntersect], {
      name: '2+ln4',
      size: 3,
      color: '#8b5cf6',
      fixed: true,
      label: { offset: [5, -15], fontSize: 10 }
    });

    // 6. Zéro α entre 2+ln3 et 2+ln4
    // 2+ln3 ≈ 3.1, 2+ln4 ≈ 3.39
    board.create('point', [3.25, 0], {
      name: 'α',
      size: 3,
      color: '#f59e0b',
      fixed: true,
      label: { offset: [0, -15] }
    });

    // 7. Droite y = x pour la symétrie de f^{-1}
    board.create('line', [[0, 0], [1, 1]], {
      strokeColor: '#94a3b8',
      dash: 2,
      strokeWidth: 1
    });
    board.create('text', [4, 4.5, "y = x"], { color: '#94a3b8', fontSize: 10 });

    // 8. Zone (C) au-dessus de Δ
    board.create('text', [0.5, 3, "\\( (C) > (\\Delta) \\)"], {
      color: '#64748b',
      fontSize: 10,
      useMathJax: true
    });

    // 9. Zone (C) en dessous de Δ
    board.create('text', [4, -0.5, "\\( (C) < (\\Delta) \\)"], {
      color: '#64748b',
      fontSize: 10,
      useMathJax: true
    });

    // 10. Labels de la courbe
    board.create('text', [0, 1, "\\( (C) \\)"], {
      color: '#3b82f6',
      fontSize: 14,
      useMathJax: true
    });
  }
};

export default graphConfig;
