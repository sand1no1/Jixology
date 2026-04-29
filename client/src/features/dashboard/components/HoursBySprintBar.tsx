import type { FC } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { SprintHours } from '../hooks/useUserDashboardData';
import styles from './ChartCard.module.css';

interface Props {
  data: SprintHours[];
}

const HoursBySprintBar: FC<Props> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className={styles.card}>
        <h3 className={styles.title}>Horas por sprint</h3>
        <p className={styles.empty}>Sin datos</p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Horas por sprint</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-clarity-gray-2)" />
          <XAxis
            dataKey="sprint"
            tick={{ fontSize: 11, fontFamily: 'Poppins, sans-serif' }}
            angle={-30}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tick={{ fontSize: 11, fontFamily: 'Poppins, sans-serif' }}
            unit="h"
          />
          <Tooltip
            formatter={(value) => [`${value}h`, 'Horas']}
            contentStyle={{ fontSize: '0.75rem', fontFamily: 'Poppins, sans-serif' }}
          />
          <Bar dataKey="horas" fill="#0A0838" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HoursBySprintBar;
