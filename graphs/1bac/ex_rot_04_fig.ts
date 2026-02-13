
import { GeometryGraphConfig } from "../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-2, 6, 8, -4],
  showAxis: false,
  showGrid: true,
  init: (board) => {
    // Square ABCD Direct
    // (AB, AD) = pi/2. Let A(0,0), B(4,0) -> D(0,4)
    const A = board.create('point', [0, 0], { name: 'A', fixed: true, color: '#1e293b' });
    const B = board.create('point', [4, 0], { name: 'B', fixed: true, color: '#1e293b' });
    const D = board.create('point', [0, 4], { name: 'D', fixed: true, color: '#1e293b' });
    const C = board.create('point', [4, 4], { name: 'C', fixed: true, color: '#1e293b' });
    
    board.create('polygon', [A, B, C, D]);

    // Line (CD)
    const lineCD = board.create('line', [C, D], { visible: false });
    
    // Point M on (CD) outside
    const M = board.create('glider', [-1.5, 4, lineCD], { name: 'M', color: '#3b82f6' });
    board.create('line', [C, D], { strokeColor: '#94a3b8', dash: 2 }); // Visual line CD

    // Line AM
    const lineAM = board.create('line', [A, M], { strokeColor: '#3b82f6', dash: 2 });

    // Line perp to AM through A
    const perp = board.create('perpendicular', [lineAM, A], { strokeColor: '#10b981' });

    // Intersection N with (BC)
    const lineBC = board.create('line', [B, C], { visible: false });
    board.create('line', [B, C], { strokeColor: '#94a3b8', dash: 2 });
    
    const N = board.create('intersection', [perp, lineBC], { name: 'N', color: '#10b981' });

    // Rotation A, -pi/2
    // r(D) = B. r(M) = N.
    board.create('arc', [A, M, N], { strokeColor: '#ef4444', strokeWidth: 1, lastArrow: true });
    
    board.create('text', [1, 2, "r(A, -\\pi/2)"], { color: '#ef4444' });
  }
};

export default graphConfig;
