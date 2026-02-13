
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-2, 5, 6, -2],
  showAxis: true,
  showGrid: true,
  keepAspectRatio: true,
  init: (board) => {
    // Base i, j
    const O = board.create('point', [0, 0], { fixed: true, visible: false });
    const I = board.create('point', [1, 0], { fixed: true, visible: false });
    const J = board.create('point', [0, 1], { fixed: true, visible: false });

    board.create('arrow', [O, I], { strokeColor: '#10b981', strokeWidth: 3 });
    board.create('text', [0.5, -0.3, "\\[ \\vec{i} \\]"], { 
      color: '#10b981', 
      fontSize: 14, 
      useMathJax: true, 
      fixed: true 
    });
    
    board.create('arrow', [O, J], { strokeColor: '#10b981', strokeWidth: 3 });
    board.create('text', [-0.3, 0.5, "\\[ \\vec{j} \\]"], { 
      color: '#10b981', 
      fontSize: 14, 
      useMathJax: true, 
      fixed: true 
    });

    // Vecteur u mobile
    const M = board.create('point', [3, 2], { name: 'M(x,y)', color: '#3b82f6' });
    board.create('arrow', [O, M], { strokeColor: '#3b82f6', strokeWidth: 2 });

    // Projections
    const Mx = board.create('point', [() => M.X(), 0], { visible: false });
    const My = board.create('point', [0, () => M.Y()], { visible: false });

    board.create('segment', [M, Mx], { dash: 2, strokeColor: '#94a3b8' });
    board.create('segment', [M, My], { dash: 2, strokeColor: '#94a3b8' });

    // Affichage norme en LaTeX
    board.create('text', [0.5, 4, () => {
        const n2 = M.X()*M.X() + M.Y()*M.Y();
        return `\\[ \\|\\overrightarrow{u}\\|^2 = x^2 + y^2 = ${M.X().toFixed(1)}^2 + ${M.Y().toFixed(1)}^2 = ${n2.toFixed(2)} \\]`;
    }], { 
      fontSize: 14, 
      color: '#3b82f6', 
      useMathJax: true,
      fixed: true
    });
  }
};

export default graphConfig;
