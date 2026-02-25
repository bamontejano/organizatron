import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Layout
import Sidebar from './components/Sidebar';

// Auth
import AuthPage from './pages/AuthPage';

// Pages
import TeenDashboard from './pages/TeenDashboard';
import ParentDashboard from './pages/ParentDashboard';
import Planner from './pages/Planner';
import Pomodoro from './pages/Pomodoro';
import Economy from './pages/Economy';
import Library from './pages/Library';
import Badges from './pages/Badges';
import Pactos from './pages/Pactos';
import IAPersonal from './pages/IAPersonal';
import Examenes from './pages/Examenes';
import HeatmapPage from './pages/HeatmapPage';
import Temporada from './pages/Temporada';
import MiClase from './pages/MiClase';
import ClassroomPage from './pages/ClassroomPage';
import RewardsPage from './pages/RewardsPage';
import PerfilPage from './pages/PerfilPage';

// ── Loading spinner ───────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      gap: 20,
    }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: 16,
        background: 'linear-gradient(135deg, #7c3aed, #f59e0b)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 28,
        animation: 'pulse 1.5s ease-in-out infinite',
      }}>📡</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-muted)' }}>Cargando Focus Family…</div>
    </div>
  );
}

// ── Protected layout (requires auth) ─────────────────────────────────────────
function AppLayout() {
  const { authUser, loading, userRole } = useApp();

  // While Firebase checks auth state
  if (loading || authUser === undefined) return <LoadingScreen />;

  // Not logged in → show auth page
  if (!authUser) return <AuthPage />;

  // Logged in but profile not loaded yet
  if (!userRole) return <LoadingScreen />;

  const Dashboard = userRole === 'parent' ? ParentDashboard : TeenDashboard;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/economy" element={<Economy />} />
          <Route path="/library" element={<Library />} />
          <Route path="/badges" element={<Badges />} />
          <Route path="/pactos" element={<Pactos />} />
          <Route path="/ia" element={<IAPersonal />} />
          <Route path="/examenes" element={<Examenes />} />
          <Route path="/heatmap" element={<HeatmapPage />} />
          <Route path="/temporada" element={<Temporada />} />
          <Route path="/clase" element={<MiClase />} />
          <Route path="/classroom" element={<ClassroomPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </BrowserRouter>
  );
}
