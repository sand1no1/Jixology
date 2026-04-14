import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/features/auth/pages/LogInPage';
import ProfilePage from '@/features/profile/pages';
import UserDashboardPage from '@/features/user/pages/DashboardPage';
import EmailVerificationPage from '@/features/verification/pages/EmailVerification';
import AppLayoutHs from '@/shared/layout/AppLayoutHs';
import AdminPage from '@/features/admin/pages/adminPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/inicio-sesion" replace />} />

      <Route element={<AppLayoutHs />}>
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/dashboard-usuario" element={<UserDashboardPage />}/>
        <Route path="/usuarios" element={<AdminPage />} />
      </Route>

      <Route path="/inicio-sesion" element={<LoginPage />} />
      <Route path="/correo-verificacion" element={<EmailVerificationPage />} />
    </Routes>
  );
}