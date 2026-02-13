import { GeometryGraphConfig } from "../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 6, 8, -2],
  showAxis: true,
  showGrid: true,
  keepAspectRatio: true,
  init: (board) => {
    // Point A (origine du vecteur u)
    const A = board.create('point', [1, 1], {
      name: '',
      fixed: true,
      size: 4,
      color: '#1e293b'
    });
    board.create('text', [0.7, 0.6, '\\(A\\)'], {
      fontSize: 14,
      useMathJax: true,
      fixed: true
    });

    // Point B (extrémité du vecteur u)
    const B = board.create('point', [7, 1], {
      name: '',
      fixed: true,
      size: 4,
      color: '#1e293b'
    });
    board.create('text', [7.2, 0.6, '\\(B\\)'], {
      fontSize: 14,
      useMathJax: true,
      fixed: true
    });

    // Vecteur u = AB
    board.create('arrow', [A, B], {
      strokeColor: '#3b82f6',
      strokeWidth: 3,
      lastArrow: { type: 2, size: 6 }
    });
    board.create('text', [4, 0.4, '\\(\\vec{u}\\)'], {
      fontSize: 14,
      color: '#3b82f6',
      useMathJax: true,
      fixed: true
    });

    // Point C mobile
    const C = board.create('point', [4, 4], {
      name: '',
      size: 5,
      color: '#ef4444'
    });
    board.create('text', [
      () => C.X() + 0.2,
      () => C.Y() + 0.3,
      '\\(C\\)'
    ], {
      fontSize: 14,
      color: '#ef4444',
      useMathJax: true
    });

    // Vecteur v = AC
    board.create('arrow', [A, C], {
      strokeColor: '#ef4444',
      strokeWidth: 3,
      lastArrow: { type: 2, size: 6 }
    });
    board.create('text', [
      () => (A.X() + C.X()) / 2 - 0.5,
      () => (A.Y() + C.Y()) / 2 + 0.3,
      '\\(\\vec{v}\\)'
    ], {
      fontSize: 14,
      color: '#ef4444',
      useMathJax: true
    });

    // Droite (AB)
    const lineAB = board.create('line', [A, B], {
      strokeColor: '#94a3b8',
      strokeWidth: 1,
      dash: 2,
      visible: true
    });

    // Projection H de C sur (AB)
    const H = board.create('perpendicularpoint', [C, lineAB], {
      name: '',
      size: 4,
      color: '#10b981'
    });
    board.create('text', [
      () => H.X(),
      () => H.Y() - 0.5,
      '\\(H\\)'
    ], {
      fontSize: 14,
      color: '#10b981',
      useMathJax: true
    });

    // Segment CH (projection)
    board.create('segment', [C, H], {
      strokeColor: '#94a3b8',
      strokeWidth: 2,
      dash: 2
    });

    // Angle droit en H
    board.create('angle', [C, H, B], {
      radius: 0.4,
      fillColor: '#dbeafe',
      strokeColor: '#3b82f6',
      type: 'square'
    });

    // Segment AH coloré (mesure algébrique)
    board.create('segment', [A, H], {
      strokeColor: '#10b981',
      strokeWidth: 4
    });

    // Affichage dynamique du produit scalaire
    board.create('text', [0.5, 5.5, () => {
      const ax = B.X() - A.X();
      const ay = B.Y() - A.Y();
      const vx = C.X() - A.X();
      const vy = C.Y() - A.Y();
      const produit = ax * vx + ay * vy;
      return `\\(\\vec{u} \\cdot \\vec{v} = ${produit.toFixed(1)}\\)`;
    }], {
      fontSize: 16,
      color: '#1e293b',
      useMathJax: true,
      fixed: true
    });

    // Affichage AH
    board.create('text', [0.5, 4.8, () => {
      const ah = H.X() - A.X();
      const sign = ah >= 0 ? '' : '-';
      return `\\(AH = ${sign}${Math.abs(ah).toFixed(2)}\\)`;
    }], {
      fontSize: 13,
      color: '#10b981',
      useMathJax: true,
      fixed: true
    });

    // Formule de référence
    board.create('text', [3, -1.2, '\\(\\vec{u} \\cdot \\vec{v} = AB \\times AH\\)'], {
      fontSize: 14,
      color: '#64748b',
      useMathJax: true,
      fixed: true,
      anchorX: 'middle'
    });
  }
};

export default graphConfig;