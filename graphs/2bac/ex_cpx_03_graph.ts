
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 5, 5, -1],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // Centre O
    const O = board.create('point', [0, 0], { name: 'O', fixed: true, size: 2, color: '#1e293b' });

    // Point A
    const A = board.create('point', [Math.sqrt(3), -Math.sqrt(3)], { name: 'A', color: '#3b82f6' });
    board.create('segment', [O, A], { strokeColor: '#3b82f6', dash: 2 });

    // Point B (Image par rotation pi/12 + pi/4 ?) Non, c'est l'énoncé.
    // b a pour argument pi/12 et module sqrt(2)+sqrt(6)
    // Ici on simule juste la rotation R(O, pi/6)
    
    // Rotation de A par pi/6 donne A'
    const A_prime = board.create('point', [
        () => A.X() * Math.cos(Math.PI/6) - A.Y() * Math.sin(Math.PI/6),
        () => A.X() * Math.sin(Math.PI/6) + A.Y() * Math.cos(Math.PI/6)
    ], { name: "A'", color: '#10b981' });
    
    board.create('segment', [O, A_prime], { strokeColor: '#10b981', dash: 2 });
    
    // Arc de rotation
    board.create('arc', [O, A, A_prime], { strokeColor: '#f59e0b', strokeWidth: 2, lastArrow: true });
    board.create('text', [1, 0.2, "\\(\\pi/6\\)"], { fontSize: 12, color: '#f59e0b', useMathJax: true });
  }
};

export default graphConfig;
