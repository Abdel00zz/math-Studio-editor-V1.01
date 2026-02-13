
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-4, 10, 10, -6],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    const A = board.create('point', [-2, 2], { name: 'A', color: '#1e293b' });
    const B = board.create('point', [4, -4], { name: 'B', color: '#1e293b' });
    const C = board.create('point', [4, 8], { name: 'C', color: '#1e293b' });

    // Triangle ABC
    board.create('polygon', [A, B, C], { fillColor: '#e0e7ff' });

    // Milieu Omega de [BC]
    const Omega = board.create('midpoint', [B, C], { name: 'Ω', color: '#ef4444' });

    // Cercle circonscrit (Centre Omega, passe par A)
    board.create('circle', [Omega, A], { strokeColor: '#ef4444', strokeWidth: 2 });
  }
};

export default graphConfig;
