import { useMemo, useState } from 'react';

import { DEFAULT_FEATURES, makeAvatarSvg, PROB_PROP, COLOR_META } from '../services/avatar.service';
import type { AvatarFeatures, ColorKey, FeatureKey } from '../types/avatar.types';

export function useAvatarFeatures() {
  const [features, setFeatures] = useState<AvatarFeatures>(DEFAULT_FEATURES);

  const mainAvatarSvg = useMemo(() => makeAvatarSvg(features), [features]);

  const handleSelectVariant = (feature: FeatureKey, value: string | null) => {
    const probKey = PROB_PROP[feature];
    setFeatures((prev) => ({
      ...prev,
      [feature]: value !== null ? [value] : prev[feature],
      ...(probKey ? { [probKey]: value === null ? 0 : 100 } : {}),
    }));
  };

  const handleSelectColor = (feature: FeatureKey, colorProp: ColorKey, colorValue: string) => {
    const probKey = PROB_PROP[feature];
    setFeatures((prev) => ({
      ...prev,
      [colorProp]: [colorValue],
      ...(probKey ? { [probKey]: 100 } : {}),
    }));
  };

  return { features, mainAvatarSvg, handleSelectVariant, handleSelectColor };
}
