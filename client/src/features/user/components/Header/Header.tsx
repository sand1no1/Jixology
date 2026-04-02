import React from 'react';
import type { ReactNode } from 'react';
import './Header.module.css';

export interface IHeaderProps {
  children?: ReactNode;
}

const Header: React.FC<IHeaderProps> = ({ children }) => {
  return (<>
    <div>
      <label>Hola</label>
    </div>
    </>);
};

export default Header;