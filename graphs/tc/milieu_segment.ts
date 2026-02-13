
import { GeometryGraphConfig } from "../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-4, 6, 8, -4],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // Points A et B mobiles
    const A = board.create('point', [-2, -1], { name: 'A', color: '#3b82f6', size: 4 });
    const B = board.create('point', [4, 3], { name: 'B', color: '#3b82f6', size: 4 });

    // Segment [AB]
    const segAB = board.create('segment', [A, B], { strokeColor: '#1e293b', strokeWidth: 2 });

    // Milieu I (calculé automatiquement par JSXGraph ou manuellement)
    const I = board.create('midpoint', [A, B], { 
      name: 'I', 
      color: '#ef4444', 
      size: 3,
      label: { offset: [0, 15] }
    });

    // Marques d'égalité de longueur
    board.create('hatch', [segAB, 2], { ticks: 2, tickSize: 10, strokeColor: '#ef4444' }); // Ne marche pas toujours bien sur un segment complet pour le milieu

    // On crée deux segments invisibles pour les marques, ou on utilise le texte pour prouver l'égalité
    
    // Coordonnées dynamiques
    board.create('text', [-3, 5, () => {
        return `\\[ x_I = \\frac{x_A + x_B}{2} = \\frac{${A.X().toFixed(1)} + ${B.X().toFixed(1)}}{2} = ${I.X().toFixed(1)} \\]`;
    }], { fontSize: 13, color: '#ef4444', useMathJax: true, fixed: true });

    board.create('text', [-3, 4, () => {
        return `\\[ y_I = \\frac{y_A + y_B}{2} = \\frac{${A.Y().toFixed(1)} + ${B.Y().toFixed(1)}}{2} = ${I.Y().toFixed(1)} \\]`;
    }], { fontSize: 13, color: '#ef4444', useMathJax: true, fixed: true });
  }
};

export default graphConfig;
