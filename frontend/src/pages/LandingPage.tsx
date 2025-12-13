import {
  ChevronDown,
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
    <div className="font-['Inter'] text-[#171A1F] bg-white overflow-x-hidden relative">
      {/* ================= NAVBAR ================= */}
      <nav className="w-full bg-white relative">
        {/* LOGO placed ON the navbar at top-left, not affecting layout */}
        <img
          src="/assets/LP-logo.png"
          alt="LawGuide India"
          className="absolute left-[200px] top-[-30px] h-40 w-auto z-30"
        />

        <div className="max-w-6xl mx-auto h-[70px] flex items-center justify-between px-6 relative">
          {/* LEFT placeholder (keeps menu centered because logo isn't in flex flow) */}
          <div className="w-[160px]"></div>

          {/* ===== CENTER MENU ===== */}
          <div className="hidden lg:flex items-center gap-6 mx-auto">
            {["Rights Hub", "AI LegalGuide", "Laws", "Library"].map(
              (item, index) => {
                const getPath = (name: string) => {
                  switch (name) {
                    case "Rights Hub":
                      return "/home/rights";
                    case "AI LegalGuide":
                      return "/home/chat";
                    case "Laws":
                      return "/home/library";
                    case "Library":
                      return "/home/library";
                    default:
                      return "/home";
                  }
                };

                return (
                  <div
                    key={item}
                    onClick={() => handleNavigation(getPath(item))}
                    className="text-[16px] flex items-center cursor-pointer hover:text-[#379AE6]"
                  >
                    {item}
                    {index === 0 && <ChevronDown className="w-4 h-4 ml-1" />}
                  </div>
                );
              }
            )}
          </div>

          {/* ===== RIGHT BUTTON ===== */}
          <button
            onClick={() => handleNavigation("/home")}
            className="h-[38px] px-4 bg-[#379AE6] text-white text-[15px] rounded-[8px] hover:bg-[#197DCA]"
          >
            Get started
          </button>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center justify-between relative">
        {/* LEFT SIDE TEXT */}
        <div className="lg:w-[55%] relative">
          {/* Hammer Illustration */}
          <img
            src="/assets/LP-hand.png"
            className="absolute right-[-95px] top-[245px] w-[260px] hidden lg:block z-20"
          />

          <h1 className="font-['Archivo'] text-[56px] leading-[66px] font-bold mb-7">
            Simplify Indian Law. <br />
            Know Your Rights.
          </h1>

          <p className="text-[18px] leading-[28px] text-[#565D6D] mb-12 max-w-lg">
            A Responsible AI platform that explains your rights and retrieves
            accurate legal sections from the Bharatiya Nyaya Sanhita (BNS) &
            more.
          </p>

          {/* CTA BUTTONS */}
          <div className="flex gap-5">
            <button
              onClick={() =>
                handleNavigation("/home/chat", {
                  autoQuery: "Help me with a legal issue.",
                })
              }
              className="h-[50px] px-7 bg-[#379AE6] text-white text-[17px] rounded-[8px] hover:bg-[#197DCA] font-medium"
            >
              Chat with AI
            </button>

            <button
              onClick={() => handleNavigation("/home/library")}
              className="h-[50px] px-7 border border-[#66BCFF] text-[#66BCFF] text-[17px] rounded-[8px] hover:text-[#007EDE] hover:border-[#007EDE]"
            >
              Learn more
            </button>
          </div>
        </div>

        {/* RIGHT SIDE VISUALS */}
        <div className="lg:w-[45%] relative flex flex-col gap-8 items-start mt-20 lg:mt-0">
          {/* Curved BG Shape */}
          <img
            src="/assets/LP-BG.svg"
            className="absolute right-[05px] top-[0px] w-[900px] hidden xl:block z-0"
          />

          {/* Lady Justice */}
          <img
            src="/assets/LP-lady.png"
            alt="Justice"
            className="absolute right-[-160px] top-[-95px] w-[320px] hidden xl:block z-20"
          />

          {/* CARD 1 */}
          <div className="w-[360px] bg-white rounded-[18px] shadow-lg p-3 flex h-[120px] z-30 ml-[80px]">
            <img
              src="/assets/PD.jpg"
              className="h-full w-[160px] rounded-[10px] object-cover"
            />
            <div className="ml-3 flex flex-col">
              <h3 className="font-['Archivo'] text-[16px] font-bold">
                Property Disputes
              </h3>
              <span className="mt-2 bg-[#F3F4F6] px-2 py-1 rounded-[12px] text-[11px] text-[#323743] w-fit">
                Civil Law
              </span>
              <span
                onClick={() =>
                  handleNavigation("/home/library", {
                    query: "Property Disputes",
                  })
                }
                className="text-[#379AE6] text-[13px] mt-auto cursor-pointer hover:underline"
              >
                View more
              </span>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="w-[360px] bg-white rounded-[18px] shadow-lg p-3 flex h-[120px] ml-[80px] z-30">
            <img
              src="/assets/CS.jpg"
              className="h-full w-[160px] rounded-[10px] object-cover"
            />
            <div className="ml-3 flex flex-col">
              <h3 className="font-['Archivo'] text-[16px] font-bold">
                Cyber Fraud & IT
              </h3>
              <span className="mt-2 bg-[#F3F4F6] px-2 py-1 rounded-[12px] text-[11px] text-[#323743] w-fit">
                Cyber Law
              </span>
              <span
                onClick={() =>
                  handleNavigation("/home/library", {
                    query: "Cyber Fraud & IT",
                  })
                }
                className="text-[#379AE6] text-[13px] mt-auto cursor-pointer hover:underline"
              >
                View more
              </span>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="w-[360px] bg-white rounded-[18px] shadow-lg p-3 flex h-[120px] z-30 ml-[80px]">
            <img
              src="/assets/WS.jpg"
              className="h-full w-[160px] rounded-[10px] object-cover"
            />
            <div className="ml-3 flex flex-col">
              <h3 className="font-['Archivo'] text-[16px] font-bold">
                Women&apos;s Safety
              </h3>
              <span className="mt-2 bg-[#F3F4F6] px-2 py-1 rounded-[12px] text-[11px] text-[#323743] w-fit">
                Criminal
              </span>
              <span
                onClick={() =>
                  handleNavigation("/home/library", { query: "Women's Safety" })
                }
                className="text-[#379AE6] text-[13px] mt-auto cursor-pointer hover:underline"
              >
                View more
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EXPLORE LAWS ================= */}
      <section className="max-w-6xl mx-auto mt-20 mb-24 px-6 relative">
        {/* Splash decoration (top-left inside container) */}
        <img
          src="/assets/LP-splash.svg"
          className="absolute left-[-70px] top-[-100px] w-[150px] hidden lg:block"
        />

        <div className="bg-[#ACD5F5] rounded-[18px] p-8 pl-16 flex flex-col lg:flex-row gap-8 items-start relative">
          <h2 className="font-['Archivo'] text-[24px] text-[#197DCA] whitespace-nowrap">
            Explore Laws:
          </h2>

          <div className="flex flex-wrap gap-4">
            {[
              "Police Rights",
              "Traffic Rules",
              "FIR Process",
              "Consumer Rights",
              "Rent Agreements",
            ].map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  handleNavigation("/home/library", { query: tag })
                }
                className="px-5 h-[42px] bg-white rounded-full text-[15px] shadow-sm hover:bg-[#E6F0FF]"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS SECTION ================= */}
      <section className="w-full bg-[#D9ECFF] py-16 relative overflow-hidden">
        <div className="max-w-6xl mx-auto pl-4 pr-6 relative z-10">
          {/* ------- TITLE ------- */}
          <div className="text-center mb-16 flex justify-center items-center gap-3">
            <h2 className="font-['Archivo'] font-bold text-[50px] leading-tight text-black">
              Your Legal Journey, Simplified
            </h2>

            <img
              src="/assets/side.png"
              alt="decor"
              className="w-[120px] h-[70px] object-contain"
            />
          </div>

          {/* ------- 3 CARDS ------- */}
          <div className="flex flex-wrap justify-center gap-10 mb-20">
            {[
              {
                img: "/assets/LP-tick.svg",
                title: "1. Describe Your Issue",
                desc: "Type your legal problem in plain English or your native language. No complex legal jargon needed.",
              },
              {
                img: "/assets/LP-brain.png",
                title: "2. AI Retrieves the Law",
                desc: "Our AI scans the official BNS & BNSS 2023 databases to find the exact Act and Section matching your case.",
              },
              {
                img: "/assets/LP-globe.svg",
                title: "3. Get Verified Advice",
                desc: "Receive a clear explanation with a confidence score and source links. Dual-phase validated for safety.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="w-[320px] h-[250px] bg-[#065998] rounded-[40px] shadow-sm flex flex-col items-center text-center p-6"
              >
                {/* ICON — SAME SIZE, NO BACKGROUND */}
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-[120px] h-[80px] mb-4 object-contain"
                />

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
                <span className="font-['Archivo'] text-[32px] font-semibold text-black leading-tight">
                  {stat.val}
                </span>
                <span className="font-['Inter'] text-[28px] text-black/90">
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
            <div className="lg:w-1/2 relative flex justify-center lg:justify-start">
              <img
                src="/assets/LP-supreme.png"
                alt="Subscribe"
                className="absolute object-contain"
                style={{
                  width: "520px",
                  top: "-30px",
                  left: "-50px",
                  transform: "scale(1.4)",
                }}
              />

              {/* Placeholder to hold layout */}
              <div className="opacity-0 w-[520px] h-[300px]"></div>
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
          {/* Top Row */}
          <div className="flex flex-col lg:flex-row items-start lg:items-start justify-between gap-12">
            {/* LOGO COLUMN */}
            <div className="flex flex-col items-start gap-3 relative">
              <img
                src="/assets/LP-logo.png"
                alt="LawGuide India"
                className="absolute object-contain"
                style={{
                  width: "200px",
                  top: "-50px",
                  left: "0px",
                }}
              />

              <div className="w-[200px] h-[120px] opacity-0"></div>

              <span className="font-['Archivo'] font-semibold text-[18px]">
                © 2025 LawGuide India
              </span>
            </div>

            {/* CENTERED LINKS GRID */}
            <div className="flex-1 flex justify-center">
              <div className="grid grid-cols-3 gap-x-20 gap-y-6 text-[15px] font-['Inter']">
                {/* Platform */}
                <div className="flex flex-col gap-2">
                  <span className="font-semibold mb-1">Platform</span>
                  <a className="opacity-80 hover:opacity-100 cursor-pointer">
                    Rights Hub
                  </a>
                  <a
                    className="opacity-80 hover:opacity-100 cursor-pointer"
                    onClick={() => handleNavigation("/home/chat")}
                  >
                    AI Lawyer (Chat)
                  </a>
                  <a
                    className="opacity-80 hover:opacity-100 cursor-pointer"
                    onClick={() => handleNavigation("/home/library")}
                  >
                    Law Library
                  </a>
                </div>

                {/* About */}
                <div className="flex flex-col gap-2">
                  <span className="font-semibold mb-1">About LawGuide</span>
                  <a className="opacity-80 hover:opacity-100">How AI Works</a>
                  <a className="opacity-80 hover:opacity-100">
                    Open Source Code
                  </a>
                  <a className="opacity-80 hover:opacity-100">Contact</a>
                </div>

                {/* Legal */}
                <div className="flex flex-col gap-2">
                  <span className="font-semibold mb-1">Legal</span>
                  <a className="opacity-80 hover:opacity-100">Privacy Policy</a>
                  <a className="opacity-80 hover:opacity-100">Terms of Use</a>
                  <a className="opacity-80 hover:opacity-100">Disclaimer</a>
                </div>
              </div>
            </div>

            {/* HELP CENTER + SOCIALS */}
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
      </footer>
    </div>
  );
};

export default LandingPage;
