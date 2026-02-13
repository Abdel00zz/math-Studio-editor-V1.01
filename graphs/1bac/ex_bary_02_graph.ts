
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 8, 8, -1],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // Droite y = x
    board.create('line', [[0, 0], [1, 1]], { strokeColor: '#94a3b8', dash: 2, strokeWidth: 1 });
    board.create('text', [7, 6.5, "y=x"], { color: '#94a3b8' });

    // Fonction f(x) = (ln x)^2 - ln x + x
    board.create('functiongraph', [
      (x: number) => Math.pow(Math.log(x), 2) - Math.log(x) + x,
      0.01, 8
    ], { strokeColor: '#3b82f6', strokeWidth: 2 });

    // Points d'intersection
    board.create('point', [1, 1], { name: 'A', size: 3, color: '#ef4444', fixed: true, label: {offset: [5, -10]} });
    const e = Math.E;
    board.create('point', [e, e], { name: 'B', size: 3, color: '#ef4444', fixed: true, label: {offset: [0, 10]} });

    // Labels
    board.create('text', [5, 7, "\\( (C_f) \\)"], { color: '#3b82f6', fontSize: 16, useMathJax: true, parse: false });
    
    // Zones de position
    // Sur ]1, e[, Cf est en dessous
    // board.create('text', [2, 1.8, "Cf < y=x"], { color: '#ef4444', fontSize: 10 });
  }
};

export default graphConfig;
