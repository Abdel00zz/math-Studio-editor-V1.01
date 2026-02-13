
import { GeometryGraphConfig } from "@/types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-4, 5, 8, -4],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // Points A et B fixes pour simplifier l'exemple
    const A = board.create('point', [-2, 0], { name: 'A', fixed: true, color: '#1e293b' });
    const B = board.create('point', [2, 0], { name: 'B', fixed: true, color: '#1e293b' });
    const AB = board.create('segment', [A, B], { strokeColor: '#334155' });
    
    const I = board.create('midpoint', [A, B], { name: 'I', size: 2, color: '#94a3b8' });

    // Curseur pour k
    const kSlider = board.create('slider', [[-3, 4], [3, 4], [-20, 16, 30]], { name: 'k' });

    // Point H tel que IH = k / (2 AB)  (car 2 IM.BA = k => 2 IH * BA = k, avec vecteurs colinéaires sur l'axe x)
    // Ici A(-2,0) B(2,0) => BA a pour longueur 4 et direction -x.
    // vec(BA) = (-4, 0).
    // 2 * vec(IH) . vec(BA) = k
    // 2 * (xH - 0) * (-4) = k  => -8 xH = k => xH = -k/8
    
    const H = board.create('point', [
        () => -kSlider.Value() / 8, 
        0
    ], { name: 'H', color: '#10b981', size: 3, trace: false });

    // La ligne de niveau est la perpendiculaire à (AB) passant par H
    const locusLine = board.create('perpendicular', [AB, H], { strokeColor: '#ef4444', strokeWidth: 2 });

    board.create('text', [0.5, -2, "\\[ MA^2 - MB^2 = k \\]"], { 
        fontSize: 16, 
        color: '#ef4444', 
        useMathJax: true,
        fixed: true 
    });
    
    // Point M mobile sur la ligne pour vérifier
    const M = board.create('glider', [0, 3, locusLine], { name: 'M', color: '#ef4444' });
    board.create('segment', [M, A], { strokeColor: '#94a3b8', dash: 2 });
    board.create('segment', [M, B], { strokeColor: '#94a3b8', dash: 2 });
  }
};

export default graphConfig;
