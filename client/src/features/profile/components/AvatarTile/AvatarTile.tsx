import React from 'react';

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

export default AvatarTile;
