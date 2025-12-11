import {
  Search,
  ChevronDown,
  Gavel,
  CheckCircle,
  Brain,
  Globe,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { subscribeNewsletter } from "../api/newsletter";
import { useState } from "react";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [newsletterMsg, setNewsletterMsg] = useState("");

  const handleSubscribe = async () => {
    if (!newsletterEmail.includes("@")) {
      setNewsletterMsg("Please enter a valid email.");
      setNewsletterStatus("error");
      return;
    }

    try {
      setNewsletterStatus("loading");
      const res = await subscribeNewsletter(newsletterEmail);
      setNewsletterStatus("success");
      setNewsletterMsg(res.message);
      setNewsletterEmail("");
    } catch (err) {
      setNewsletterStatus("error");
      setNewsletterMsg("Subscription failed. Try again.");
    }
  };

  const handleNavigation = (path: string, state: any = {}) => {
    if (user) {
      navigate(path, { state });
    } else {
      navigate("/auth", { state: { redirectTo: path, ...state } });
    }
  };

  return (
    <div className="font-['Inter'] text-[#171A1F] bg-white overflow-x-hidden">
      {/* ================= NAVBAR ================= */}
      <nav className="w-full border-b bg-white">
        <div className="max-w-6xl mx-auto h-[88px] flex items-center justify-between px-6">
          {/* Logo */}
          <img
            src="/assets/LP-logo.png"
            alt="LawGuide India"
            className="h-14 w-auto"
          />

          {/* Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {["Rights Hub", "AI Auditor", "About us", "Help"].map(
              (item, index) => (
                <div
                  key={item}
                  className="px-4 py-2 text-[15px] hover:bg-gray-50 rounded flex items-center cursor-default"
                >
                  {item}
                  {index === 0 && (
                    <ChevronDown className="inline w-4 h-4 ml-1" />
                  )}
                </div>
              )
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNavigation("/home")}
              className="h-[36px] px-4 bg-[#379AE6] text-white text-[14px] rounded-[8px] hover:bg-[#197DCA]"
            >
              Get started
            </button>
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="max-w-6xl mx-auto pl-4 pr-6 py-16 flex flex-col lg:flex-row items-center justify-between">
        {/* LEFT TEXT */}
        <div className="lg:w-[48%]">
          <h1 className="font-['Archivo'] text-[52px] leading-[62px] font-bold mb-5">
            Simplify Indian Law. <br />
            Know Your Rights.
          </h1>

          <p className="text-[17px] leading-[27px] text-[#565D6D] mb-10 max-w-md">
            A Responsible AI platform that explains your rights and retrieves
            accurate legal sections from the Bharatiya Nyaya Sanhita (BNS) &
            more.
          </p>

          {/* CTA BUTTONS */}
          <div className="flex gap-4">
            <button
              onClick={() =>
                handleNavigation("/home/chat", {
                  autoQuery: "Help me with a legal issue.",
                })
              }
              className="h-[48px] px-6 bg-[#379AE6] text-white text-[16px] rounded-[6px] hover:bg-[#197DCA] font-medium"
            >
              Chat with AI
            </button>

            <button
              onClick={() => handleNavigation("/home/library")}
              className="h-[48px] px-6 border border-[#66BCFF] text-[#66BCFF] text-[16px] rounded-[6px] hover:text-[#007EDE] hover:border-[#007EDE]"
            >
              Learn more
            </button>
          </div>
        </div>

        {/* RIGHT SIDE VISUALS */}
        <div className="lg:w-[48%] relative flex flex-col gap-5 items-end mt-10 lg:mt-0">
          {/* Light Blue Background Shape */}
          <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#D7EBFF] rounded-full -z-10 blur-xl translate-x-10 -translate-y-10"></div>

          {/* Lady Justice Illustration */}
          <img
            src="/assets/lady_justice_lineart.png"
            alt="Justice"
            className="absolute right-[-20px] top-[-30px] w-[260px] hidden xl:block"
          />

          {/* CARD 1 */}
          <div className="w-[350px] bg-white rounded-[16px] shadow border p-2 flex h-[120px] z-10">
            <img
              src="/assets/kids_education.jpg"
              className="h-full w-[130px] rounded-[8px] object-cover"
            />
            <div className="ml-3 flex flex-col">
              <h3 className="font-['Archivo'] text-[15px] font-bold">
                Property Disputes
              </h3>
              <span className="mt-2 bg-[#F3F4F6] px-2 py-1 rounded-[12px] text-[11px] text-[#323743] w-fit">
                Civil Law
              </span>
              <span className="text-[#379AE6] text-[12px] mt-auto cursor-pointer hover:underline">
                View more
              </span>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="w-[350px] bg-white rounded-[16px] shadow border p-2 flex h-[120px] ml-[-25px] z-10">
            <img
              src="/assets/doctor_patient.jpg"
              className="h-full w-[130px] rounded-[8px] object-cover"
            />
            <div className="ml-3 flex flex-col">
              <h3 className="font-['Archivo'] text-[15px] font-bold">
                Cyber Fraud & IT
              </h3>
              <span className="mt-2 bg-[#F3F4F6] px-2 py-1 rounded-[12px] text-[11px] text-[#323743] w-fit">
                Cyber Law
              </span>
              <span className="text-[#379AE6] text-[12px] mt-auto cursor-pointer hover:underline">
                View more
              </span>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="w-[350px] bg-white rounded-[16px] shadow border p-2 flex h-[120px] z-10">
            <img
              src="/assets/women_safety.jpg"
              className="h-full w-[130px] rounded-[8px] object-cover"
            />
            <div className="ml-3 flex flex-col">
              <h3 className="font-['Archivo'] text-[15px] font-bold">
                Women's Safety
              </h3>
              <span className="mt-2 bg-[#F3F4F6] px-2 py-1 rounded-[12px] text-[11px] text-[#323743] w-fit">
                Criminal
              </span>
              <span className="text-[#379AE6] text-[12px] mt-auto cursor-pointer hover:underline">
                View more
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EXPLORE LAWS ================= */}
      <section className="max-w-6xl mx-auto mt-12 mb-20 px-6">
        <div className="bg-[#ACD5F5] rounded-[16px] p-8 flex flex-col lg:flex-row gap-6 items-start">
          <h2 className="font-['Archivo'] text-[22px] text-[#197DCA] whitespace-nowrap">
            Explore Laws:
          </h2>

          <div className="flex flex-wrap gap-3">
            {[
              "Police Rights",
              "Traffic Rules",
              "FIR Process",
              "Consumer Rights",
              "Rent Agreements",
            ].map((tag) => (
              <button
                key={tag}
                className="px-4 h-[40px] bg-white rounded-full text-[15px] hover:bg-[#E6F0FF]"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS SECTION ================= */}
      <section className="w-full bg-[#1D71C7] py-16 relative overflow-hidden">
        <div className="max-w-6xl mx-auto pl-4 pr-6 relative z-10">
          {/* ------- TITLE ------- */}
          <div className="text-center mb-16 flex justify-center items-center gap-3">
            <h2 className="font-['Archivo'] font-bold text-[40px] leading-tight text-white">
              Your Legal Journey, Simplified
            </h2>
            <Gavel className="w-[70px] h-[70px] text-white stroke-[1.3]" />
          </div>

          {/* ------- 3 CARDS ------- */}
          <div className="flex flex-wrap justify-center gap-10 mb-20">
            {[
              {
                icon: CheckCircle,
                title: "1. Describe Your Issue",
                desc: "Type your legal problem in plain English or your native language. No complex legal jargon needed.",
              },
              {
                icon: Brain,
                title: "2. AI Retrieves the Law",
                desc: "Our AI scans the official BNS & BNSS 2023 databases to find the exact Act and Section matching your case.",
              },
              {
                icon: Globe,
                title: "3. Get Verified Advice",
                desc: "Receive a clear explanation with a confidence score and source links. Dual-phase validated for safety.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="w-[320px] h-[240px] bg-white/15 rounded-[8px] shadow-sm flex flex-col items-center text-center p-6"
              >
                <div className="w-[100px] h-[100px] bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mb-4">
                  <card.icon className="w-[58px] h-[58px] text-white" />
                </div>

                <h3 className="font-['Archivo'] font-semibold text-[18px] leading-[26px] text-white mb-2">
                  {card.title}
                </h3>

                <p className="font-['Inter'] text-[14px] leading-[20px] text-white/90 px-3">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

          {/* ------- STATS ------- */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 text-center border-t border-white/30 pt-10">
            {[
              { val: "3", label: "New Acts" },
              { val: "100%", label: "Free" },
              { val: "2000+", label: "Sections" },
              { val: "12+", label: "Languages" },
              { val: "24/7", label: "Access" },
              { val: "AI", label: "Audited" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="font-['Archivo'] text-[28px] font-semibold text-white leading-tight">
                  {stat.val}
                </span>
                <span className="font-['Inter'] text-[17px] text-white/90">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= NEWSLETTER SECTION (WHITE BG) ================= */}
      {/* UPDATED: Background changed to WHITE, text to DARK BLUE */}
      <section className="w-full bg-white py-16">
        <div className="max-w-6xl mx-auto pl-4 pr-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Illustration */}
            <div className="lg:w-1/2 flex justify-center lg:justify-start">
              <img
                src="/assets/person_pointing.png"
                alt="Subscribe"
                className="w-[360px] lg:w-[420px] object-contain"
              />
            </div>

            {/* Content */}
            <div className="lg:w-1/2 flex flex-col items-start text-left">
              <h2 className="font-['Archivo'] font-bold text-[36px] leading-tight text-[#171A1F] mb-4">
                Stay Legal Ready.
              </h2>
              <h2 className="font-['Archivo'] font-bold text-[36px] leading-tight text-[#171A1F] mb-8">
                Get the latest updates on Indian <br /> Law & Rights directly to
                your inbox.
              </h2>

              <div className="flex flex-col w-full max-w-[520px]">
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 h-[48px] px-4 rounded-[6px] bg-white border border-gray-300 text-[16px] focus:outline-none focus:ring-1 focus:ring-[#379AE6]"
                  />

                  <button
                    onClick={handleSubscribe}
                    disabled={newsletterStatus === "loading"}
                    className="h-[48px] px-6 bg-[#379AE6] text-white font-semibold text-[16px] rounded-[6px] hover:bg-[#197DCA] shadow-md disabled:opacity-60"
                  >
                    {newsletterStatus === "loading" ? "..." : "Get Updates"}
                  </button>
                </div>

                {newsletterMsg && (
                  <p
                    className={`mt-2 text-sm ${
                      newsletterStatus === "success"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {newsletterMsg}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BOTTOM LINKS (BLUE BG) ================= */}
      <footer className="w-full bg-[#D9ECFF] pt-14 pb-10 text-[#171A1F]">
        <div className="max-w-6xl mx-auto pl-4 pr-6">
          {/* Top row: Logo & Links */}
          <div className="flex flex-col lg:flex-row justify-between gap-12">
            {/* Logo Column */}
            <div className="flex flex-col items-start gap-3">
              <img
                src="/assets/logo_white.png"
                alt="LawGuide India"
                className="h-12 w-auto opacity-90"
              />

              <span className="font-['Archivo'] font-semibold text-[18px]">
                © 2025 LawGuide India
              </span>
            </div>

            {/* Links Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-6 text-[15px] font-['Inter']">
              <div className="flex flex-col gap-2">
                <span className="font-semibold mb-1">Platform</span>
                <a className="opacity-80 hover:opacity-100 cursor-pointer">
                  Rights Hub
                </a>
                <a
                  onClick={() => handleNavigation("/home/chat")}
                  className="opacity-80 hover:opacity-100 cursor-pointer"
                >
                  AI Lawyer (Chat)
                </a>
                <a
                  onClick={() => handleNavigation("/home/library")}
                  className="opacity-80 hover:opacity-100 cursor-pointer"
                >
                  Law Library
                </a>
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-semibold mb-1">About LawGuide</span>
                <a className="opacity-80 hover:opacity-100">How AI Works</a>
                <a className="opacity-80 hover:opacity-100">Open Source Code</a>
                <a className="opacity-80 hover:opacity-100">Contact</a>
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-semibold mb-1">Legal</span>
                <a className="opacity-80 hover:opacity-100">Privacy Policy</a>
                <a className="opacity-80 hover:opacity-100">Terms of Use</a>
                <a className="opacity-80 hover:opacity-100">Disclaimer</a>
              </div>

              {/* Help Button + Social Icons */}
              <div className="flex flex-col gap-5 items-start">
                <button className="h-[48px] px-6 border border-[#171A1F] rounded-[6px] text-[16px] hover:bg-white">
                  Help Center
                </button>

                <div className="flex gap-4 opacity-80">
                  <Twitter className="w-5 h-5 cursor-pointer hover:opacity-100" />
                  <Facebook className="w-5 h-5 cursor-pointer hover:opacity-100" />
                  <Linkedin className="w-5 h-5 cursor-pointer hover:opacity-100" />
                  <Youtube className="w-5 h-5 cursor-pointer hover:opacity-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
