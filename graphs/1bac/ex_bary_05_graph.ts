
import { GeometryGraphConfig } from "../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-3, 8, 12, -4],
  showAxis: false,
  showGrid: true,
  init: (board) => {
    const A = board.create('point', [0, 5], { name: 'A', color: '#1e293b' });
    const B = board.create('point', [2, 1], { name: 'B', color: '#1e293b' });
    const C = board.create('point', [8, 1], { name: 'C', color: '#1e293b' });

    board.create('polygon', [A, B, C], { borders: { strokeColor: '#cbd5e1' } });

    // K = bar{(A,-1); (B,-4)} => AK = 4/5 AB
    const K = board.create('point', [
        () => A.X() + 0.8 * (B.X() - A.X()),
        () => A.Y() + 0.8 * (B.Y() - A.Y())
    ], { name: 'K', color: '#f59e0b' });
    board.create('segment', [A, B], { strokeColor: '#f59e0b', strokeWidth: 2 });

    // I = bar{(B,-4); (C,3)} => BI = 3/( -1) BC = -3 BC
    // Somme = -1. BI = -3 BC
    const I = board.create('point', [
        () => B.X() - 3 * (C.X() - B.X()),
        () => B.Y() - 3 * (C.Y() - B.Y())
    ], { name: 'I', color: '#f59e0b' });
    board.create('line', [B, C], { strokeColor: '#94a3b8', dash: 2 });

    // G = bar{(A,-1); (B,-4); (C,3)}
    // G milieu de [AI] (d'après Q2)
    const G = board.create('midpoint', [A, I], { name: 'G', color: '#ef4444', size: 4 });
    board.create('segment', [A, I], { strokeColor: '#ef4444', dash: 2 });

    // Vérification alignement C, K, G (d'après Q3c)
    board.create('line', [C, K], { strokeColor: '#10b981', dash: 2, strokeWidth: 1 });
  }
};

export default graphConfig;
