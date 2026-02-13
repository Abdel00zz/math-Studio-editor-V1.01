
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-0.5, 3, 5, -2],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // 1. Fonction f(x) = (1/x + ln(x)) * ln(x)
    const f = board.create('functiongraph', [
      (x: number) => {
          if (x <= 0.1) return NaN; // Éviter l'asymptote en 0
          return (1/x + Math.log(x)) * Math.log(x);
      },
      0.1, 5
    ], { strokeColor: '#3b82f6', strokeWidth: 2, name: 'f' });

    // 2. Tangente en x=1
    // f(1) = 0, f'(1) = 1 (calculé dans l'exo : g(1)/1^3 = 1)
    // Équation : y = x - 1
    const tangent = board.create('line', [[1, 0], [2, 1]], { 
        strokeColor: '#10b981', 
        dash: 2, 
        strokeWidth: 1 
    });
    board.create('text', [2, 1.2, "(T): y = x - 1"], { color: '#10b981', fontSize: 12 });

    // 3. Point A(1, 0) - Point de contact
    board.create('point', [1, 0], { 
        name: 'A', 
        size: 3, 
        color: '#ef4444', 
        fixed: true,
        label: { offset: [5, -10] }
    });

    // 4. Ligne y = 1 pour visualiser la solution alpha
    board.create('line', [[0, 1], [1, 1]], { strokeColor: '#94a3b8', dash: 2, strokeWidth: 1 });
    board.create('text', [0.2, 1.1, "y = 1"], { color: '#94a3b8', fontSize: 10 });
    
    // Intersection alpha (approximatif pour visualisation, alpha approx 2.05)
    // f(2.05) approx 1
    board.create('point', [2.05, 1], { 
        name: 'α', 
        size: 3, 
        color: '#f59e0b', 
        fixed: true,
        label: { offset: [0, 10] }
    });

    // 5. Zone d'intégration (Aire) entre 1 et e
    const e = Math.E; // approx 2.718
    // Ligne verticale x = e
    board.create('segment', [[e, 0], [e, (1/e + 1)*1]], { strokeColor: '#94a3b8', dash: 2 });
    board.create('text', [e, -0.2, "e"], { color: '#64748b', fontSize: 12 });

    // Hachures ou remplissage pour l'aire
    board.create('integral', [[1, e], f], {
        color: '#8b5cf6',
        fillOpacity: 0.2,
        label: { visible: false }
    });
    
    board.create('text', [1.8, 0.4, "\\( \\mathcal{A} \\)"], { 
        color: '#8b5cf6', 
        fontSize: 14,
        useMathJax: true
    });

    // 6. Labels de la courbe
    board.create('text', [3.5, 2.5, "\\( (C_f) \\)"], { 
        color: '#3b82f6', 
        fontSize: 16,
        useMathJax: true
    });
  }
};

export default graphConfig;
