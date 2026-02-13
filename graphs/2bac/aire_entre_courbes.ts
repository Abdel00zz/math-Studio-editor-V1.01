
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 6, 6, -2],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // f(x) = -0.25(x-2.5)^2 + 4 (Parabole vers le bas)
    const f = board.create('functiongraph', [
      (x: number) => -0.25 * Math.pow(x - 2.5, 2) + 4,
      -1, 6
    ], { strokeColor: '#3b82f6', strokeWidth: 2, name: 'f' });

    // g(x) = 0.1(x-2.5)^2 + 1 (Parabole vers le haut)
    const g = board.create('functiongraph', [
      (x: number) => 0.1 * Math.pow(x - 2.5, 2) + 1,
      -1, 6
    ], { strokeColor: '#ef4444', strokeWidth: 2, name: 'g' });

    // Bornes a et b
    const a = board.create('slider', [[0.5, 5], [2.5, 5], [0, 1, 2.5]], { name: 'a', snapWidth: 0.1 });
    const b = board.create('slider', [[3.5, 5], [5.5, 5], [2.5, 4.5, 5]], { name: 'b', snapWidth: 0.1 });

    // Hachures entre les courbes
    // Astuce JSXGraph : Créer une courbe fermée qui suit f puis revient par g
    board.create('curve', [[], []], {
        updateData: function() {
            const step = 0.1;
            const x = [];
            const y = [];
            const va = a.Value();
            const vb = b.Value();
            
            // Chemin aller sur f
            for(let i = va; i <= vb; i += step) {
                x.push(i);
                y.push(-0.25 * Math.pow(i - 2.5, 2) + 4);
            }
            // Point final exact sur f
            x.push(vb);
            y.push(-0.25 * Math.pow(vb - 2.5, 2) + 4);

            // Chemin retour sur g
            for(let i = vb; i >= va; i -= step) {
                x.push(i);
                y.push(0.1 * Math.pow(i - 2.5, 2) + 1);
            }
            // Point final exact sur g
            x.push(va);
            y.push(0.1 * Math.pow(va - 2.5, 2) + 1);

            this.dataX = x;
            this.dataY = y;
        },
        fillColor: '#8b5cf6',
        fillOpacity: 0.3,
        strokeWidth: 0
    });

    // Lignes verticales
    board.create('segment', [[() => a.Value(), 0], [() => a.Value(), () => -0.25 * Math.pow(a.Value() - 2.5, 2) + 4]], { dash: 2, strokeColor: '#94a3b8' });
    board.create('segment', [[() => b.Value(), 0], [() => b.Value(), () => -0.25 * Math.pow(b.Value() - 2.5, 2) + 4]], { dash: 2, strokeColor: '#94a3b8' });

    // Texte dynamique
    board.create('text', [0.5, 4, () => {
        return `\\[ \\mathcal{A} = \\int_{a}^{b} (f(x) - g(x)) dx \\]`;
    }], { 
        fontSize: 16, 
        color: '#8b5cf6',
        useMathJax: true,
        fixed: true
    });
  }
};

export default graphConfig;
