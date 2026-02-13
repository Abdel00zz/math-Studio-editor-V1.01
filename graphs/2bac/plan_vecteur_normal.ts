import { GeometryGraphConfig } from "../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-2, 6, 8, -2],
  showAxis: true,
  showGrid: true,
  keepAspectRatio: true,
  init: (board) => {
    // Représentation 2D simplifiée d'un plan avec vecteur normal
    // Le plan est représenté par une ligne (vue de côté)

    // Points définissant le "plan" (ligne en 2D)
    const P1 = board.create('point', [0, 1], {
      visible: false
    });
    const P2 = board.create('point', [7, 2.5], {
      visible: false
    });

    // Le plan (P) représenté par un segment épais
    const planLine = board.create('segment', [P1, P2], {
      strokeColor: '#94a3b8',
      strokeWidth: 6,
      lineCap: 'round'
    });

    // Label du plan
    board.create('text', [7.2, 2.8, '\\((P)\\)'], {
      fontSize: 14,
      color: '#64748b',
      useMathJax: true,
      fixed: true
    });

    // Point A sur le plan
    const A = board.create('glider', [3, 1.6, planLine], {
      name: '',
      size: 5,
      color: '#3b82f6'
    });
    board.create('text', [
      () => A.X() - 0.3,
      () => A.Y() - 0.5,
      '\\(A\\)'
    ], {
      fontSize: 14,
      color: '#3b82f6',
      useMathJax: true
    });

    // Calcul du vecteur directeur du plan
    const getDirVector = () => {
      const dx = P2.X() - P1.X();
      const dy = P2.Y() - P1.Y();
      const norm = Math.sqrt(dx * dx + dy * dy);
      return { x: dx / norm, y: dy / norm };
    };

    // Vecteur normal (perpendiculaire au plan)
    const normalEnd = board.create('point', [
      () => {
        const dir = getDirVector();
        return A.X() - dir.y * 3; // Perpendiculaire
      },
      () => {
        const dir = getDirVector();
        return A.Y() + dir.x * 3;
      }
    ], {
      visible: false
    });

    // Flèche du vecteur normal
    board.create('arrow', [A, normalEnd], {
      strokeColor: '#ef4444',
      strokeWidth: 3,
      lastArrow: { type: 2, size: 8 }
    });

    // Label vecteur normal
    board.create('text', [
      () => (A.X() + normalEnd.X()) / 2 - 0.5,
      () => (A.Y() + normalEnd.Y()) / 2 + 0.3,
      '\\(\\vec{n}\\)'
    ], {
      fontSize: 16,
      color: '#ef4444',
      useMathJax: true
    });

    // Angle droit entre n et le plan
    const anglePoint = board.create('point', [
      () => A.X() + getDirVector().x * 0.8,
      () => A.Y() + getDirVector().y * 0.8
    ], { visible: false });

    board.create('angle', [normalEnd, A, anglePoint], {
      radius: 0.5,
      fillColor: '#fecaca',
      strokeColor: '#ef4444',
      type: 'square'
    });

    // Vecteur u (directeur du plan)
    const uEnd = board.create('point', [
      () => A.X() + getDirVector().x * 2.5,
      () => A.Y() + getDirVector().y * 2.5
    ], { visible: false });

    board.create('arrow', [A, uEnd], {
      strokeColor: '#10b981',
      strokeWidth: 2,
      lastArrow: { type: 2, size: 6 }
    });

    board.create('text', [
      () => uEnd.X() + 0.2,
      () => uEnd.Y() + 0.2,
      '\\(\\vec{u}\\)'
    ], {
      fontSize: 14,
      color: '#10b981',
      useMathJax: true
    });

    // Vecteur v (autre directeur du plan, différent de u)
    const vEnd = board.create('point', [
      () => A.X() - getDirVector().x * 1.5,
      () => A.Y() - getDirVector().y * 1.5
    ], { visible: false });

    board.create('arrow', [A, vEnd], {
      strokeColor: '#8b5cf6',
      strokeWidth: 2,
      lastArrow: { type: 2, size: 6 }
    });

    board.create('text', [
      () => vEnd.X() - 0.4,
      () => vEnd.Y() - 0.3,
      '\\(\\vec{v}\\)'
    ], {
      fontSize: 14,
      color: '#8b5cf6',
      useMathJax: true
    });

    // Point M quelconque
    const M = board.create('point', [5, 4], {
      name: '',
      size: 4,
      color: '#f59e0b'
    });
    board.create('text', [5.2, 4.2, '\\(M\\)'], {
      fontSize: 14,
      color: '#f59e0b',
      useMathJax: true
    });

    // Vecteur AM
    board.create('arrow', [A, M], {
      strokeColor: '#f59e0b',
      strokeWidth: 2,
      dash: 2,
      lastArrow: { type: 2, size: 5 }
    });

    board.create('text', [
      () => (A.X() + M.X()) / 2 + 0.2,
      () => (A.Y() + M.Y()) / 2,
      '\\(\\overrightarrow{AM}\\)'
    ], {
      fontSize: 12,
      color: '#f59e0b',
      useMathJax: true
    });

    // Affichage de la condition
    board.create('text', [1, 5.5, '\\(M \\in (P) \\Leftrightarrow \\overrightarrow{AM} \\cdot \\vec{n} = 0\\)'], {
      fontSize: 15,
      color: '#1e293b',
      useMathJax: true,
      fixed: true
    });

    // Légende
    board.create('text', [0, -1.5, '\\(\\vec{n} \\perp \\vec{u}\\) et \\(\\vec{n} \\perp \\vec{v}\\)'], {
      fontSize: 13,
      color: '#64748b',
      useMathJax: true,
      fixed: true
    });
  }
};

export default graphConfig;