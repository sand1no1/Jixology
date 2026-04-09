import React from 'react';
import styles from './Header.module.css';
import logo from '@/assets/images/TechMahindraLogo.png';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <img src={logo} className={styles.logo} />
        <span className={styles.title}>Proyecto Principal</span>
      </div>
    </header>
  );
};

export default Header;