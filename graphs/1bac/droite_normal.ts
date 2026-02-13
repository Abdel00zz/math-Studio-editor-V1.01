
import { GeometryGraphConfig } from "../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-5, 5, 5, -5],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // Point A de passage
    const A = board.create('point', [1, 1], { name: 'A', color: '#1e293b' });
    
    // Vecteur normal n (contrôlé par un point N)
    const N = board.create('point', [3, 2], { name: 'n', color: '#ef4444' });
    const vecN = board.create('arrow', [A, N], { strokeColor: '#ef4444', strokeWidth: 3 });
    board.create('text', [() => (A.X()+N.X())/2, () => (A.Y()+N.Y())/2, "\\[ \\vec{n} \\]"], {
        color: '#ef4444',
        useMathJax: true,
        fixed: false
    });
    
    // Droite perpendiculaire à (AN) passant par A
    board.create('perpendicular', [vecN, A], { strokeColor: '#3b82f6', strokeWidth: 2 });

    // Textes explicatifs en LaTeX
    board.create('text', [-4, 4, "\\[ A \\in (D) \\]"], { 
      color: '#3b82f6', 
      useMathJax: true, 
      fixed: true 
    });
    board.create('text', [-4, 3.5, "\\[ (D) \\perp \\vec{n} \\]"], { 
      color: '#ef4444', 
      useMathJax: true, 
      fixed: true 
    });
    
    // Marqueur d'angle droit (approximation visuelle par un petit polygone ou juste le symbole perpendiculaire suffit avec le texte)
    // Ici on laisse le texte explicite.
  }
};

export default graphConfig;
