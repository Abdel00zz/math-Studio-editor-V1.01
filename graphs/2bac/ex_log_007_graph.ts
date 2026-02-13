import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-3, 8, 8, -4],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // Droite y = x
    board.create('line', [[0, 0], [1, 1]], { strokeColor: '#94a3b8', dash: 2, strokeWidth: 1 });

    // Fonction f(x) = 2x ln(x) - 2x
    board.create('functiongraph', [
      (x: number) => {
          if (x <= 0) return NaN;
          return 2 * x * Math.log(x) - 2 * x;
      },
      0, 8
    ], { strokeColor: '#3b82f6', strokeWidth: 2 });

    // Points remarquables
    // Origine (0,0)
    board.create('point', [0, 0], { name: 'O', size: 2, color: '#1e293b', fixed: true });
    
    // Minimum (1, -2)
    board.create('point', [1, -2], { name: 'S', size: 3, color: '#ef4444', fixed: true, label: {offset: [0, -10]} });
    // Tangente horizontale au minimum y = -2
    board.create('segment', [[0.5, -2], [1.5, -2]], { strokeColor: '#10b981', strokeWidth: 2 });

    // Intersection avec (Ox) : e approx 2.718
    const e = Math.E;
    board.create('point', [e, 0], { name: 'A', size: 3, color: '#ef4444', fixed: true });

    // Intersection avec y=x : e^1.5 approx 4.48
    const x_inter = Math.pow(Math.E, 1.5);
    board.create('point', [x_inter, x_inter], { name: 'B', size: 3, color: '#ef4444', fixed: true });

    // Inverse function g^-1 (Restriction sur [1, +inf[ -> image [-2, +inf[)
    // Symétrique par rapport à y=x
    board.create('curve', [
        (t: number) => 2 * t * Math.log(t) - 2 * t, // x(t) = f(t)
        (t: number) => t,                           // y(t) = t
        1, 8
    ], { strokeColor: '#8b5cf6', strokeWidth: 2, dash: 2 });

    // Point de départ de la réciproque (-2, 1)
    board.create('point', [-2, 1], { name: "S'", size: 3, color: '#8b5cf6', fixed: true });
    // Tangente verticale à la réciproque en -2
    board.create('segment', [[-2, 0.5], [-2, 1.5]], { strokeColor: '#10b981', strokeWidth: 2 });


    // Labels
    board.create('text', [5, 4, "\\( (C_f) \\)"], { color: '#3b82f6', fontSize: 16, useMathJax: true, parse: false });
    board.create('text', [3, 6, "\\( (C_{g^{-1}}) \\)"], { color: '#8b5cf6', fontSize: 16, useMathJax: true, parse: false });
    board.create('text', [7, 6, "\\( y = x \\)"], { color: '#94a3b8', fontSize: 12, useMathJax: true, parse: false });
  }
};

export default graphConfig;
