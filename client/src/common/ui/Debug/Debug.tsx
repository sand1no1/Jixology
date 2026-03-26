import React from 'react';
import type { ReactNode } from 'react';

export interface IDebugProps {
  data: unknown;
  label?: string;
  children?: ReactNode;
}

const Debug: React.FC<IDebugProps> = ({ data, label, children }) => {
  if (import.meta.env.PROD) return null;

  return (
    <details open style={{ margin: '8px 0' }}>
      <summary style={{ cursor: 'pointer', fontWeight: 'bold', fontFamily: 'monospace' }}>
        {label ?? 'Debug'}
      </summary>
      <pre
        style={{
          background: '#1e1e1e',
          color: '#d4d4d4',
          padding: '12px',
          borderRadius: '4px',
          fontSize: '12px',
          overflowX: 'auto',
          margin: '4px 0',
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
      {children}
    </details>
  );
};

export default Debug;
