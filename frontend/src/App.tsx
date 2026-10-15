import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import A01Login from './pages/admin/A01Login';
import A02Dashboard from './pages/admin/A02Dashboard';
import A03Exhibitions from './pages/admin/A03Exhibitions';
import A04Artworks from './pages/admin/A04Artworks';
import A05Map from './pages/admin/A05Map';
import A06Members from './pages/admin/A06Members';
import AdminLayout from './pages/admin/AdminLayout';
import ScreenIndex from './pages/ScreenIndex';
import U01Start from './pages/user/U01Start';
import U02LoginChoice from './pages/user/U02LoginChoice';
import U03Login from './pages/user/U03Login';
import U04Signup from './pages/user/U04Signup';
import U05Taste from './pages/user/U05Taste';
import U06SavedTaste from './pages/user/U06SavedTaste';
import U07Time from './pages/user/U07Time';
import U08Recommend from './pages/user/U08Recommend';
import U09Route from './pages/user/U09Route';
import U10View from './pages/user/U10View';
import U11Ask from './pages/user/U11Ask';
import U12Receipt from './pages/user/U12Receipt';
import U13History from './pages/user/U13History';
import U14ForgotPassword from './pages/user/U14ForgotPassword';
import U15ResetPassword from './pages/user/U15ResetPassword';
import { AuthProvider } from './store/AuthContext';
import { VisitProvider } from './store/VisitContext';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <VisitProvider>
          <Routes>
            {/* 사용자 모바일 웹 */}
            <Route path="/" element={<U01Start />} />
            <Route path="/exhibition/:exhibitionId" element={<U01Start />} />
            <Route path="/start" element={<U02LoginChoice />} />
            <Route path="/login" element={<U03Login />} />
            <Route path="/signup" element={<U04Signup />} />
            <Route path="/taste" element={<U05Taste />} />
            <Route path="/taste/saved" element={<U06SavedTaste />} />
            <Route path="/time" element={<U07Time />} />
            <Route path="/recommend" element={<U08Recommend />} />
            <Route path="/route" element={<U09Route />} />
            <Route path="/view" element={<U10View />} />
            <Route path="/ask" element={<U11Ask />} />
            <Route path="/receipt" element={<U12Receipt />} />
            <Route path="/history" element={<U13History />} />
            <Route path="/history/:recordId" element={<U12Receipt />} />
            <Route path="/forgot-password" element={<U14ForgotPassword />} />
            <Route path="/reset-password" element={<U15ResetPassword />} />

            {/* 관리자 데스크톱 웹 */}
            <Route path="/admin/login" element={<A01Login />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<A02Dashboard />} />
              <Route path="exhibitions" element={<A03Exhibitions />} />
              <Route path="artworks" element={<A04Artworks />} />
              <Route path="artworks/:artworkId" element={<A04Artworks />} />
              <Route path="map" element={<A05Map />} />
              <Route path="members" element={<A06Members />} />
            </Route>

            <Route path="/screens" element={<ScreenIndex />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </VisitProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
