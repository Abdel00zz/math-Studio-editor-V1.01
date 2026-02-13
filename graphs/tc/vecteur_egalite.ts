
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 6, 9, -2],
  showAxis: false,
  showGrid: true,
  init: (board) => {
    // Points A, B, C mobiles
    const A = board.create('point', [1, 1], { name: 'A', color: '#1e293b', size: 3 });
    const B = board.create('point', [4, 2], { name: 'B', color: '#1e293b', size: 3 });
    const C = board.create('point', [3, 4], { name: 'C', color: '#1e293b', size: 3 });

    // Vecteur u = AB
    const vecU = board.create('arrow', [A, B], { 
      strokeColor: '#3b82f6', 
      strokeWidth: 3,
      name: 'u'
    });

    // Point D défini pour que CD = AB (donc ABDC est un parallélogramme)
    // D = C + (B - A)
    const D = board.create('point', [
        () => C.X() + (B.X() - A.X()),
        () => C.Y() + (B.Y() - A.Y())
    ], { 
      name: 'D', 
      color: '#10b981', 
      size: 3, 
      fixed: true // D dépend des autres
    });

    // Vecteur v = CD
    const vecV = board.create('arrow', [C, D], { 
      strokeColor: '#10b981', 
      strokeWidth: 3,
      name: 'v'
    });

    // Parallélogramme (pointillés)
    board.create('segment', [A, C], { strokeColor: '#94a3b8', dash: 2 });
    board.create('segment', [B, D], { strokeColor: '#94a3b8', dash: 2 });

    // Labels
    board.create('text', [4, 0, "\\[ \\vec{u} = \\vec{v} \\iff ABDC \\text{ parallélogramme} \\]"], {
      fontSize: 14,
      color: '#1e293b',
      useMathJax: true,
      fixed: true
    });
  }
};

export default graphConfig;
