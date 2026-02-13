
import { GeometryGraphConfig } from "../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-3, 6, 7, -4],
  showAxis: false,
  showGrid: true,
  init: (board) => {
    const A = board.create('point', [-1, 3], { name: 'A', size: 3, color: '#1e293b' });
    const B = board.create('point', [5, 4], { name: 'B', size: 3, color: '#1e293b' });
    const C = board.create('point', [4, -2], { name: 'C', size: 3, color: '#1e293b' });
    const D = board.create('point', [-2, -1], { name: 'D', size: 3, color: '#1e293b' });

    board.create('polygon', [A, B, C, D], { borders: { strokeColor: '#334155' } });

    // Milieux des côtés
    const I = board.create('midpoint', [A, B], { visible: false }); // Milieu AB
    const J = board.create('midpoint', [C, D], { visible: false }); // Milieu CD
    const K = board.create('midpoint', [B, C], { visible: false }); // Milieu BC
    const L = board.create('midpoint', [D, A], { visible: false }); // Milieu DA

    // Bimédianes
    board.create('segment', [I, J], { strokeColor: '#10b981', strokeWidth: 2, dash: 2 });
    board.create('segment', [K, L], { strokeColor: '#10b981', strokeWidth: 2, dash: 2 });

    // Barycentre (Intersection des bimédianes)
    board.create('point', [
      () => (A.X() + B.X() + C.X() + D.X()) / 4,
      () => (A.Y() + B.Y() + C.Y()) / 4 + D.Y() / 4 
    ], { name: 'G', color: '#ef4444', size: 4 });

    board.create('text', [2, -3, "\\[ G = \\text{Isobar}(ABCD) \\]"], { 
      fontSize: 16,
      color: '#ef4444', 
      useMathJax: true,
      fixed: true,
      parse: false,
      anchorX: 'middle',
      anchorY: 'top'
    });
  }
};

export default graphConfig;
