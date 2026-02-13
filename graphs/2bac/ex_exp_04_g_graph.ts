
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-5.5, 1.5, 1.5, -2.5],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // Fonction auxiliaire g(x) = 1 - (x+1)²e^x
    const g = board.create('functiongraph', [
      (x: number) => 1 - (x + 1) * (x + 1) * Math.exp(x),
      -5.5, 1.5
    ], { strokeColor: '#e91e63', strokeWidth: 2.5, name: 'g' });

    // Point g(0) = 0
    board.create('point', [0, 0], {
      name: 'O',
      size: 3,
      color: '#3b82f6',
      fixed: true,
      label: { offset: [8, 8], fontSize: 12 }
    });

    // Indication zone g(x) ≥ 0
    board.create('text', [-3, 0.8, "g(x) ≥ 0"], {
      color: '#10b981',
      fontSize: 11
    });

    // Indication zone g(x) ≤ 0
    board.create('text', [0.3, -1.2, "g(x) ≤ 0"], {
      color: '#ef4444',
      fontSize: 11
    });

    // Label de la courbe
    board.create('text', [-4.5, -2, "\\( (\\mathcal{C}_g) \\)"], {
      color: '#e91e63',
      fontSize: 14,
      useMathJax: true
    });

    // Axe y = 0 mis en évidence
    board.create('line', [[0, 0], [1, 0]], {
      strokeColor: '#94a3b8',
      strokeWidth: 1,
      dash: 0
    });
  }
};

export default graphConfig;
