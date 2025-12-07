// frontend/src/layouts/HomeLayout.tsx
import { Outlet, useNavigate } from "react-router-dom";

export default function HomeLayout() {
  const navigate = useNavigate();

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-white">
      {/* Sticky Navbar visible on all /home/* routes */}
      <nav className="h-[80px] bg-[#197DCA] text-white flex items-center justify-between px-6 sticky top-0 z-50 shadow-md">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <span className="font-bold text-xl">LawGuide India</span>
        </div>

        <div className="flex gap-6 text-sm md:text-base">
          <button onClick={() => navigate("/home")} className="hover:underline">
            Home
          </button>
          <button
            onClick={() => navigate("/home/chat")}
            className="hover:underline"
          >
            Chat
          </button>
          <button
            onClick={() => navigate("/home/library")}
            className="hover:underline"
          >
            Library
          </button>
        </div>
      </nav>

      {/* Here child pages will render */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
