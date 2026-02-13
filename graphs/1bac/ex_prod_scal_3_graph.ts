
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-4, 5, 8, -4],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // Points A(1, -1), B(4, -1), C(-2, 2)
    const A = board.create('point', [1, -1], { name: 'A', color: '#1e293b', size: 4, fixed: true });
    const B = board.create('point', [4, -1], { name: 'B', color: '#1e293b', size: 3, fixed: true });
    const C = board.create('point', [-2, 2], { name: 'C', color: '#1e293b', size: 3, fixed: true });

    // Droites supports (AB) et (AC) pour visualiser les distances
    const lineAB = board.create('line', [A, B], { strokeColor: '#94a3b8', strokeWidth: 1, dash: 2 });
    const lineAC = board.create('line', [A, C], { strokeColor: '#94a3b8', strokeWidth: 1, dash: 2 });
    
    // Labels des droites
    board.create('text', [6, -0.7, "(AB)"], { color: '#94a3b8' });
    board.create('text', [-3, 2.2, "(AC)"], { color: '#94a3b8' });

    // Triangle ABC
    board.create('polygon', [A, B, C], { 
      fillColor: '#fff7ed', 
      fillOpacity: 0.2,
      borders: { strokeColor: '#f97316', strokeWidth: 2 } 
    });

    // Hauteur issue de A
    const BC = board.create('line', [B, C], { visible: false });
    board.create('perpendicular', [BC, A], { strokeColor: '#3b82f6', dash: 2 });
    board.create('text', [0.5, 0.5, "Hauteur"], { color: '#3b82f6', fontSize: 10 });

    // Angle A
    board.create('angle', [B, A, C], { radius: 1.5, fillColor: '#f59e0b', fillOpacity: 0.3, label: {visible: false} });

    // La bissectrice intérieure (solution)
    const bisector = board.create('bisector', [B, A, C], { strokeColor: '#10b981', strokeWidth: 3 });
    board.create('text', [3, 2, "Bissectrice"], { color: '#10b981', fontSize: 12, anchorX:'left' });

    // Point M générique sur la bissectrice pour illustrer l'équidistance
    const M = board.create('glider', [2, 0.5, bisector], { name: 'M', color: '#10b981', size: 3 });
    
    // Projections pour montrer les distances
    board.create('perpendicular', [lineAB, M], { strokeColor: '#10b981', dash: 3, strokeWidth: 1 });
    board.create('perpendicular', [lineAC, M], { strokeColor: '#10b981', dash: 3, strokeWidth: 1 });
  }
};

export default graphConfig;
