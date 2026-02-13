
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-0.5, 2.5, 2.5, -2.5],
  showAxis: true,
  showGrid: false,
  keepAspectRatio: true,
  init: (board) => {
     // Cercle unité
     const circle = board.create('circle', [[0,0], 1], {strokeColor: '#cbd5e1', dash: 2});
     
     // Droite tangente x = 1
     board.create('line', [[1, -10], [1, 10]], {strokeColor: '#f59e0b', strokeWidth: 2});

     // Point M pilotant l'angle
     const M = board.create('glider', [0.866, 0.5, circle], {
         name: 'M', size: 4, color: '#3b82f6'
     });

     // Rayon prolongé
     board.create('line', [[0,0], M], {strokeColor: '#3b82f6', dash: 2, straightFirst: false});

     // Point T sur la droite tangente (Intersection)
     const T = board.create('point', [
         1, 
         () => {
             // Protection contre division par 0
             if (Math.abs(M.X()) < 0.01) return M.Y() > 0 ? 10 : -10;
             return M.Y() / M.X();
         } 
     ], {name: 'T', color: '#f59e0b', size: 3, label: {visible: false}});

     // Segment représentatif de la tangente
     board.create('segment', [[1,0], T], {strokeColor: '#f59e0b', strokeWidth: 4});

     // Texte LaTeX dynamique
     board.create('text', [1.2, 0.5, () => `\\[ \\tan(\\alpha) \\approx ${T.Y().toFixed(2)} \\]`], {
         fontSize: 14,
         color: '#f59e0b',
         useMathJax: true,
         fixed: true
     });
  }
};

export default graphConfig;
