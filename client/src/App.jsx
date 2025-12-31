import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import PageTransition from './components/PageTransition';
import AppIntro from './components/AppIntro';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPageNew from './pages/LoginPageNew';
import RegisterPageNew from './pages/RegisterPageNew';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import TransparencyPage from './pages/TransparencyPage';
import OverdueIssuesPage from './pages/OverdueIssuesPage';
import GrievanceFormPage from './pages/GrievanceFormPage';
import CommunityPage from './pages/CommunityPage.jsx';
import BudgetTransparencyPage from './pages/BudgetTransparencyPage';
import TrackPage from './pages/TrackPage';
import PerformancePage from './pages/PerformancePage';
import StatusPage from './pages/StatusPage';
import './index.css';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <HomePage />
            </PageTransition>
          }
        />
        <Route
          path="/transparency"
          element={
            <PageTransition>
              <TransparencyPage />
            </PageTransition>
          }
        />
        <Route
          path="/transparency/issues"
          element={
            <PageTransition>
              <OverdueIssuesPage />
            </PageTransition>
          }
        />
        <Route
          path="/transparency/budget"
          element={
            <PageTransition>
              <BudgetTransparencyPage />
            </PageTransition>
          }
        />
        <Route
          path="/file-grievance"
          element={
            <PageTransition>
              <GrievanceFormPage />
            </PageTransition>
          }
        />
        <Route
          path="/community"
          element={
            <PageTransition>
              <CommunityPage />
            </PageTransition>
          }
        />
        <Route
          path="/track"
          element={
            <PageTransition>
              <TrackPage />
            </PageTransition>
          }
        />
        <Route
          path="/performance"
          element={
            <PageTransition>
              <PerformancePage />
            </PageTransition>
          }
        />
        <Route
          path="/status"
          element={
            <PageTransition>
              <StatusPage />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <LoginPageNew />
            </PageTransition>
          }
        />
        <Route
          path="/register"
          element={
            <PageTransition>
              <RegisterPageNew />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <PageTransition>
                <DashboardPage />
              </PageTransition>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <PageTransition>
                <AdminPage />
              </PageTransition>
            </PrivateRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [showIntro, setShowIntro] = React.useState(true);

  return (
    <Router>
      <AppIntro show={showIntro} onDone={() => setShowIntro(false)} />
      <Navbar />
      <AnimatedRoutes />
      <Footer />
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </Router>
  );
}
