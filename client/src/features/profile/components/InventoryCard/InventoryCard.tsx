import React, { useMemo, useState } from 'react';

import AvatarTile from '../AvatarTile';
import ColorSwatch from '../ColorSwatch';
import { OPTIONS, TAB_LABELS, PROB_PROP, COLOR_META, makeVariantTileSvg, makeColorTileSvg } from '../../services/avatar.service';
import type { AvatarFeatures, ColorKey, FeatureKey } from '../../types/avatar.types';

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

export default InventoryCard;
