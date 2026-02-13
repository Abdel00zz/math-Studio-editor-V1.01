import { GeometryGraphConfig } from "../../types";

/**
 * Graphe : Conservation des distances (isométrie)
 * Montre AB = A'B' pour un triangle ABC → A'B'C'
 */
export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-6, 5, 6, -5],
  showAxis: false,
  showGrid: false,
  init: (board) => {
    const theta = Math.PI / 4; // Angle fixe de 45°

    // Centre Ω (légèrement décalé)
    const omega = board.create('point', [-0.5, -1], {
      name: '',
      size: 5,
      fillColor: '#ef4444',
      strokeColor: '#dc2626',
      fixed: true
    });
    board.create('text', [-0.9, -1.5, '\\(\\Omega\\)'], { fontSize: 14, useMathJax: true });

    // Triangle ABC (mobile, positionné à droite)
    const A = board.create('point', [2, -1], { name: '', size: 4, fillColor: '#3b82f6' });
    const B = board.create('point', [4, -1], { name: '', size: 4, fillColor: '#3b82f6' });
    const C = board.create('point', [3, 1], { name: '', size: 4, fillColor: '#3b82f6' });

    board.create('text', [() => A.X() + 0.2, () => A.Y() - 0.4, '\\(A\\)'], { fontSize: 13, useMathJax: true, color: '#3b82f6' });
    board.create('text', [() => B.X() + 0.2, () => B.Y() - 0.4, '\\(B\\)'], { fontSize: 13, useMathJax: true, color: '#3b82f6' });
    board.create('text', [() => C.X() + 0.2, () => C.Y() + 0.2, '\\(C\\)'], { fontSize: 13, useMathJax: true, color: '#3b82f6' });

    // Triangle original
    board.create('polygon', [A, B, C], {
      fillColor: '#dbeafe',
      fillOpacity: 0.4,
      borders: { strokeColor: '#3b82f6', strokeWidth: 2 }
    });

    // Fonction de rotation autour de omega
    const rotate = (p: any) => {
      const dx = p.X() - omega.X();
      const dy = p.Y() - omega.Y();
      return [
        omega.X() + dx * Math.cos(theta) - dy * Math.sin(theta),
        omega.Y() + dx * Math.sin(theta) + dy * Math.cos(theta)
      ];
    };

    // Points images A', B', C'
    const Ap = board.create('point', [() => rotate(A)[0], () => rotate(A)[1]], { 
      name: '', size: 4, fillColor: '#10b981', fixed: true 
    });
    const Bp = board.create('point', [() => rotate(B)[0], () => rotate(B)[1]], { 
      name: '', size: 4, fillColor: '#10b981', fixed: true 
    });
    const Cp = board.create('point', [() => rotate(C)[0], () => rotate(C)[1]], { 
      name: '', size: 4, fillColor: '#10b981', fixed: true 
    });

    board.create('text', [() => Ap.X() - 0.5, () => Ap.Y() + 0.2, "\\(A'\\)"], { fontSize: 13, useMathJax: true, color: '#10b981' });
    board.create('text', [() => Bp.X() + 0.2, () => Bp.Y() + 0.2, "\\(B'\\)"], { fontSize: 13, useMathJax: true, color: '#10b981' });
    board.create('text', [() => Cp.X() - 0.5, () => Cp.Y() + 0.2, "\\(C'\\)"], { fontSize: 13, useMathJax: true, color: '#10b981' });

    // Triangle image
    board.create('polygon', [Ap, Bp, Cp], {
      fillColor: '#d1fae5',
      fillOpacity: 0.4,
      borders: { strokeColor: '#10b981', strokeWidth: 2 }
    });

    // Arc montrant la rotation
    board.create('arc', [omega, A, Ap], {
      strokeColor: '#f59e0b',
      strokeWidth: 1,
      dash: 2,
      lastArrow: true
    });
  }
};

export default graphConfig;
