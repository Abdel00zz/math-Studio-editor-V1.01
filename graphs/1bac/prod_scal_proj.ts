
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-2, 5, 8, -3],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // Origine
    const O = board.create('point', [0, 0], { name: 'O', fixed: true, color: '#64748b', size: 3 });
    
    // Vecteur u (fixe sur l'axe pour simplifier la compréhension de la projection)
    const A = board.create('point', [5, 0], { name: 'A', fixed: true, visible: false });
    const vecU = board.create('segment', [O, A], { lastArrow: true, strokeColor: '#3b82f6', strokeWidth: 3, name: '' });
    
    // Label u en LaTeX
    board.create('text', [2.5, -0.5, "\\[ \\vec{u} \\]"], { 
      color: '#3b82f6', 
      useMathJax: true, 
      fixed: true 
    });

    // Vecteur v (mobile)
    const B = board.create('point', [3, 4], { name: 'B', color: '#ef4444' });
    const vecV = board.create('segment', [O, B], { lastArrow: true, strokeColor: '#ef4444', strokeWidth: 3 });
    
    // Label v en LaTeX
    board.create('text', [() => B.X() + 0.2, () => B.Y() + 0.2, "\\[ \\vec{v} \\]"], { 
      color: '#ef4444', 
      useMathJax: true, 
      fixed: false // Le label suit le point
    });

    // Projection H de B sur (OA)
    const H = board.create('point', [() => B.X(), 0], { name: 'H', size: 2, color: '#94a3b8', visible: true, label: {offset: [0, -10]} });
    board.create('segment', [B, H], { strokeColor: '#94a3b8', dash: 2 });

    // Texte dynamique du produit scalaire en LaTeX
    board.create('text', [-1, 4, () => {
        const prod = 5 * B.X(); // car u est (5,0)
        return `\\[ \\vec{u} \\cdot \\vec{v} = \\|\\vec{u}\\| \\times \\overline{OH} = 5 \\times ${B.X().toFixed(2)} = ${prod.toFixed(2)} \\]`;
    }], { 
      fontSize: 14, 
      color: '#334155',
      useMathJax: true,
      fixed: true
    });
  }
};

export default graphConfig;
