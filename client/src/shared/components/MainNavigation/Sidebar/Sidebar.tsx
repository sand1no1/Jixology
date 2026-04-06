import React from 'react';
import type { ReactNode } from 'react';
import Profile from '@/features/profile/pages';
import './Sidebar.css';

export interface ISidebarProps {
  children?: ReactNode;
}

const Sidebar: React.FC<ISidebarProps> = ({ children }) => {
  return (<>
    <nav>
      <div className="Header">
        <div className="HeaderMain">
          <img src="../../TechMahindraLogo.png"></img>
          <span><b>Proyecto Principal</b></span>
        </div>
      </div>
      

      <div className="Sidebar">
          <div className="SidebarHeader">
            <span className="SidebarImage">
              <img src="../../TechMahindraLogoSmall.png"></img>
            </span>
            <div className="SidebarMainTitle">
              <span className="SidebarTitle"><b>Jixology Devsys</b></span>
              <span className="SidebarSubtitle">Tech Mahindra's Development Environment</span>
            </div>
          </div>
      </div>

      
    </nav>
  </>);
};

export default Sidebar;