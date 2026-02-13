
import { GeometryGraphConfig } from "../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 4.5, 9, -3],
  showAxis: false,
  showGrid: true,
  init: (board) => {
    // Points A et B (fixes sur la ligne horizontale)
    const A = board.create('point', [1, 1], { 
      name: 'A', 
      size: 4, 
      color: '#3b82f6',
      fixed: true,
      label: { offset: [0, 15], fontSize: 14 }
    });
    const B = board.create('point', [7, 1], { 
      name: 'B', 
      size: 4, 
      color: '#3b82f6',
      fixed: true,
      label: { offset: [0, 15], fontSize: 14 }
    });
    
    // Segment [AB] - plus visible
    board.create('segment', [A, B], { 
      strokeColor: '#94a3b8', 
      strokeWidth: 2.5,
      firstArrow: false,
      lastArrow: false
    });

    // Sliders pour α et β - repositionnés plus clairement
    const alpha = board.create('slider', [[0.5, 3.5], [3.5, 3.5], [-5, 2, 10]], { 
      name: 'α', 
      snapWidth: 0.5,
      size: 6,
      fillColor: '#6366f1',
      strokeColor: '#4f46e5',
      label: { fontSize: 14 }
    });
    
    const beta = board.create('slider', [[4.5, 3.5], [7.5, 3.5], [-5, 1, 10]], { 
      name: 'β', 
      snapWidth: 0.5,
      size: 6,
      fillColor: '#8b5cf6',
      strokeColor: '#7c3aed',
      label: { fontSize: 14 }
    });

    // Barycentre G - calculé dynamiquement
    const G = board.create('point', [
      () => {
         const a = alpha.Value();
         const b = beta.Value();
         const sum = a + b;
         if (Math.abs(sum) < 0.001) return NaN; // G n'existe pas si α+β=0
         return (a * A.X() + b * B.X()) / sum;
      },
      () => {
         const a = alpha.Value();
         const b = beta.Value();
         const sum = a + b;
         if (Math.abs(sum) < 0.001) return NaN;
         return (a * A.Y() + b * B.Y()) / sum;
      }
    ], { 
      name: 'G', 
      color: '#ef4444', 
      size: 6,
      label: { offset: [0, -20], fontSize: 16, fontWeight: 'bold' }
    });

    // Vecteurs visuels GA et GB pour illustrer la relation
    board.create('arrow', [G, A], { 
      strokeColor: '#6366f1', 
      strokeWidth: 2,
      lastArrow: { type: 2, size: 6 }
    });
    board.create('arrow', [G, B], { 
      strokeColor: '#8b5cf6', 
      strokeWidth: 2,
      lastArrow: { type: 2, size: 6 }
    });

    // Relation vectorielle principale (titre)
    board.create('text', [4, -1.2, () => {
       const a = alpha.Value();
       const b = beta.Value();
       const sum = a + b;
       
       if (Math.abs(sum) < 0.001) {
         return "\\[ \\alpha + \\beta = 0 \\text{ : Pas de barycentre !} \\]";
       }
       
       return `\\[ ${a.toFixed(1)}\\overrightarrow{GA} + ${b.toFixed(1)}\\overrightarrow{GB} = \\vec{0} \\]`;
    }], { 
      fontSize: 14, 
      color: '#1e293b',
      useMathJax: true,
      fixed: true,
      parse: false,
      anchorX: 'middle',
      anchorY: 'top'
    });

    // Position de G sur le segment (formule AG)
    board.create('text', [4, -2.2, () => {
       const a = alpha.Value();
       const b = beta.Value();
       const sum = a + b;
       
       if (Math.abs(sum) < 0.001) return "";
       
       const ratio = b / sum;
       return `\\[ \\overrightarrow{AG} = \\frac{\\beta}{\\alpha+\\beta}\\overrightarrow{AB} = \\frac{${b.toFixed(1)}}{${sum.toFixed(1)}}\\overrightarrow{AB} \\approx ${ratio.toFixed(2)}\\overrightarrow{AB} \\]`;
    }], { 
      fontSize: 12, 
      color: '#64748b',
      useMathJax: true,
      fixed: true,
      parse: false,
      anchorX: 'middle',
      anchorY: 'top'
    });
  }
};

export default graphConfig;
