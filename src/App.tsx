// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';

import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import RewardsPage from './pages/RewardsPage';
import AdminPage from './pages/AdminPage';
import CustomerDashboardPage from './pages/CustomerDashboardPage';
import DashboardRouter from './pages/DashboardRouter';
import AuthCallbackPage from './pages/AuthCallbackPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          <Route path="/dashboard" element={<DashboardRouter />} />

          <Route path="/dashboard/customer" element={<CustomerDashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />

          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
