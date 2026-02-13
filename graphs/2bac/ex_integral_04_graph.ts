
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 5, 5, -2],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // Fonction g(x) = (x^2 + ln(x)) / x = x + ln(x)/x
    const g = board.create('functiongraph', [
      (x: number) => {
          if (x <= 0) return NaN;
          return x + Math.log(x)/x;
      },
      0.1, 5
    ], { strokeColor: '#3b82f6', strokeWidth: 2, name: 'g' });

    // Tangente en x=1 : y = 2x - 1
    board.create('line', [[0, -1], [1, 1]], { strokeColor: '#10b981', dash: 2, strokeWidth: 1 });
    board.create('text', [3, 4.5, "(T)"], { color: '#10b981' });

    // Point A(1, 1)
    const A = board.create('point', [1, 1], { name: 'A', size: 3, color: '#ef4444', fixed: true });

    // Aire sous la courbe entre 1 et 2
    board.create('integral', [[1, 2], g], {
        color: '#f59e0b',
        fillOpacity: 0.3,
        label: { visible: false }
    });

    // Labels
    board.create('text', [3.5, 3, "\\( (C_g) \\)"], { color: '#3b82f6', fontSize: 16, useMathJax: true, parse: false });
    board.create('text', [1.5, 0.5, "\\( \\mathcal{D} \\)"], { color: '#f59e0b', fontSize: 16, useMathJax: true, parse: false });
  }
};

export default graphConfig;
