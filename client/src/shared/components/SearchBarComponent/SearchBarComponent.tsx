import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import styles from './SearchBarComponent.module.css';

export interface ISearchBarComponentProps {
  infoText: string;
  onChange?: (value: string) => void;
  fontSize?: string;
  height?: string;
}


// UTILIZACION: <SearchBarComponent infoText="Buscar..." onChange={(val) =>  AQUI VA UNA FUNCION, ACCION, ETC.} />
const SearchBarComponent: React.FC<ISearchBarComponentProps> = ({ infoText, onChange, fontSize = '1rem', height = 'auto' }) => {
  const [value, setValue] = useState('');

  return (
    <div className={styles.container} style={{ fontSize, height }}>
      <MagnifyingGlassIcon className={styles.magnifyingIcon}/>
      <input
        className={`${styles.input} ${value ? styles.inputActive : ''}`}
        type="text"
        placeholder={infoText as string}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange?.(e.target.value);
        }}
      />
    </div>
  );
};

export default SearchBarComponent;
