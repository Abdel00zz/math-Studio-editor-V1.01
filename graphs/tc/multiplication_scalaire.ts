
import { GeometryGraphConfig } from "../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 4, 10, -3],
  showAxis: false,
  showGrid: true,
  init: (board) => {
    // Origine fixe pour la clarté
    const O = board.create('point', [1, 1], { name: 'O', fixed: true, size: 2, color: '#1e293b' });
    
    // Vecteur u (défini par un point M)
    const M = board.create('point', [3, 2], { name: 'M', visible: false }); // Extrémité de u
    const vecU = board.create('arrow', [O, M], { 
        strokeColor: '#3b82f6', 
        strokeWidth: 4,
        name: 'u',
        withLabel: true,
        label: { offset: [0, 10], color: '#3b82f6', fontSize: 16 }
    });
    
    // Slider k
    const k = board.create('slider', [[1, 3], [5, 3], [-2, 2, 4]], {
        name: 'k',
        snapWidth: 0.5,
        color: '#ef4444'
    });

    // Vecteur v = k*u
    // Extrémité P = O + k * (M - O)
    const P = board.create('point', [
        () => O.X() + k.Value() * (M.X() - O.X()),
        () => O.Y() + k.Value() * (M.Y() - O.Y())
    ], { visible: false });

    const vecV = board.create('arrow', [O, P], { 
        strokeColor: '#ef4444', 
        strokeWidth: 3,
        name: 'v',
    });

    // Texte dynamique
    board.create('text', [2, -1.5, () => {
        const val = k.Value();
        return `\\[ \\vec{v} = ${val.toFixed(1)} \\vec{u} \\]`;
    }], {
        fontSize: 16,
        color: '#ef4444',
        useMathJax: true,
        fixed: true
    });
    
    // Indication de sens
    board.create('text', [6, -1.5, () => {
        return k.Value() < 0 ? "(Sens opposé)" : "(Même sens)";
    }], { fontSize: 12, color: '#64748b' });
  }
};

export default graphConfig;
