// ── DB user avatar types ──────────────────────────────────────────────────────
export interface UserInventoryItem {
  id_usuario: number;
  id_elemento: number;
}

export interface UserAvatarItem {
  id_usuario: number;
  id_elemento: number;
}

// ── DB catalog types ─────────────────────────────────────────────────────────
export interface AvatarStyle {
  id: number;
  nombre: string;
}

export interface AtributoAvatar {
  id: number;
  nombre: string;
  nombre_es: string | null;
  id_avatar_style: number;
}

export interface ElementoInventarioAvatar {
  id: number;
  nombre: string;
  nombre_es: string | null;
  id_atributo_avatar: number;
}

// ── Runtime types ─────────────────────────────────────────────────────────────

/** The features state object passed to DiceBear — fully dynamic, no hardcoded keys. */
export type DynamicFeatures = Record<string, unknown>;

/** Describes one user-facing tab feature derived from the catalog. */
export interface FeatureMeta {
  /** Attribute nombre — used as the DiceBear option key (e.g. 'hair'). */
  key:          string;
  /** Display label (Spanish override or fallback to key). */
  label:        string;
  /** Ordered list of variant names. Empty for color-only features. */
  variants:     string[];
  /** Nombre of the corresponding color attribute (e.g. 'hairColor'), or undefined. */
  colorProp:    string | undefined;
  /** Color option values for colorProp; empty array when colorProp is absent. */
  colorOptions: string[];
  /** Nombre of the corresponding probability attribute, or undefined. */
  probProp:     string | undefined;
  /**
   * True when this feature has no variant tiles — only color swatches are shown.
   * Used for standalone color attributes like backgroundColor and skinColor.
   */
  colorOnly:    boolean;
  /**
   * Nombre of a type-modifier attribute merged into this tab (e.g. 'backgroundType').
   * Rendered as a segmented toggle above the color swatches.
   */
  typeProp:     string | undefined;
  /** Option values for typeProp (e.g. ['solid', 'gradientLinear']). */
  typeOptions:  string[];
}

/** The full derived catalog for one avatar style. */
export interface AvatarCatalog {
  styleId:         number;
  styleName:       string;
  /** Ordered array of FeatureMeta for every user-facing tab. */
  features:        FeatureMeta[];
  /** A valid DynamicFeatures object ready to seed initial state. */
  defaultFeatures: DynamicFeatures;
}
