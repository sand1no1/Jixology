import React from 'react';
import './Profile.css';

import UserCard from '../components/UserCard';
import InventoryCard from '../components/InventoryCard';
import { useAvatarCatalog } from '../hooks/useAvatarCatalog';
import { useAvatarFeatures } from '../hooks/useAvatarFeatures';
import { useUserAvatar } from '../hooks/useUserAvatar';
import { useUsuario } from '../../../features/user/hooks/useUsuario';

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
  const { catalog, allElements, atributos, loading: loadingCatalog, error: catalogError } = useAvatarCatalog();
  const { usuario, loading: loadingUser, error: userError } = useUsuario(HARDCODED_USER_ID);

  const { filteredCatalog, initialFeatures, saveAvatar, saving, loadingAvatar } = useUserAvatar(
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

  const nombre    = [usuario?.nombre, usuario?.apellido].filter(Boolean).join(' ') || '—';
  const email     = usuario?.email ?? '—';
  const telefono  = usuario?.telefono ?? '—';
  const sobreMi   = usuario?.sobre_mi ?? '';
  const age       = usuario?.fecha_nacimiento ? calcAge(usuario.fecha_nacimiento) : null;
  const birthDate = usuario?.fecha_nacimiento
    ? new Date(usuario.fecha_nacimiento).toLocaleDateString('es-MX')
    : '—';

  return (
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
              className="btn-save-avatar"
              onClick={() => saveAvatar(features).catch(err => console.error('Save avatar failed:', err))}
              disabled={saving}
            >
              {saving ? 'Guardando…' : 'Guardar avatar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
