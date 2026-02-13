
import { GeometryGraphConfig } from "../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-4, 6, 8, -3],
  showAxis: false,
  showGrid: false,
  init: (board) => {
    // Triangle ABC
    const A = board.create('point', [0, 0], { name: 'A', fixed: true, color: '#1e293b' });
    const B = board.create('point', [4, 0], { name: 'B', fixed: true, color: '#1e293b' });
    const C = board.create('point', [1.5, 3], { name: 'C', fixed: true, color: '#1e293b' });
    
    board.create('polygon', [A, B, C], { fillColor: '#e0e7ff' });

    // ACE Equilateral External
    // (AC, AE) = pi/3 (direct)
    const E = board.create('point', [
        () => A.X() + (C.X()-A.X()) * 0.5 - (C.Y()-A.Y()) * 0.866,
        () => A.Y() + (C.X()-A.X()) * 0.866 + (C.Y()-A.Y()) * 0.5
    ], { name: 'E', color: '#10b981' });
    board.create('polygon', [A, C, E], { fillColor: '#10b981', fillOpacity: 0.1 });

    // ABD Equilateral External
    // (AB, AD) = -pi/3 (so D is below)
    const D = board.create('point', [
        () => A.X() + (B.X()-A.X()) * 0.5 + (B.Y()-A.Y()) * 0.866,
        () => A.Y() - (B.X()-A.X()) * 0.866 + (B.Y()-A.Y()) * 0.5
    ], { name: 'D', color: '#f59e0b' });
    board.create('polygon', [A, B, D], { fillColor: '#f59e0b', fillOpacity: 0.1 });

    // Rotation r(A, pi/3)
    // r(C) = E ? Yes, AC=AE and angle is pi/3.
    // r(D) = B ? AD=AB and (AD, AB) = pi/3.
    // So CD -> EB.
    
    board.create('segment', [C, D], { strokeColor: '#ef4444' });
    board.create('segment', [E, B], { strokeColor: '#ef4444' });

    board.create('text', [2, -2, "CD = BE"], { color: '#ef4444', fontSize: 16 });
  }
};

export default graphConfig;
