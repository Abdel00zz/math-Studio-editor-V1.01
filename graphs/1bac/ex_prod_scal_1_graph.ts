
import { GeometryGraphConfig } from "../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-3, 4, 5, -5],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // Points A(1, -1), B(-1, 1), C(sqrt(3), sqrt(3))
    // Approximation pour sqrt(3) ~ 1.73
    const A = board.create('point', [1, -1], { name: 'A', color: '#3b82f6', label: {offset:[5,-10]} });
    const B = board.create('point', [-1, 1], { name: 'B', color: '#3b82f6' });
    const C = board.create('point', [Math.sqrt(3), Math.sqrt(3)], { name: 'C', color: '#3b82f6' });
    const D = board.create('point', [1, 0], { name: 'D', color: '#64748b', size: 2 });

    // Triangle ABC
    board.create('polygon', [A, B, C], { 
      fillColor: '#e0e7ff', 
      borders: { strokeColor: '#1e293b' } 
    });

    // Droite (AB) : y = -x
    board.create('line', [A, B], { strokeColor: '#94a3b8', dash: 2 });
    board.create('text', [-2, 2.2, "(AB): y=-x"], { color: '#94a3b8' });

    // Cercle (C) de centre A passant par C
    board.create('circle', [A, C], { strokeColor: '#10b981', name: '(C)' });

    // Tangente en B
    // Vecteur AB est normal à la tangente en B
    // Une droite perpendiculaire à (AB) passant par B
    board.create('perpendicular', [board.create('line', [A, B], {visible: false}), B], { strokeColor: '#f59e0b', strokeWidth: 2 });

    // Droite (Delta) passant par D et parallèle à (AB)
    board.create('parallel', [board.create('line', [A, B], {visible: false}), D], { strokeColor: '#ef4444' });
    board.create('text', [2, -1, "(\\Delta)"], { color: '#ef4444' });
  }
};

export default graphConfig;
