import { createAvatar } from '@dicebear/core';
import { pixelArt } from '@dicebear/collection';

import type {
  AvatarCatalog,
  AvatarStyle,
  AtributoAvatar,
  ElementoInventarioAvatar,
  DynamicFeatures,
  FeatureMeta,
} from '../types/avatar.types';

const SEED = 'Juan Guarnizo';

// ── Type option display labels ────────────────────────────────────────────────
export const TYPE_LABELS: Record<string, string> = {
  solid:          'Sólido',
  gradientLinear: 'Degradado',
};

// ── Default overrides (applied when catalog default is not the desired pick) ──
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

const DEFAULT_COLOR_OVERRIDES: Record<string, string> = {
  backgroundColor: 'b6e3f4',
  skinColor:       'f5cfa0',
};

const DEFAULT_TYPE_OVERRIDES: Record<string, string> = {
  backgroundType: 'solid',
};

// ── Module-level cache — fetched once per session ─────────────────────────────
let catalogCache: AvatarCatalog | null = null;

// ── Catalog builder ───────────────────────────────────────────────────────────
function buildCatalogFromData(
  styles:    AvatarStyle[],
  atributos: AtributoAvatar[],
  elementos: ElementoInventarioAvatar[],
  styleId:   number,
): AvatarCatalog {
  const style = styles.find(s => s.id === styleId);
  if (!style) throw new Error(`Avatar style ${styleId} not found`);

  const styleAttrs = atributos.filter(a => a.id_avatar_style === styleId);
  const attrByName = new Map(styleAttrs.map(a => [a.nombre, a]));

  const getElementNames = (attrNombre: string): string[] => {
    const attr = attrByName.get(attrNombre);
    if (!attr) return [];
    return elementos.filter(e => e.id_atributo_avatar === attr.id).map(e => e.nombre);
  };

  // Type attrs that merge into their matching Color tab
  const mergedTypeAttrs = new Set(
    styleAttrs
      .filter(a => {
        if (!a.nombre.endsWith('Type')) return false;
        const matchingColor = `${a.nombre.slice(0, -4)}Color`;
        const colorAttr = attrByName.get(matchingColor);
        if (!colorAttr) return false;
        const base = matchingColor.slice(0, -5);
        return !attrByName.has(base);
      })
      .map(a => a.nombre)
  );

  // Variant features (hair, clothing, eyes…)
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
      label:        attr.nombre_es ?? attr.nombre,
      variants:     getElementNames(key),
      colorProp,
      colorOptions: colorProp ? getElementNames(colorProp) : [],
      probProp,
      colorOnly:    false,
      typeProp:     undefined,
      typeOptions:  [],
    };
  });

  // Orphan color features (backgroundColor, skinColor…)
  const orphanColorAttrs = styleAttrs.filter(a =>
    a.nombre.endsWith('Color') &&
    !attrByName.has(a.nombre.slice(0, -5))
  );

  for (const colorAttr of orphanColorAttrs) {
    const key          = colorAttr.nombre;
    const typeAttrName = `${key.slice(0, -5)}Type`;
    const hasType      = mergedTypeAttrs.has(typeAttrName);
    features.push({
      key,
      label:        colorAttr.nombre_es ?? colorAttr.nombre,
      variants:     [],
      colorProp:    key,
      colorOptions: getElementNames(key),
      probProp:     undefined,
      colorOnly:    true,
      typeProp:     hasType ? typeAttrName : undefined,
      typeOptions:  hasType ? getElementNames(typeAttrName) : [],
    });
  }

  // Build defaultFeatures
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
      if (meta.probProp)  defaultFeatures[meta.probProp] = 0;
    }
  }

  return { styleId, styleName: style.nombre, features, defaultFeatures };
}

// ── Public fetch (cached) ─────────────────────────────────────────────────────
export async function fetchCatalog(styleId = 1): Promise<AvatarCatalog> {
  if (catalogCache) return catalogCache;

  const { supabase } = await import('../../../core/supabase/supabase.client');

  const [stylesRes, atributosRes, elementosRes] = await Promise.all([
    supabase.from('avatar_style').select('id, nombre'),
    supabase.from('atributo_avatar').select('id, nombre, nombre_es, id_avatar_style'),
    supabase.from('elemento_inventario_avatar').select('id, nombre, nombre_es, id_atributo_avatar'),
  ]);

  if (stylesRes.error || atributosRes.error || elementosRes.error) {
    throw new Error(
      stylesRes.error?.message ??
      atributosRes.error?.message ??
      elementosRes.error?.message ??
      'Failed to fetch avatar catalog'
    );
  }

  catalogCache = buildCatalogFromData(
    stylesRes.data    as AvatarStyle[],
    atributosRes.data as AtributoAvatar[],
    elementosRes.data as ElementoInventarioAvatar[],
    styleId,
  );

  return catalogCache;
}

// ── SVG generation ────────────────────────────────────────────────────────────
export function makeAvatarSvg(features: DynamicFeatures): string {
  return createAvatar(pixelArt, { seed: SEED, ...features } as Parameters<typeof createAvatar>[1]).toString();
}

export function makeVariantTileSvg(
  base:  DynamicFeatures,
  meta:  FeatureMeta,
  value: string | null,
): string {
  const probOverride    = meta.probProp ? { [meta.probProp]: value === null ? 0 : 100 } : {};
  const variantOverride = value !== null ? { [meta.key]: [value] } : {};
  return makeAvatarSvg({ ...base, ...probOverride, ...variantOverride });
}

export function makeColorTileSvg(
  base:       DynamicFeatures,
  meta:       FeatureMeta,
  colorValue: string,
): string {
  if (!meta.colorProp) return makeAvatarSvg(base);
  const probOverride  = meta.probProp ? { [meta.probProp]: 100 } : {};
  const colorOverride = { [meta.colorProp]: [colorValue] };
  return makeAvatarSvg({ ...base, ...probOverride, ...colorOverride });
}
