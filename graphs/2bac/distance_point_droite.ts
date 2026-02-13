import { GeometryGraphConfig } from "../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 6, 8, -1],
  showAxis: true,
  showGrid: true,
  keepAspectRatio: true,
  init: (board) => {
    // Point A sur la droite
    const A = board.create('point', [1, 2], {
      name: '',
      fixed: true,
      size: 4,
      color: '#3b82f6'
    });
    board.create('text', [0.6, 1.7, '\\(A\\)'], {
      fontSize: 14,
      useMathJax: true,
      fixed: true
    });

    // Vecteur directeur u de la droite
    const uEnd = board.create('point', [6, 3], {
      name: '',
      fixed: true,
      size: 3,
      color: '#3b82f6'
    });

    // Droite (D) passant par A de vecteur directeur u
    const droiteD = board.create('line', [A, uEnd], {
      strokeColor: '#3b82f6',
      strokeWidth: 2
    });

    // Vecteur u (flèche)
    board.create('arrow', [A, [4, 2.6]], {
      strokeColor: '#3b82f6',
      strokeWidth: 3,
      lastArrow: { type: 2, size: 6 }
    });
    board.create('text', [3, 2.8, '\\(\\vec{u}\\)'], {
      fontSize: 14,
      color: '#3b82f6',
      useMathJax: true,
      fixed: true
    });

    // Label de la droite
    board.create('text', [6.5, 3.3, '\\((D)\\)'], {
      fontSize: 14,
      color: '#3b82f6',
      useMathJax: true,
      fixed: true
    });

    // Point M extérieur à la droite (mobile)
    const M = board.create('point', [3, 5], {
      name: '',
      size: 5,
      color: '#ef4444'
    });
    board.create('text', [
      () => M.X() + 0.2,
      () => M.Y() + 0.3,
      '\\(M\\)'
    ], {
      fontSize: 14,
      color: '#ef4444',
      useMathJax: true
    });

    // Projection H de M sur la droite (D)
    const H = board.create('perpendicularpoint', [M, droiteD], {
      name: '',
      size: 4,
      color: '#10b981'
    });
    board.create('text', [
      () => H.X() - 0.3,
      () => H.Y() - 0.4,
      '\\(H\\)'
    ], {
      fontSize: 14,
      color: '#10b981',
      useMathJax: true
    });

    // Segment MH (distance)
    board.create('segment', [M, H], {
      strokeColor: '#10b981',
      strokeWidth: 3
    });

    // Label distance d
    board.create('text', [
      () => (M.X() + H.X()) / 2 + 0.2,
      () => (M.Y() + H.Y()) / 2,
      '\\(d\\)'
    ], {
      fontSize: 14,
      color: '#10b981',
      useMathJax: true
    });

    // Angle droit en H
    board.create('angle', [M, H, uEnd], {
      radius: 0.4,
      fillColor: '#d1fae5',
      strokeColor: '#10b981',
      type: 'square'
    });

    // Vecteur AM
    board.create('arrow', [A, M], {
      strokeColor: '#f59e0b',
      strokeWidth: 2,
      dash: 2,
      lastArrow: { type: 2, size: 5 }
    });
    board.create('text', [
      () => (A.X() + M.X()) / 2 - 0.5,
      () => (A.Y() + M.Y()) / 2 + 0.2,
      '\\(\\overrightarrow{AM}\\)'
    ], {
      fontSize: 12,
      color: '#f59e0b',
      useMathJax: true
    });

    // Calcul de la distance
    const calcDistance = () => {
      const ux = 3; // Composantes de u (direction de la droite)
      const uy = 0.6;
      const amx = M.X() - A.X();
      const amy = M.Y() - A.Y();

      // ||AM ∧ u|| en 2D = |amx * uy - amy * ux|
      const crossNorm = Math.abs(amx * uy - amy * ux);
      const uNorm = Math.sqrt(ux * ux + uy * uy);

      return crossNorm / uNorm;
    };

    // Affichage de la formule et du résultat
    board.create('text', [4.5, 5.5, '\\(d(M, (D)) = \\dfrac{\\|\\overrightarrow{AM} \\wedge \\vec{u}\\|}{\\|\\vec{u}\\|}\\)'], {
      fontSize: 14,
      color: '#1e293b',
      useMathJax: true,
      fixed: true
    });

    // Valeur numérique de la distance
    board.create('text', [4.5, 4.5, () => {
      const dx = M.X() - H.X();
      const dy = M.Y() - H.Y();
      const dist = Math.sqrt(dx * dx + dy * dy);
      return `\\(d = MH = ${dist.toFixed(2)}\\)`;
    }], {
      fontSize: 14,
      color: '#10b981',
      useMathJax: true,
      fixed: true
    });

    // Note explicative
    board.create('text', [0.5, -0.5, '\\(H\\) = projection orthogonale de \\(M\\) sur \\((D)\\)'], {
      fontSize: 12,
      color: '#64748b',
      useMathJax: true,
      fixed: true
    });

    // Indication pour l'utilisateur
    board.create('text', [4.5, 0, 'Déplacez le point M'], {
      fontSize: 11,
      color: '#94a3b8',
      fixed: true
    });
  }
};

export default graphConfig;