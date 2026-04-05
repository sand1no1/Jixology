import type { ReactNode } from 'react';
import './AuthCardLayout.css';

type AuthCardLayoutProps = {
  children: ReactNode;
};

export default function AuthCardLayout({ children }: AuthCardLayoutProps) {
  return (
    <main className="auth-card-layout">
      <div className="auth-card-layout__container">
        <section className="auth-card-layout__card">{children}</section>
      </div>
    </main>
  );
}