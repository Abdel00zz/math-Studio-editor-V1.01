
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-3, 6, 8, -4],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // Fonction f(x) = 2x*ln(x) - 2x
    board.create('functiongraph', [
      (x: number) => {
        if (x <= 0) return 0;
        return 2 * x * Math.log(x) - 2 * x;
      },
      0, 8
    ], { strokeColor: '#3b82f6', strokeWidth: 2 });

    // Demi-tangente verticale en 0 (vers le bas)
    board.create('segment', [[0, 0], [0, -2]], { strokeColor: '#10b981', strokeWidth: 2, lastArrow: true });

    // Minimum en 1 : f(1) = -2
    board.create('point', [1, -2], { name: 'S', size: 3, color: '#ef4444', fixed: true });
    // Tangente horizontale
    board.create('segment', [[0.5, -2], [1.5, -2]], { strokeColor: '#10b981', strokeWidth: 1 });

    // Intersection avec (Ox) : e
    const e = Math.E;
    board.create('point', [e, 0], { name: 'A', size: 3, color: '#f59e0b', fixed: true });

    // Droite y=x
    board.create('line', [[0, 0], [1, 1]], { strokeColor: '#94a3b8', dash: 2 });

    // Fonction réciproque (symétrique)
    board.create('curve', [
      (t: number) => 2 * t * Math.log(t) - 2 * t,
      (t: number) => t,
      1, 8
    ], { strokeColor: '#8b5cf6', strokeWidth: 2, dash: 2 });

    // Labels
    board.create('text', [4, 2, "\\( (C_f) \\)"], { color: '#3b82f6', fontSize: 16, useMathJax: true, parse: false });
    board.create('text', [2, 4, "\\( (C_{g^{-1}}) \\)"], { color: '#8b5cf6', fontSize: 16, useMathJax: true, parse: false });
  }
};

export default graphConfig;
