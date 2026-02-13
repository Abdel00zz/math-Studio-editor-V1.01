import { GeometryGraphConfig } from "../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-4, 5, 6, -4],
  showAxis: true,
  showGrid: true,
  keepAspectRatio: true,
  init: (board) => {
    // 1. Points du diamètre
    const A = board.create('point', [-2, -1], { name: 'A', color: '#1e293b' });
    const B = board.create('point', [3, 2], { name: 'B', color: '#1e293b' });
    
    // 2. Milieu (Centre)
    const Omega = board.create('midpoint', [A, B], { name: 'Ω', size: 2, color: '#94a3b8' });
    
    // 3. Cercle
    const circle = board.create('circle', [Omega, A], { strokeColor: '#3b82f6', strokeWidth: 2 });
    
    // 4. Point M sur le cercle (Glider)
    const M = board.create('glider', [0, 2, circle], { name: 'M', color: '#ef4444' });
    
    // 5. Segments du triangle
    board.create('segment', [A, M], { strokeColor: '#94a3b8', dash: 2 });
    board.create('segment', [M, B], { strokeColor: '#94a3b8', dash: 2 });
    board.create('segment', [A, B], { strokeColor: '#1e293b' });

    // 6. Marqueur d'angle droit (Bonus visuel : prouve que c'est 90°)
    board.create('angle', [A, M, B], { 
        type: 'square', 
        name: '', 
        fillColor: '#ef4444', 
        fillOpacity: 0.3 
    });

    // 7. Produit scalaire nul (LaTeX corrigé)
    board.create('text', [-3, 4, () => {
        // Utilisation de \\vec et \\cdot avec des balises de mathématiques
        return "\\[ \\overrightarrow{MA} \\cdot \\overrightarrow{MB} = 0 \\]";
    }], { 
        fontSize: 16, 
        color: '#ef4444', 
        useMathJax: true, // <--- C'est la ligne la plus importante pour l'affichage
        fixed: true       // Empêche le texte de bouger accidentellement
    });
  }
};

export default graphConfig;
