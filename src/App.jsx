import { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Sidebar } from './components/layout/Sidebar';
import { MobileSidebar } from './components/layout/MobileSidebar';
import { Header } from './components/layout/Header';
import { useFinance } from './context/FinanceContext';

import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import CalendarPage from './pages/Calendar';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar />
      <MobileSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="app-main">
        <Header onMenuClick={() => setMobileNavOpen(true)} />
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  const { theme } = useFinance();

  return (
    <>
      <Toaster theme={theme} richColors position="top-right" closeButton />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
