import { supabase } from '@/core/supabase/supabase.client';
import { fetchCatalog } from '@/features/profile/services/avatar.service';
import type { AvatarCatalog, DynamicFeatures } from '@/features/profile/types/avatar.types';

// ── Seeded PRNG (Mulberry32 + FNV-1a initialisation) ─────────────────────────
// Produces a deterministic sequence [0, 1) from any string seed.
function makeSeededRng(seed: string): () => number {
  // FNV-1a hash → initial 32-bit state
  let s = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    s ^= seed.charCodeAt(i);
    s = Math.imul(s, 16777619) >>> 0;
  }
  // Mulberry32
  return () => {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
}

function pickRandom<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

// ── Build DynamicFeatures from a seeded RNG ───────────────────────────────────
function buildSeedFeatures(catalog: AvatarCatalog, rng: () => number): DynamicFeatures {
  const features: DynamicFeatures = {};

  for (const meta of catalog.features) {
    if (meta.colorOnly) {
      // Color-only tab (backgroundColor, skinColor…)
      if (meta.colorOptions.length > 0) {
        features[meta.colorProp!] = [pickRandom(meta.colorOptions, rng)];
      }
      if (meta.typeProp && meta.typeOptions.length > 0) {
        features[meta.typeProp] = [pickRandom(meta.typeOptions, rng)];
      }
    } else {
      // Optional feature (beard, accessories…): 60 % chance to show
      if (meta.probProp) {
        const show = rng() < 0.6;
        features[meta.probProp] = show ? 100 : 0;
        if (!show) continue;
      }
      // Pick a random variant
      if (meta.variants.length > 0) {
        features[meta.key] = [pickRandom(meta.variants, rng)];
      }
      // Pick a random color for this variant if one exists
      if (meta.colorProp && meta.colorOptions.length > 0) {
        features[meta.colorProp] = [pickRandom(meta.colorOptions, rng)];
      }
    }
  }

  return features;
}

// ── Resolve DynamicFeatures → element DB IDs ─────────────────────────────────
function resolveElementIds(
  features:    DynamicFeatures,
  allElements: { id: number; nombre: string; id_atributo_avatar: number }[],
  atributos:   { id: number; nombre: string }[],
): number[] {
  const attrByName = new Map(atributos.map(a => [a.nombre, a]));
  const ids: number[] = [];

  for (const [key, val] of Object.entries(features)) {
    if (key.endsWith('Probability')) continue;
    const probKey = `${key}Probability`;
    if (probKey in features && (features[probKey] as number) === 0) continue;

    const attr = attrByName.get(key);
    if (!attr) continue;

    const values = Array.isArray(val) ? val : [val];
    for (const v of values) {
      if (v === null || v === undefined) continue;
      const elem = allElements.find(
        e => e.id_atributo_avatar === attr.id && e.nombre === String(v),
      );
      if (elem) ids.push(elem.id);
    }
  }

  return ids;
}

// ── Public: look up a user's DB id by email ───────────────────────────────────
export async function getUserIdByEmail(email: string): Promise<number> {
  const { data, error } = await supabase
    .from('usuario')
    .select('id')
    .eq('email', email)
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error(`Usuario con email ${email} no encontrado.`);
  return (data as { id: number }).id;
}

// ── Public: seed a brand-new user's starting avatar ──────────────────────────
// Uses the user's full name (or email as fallback) as the RNG seed so the
// starting avatar is deterministic and unique per person.
// Writes to both:
//   • usuario_avatar          — the active avatar the user sees
//   • usuario_inventario_avatar — the starter items they "own"
export async function seedStartingAvatar(
  userId: number,
  seed:   string,
): Promise<void> {
  const { catalog, allElements, atributos } = await fetchCatalog(1);

  const styleAtributos = atributos.filter(a => a.id_avatar_style === catalog.styleId);
  const rng            = makeSeededRng(seed);
  const features       = buildSeedFeatures(catalog, rng);
  const elementIds     = resolveElementIds(features, allElements, styleAtributos);

  if (elementIds.length === 0) return;

  // Save active avatar (delete any existing rows first — safe for a new user)
  const { error: delError } = await supabase
    .from('usuario_avatar')
    .delete()
    .eq('id_usuario', userId);
  if (delError) throw new Error(delError.message);

  const { error: avatarError } = await supabase
    .from('usuario_avatar')
    .insert(elementIds.map(id => ({ id_usuario: userId, id_elemento: id })));
  if (avatarError) throw new Error(avatarError.message);

  // Add the same elements to the starter inventory
  const { error: invError } = await supabase
    .from('usuario_inventario_avatar')
    .insert(
      elementIds.map(id => ({
        id_usuario:      userId,
        id_elemento:     id,
        fecha_obtencion: new Date().toISOString(),
      })),
    );
  if (invError) throw new Error(invError.message);
}
