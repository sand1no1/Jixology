import { useMemo, useState } from 'react';
import { RegisterUserForm } from '../../components/registerUserForm';
import { useRegisterUser } from '../../hooks/useRegisterUser';
import { useAdminUsers } from '../../hooks/useAdminUsers';
import type { AdminUserRoleBadge } from '../../types/admin.types';
import SearchBarComponent from '@/shared/components/SearchBarComponent/SearchBarComponent';
import ListUserCard from '@/features/profile/components/ListUserCard/ListUserCard';
import './adminPage.css';

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
        />
      );
    });
  }, [users]);

  return (
    <main className="admin-page">
      <div className="admin-page__container">
        <section className="admin-page__card">
          <div className="admin-page__topbar">
            <div className="admin-page__heading">
              <h1 className="admin-page__title">Usuarios del sistema</h1>
              <p className="admin-page__subtitle">
              </p>
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
              ×
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