import { createAvatar } from '@dicebear/core';
import { pixelArt } from '@dicebear/collection';

import {
  accessories,   accessoriesColor,
  beard,
  clothing,      clothingColor,
  eyes,          eyesColor,
  glasses,       glassesColor,
  hair,          hairColor,
  hat,           hatColor,
  mouth,         mouthColor,
} from '../pages/Pixelartoptions';

import type { AvatarFeatures, ColorKey, FeatureColors, FeatureKey, FeatureProbabilities, FeatureVariants, ProbKey } from '../types/avatar.types';

const SEED = 'Juan Guarnizo';

export const OPTIONS = { accessories, beard, clothing, eyes, glasses, hair, hat, mouth } as const;

export const TAB_LABELS: Record<FeatureKey, string> = {
  accessories: 'Accesorios',
  beard:       'Barba',
  clothing:    'Ropa',
  eyes:        'Ojos',
  glasses:     'Gafas',
  hair:        'Cabello',
  hat:         'Sombrero',
  mouth:       'Boca',
};

export const PROB_PROP: Partial<Record<FeatureKey, ProbKey>> = {
  accessories: 'accessoriesProbability',
  beard:       'beardProbability',
  glasses:     'glassesProbability',
  hat:         'hatProbability',
};

export const COLOR_META: Partial<Record<FeatureKey, { prop: ColorKey; options: string[] }>> = {
  accessories: { prop: 'accessoriesColor', options: accessoriesColor },
  clothing:    { prop: 'clothingColor',    options: clothingColor    },
  eyes:        { prop: 'eyesColor',        options: eyesColor        },
  glasses:     { prop: 'glassesColor',     options: glassesColor     },
  hair:        { prop: 'hairColor',        options: hairColor        },
  hat:         { prop: 'hatColor',         options: hatColor         },
  mouth:       { prop: 'mouthColor',       options: mouthColor       },
};

export const DEFAULT_FEATURES: AvatarFeatures = {
  accessories:            ['variant01'],
  clothing:               ['variant22'],
  beard:                  ['variant01'],
  eyes:                   ['variant03'],
  glasses:                ['dark01'],
  hair:                   ['long05'],
  hat:                    ['variant02'],
  mouth:                  ['happy03'],
  accessoriesProbability: 0,
  beardProbability:       0,
  glassesProbability:     0,
  hatProbability:         0,
};

export function makeAvatarSvg(features: AvatarFeatures): string {
  const opts: Record<string, unknown> = { seed: SEED, ...features };
  return createAvatar(pixelArt, opts as Parameters<typeof createAvatar>[1]).toString();
}

export function makeVariantTileSvg(base: AvatarFeatures, feature: FeatureKey, value: string | null): string {
  const probKey = PROB_PROP[feature];
  const probOverride: FeatureProbabilities = probKey ? { [probKey]: value === null ? 0 : 100 } : {};
  const variantOverride: Partial<FeatureVariants> = value !== null ? { [feature]: [value] } : {};
  return makeAvatarSvg({ ...base, ...probOverride, ...variantOverride });
}

export function makeColorTileSvg(base: AvatarFeatures, feature: FeatureKey, colorValue: string): string {
  const colorMeta = COLOR_META[feature];
  if (!colorMeta) return makeAvatarSvg(base);
  const probKey = PROB_PROP[feature];
  const probOverride: FeatureProbabilities = probKey ? { [probKey]: 100 } : {};
  const colorOverride: FeatureColors = { [colorMeta.prop]: [colorValue] };
  return makeAvatarSvg({ ...base, ...probOverride, ...colorOverride });
}
