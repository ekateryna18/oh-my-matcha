import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { initConsents } from './lib/ConsentManager';
import { CookieBanner } from './components/CookieBanner';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

import Home from './pages/Home';
import Menu from './pages/Menu';
import Customization from './pages/Customization';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import OrderSuccess from './pages/OrderSuccess';
import OrderCancel from './pages/OrderCancel';
import Account from './pages/Account';
import LoyaltyDashboard from './pages/LoyaltyDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import LegalNotice from './pages/LegalNotice';
import CookiePolicy from './pages/CookiePolicy';

function App() {
  useEffect(() => {
    initConsents();
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Always rendered — self-hides once consent is stored */}
        <CookieBanner />

        <Routes>
          <Route element={<Layout />}>
            {/* Public */}
            <Route index element={<Home />} />
            <Route path="menu" element={<Menu />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* Legal — public */}
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsOfService />} />
            <Route path="legal" element={<LegalNotice />} />
            <Route path="cookies" element={<CookiePolicy />} />

            {/* Protected */}
            <Route path="menu/:id/customize" element={<ProtectedRoute><Customization /></ProtectedRoute>} />
            <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
            <Route path="order/success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
            <Route path="order/cancel" element={<ProtectedRoute><OrderCancel /></ProtectedRoute>} />
            <Route path="account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
            <Route path="account/loyalty" element={<ProtectedRoute><LoyaltyDashboard /></ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
