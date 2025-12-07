import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import LibraryPage from "./pages/LibraryPage";
import ProtectedRoute from "./components/ProtectedRoute";
import HomeLayout from "./layouts/HomeLayout";

function App() {
  return (
    <Routes>
      {/* ✅ Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* ✅ Protected layout: /home, /home/chat, /home/library */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomeLayout />
          </ProtectedRoute>
        }
      >
        {/* /home */}
        <Route index element={<HomePage />} />
        {/* /home/chat */}
        <Route path="chat" element={<ChatPage />} />
        {/* /home/library */}
        <Route path="library" element={<LibraryPage />} />
      </Route>

      {/* ✅ Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
