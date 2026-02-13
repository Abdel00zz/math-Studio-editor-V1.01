import { GeometryGraphConfig } from "../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 5, 6, -2],
  showAxis: false,
  showGrid: true,
  keepAspectRatio: true,
  init: (board) => {
    // Origine O
    const O = board.create('point', [1, 1], {
      name: '',
      fixed: true,
      size: 4,
      color: '#1e293b'
    });
    board.create('text', [0.7, 0.6, '\\(O\\)'], {
      fontSize: 14,
      useMathJax: true,
      fixed: true
    });

    // Vecteur i (axe X)
    const I = board.create('point', [4, 1], {
      name: '',
      fixed: true,
      size: 3,
      color: '#3b82f6'
    });
    board.create('arrow', [O, I], {
      strokeColor: '#3b82f6',
      strokeWidth: 3,
      lastArrow: { type: 2, size: 8 }
    });
    board.create('text', [4.2, 0.6, '\\(\\vec{i}\\)'], {
      fontSize: 14,
      color: '#3b82f6',
      useMathJax: true,
      fixed: true
    });

    // Vecteur j (axe Y dans le plan, mais représenté en oblique pour effet 3D)
    const J = board.create('point', [2.5, 0], {
      name: '',
      fixed: true,
      size: 3,
      color: '#10b981'
    });
    board.create('arrow', [O, J], {
      strokeColor: '#10b981',
      strokeWidth: 3,
      lastArrow: { type: 2, size: 8 }
    });
    board.create('text', [2.7, -0.4, '\\(\\vec{j}\\)'], {
      fontSize: 14,
      color: '#10b981',
      useMathJax: true,
      fixed: true
    });

    // Vecteur k (axe Z vertical)
    const K = board.create('point', [1, 4], {
      name: '',
      fixed: true,
      size: 3,
      color: '#ef4444'
    });
    board.create('arrow', [O, K], {
      strokeColor: '#ef4444',
      strokeWidth: 3,
      lastArrow: { type: 2, size: 8 }
    });
    board.create('text', [0.6, 4.2, '\\(\\vec{k}\\)'], {
      fontSize: 14,
      color: '#ef4444',
      useMathJax: true,
      fixed: true
    });

    // Représentation de la main droite (texte descriptif)
    board.create('text', [3.5, 3.5, 'Règle de la main droite :'], {
      fontSize: 13,
      color: '#1e293b',
      fixed: true
    });
    board.create('text', [3.5, 3, '• Pouce → \\(\\vec{i}\\)'], {
      fontSize: 12,
      color: '#3b82f6',
      useMathJax: true,
      fixed: true
    });
    board.create('text', [3.5, 2.5, '• Index → \\(\\vec{j}\\)'], {
      fontSize: 12,
      color: '#10b981',
      useMathJax: true,
      fixed: true
    });
    board.create('text', [3.5, 2, '• Majeur → \\(\\vec{k}\\)'], {
      fontSize: 12,
      color: '#ef4444',
      useMathJax: true,
      fixed: true
    });

    // Arc pour montrer la rotation de i vers j
    const arcCenter = board.create('point', [1, 1], { visible: false });
    board.create('arc', [arcCenter, [2.5, 1], [1.8, 0.3]], {
      strokeColor: '#f59e0b',
      strokeWidth: 2,
      lastArrow: { type: 2, size: 5 }
    });

    // Indication du sens direct
    board.create('text', [2.2, 0.5, 'sens direct'], {
      fontSize: 11,
      color: '#f59e0b',
      fixed: true
    });

    // Plan (i, j) représenté
    board.create('polygon', [
      [0.5, 0.5], [4.5, 0.5], [3, -0.5], [0, -0.5]
    ], {
      fillColor: '#e2e8f0',
      fillOpacity: 0.3,
      borders: {
        strokeColor: '#94a3b8',
        strokeWidth: 1,
        dash: 2
      }
    });

    // Formule du produit vectoriel des vecteurs de base
    board.create('text', [0.5, -1.2, '\\(\\vec{i} \\wedge \\vec{j} = \\vec{k}\\)'], {
      fontSize: 14,
      color: '#1e293b',
      useMathJax: true,
      fixed: true
    });
  }
};

export default graphConfig;