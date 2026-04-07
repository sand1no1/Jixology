import React from 'react';
import type { ReactNode } from 'react';
import './Sidebar.css';
import { 
  BeakerIcon,
  UserCircleIcon,
  LockClosedIcon
} from '@heroicons/react/24/solid';

export interface ISidebarProps {
  children?: ReactNode;
}

const Sidebar: React.FC<ISidebarProps> = () => {
  return (
    <nav>
      <div className="header">
        <div className="headerMain">
          <img src="../../TechMahindraLogo.png" />
          <span>Proyecto Principal</span>
        </div>
      </div>

      <aside className="sidebar">
        <ul className="menu">
          <li className="menuItem">
            <a href="#">
              <UserCircleIcon className="icon" />
              <span><b>Perfil</b></span>
            </a>
          </li>
          <li className="menuItem">
            <a href="#">
              <BeakerIcon className="icon" />
              <span><b>Proyectos</b></span>
            </a>
          </li>
          <li className="menuItem">
            <a href="#">
              <LockClosedIcon className="icon" />
              <span><b>Verificación</b></span>
            </a>
          </li>
        </ul>
      </aside>
    </nav>
  );
};

export default Sidebar;