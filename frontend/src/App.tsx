import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { MainLayout } from './layouts/MainLayout';
import { Invitations } from './pages/Invitations';
import { LandingPage } from './pages/LandingPage';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';

import { ProjectWorkspace } from './pages/ProjectWorkspace';
import { ProjectOverview } from './pages/ProjectOverview';
import { ProjectBoard } from './pages/ProjectBoard';
import { ProjectMembers } from './pages/ProjectMembers';
import { ProjectActivities } from './pages/ProjectActivities';
import { ProjectChat } from './pages/ProjectChat';
import { TaskDetail } from './pages/TaskDetail';

import { Users } from './pages/Users';
import { UserProfile } from './pages/UserProfile';
import { Inbox } from './pages/Inbox';
import { Conversation } from './pages/Conversation';

import { Login } from './pages/Login';
import { Register } from './pages/Register';

import { useAuth } from './contexts/AuthContext';
import { ReactNode } from 'react';

/* ============================================================
   PRIVATE ROUTE
============================================================ */

function PrivateRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuth();

  return user ? (
    children
  ) : (
    <Navigate
      to="/login"
      replace
    />
  );
}

/* ============================================================
   PUBLIC AUTH ROUTE

   Prevents authenticated users from going back to
   Login/Register unnecessarily.
============================================================ */

function PublicAuthRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuth();

  return user ? (
    <Navigate
      to="/home"
      replace
    />
  ) : (
    children
  );
}

/* ============================================================
   APP
============================================================ */

export function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =====================================================
            PUBLIC ROUTES
        ====================================================== */}

        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={
            <PublicAuthRoute>
              <Login />
            </PublicAuthRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicAuthRoute>
              <Register />
            </PublicAuthRoute>
          }
        />

        {/* =====================================================
            AUTHENTICATED PLATFORM
        ====================================================== */}

        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >

          {/* ===================================================
              HOME
          ==================================================== */}

          <Route
            path="/home"
            element={<Home />}
          />

          {/* ===================================================
              DASHBOARD
          ==================================================== */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* ===================================================
              USERS
          ==================================================== */}

          <Route
            path="/users"
            element={<Users />}
          />

          <Route
            path="/users/:userId"
            element={<UserProfile />}
          />

          {/* ===================================================
              PRIVATE MESSAGING
          ==================================================== */}

          <Route
            path="/inbox"
            element={<Inbox />}
          />

          <Route
            path="/inbox/:conversationId"
            element={<Conversation />}
          />
          <Route
  path="/invitations"
  element={<Invitations />}
/>

          {/* ===================================================
              PROJECT WORKSPACE
          ==================================================== */}

          <Route
            path="/project/:projectId"
            element={<ProjectWorkspace />}
          >
            <Route
              index
              element={
                <Navigate
                  to="overview"
                  replace
                />
              }
            />

            <Route
              path="overview"
              element={<ProjectOverview />}
            />

            <Route
              path="board"
              element={<ProjectBoard />}
            />

            <Route
              path="members"
              element={<ProjectMembers />}
            />

            <Route
              path="activity"
              element={<ProjectActivities />}
            />

            <Route
              path="chat"
              element={<ProjectChat />}
            />

            <Route
              path="task/:taskId"
              element={<TaskDetail />}
            />
          </Route>

        </Route>

        {/* =====================================================
            CATCH ALL
        ====================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}