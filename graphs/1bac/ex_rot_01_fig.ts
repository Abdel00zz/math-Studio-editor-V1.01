
import { GeometryGraphConfig } from "../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-5, 5, 5, -5],
  showAxis: false,
  showGrid: true,
  init: (board) => {
    // Point A center
    const A = board.create('point', [0, 0], { name: 'A', size: 4, color: '#1e293b', fixed: true });
    
    // Point B for the first square
    const B = board.create('point', [3, -1], { name: 'B', size: 3, color: '#3b82f6' });
    
    // Construct Square ABCD direct
    const D = board.create('point', [
      () => A.X() - (B.Y() - A.Y()),
      () => A.Y() + (B.X() - A.X())
    ], { name: 'D', color: '#3b82f6' });
    
    const C = board.create('point', [
      () => B.X() - (B.Y() - A.Y()),
      () => B.Y() + (B.X() - A.X())
    ], { name: 'C', color: '#3b82f6' });

    board.create('polygon', [A, B, C, D], { fillColor: '#3b82f6', fillOpacity: 0.1 });

    // Construct Square AEFG
    // Condition: (AD, AE) = pi/2 => E is rotation of D by pi/2.
    // E is "left" of AD.
    const E = board.create('point', [
      () => A.X() - (D.Y() - A.Y()),
      () => A.Y() + (D.X() - A.X())
    ], { name: 'E', color: '#10b981' });

    // G is rotated E by +pi/2.
    const G = board.create('point', [
        () => A.X() - (E.Y() - A.Y()),
        () => A.Y() + (E.X() - A.X())
    ], { name: 'G', color: '#10b981' });
    
    const F = board.create('point', [
        () => E.X() + (G.X() - A.X()),
        () => E.Y() + (G.Y() - A.Y())
    ], { name: 'F', color: '#10b981' });

    board.create('polygon', [A, E, F, G], { fillColor: '#10b981', fillOpacity: 0.1 });

    // Barycenter K
    board.create('point', [
        () => -A.X() + B.X() + C.X(),
        () => -A.Y() + B.Y() + C.Y()
    ], { name: 'K', visible: false }); 

    // Let's display the angle arcs
    board.create('angle', [B, A, D], { radius: 0.5, name: '' });
    board.create('angle', [D, A, E], { radius: 0.6, name: '' });
  }
};

export default graphConfig;
