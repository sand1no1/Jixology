import React, { ReactNode } from 'react';
import './LoginPage.css';
import '../../../../common/ui/ButtonComponent'


export interface ILoginPageProps {
  children?: ReactNode;
}

const LoginPage: React.FC<ILoginPageProps> = ({ children }) => {
  return (
    <div className="login-page">
      {children}
    </div>
  );
};

export default LoginPage;