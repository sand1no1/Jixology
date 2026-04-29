import type { FC } from 'react';
import { useUser } from '@/core/auth/userContext';
import { useUserDashboardData } from '../hooks/useUserDashboardData';
import StatusDonut from '../components/StatusDonut';
import HoursBySprintBar from '../components/HoursBySprintBar';
import ItemsByTypeBar from '../components/ItemsByTypeBar';
import PriorityBar from '../components/PriorityBar';
import ComplexityScatter from '../components/ComplexityScatter';
import OverdueCard from '../components/OverdueCard';
import styles from './UserDashboard.module.css';

const UserDashboard: FC = () => {
  const { user } = useUser();
  const { data, loading, error } = useUserDashboardData();

  const firstName = user?.nombre ?? 'Usuario';

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.center}>Cargando dashboard…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.errorBox}>Error al cargar los datos: {error}</div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.greeting}>Hola, {firstName}</p>
        <p className={styles.subtitle}>Resumen de tus ítems asignados</p>
      </header>

      <div className={styles.statRow}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{data.totalItems}</div>
          <div className={styles.statLabel}>Total asignados</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{data.overdueItems.length}</div>
          <div className={styles.statLabel}>Vencidos</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{data.scatterData.length}</div>
          <div className={styles.statLabel}>Con estimación</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {data.sprintHours.reduce((acc, s) => acc + s.horas, 0)}h
          </div>
          <div className={styles.statLabel}>Horas totales</div>
        </div>
      </div>

      <div className={styles.grid}>
        <StatusDonut       data={data.statusData}    />
        <HoursBySprintBar  data={data.sprintHours}   />
        <ItemsByTypeBar    data={data.typeData}       />
        <PriorityBar       data={data.priorityData}  />
        <ComplexityScatter data={data.scatterData}   />
        <OverdueCard       items={data.overdueItems} />
      </div>
    </div>
  );
};

export default UserDashboard;
