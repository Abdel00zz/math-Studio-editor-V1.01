
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1.5, 1.5, 1.5, -1.5],
  showAxis: true,
  showGrid: true,
  keepAspectRatio: true,
  init: (board) => {
    // Cercle trigonométrique
    const circle = board.create('circle', [[0,0], 1], {
        strokeColor: '#475569', 
        strokeWidth: 2,
        fixed: true
    });

    // Point Origine I
    const I = board.create('point', [1, 0], {
        name: 'I', 
        color: '#475569', 
        size: 3, 
        fixed: true
    });
    
    // Point M mobile sur le cercle
    const M = board.create('glider', [0.707, 0.707, circle], { 
        name: 'M', 
        size: 5, 
        color: '#3b82f6'
    });

    // Centre O
    const O = board.create('point', [0, 0], {visible: false});

    // Secteur angulaire (Arc) pour visualiser l'abscisse
    const arc = board.create('arc', [O, I, M], {
        strokeColor: '#f59e0b',
        strokeWidth: 3,
        selection: false,
        fillColor: '#f59e0b',
        fillOpacity: 0.1
    });

    // Rayon vecteur
    board.create('segment', [O, M], {strokeColor: '#3b82f6', dash: 2});

    // Fonction pour calculer l'angle positif entre 0 et 2PI
    const getAngle = () => {
        let angle = Math.atan2(M.Y(), M.X());
        if (angle < 0) angle += 2 * Math.PI;
        return angle;
    };

    // Affichage des valeurs multiples (Enroulement)
    // Affiche : x, x + 2pi, x - 2pi
    board.create('text', [1.2, 1.3, () => {
        const alpha = getAngle();
        const pi = Math.PI;
        
        // Valeur principale
        let text = `\\[ \\alpha \\approx ${alpha.toFixed(2)} \\]`;
        return text;
    }], {
        fontSize: 14,
        color: '#f59e0b',
        useMathJax: true,
        fixed: true,
        anchorX: 'left'
    });

    // Liste des abscisses associées au point M
    board.create('text', [
        () => M.X() + 0.1, 
        () => M.Y() + 0.1, 
        () => {
            const alpha = getAngle();
            // On affiche alpha, alpha + 2pi, alpha - 2pi pour montrer la multiplicité
            return `\\begin{cases} x_0 \\approx ${alpha.toFixed(2)} \\\\ x_1 \\approx ${(alpha + 2*Math.PI).toFixed(2)} \\quad (x_0 + 2\\pi) \\\\ x_{-1} \\approx ${(alpha - 2*Math.PI).toFixed(2)} \\quad (x_0 - 2\\pi) \\end{cases}`;
        }
    ], {
        fontSize: 12,
        color: '#64748b',
        useMathJax: true,
        fixed: false // Le texte suit le point M
    });
  }
};

export default graphConfig;
