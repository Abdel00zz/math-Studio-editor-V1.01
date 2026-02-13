
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 6, 6, -3],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // Triangle OAB isocèle en O
    const O = board.create('point', [0, 0], { name: 'O', fixed: true, color: '#1e293b' });
    const A = board.create('point', [2, Math.sqrt(5)], { name: 'A', color: '#3b82f6' });
    const B = board.create('point', [2, -Math.sqrt(5)], { name: 'B', color: '#3b82f6' });
    
    board.create('polygon', [O, A, B], { fillColor: '#e0e7ff', borders: { strokeColor: '#3b82f6' } });
    
    // Point C
    const C = board.create('point', [2, -Math.sqrt(5)], { name: 'C (approx)', visible: false }); 
    // Note: Dans l'exo C est différent de B. C = 2 - sqrt(5) (réel).
    const C_real = board.create('point', [2 - Math.sqrt(5), 0], { name: 'C', color: '#ef4444' });

    // Carré ADBC (A, D, B, C)
    // D est l'image de B par translation CA
    // vec(CA) = A - C
    const D = board.create('point', [
        () => B.X() + (A.X() - C_real.X()),
        () => B.Y() + (A.Y() - C_real.Y())
    ], { name: 'D', color: '#10b981' });

    board.create('polygon', [A, D, B, C_real], { fillColor: '#dcfce7', borders: { strokeColor: '#10b981' } });
  }
};

export default graphConfig;
