/**
 * Définition formelle : lim(x→x₀) f(x) = ℓ
 * 
 * Exemple : lim(x→2) (3x - 1) = 5
 * ∀ε > 0, ∃α > 0 : 0 < |x - x₀| < α ⟹ |f(x) - ℓ| < ε
 * On choisit α = ε/3
 */
import type { GeometryGraphConfig } from '@/types';

const config: GeometryGraphConfig = {
    type: 'geometry',
    boundingBox: [-1, 9, 5.5, -1],
    showAxis: true,
    showGrid: true,
    keepAspectRatio: false,
    
    init: (board) => {
        // Fonction f(x) = 3x - 1 (exemple)
        const f = (x: number) => 3 * x - 1;
        
        // Point x₀ = 2, ℓ = 5
        const x0 = 2;
        const ell = 5;
        
        // Courbe de f
        board.create('functiongraph', [f, -0.5, 5.5], {
            strokeColor: '#3b82f6',
            strokeWidth: 2.5,
            highlight: false
        });
        
        // Curseur ε (epsilon)
        const epsSlider = board.create('slider', [
            [0.5, 8.2], [2.8, 8.2], [0.1, 0.4, 1.0]
        ], {
            name: 'ε',
            snapWidth: 0.05,
            strokeColor: '#ef4444',
            fillColor: '#ef4444',
            label: { fontSize: 18, offset: [-5, -18] },
            highline: { strokeColor: '#ef4444' },
            baseline: { strokeColor: '#e5e7eb' }
        });
        
        // α = ε/3 (comme démontré dans l'exemple)
        const getAlpha = () => epsSlider.Value() / 3;
        
        // Point (x₀, ℓ) sur la courbe
        board.create('point', [x0, ell], {
            name: '',
            size: 3,
            fillColor: '#3b82f6',
            strokeColor: '#1e40af',
            fixed: true
        });
        
        // === BANDE HORIZONTALE ℓ ± ε ===
        board.create('polygon', [
            [-0.5, () => ell - epsSlider.Value()],
            [5.5, () => ell - epsSlider.Value()],
            [5.5, () => ell + epsSlider.Value()],
            [-0.5, () => ell + epsSlider.Value()]
        ], {
            fillColor: '#fecaca',
            fillOpacity: 0.3,
            borders: { strokeWidth: 0 },
            vertices: { visible: false }
        });
        
        // === BANDE VERTICALE x₀ ± α ===
        board.create('polygon', [
            [() => x0 - getAlpha(), -0.5],
            [() => x0 + getAlpha(), -0.5],
            [() => x0 + getAlpha(), 4.5],
            [() => x0 - getAlpha(), 4.5]
        ], {
            fillColor: '#bbf7d0',
            fillOpacity: 0.3,
            borders: { strokeWidth: 0 },
            vertices: { visible: false }
        });
        
        // Lignes ℓ + ε et ℓ - ε
        board.create('line', [[0, () => ell + epsSlider.Value()], [1, () => ell + epsSlider.Value()]], {
            strokeColor: '#ef4444', strokeWidth: 1, dash: 2, fixed: true
        });
        board.create('line', [[0, () => ell - epsSlider.Value()], [1, () => ell - epsSlider.Value()]], {
            strokeColor: '#ef4444', strokeWidth: 1, dash: 2, fixed: true
        });
        
        // Lignes x₀ + α et x₀ - α
        board.create('line', [[() => x0 + getAlpha(), 0], [() => x0 + getAlpha(), 1]], {
            strokeColor: '#22c55e', strokeWidth: 1, dash: 2, fixed: true
        });
        board.create('line', [[() => x0 - getAlpha(), 0], [() => x0 - getAlpha(), 1]], {
            strokeColor: '#22c55e', strokeWidth: 1, dash: 2, fixed: true
        });
        
        // Ligne horizontale y = ℓ
        board.create('line', [[0, ell], [1, ell]], {
            strokeColor: '#3b82f6', strokeWidth: 1, dash: 3, fixed: true
        });
        
        // Ligne verticale x = x₀
        board.create('line', [[x0, 0], [x0, 1]], {
            strokeColor: '#64748b', strokeWidth: 1, dash: 3, fixed: true
        });
        
        // === LABELS ===
        board.create('text', [-0.6, ell, '\\(\\ell\\)'], {
            fontSize: 16, color: '#3b82f6', useMathJax: true, fixed: true
        });
        
        // Points x₀ et α sur l'axe X avec labels
        board.create('point', [x0, 0], {
            name: '',
            size: 3,
            fillColor: '#64748b',
            strokeColor: '#475569',
            fixed: true,
            label: { visible: false }
        });
        board.create('text', [x0, -0.55, '\\(x_0\\)'], {
            fontSize: 18, color: '#64748b', useMathJax: true, anchorX: 'middle', fixed: true
        });
        
        board.create('point', [() => x0 - getAlpha(), 0], {
            name: '',
            size: 2.5,
            fillColor: '#22c55e',
            strokeColor: '#16a34a',
            fixed: true,
            label: { visible: false }
        });
        board.create('text', [() => x0 - getAlpha(), -0.55, '\\(x_0\\!-\\!\\alpha\\)'], {
            fontSize: 17, color: '#22c55e', useMathJax: true, anchorX: 'middle', fixed: true
        });
        
        board.create('point', [() => x0 + getAlpha(), 0], {
            name: '',
            size: 2.5,
            fillColor: '#22c55e',
            strokeColor: '#16a34a',
            fixed: true,
            label: { visible: false }
        });
        board.create('text', [() => x0 + getAlpha(), -0.55, '\\(x_0\\!+\\!\\alpha\\)'], {
            fontSize: 17, color: '#22c55e', useMathJax: true, anchorX: 'middle', fixed: true
        });
        
        board.create('text', [5, () => ell + epsSlider.Value() + 0.12, '\\(\\ell + \\varepsilon\\)'], {
            fontSize: 14, color: '#ef4444', useMathJax: true, fixed: true
        });
        
        board.create('text', [5, () => ell - epsSlider.Value() - 0.18, '\\(\\ell - \\varepsilon\\)'], {
            fontSize: 14, color: '#ef4444', useMathJax: true, fixed: true
        });
    }
};

export default config;
