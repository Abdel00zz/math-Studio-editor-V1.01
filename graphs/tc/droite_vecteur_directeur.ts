
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-4, 6, 8, -4],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // Point A de passage
    const A = board.create('point', [1, 1], { name: 'A', color: '#1e293b', size: 3 });

    // Vecteur directeur u (défini par l'origine et un point U pour le contrôle)
    // On met le contrôle U relatif à A pour que le vecteur semble partir de A ou à côté
    
    // Point de contrôle pour la direction
    const U_end = board.create('point', [3, 2], { name: 'Dir', color: '#10b981', size: 2, visible: true });
    
    // On dessine le vecteur u à part ou partant de A pour la clarté. Partons de A.
    const vecU = board.create('arrow', [A, U_end], { 
      strokeColor: '#10b981', 
      strokeWidth: 3, 
      name: 'u',
      withLabel: true,
      label: { color: '#10b981', offset: [10, 0] }
    });

    // La droite passant par A et parallèle à u
    const line = board.create('line', [A, U_end], { 
      strokeColor: '#3b82f6', 
      strokeWidth: 2 
    });

    // Texte pour l'équation (approximative)
    board.create('text', [-3, 5, () => {
        const vx = U_end.X() - A.X();
        const vy = U_end.Y() - A.Y();
        // Equation: -vy * (x - xa) + vx * (y - ya) = 0
        // -vy*x + vx*y + vy*xa - vx*ya = 0
        const a = -vy;
        const b = vx;
        const c = vy * A.X() - vx * A.Y();
        
        // Formatage joli si entier
        const fa = a.toFixed(1).replace('.0', '');
        const fb = b.toFixed(1).replace('.0', '');
        const fc = c.toFixed(1).replace('.0', '');
        
        // Gestion des signes pour l'affichage
        const signB = b >= 0 ? '+' : '';
        const signC = c >= 0 ? '+' : '';

        return `\\[ \\vec{u}(${vx.toFixed(1)}; ${vy.toFixed(1)}) \\quad \\Rightarrow \\quad ${fa}x ${signB}${fb}y ${signC}${fc} = 0 \\]`;
    }], { 
      fontSize: 14, 
      color: '#3b82f6', 
      useMathJax: true,
      fixed: true 
    });
    
    board.create('text', [4, -3, "(D)"], { color: '#3b82f6', fontSize: 14 });
  }
};

export default graphConfig;
