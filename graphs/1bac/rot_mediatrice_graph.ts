import { GeometryGraphConfig } from "../../types";

/**
 * Graphe : Médiatrice et triangle isocèle
 * Montre que Ω est sur la médiatrice de [MM'] et que ΩMM' est isocèle
 */
export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-5, 4, 5, -4],
  showAxis: false,
  showGrid: false,
  init: (board) => {
    // Centre Ω
    const O = board.create('point', [0, 0], {
      name: 'Ω',
      size: 4,
      fillColor: '#ef4444',
      strokeColor: '#dc2626',
      fixed: true,
      label: { offset: [-15, -10], fontSize: 14 }
    });

    // Point M déplaçable
    const M = board.create('point', [3, 1], {
      name: 'M',
      size: 4,
      fillColor: '#3b82f6',
      strokeColor: '#2563eb',
      label: { offset: [5, 5], fontSize: 14, color: '#3b82f6' }
    });

    // Slider angle θ
    const theta = board.create('slider', [[-4.5, 3.2], [-1, 3.2], [30, 60, 150]], {
      name: 'θ',
      snapWidth: 5,
      size: 4,
      fillColor: '#f59e0b',
      strokeColor: '#d97706',
      label: { fontSize: 12 }
    });

    // Point M' = r(Ω, θ)(M)
    const Mprime = board.create('point', [
      () => {
        const t = theta.Value() * Math.PI / 180;
        const dx = M.X();
        const dy = M.Y();
        return dx * Math.cos(t) - dy * Math.sin(t);
      },
      () => {
        const t = theta.Value() * Math.PI / 180;
        const dx = M.X();
        const dy = M.Y();
        return dx * Math.sin(t) + dy * Math.cos(t);
      }
    ], {
      name: "M'",
      size: 4,
      fillColor: '#10b981',
      strokeColor: '#059669',
      fixed: true,
      label: { offset: [5, 5], fontSize: 14, color: '#10b981' }
    });

    // Cercle de rayon ΩM
    board.create('circle', [O, M], {
      strokeColor: '#94a3b8',
      strokeWidth: 1,
      dash: 2,
      fillColor: 'none'
    });

    // Segments ΩM et ΩM'
    board.create('segment', [O, M], {
      strokeColor: '#3b82f6',
      strokeWidth: 2
    });
    board.create('segment', [O, Mprime], {
      strokeColor: '#10b981',
      strokeWidth: 2
    });

    // Segment [MM']
    board.create('segment', [M, Mprime], {
      strokeColor: '#8b5cf6',
      strokeWidth: 2
    });

    // Milieu I de [MM']
    const I = board.create('midpoint', [M, Mprime], {
      name: 'I',
      size: 3,
      fillColor: '#8b5cf6',
      strokeColor: '#7c3aed',
      label: { offset: [5, -10], fontSize: 12, color: '#8b5cf6' }
    });

    // Médiatrice de [MM'] (passe par Ω et I)
    board.create('line', [O, I], {
      strokeColor: '#f59e0b',
      strokeWidth: 1.5,
      dash: 3
    });

    // Triangle ΩMM' coloré
    board.create('polygon', [O, M, Mprime], {
      fillColor: '#fef3c7',
      fillOpacity: 0.3,
      borders: { strokeWidth: 0 }
    });

    // Arc pour l'angle θ
    board.create('angle', [M, O, Mprime], {
      radius: 0.8,
      fillColor: '#fbbf24',
      fillOpacity: 0.3,
      strokeColor: '#f59e0b',
      name: ''
    });
  }
};

export default graphConfig;
