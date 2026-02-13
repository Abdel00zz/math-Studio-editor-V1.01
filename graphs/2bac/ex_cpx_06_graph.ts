
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-6, 5, 5, -5],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    const O = board.create('point', [0, 0], { name: 'O', fixed: true });
    const D = board.create('point', [-2, 0], { name: 'D', fixed: true, color: '#10b981' });

    // Cercle Gamma' (O, 4)
    board.create('circle', [O, 4], { strokeColor: '#3b82f6', name: "(\\Gamma')" });

    // Cercle Gamma (D, 2)
    board.create('circle', [D, 2], { strokeColor: '#10b981', name: "(\\Gamma)" });

    // Point d'intersection C(-4, 0)
    board.create('point', [-4, 0], { name: 'C', color: '#ef4444', size: 4 });
  }
};

export default graphConfig;
