
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 3, 10, -3],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // Fonction g(x) = 2*sqrt(x) - 2 - ln(x)
    board.create('functiongraph', [
      (x: number) => {
        if (x <= 0) return NaN;
        return 2 * Math.sqrt(x) - 2 - Math.log(x);
      },
      0.01, 10
    ], { strokeColor: '#3b82f6', strokeWidth: 2 });

    // Minimum en 1 (g(1) = 0)
    board.create('point', [1, 0], { name: 'm', size: 3, color: '#ef4444', fixed: true });
    
    // Zone de positivité
    board.create('text', [3, 1, "\\( g(x) \\ge 0 \\)"], { color: '#10b981', fontSize: 14, useMathJax: true, parse: false });

    // Comparaison ln(x) et 2sqrt(x) - 2 (Optionnel, illustre l'inégalité)
    /*
    board.create('functiongraph', [
        (x: number) => Math.log(x),
        0.01, 10
    ], { strokeColor: '#94a3b8', dash: 2 });
    */
  }
};

export default graphConfig;
