import { GeometryGraphConfig } from "../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 5, 6, -1],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // Fonction cubique f(x) = 0.5(x - 2)³ + 2
    const f = (x: number) => 0.5 * Math.pow(x - 2, 3) + 2;

    // Tracé de la courbe
    const curve = board.create('functiongraph', [f, -1, 6], {
      strokeColor: '#3b82f6',
      strokeWidth: 2,
      highlight: false
    });

    // Point limite L = (2, 2)
    const L = board.create('point', [2, 2], {
      name: 'L',
      fixed: true,
      size: 3,
      fillColor: '#1e293b',
      strokeColor: '#0f172a',
      label: { fontSize: 11, color: '#1e293b', offset: [-15, 10] }
    });

    // Curseur pour Epsilon - permet des valeurs très petites
    const epsilonSlider = board.create('slider', [[3.5, 4.3], [5.5, 4.3], [0.01, 0.5, 1.5]], {
      name: 'ε',
      strokeColor: '#ef4444',
      fillColor: '#ef4444',
      size: 3,
      label: { fontSize: 11, color: '#ef4444' }
    });

    // Calcul de Alpha: x = cbrt(2(y-2)) + 2
    const getAlpha = () => {
      const eps = epsilonSlider.Value();
      return Math.pow(2 * eps, 1/3);
    };

    // Lignes horizontales L ± ε
    const epsLinesAttr = { strokeColor: '#ef4444', dash: 2, strokeWidth: 1 };
    board.create('line', [[0, () => 2 + epsilonSlider.Value()], [1, () => 2 + epsilonSlider.Value()]], epsLinesAttr);
    board.create('line', [[0, () => 2 - epsilonSlider.Value()], [1, () => 2 - epsilonSlider.Value()]], epsLinesAttr);

    // Lignes verticales x₀ ± α
    const alphaLinesAttr = { strokeColor: '#10b981', dash: 2, strokeWidth: 1.5 };
    board.create('segment', [
      [() => 2 + getAlpha(), 0],
      [() => 2 + getAlpha(), () => 2 + epsilonSlider.Value()]
    ], alphaLinesAttr);
    board.create('segment', [
      [() => 2 - getAlpha(), 0],
      [() => 2 - getAlpha(), () => 2 - epsilonSlider.Value()]
    ], alphaLinesAttr);

    // Zone de validité (boîte epsilon-delta)
    board.create('polygon', [
      [() => 2 - getAlpha(), () => 2 - epsilonSlider.Value()],
      [() => 2 + getAlpha(), () => 2 - epsilonSlider.Value()],
      [() => 2 + getAlpha(), () => 2 + epsilonSlider.Value()],
      [() => 2 - getAlpha(), () => 2 + epsilonSlider.Value()]
    ], {
      fillColor: '#10b981',
      fillOpacity: 0.1,
      borders: { strokeColor: '#10b981', strokeWidth: 1, dash: 0 }
    });

    // Point M mobile sur la courbe
    const M = board.create('glider', [2.5, f(2.5), curve], {
      name: '',
      size: 2,
      fillColor: '#8b5cf6',
      strokeColor: '#7c3aed',
      strokeWidth: 1,
      showInfobox: false
    });

    // Label M(x, f(x)) dynamique
    board.create('text', [
      () => M.X() + 0.15,
      () => M.Y() + 0.2,
      () => `M(x, f(x))`
    ], {
      fontSize: 9,
      color: '#7c3aed',
      anchorX: 'left',
      fixed: false
    });

    // Projections du point M
    board.create('segment', [M, [() => M.X(), 0]], {
      strokeColor: '#94a3b8',
      strokeWidth: 1,
      dash: 2
    });
    board.create('segment', [M, [0, () => M.Y()]], {
      strokeColor: '#94a3b8',
      strokeWidth: 1,
      dash: 2
    });

    // === MARQUEURS DYNAMIQUES SUR LES AXES ===

    // Point x sur l'axe X
    board.create('point', [() => M.X(), 0], {
      size: 1.5,
      fillColor: '#8b5cf6',
      strokeColor: '#7c3aed',
      name: '',
      fixed: true,
      showInfobox: false
    });

    // Label 'x = valeur' sous l'axe
    board.create('text', [
      () => M.X(),
      -0.35,
      () => `x = ${M.X().toFixed(2)}`
    ], {
      fontSize: 9,
      color: '#7c3aed',
      anchorX: 'middle',
      fixed: false
    });

    // Point f(x) sur l'axe Y
    board.create('point', [0, () => M.Y()], {
      size: 1.5,
      fillColor: '#3b82f6',
      strokeColor: '#2563eb',
      name: '',
      fixed: true,
      showInfobox: false
    });

    // Label 'f(x) = valeur' à gauche de l'axe
    board.create('text', [
      -0.35,
      () => M.Y(),
      () => `f(x) = ${M.Y().toFixed(2)}`
    ], {
      fontSize: 9,
      color: '#2563eb',
      anchorX: 'right',
      anchorY: 'middle',
      fixed: false
    });

    // Labels pédagogiques avec LaTeX
    board.create('text', [3.5, 4.7, '\\(|f(x) - L| < \\varepsilon\\)'], {
      fontSize: 10,
      color: '#ef4444',
      useMathJax: true,
      fixed: true
    });

    board.create('text', [0.1, 0.35, '\\(|x - x_0| < \\alpha \\Rightarrow |f(x) - L| < \\varepsilon\\)'], {
      fontSize: 9,
      color: '#10b981',
      useMathJax: true,
      fixed: true
    });

    // Label x₀
    board.create('text', [1.85, -0.5, '\\(x_0\\)'], {
      fontSize: 10,
      color: '#64748b',
      useMathJax: true,
      fixed: true
    });

    // Note explicative
    board.create('text', [3.5, 0.35, '\\(\\text{Réduisez } \\varepsilon \\text{ et approchez M de } x_0\\)'], {
      fontSize: 9,
      color: '#64748b',
      useMathJax: true,
      fixed: true
    });
  }
};

export default graphConfig;
