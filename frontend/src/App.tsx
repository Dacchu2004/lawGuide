// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import LibraryPage from "./pages/LibraryPage";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950 text-white">
        Checking session...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ PUBLIC */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* ✅ PROTECTED */}
        <Route
          path="/home"
          element={user ? <HomePage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/chat"
          element={user ? <ChatPage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/library"
          element={user ? <LibraryPage /> : <Navigate to="/auth" />}
        />
      </Routes>
    </BrowserRouter>
  );
}
