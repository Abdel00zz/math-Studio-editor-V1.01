
import { GeometryGraphConfig } from "../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-6, 6, 8, -4],
  showAxis: false,
  showGrid: true,
  init: (board) => {
    // Points A, B, C
    const A = board.create('point', [1, 2], { name: 'A', color: '#1e293b' });
    const B = board.create('point', [3, -1], { name: 'B', color: '#1e293b' });
    const C = board.create('point', [-2, 0], { name: 'C', color: '#1e293b' });

    board.create('polygon', [A, B, C], { fillColor: '#e0e7ff' });

    // Cas k = -1
    // AD = -AB => A milieu de [DB] => D symétrique de B par rapport à A
    const D = board.create('point', [
        () => A.X() - (B.X() - A.X()),
        () => A.Y() - (B.Y() - A.Y())
    ], { name: 'D', color: '#ef4444' });

    // CE = -CA => C milieu de [EA] => E symétrique de A par rapport à C
    const E = board.create('point', [
        () => C.X() - (A.X() - C.X()),
        () => C.Y() - (A.Y() - C.Y())
    ], { name: 'E', color: '#ef4444' });

    // Segments de construction
    board.create('segment', [D, B], { strokeColor: '#94a3b8', dash: 2 });
    board.create('segment', [E, A], { strokeColor: '#94a3b8', dash: 2 });

    // Milieux B' (AC) et C' (AB)
    const B_prime = board.create('midpoint', [A, C], { name: "B'", color: '#64748b', size: 2 });
    const C_prime = board.create('midpoint', [A, B], { name: "C'", color: '#64748b', size: 2 });
    
    // Milieu I de [DE]
    const I = board.create('midpoint', [D, E], { name: 'I', color: '#10b981' });
    
    // Alignement I, B', C'
    board.create('line', [B_prime, C_prime], { strokeColor: '#10b981', dash: 1, strokeWidth: 1 });

    board.create('text', [3, 4, "k = -1"], { fontSize: 16, fontWeight: 'bold', color: '#ef4444', fixed: true, anchorY: 'top' });
  }
};

export default graphConfig;
