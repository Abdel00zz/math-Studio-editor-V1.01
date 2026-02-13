import type { GeometryGraphConfig } from '@/types';

const config: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 6, 20, -1],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    const curve = board.create('functiongraph', [
      (x: number) => x >= 0 ? Math.sqrt(x) : NaN,
      0, 100
    ], {
      strokeColor: '#2563eb',
      strokeWidth: 2.5,
      highlight: false
    });

    const M = board.create('glider', [9, 3, curve], {
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
      () => `f(x) = ${M.Y().toFixed(2)}`
    ], {
      fontSize: 11, color: '#dc2626'
    });

    // Nom de f
    board.create('text', [12, 5, '\\(f(x)=\\sqrt{x}\\)'], {
      fontSize: 13, color: '#1e40af', useMathJax: true
    });

    // Indication croissance lente
    board.create('text', [15, 4, '\\(\\to +\\infty\\)'], {
      fontSize: 11, color: '#8b5cf6', useMathJax: true
    });

    board.create('text', [15, 3.5, '(lentement)'], {
      fontSize: 9, color: '#64748b'
    });
  }
};

export default config;
