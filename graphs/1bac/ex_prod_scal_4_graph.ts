
import { GeometryGraphConfig } from "@/types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-5, 5, 5, -5],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // Centre Omega(1, -1) et Rayon 3
    const Omega = board.create('point', [1, -1], { name: 'Ω', color: '#1e293b' });
    const circle = board.create('circle', [Omega, 3], { strokeColor: '#3b82f6', strokeWidth: 2 });
    
    // Droite x + y + 3 = 0  => y = -x - 3
    const line = board.create('line', [[0, -3], [-3, 0]], { strokeColor: '#ef4444', strokeWidth: 2 });
    board.create('text', [-4, 0.5, "x+y+3=0"], { color: '#ef4444' });

    // Points d'intersection E(-3, 0) et F(0, -3)
    const E = board.create('point', [-3, 0], { name: 'E', color: '#10b981' });
    const F = board.create('point', [0, -3], { name: 'F', color: '#10b981' });

    // Zone système : intérieur du cercle ET au-dessus de la droite
    // Hachures pour montrer la solution
    // On ne peut pas facilement hachurer l'intersection exacte en JSXGraph simple,
    // mais on peut visualiser les éléments clés.
    
    board.create('text', [1, -1, "(C)"], { color: '#3b82f6', fontSize: 14 });
    board.create('text', [-1, -1, "Zone Solution"], { color: '#10b981', fontSize: 12 });
  }
};

export default graphConfig;
