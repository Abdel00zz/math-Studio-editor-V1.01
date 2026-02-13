
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-4, 6, 6, -2],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    const A = board.create('point', [1, 5], { name: 'A' });
    const D = board.create('point', [3, 1], { name: 'D' });
    const E = board.create('point', [1, 0], { name: 'E' });
    const F = board.create('point', [-1, 1], { name: 'F' });

    // Cercle circonscrit (Diamètre AE)
    const center = board.create('midpoint', [A, E], { visible: false });
    board.create('circle', [center, A], { strokeColor: '#8b5cf6', dash: 2 });

    // Triangle AEF rectangle en F
    board.create('polygon', [A, E, F], { borders: { strokeColor: '#ef4444' }, fillOpacity: 0.1 });
    board.create('angle', [A, F, E], { type: 'square' });
  }
};

export default graphConfig;
