import { useMemo, useState } from 'react';

import { CATALOG, makeAvatarSvg } from '../services/avatar.service';
import type { DynamicFeatures, FeatureMeta } from '../types/avatar.types';

export function useAvatarFeatures() {
  const [features, setFeatures] = useState<DynamicFeatures>(CATALOG.defaultFeatures);

  const mainAvatarSvg = useMemo(() => makeAvatarSvg(features), [features]);

  const handleSelectVariant = (meta: FeatureMeta, value: string | null) => {
    setFeatures((prev) => ({
      ...prev,
      [meta.key]: value !== null ? [value] : prev[meta.key],
      ...(meta.probProp ? { [meta.probProp]: value === null ? 0 : 100 } : {}),
    }));
  };

  const handleSelectColor = (meta: FeatureMeta, colorValue: string) => {
    if (!meta.colorProp) return;
    setFeatures((prev) => {
      // Gradient mode requires 2 colors — toggle in/out of the selection (max 2)
      const isGradient =
        meta.typeProp &&
        (prev[meta.typeProp] as string[])?.[0] === 'gradientLinear';

      if (isGradient) {
        const current = (prev[meta.colorProp!] as string[]) ?? [];
        let next: string[];
        if (current.includes(colorValue)) {
          // Deselect — keep at least 1 color
          next = current.filter(c => c !== colorValue);
          if (next.length === 0) next = [colorValue];
        } else if (current.length < 2) {
          next = [...current, colorValue];
        } else {
          // Already 2 selected — replace the first, shift second to first
          next = [current[1], colorValue];
        }
        return { ...prev, [meta.colorProp!]: next };
      }

      return {
        ...prev,
        [meta.colorProp!]: [colorValue],
        ...(meta.probProp ? { [meta.probProp]: 100 } : {}),
      };
    });
  };

  const handleSelectType = (meta: FeatureMeta, typeValue: string) => {
    if (!meta.typeProp) return;
    setFeatures((prev) => ({ ...prev, [meta.typeProp!]: [typeValue] }));
  };

  return { features, mainAvatarSvg, handleSelectVariant, handleSelectColor, handleSelectType };
}
