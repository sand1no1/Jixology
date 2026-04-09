import { createAvatar } from '@dicebear/core';
import { pixelArt } from '@dicebear/collection';

import { AVATAR_STYLES, ATRIBUTOS_AVATAR, ELEMENTOS_INVENTARIO } from '../pages/Pixelartoptions';
import type { AvatarCatalog, DynamicFeatures, FeatureMeta } from '../types/avatar.types';

const SEED = 'Juan Guarnizo';

// ── UI label overrides (Spanish) ──────────────────────────────────────────────
const LABEL_OVERRIDES: Record<string, string> = {
  accessories:     'Accesorios',
  beard:           'Barba',
  clothing:        'Ropa',
  eyes:            'Ojos',
  glasses:         'Gafas',
  hair:            'Cabello',
  hat:             'Sombrero',
  mouth:           'Boca',
  backgroundColor: 'Fondo',
  skinColor:       'Piel',
};

// ── Type option labels (for the segmented toggle) ─────────────────────────────
export const TYPE_LABELS: Record<string, string> = {
  solid:          'Sólido',
  gradientLinear: 'Degradado',
};

// ── Default variant overrides (when first variant is not the desired default) ──
const DEFAULT_VARIANT_OVERRIDES: Record<string, string> = {
  accessories: 'variant01',
  clothing:    'variant22',
  beard:       'variant01',
  eyes:        'variant03',
  glasses:     'dark01',
  hair:        'long05',
  hat:         'variant02',
  mouth:       'happy03',
};

// ── Default overrides for colorOnly features ──────────────────────────────────
const DEFAULT_COLOR_OVERRIDES: Record<string, string>  = {
  backgroundColor: 'b6e3f4',
  skinColor:       'f5cfa0',
};
const DEFAULT_TYPE_OVERRIDES: Record<string, string> = {
  backgroundType: 'solid',
};

// ── Catalog builder ───────────────────────────────────────────────────────────
function buildCatalog(styleId: number): AvatarCatalog {
  const style = AVATAR_STYLES.find(s => s.id === styleId);
  if (!style) throw new Error(`Avatar style ${styleId} not found`);

  const styleAttrs = ATRIBUTOS_AVATAR.filter(a => a.id_avatar_style === styleId);
  const attrByName = new Map(styleAttrs.map(a => [a.nombre, a]));

  const getElementos = (attrNombre: string): string[] => {
    const attr = attrByName.get(attrNombre);
    if (!attr) return [];
    return ELEMENTOS_INVENTARIO
      .filter(e => e.id_atributo_avatar === attr.id)
      .map(e => e.nombre);
  };

  // Type attrs that have a matching orphan color attr — these get merged in,
  // not shown as their own tab (e.g. 'backgroundType' merges into 'backgroundColor').
  const mergedTypeAttrs = new Set(
    styleAttrs
      .filter(a => {
        if (!a.nombre.endsWith('Type')) return false;
        const matchingColor = `${a.nombre.slice(0, -4)}Color`; // 'backgroundType' → 'backgroundColor'
        const colorAttr = attrByName.get(matchingColor);
        if (!colorAttr) return false;
        const base = matchingColor.slice(0, -5); // 'backgroundColor' → 'background'
        return !attrByName.has(base); // only if color is orphan (no base variant attr)
      })
      .map(a => a.nombre)
  );

  // ── Variant features ──────────────────────────────────────────────────────
  // Attrs that are not color/probability sub-attrs and not a merged type attr.
  const variantAttrs = styleAttrs.filter(a =>
    !a.nombre.endsWith('Color') &&
    !a.nombre.endsWith('Probability') &&
    !mergedTypeAttrs.has(a.nombre)
  );

  const features: FeatureMeta[] = variantAttrs.map(attr => {
    const key      = attr.nombre;
    const colorProp = attrByName.has(`${key}Color`)       ? `${key}Color`       : undefined;
    const probProp  = attrByName.has(`${key}Probability`) ? `${key}Probability` : undefined;
    return {
      key,
      label:        LABEL_OVERRIDES[key] ?? key,
      variants:     getElementos(key),
      colorProp,
      colorOptions: colorProp ? getElementos(colorProp) : [],
      probProp,
      colorOnly:    false,
      typeProp:     undefined,
      typeOptions:  [],
    };
  });

  // ── Orphan color features ─────────────────────────────────────────────────
  // Color attrs with no matching base variant attr → standalone color-only tabs.
  const orphanColorAttrs = styleAttrs.filter(a =>
    a.nombre.endsWith('Color') &&
    !attrByName.has(a.nombre.slice(0, -5)) // e.g. 'backgroundColor' → 'background' doesn't exist
  );

  for (const colorAttr of orphanColorAttrs) {
    const key          = colorAttr.nombre;
    const typeAttrName = `${key.slice(0, -5)}Type`; // 'backgroundColor' → 'backgroundType'
    const hasType      = mergedTypeAttrs.has(typeAttrName);
    features.push({
      key,
      label:        LABEL_OVERRIDES[key] ?? key,
      variants:     [],
      colorProp:    key,
      colorOptions: getElementos(key),
      probProp:     undefined,
      colorOnly:    true,
      typeProp:     hasType ? typeAttrName : undefined,
      typeOptions:  hasType ? getElementos(typeAttrName) : [],
    });
  }

  // ── defaultFeatures ───────────────────────────────────────────────────────
  const defaultFeatures: DynamicFeatures = {};
  for (const meta of features) {
    if (meta.colorOnly) {
      if (meta.colorProp && meta.colorOptions.length > 0) {
        const defaultColor = DEFAULT_COLOR_OVERRIDES[meta.colorProp] ?? meta.colorOptions[0];
        defaultFeatures[meta.colorProp] = [defaultColor];
      }
      if (meta.typeProp && meta.typeOptions.length > 0) {
        const defaultType = DEFAULT_TYPE_OVERRIDES[meta.typeProp] ?? meta.typeOptions[0];
        defaultFeatures[meta.typeProp] = [defaultType];
      }
    } else {
      const defaultVariant = DEFAULT_VARIANT_OVERRIDES[meta.key] ?? meta.variants[0];
      if (defaultVariant) defaultFeatures[meta.key] = [defaultVariant];
      if (meta.probProp) defaultFeatures[meta.probProp] = 0;
    }
  }

  return { styleId, styleName: style.nombre, features, defaultFeatures };
}

// ── Exported catalog (built once at module load) ──────────────────────────────
export const CATALOG: AvatarCatalog = buildCatalog(1);

// ── SVG generation ────────────────────────────────────────────────────────────
export function makeAvatarSvg(features: DynamicFeatures): string {
  return createAvatar(pixelArt, { seed: SEED, ...features } as Parameters<typeof createAvatar>[1]).toString();
}

export function makeVariantTileSvg(
  base: DynamicFeatures,
  meta: FeatureMeta,
  value: string | null,
): string {
  const probOverride    = meta.probProp ? { [meta.probProp]: value === null ? 0 : 100 } : {};
  const variantOverride = value !== null ? { [meta.key]: [value] } : {};
  return makeAvatarSvg({ ...base, ...probOverride, ...variantOverride });
}

export function makeColorTileSvg(
  base: DynamicFeatures,
  meta: FeatureMeta,
  colorValue: string,
): string {
  if (!meta.colorProp) return makeAvatarSvg(base);
  const probOverride  = meta.probProp ? { [meta.probProp]: 100 } : {};
  const colorOverride = { [meta.colorProp]: [colorValue] };
  return makeAvatarSvg({ ...base, ...probOverride, ...colorOverride });
}
