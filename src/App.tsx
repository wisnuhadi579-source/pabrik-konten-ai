import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "./dashboard/Dashboard";
import Login from "./auth/Login";
import { Navbar } from "./components/Navbar";
import { Landing } from "./pages/Landing";
import { Tutorial } from "./pages/Tutorial";
import { Pricing } from "./pages/Pricing";

const ProtectedRoute = ({ user, children }: any) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem("userSession");
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        if (sessionData && sessionData.loggedIn) {
          setUser(sessionData);
        }
      } catch (e) {
        console.error("Failed to parse session", e);
        localStorage.removeItem("userSession");
      }
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
