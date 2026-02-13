import { GeometryGraphConfig } from "../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 5, 15, -1],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // Fonction f(x) = (2x + 1) / (x + 1) → tend vers 2
    const f = (x: number) => (2 * x + 1) / (x + 1);

    // Courbe
    const curve = board.create('functiongraph', [f, 0.1, 20], {
      strokeColor: '#3b82f6',
      strokeWidth: 2,
      highlight: false
    });

    // Asymptote horizontale y = 2
    board.create('line', [[0, 2], [1, 2]], {
      strokeColor: '#1e293b',
      strokeWidth: 1.5,
      dash: 3,
      fixed: true
    });

    // Curseur Epsilon (Écart autour de 2)
    const epsSlider = board.create('slider', [[7, 4.3], [12, 4.3], [0.1, 0.5, 1]], {
      name: 'ε',
      strokeColor: '#ef4444',
      fillColor: '#ef4444',
      size: 3,
      label: { fontSize: 11, color: '#ef4444' }
    });

    // Lignes du tunnel epsilon
    const lineSup = board.create('line', [[0, () => 2 + epsSlider.Value()], [1, () => 2 + epsSlider.Value()]], {
      strokeColor: '#ef4444',
      strokeWidth: 1,
      dash: 2,
      visible: true
    });
    const lineInf = board.create('line', [[0, () => 2 - epsSlider.Value()], [1, () => 2 - epsSlider.Value()]], {
      strokeColor: '#ef4444',
      strokeWidth: 1,
      dash: 2,
      visible: true
    });

    // Zone colorée du tunnel
    board.create('inequality', [lineSup], {
      inverse: true,
      fillColor: '#ef4444',
      fillOpacity: 0.08,
      strokeWidth: 0
    });
    board.create('inequality', [lineInf], {
      inverse: false,
      fillColor: '#ef4444',
      fillOpacity: 0.08,
      strokeWidth: 0
    });

    // Calcul du seuil B: |f(x) - 2| < ε → x > 1/ε - 1
    const getB = () => Math.max(0, (1 / epsSlider.Value()) - 1);

    // Point seuil B sur l'axe X
    const pB = board.create('point', [() => getB(), 0], {
      name: 'B',
      size: 3,
      fillColor: '#10b981',
      strokeColor: '#059669',
      label: { fontSize: 11, color: '#059669', offset: [0, -15] }
    });

    // Ligne verticale marquant le seuil B
    board.create('segment', [pB, [() => pB.X(), 4.5]], {
      strokeColor: '#10b981',
      strokeWidth: 1.5,
      dash: 2
    });

    // Flèche "Vers l'infini"
    board.create('arrow', [
      [() => pB.X() + 0.3, 0.4],
      [() => Math.min(pB.X() + 3, 14), 0.4]
    ], {
      strokeColor: '#10b981',
      strokeWidth: 2,
      lastArrow: { type: 2, size: 6 }
    });

    // Point M mobile sur la courbe (dans la zone x > B)
    const M = board.create('glider', [5, f(5), curve], {
      name: '',
      size: 2,
      fillColor: '#8b5cf6',
      strokeColor: '#7c3aed',
      strokeWidth: 1,
      showInfobox: false
    });

    // Label M(x, f(x)) dynamique
    board.create('text', [
      () => M.X() + 0.3,
      () => M.Y() + 0.2,
      () => `M(x, f(x))`
    ], {
      fontSize: 9,
      color: '#7c3aed',
      anchorX: 'left',
      fixed: false
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
      -0.5,
      () => `x = ${M.X().toFixed(1)}`
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
      -0.5,
      () => M.Y(),
      () => `f(x) = ${M.Y().toFixed(2)}`
    ], {
      fontSize: 9,
      color: '#2563eb',
      anchorX: 'right',
      anchorY: 'middle',
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

    // Labels pédagogiques avec LaTeX
    board.create('text', [9, 2.25, '\\(y = 2\\)'], {
      fontSize: 10,
      color: '#1e293b',
      useMathJax: true,
      fixed: true
    });

    board.create('text', [0.3, 3.8, '\\(x > B \\Rightarrow |f(x) - 2| < \\varepsilon\\)'], {
      fontSize: 10,
      color: '#64748b',
      useMathJax: true,
      fixed: true
    });

    board.create('text', [0.3, 0.6, '\\(x \\to +\\infty \\Rightarrow f(x) \\to 2\\)'], {
      fontSize: 10,
      color: '#10b981',
      useMathJax: true,
      fixed: true
    });
  }
};

export default graphConfig;
