
import { GeometryGraphConfig } from "../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-2, 6, 6, -2],
  showAxis: false,
  showGrid: true,
  init: (board) => {
    // Square ABCD Center O
    const A = board.create('point', [0, 4], { name: 'A', fixed: true });
    const B = board.create('point', [4, 4], { name: 'B', fixed: true });
    const C = board.create('point', [4, 0], { name: 'C', fixed: true });
    const D = board.create('point', [0, 0], { name: 'D', fixed: true });
    const O = board.create('midpoint', [A, C], { name: 'O' });

    board.create('polygon', [A, B, C, D]);

    // M on BC. CM = 3/2 CB => M is outside segment BC?
    // vec(CM) = 1.5 vec(CB). C is origin. B is (0, 4) relative to C.
    // M would be at (0, 6).
    // Let's visualize. C(4,0), B(4,4). vec(CB)=(0,4).
    // vec(CM) = (0, 6). M = (4, 6).
    
    const M = board.create('point', [4, 6], { name: 'M', color: '#3b82f6' });
    board.create('segment', [C, M], { strokeColor: '#94a3b8', dash: 2 });

    // Perpendicular to OM at O
    const lineOM = board.create('line', [O, M], { strokeColor: '#3b82f6', dash: 2 });
    const perp = board.create('perpendicular', [lineOM, O], { strokeColor: '#10b981' });

    // Intersection N with (AB)
    const lineAB = board.create('line', [A, B], { visible: false });
    // AB is y=4.
    const N = board.create('intersection', [perp, lineAB], { name: 'N', color: '#10b981' });

    // Check Rotation O, pi/2.
    // r(M) should be N.
    // O(2,2). M(4,6). vec(OM) = (2, 4).
    // Rot pi/2 of (2, 4) is (-4, 2).
    // O + (-4, 2) = (2-4, 2+2) = (-2, 4).
    // N should be at (-2, 4).
    // N is on line AB (y=4). And x=-2 is on extension of AB. Consistent.
    
    board.create('segment', [O, N], { strokeColor: '#10b981' });
    board.create('segment', [O, M], { strokeColor: '#3b82f6' });
    
    board.create('angle', [M, O, N], { type: 'square' });
  }
};

export default graphConfig;
