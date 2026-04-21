import React, { useState } from 'react';
import { GiftIcon } from '@heroicons/react/24/outline';
import './Profile.css';

import UserCard from '../components/UserCard';
import InventoryCard from '../components/InventoryCard';
import SkeletonUserCard from '../components/SkeletonUserCard';
import SkeletonAvatarTile from '../components/SkeletonAvatarTile';
import { AvatarLootBox } from '../components/AvatarLootBox';
import MessagePopUp from '../../../shared/components/MessagePopUp';
import type { MessagePopUpType } from '../../../shared/components/MessagePopUp';
import { useAvatarCatalog } from '../hooks/useAvatarCatalog';
import { useAvatarFeatures } from '../hooks/useAvatarFeatures';
import { useUserAvatar } from '../hooks/useUserAvatar';
import { useUserProfile, updateSobreMi } from '@/features/user/services/user.service';
import { useUser } from '@/core/auth/userContext';

const SKELETON_TILE_COUNT = 10;

function calcAge(fechaNacimiento: string): number {
  const birth = new Date(fechaNacimiento);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

interface PopupState {
  type: MessagePopUpType;
  title: string;
  message: string;
}

// ── Inner component — no auth dependency ─────────────────────────────────────
function ProfileContent({ userId }: { userId: number }) {
  const [showLootbox,      setShowLootbox]      = useState(false);
  const [popup,            setPopup]            = useState<PopupState | null>(null);
  const [passiveDismissed, setPassiveDismissed] = useState(false);

  const { catalog, allElements, atributos, loading: loadingCatalog, error: catalogError } = useAvatarCatalog();
  const { userProfile, loading: loadingUser, error: userError, refresh } = useUserProfile(userId);

  const { filteredCatalog, initialFeatures, saveAvatar, addRandomItem, unownedItems, saving, loadingAvatar, addingItem } = useUserAvatar(
    userId,
    catalog,
    allElements,
    atributos,
  );

  const { features, mainAvatarSvg, handleSelectVariant, handleSelectColor, handleSelectType } =
    useAvatarFeatures(
      filteredCatalog ?? { styleId: 1, styleName: '', features: [], defaultFeatures: {} },
      initialFeatures,
    );

  const isLoading     = loadingCatalog || loadingAvatar || loadingUser;
  const hasError      = !!(catalogError || userError);
  const isEmpty       = !isLoading && !hasError && (!filteredCatalog || filteredCatalog.features.length === 0);
  const showInventory = !isLoading && !hasError && !!filteredCatalog && filteredCatalog.features.length > 0;

  const nombre    = [userProfile?.nombre, userProfile?.apellido].filter(Boolean).join(' ') || '—';
  const email     = userProfile?.email ?? '—';
  const telefono  = userProfile?.telefono ?? '—';
  const sobreMi   = userProfile?.sobreMi ?? '';
  const age       = userProfile?.fechaNacimiento ? calcAge(userProfile.fechaNacimiento) : null;
  const birthDate = userProfile?.fechaNacimiento
    ? new Date(userProfile.fechaNacimiento).toLocaleDateString('es-MX')
    : '—';

  const handleSaveAvatar = async () => {
    try {
      await saveAvatar(features);
      setPopup({
        type:    'notification',
        title:   'Avatar guardado',
        message: 'Tu avatar se ha guardado correctamente.',
      });
    } catch {
      setPopup({
        type:    'error',
        title:   'Error al guardar',
        message: 'No se pudo guardar el avatar. Intenta de nuevo.',
      });
    }
  };

  const activePopup: PopupState | null =
    popup ??
    (passiveDismissed ? null :
      hasError
        ? { type: 'error',   title: 'Error de conexión', message: 'No se pudo conectar a la base de datos. Verifica tu conexión e intenta de nuevo.' }
        : isEmpty
        ? { type: 'warning', title: 'Inventario vacío',  message: 'Aún no tienes elementos. Abre una lootbox para obtener tu primer cosmético.' }
        : null);

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

      {activePopup && (
        <MessagePopUp
          type={activePopup.type}
          title={activePopup.title}
          message={activePopup.message}
          onClose={() => popup ? setPopup(null) : setPassiveDismissed(true)}
        />
      )}

      <div className="profile-page">
        {isLoading ? (
          <SkeletonUserCard />
        ) : (
          <UserCard
            userId={userId}
            avatarSvg={mainAvatarSvg}
            name={nombre}
            age={age ?? 0}
            birthDate={birthDate}
            phone={telefono}
            email={email}
            aboutMe={sobreMi}
            onSave={async (newSobreMi) => {
              await updateSobreMi(userId, newSobreMi);
              refresh();
            }}
          />
        )}

        <div className="profile-right">
          <div className="profile-section profile-section--inventory">
            <div className="section-tab">Cosméticos</div>
            <div className="section-body section-body--flush">
              {showInventory ? (
                <InventoryCard
                  catalog={filteredCatalog}
                  features={features}
                  onSelectVariant={handleSelectVariant}
                  onSelectColor={handleSelectColor}
                  onSelectType={handleSelectType}
                />
              ) : (
                <div className="inv-card">
                  <div className="inv-grid">
                    {Array.from({ length: SKELETON_TILE_COUNT }).map((_, i) => (
                      <SkeletonAvatarTile key={i} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="section-footer">
              <button
                className="btn-lootbox"
                onClick={() => { setShowLootbox(true); setPopup(null); }}
                disabled={isLoading || hasError || saving || addingItem}
              >
                <GiftIcon style={{ width: 16, height: 16 }} /> Abrir lootbox
              </button>
              <button
                className="btn-save-avatar"
                onClick={handleSaveAvatar}
                disabled={!showInventory || saving || addingItem}
              >
                {saving ? 'Guardando…' : 'Guardar avatar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Auth wrapper — reads userId from UserProvider ─────────────────────────────
function ProfileWithAuth() {
  const { user } = useUser();
  return <ProfileContent userId={user?.id ?? 0} />;
}

// ── Public export — uses auth by default, accepts debugUserId to bypass it ────
const Profile: React.FC<{ debugUserId?: number }> = ({ debugUserId }) => {
  if (debugUserId !== undefined) {
    return <ProfileContent userId={debugUserId} />;
  }
  return <ProfileWithAuth />;
};

export default Profile;
