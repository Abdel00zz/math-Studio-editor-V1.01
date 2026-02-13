/**
 * Définition formelle : lim(x→x₀⁺) f(x) = +∞
 * 
 * Exemple : lim(x→0⁺) 1/x = +∞
 * ∀A > 0, ∃α > 0 : 0 < x < α ⟹ f(x) > A
 * On choisit α = 1/A
 */
import type { GeometryGraphConfig } from '@/types';

const config: GeometryGraphConfig = {
    type: 'geometry',
    boundingBox: [-0.5, 12, 4.5, -0.8],
    showAxis: true,
    showGrid: true,
    keepAspectRatio: false,
    
    init: (board) => {
        // Point x₀ = 0 (asymptote verticale)
        const x0 = 0;
        
        // Fonction f(x) = 1/x (exemple, branche droite uniquement)
        const f = (x: number) => {
            return x <= 0.05 ? NaN : 1 / x;
        };
        
        // Courbe (branche droite seulement)
        board.create('functiongraph', [f, 0.05, 4], {
            strokeColor: '#8b5cf6', strokeWidth: 2.5, highlight: false
        });
        
        // Curseur A
        const ASlider = board.create('slider', [
            [0.3, 11.2], [2.2, 11.2], [1, 4, 9]
        ], {
            name: 'A',
            snapWidth: 0.5,
            strokeColor: '#8b5cf6',
            fillColor: '#8b5cf6',
            label: { fontSize: 18, offset: [-5, -18] },
            highline: { strokeColor: '#8b5cf6' },
            baseline: { strokeColor: '#e5e7eb' }
        });
        
        // α = 1/A (comme démontré dans l'exemple : 1/x > A ⟺ x < 1/A)
        const getAlpha = () => 1 / ASlider.Value();
        
        // === ZONE f(x) > A ===
        board.create('polygon', [
            [-0.3, () => ASlider.Value()],
            [4, () => ASlider.Value()],
            [4, 12],
            [-0.3, 12]
        ], {
            fillColor: '#ddd6fe',
            fillOpacity: 0.3,
            borders: { strokeWidth: 0 },
            vertices: { visible: false }
        });
        
        // === BANDE 0 < x < α (limite à droite) ===
        board.create('polygon', [
            [x0, -0.5],
            [() => x0 + getAlpha(), -0.5],
            [() => x0 + getAlpha(), 12],
            [x0, 12]
        ], {
            fillColor: '#bbf7d0',
            fillOpacity: 0.3,
            borders: { strokeWidth: 0 },
            vertices: { visible: false }
        });
        
        // Ligne y = A
        board.create('line', [[0, () => ASlider.Value()], [1, () => ASlider.Value()]], {
            strokeColor: '#8b5cf6', strokeWidth: 1.5, dash: 2, fixed: true
        });
        
        // Asymptote verticale x = x₀
        board.create('line', [[x0, 0], [x0, 1]], {
            strokeColor: '#94a3b8', strokeWidth: 1, dash: 3, fixed: true
        });
        
        // Ligne x = α
        board.create('line', [[() => x0 + getAlpha(), 0], [() => x0 + getAlpha(), 1]], {
            strokeColor: '#22c55e', strokeWidth: 1, dash: 2, fixed: true
        });
        
        // Point d'intersection
        board.create('point', [() => x0 + getAlpha(), () => ASlider.Value()], {
            name: '', size: 2, fillColor: '#8b5cf6', strokeColor: '#6d28d9', fixed: true
        });
        
        // === LABELS ===
        // Point 0 sur l'axe
        board.create('point', [x0, 0], {
            name: '',
            size: 3,
            fillColor: '#64748b',
            strokeColor: '#475569',
            fixed: true,
            label: { visible: false }
        });
        board.create('text', [x0, -0.5, '\\(0\\)'], {
            fontSize: 18, color: '#64748b', useMathJax: true, anchorX: 'middle', fixed: true
        });
        
        // Point α sur l'axe
        board.create('point', [() => x0 + getAlpha(), 0], {
            name: '',
            size: 2.5,
            fillColor: '#22c55e',
            strokeColor: '#16a34a',
            fixed: true,
            label: { visible: false }
        });
        board.create('text', [() => x0 + getAlpha(), -0.5, '\\(\\alpha\\)'], {
            fontSize: 17, color: '#22c55e', useMathJax: true, anchorX: 'middle', fixed: true
        });
        
        board.create('text', [-0.35, () => ASlider.Value(), '\\(A\\)'], {
            fontSize: 16, color: '#8b5cf6', useMathJax: true, fixed: true
        });
        
        // Symbole +∞
        board.create('text', [x0 + 0.2, 10.5, '\\(+\\infty\\)'], {
            fontSize: 14, color: '#8b5cf6', useMathJax: true
        });
    }
};

export default config;
