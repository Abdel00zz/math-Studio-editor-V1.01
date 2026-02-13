import { GeometryGraphConfig } from "../../types";

/**
 * Graphe : Composition de rotations de même centre
 * Montre r(Ω,α) ∘ r(Ω,β) = r(Ω, α+β)
 */
export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-6, 5, 6, -5],
  showAxis: false,
  showGrid: false,
  init: (board) => {
    // Slider pour α (en haut à gauche)
    const alpha = board.create('slider', [[-5.5, 4.3], [-2, 4.3], [0, Math.PI/4, Math.PI]], {
      name: '',
      snapWidth: Math.PI/12,
      size: 4,
      fillColor: '#3b82f6',
      strokeColor: '#2563eb'
    });
    board.create('text', [-1.7, 4.3, () => `α = ${(alpha.Value() * 180 / Math.PI).toFixed(0)}°`], {
      fontSize: 12,
      color: '#3b82f6'
    });

    // Slider pour β
    const beta = board.create('slider', [[-5.5, 3.5], [-2, 3.5], [0, Math.PI/3, Math.PI]], {
      name: '',
      snapWidth: Math.PI/12,
      size: 4,
      fillColor: '#10b981',
      strokeColor: '#059669'
    });
    board.create('text', [-1.7, 3.5, () => `β = ${(beta.Value() * 180 / Math.PI).toFixed(0)}°`], {
      fontSize: 12,
      color: '#10b981'
    });

    // Affichage α + β
    board.create('text', [-5.5, 2.7, () => `α + β = ${((alpha.Value() + beta.Value()) * 180 / Math.PI).toFixed(0)}°`], {
      fontSize: 13,
      color: '#f59e0b'
    });

    // Centre Ω
    const omega = board.create('point', [0, 0], {
      name: '',
      size: 5,
      fillColor: '#ef4444',
      strokeColor: '#dc2626',
      fixed: true
    });
    board.create('text', [-0.4, -0.5, '\\(\\Omega\\)'], { fontSize: 14, useMathJax: true });

    // Point M initial
    const M = board.create('point', [3, 0], {
      name: '',
      size: 4,
      fillColor: '#64748b',
      strokeColor: '#475569'
    });
    board.create('text', [() => M.X() + 0.2, () => M.Y() - 0.4, '\\(M\\)'], { 
      fontSize: 14, useMathJax: true 
    });

    // Cercle trajectoire
    board.create('circle', [omega, M], {
      strokeColor: '#e2e8f0',
      strokeWidth: 1,
      dash: 3
    });

    // M₁ = r(Ω,α)(M)
    const M1 = board.create('point', [
      () => M.X() * Math.cos(alpha.Value()) - M.Y() * Math.sin(alpha.Value()),
      () => M.X() * Math.sin(alpha.Value()) + M.Y() * Math.cos(alpha.Value())
    ], {
      name: '',
      size: 4,
      fillColor: '#3b82f6',
      strokeColor: '#2563eb',
      fixed: true
    });
    board.create('text', [() => M1.X() + 0.25, () => M1.Y() + 0.25, '\\(M_1\\)'], { 
      fontSize: 13, useMathJax: true, color: '#3b82f6' 
    });

    // M' = r(Ω,β)(M₁) = r(Ω,α+β)(M)
    const Mprime = board.create('point', [
      () => {
        const t = alpha.Value() + beta.Value();
        return M.X() * Math.cos(t) - M.Y() * Math.sin(t);
      },
      () => {
        const t = alpha.Value() + beta.Value();
        return M.X() * Math.sin(t) + M.Y() * Math.cos(t);
      }
    ], {
      name: '',
      size: 5,
      fillColor: '#f59e0b',
      strokeColor: '#d97706',
      fixed: true
    });
    board.create('text', [() => Mprime.X() + 0.25, () => Mprime.Y() + 0.25, "\\(M'\\)"], { 
      fontSize: 14, useMathJax: true, color: '#f59e0b' 
    });

    // Arc α (M → M₁)
    board.create('arc', [omega, M, M1], {
      strokeColor: '#3b82f6',
      strokeWidth: 2,
      lastArrow: { type: 2, size: 5 }
    });

    // Arc β (M₁ → M')
    board.create('arc', [omega, M1, Mprime], {
      strokeColor: '#10b981',
      strokeWidth: 2,
      lastArrow: { type: 2, size: 5 }
    });

    // Arc total α+β (pointillé)
    board.create('arc', [omega, M, Mprime], {
      strokeColor: '#f59e0b',
      strokeWidth: 2,
      dash: 2
    });

    // Rayons
    board.create('segment', [omega, M], { strokeColor: '#94a3b8', strokeWidth: 1 });
    board.create('segment', [omega, M1], { strokeColor: '#3b82f6', strokeWidth: 1, dash: 2 });
    board.create('segment', [omega, Mprime], { strokeColor: '#f59e0b', strokeWidth: 1 });
  }
};

export default graphConfig;
