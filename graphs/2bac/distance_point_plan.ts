import { GeometryGraphConfig } from "../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 7, 9, -1],
  showAxis: true,
  showGrid: true,
  keepAspectRatio: true,
  init: (board) => {
    // Représentation 2D simplifiée d'un plan avec vecteur normal
    // Le plan est représenté par une ligne (vue de côté)

    // Points définissant le "plan" (ligne en 2D)
    const planP1 = board.create('point', [0, 1], {
      visible: false
    });
    const planP2 = board.create('point', [8, 1.5], {
      visible: false
    });

    // Plan (ligne épaisse)
    const planSegment = board.create('segment', [planP1, planP2], {
      strokeColor: '#64748b',
      strokeWidth: 5,
      lineCap: 'round'
    });

    // Remplissage sous le plan pour donner l'impression de surface
    board.create('polygon', [
      [0, 1], [8, 1.5], [8, -0.5], [0, -0.5]
    ], {
      fillColor: '#e2e8f0',
      fillOpacity: 0.4,
      borders: { visible: false }
    });

    // Label du plan
    board.create('text', [8.2, 1.8, '\\((P)\\)'], {
      fontSize: 14,
      color: '#64748b',
      useMathJax: true,
      fixed: true
    });

    // Point A au-dessus du plan (mobile)
    const A = board.create('point', [4, 5], {
      name: '',
      size: 5,
      color: '#ef4444'
    });
    board.create('text', [
      () => A.X() + 0.2,
      () => A.Y() + 0.3,
      '\\(A\\)'
    ], {
      fontSize: 14,
      color: '#ef4444',
      useMathJax: true
    });

    // Calcul de la projection H de A sur le plan
    // Direction du plan
    const planDx = planP2.X() - planP1.X();
    const planDy = planP2.Y() - planP1.Y();
    const planNorm = Math.sqrt(planDx * planDx + planDy * planDy);
    const planUx = planDx / planNorm;
    const planUy = planDy / planNorm;

    // Point H (projection orthogonale)
    const H = board.create('point', [
      () => {
        // Projection de A sur la droite du plan
        const ax = A.X() - planP1.X();
        const ay = A.Y() - planP1.Y();
        const t = (ax * planUx + ay * planUy);
        return planP1.X() + t * planUx;
      },
      () => {
        const ax = A.X() - planP1.X();
        const ay = A.Y() - planP1.Y();
        const t = (ax * planUx + ay * planUy);
        return planP1.Y() + t * planUy;
      }
    ], {
      name: '',
      size: 4,
      color: '#10b981'
    });

    board.create('text', [
      () => H.X() - 0.3,
      () => H.Y() - 0.5,
      '\\(H\\)'
    ], {
      fontSize: 14,
      color: '#10b981',
      useMathJax: true
    });

    // Segment AH (distance)
    board.create('segment', [A, H], {
      strokeColor: '#3b82f6',
      strokeWidth: 3
    });

    // Label de la distance
    board.create('text', [
      () => (A.X() + H.X()) / 2 + 0.3,
      () => (A.Y() + H.Y()) / 2,
      '\\(d\\)'
    ], {
      fontSize: 14,
      color: '#3b82f6',
      useMathJax: true
    });

    // Angle droit en H
    const angleRef = board.create('point', [
      () => H.X() + planUx * 0.6,
      () => H.Y() + planUy * 0.6
    ], { visible: false });

    board.create('angle', [A, H, angleRef], {
      radius: 0.4,
      fillColor: '#dbeafe',
      strokeColor: '#3b82f6',
      type: 'square'
    });

    // Vecteur normal n (optionnel, pour montrer la direction)
    const nEnd = board.create('point', [
      () => H.X() - planUy * 2,
      () => H.Y() + planUx * 2
    ], { visible: false });

    board.create('arrow', [H, nEnd], {
      strokeColor: '#f59e0b',
      strokeWidth: 2,
      dash: 2,
      lastArrow: { type: 2, size: 5 }
    });

    board.create('text', [
      () => nEnd.X() - 0.4,
      () => nEnd.Y() + 0.2,
      '\\(\\vec{n}\\)'
    ], {
      fontSize: 12,
      color: '#f59e0b',
      useMathJax: true
    });

    // Affichage dynamique de la distance
    board.create('text', [0.5, 6.2, () => {
      const dx = A.X() - H.X();
      const dy = A.Y() - H.Y();
      const distance = Math.sqrt(dx * dx + dy * dy);
      return `\\(d(A, (P)) = AH = ${distance.toFixed(2)}\\)`;
    }], {
      fontSize: 15,
      color: '#3b82f6',
      useMathJax: true,
      fixed: true
    });

    // Formule générale
    board.create('text', [1, -0.5, '\\(d(A,(P)) = \\dfrac{|ax_A + by_A + cz_A + d|}{\\sqrt{a^2+b^2+c^2}}\\)'], {
      fontSize: 13,
      color: '#1e293b',
      useMathJax: true,
      fixed: true
    });

    // Note explicative
    board.create('text', [0.5, 5.5, '\\(H\\) = projection orthogonale de \\(A\\) sur \\((P)\\)'], {
      fontSize: 12,
      color: '#64748b',
      useMathJax: true,
      fixed: true
    });
  }
};

export default graphConfig;