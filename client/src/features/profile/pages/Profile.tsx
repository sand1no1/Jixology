import React, { useState } from 'react';
import { GiftIcon } from '@heroicons/react/24/outline';
import './Profile.css';

import UserCard from '../components/UserCard';
import InventoryCard from '../components/InventoryCard';
import { AvatarLootBox } from '../components/AvatarLootBox';
import { useAvatarCatalog } from '../hooks/useAvatarCatalog';
import { useAvatarFeatures } from '../hooks/useAvatarFeatures';
import { useUserAvatar } from '../hooks/useUserAvatar';
import { useUserProfile } from '@/features/user/services/user.service';

const HARDCODED_USER_ID = 1;

function calcAge(fechaNacimiento: string): number {
  const birth = new Date(fechaNacimiento);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

const Profile: React.FC = () => {
  const [showLootbox, setShowLootbox] = useState(false);
  const { catalog, allElements, atributos, loading: loadingCatalog, error: catalogError } = useAvatarCatalog();
  const { userProfile, loading: loadingUser, error: userError } = useUserProfile(HARDCODED_USER_ID);

  const { filteredCatalog, initialFeatures, saveAvatar, addRandomItem, unownedItems, saving, loadingAvatar, addingItem } = useUserAvatar(
    HARDCODED_USER_ID,
    catalog,
    allElements,
    atributos,
  );

  const { features, mainAvatarSvg, handleSelectVariant, handleSelectColor, handleSelectType } =
    useAvatarFeatures(
      filteredCatalog ?? { styleId: 1, styleName: '', features: [], defaultFeatures: {} },
      initialFeatures,
    );

  if (loadingCatalog || loadingAvatar || loadingUser || !filteredCatalog) {
    return <div className="profile-loading">Cargando perfil…</div>;
  }
  if (catalogError || userError) {
    return <div className="profile-error">Error: {catalogError ?? userError}</div>;
  }

  const nombre    = [userProfile?.nombre, userProfile?.apellido].filter(Boolean).join(' ') || '—';
  const email     = userProfile?.email ?? '—';
  const telefono  = userProfile?.telefono ?? '—';
  const sobreMi   = userProfile?.sobreMi ?? '';
  const age       = userProfile?.fechaNacimiento ? calcAge(userProfile.fechaNacimiento) : null;
  const birthDate = userProfile?.fechaNacimiento
    ? new Date(userProfile.fechaNacimiento).toLocaleDateString('es-MX')
    : '—';

  return (
    <>
    {showLootbox && (
      <div className="lootbox-overlay" onClick={e => { if (e.target === e.currentTarget) setShowLootbox(false); }}>
        <div className="lootbox-modal">
          <AvatarLootBox
            unownedItems={unownedItems}
            atributos={atributos}
            baseFeatures={features}
            onOpen={addRandomItem}
            onClose={() => setShowLootbox(false)}
            disabled={addingItem}
          />
        </div>
      </div>
    )}
    <div className="profile-page">
      <UserCard
        userId={HARDCODED_USER_ID}
        avatarSvg={mainAvatarSvg}
        name={nombre}
        age={age ?? 0}
        birthDate={birthDate}
        phone={telefono}
        email={email}
        aboutMe={sobreMi}
      />

      <div className="profile-right">
        <div className="profile-section profile-section--inventory">
          <div className="section-tab">Cosméticos</div>
          <div className="section-body section-body--flush">
            <InventoryCard
              catalog={filteredCatalog}
              features={features}
              onSelectVariant={handleSelectVariant}
              onSelectColor={handleSelectColor}
              onSelectType={handleSelectType}
            />
          </div>
          <div className="section-footer">
            <button
              className="btn-lootbox"
              onClick={() => setShowLootbox(true)}
              disabled={saving || addingItem}
            >
              <GiftIcon style={{ width: 16, height: 16 }} /> Abrir lootbox
            </button>
            <button
              className="btn-save-avatar"
              onClick={() => saveAvatar(features).catch(err => console.error('Save avatar failed:', err))}
              disabled={saving || addingItem}
            >
              {saving ? 'Guardando…' : 'Guardar avatar'}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile;
