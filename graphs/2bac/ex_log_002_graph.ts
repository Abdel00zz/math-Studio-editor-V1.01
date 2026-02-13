
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 3, 6, -1],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // Fonction f(x) = x^4 * (ln(x) - 1)^2
    // Définie sur ]0, +inf[ et f(0)=0
    board.create('functiongraph', [
      (x: number) => {
        if (x <= 0) return 0;
        return Math.pow(x, 4) * Math.pow(Math.log(x) - 1, 2);
      },
      0, 6
    ], { strokeColor: '#3b82f6', strokeWidth: 2 });

    // Tangente horizontale en 0 (demi-tangente)
    board.create('segment', [[0, 0], [1, 0]], { strokeColor: '#10b981', strokeWidth: 2, lastArrow: true });
    
    // Minimum en e (environ 2.718)
    const e = Math.E;
    board.create('point', [e, 0], { name: 'e', size: 3, color: '#ef4444', fixed: true });

    // Maximum local en sqrt(e) (environ 1.648)
    const sqrte = Math.sqrt(Math.E);
    // f(sqrt(e)) = e^2 * (0.5 - 1)^2 = e^2 * 0.25
    const maxVal = (e * e) / 4;
    board.create('point', [sqrte, maxVal], { name: 'M', size: 3, color: '#f59e0b', fixed: true });
    
    // Droite y = 1 pour la question 5b
    board.create('line', [[0, 1], [1, 1]], { strokeColor: '#94a3b8', dash: 2, strokeWidth: 1 });
    board.create('text', [5, 1.2, "y=1"], { color: '#94a3b8' });

    // Labels LaTeX
    board.create('text', [3, 2, "\\( (C_f) \\)"], { color: '#3b82f6', fontSize: 16, useMathJax: true, parse: false });
  }
};

export default graphConfig;
