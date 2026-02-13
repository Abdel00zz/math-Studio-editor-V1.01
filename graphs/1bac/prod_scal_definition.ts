
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 5, 6, -2],
  showAxis: false,
  showGrid: false,
  init: (board) => {
    // Origine
    const O = board.create('point', [0, 0], { name: 'O', fixed: true, size: 3, color: '#1e293b' });
    
    // Vecteur u (fixe horizontal)
    const A = board.create('point', [4, 0], { name: 'A', fixed: true, visible: false });
    const vecU = board.create('arrow', [O, A], { strokeColor: '#3b82f6', strokeWidth: 3 });
    board.create('text', [2, -0.3, "\\[ \\vec{u} \\]"], { color: '#3b82f6', useMathJax: true });

    // Vecteur v (mobile)
    const B = board.create('point', [3, 2], { name: 'B', color: '#ef4444' });
    const vecV = board.create('arrow', [O, B], { strokeColor: '#ef4444', strokeWidth: 3 });
    board.create('text', [() => B.X()/2, () => B.Y()/2 + 0.3, "\\[ \\vec{v} \\]"], { color: '#ef4444', useMathJax: true });

    // Projection H
    const H = board.create('point', [() => B.X(), 0], { name: 'H', size: 2, color: '#94a3b8', visible: true });
    board.create('segment', [B, H], { strokeColor: '#94a3b8', dash: 2 });
    
    // Angle droit
    board.create('angle', [B, H, O], { type: 'square', name: '' });

    // Segment OH (la mesure algébrique)
    board.create('segment', [O, H], { strokeColor: '#10b981', strokeWidth: 4 });

    // Texte dynamique
    board.create('text', [0.5, 4, () => {
        const res = 4 * B.X(); // ||u|| * OH
        return `\\[ \\vec{u} \\cdot \\vec{v} = \\|\\vec{u}\\| \\times \\overline{OH} \\approx ${res.toFixed(1)} \\]`;
    }], { fontSize: 14, color: '#334155', useMathJax: true });
  }
};

export default graphConfig;
