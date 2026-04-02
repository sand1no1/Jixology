import React from 'react';
import type { ReactNode } from 'react';
import Profile from '@/features/profile/pages';
import './Sidebar.css';

export interface ISidebarProps {
  children?: ReactNode;
}

const Sidebar: React.FC<ISidebarProps> = ({ children }) => {
  return (<>
  <div id="MainPageBelow">
    <div id="Sidebar">
    <label>SidebarXD</label>
  </div>
  </div>
  </>);
};

export default Sidebar;