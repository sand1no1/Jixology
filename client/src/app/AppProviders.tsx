import { BrowserRouter } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

export function AppProviders({ children }: Props) {
  return (
    <BrowserRouter>
      {children}
      {/*<AuthProvider>{children}</AuthProvider>*/}
    </BrowserRouter>
  );
}