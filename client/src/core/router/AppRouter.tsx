import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/features/auth/pages/LogInPage';
import ProfilePage from '@/features/profile/pages';
import UserDashboardPage from '@/features/user/pages/DashboardPage';
import HeaderView from "@/shared/components/MainNavigation/Header"
import SidebarView from "@/shared/components/MainNavigation/Sidebar"

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/profile" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/user" element={<UserDashboardPage />}/>
      <Route path="/header" element={<HeaderView />}/>
      <Route path="/sidebar" element={<SidebarView />}/>
    </Routes>
  );
}