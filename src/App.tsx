import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useLocation,
  Link as RouterLink,
} from "react-router-dom";
import type { ReactNode } from "react";
import { useEffect } from "react";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import Navbar from "./components/layout/Navbar";
import { NeonAuthUIProvider } from "@neondatabase/neon-js/auth/react";
import { authClient } from "./lib/auth";
import AuthProvider, { useAuth } from "./context/AuthContext";

function AuthSessionSync() {
  const location = useLocation();
  const { refreshAuth } = useAuth();

  useEffect(() => {
    refreshAuth();
  }, [location.pathname, refreshAuth]);

  return null;
}

function NeonRouterLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <RouterLink to={href} className={className}>
      {children}
    </RouterLink>
  );
}

function AppRoutes() {
  const navigate = useNavigate();

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      defaultTheme="dark"
      navigate={navigate}
      Link={NeonRouterLink}
    >
      <AuthProvider>
        <AuthSessionSync />

        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route index element={<Home />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/auth/:pathname" element={<Auth />} />
              <Route path="/account/:pathname" element={<Account />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </NeonAuthUIProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
