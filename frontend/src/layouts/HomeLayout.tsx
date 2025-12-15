// frontend/src/layouts/HomeLayout.tsx
import { Outlet, useNavigate } from "react-router-dom";
import { Globe, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import SearchableDropdown from "../components/SearchableDropdown";
import { useState } from "react";

export default function HomeLayout() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* NAVBAR */}
      <nav className="relative h-[56px] bg-[#197DCA] text-white pl-1 pr-3 md:px-6 flex items-center justify-between sticky top-0 z-50 shadow-md">
        {/* LEFT */}
        <div
          onClick={() => navigate("/home")}
          className="relative flex items-center cursor-pointer"
        >
          <img
            src="/assets/LP-whiteLogo.png"
            alt="LawGuide India"
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[68px] w-auto object-contain"
          />
          <span className="ml-[62px] font-archivo font-semibold text-[17px] whitespace-nowrap">
            LawGuide India
          </span>
        </div>

        {/* CENTER (DESKTOP) */}
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

        {/* RIGHT (DESKTOP) */}
        <div className="hidden md:flex items-center gap-6">
          {/* Language */}
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
            className="h-auto p-0 border-none bg-transparent text-white text-sm opacity-90 hover:opacity-100"
          />

          {/* State */}
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
            className="h-auto p-0 border-none bg-transparent text-white text-sm opacity-90 hover:opacity-100"
          />

          {/* PROFILE HOVER ZONE */}
          <div
            className="relative"
            onMouseEnter={() => setShowProfileMenu(true)}
            onMouseLeave={() => setShowProfileMenu(false)}
          >
            {/* Invisible hover padding */}
            <div className="absolute -inset-x-2 -top-2 h-[120px]" />

            {/* Avatar */}
            <img
              src="/assets/profile.png"
              alt="User"
              className="relative h-8 w-8 rounded-full border border-white/40 object-cover cursor-pointer z-10"
            />

            {showProfileMenu && (
              <div className="absolute right-0 top-10 w-44 bg-white text-gray-800 rounded-lg shadow-lg border z-20">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-red-50 text-red-600"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE MENU BUTTON & SETTINGS */}
        <div className="flex md:hidden items-center gap-4">
          {/* Mobile Profile Icon */}
          <div className="relative">
            <img
              src="/assets/profile.png"
              alt="User"
              className="h-8 w-8 rounded-full border border-white/40 object-cover cursor-pointer"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            />
            {showProfileMenu && (
              <div className="absolute right-0 top-10 w-44 bg-white text-gray-800 rounded-lg shadow-lg border z-20">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-red-50 text-red-600"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[56px] left-0 w-full bg-[#197DCA] text-white z-40 shadow-xl flex flex-col p-6 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-6 font-medium text-lg">
            <button
              onClick={() => {
                navigate("/home/chat");
                setIsMobileMenuOpen(false);
              }}
              className="text-left hover:text-blue-100"
            >
              Chat with AI
            </button>
            <button
              onClick={() => {
                navigate("/home/library");
                setIsMobileMenuOpen(false);
              }}
              className="text-left hover:text-blue-100"
            >
              Law Library
            </button>
            <button
              onClick={() => {
                navigate("/home/rights");
                setIsMobileMenuOpen(false);
              }}
              className="text-left hover:text-blue-100"
            >
              Rights Hub
            </button>
          </div>

          <div className="h-[1px] bg-white/20 my-6" />

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm opacity-80">Language</span>
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
                className="h-auto p-0 border-none bg-transparent text-white text-sm"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm opacity-80">State</span>
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
                className="h-auto p-0 border-none bg-transparent text-white text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <main id="main-content" className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
