import React from 'react';

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

export default ColorSwatch;
