
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-2, 3, 3, -2],
  showAxis: true,
  showGrid: true,
  keepAspectRatio: true,
  init: (board) => {
    const O = board.create('point', [0, 0], { name: 'O', fixed: true });
    
    // a = sqrt(3) e^(i pi/3)
    const A = board.create('point', [Math.sqrt(3)*0.5, Math.sqrt(3)*Math.sqrt(3)/2], { name: 'A(a)', color: '#3b82f6' });
    
    // b = bar(a)
    const B = board.create('point', [Math.sqrt(3)*0.5, -Math.sqrt(3)*Math.sqrt(3)/2], { name: 'B(\\bar{a})', color: '#ef4444' });

    board.create('segment', [O, A], { strokeColor: '#94a3b8', dash: 2 });
    board.create('segment', [O, B], { strokeColor: '#94a3b8', dash: 2 });

    // Angle de rotation 2pi/3
    board.create('arc', [O, B, A], { strokeColor: '#f59e0b', strokeWidth: 2, lastArrow: true });
    board.create('text', [0.5, 0, "\\[ 2\\pi/3 \\]"], { color: '#f59e0b', useMathJax: true });
  }
};

export default graphConfig;
