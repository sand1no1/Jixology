import React, { useEffect, useMemo, useState } from 'react';

import AvatarTile from '../AvatarTile';
import ColorSwatch from '../ColorSwatch';
import { TYPE_LABELS, makeVariantTileSvg, makeColorTileSvg } from '../../services/avatar.service';
import type { AvatarCatalog, DynamicFeatures, FeatureMeta } from '../../types/avatar.types';

interface InventoryCardProps {
  catalog:         AvatarCatalog;
  features:        DynamicFeatures;
  onSelectVariant: (meta: FeatureMeta, value: string | null) => void;
  onSelectColor:   (meta: FeatureMeta, colorValue: string) => void;
  onSelectType:    (meta: FeatureMeta, typeValue: string) => void;
}

const InventoryCard: React.FC<InventoryCardProps> = ({
  catalog,
  features,
  onSelectVariant,
  onSelectColor,
  onSelectType,
}) => {
  const [activeTab,    setActiveTab]    = useState<FeatureMeta>(
    catalog.features.find(f => f.key === 'hair') ?? catalog.features[0]
  );
  const [showingColor, setShowingColor] = useState(false);

  // Keep activeTab in sync when the catalog updates (e.g. after a lootbox drop).
  // Look up the matching feature by key so the tab's variant/color lists refresh.
  useEffect(() => {
    setActiveTab(prev =>
      catalog.features.find(f => f.key === prev.key) ?? catalog.features[0]
    );
  }, [catalog]);

  const hasColor       = !activeTab.colorOnly && !!activeTab.colorProp;
  const isNoneSelected = activeTab.probProp
    ? ((features[activeTab.probProp] as number) ?? 100) === 0
    : false;

  const variantTiles = useMemo(() => {
    const tiles: { value: string | null; label: string; svg: string; selected: boolean }[] = [];

    if (activeTab.probProp) {
      tiles.push({
        value:    null,
        label:    'None',
        svg:      makeVariantTileSvg(features, activeTab, null),
        selected: isNoneSelected,
      });
    }

    for (const value of activeTab.variants) {
      tiles.push({
        value,
        label:    activeTab.variantLabels[value] ?? value,
        svg:      makeVariantTileSvg(features, activeTab, value),
        selected: !isNoneSelected && (features[activeTab.key] as string[])?.[0] === value,
      });
    }
    return tiles;
  }, [activeTab, features, isNoneSelected]);

  const colorTiles = useMemo(() => {
    if (!activeTab.colorProp) return [];
    const selectedColors = (features[activeTab.colorProp] as string[]) ?? [];
    return activeTab.colorOptions.map((c) => ({
      hex:      c,
      svg:      makeColorTileSvg(features, activeTab, c),
      selected: selectedColors.includes(c),
    }));
  }, [activeTab, features]);

  return (
    <div className="inv-card">
      <nav className="inv-tabs">
        {catalog.features.map((meta) => (
          <button
            key={meta.key}
            className={`inv-tab ${activeTab.key === meta.key ? 'inv-tab--active' : ''}`}
            onClick={() => { setActiveTab(meta); setShowingColor(false); }}
          >
            {meta.label}
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
        {activeTab.colorOnly ? (
          <>
            {activeTab.typeProp && (
              <div className="inv-type-toggle">
                {activeTab.typeOptions.map((type) => (
                  <button
                    key={type}
                    className={`inv-type-btn ${
                      (features[activeTab.typeProp!] as string[])?.[0] === type
                        ? 'inv-type-btn--active'
                        : ''
                    }`}
                    onClick={() => onSelectType(activeTab, type)}
                  >
                    {TYPE_LABELS[type] ?? type}
                  </button>
                ))}
              </div>
            )}
            {colorTiles.map(({ hex, svg, selected }) => (
              <div key={hex} className="inv-color-tile">
                <AvatarTile
                  svg={svg}
                  label={`#${hex}`}
                  selected={selected}
                  onClick={() => onSelectColor(activeTab, hex)}
                />
                <ColorSwatch
                  hex={hex}
                  selected={selected}
                  onClick={() => onSelectColor(activeTab, hex)}
                />
              </div>
            ))}
          </>
        ) : !showingColor ? (
          variantTiles.map(({ value, label, svg, selected }) => (
            <AvatarTile
              key={label}
              svg={svg}
              label={label}
              selected={selected}
              onClick={() => onSelectVariant(activeTab, value)}
            />
          ))
        ) : (
          colorTiles.map(({ hex, svg, selected }) => (
            <div key={hex} className="inv-color-tile">
              <AvatarTile
                svg={svg}
                label={`#${hex}`}
                selected={selected}
                onClick={() => onSelectColor(activeTab, hex)}
              />
              <ColorSwatch
                hex={hex}
                selected={selected}
                onClick={() => onSelectColor(activeTab, hex)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InventoryCard;
