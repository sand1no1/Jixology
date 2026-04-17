import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from '@/core/auth/userContext';



type Props = {
  children: React.ReactNode;
};

export function AppProviders({ children }: Props) {
  return (
    <BrowserRouter>
      <UserProvider>
        {children}
      </UserProvider>
    </BrowserRouter>
  );
}