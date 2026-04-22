import { Routes, Route, Navigate } from 'react-router-dom';

// --- Páginas ---
import LoginPage from '@/features/auth/pages/LogInPage';
import ProfilePage from '@/features/profile/pages';
import UserDashboardPage from '@/features/user/pages/DashboardPage';
import EmailVerificationPage from '@/features/verification/pages/EmailVerification';
import AdminPage from '@/features/admin/pages/adminPage';
import ProjectPage from '@/features/projects/pages/ProjectsPage';
import ProjectTask from '@/features/projects/pages/ProjectTasks';
import AdminUserProfilePage from '@/features/admin/pages/adminUserProfilePage/AdminUserProfilePage';

// --- Layout ---
import AppLayoutHs from '@/shared/layout/AppLayoutHs';

// --- Router ---
import { ProtectedRoute } from '@/core/router/ProtectedRoute';

const ALL_ROLES = [1, 2, 3, 4];
const ADMIN_VIEWS = [1,2];

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/inicio-sesion" replace />} />

      <Route element={<ProtectedRoute allowedRoles={ALL_ROLES} />}>
        <Route element={<AppLayoutHs />}>
          <Route path="/perfil"            element={<ProfilePage />} />
          <Route path="/dashboard-usuario" element={<UserDashboardPage />} />
          <Route element={<ProtectedRoute allowedRoles={ADMIN_VIEWS} />}>
            <Route path="/usuarios" element={<AdminPage />} />
            <Route path="/usuarios/:id" element={<AdminUserProfilePage />} />
          </Route>
          <Route path="/proyectos"         element={<ProjectPage />} />
          <Route path="/proyectos/dummy"   element={<ProjectTask />} />
        </Route>
      </Route>

      <Route path="/inicio-sesion"        element={<LoginPage />} />
      <Route path="/correo-verificacion"  element={<EmailVerificationPage />} />
    </Routes>
  );
}