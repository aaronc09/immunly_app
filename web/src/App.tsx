import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StreakSaver from './components/StreakSaver';
// import IntroVideo from './components/IntroVideo';
import WelcomeIntro from './components/WelcomeIntro';
import PageTransition from './components/PageTransition';
import ScrollEffects from './components/ScrollEffects';
import ImmunoBot from './components/ImmunoBot';
import CookieConsent from './components/CookieConsent';
import { PageSkeleton } from './components/Skeleton';
import HomePage from './pages/HomePage';

// Every page except the landing page is downloaded on first visit, with a
// skeleton shown meanwhile. This keeps the initial download small.
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const ModulePage = lazy(() => import('./pages/ModulePage'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const ProgressPage = lazy(() => import('./pages/ProgressPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ReferencePage = lazy(() => import('./pages/ReferencePage'));
const ResearchPage = lazy(() => import('./pages/ResearchPage'));
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ProgressProvider>
            <WelcomeIntro />
            {/* <IntroVideo /> */}
            <Navbar />
            <ScrollEffects />
            <StreakSaver />
            <PageTransition>
              <Suspense fallback={<PageSkeleton />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route path="/module/:moduleId" element={<ModulePage />} />
                  <Route path="/module/:moduleId/lesson/:lessonId" element={<LessonPage />} />
                  <Route path="/reference" element={<ReferencePage />} />
                  <Route path="/research" element={<ResearchPage />} />
                  <Route path="/progress" element={<ProgressPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/cookies" element={<CookiePolicyPage />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  {/* Catch-all */}
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </Suspense>
            </PageTransition>
            <Footer />
            <CookieConsent />
            <ImmunoBot />
          </ProgressProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
