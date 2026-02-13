
import { GeometryGraphConfig } from "../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 6, 7, -1],
  showAxis: false,
  showGrid: false,
  init: (board) => {
    // Isosceles Triangle ABC at A
    const A = board.create('point', [3, 5], { name: 'A', fixed: true, color: '#1e293b' });
    const B = board.create('point', [0, 0], { name: 'B', fixed: true, color: '#1e293b' });
    const C = board.create('point', [6, 0], { name: 'C', fixed: true, color: '#1e293b' }); // AC = sqrt(3^2 + 5^2) = AB

    board.create('polygon', [A, B, C], { borders: { strokeColor: '#334155' } });

    // Point M on [BC]
    const M = board.create('glider', [4, 0, board.create('segment', [B, C], { visible: false })], { name: 'M', color: '#3b82f6' });

    // Parallel to AB passing through M => cuts AC at E
    const parAB = board.create('parallel', [board.create('line', [A, B], { visible: false }), M], { visible: false });
    const E = board.create('intersection', [parAB, board.create('line', [A, C], { visible: false })], { name: 'E', color: '#10b981' });
    board.create('segment', [M, E], { strokeColor: '#10b981' });

    // Parallel to AC passing through M => cuts AB at F
    const parAC = board.create('parallel', [board.create('line', [A, C], { visible: false }), M], { visible: false });
    const F = board.create('intersection', [parAC, board.create('line', [A, B], { visible: false })], { name: 'F', color: '#f59e0b' });
    board.create('segment', [M, F], { strokeColor: '#f59e0b' });

    // Segments to compare
    board.create('segment', [A, E], { strokeColor: '#ef4444', strokeWidth: 3 });
    board.create('segment', [B, F], { strokeColor: '#ef4444', strokeWidth: 3 });
    
    board.create('text', [3, 2, "AE = BF"], { color: '#ef4444', fontSize: 16 });
  }
};

export default graphConfig;
