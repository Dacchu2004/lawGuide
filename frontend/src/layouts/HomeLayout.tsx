// frontend/src/layouts/HomeLayout.tsx
import { Outlet, useNavigate } from "react-router-dom";
import { Globe, ChevronDown } from "lucide-react";

export default function HomeLayout() {
  const navigate = useNavigate();

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-white">
      {/* Sticky Navbar visible on all /home/* routes */}
      <nav className="h-[68px] bg-[#197DCA] text-white px-8 flex items-center justify-between sticky top-0 z-50 shadow-md">
        {/* LEFT: Logo */}
        <div
          onClick={() => navigate("/home")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <img
            src="/assets/logo_white.png"
            className="h-8 w-auto"
            alt="LawGuide India"
          />
          <span className="font-archivo font-semibold text-lg">
            LawGuide India
          </span>
        </div>

        {/* CENTER MENU */}
        <div className="hidden md:flex items-center gap-10">
          <button
            onClick={() => navigate("/home")}
            className="text-sm hover:opacity-90"
          >
            Chat
          </button>
          <button
            onClick={() => navigate("/home/library")}
            className="text-sm hover:opacity-90"
          >
            Library
          </button>
          <button
            onClick={() => navigate("/home/rights")}
            className="text-sm hover:opacity-90"
          >
            Rights
          </button>
        </div>

        {/* RIGHT: Language + State + Avatar */}
        <div className="flex items-center gap-6">
          {/* Language */}
          <div className="flex items-center gap-1 cursor-pointer opacity-90 hover:opacity-100">
            <Globe size={18} />
            <span className="text-sm">English</span>
          </div>

          {/* State */}
          <div className="flex items-center gap-1 cursor-pointer opacity-90 hover:opacity-100">
            <span className="text-sm">Maharashtra</span>
            <ChevronDown size={16} />
          </div>

          {/* User Avatar */}
          <img
            src="/assets/default_user.png"
            alt="User"
            className="h-9 w-9 rounded-full border border-white/40"
          />
        </div>
      </nav>

      {/* Here child pages will render */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
