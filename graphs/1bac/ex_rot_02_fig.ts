
import { GeometryGraphConfig } from "../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-2, 6, 8, -4],
  showAxis: false,
  showGrid: false,
  init: (board) => {
    const A = board.create('point', [2, 1], { name: 'A', color: '#1e293b' });
    const B = board.create('point', [5, 0], { name: 'B', color: '#1e293b' });
    const C = board.create('point', [1, 4], { name: 'C', color: '#1e293b' });

    board.create('polygon', [A, B, C], { fillColor: '#e0e7ff' });

    // Triangle ACE Equilateral Direct (Exterior)
    // Rotate C around A by -60 degrees if order is ACE direct?
    // Direct usually means counter-clockwise. A -> C -> E.
    // Vector AC rotated by +60 deg gives point E? No, that would be internal if angle A is < 60.
    // "Extérieur" means E and B are on opposite sides of AC.
    // Let's compute E such that (AC, AE) = +pi/3.
    const E = board.create('point', [
        () => A.X() + (C.X()-A.X()) * 0.5 - (C.Y()-A.Y()) * 0.866,
        () => A.Y() + (C.X()-A.X()) * 0.866 + (C.Y()-A.Y()) * 0.5
    ], { name: 'E', color: '#10b981' });
    board.create('polygon', [A, C, E], { fillColor: '#10b981', fillOpacity: 0.2 });

    // Triangle ABD Equilateral Exterior.
    // D and C opposite sides of AB.
    // (AB, AD) = -pi/3.
    const D = board.create('point', [
        () => A.X() + (B.X()-A.X()) * 0.5 + (B.Y()-A.Y()) * 0.866,
        () => A.Y() - (B.X()-A.X()) * 0.866 + (B.Y()-A.Y()) * 0.5
    ], { name: 'D', color: '#f59e0b' });
    board.create('polygon', [A, B, D], { fillColor: '#f59e0b', fillOpacity: 0.2 });
    
    // Segments of interest
    board.create('segment', [C, D], { strokeColor: '#ef4444', dash: 2 });
    board.create('segment', [B, E], { strokeColor: '#ef4444', dash: 2 });
    
    board.create('text', [3, -2, "r(A, \\pi/3) : D \\to B, C \\to E"], { color: '#64748b' });
  }
};

export default graphConfig;
