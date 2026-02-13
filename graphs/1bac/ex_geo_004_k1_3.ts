
import { GeometryGraphConfig } from "../../types";

const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-5, 6, 7, -3], // [left, top, right, bottom]
  showAxis: false,
  showGrid: true,
  init: (board) => {
    // 1. Points de base A, B, C
    const A = board.create('point', [1, 4], { name: 'A', color: '#1e293b', size: 3 });
    const B = board.create('point', [-3, -1], { name: 'B', color: '#1e293b', size: 3 });
    const C = board.create('point', [5, -1], { name: 'C', color: '#1e293b', size: 3 });

    // 2. Triangle ABC
    board.create('polygon', [A, B, C], {
        fillColor: '#6366f1',
        fillOpacity: 0.1,
        borders: { strokeColor: '#6366f1', strokeWidth: 2 }
    });

    // 3. Point D défini par AD = 1/3 AB
    // Barycentre D = bar{(A, 2), (B, 1)} puisque AD = 1/3 AB => 3AD = AB => 3AD = AD + DB => 2AD - DB = 0
    // Ou plus simple avec JSXGraph : transformation ou point sur segment
    const D = board.create('point', [
        () => A.X() + (1/3) * (B.X() - A.X()),
        () => A.Y() + (1/3) * (B.Y() - A.Y())
    ], { name: 'D', color: '#ef4444', size: 4 });

    // 4. Point E défini par CE = 1/3 CA
    // Attention vectoriel : CE = 1/3 CA. E est sur [CA].
    const E = board.create('point', [
        () => C.X() + (1/3) * (A.X() - C.X()),
        () => C.Y() + (1/3) * (A.Y() - C.Y())
    ], { name: 'E', color: '#ef4444', size: 4 });

    // 5. Segments pour visualisation
    board.create('segment', [A, B], { strokeColor: '#94a3b8', strokeWidth: 1, dash: 2 });
    board.create('segment', [A, C], { strokeColor: '#94a3b8', strokeWidth: 1, dash: 2 });
    
    // Labels vectoriels (Optionnel pour faire joli)
    // board.create('text', [-1, 2, 'k=1/3'], {fontSize: 12, color: '#64748b'});
  }
};

export default graphConfig;
