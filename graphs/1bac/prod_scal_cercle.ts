
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-3, 4, 5, -4],
  showAxis: true,
  showGrid: true,
  keepAspectRatio: true,
  init: (board) => {
    // Diamètre AB
    const A = board.create('point', [-2, -1], { name: 'A', color: '#1e293b' });
    const B = board.create('point', [3, 2], { name: 'B', color: '#1e293b' });
    const AB = board.create('segment', [A, B], { strokeColor: '#94a3b8', dash: 2 });

    // Centre Omega
    const Omega = board.create('midpoint', [A, B], { name: 'Ω', size: 2, color: '#94a3b8' });

    // Cercle
    const circle = board.create('circle', [Omega, A], { strokeColor: '#3b82f6', strokeWidth: 2 });

    // Point M sur le cercle
    const M = board.create('glider', [0, 2, circle], { name: 'M', color: '#ef4444' });

    // Vecteurs MA et MB
    board.create('segment', [M, A], { strokeColor: '#ef4444', strokeWidth: 2 });
    board.create('segment', [M, B], { strokeColor: '#ef4444', strokeWidth: 2 });

    // Angle droit (prouve le produit scalaire nul)
    board.create('angle', [A, M, B], { type: 'square', name: '' });

    // Formule
    board.create('text', [-2, 3.5, "\\[ M \\in \\mathcal{C} \\iff \\overrightarrow{MA} \\cdot \\overrightarrow{MB} = 0 \\]"], { 
        fontSize: 14, 
        color: '#ef4444', 
        useMathJax: true,
        fixed: true 
    });
  }
};

export default graphConfig;
