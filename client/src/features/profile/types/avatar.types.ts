export type ProbKey  = 'accessoriesProbability' | 'beardProbability' | 'glassesProbability' | 'hatProbability';
export type ColorKey = 'accessoriesColor' | 'clothingColor' | 'eyesColor' | 'glassesColor' | 'hairColor' | 'hatColor' | 'mouthColor';

export interface FeatureVariants {
  accessories: string[];
  beard:       string[];
  clothing:    string[];
  eyes:        string[];
  glasses:     string[];
  hair:        string[];
  hat:         string[];
  mouth:       string[];
}

export type FeatureProbabilities = Partial<Record<ProbKey,  number>>;
export type FeatureColors        = Partial<Record<ColorKey, string[]>>;

export type AvatarFeatures = FeatureVariants & FeatureProbabilities & FeatureColors;

export type FeatureKey = 'accessories' | 'beard' | 'clothing' | 'eyes' | 'glasses' | 'hair' | 'hat' | 'mouth';
