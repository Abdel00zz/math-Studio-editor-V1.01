/**
 * Graphe: Transformations dans le plan complexe
 * Montre différentes transformations: translation, rotation, homothétie
 * Illustre z' = az + b
 */

import type { GeometryGraphConfig } from '@/types';

const config: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-8, 8, 8, -8],
  init: (board) => {
    // Axes
    board.create('axis', [[0, 0], [1, 0]], {
      name: 'Re',
      withLabel: true,
      label: { position: 'rt', offset: [-15, 20] }
    });
    board.create('axis', [[0, 0], [0, 1]], {
      name: 'Im',
      withLabel: true,
      label: { position: 'rt', offset: [-30, 0] }
    });

    // Point initial déplaçable
    const M = board.create('point', [2, 1], {
      name: 'M (z)',
      size: 4,
      fillColor: '#3b82f6',
      strokeColor: '#1e40af',
      fixed: false
    });

    // Centre de rotation/homothétie
    const O = board.create('point', [0, 0], {
      name: 'O',
      size: 2,
      fillColor: '#64748b',
      strokeColor: '#475569',
      fixed: true,
      visible: true
    });

    // Point transformé par rotation de 90°
    const M_rot = board.create('point', [
      () => -M.Y(),
      () => M.X()
    ], {
      name: "M' (iz)",
      size: 4,
      fillColor: '#10b981',
      strokeColor: '#047857',
      fixed: true
    });

    // Point transformé par homothétie k=1.5
    const k = 1.5;
    const M_hom = board.create('point', [
      () => k * M.X(),
      () => k * M.Y()
    ], {
      name: `M" (${k}z)`,
      size: 4,
      fillColor: '#f59e0b',
      strokeColor: '#d97706',
      fixed: true
    });

    // Vecteurs
    board.create('arrow', [O, M], {
      strokeColor: '#3b82f6',
      strokeWidth: 2
    });

    board.create('arrow', [O, M_rot], {
      strokeColor: '#10b981',
      strokeWidth: 2,
      dash: 2
    });

    board.create('arrow', [O, M_hom], {
      strokeColor: '#f59e0b',
      strokeWidth: 2,
      dash: 2
    });

    // Cercle passant par M
    board.create('circle', [O, M], {
      strokeColor: '#cbd5e1',
      strokeWidth: 1,
      dash: 3,
      fixed: true
    });

    // Angle entre OM et OM'
    board.create('angle', [M, O, M_rot], {
      type: 'sector',
      radius: 1,
      fillColor: '#10b981',
      fillOpacity: 0.2,
      strokeColor: '#10b981',
      strokeWidth: 1
    });

    // Légende
    board.create('text', [-7.5, 7, 'Rotation: z\' = iz (90°)'], {
      fontSize: 12,
      color: '#10b981',
      fixed: true,
      highlight: false
    });

    board.create('text', [-7.5, 6.2, `Homothétie: z\' = ${k}z`], {
      fontSize: 12,
      color: '#f59e0b',
      fixed: true,
      highlight: false
    });

    // Formule générale
    board.create('text', [-7.5, -7, 'Forme générale: z\' = az + b'], {
      fontSize: 11,
      color: '#64748b',
      fixed: true,
      highlight: false
    });
  }
};

export default config;
