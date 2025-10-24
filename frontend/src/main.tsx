import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Loading from './components/Loading';

interface ProtectedRoute {
  path: string;
  component: React.LazyExoticComponent<React.FC>;
}

interface UnprotectedRoute {
  path: string;
  component: React.LazyExoticComponent<React.FC>;
}

const protectedroutes: ProtectedRoute[] = [
  // home pages
  { path: '/homes/system-admin', component: lazy(() => import('./pages/homes/SystemAdminHome')) },
  { path: '/homes/basetype-admin', component: lazy(() => import('./pages/homes/BasetypeAdminHome')) },
  { path: '/homes/hr-admin', component: lazy(() => import('./pages/homes/HrAdminHome')) },
  { path: '/homes/organization-admin', component: lazy(() => import('./pages/homes/OrganizationAdminHome')) },
  { path: '/homes/organization-user', component: lazy(() => import('./pages/homes/OrganizationUserHome')) },
  { path: '/homes/person-user', component: lazy(() => import('./pages/homes/PersonUserHome')) },
  // profile pages
  { path: '/profiles/person-user', component: lazy(() => import('./pages/profiles/PersonUserProfile')) },
  { path: '/profiles/hr-admin', component: lazy(() => import('./pages/profiles/HrAdminProfile')) },
  { path: '/profiles/organization-admin', component: lazy(() => import('./pages/profiles/OrganizationAdminProfile')) },
  { path: '/profiles/organization-user', component: lazy(() => import('./pages/profiles/OrganizationUserProfile')) },
  { path: '/profiles/basetype-admin', component: lazy(() => import('./pages/profiles/BasetypeAdminProfile')) },
  { path: '/profiles/system-admin', component: lazy(() => import('./pages/profiles/SystemAdminProfile')) },
  // layer account
  { path: '/users', component: lazy(() => import('./pages/layer_account/Users')) },
  { path: '/users/:param', component: lazy(() => import('./pages/layer_account/UserDetail')) },
  { path: '/users-history', component: lazy(() => import('./pages/layer_history/UserHistory')) },
  // layer info
  { path: '/persons', component: lazy(() => import('./pages/layer_informataions/Persons')) },
  { path: '/persons/:param', component: lazy(() => import('./pages/layer_informataions/PersonDetail')) },
  { path: '/persons-history', component: lazy(() => import('./pages/layer_history/PersonHistory')) },
  { path: '/organizations', component: lazy(() => import('./pages/layer_informataions/Organizations')) },
  { path: '/organizations/:param', component: lazy(() => import('./pages/layer_informataions/OrganizationDetail')) },
  { path: '/organizations-history', component: lazy(() => import('./pages/layer_history/OrganizationHistory')) },
  // layer type
  { path: '/gender-type', component: lazy(() => import('./pages/layer_types/GenderType')) },
  { path: '/gender-type/:param', component: lazy(() => import('./pages/layer_types/GenderTypeDetail')) },
  { path: '/communication-event-purpose-type', component: lazy(() => import('./pages/layer_types/CommunicationEventPurposeType')) },
  { path: '/communication-event-purpose-type/:param', component: lazy(() => import('./pages/layer_types/CommunicationEventPurposeTypeDetail')) },
  { path: '/communication-event-status-type', component: lazy(() => import('./pages/layer_types/CommunicationEventStatusType')) },
  { path: '/communication-event-status-type/:param', component: lazy(() => import('./pages/layer_types/CommunicationEventStatusTypeDetail')) },
  { path: '/contact-mechanism-type', component: lazy(() => import('./pages/layer_types/ContactMechanismType')) },
  { path: '/contact-mechanism-type/:param', component: lazy(() => import('./pages/layer_types/ContactMechanismTypeDetail')) },
  { path: '/country', component: lazy(() => import('./pages/layer_types/Country')) },
  { path: '/country/:param', component: lazy(() => import('./pages/layer_types/CountryDetail')) },
  { path: '/income-range', component: lazy(() => import('./pages/layer_types/IncomeRange')) },
  { path: '/income-range/:param', component: lazy(() => import('./pages/layer_types/IncomeRangeDetail')) },
  { path: '/industry-type', component: lazy(() => import('./pages/layer_types/IndustryType')) },
  { path: '/industry-type/:param', component: lazy(() => import('./pages/layer_types/IndustryTypeDetail')) },
  { path: '/marital-status-type', component: lazy(() => import('./pages/layer_types/MaritalStatusType')) },
  { path: '/marital-status-type/:param', component: lazy(() => import('./pages/layer_types/MaritalStatusTypeDetail')) },
  { path: '/organization-type', component: lazy(() => import('./pages/layer_types/OrganizationType')) },
  { path: '/organization-type/:param', component: lazy(() => import('./pages/layer_types/OrganizationTypeDetail')) },
  { path: '/racial-type', component: lazy(() => import('./pages/layer_types/RacialType')) },
  { path: '/racial-type/:param', component: lazy(() => import('./pages/layer_types/RacialTypeDetail')) },
  // layer communication
  { path: '/communication-events', component: lazy(() => import('./pages/layer_communications/CommunicationEvent')) },
  { path: '/communication-events/:param', component: lazy(() => import('./pages/layer_communications/CommunicationEventDetail')) },
  { path: '/communication-events-history', component: lazy(() => import('./pages/layer_history/CommunicationEventHistory')) },
];

const unprotectedroutes: UnprotectedRoute[] = [
  { path: '/', component: lazy(() => import('./pages/RootPage')) },
  { path: '/login', component: lazy(() => import('./pages/login/Login')) },
  { path: '/register', component: lazy(() => import('./pages/register/Register')) },
];

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <Routes>
              {unprotectedroutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<route.component />}
                />
              ))}
              {protectedroutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <ProtectedRoute>
                      <route.component />
                    </ProtectedRoute>
                  }
                />
              ))}
              <Route path="*" element={<h1>404 Not Found</h1>} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);