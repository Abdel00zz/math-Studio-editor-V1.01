
import { GeometryGraphConfig } from "../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-2, 5, 6, -2],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // Origine
    const O = board.create('point', [0, 0], { name: 'O', fixed: true, size: 2, color: '#1e293b' });

    // Vecteurs de base i et j
    const I = board.create('point', [1, 0], { visible: false });
    const J = board.create('point', [0, 1], { visible: false });
    
    board.create('arrow', [O, I], { strokeColor: '#10b981', strokeWidth: 3 });
    board.create('text', [0.5, -0.4, "\\[ \\vec{i} \\]"], { 
      color: '#10b981', 
      useMathJax: true, 
      fixed: true 
    });

    board.create('arrow', [O, J], { strokeColor: '#10b981', strokeWidth: 3 });
    board.create('text', [-0.4, 0.5, "\\[ \\vec{j} \\]"], { 
      color: '#10b981', 
      useMathJax: true, 
      fixed: true 
    });

    // Point M mobile
    const M = board.create('point', [3, 2], { name: 'M', color: '#3b82f6', size: 4 });

    // Projections sur les axes
    const Mx = board.create('point', [() => M.X(), 0], { visible: false });
    const My = board.create('point', [0, () => M.Y()], { visible: false });

    // Lignes de projection en pointillés
    board.create('segment', [M, Mx], { strokeColor: '#94a3b8', dash: 2 });
    board.create('segment', [M, My], { strokeColor: '#94a3b8', dash: 2 });

    // Vecteur OM
    board.create('arrow', [O, M], { strokeColor: '#3b82f6', strokeWidth: 2 });

    // Texte dynamique pour les coordonnées et la décomposition
    board.create('text', [0.5, 4, () => {
       const x = M.X().toFixed(1);
       const y = M.Y().toFixed(1);
       return `\\[ \\overrightarrow{OM} = ${x}\\vec{i} + ${y}\\vec{j} \\]`;
    }], { 
      fontSize: 14, 
      color: '#3b82f6', 
      useMathJax: true,
      fixed: true
    });
    
    board.create('text', [0.5, 3.2, () => `\\[ M(${M.X().toFixed(1)} ; ${M.Y().toFixed(1)}) \\]`], { 
      fontSize: 14, 
      color: '#1e293b', 
      useMathJax: true,
      fixed: true
    });
  }
};

export default graphConfig;
