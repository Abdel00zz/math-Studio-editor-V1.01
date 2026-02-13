
import { GeometryGraphConfig } from "../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 6, 8, -1],
  showAxis: true,
  showGrid: true,
  keepAspectRatio: true,
  init: (board) => {
    // Point A
    const A = board.create('point', [1, 1], {
      name: '',
      fixed: true,
      size: 4,
      color: '#3b82f6'
    });
    board.create('text', [0.6, 0.7, '\\(A\\)'], {
      fontSize: 14,
      useMathJax: true,
      fixed: true
    });

    // Point B (mobile)
    const B = board.create('point', [5, 1], {
      name: '',
      size: 5,
      color: '#3b82f6'
    });
    board.create('text', [
      () => B.X() + 0.2,
      () => B.Y() - 0.4,
      '\\(B\\)'
    ], {
      fontSize: 14,
      useMathJax: true
    });

    // Point C (mobile)
    const C = board.create('point', [2, 4], {
      name: '',
      size: 5,
      color: '#10b981'
    });
    board.create('text', [
      () => C.X() - 0.4,
      () => C.Y() + 0.3,
      '\\(C\\)'
    ], {
      fontSize: 14,
      useMathJax: true
    });

    // Point D (calculé pour former un parallélogramme)
    const D = board.create('point', [
      () => B.X() + C.X() - A.X(),
      () => B.Y() + C.Y() - A.Y()
    ], {
      name: '',
      size: 4,
      color: '#94a3b8'
    });
    board.create('text', [
      () => D.X() + 0.2,
      () => D.Y() + 0.3,
      '\\(D\\)'
    ], {
      fontSize: 14,
      useMathJax: true
    });

    // Parallélogramme ABDC
    board.create('polygon', [A, B, D, C], {
      fillColor: '#dbeafe',
      fillOpacity: 0.5,
      borders: {
        strokeColor: '#3b82f6',
        strokeWidth: 2
      }
    });

    // Vecteur AB
    board.create('arrow', [A, B], {
      strokeColor: '#ef4444',
      strokeWidth: 3,
      lastArrow: { type: 2, size: 6 }
    });
    board.create('text', [
      () => (A.X() + B.X()) / 2,
      () => (A.Y() + B.Y()) / 2 - 0.4,
      '\\(\\overrightarrow{AB}\\)'
    ], {
      fontSize: 12,
      color: '#ef4444',
      useMathJax: true
    });

    // Vecteur AC
    board.create('arrow', [A, C], {
      strokeColor: '#10b981',
      strokeWidth: 3,
      lastArrow: { type: 2, size: 6 }
    });
    board.create('text', [
      () => (A.X() + C.X()) / 2 - 0.5,
      () => (A.Y() + C.Y()) / 2,
      '\\(\\overrightarrow{AC}\\)'
    ], {
      fontSize: 12,
      color: '#10b981',
      useMathJax: true
    });

    // Hauteur h (perpendiculaire de C sur AB)
    const lineAB = board.create('line', [A, B], {
      visible: false
    });
    const H = board.create('perpendicularpoint', [C, lineAB], {
      name: '',
      size: 3,
      color: '#f59e0b'
    });
    board.create('text', [
      () => H.X(),
      () => H.Y() - 0.4,
      '\\(H\\)'
    ], {
      fontSize: 12,
      color: '#f59e0b',
      useMathJax: true
    });

    // Segment CH (hauteur)
    board.create('segment', [C, H], {
      strokeColor: '#f59e0b',
      strokeWidth: 2,
      dash: 2
    });

    // Label hauteur h
    board.create('text', [
      () => (C.X() + H.X()) / 2 + 0.2,
      () => (C.Y() + H.Y()) / 2,
      '\\(h\\)'
    ], {
      fontSize: 12,
      color: '#f59e0b',
      useMathJax: true
    });

    // Angle droit en H
    board.create('angle', [C, H, B], {
      radius: 0.3,
      fillColor: '#fef3c7',
      strokeColor: '#f59e0b',
      type: 'square'
    });

    // Calcul et affichage de l'aire
    board.create('text', [4.5, 5.5, () => {
      const ux = B.X() - A.X();
      const uy = B.Y() - A.Y();
      const vx = C.X() - A.X();
      const vy = C.Y() - A.Y();
      const aire = Math.abs(ux * vy - uy * vx);
      return `\\(\\mathcal{S}_{ABDC} = ${aire.toFixed(2)}\\)`;
    }], {
      fontSize: 15,
      color: '#1e293b',
      useMathJax: true,
      fixed: true
    });

    // Formule de l'aire
    board.create('text', [4.5, 4.8, '\\(= \\|\\overrightarrow{AB} \\wedge \\overrightarrow{AC}\\|\\)'], {
      fontSize: 13,
      color: '#64748b',
      useMathJax: true,
      fixed: true
    });

    // Affichage de la base et hauteur
    board.create('text', [4.5, 4.1, () => {
      const ux = B.X() - A.X();
      const uy = B.Y() - A.Y();
      const base = Math.sqrt(ux * ux + uy * uy);
      return `Base = \\(AB = ${base.toFixed(2)}\\)`;
    }], {
      fontSize: 12,
      color: '#64748b',
      useMathJax: true,
      fixed: true
    });

    board.create('text', [4.5, 3.5, () => {
      const hx = C.X() - H.X();
      const hy = C.Y() - H.Y();
      const hauteur = Math.sqrt(hx * hx + hy * hy);
      return `Hauteur = \\(h = ${hauteur.toFixed(2)}\\)`;
    }], {
      fontSize: 12,
      color: '#f59e0b',
      useMathJax: true,
      fixed: true
    });

    // Formule du triangle
    board.create('text', [0.5, -0.5, '\\(\\mathcal{S}_{ABC} = \\frac{1}{2}\\|\\overrightarrow{AB} \\wedge \\overrightarrow{AC}\\|\\)'], {
      fontSize: 13,
      color: '#1e293b',
      useMathJax: true,
      fixed: true
    });
  }
};

export default graphConfig;