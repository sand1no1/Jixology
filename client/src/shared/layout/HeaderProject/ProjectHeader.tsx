import React from 'react';
import styles from './ProjectHeader.module.css';

const Header: React.FC = () => {
  return (
    <div className={styles.headerP}>
      <a href="/proyectos/dummy/tasks"><div className={styles.element}>
        <label>Elemento 1</label>
      </div></a>
      <a href="/proyectos/dummy/tasks"><div className={styles.element}>
        <label>Elemento 2</label>
      </div></a>
      <a href="/proyectos/dummy/tasks"><div className={styles.element}>
        <label>Elemento 3</label>
      </div></a>
      <a href="/proyectos/dummy/tasks"><div className={styles.element}>
        <label>Elemento 4</label>
      </div></a>
    </div>
  );
};

export default Header;