import { GeometryGraphConfig } from "../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 6, 7, -2],
  showAxis: true,
  showGrid: true,
  keepAspectRatio: true,
  init: (board) => {
    // Point A (origine des vecteurs)
    const A = board.create('point', [1, 1], {
      name: '',
      fixed: true,
      size: 4,
      color: '#1e293b'
    });
    board.create('text', [0.6, 0.6, '\\(A\\)'], {
      fontSize: 14,
      useMathJax: true,
      fixed: true
    });

    // Point B (extrémité de u)
    const B = board.create('point', [5, 1.5], {
      name: '',
      size: 4,
      color: '#3b82f6'
    });
    board.create('text', [5.2, 1.2, '\\(B\\)'], {
      fontSize: 14,
      color: '#3b82f6',
      useMathJax: true
    });

    // Vecteur u = AB
    board.create('arrow', [A, B], {
      strokeColor: '#3b82f6',
      strokeWidth: 3,
      lastArrow: { type: 2, size: 7 }
    });
    board.create('text', [3, 0.8, '\\(\\vec{u}\\)'], {
      fontSize: 14,
      color: '#3b82f6',
      useMathJax: true,
      fixed: true
    });

    // Point C (extrémité de v)
    const C = board.create('point', [2.5, 3], {
      name: '',
      size: 4,
      color: '#10b981'
    });
    board.create('text', [2.7, 3.2, '\\(C\\)'], {
      fontSize: 14,
      color: '#10b981',
      useMathJax: true
    });

    // Vecteur v = AC
    board.create('arrow', [A, C], {
      strokeColor: '#10b981',
      strokeWidth: 3,
      lastArrow: { type: 2, size: 7 }
    });
    board.create('text', [1.4, 2.2, '\\(\\vec{v}\\)'], {
      fontSize: 14,
      color: '#10b981',
      useMathJax: true,
      fixed: true
    });

    // Calcul du produit vectoriel (représentation 2D simplifiée)
    // w = u ∧ v est perpendiculaire au plan (u, v), donc "sort" de l'écran
    // On le représente verticalement vers le haut
    const wEnd = board.create('point', [
      () => A.X(),
      () => {
        // Calcul de ||u ∧ v|| = ||u|| * ||v|| * sin(angle)
        const ux = B.X() - A.X();
        const uy = B.Y() - A.Y();
        const vx = C.X() - A.X();
        const vy = C.Y() - A.Y();
        // En 2D, le "produit vectoriel" donne un scalaire (composante z)
        const crossZ = ux * vy - uy * vx;
        // Normaliser pour l'affichage
        const scale = Math.min(Math.abs(crossZ) / 3, 3);
        return A.Y() + (crossZ > 0 ? scale : -scale) + 3;
      }
    ], { visible: false });

    // Vecteur w = u ∧ v (représenté perpendiculaire au plan)
    const wDisplay = board.create('point', [1, 5], {
      name: '',
      size: 4,
      color: '#ef4444'
    });
    board.create('arrow', [A, wDisplay], {
      strokeColor: '#ef4444',
      strokeWidth: 3,
      lastArrow: { type: 2, size: 7 }
    });
    board.create('text', [0.5, 5.2, '\\(\\vec{w} = \\vec{u} \\wedge \\vec{v}\\)'], {
      fontSize: 13,
      color: '#ef4444',
      useMathJax: true,
      fixed: true
    });

    // Angle droit entre w et u
    board.create('angle', [B, A, wDisplay], {
      radius: 0.5,
      fillColor: '#dbeafe',
      strokeColor: '#3b82f6',
      type: 'square'
    });

    // Angle droit entre w et v
    board.create('angle', [wDisplay, A, C], {
      radius: 0.6,
      fillColor: '#d1fae5',
      strokeColor: '#10b981',
      type: 'square'
    });

    // Parallélogramme ABDC (pour montrer l'aire)
    const D = board.create('point', [
      () => B.X() + C.X() - A.X(),
      () => B.Y() + C.Y() - A.Y()
    ], {
      name: '',
      size: 3,
      color: '#94a3b8'
    });
    board.create('text', [
      () => D.X() + 0.2,
      () => D.Y() + 0.2,
      '\\(D\\)'
    ], {
      fontSize: 12,
      color: '#94a3b8',
      useMathJax: true
    });

    // Parallélogramme
    board.create('polygon', [A, B, D, C], {
      fillColor: '#fef3c7',
      fillOpacity: 0.4,
      borders: {
        strokeColor: '#f59e0b',
        strokeWidth: 1,
        dash: 2
      }
    });

    // Affichage dynamique
    board.create('text', [3.5, 5, () => {
      const ux = B.X() - A.X();
      const uy = B.Y() - A.Y();
      const vx = C.X() - A.X();
      const vy = C.Y() - A.Y();
      const crossZ = Math.abs(ux * vy - uy * vx);
      return `\\(\\|\\vec{u} \\wedge \\vec{v}\\| = ${crossZ.toFixed(2)}\\)`;
    }], {
      fontSize: 13,
      color: '#1e293b',
      useMathJax: true,
      fixed: true
    });

    // Aire du parallélogramme
    board.create('text', [3.5, 4.3, () => {
      const ux = B.X() - A.X();
      const uy = B.Y() - A.Y();
      const vx = C.X() - A.X();
      const vy = C.Y() - A.Y();
      const aire = Math.abs(ux * vy - uy * vx);
      return `Aire = ${aire.toFixed(2)}`;
    }], {
      fontSize: 12,
      color: '#f59e0b',
      fixed: true
    });

    // Légende
    board.create('text', [2, -1.2, '\\(\\vec{w} \\perp \\vec{u}\\) et \\(\\vec{w} \\perp \\vec{v}\\)'], {
      fontSize: 13,
      color: '#64748b',
      useMathJax: true,
      fixed: true
    });
  }
};

export default graphConfig;