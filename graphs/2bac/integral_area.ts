
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 6, 6, -2],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // Function f(x) = 0.5*x^2 + 1
    const f = board.create('functiongraph', [
      (x: number) => 0.5 * x * x + 1,
      -1, 5
    ], { strokeColor: '#3b82f6', strokeWidth: 3 });

    // Limits a and b (sliders)
    const a = board.create('slider', [[0.5, 5], [2.5, 5], [0, 1, 3]], { name: 'a', snapWidth: 0.5 });
    const b = board.create('slider', [[3.5, 5], [5.5, 5], [1.5, 3, 4]], { name: 'b', snapWidth: 0.5 });

    // Integral (Area)
    board.create('integral', [[() => a.Value(), () => b.Value()], f], {
        color: '#10b981',
        fillOpacity: 0.3,
        label: { visible: false }
    });

    // Points on axis
    board.create('point', [() => a.Value(), 0], { name: 'a', size: 2, color: '#1e293b', fixed: true });
    board.create('point', [() => b.Value(), 0], { name: 'b', size: 2, color: '#1e293b', fixed: true });

    // Dynamic LaTeX Text
    board.create('text', [1, 4, () => {
        const valA = a.Value();
        const valB = b.Value();
        // Primitive F(x) = (0.5/3)x^3 + x
        const F = (x: number) => (0.5/3)*Math.pow(x,3) + x;
        const area = F(valB) - F(valA);
        return `\\[ \\mathcal{A} = \\int_{${valA.toFixed(1)}}^{${valB.toFixed(1)}} f(x)dx \\approx ${area.toFixed(2)} \\]`;
    }], { 
        fontSize: 14, 
        color: '#10b981',
        useMathJax: true,
        fixed: true
    });
  }
};

export default graphConfig;
