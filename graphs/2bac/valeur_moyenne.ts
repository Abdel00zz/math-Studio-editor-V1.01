
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 5, 6, -1],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // Fonction f(x)
    const f_fn = (x: number) => 0.2 * Math.pow(x, 3) - 1.2 * Math.pow(x, 2) + 2.5 * x + 0.5;
    
    // Primitive pour le calcul exact de l'aire
    const F_fn = (x: number) => (0.2/4)*Math.pow(x,4) - (1.2/3)*Math.pow(x,3) + (2.5/2)*Math.pow(x,2) + 0.5*x;

    const f = board.create('functiongraph', [f_fn, -1, 6], { strokeColor: '#3b82f6', strokeWidth: 2 });

    // Bornes
    const a = board.create('slider', [[0.5, 4.5], [2, 4.5], [0, 0.5, 2]], { name: 'a' });
    const b = board.create('slider', [[3, 4.5], [4.5, 4.5], [2.5, 4, 5]], { name: 'b' });

    // Aire sous la courbe
    board.create('integral', [[() => a.Value(), () => b.Value()], f], {
        color: '#3b82f6',
        fillOpacity: 0.2,
        label: { visible: false }
    });

    // Calcul de la moyenne mu
    const getMu = () => {
        const va = a.Value();
        const vb = b.Value();
        if (Math.abs(vb - va) < 0.001) return 0;
        const area = F_fn(vb) - F_fn(va);
        return area / (vb - va);
    };

    // Rectangle de valeur moyenne
    board.create('polygon', [
        [() => a.Value(), 0],
        [() => b.Value(), 0],
        [() => b.Value(), getMu],
        [() => a.Value(), getMu]
    ], {
        fillColor: '#10b981',
        fillOpacity: 0.2,
        borders: { strokeColor: '#10b981', strokeWidth: 2, dash: 2 }
    });

    // Ligne de la valeur moyenne
    board.create('segment', [[-1, getMu], [6, getMu]], { strokeColor: '#10b981', dash: 3, strokeWidth: 1 });
    
    // Point Mu sur l'axe Y
    board.create('text', [0.1, () => getMu() + 0.1, "μ"], { color: '#10b981', fontSize: 16 });

    // Texte explicatif
    board.create('text', [1, -0.8, "\\[ \\mu = \\frac{1}{b-a} \\int_a^b f(x)dx \\]"], {
        fontSize: 14,
        color: '#1e293b',
        useMathJax: true,
        fixed: true,
        anchorX: 'left'
    });
  }
};

export default graphConfig;
