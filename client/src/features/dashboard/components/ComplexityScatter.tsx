import type { FC } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ScatterPoint } from '../hooks/useUserDashboardData';
import styles from './ChartCard.module.css';

interface Props {
  data: ScatterPoint[];
}

interface TooltipPayload {
  payload?: ScatterPoint;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;
  return (
    <div className={styles.tooltipBox}>
      <p className={styles.tooltipName}>{point.nombre}</p>
      <p>Complejidad: {point.x}</p>
      <p>Tiempo: {point.y}h</p>
    </div>
  );
}

const ComplexityScatter: FC<Props> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className={styles.card}>
        <h3 className={styles.title}>Complejidad vs tiempo</h3>
        <p className={styles.empty}>Sin datos — asigna complejidad y tiempo a tus ítems</p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Complejidad vs tiempo</h3>
      <ResponsiveContainer width="100%" height={240}>
        <ScatterChart margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-clarity-gray-2)" />
          <XAxis
            dataKey="x"
            name="Complejidad"
            type="number"
            label={{ value: 'Complejidad', position: 'insideBottom', offset: -4, fontSize: 11 }}
            tick={{ fontSize: 11, fontFamily: 'Poppins, sans-serif' }}
          />
          <YAxis
            dataKey="y"
            name="Tiempo"
            type="number"
            unit="h"
            tick={{ fontSize: 11, fontFamily: 'Poppins, sans-serif' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={data} fill="#E31837" opacity={0.8} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComplexityScatter;
