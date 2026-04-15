import { AppProviders } from './AppProviders';
import { AppRouter } from '@/core/router/AppRouter';

export default function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}