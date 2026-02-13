import type { GeometryGraphConfig } from '@/types';

const config: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 6, 15, -1],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    const curve = board.create('functiongraph', [
      (x: number) => x > 0.05 ? 1 / x : NaN,
      0.05, 100
    ], {
      strokeColor: '#2563eb',
      strokeWidth: 2.5,
      highlight: false
    });

    const M = board.create('glider', [2, 0.5, curve], {
      name: 'M',
      size: 3,
      fillColor: '#dc2626',
      strokeColor: '#b91c1c',
      label: { fontSize: 11, offset: [8, 8] }
    });

    // Projections
    board.create('segment', [M, [() => M.X(), 0]], {
      strokeColor: '#94a3b8', strokeWidth: 1, dash: 2
    });
    board.create('segment', [M, [0, () => M.Y()]], {
      strokeColor: '#94a3b8', strokeWidth: 1, dash: 2
    });

    // Valeur de f(x)
    board.create('text', [
      () => M.X() + 0.5,
      () => M.Y() + 0.4,
      () => `f(x) = ${M.Y().toFixed(3)}`
    ], {
      fontSize: 11, color: '#dc2626'
    });

    // Asymptote y = 0
    board.create('line', [[0, 0], [1, 0]], {
      strokeColor: '#22c55e', strokeWidth: 1, dash: 3
    });

    // Nom de f
    board.create('text', [10, 4, '\\(f(x)=\\frac{1}{x}\\)'], {
      fontSize: 13, color: '#1e40af', useMathJax: true
    });

    // Indication limite
    board.create('text', [10, 0.5, '\\(\\to 0\\)'], {
      fontSize: 12, color: '#22c55e', useMathJax: true
    });
  }
};

export default config;
