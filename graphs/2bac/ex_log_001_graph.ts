
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-2, 10, 12, -5],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // 1. Asymptote verticale x = 1
    board.create('line', [[1, 0], [1, 1]], { strokeColor: '#94a3b8', dash: 2, strokeWidth: 1 });
    
    // 2. Droite y = x
    board.create('line', [[0, 0], [1, 1]], { strokeColor: '#94a3b8', dash: 2, strokeWidth: 1 });

    // 3. Fonction f(x) = x / ln(x)
    // Partie 1 : 0 < x < 1
    board.create('functiongraph', [
      (x: number) => x === 0 ? 0 : x / Math.log(x),
      0, 0.99
    ], { strokeColor: '#3b82f6', strokeWidth: 2 });

    // Partie 2 : x > 1
    board.create('functiongraph', [
      (x: number) => x / Math.log(x),
      1.01, 12
    ], { strokeColor: '#3b82f6', strokeWidth: 2 });

    // 4. Points remarquables
    // Origine (0,0) - Demi-tangente horizontale
    board.create('point', [0, 0], { name: 'O', size: 2, color: '#1e293b', fixed: true });
    board.create('segment', [[0, 0], [1, 0]], { strokeColor: '#10b981', strokeWidth: 2, lastArrow: true });

    // Minimum local en e
    const e = Math.E;
    board.create('point', [e, e], { name: 'e', size: 3, color: '#ef4444', fixed: true });
    // Tangente horizontale en e
    board.create('segment', [[e-1, e], [e+1, e]], { strokeColor: '#10b981', strokeWidth: 2 });

    // Point d'inflexion e^2
    const e2 = e * e;
    board.create('point', [e2, e2/2], { name: 'I', size: 2, color: '#f59e0b', fixed: true });

    // 5. Fonction réciproque h^-1 (Symétrique de f sur [e, +inf[)
    // Parametric curve for inverse: x(t) = f(t), y(t) = t for t >= e
    board.create('curve', [
        (t: number) => t / Math.log(t),
        (t: number) => t,
        e, 15
    ], { strokeColor: '#8b5cf6', strokeWidth: 2, dash: 2 });

    // Labels
    board.create('text', [2, 8, "\\( (C_f) \\)"], { color: '#3b82f6', fontSize: 16, useMathJax: true, parse: false });
    board.create('text', [8, 3, "\\( (C_{h^{-1}}) \\)"], { color: '#8b5cf6', fontSize: 16, useMathJax: true, parse: false });
    board.create('text', [8, 8, "\\( y = x \\)"], { color: '#94a3b8', fontSize: 12, useMathJax: true, parse: false });
  }
};

export default graphConfig;
