import { GeometryGraphConfig } from "../../types";

/**
 * Graphe : Définition de la Rotation r(Ω, θ)
 * Visualise M → M' avec ΩM = ΩM' et angle (ΩM, ΩM') = θ
 */
export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-6, 5, 6, -5],
  showAxis: false,
  showGrid: false,
  init: (board) => {
    // Slider pour l'angle θ (en haut à gauche)
    const theta = board.create('slider', [[-5.5, 4.2], [-1.5, 4.2], [-Math.PI, Math.PI/3, Math.PI]], {
      name: '',
      snapWidth: Math.PI/12,
      size: 4,
      fillColor: '#f59e0b',
      strokeColor: '#d97706'
    });

    // Label θ
    board.create('text', [-1.2, 4.2, () => `θ = ${(theta.Value() * 180 / Math.PI).toFixed(0)}°`], {
      fontSize: 13,
      color: '#f59e0b'
    });

    // Centre Ω (centré)
    const omega = board.create('point', [0, -0.5], {
      name: '',
      size: 5,
      fillColor: '#ef4444',
      strokeColor: '#dc2626',
      fixed: true
    });
    board.create('text', [-0.4, -0.9, '\\(\\Omega\\)'], { fontSize: 14, useMathJax: true });

    // Point M (mobile)
    const M = board.create('point', [3, 1.5], {
      name: '',
      size: 4,
      fillColor: '#3b82f6',
      strokeColor: '#2563eb'
    });
    board.create('text', [() => M.X() + 0.2, () => M.Y() + 0.25, '\\(M\\)'], { 
      fontSize: 14, useMathJax: true, color: '#3b82f6' 
    });

    // Cercle trajectoire (pointillé)
    board.create('circle', [omega, M], {
      strokeColor: '#94a3b8',
      strokeWidth: 1,
      dash: 3
    });

    // Point M' (image)
    const Mprime = board.create('point', [
      () => {
        const t = theta.Value();
        const dx = M.X() - omega.X();
        const dy = M.Y() - omega.Y();
        return omega.X() + dx * Math.cos(t) - dy * Math.sin(t);
      },
      () => {
        const t = theta.Value();
        const dx = M.X() - omega.X();
        const dy = M.Y() - omega.Y();
        return omega.Y() + dx * Math.sin(t) + dy * Math.cos(t);
      }
    ], {
      name: '',
      size: 4,
      fillColor: '#10b981',
      strokeColor: '#059669',
      fixed: true
    });
    board.create('text', [() => Mprime.X() + 0.2, () => Mprime.Y() + 0.25, "\\(M'\\)"], { 
      fontSize: 14, useMathJax: true, color: '#10b981' 
    });

    // Segments ΩM et ΩM'
    board.create('segment', [omega, M], { strokeColor: '#3b82f6', strokeWidth: 2 });
    board.create('segment', [omega, Mprime], { strokeColor: '#10b981', strokeWidth: 2 });

    // Arc de l'angle θ
    board.create('angle', [M, omega, Mprime], {
      radius: 0.6,
      fillColor: '#fef3c7',
      fillOpacity: 0.5,
      strokeColor: '#f59e0b',
      strokeWidth: 2,
      name: ''
    });
  }
};

export default graphConfig;
