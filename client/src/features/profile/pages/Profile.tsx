import React, { useMemo } from 'react';
import './Profile.css';

import UserCard from '../components/UserCard';
import InventoryCard from '../components/InventoryCard';
import { useAvatarCatalog } from '../hooks/useAvatarCatalog';
import { useAvatarFeatures } from '../hooks/useAvatarFeatures';
import { buildRandomFeatures } from '../hooks/useRandomAvatarFromDb';

const Profile: React.FC = () => {
  const { catalog, loading, error } = useAvatarCatalog();

  const initialFeatures = useMemo(
    () => (catalog ? buildRandomFeatures(catalog) : {}),
    [catalog],
  );

  const { features, mainAvatarSvg, handleSelectVariant, handleSelectColor, handleSelectType } =
    useAvatarFeatures(catalog ?? { styleId: 1, styleName: '', features: [], defaultFeatures: {} }, initialFeatures);

  if (loading) return <div className="profile-loading">Cargando catálogo…</div>;
  if (error)   return <div className="profile-error">Error: {error}</div>;

  return (
    <div className="profile-page">
      <UserCard
        avatarSvg={mainAvatarSvg}
        name="Juan Guarnizo"
        age={99}
        birthDate="01/01/1987"
        phone="81 22544 4444"
        email="juan.guarnizo@gmail.com"
        aboutMe="Lorem ipsum dolor sit amet consectetur adipiscing elit, potenti justo nostra tristique ullamcorper curae sociis, bibendum enim turpis hendrerit mauris magnis."
      />

      <div className="profile-right">
        <div className="profile-section profile-section--inventory">
          <div className="section-tab">Cosméticos</div>
          <div className="section-body section-body--flush">
            <InventoryCard
              catalog={catalog!}
              features={features}
              onSelectVariant={handleSelectVariant}
              onSelectColor={handleSelectColor}
              onSelectType={handleSelectType}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
