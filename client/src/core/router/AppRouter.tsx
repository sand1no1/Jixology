import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/features/auth/pages/LogInPage';
import ProfilePage from '@/features/profile/pages';
import UserDashboardPage from '@/features/user/pages/DashboardPage';
import SidebarView from "@/shared/components/MainNavigation/Sidebar"
import EmailVerificationPage from '@/features/verification/pages/EmailVerification';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/perfil" replace />} />
      <Route path="/inicio-sesion" element={<LoginPage />} />
      <Route path="/perfil" element={<ProfilePage />} />
      <Route path="/dashboard-usuario" element={<UserDashboardPage />}/>
      <Route path="/correo-verificacion" element={<EmailVerificationPage />} />
      <Route path="/sidebar" element={<SidebarView />} />
    </Routes>
  );
}