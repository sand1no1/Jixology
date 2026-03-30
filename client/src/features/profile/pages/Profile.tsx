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

// Features that have a probability prop
const PROB_PROP: Partial<Record<FeatureKey, string>> = {
  accessories: 'accessoriesProbability',
  beard:       'beardProbability',
  glasses:     'glassesProbability',
  hat:         'hatProbability',
};

// Features that have a colour prop — maps feature → { colorProp, colorOptions }
const COLOR_META: Partial<Record<FeatureKey, { prop: string; options: string[] }>> = {
  accessories: { prop: 'accessoriesColor', options: accessoriesColor },
  clothing:    { prop: 'clothingColor',    options: clothingColor    },
  eyes:        { prop: 'eyesColor',        options: eyesColor        },
  glasses:     { prop: 'glassesColor',     options: glassesColor     },
  hair:        { prop: 'hairColor',        options: hairColor        },
  hat:         { prop: 'hatColor',         options: hatColor         },
  mouth:       { prop: 'mouthColor',       options: mouthColor       },
};

// ── Avatar config ────────────────────────────────────────────────────────────
const SEED = 'Juan Guarnizo';

interface AvatarFeatures {
  accessories: string[];
  beard:       string[];
  clothing:    string[];
  eyes:        string[];
  glasses:     string[];
  hair:        string[];
  hat:         string[];
  mouth:       string[];
  // probabilities
  accessoriesProbability?: number;
  beardProbability?:       number;
  glassesProbability?:     number;
  hatProbability?:         number;
  // colours
  accessoriesColor?: string[];
  clothingColor?:    string[];
  eyesColor?:        string[];
  glassesColor?:     string[];
  hairColor?:        string[];
  hatColor?:         string[];
  mouthColor?:       string[];
}

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

// ── Helpers ──────────────────────────────────────────────────────────────────
function makeAvatarSvg(features: AvatarFeatures): string {
  return createAvatar(pixelArt, { seed: SEED, ...(features as any) }).toString();
}

function makeVariantTileSvg(base: AvatarFeatures, feature: FeatureKey, value: string | null): string {
  const probKey = PROB_PROP[feature];
  return makeAvatarSvg({
    ...base,
    ...(value !== null ? { [feature]: [value] } : {}),
    ...(probKey ? { [probKey]: value === null ? 0 : 100 } : {}),
  });
}

function makeColorTileSvg(base: AvatarFeatures, feature: FeatureKey, colorValue: string): string {
  const colorMeta = COLOR_META[feature]!;
  const probKey   = PROB_PROP[feature];
  return makeAvatarSvg({
    ...base,
    [colorMeta.prop]: [colorValue],
    ...(probKey ? { [probKey]: 100 } : {}),
  });
}

// ── ColorSwatch ──────────────────────────────────────────────────────────────
interface ColorSwatchProps {
  hex: string;      // raw hex, may be "transparent"
  selected: boolean;
  onClick: () => void;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ hex, selected, onClick }) => {
  const bg = hex === 'transparent' ? 'transparent' : `#${hex}`;
  return (
    <div
      className={`color-swatch ${selected ? 'color-swatch--selected' : ''}`}
      style={{ background: bg }}
      onClick={onClick}
      title={hex}
    >
      {hex === 'transparent' && <span className="color-swatch__none">∅</span>}
    </div>
  );
};

// ── AvatarTile ───────────────────────────────────────────────────────────────
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

// ── InventoryCard ────────────────────────────────────────────────────────────
interface InventoryCardProps {
  features: AvatarFeatures;
  onSelectVariant: (feature: FeatureKey, value: string | null) => void;
  onSelectColor:   (feature: FeatureKey, colorProp: string, colorValue: string) => void;
}

const InventoryCard: React.FC<InventoryCardProps> = ({ features, onSelectVariant, onSelectColor }) => {
  const [activeTab,    setActiveTab]    = useState<FeatureKey>('hair');
  const [showingColor, setShowingColor] = useState(false);

  // Reset colour mode when switching tabs
  const handleTabChange = (key: FeatureKey) => {
    setActiveTab(key);
    setShowingColor(false);
  };

  const colorMeta   = COLOR_META[activeTab];
  const hasColor    = !!colorMeta;
  const probKey     = PROB_PROP[activeTab];
  const isNoneSelected = probKey ? (features as any)[probKey] === 0 : false;

  // ── Variant tiles ──
  const variantTiles = useMemo(() => {
    const opts = OPTIONS[activeTab] as readonly string[];
    const tiles = [];

    if (probKey) {
      tiles.push({
        value: null as string | null,
        label: 'None',
        svg:   makeVariantTileSvg(features, activeTab, null),
        selected: isNoneSelected,
      });
    }

    for (const value of opts) {
      tiles.push({
        value,
        label: value,
        svg:   makeVariantTileSvg(features, activeTab, value),
        selected: !isNoneSelected && features[activeTab][0] === value,
      });
    }
    return tiles;
  }, [activeTab, features, isNoneSelected, probKey]);

  // ── Color tiles (shown when showingColor) ──
  const colorTiles = useMemo(() => {
    if (!colorMeta) return [];
    const currentColor = ((features as any)[colorMeta.prop] as string[] | undefined)?.[0];
    return colorMeta.options.map((c) => ({
      hex:      c,
      svg:      makeColorTileSvg(features, activeTab, c),
      selected: currentColor === c,
    }));
  }, [activeTab, features, colorMeta]);

  return (
    <div className="inv-card">
      {/* Tab bar */}
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

        {/* Colour toggle — only when the active tab supports colours */}
        {hasColor && (
          <button
            className={`inv-color-toggle ${showingColor ? 'inv-color-toggle--active' : ''}`}
            onClick={() => setShowingColor((s) => !s)}
            title="Toggle colour picker"
          >
            🎨 {showingColor ? 'Variants' : 'Colors'}
          </button>
        )}
      </nav>

      {/* Grid */}
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
                <ColorSwatch hex={hex} selected={selected} onClick={() => onSelectColor(activeTab, colorMeta!.prop, hex)} />
              </div>
            ))
        }
      </div>
    </div>
  );
};

// ── Profile ──────────────────────────────────────────────────────────────────
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

  const handleSelectColor = (feature: FeatureKey, colorProp: string, colorValue: string) => {
    const probKey = PROB_PROP[feature];
    setFeatures((prev) => ({
      ...prev,
      [colorProp]: [colorValue],
      // make sure the feature is visible when a colour is chosen
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
      </div>

      <div className="profile-right">
        <div className="profile-section">
          <div className="section-tab">Sobre mi</div>
          <div className="section-body">
            <p>Lorem ipsum dolor sit amet consectetur adipiscing elit, potenti justo nostra tristique ullamcorper curae sociis, bibendum enim turpis hendrerit mauris magnis.</p>
          </div>
        </div>

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