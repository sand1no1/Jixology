import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { RegisterUserForm } from '../../components/registerUserForm';
import { useRegisterUser } from '../../hooks/useRegisterUser';
import { useAdminUsers } from '../../hooks/useAdminUsers';
import type { AdminUserRoleBadge } from '../../types/admin.types';
import SearchBarComponent from '@/shared/components/SearchBarComponent/SearchBarComponent';
import ListUserCard from '@/shared/components/ListUserCard';
import UserCard from '@/features/profile/components/UserCard/UserCard';
import { useUserProfile } from '@/features/user/services/user.service';
import './adminPage.css';

function calcAge(fechaNacimiento: string): number {
  const birth = new Date(fechaNacimiento);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

const POPUP_WIDTH  = 298; // 250px card + 48px padding
const POPUP_HEIGHT = 500; // rough max height

function computePopoverStyle(rect: DOMRect): React.CSSProperties {
  const GAP    = 16;
  const MARGIN = 8;

  let left = rect.right + GAP;
  if (left + POPUP_WIDTH > window.innerWidth) {
    left = rect.left - POPUP_WIDTH - GAP;
  }

  // Start aligned with avatar top, then clamp into viewport
  let top = rect.top;
  if (top + POPUP_HEIGHT > window.innerHeight - MARGIN) {
    top = window.innerHeight - POPUP_HEIGHT - MARGIN;
  }
  if (top < MARGIN) {
    top = MARGIN;
  }

  return { position: 'fixed', left, top, zIndex: 1001 };
}

// Avatar section height: 32px top-padding + 8px avatar-padding-top + 150px avatar + 20px gap
const AVATAR_ONLY_HEIGHT = 210;
const FULL_CARD_HEIGHT   = 560;

function UserProfileModal({ userId, rect, onMouseEnter, onMouseLeave }: {
  userId: number;
  rect: DOMRect;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const { userProfile, loading } = useUserProfile(userId);
  const [expanded, setExpanded] = useState(false);

  // Double rAF: paint the collapsed state first, then trigger the transition
  useEffect(() => {
    let raf2: number;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setExpanded(true));
    });
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); };
  }, []);

  const nombre    = [userProfile?.nombre, userProfile?.apellido].filter(Boolean).join(' ') || '—';
  const email     = userProfile?.email ?? '—';
  const telefono  = userProfile?.telefono ?? '—';
  const sobreMi   = userProfile?.sobreMi ?? '';
  const age       = userProfile?.fechaNacimiento ? calcAge(userProfile.fechaNacimiento) : 0;
  const birthDate = userProfile?.fechaNacimiento
    ? new Date(userProfile.fechaNacimiento).toLocaleDateString('es-MX')
    : '—';

  return (
    <div
      style={{
        ...computePopoverStyle(rect),
        borderRadius: '20px',
        border: '1px solid rgba(31, 54, 80, 0.12)',
        boxShadow: '0 8px 32px rgba(10, 8, 56, 0.16), 0 2px 8px rgba(10, 8, 56, 0.08)',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div style={{
        overflow:   'hidden',
        maxHeight:  expanded ? `${FULL_CARD_HEIGHT}px` : `${AVATAR_ONLY_HEIGHT}px`,
        transition: 'max-height 1s cubic-bezier(0.34, 1.1, 0.64, 1)',
        borderRadius: '20px',
      }}>
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-anchor-gray-1)' }}>Cargando...</p>
        ) : (
          <UserCard
            userId={userId} 
            name={nombre}
            age={age}
            birthDate={birthDate}
            phone={telefono}
            email={email}
            aboutMe={sobreMi}
          />
        )}
      </div>
    </div>
  );
}

function getRoleBadge(idRolGlobal: number): AdminUserRoleBadge[] {
  if (idRolGlobal === 1) {
    return [
      {
        label: 'Administrador',
        color: 'rgba(221, 0, 49, 0.12)',
        textColor: 'var(--color-mahindra-red)',
      },
    ];
  }

  return [
    {
      label: 'Usuario',
      color: 'rgba(31, 54, 80, 0.10)',
      textColor: 'var(--color-blueprint-navy)',
    },
  ];
}

export default function RegisterUserPage() {
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [pageSuccess, setPageSuccess] = useState('');
  const [selectedUser, setSelectedUser] = useState<{ userId: number; rect: DOMRect } | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startHide = useCallback(() => {
    hideTimer.current = setTimeout(() => setSelectedUser(null), 150);
  }, []);
  const cancelHide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }, []);

  const { users, loading: usersLoading, error: usersError, refreshUsers } =
    useAdminUsers(search);

  const {
    values,
    loading,
    error,
    success,
    handleChange,
    submit,
  } = useRegisterUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await submit();
    setPageSuccess(response.message || 'Usuario creado correctamente.');
    setIsCreateModalOpen(false);
    await refreshUsers();
  };

  const userCards = useMemo(() => {
    return users.map((user) => {
      const fullName =
        [user.nombre, user.apellido].filter(Boolean).join(' ').trim() || 'Sin nombre';

      return (
        <ListUserCard
          key={user.id}
          userId={user.id}
          fullName={fullName}
          roles={getRoleBadge(user.id_rol_global)}
          email={user.email}
          onEdit={() => navigate(`/admin/users/${user.id}`)}
          onAvatarEnter={(rect) => {
            cancelHide();
            setSelectedUser({ userId: user.id, rect });
          }}
          onAvatarLeave={startHide}
        />
      );
    });
  }, [users, cancelHide, startHide]);

  return (
    <main className="admin-page">
      <div className="admin-page__container">
        <section className="admin-page__card">
          <div className="admin-page__topbar">
            <div className="admin-page__heading">
              <h1 className="admin-page__title">Usuarios del sistema</h1>
              <p className="admin-page__subtitle"></p>
            </div>

            <button
              type="button"
              className="admin-page__create-button"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Crear usuario
            </button>
          </div>

          <div className="admin-page__search">
            <SearchBarComponent
              infoText="Buscar usuario por nombre o correo..."
              onChange={setSearch}
              fontSize="0.95rem"
              height="48px"
            />
          </div>

          {pageSuccess && (
            <div
              className="admin-page__feedback admin-page__feedback--success"
              onAnimationEnd={() => setPageSuccess('')}
            >
              {pageSuccess}
            </div>
          )}

          {usersError && (
            <div className="admin-page__feedback admin-page__feedback--error">
              {usersError}
            </div>
          )}

          <div className="admin-page__results-info">
            Mostrando máximo 10 usuarios
          </div>

          <div className="admin-page__list">
            {usersLoading ? (
              <div className="admin-page__empty-state">Cargando usuarios...</div>
            ) : userCards.length > 0 ? (
              userCards
            ) : (
              <div className="admin-page__empty-state">
                No se encontraron usuarios.
              </div>
            )}
          </div>
        </section>
      </div>

      {selectedUser !== null && (
        <UserProfileModal
          userId={selectedUser.userId}
          rect={selectedUser.rect}
          onMouseEnter={cancelHide}
          onMouseLeave={startHide}
        />
      )}

      {isCreateModalOpen && (
        <div
          className="admin-page__modal-overlay"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            className="admin-page__modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="admin-page__modal-close"
              onClick={() => setIsCreateModalOpen(false)}
              aria-label="Cerrar modal"
            >
              <XCircleIcon className="admin-page__modal-close-icon" />
            </button>

            <RegisterUserForm
              values={values}
              loading={loading}
              error={error}
              success={success}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </main>
  );
}