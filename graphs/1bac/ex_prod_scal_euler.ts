
import { GeometryGraphConfig } from "@/types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-3, 5, 7, -3],
  showAxis: false,
  showGrid: false,
  init: (board) => {
    // Triangle quelconque (pas rectangle, pas isocèle pour généralité)
    const A = board.create('point', [1, 4], { name: 'A', color: '#1e293b' });
    const B = board.create('point', [-1, 0], { name: 'B', color: '#1e293b' });
    const C = board.create('point', [5, 0], { name: 'C', color: '#1e293b' });

    board.create('polygon', [A, B, C], { 
      fillColor: '#e0e7ff', 
      borders: { strokeColor: '#334155' } 
    });

    // Cercle circonscrit et Centre O
    const circumCircle = board.create('circumcircle', [A, B, C], { strokeColor: '#94a3b8', dash: 2 });
    const O = board.create('circumcenter', [A, B, C], { name: 'O', color: '#3b82f6', size: 3 });

    // Centre de gravité G
    const G = board.create('centroid', [A, B, C], { name: 'G', color: '#10b981', size: 3 });

    // Orthocentre H
    // JSXGraph n'a pas de constructeur direct 'orthocenter' simple stable dans toutes les versions, 
    // on le construit via intersection des hauteurs ou vecteur Euler
    const H = board.create('point', [
        () => A.X() + B.X() + C.X() - 2 * O.X(),
        () => A.Y() + B.Y() + C.Y() - 2 * O.Y()
    ], { name: 'H', color: '#ef4444', size: 3 });

    // Droite d'Euler
    board.create('line', [O, H], { strokeColor: '#f59e0b', strokeWidth: 2 });
    board.create('text', [4, 3, "Droite d'Euler"], { color: '#f59e0b', fontSize: 12 });

    // Hauteur issue de A pour visualiser H
    const BC = board.create('line', [B, C], { visible: false });
    board.create('perpendicular', [BC, A], { strokeColor: '#ef4444', dash: 2, strokeWidth: 1 });

    // Relation vectorielle
    board.create('text', [-2, 4.5, "\\[ \\overrightarrow{OH} = 3\\overrightarrow{OG} \\]"], { 
        fontSize: 14, 
        color: '#f59e0b', 
        useMathJax: true,
        fixed: true 
    });
  }
};

export default graphConfig;
