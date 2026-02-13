import { GeometryGraphConfig } from "../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1.5, 14, 6, -2],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // === FONCTION f(x) = 1/(x - 2)² ===
    const x0 = 2; // Point d'asymptote verticale
    const f = (x: number) => {
      const diff = Math.abs(x - x0);
      if (diff < 0.01) return NaN;
      return 1 / Math.pow(x - x0, 2);
    };

    // === ASYMPTOTE VERTICALE x = x₀ ===
    board.create('line', [[x0, 0], [x0, 1]], {
      strokeColor: '#dc2626',
      strokeWidth: 2,
      dash: 4,
      fixed: true,
      highlight: false
    });

    // Label de l'asymptote
    board.create('text', [x0 + 0.1, 13, '\\(x = x_0\\)'], {
      fontSize: 11,
      color: '#dc2626',
      useMathJax: true,
      fixed: true
    });

    // === COURBE (deux branches) ===
    board.create('functiongraph', [f, -1.5, x0 - 0.08], {
      strokeColor: '#3b82f6',
      strokeWidth: 2.5,
      highlight: false
    });
    const curveRight = board.create('functiongraph', [f, x0 + 0.08, 6], {
      strokeColor: '#3b82f6',
      strokeWidth: 2.5,
      highlight: false
    });

    // === CURSEUR POUR LE SEUIL A ===
    const sliderA = board.create('slider', [[3.2, 12.5], [5.5, 12.5], [1, 4, 12]], {
      name: 'A',
      snapWidth: 0.5,
      strokeColor: '#f97316',
      fillColor: '#f97316',
      size: 4,
      label: { fontSize: 12, color: '#f97316', fontWeight: 'bold' }
    });

    // === SEUIL HORIZONTAL y = A ===
    board.create('line', [[0, () => sliderA.Value()], [1, () => sliderA.Value()]], {
      strokeColor: '#f97316',
      strokeWidth: 2,
      dash: 3,
      highlight: false
    });

    // Label du seuil A sur l'axe Y
    board.create('text', [
      -0.15,
      () => sliderA.Value(),
      () => `A = ${sliderA.Value().toFixed(1)}`
    ], {
      fontSize: 10,
      color: '#f97316',
      anchorX: 'right',
      anchorY: 'middle',
      fontWeight: 'bold'
    });

    // === CALCUL DE ALPHA: 1/(x-x0)² = A → |x-x0| = 1/√A ===
    const getAlpha = () => 1 / Math.sqrt(sliderA.Value());

    // === ZONE ALPHA SUR L'AXE X ===
    // Intervalle ]x₀ - α, x₀ + α[
    board.create('segment', [
      [() => x0 - getAlpha(), 0],
      [() => x0 + getAlpha(), 0]
    ], {
      strokeColor: '#10b981',
      strokeWidth: 6,
      highlight: false
    });

    // Points aux extrémités de l'intervalle alpha
    board.create('point', [() => x0 - getAlpha(), 0], {
      size: 3,
      fillColor: '#10b981',
      strokeColor: '#059669',
      strokeWidth: 2,
      name: '',
      fixed: true,
      showInfobox: false
    });
    board.create('point', [() => x0 + getAlpha(), 0], {
      size: 3,
      fillColor: '#10b981',
      strokeColor: '#059669',
      strokeWidth: 2,
      name: '',
      fixed: true,
      showInfobox: false
    });

    // === ZONE DE DÉPASSEMENT (f(x) > A) ===
    // Zone colorée au-dessus du seuil A
    board.create('inequality', [
      board.create('line', [[0, () => sliderA.Value()], [1, () => sliderA.Value()]], { visible: false })
    ], {
      fillColor: '#fef3c7',
      fillOpacity: 0.4,
      visible: true,
      inverse: false
    });

    // === LIGNES VERTICALES AUX BORNES DE ALPHA ===
    board.create('segment', [
      [() => x0 + getAlpha(), 0],
      [() => x0 + getAlpha(), () => sliderA.Value()]
    ], {
      strokeColor: '#10b981',
      strokeWidth: 1.5,
      dash: 3
    });
    board.create('segment', [
      [() => x0 - getAlpha(), 0],
      [() => x0 - getAlpha(), () => sliderA.Value()]
    ], {
      strokeColor: '#10b981',
      strokeWidth: 1.5,
      dash: 3
    });

    // === POINT M MOBILE SUR LA COURBE DROITE ===
    const M = board.create('glider', [3, f(3), curveRight], {
      name: 'M',
      size: 5,
      fillColor: '#8b5cf6',
      strokeColor: '#6d28d9',
      strokeWidth: 2,
      showInfobox: false,
      label: { fontSize: 12, color: '#6d28d9', offset: [8, 8], fontWeight: 'bold' }
    });

    // === PROJECTIONS DU POINT M ===
    // Projection verticale
    board.create('segment', [M, [() => M.X(), 0]], {
      strokeColor: '#a78bfa',
      strokeWidth: 1.5,
      dash: 2
    });
    // Projection horizontale
    board.create('segment', [M, [0, () => Math.min(M.Y(), 13)]], {
      strokeColor: '#a78bfa',
      strokeWidth: 1.5,
      dash: 2
    });

    // === MARQUEURS SUR LES AXES ===
    // Point x sur l'axe X
    board.create('point', [() => M.X(), 0], {
      size: 3,
      fillColor: '#8b5cf6',
      strokeColor: '#6d28d9',
      strokeWidth: 2,
      name: '',
      fixed: true,
      showInfobox: false
    });

    // Valeur de x
    board.create('text', [
      () => M.X(),
      -0.8,
      () => `x = ${M.X().toFixed(2)}`
    ], {
      fontSize: 10,
      color: '#6d28d9',
      anchorX: 'middle',
      fontWeight: 'bold'
    });

    // Point f(x) sur l'axe Y
    board.create('point', [0, () => Math.min(M.Y(), 13)], {
      size: 3,
      fillColor: '#3b82f6',
      strokeColor: '#1d4ed8',
      strokeWidth: 2,
      name: '',
      fixed: true,
      showInfobox: false
    });

    // Valeur de f(x)
    board.create('text', [
      -0.15,
      () => Math.min(M.Y(), 12),
      () => M.Y() > 100 ? 'f(x) → +∞' : `f(x) = ${M.Y().toFixed(1)}`
    ], {
      fontSize: 10,
      color: '#1d4ed8',
      anchorX: 'right',
      anchorY: 'middle',
      fontWeight: 'bold'
    });

    // === INDICATEUR VISUEL : M dans ou hors de la zone alpha ===
    board.create('text', [
      () => M.X() + 0.15,
      () => Math.min(M.Y() + 0.8, 12),
      () => {
        const inZone = Math.abs(M.X() - x0) < getAlpha();
        const aboveA = M.Y() > sliderA.Value();
        if (inZone && aboveA) return '✓ f(x) > A';
        if (inZone) return '○ dans ]x₀-α, x₀+α[';
        return '';
      }
    ], {
      fontSize: 10,
      color: () => M.Y() > sliderA.Value() ? '#059669' : '#64748b',
      anchorX: 'left'
    });

    // === LABELS PÉDAGOGIQUES ===

    // Label x₀ sous l'asymptote
    board.create('text', [x0, -0.8, '\\(x_0\\)'], {
      fontSize: 12,
      color: '#dc2626',
      useMathJax: true,
      anchorX: 'middle',
      fontWeight: 'bold'
    });

    // Label α pour l'intervalle
    board.create('text', [
      () => x0 + getAlpha() / 2,
      0.6,
      '\\(\\alpha\\)'
    ], {
      fontSize: 11,
      color: '#10b981',
      useMathJax: true,
      anchorX: 'middle'
    });

    // === FORMULE PRINCIPALE ===
    board.create('text', [-1.3, 11, '\\(\\boxed{\\forall A > 0, \\exists \\alpha > 0 : 0 < |x - x_0| < \\alpha \\Rightarrow f(x) > A}\\)'], {
      fontSize: 10,
      color: '#1e293b',
      useMathJax: true,
      fixed: true
    });

    // === INDICATION INTERACTIVE ===
    board.create('text', [3.2, 0.8, '\\(\\text{Augmentez A } \\to \\alpha \\text{ diminue}\\)'], {
      fontSize: 9,
      color: '#64748b',
      useMathJax: true,
      fixed: true
    });

    // Valeur dynamique de alpha
    board.create('text', [
      3.2,
      -1.2,
      () => `α = 1/√A ≈ ${getAlpha().toFixed(3)}`
    ], {
      fontSize: 10,
      color: '#10b981',
      fontWeight: 'bold'
    });
  }
};

export default graphConfig;
