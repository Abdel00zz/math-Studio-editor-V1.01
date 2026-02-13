/**
 * graphHelpers.ts - Utilitaires réutilisables pour les configurations de graphes
 * 
 * Ce module fournit des helpers intelligents pour :
 * - Contraindre les points dans les limites du graphe
 * - Calculer des barycentres de façon sécurisée
 * - Gérer les cas limites (division par zéro, valeurs infinies)
 * - **NOUVEAU** : Positionner les textes/formules de façon adaptative
 * 
 * USAGE:
 * import { createBounds, safeBaryCoord } from '../../shared/graphHelpers';
 */

// --- TYPES ---
export interface BoundsConfig {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface ClampOptions {
  padding?: number;
  fallback?: number;
}

// Position prédéfinies pour les formules
export type TextPosition = 
  | 'top-left' | 'top-center' | 'top-right'
  | 'center-left' | 'center' | 'center-right'  
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

// --- BOUNDS FACTORY ---

/**
 * Crée un objet bounds avec des méthodes de clamping intégrées.
 * Solution centralisée pour définir et utiliser les limites d'un graphe.
 * 
 * @example
 * const bounds = createBounds({ left: -5, top: 6, right: 10, bottom: -4 });
 * const x = bounds.clampX(calculatedX); // Toujours dans les limites
 * const pos = bounds.textPosition('top-center'); // {x: 2.5, y: 5.5}
 */
export const createBounds = (config: BoundsConfig) => {
  const { left, top, right, bottom } = config;
  
  // Marges de sécurité pour les textes (évite le clipping)
  const TEXT_MARGIN_X = 0.3;
  const TEXT_MARGIN_Y = 0.5;
  
  // Zone sûre pour les textes (à l'intérieur du boundingBox)
  const safeLeft = left + TEXT_MARGIN_X;
  const safeRight = right - TEXT_MARGIN_X;
  const safeTop = top - TEXT_MARGIN_Y;
  const safeBottom = bottom + TEXT_MARGIN_Y;
  
  return {
    // Raw bounds
    left,
    top,
    right,
    bottom,
    
    // As JSXGraph boundingBox array
    toBoundingBox: (): [number, number, number, number] => [left, top, right, bottom],
    
    // Clamp functions with optional padding
    clampX: (x: number, padding = 0.5): number => 
      Math.max(left + padding, Math.min(right - padding, x)),
    
    clampY: (y: number, padding = 0.5): number => 
      Math.max(bottom + padding, Math.min(top - padding, y)),
    
    // Check if a point is within bounds
    isInBounds: (x: number, y: number, padding = 0): boolean => 
      x >= left + padding && x <= right - padding &&
      y >= bottom + padding && y <= top - padding,
    
    // Get center of bounds
    center: (): { x: number; y: number } => ({
      x: (left + right) / 2,
      y: (top + bottom) / 2,
    }),
    
    // Get dimensions
    width: (): number => right - left,
    height: (): number => top - bottom,
    
    // --- NOUVEAU : POSITIONNEMENT INTELLIGENT DES TEXTES ---
    
    /**
     * Retourne les coordonnées pour une position prédéfinie de texte.
     * Les positions sont calculées à l'intérieur de la zone sûre.
     */
    textPosition: (position: TextPosition): { x: number; y: number } => {
      const positions: Record<TextPosition, { x: number; y: number }> = {
        'top-left':      { x: safeLeft, y: safeTop },
        'top-center':    { x: (left + right) / 2, y: safeTop },
        'top-right':     { x: safeRight, y: safeTop },
        'center-left':   { x: safeLeft, y: (top + bottom) / 2 },
        'center':        { x: (left + right) / 2, y: (top + bottom) / 2 },
        'center-right':  { x: safeRight, y: (top + bottom) / 2 },
        'bottom-left':   { x: safeLeft, y: safeBottom },
        'bottom-center': { x: (left + right) / 2, y: safeBottom },
        'bottom-right':  { x: safeRight, y: safeBottom },
      };
      return positions[position];
    },
    
    /**
     * Retourne une position Y sûre pour une formule en haut du graphe.
     * Laisse de l'espace pour le rendu MathJax.
     */
    formulaY: (fromTop = 0.8): number => safeTop - fromTop,
    
    /**
     * Retourne une position Y sûre pour une légende en bas du graphe.
     */
    captionY: (fromBottom = 0.3): number => safeBottom + fromBottom,
  };
};

// --- SAFE COORDINATE CALCULATORS ---

/**
 * Calcule une coordonnée de barycentre de façon sécurisée.
 * Retourne NaN si la somme des poids est proche de zéro.
 * Optionnellement contraint le résultat dans des limites.
 * 
 * @param points - Points avec getters X() et Y()
 * @param weights - Poids avec getter Value()
 * @param axis - 'x' ou 'y'
 * @param clamp - Fonction de clamping optionnelle
 */
export const safeBaryCoord = (
  points: Array<{ X: () => number; Y: () => number }>,
  weights: Array<{ Value: () => number }>,
  axis: 'x' | 'y',
  clamp?: (val: number) => number
): (() => number) => {
  return () => {
    const sum = weights.reduce((acc, w) => acc + w.Value(), 0);
    
    // Cas critique: somme nulle → pas de barycentre
    if (Math.abs(sum) < 0.001) return NaN;
    
    const coord = points.reduce((acc, p, i) => {
      const val = axis === 'x' ? p.X() : p.Y();
      return acc + weights[i].Value() * val;
    }, 0) / sum;
    
    // Valeur non finie → masquer le point
    if (!Number.isFinite(coord)) return NaN;
    
    // Appliquer le clamping si fourni
    return clamp ? clamp(coord) : coord;
  };
};

/**
 * Version simplifiée pour 2 points (cas le plus courant).
 */
export const safeBary2Coord = (
  pA: { X: () => number; Y: () => number },
  pB: { X: () => number; Y: () => number },
  wA: { Value: () => number },
  wB: { Value: () => number },
  axis: 'x' | 'y',
  clamp?: (val: number) => number
): (() => number) => {
  return safeBaryCoord([pA, pB], [wA, wB], axis, clamp);
};

/**
 * Version simplifiée pour 3 points (triangle).
 */
export const safeBary3Coord = (
  pA: { X: () => number; Y: () => number },
  pB: { X: () => number; Y: () => number },
  pC: { X: () => number; Y: () => number },
  wA: { Value: () => number },
  wB: { Value: () => number },
  wC: { Value: () => number },
  axis: 'x' | 'y',
  clamp?: (val: number) => number
): (() => number) => {
  return safeBaryCoord([pA, pB, pC], [wA, wB, wC], axis, clamp);
};

// --- DISPLAY HELPERS ---

/**
 * Formatte un nombre pour affichage dans le graphe.
 * Évite les affichages comme "-0" ou les très petits nombres.
 */
export const formatValue = (val: number, decimals = 1): string => {
  if (Math.abs(val) < 0.01) return '0';
  return val.toFixed(decimals);
};

/**
 * Génère un texte LaTeX pour la relation vectorielle du barycentre.
 * Gère le cas α + β = 0.
 */
export const baryVectorText = (
  alpha: { Value: () => number },
  beta: { Value: () => number },
  opts?: { 
    noBarycenterText?: string;
    vectorNames?: [string, string];
  }
): (() => string) => {
  const noBarycenter = opts?.noBarycenterText ?? "\\alpha + \\beta = 0 \\text{ : Pas de barycentre !}";
  const [vA, vB] = opts?.vectorNames ?? ['\\overrightarrow{GA}', '\\overrightarrow{GB}'];
  
  return () => {
    const a = alpha.Value();
    const b = beta.Value();
    const sum = a + b;
    
    if (Math.abs(sum) < 0.001) {
      return `\\[ ${noBarycenter} \\]`;
    }
    
    return `\\[ ${formatValue(a)}${vA} + ${formatValue(b)}${vB} = \\vec{0} \\]`;
  };
};

// --- GEOMETRY HELPERS ---

/**
 * Calcule le milieu de deux points (isobarycentre).
 */
export const midpoint = (
  p1: { X: () => number; Y: () => number },
  p2: { X: () => number; Y: () => number }
): { x: () => number; y: () => number } => ({
  x: () => (p1.X() + p2.X()) / 2,
  y: () => (p1.Y() + p2.Y()) / 2,
});

/**
 * Calcule le centre de gravité d'un triangle.
 */
export const centroid = (
  p1: { X: () => number; Y: () => number },
  p2: { X: () => number; Y: () => number },
  p3: { X: () => number; Y: () => number }
): { x: () => number; y: () => number } => ({
  x: () => (p1.X() + p2.X() + p3.X()) / 3,
  y: () => (p1.Y() + p2.Y() + p3.Y()) / 3,
});

/**
 * Calcule le centre d'un quadrilatère.
 */
export const quadCenter = (
  p1: { X: () => number; Y: () => number },
  p2: { X: () => number; Y: () => number },
  p3: { X: () => number; Y: () => number },
  p4: { X: () => number; Y: () => number }
): { x: () => number; y: () => number } => ({
  x: () => (p1.X() + p2.X() + p3.X() + p4.X()) / 4,
  y: () => (p1.Y() + p2.Y() + p3.Y() + p4.Y()) / 4,
});

// --- DEFAULT EXPORTS ---
export default {
  createBounds,
  safeBaryCoord,
  safeBary2Coord,
  safeBary3Coord,
  formatValue,
  baryVectorText,
  midpoint,
  centroid,
  quadCenter,
};
