import type { GeometryGraphConfig } from '@/types';

const config: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-6, 12, 6, -1],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    const curve = board.create('functiongraph', [
      (x: number) => x * x,
      -10, 10
    ], {
      strokeColor: '#2563eb',
      strokeWidth: 2.5,
      highlight: false
    });

    const M = board.create('glider', [2, 4, curve], {
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
      () => M.X() + 0.3,
      () => M.Y() + 0.6,
      () => `f(x) = ${M.Y().toFixed(1)}`
    ], {
      fontSize: 11, color: '#dc2626'
    });

    // Nom de f
    board.create('text', [3, 10, '\\(f(x)=x^2\\)'], {
      fontSize: 13, color: '#1e40af', useMathJax: true
    });

    // Flèche vers +∞
    board.create('text', [0.3, 11, '\\(\\to +\\infty\\)'], {
      fontSize: 12, color: '#8b5cf6', useMathJax: true
    });
  }
};

export default config;
