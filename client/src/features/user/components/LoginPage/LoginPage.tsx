import type { ReactNode, FC } from 'react';
import './LoginPage.css';
import '../../../../common/ui/ButtonComponent'


export interface ILoginPageProps {
  children?: ReactNode;
}

const LoginPage: FC<ILoginPageProps> = ({ children }) => {
  return (
    <div className="login-page">
      {children}
    </div>
  );
};

export default LoginPage;