import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/features/auth/pages/LogInPage';
import ProfilePage from '@/features/profile/pages';
import UserDashboardPage from '@/features/user/pages/DashboardPage';
import EmailVerificationPage from '@/features/verification/pages/EmailVerification';
import AppLayoutHs from '@/shared/layout/AppLayoutHs';
import AdminPage from '@/features/admin/pages/adminPage';
import ProjectPage from '@/features/projects/pages/ProjectsPage'
import ProjectTask from '@/features/projects/pages/ProjectTasks'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/perfil" replace />} />

      <Route element={<AppLayoutHs />}>
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/dashboard-usuario" element={<UserDashboardPage />}/>
        <Route path="/projects" element={<ProjectPage />}/>
        <Route path="/projects/dummy" element={<ProjectTask />}/>
      </Route>

      <Route path="/inicio-sesion" element={<LoginPage />} />
      <Route path="/correo-verificacion" element={<EmailVerificationPage />} />
      <Route path="/usuarios" element={<AdminPage />} />
    </Routes>
  );
}