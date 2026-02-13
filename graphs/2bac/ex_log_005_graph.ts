
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 2.5, 5, -2],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // Tangente T: y = x (demi-tangente pour x>=0)
    board.create('line', [[0, 0], [1, 1]], { strokeColor: '#10b981', dash: 2, strokeWidth: 1 });
    board.create('text', [2.5, 2.3, "(T)"], { color: '#10b981' });

    // Fonction f(x) = x - x^2 * ln(x)
    board.create('functiongraph', [
      (x: number) => {
          if (x <= 0) return 0; // Prolongement par continuité
          return x - x*x * Math.log(x);
      },
      0, 5
    ], { strokeColor: '#3b82f6', strokeWidth: 2 });

    // Points remarquables
    // Origine (0,0)
    board.create('point', [0, 0], { name: 'O', size: 2, color: '#1e293b', fixed: true });
    
    // Max local en (1, 1) - Tangente horizontale
    board.create('point', [1, 1], { name: 'A', size: 3, color: '#ef4444', fixed: true });
    board.create('segment', [[0.5, 1], [1.5, 1]], { strokeColor: '#ef4444', strokeWidth: 1 });
    
    // Intersection alpha approx 1.763 (Solution de x ln x = 1)
    const alpha = 1.763;
    board.create('point', [alpha, 0], { name: 'α', size: 3, color: '#ef4444', fixed: true, label: {offset: [0, 10]} });

    // Suite u_n (Escalier)
    let u = 0.5; // u0 = 1/2
    board.create('point', [u, 0], { name: 'u_0', size: 2, color: '#f59e0b', fixed: true, label: {offset: [0, -15]} });
    
    // Construction graphique des premiers termes
    for(let i=0; i<3; i++) {
        let f_u = u - u*u * Math.log(u);
        // Vertical vers courbe
        board.create('segment', [[u, u], [u, f_u]], { strokeColor: '#f59e0b', dash: 1, strokeWidth: 1 });
        // Horizontal vers y=x
        board.create('segment', [[u, f_u], [f_u, f_u]], { strokeColor: '#f59e0b', dash: 1, strokeWidth: 1 });
        // Projeter sur l'axe (optionnel, on garde propre)
        u = f_u;
    }

    // Labels
    board.create('text', [3, -1, "\\( (C_f) \\)"], { color: '#3b82f6', fontSize: 16, useMathJax: true, parse: false });
  }
};

export default graphConfig;
