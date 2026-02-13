
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1.5, 1.5, 1.5, -1.5],
  showAxis: true,
  init: (board) => {
    const circle = board.create('circle', [[0,0], 1], {strokeColor: '#cbd5e1'});

    // Point M (x)
    const M = board.create('glider', [0.8, 0.6, circle], {
        name: 'M(x)', color: '#3b82f6'
    });

    // Point M' (-x) : Symétrique par rapport à l'axe des abscisses
    const M_prime = board.create('point', [
        () => M.X(),
        () => -M.Y()
    ], {name: "M'(-x)", color: '#ef4444', size: 3});

    // Arcs angles
    board.create('segment', [[0,0], M], {strokeColor: '#3b82f6'});
    board.create('segment', [[0,0], M_prime], {strokeColor: '#ef4444'});
    
    // Connexion verticale (montre cos égal)
    board.create('segment', [M, M_prime], {strokeColor: '#10b981', dash: 2});

    // Textes LaTeX fixes
    board.create('text', [0.8, 1.2, "\\[ \\cos(-x) = \\cos(x) \\]"], {
        fontSize: 14,
        color: '#10b981', 
        useMathJax: true, 
        fixed: true
    });
    
    board.create('text', [0.8, -1.2, "\\[ \\sin(-x) = -\\sin(x) \\]"], {
        fontSize: 14,
        color: '#ef4444', 
        useMathJax: true, 
        fixed: true
    });
  }
};

export default graphConfig;
