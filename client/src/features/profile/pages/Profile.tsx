import React, { useMemo, useState } from 'react';
import { createAvatar } from '@dicebear/core';
import { pixelArt } from '@dicebear/collection';
import './Profile.css';

import {
  accessories,   accessoriesColor,
  beard,
  clothing,      clothingColor,
  eyes,          eyesColor,
  glasses,       glassesColor,
  hair,          hairColor,
  hat,           hatColor,
  mouth,         mouthColor,
} from './Pixelartoptions';

// ── Feature map ──────────────────────────────────────────────────────────────
const OPTIONS = { accessories, beard, clothing, eyes, glasses, hair, hat, mouth } as const;
type FeatureKey = keyof typeof OPTIONS;

const TAB_LABELS: Record<FeatureKey, string> = {
  accessories: 'Accessories',
  beard:       'Beard',
  clothing:    'Clothing',
  eyes:        'Eyes',
  glasses:     'Glasses',
  hair:        'Hair',
  hat:         'Hat',
  mouth:       'Mouth',
};

// Features that have a DiceBear probability prop
const PROB_PROP: Partial<Record<FeatureKey, ProbKey>> = {
  accessories: 'accessoriesProbability',
  beard:       'beardProbability',
  glasses:     'glassesProbability',
  hat:         'hatProbability',
};

// Features that have a DiceBear colour prop
const COLOR_META: Partial<Record<FeatureKey, { prop: ColorKey; options: string[] }>> = {
  accessories: { prop: 'accessoriesColor', options: accessoriesColor },
  clothing:    { prop: 'clothingColor',    options: clothingColor    },
  eyes:        { prop: 'eyesColor',        options: eyesColor        },
  glasses:     { prop: 'glassesColor',     options: glassesColor     },
  hair:        { prop: 'hairColor',        options: hairColor        },
  hat:         { prop: 'hatColor',         options: hatColor         },
  mouth:       { prop: 'mouthColor',       options: mouthColor       },
};

// ── Strict types (no `any`) ───────────────────────────────────────────────────
type ProbKey  = 'accessoriesProbability' | 'beardProbability' | 'glassesProbability' | 'hatProbability';
type ColorKey = 'accessoriesColor' | 'clothingColor' | 'eyesColor' | 'glassesColor' | 'hairColor' | 'hatColor' | 'mouthColor';

// Separate the three logical groups so we can index each without `any`
interface FeatureVariants {
  accessories: string[];
  beard:       string[];
  clothing:    string[];
  eyes:        string[];
  glasses:     string[];
  hair:        string[];
  hat:         string[];
  mouth:       string[];
}

type FeatureProbabilities = Partial<Record<ProbKey,  number>>;
type FeatureColors        = Partial<Record<ColorKey, string[]>>;

type AvatarFeatures = FeatureVariants & FeatureProbabilities & FeatureColors;

// ── Default state ─────────────────────────────────────────────────────────────
const SEED = 'Juan Guarnizo';

const DEFAULT_FEATURES: AvatarFeatures = {
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

// ── Helpers ───────────────────────────────────────────────────────────────────
function makeAvatarSvg(features: AvatarFeatures): string {
  const opts: Record<string, unknown> = { seed: SEED, ...features };
  return createAvatar(pixelArt, opts as Parameters<typeof createAvatar>[1]).toString();
}

function makeVariantTileSvg(base: AvatarFeatures, feature: FeatureKey, value: string | null): string {
  const probKey = PROB_PROP[feature];
  const probOverride: FeatureProbabilities = probKey ? { [probKey]: value === null ? 0 : 100 } : {};
  const variantOverride: Partial<FeatureVariants> = value !== null ? { [feature]: [value] } : {};
  return makeAvatarSvg({ ...base, ...probOverride, ...variantOverride });
}

function makeColorTileSvg(base: AvatarFeatures, feature: FeatureKey, colorValue: string): string {
  const colorMeta = COLOR_META[feature];
  if (!colorMeta) return makeAvatarSvg(base);
  const probKey = PROB_PROP[feature];
  const probOverride: FeatureProbabilities = probKey ? { [probKey]: 100 } : {};
  const colorOverride: FeatureColors = { [colorMeta.prop]: [colorValue] };
  return makeAvatarSvg({ ...base, ...probOverride, ...colorOverride });
}

// ── ColorSwatch ────────────────────────────────────────────────────────────────
interface ColorSwatchProps {
  hex: string;
  selected: boolean;
  onClick: () => void;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ hex, selected, onClick }) => {
  const bg = hex === 'transparent' ? undefined : `#${hex}`;
  return (
    <div
      className={`color-swatch ${selected ? 'color-swatch--selected' : ''}`}
      style={bg ? { background: bg } : undefined}
      onClick={onClick}
      title={hex}
    >
      {hex === 'transparent' && <span className="color-swatch__none">∅</span>}
    </div>
  );
};

// ── AvatarTile ─────────────────────────────────────────────────────────────────
interface AvatarTileProps {
  svg: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

const AvatarTile: React.FC<AvatarTileProps> = ({ svg, label, selected, onClick }) => (
  <div className={`inv-tile ${selected ? 'inv-tile--selected' : ''}`} onClick={onClick}>
    <div className="inv-tile__avatar" dangerouslySetInnerHTML={{ __html: svg }} />
    <span className="inv-tile__label">{label}</span>
  </div>
);

// ── InventoryCard ──────────────────────────────────────────────────────────────
interface InventoryCardProps {
  features: AvatarFeatures;
  onSelectVariant: (feature: FeatureKey, value: string | null) => void;
  onSelectColor:   (feature: FeatureKey, colorProp: ColorKey, colorValue: string) => void;
}

const InventoryCard: React.FC<InventoryCardProps> = ({ features, onSelectVariant, onSelectColor }) => {
  const [activeTab,    setActiveTab]    = useState<FeatureKey>('hair');
  const [showingColor, setShowingColor] = useState(false);

  const handleTabChange = (key: FeatureKey) => {
    setActiveTab(key);
    setShowingColor(false);
  };

  const colorMeta      = COLOR_META[activeTab];
  const hasColor       = !!colorMeta;
  const probKey        = PROB_PROP[activeTab];
  const isNoneSelected = probKey ? (features[probKey] ?? 100) === 0 : false;

  const variantTiles = useMemo(() => {
    const opts  = OPTIONS[activeTab] as readonly string[];
    const tiles: { value: string | null; label: string; svg: string; selected: boolean }[] = [];

    if (probKey) {
      tiles.push({
        value:    null,
        label:    'None',
        svg:      makeVariantTileSvg(features, activeTab, null),
        selected: isNoneSelected,
      });
    }

    for (const value of opts) {
      tiles.push({
        value,
        label:    value,
        svg:      makeVariantTileSvg(features, activeTab, value),
        selected: !isNoneSelected && features[activeTab][0] === value,
      });
    }
    return tiles;
  }, [activeTab, features, isNoneSelected, probKey]);

  const colorTiles = useMemo(() => {
    if (!colorMeta) return [];
    const currentColor = (features[colorMeta.prop] ?? [])[0];
    return colorMeta.options.map((c) => ({
      hex:      c,
      svg:      makeColorTileSvg(features, activeTab, c),
      selected: currentColor === c,
    }));
  }, [activeTab, features, colorMeta]);

  return (
    <div className="inv-card">
      <nav className="inv-tabs">
        {(Object.keys(OPTIONS) as FeatureKey[]).map((key) => (
          <button
            key={key}
            className={`inv-tab ${activeTab === key ? 'inv-tab--active' : ''}`}
            onClick={() => handleTabChange(key)}
          >
            {TAB_LABELS[key]}
          </button>
        ))}

        {hasColor && (
          <button
            className={`inv-color-toggle ${showingColor ? 'inv-color-toggle--active' : ''}`}
            onClick={() => setShowingColor((s) => !s)}
          >
            🎨 {showingColor ? 'Variants' : 'Colors'}
          </button>
        )}
      </nav>

      <div className="inv-grid">
        {!showingColor
          ? variantTiles.map(({ value, label, svg, selected }) => (
              <AvatarTile
                key={label}
                svg={svg}
                label={label}
                selected={selected}
                onClick={() => onSelectVariant(activeTab, value)}
              />
            ))
          : colorTiles.map(({ hex, svg, selected }) => (
              <div key={hex} className="inv-color-tile">
                <AvatarTile
                  svg={svg}
                  label={`#${hex}`}
                  selected={selected}
                  onClick={() => onSelectColor(activeTab, colorMeta!.prop, hex)}
                />
                <ColorSwatch
                  hex={hex}
                  selected={selected}
                  onClick={() => onSelectColor(activeTab, colorMeta!.prop, hex)}
                />
              </div>
            ))
        }
      </div>
    </div>
  );
};

// ── Profile ────────────────────────────────────────────────────────────────────
const Profile: React.FC = () => {
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

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="avatar-wrapper">
          <div className="avatar-circle" dangerouslySetInnerHTML={{ __html: mainAvatarSvg }} />
        </div>
        <div className="profile-info">
          <div className="info-row"><span>Nombre: Juan Guarnizo</span></div>
          <div className="info-row"><span>Edad: 99</span></div>
          <div className="info-row"><span>Fecha de Nacimiento: 01/01/1987</span></div>
          <div className="info-row"><span>Telefono: 81 22544 4444</span></div>
          <div className="info-row"><span>Correo: juan.guarnizo@gmail.com</span></div>
        </div>

        <div className="about-me-section">
          <div className="about-me-label">Sobre mi</div>
          <p className="about-me-text">Lorem ipsum dolor sit amet consectetur adipiscing elit, potenti justo nostra tristique ullamcorper curae sociis, bibendum enim turpis hendrerit mauris magnis.</p>
        </div>
      </div>

      <div className="profile-right">
        <div className="profile-section profile-section--inventory">
          <div className="section-tab">Cosméticos</div>
          <div className="section-body section-body--flush">
            <InventoryCard
              features={features}
              onSelectVariant={handleSelectVariant}
              onSelectColor={handleSelectColor}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;