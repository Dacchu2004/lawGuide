// frontend/src/layouts/HomeLayout.tsx
import { Outlet, useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import SearchableDropdown from "../components/SearchableDropdown";

export default function HomeLayout() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* NAVBAR */}
      <nav className="relative h-[56px] bg-[#197DCA] text-white px-6 flex items-center justify-between sticky top-0 z-50 shadow-md">
        {/* LEFT: LOGO + TITLE (OVERLAP SYSTEM) */}
        <div
          onClick={() => navigate("/home")}
          className="relative flex items-center cursor-pointer"
        >
          {/* BIG LOGO */}
          <img
            src="/assets/LP-whiteLogo.png"
            alt="LawGuide India"
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[68px] w-auto object-contain"
          />

          {/* TEXT OVERLAPPING LOGO SPACE */}
          <span className="ml-[62px] font-archivo font-semibold text-[17px] leading-none whitespace-nowrap">
            LawGuide India
          </span>
        </div>

        {/* CENTER MENU */}
        <div className="hidden md:flex items-center gap-10">
          <button
            onClick={() => navigate("/home/chat")}
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

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6">
          {/* Language Dropdown */}
          <SearchableDropdown
            options={[
              "English",
              "Tamil",
              "Hindi",
              "Marathi",
              "Kannada",
              "Telugu",
              "Gujarati",
              "Bengali",
              "Punjabi",
              "Malayalam",
            ]}
            value={user?.language || "English"}
            onChange={(val) => updateUser({ language: val })}
            placeholder="Language"
            icon={<Globe size={16} />}
            align="right"
            className="h-auto p-0 border-none bg-transparent text-white text-sm opacity-90 hover:opacity-100 flex gap-1 shadow-none min-w-0"
          />

          {/* State Dropdown */}
          <SearchableDropdown
            options={[
              "Andhra Pradesh",
              "Arunachal Pradesh",
              "Assam",
              "Bihar",
              "Chhattisgarh",
              "Goa",
              "Gujarat",
              "Haryana",
              "Himachal Pradesh",
              "Jharkhand",
              "Karnataka",
              "Kerala",
              "Madhya Pradesh",
              "Maharashtra",
              "Manipur",
              "Meghalaya",
              "Mizoram",
              "Nagaland",
              "Odisha",
              "Punjab",
              "Rajasthan",
              "Sikkim",
              "Tamil Nadu",
              "Telangana",
              "Tripura",
              "Uttar Pradesh",
              "Uttarakhand",
              "West Bengal",
            ]}
            value={user?.state || "State"}
            onChange={(val) => updateUser({ state: val })}
            placeholder="State"
            align="right"
            className="h-auto p-0 border-none bg-transparent text-white text-sm opacity-90 hover:opacity-100 flex gap-1 shadow-none min-w-0"
          />

          <img
            src="/assets/default_user.png"
            alt="User"
            className="h-8 w-8 rounded-full border border-white/40 object-cover"
          />
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
