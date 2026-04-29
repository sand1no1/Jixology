import { TrashIcon, BellIcon } from '@heroicons/react/24/outline';
import { useMemo, useState } from 'react';
import ConfirmDialog from '@/shared/components/ConfirmDialog/ConfirmDialog';
import EmptyState from '@/shared/components/EmptyState/EmptyState';
import ErrorState from '@/shared/components/ErrorState/ErrorState';
import LoadingState from '@/shared/components/LoadingState/LoadingState';
import NotificationList from '../components/NotificationList';
import NotificationTabs from '../components/NotificationTabs';
import { useNotifications } from '../hooks/useNotifications';
import type { NotificationTabFilter } from '../types/notification.types';
import SearchBarComponent from '@/shared/components/SearchBarComponent/SearchBarComponent';
import './NotificationsPage.css';

export default function NotificationsPage() {
	const {
		notifications,
		unreadCount,
		readCount,
		userContext,
		isLoading,
		error,
		refetch,
		markAsRead,
		markAsUnread,
		deleteNotification,
	} = useNotifications();

	const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<NotificationTabFilter>('all');
  const [markingAsReadIds, setMarkingAsReadIds] = useState<number[]>([]);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
	const [selectedIds, setSelectedIds] = useState<number[]>([]);
	const [isSelectionMode, setIsSelectionMode] = useState(false);
	const [pendingDeleteIds, setPendingDeleteIds] = useState<number[]>([]);
	const [isDeletingConfirmed, setIsDeletingConfirmed] = useState(false);

	const filteredNotifications = useMemo(() => {
		const normalizedSearch = search.trim().toLowerCase();

		const notificationsByTab = notifications.filter((notification) => {
			if (activeTab === 'unread') {
				return !notification.leida;
			}

			if (activeTab === 'read') {
				return notification.leida;
			}

			return true;
		});

		if (!normalizedSearch) {
			return notificationsByTab;
		}

		return notificationsByTab.filter((notification) => {
			const name = notification.nombre.toLowerCase();
			const description = notification.descripcion?.toLowerCase() ?? '';

			return (
				name.includes(normalizedSearch) ||
				description.includes(normalizedSearch)
			);
		});
	}, [activeTab, notifications, search]);

  const filteredNotificationIds = useMemo(
    () => filteredNotifications.map((notification) => notification.id),
    [filteredNotifications],
  );

  const areAllFilteredSelected =
    filteredNotificationIds.length > 0 &&
    filteredNotificationIds.every((id) => selectedIds.includes(id));

	const unreadSelectedCount = selectedIds.filter((notificationId) => {
		const notification = notifications.find((item) => item.id === notificationId);
		return notification && !notification.leida;
	}).length;

	const readSelectedCount = selectedIds.filter((notificationId) => {
		const notification = notifications.find((item) => item.id === notificationId);
		return notification && notification.leida;
	}).length;

  const emptyTitle = useMemo(() => {
    if (activeTab === 'unread') {
      return 'No tienes notificaciones sin leer';
    }

    if (activeTab === 'read') {
      return 'No tienes notificaciones leídas';
    }

    return 'No tienes notificaciones';
  }, [activeTab]);

	const handleTabChange = (tab: NotificationTabFilter) => {
		setActiveTab(tab);
		setSelectedIds([]);
		setIsSelectionMode(false);
	};

  const handleToggleSelected = (notificationId: number) => {
    setSelectedIds((current) => {
      if (current.includes(notificationId)) {
        return current.filter((id) => id !== notificationId);
      }

      return [...current, notificationId];
    });
  };

  const handleToggleSelectAll = () => {
    setSelectedIds((current) => {
      if (areAllFilteredSelected) {
        return current.filter((id) => !filteredNotificationIds.includes(id));
      }

      return Array.from(new Set([...current, ...filteredNotificationIds]));
    });
  };

	const handleStartSelection = () => {
		setIsSelectionMode(true);
	};

	const handleClearSelection = () => {
		setSelectedIds([]);
		setIsSelectionMode(false);
	};

  const handleRequestDeleteOne = (notificationId: number) => {
    setPendingDeleteIds([notificationId]);
  };

  const handleRequestDeleteSelected = () => {
    if (selectedIds.length === 0) {
      return;
    }

    setPendingDeleteIds(selectedIds);
  };

  const handleCancelDelete = () => {
    if (isDeletingConfirmed) {
      return;
    }

    setPendingDeleteIds([]);
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteIds.length === 0) {
      return;
    }

    setIsDeletingConfirmed(true);
    setDeletingIds((current) =>
      Array.from(new Set([...current, ...pendingDeleteIds])),
    );

		try {
			await Promise.all(
				pendingDeleteIds.map((notificationId) =>
					deleteNotification(notificationId),
				),
			);

			setSelectedIds([]);
			setIsSelectionMode(false);
			setPendingDeleteIds([]);
		} finally {
			setDeletingIds((current) =>
				current.filter((id) => !pendingDeleteIds.includes(id)),
			);
			setIsDeletingConfirmed(false);
		}
  };

	const handleToggleReadStatus = async (notificationId: number) => {
		const notification = notifications.find((item) => item.id === notificationId);

		if (!notification) {
			return;
		}

		setMarkingAsReadIds((current) =>
			current.includes(notificationId)
				? current
				: [...current, notificationId],
		);

		try {
			if (notification.leida) {
				await markAsUnread(notificationId);
				return;
			}

			await markAsRead(notificationId);
		} finally {
			setMarkingAsReadIds((current) =>
				current.filter((id) => id !== notificationId),
			);
		}
	};
	
	const handleMarkSelectedAsRead = async () => {
		const unreadSelectedIds = selectedIds.filter((notificationId) => {
			const notification = notifications.find((item) => item.id === notificationId);
			return notification && !notification.leida;
		});

		if (unreadSelectedIds.length === 0) {
			return;
		}

		setMarkingAsReadIds((current) =>
			Array.from(new Set([...current, ...unreadSelectedIds])),
		);

		try {
			await Promise.all(
				unreadSelectedIds.map((notificationId) => markAsRead(notificationId)),
			);

			setSelectedIds([]);
			setIsSelectionMode(false);
		} finally {
			setMarkingAsReadIds((current) =>
				current.filter((id) => !unreadSelectedIds.includes(id)),
			);
		}
	};

	const handleMarkSelectedAsUnread = async () => {
		const readSelectedIds = selectedIds.filter((notificationId) => {
			const notification = notifications.find((item) => item.id === notificationId);
			return notification && notification.leida;
		});

		if (readSelectedIds.length === 0) {
			return;
		}

		setMarkingAsReadIds((current) =>
			Array.from(new Set([...current, ...readSelectedIds])),
		);

		try {
			await Promise.all(
				readSelectedIds.map((notificationId) => markAsUnread(notificationId)),
			);

			setSelectedIds([]);
			setIsSelectionMode(false);
		} finally {
			setMarkingAsReadIds((current) =>
				current.filter((id) => !readSelectedIds.includes(id)),
			);
		}
	};

	const emptySubtitle = search.trim()
		? 'No se encontraron notificaciones que coincidan con tu búsqueda.'
		: 'Cuando existan notificaciones para esta sección, aparecerán aquí.';

	if (isLoading && notifications.length === 0) {
		return (
			<main className="notifications-page">
				<LoadingState message="Cargando notificaciones..." />
			</main>
		);
	}

	if (error && notifications.length === 0) {
		return (
			<main className="notifications-page">
				<ErrorState
					title="No se pudieron cargar las notificaciones"
					message={error}
					actionLabel="Reintentar"
					onAction={refetch}
				/>
			</main>
		);
	}

		return (
    <main className="notifications-page">
      <section className="notifications-page__header">
        <div>
          <h1 className="notifications-page__title">Notificaciones</h1>
          <p className="notifications-page__description">
            Consulta tus avisos recientes y administra cuáles ya leíste.
          </p>
        </div>

        <NotificationTabs
          activeTab={activeTab}
          totalCount={notifications.length}
          unreadCount={unreadCount}
          readCount={readCount}
          onChange={handleTabChange}
        />
      </section>

			{notifications.length > 0 && (
				<section className="notifications-page__toolbar">
					<div className="notifications-page__search">
						<SearchBarComponent
							infoText="Buscar notificación por nombre o descripción..."
							onChange={setSearch}
							fontSize="0.95rem"
							height="48px"
						/>
					</div>

					<div className="notifications-page__toolbar-actions">
						{!isSelectionMode ? (
							<button
								type="button"
								className="notifications-page__toolbar-button"
								onClick={handleStartSelection}
							>
								Seleccionar
							</button>
						) : (
							<>
								<button
									type="button"
									className="notifications-page__toolbar-button"
									onClick={handleToggleSelectAll}
								>
									{areAllFilteredSelected
										? 'Quitar selección'
										: 'Seleccionar todas'}
								</button>

								<span className="notifications-page__selection-count">
									{selectedIds.length} seleccionada
									{selectedIds.length === 1 ? '' : 's'}
								</span>

								<button
									type="button"
									className="notifications-page__toolbar-button notifications-page__toolbar-button--danger"
									onClick={handleRequestDeleteSelected}
									disabled={selectedIds.length === 0}
								>
									Eliminar seleccionadas
								</button>

								<button
									type="button"
									className="notifications-page__toolbar-button notifications-page__toolbar-button--success"
									onClick={handleMarkSelectedAsRead}
									disabled={unreadSelectedCount === 0}
								>
									Marcar leídas
								</button>

								<button
									type="button"
									className="notifications-page__toolbar-button"
									onClick={handleMarkSelectedAsUnread}
									disabled={readSelectedCount === 0}
								>
									Marcar no leídas
								</button>

								<button
									type="button"
									className="notifications-page__toolbar-button"
									onClick={handleClearSelection}
								>
									Cancelar
								</button>
							</>
						)}
					</div>
				</section>
			)}

      <section className="notifications-page__content">
        {filteredNotifications.length === 0 ? (
					<EmptyState
						icon={<BellIcon className="notifications-page__empty-icon" />}
						title={emptyTitle}
						subtitle={emptySubtitle}
					/>
        ) : (
					<NotificationList
						notifications={filteredNotifications}
						userTimeZone={userContext?.timeZone ?? 'UTC'}
						markingAsReadIds={markingAsReadIds}
						deletingIds={deletingIds}
						selectedIds={selectedIds}
						isSelectionMode={isSelectionMode}
						onToggleSelected={handleToggleSelected}
						onToggleReadStatus={handleToggleReadStatus}
						onDelete={handleRequestDeleteOne}
					/>
        )}
      </section>

      <ConfirmDialog
        isOpen={pendingDeleteIds.length > 0}
        title={
          pendingDeleteIds.length === 1
            ? 'Eliminar notificación'
            : 'Eliminar notificaciones'
        }
        message={
          pendingDeleteIds.length === 1
            ? '¿Seguro que quieres eliminar esta notificación? Esta acción no se puede deshacer.'
            : `¿Seguro que quieres eliminar ${pendingDeleteIds.length} notificaciones? Esta acción no se puede deshacer.`
        }
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        isLoading={isDeletingConfirmed}
        icon={<TrashIcon />}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </main>
  );
}