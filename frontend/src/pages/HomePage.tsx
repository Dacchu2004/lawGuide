// frontend/src/pages/HomePage.tsx
import React from "react";
import {
  Search,
  BookOpen,
  Gavel,
  Users,
  Briefcase,
  Flag,
  Laptop,
  Scale,
  ClipboardList,
  Handshake,
  Bookmark,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const legalDomains = [
    {
      title: "Criminal Law",
      description:
        "Navigating legal procedures for offenses and defenses, from minor infractions to serious crimes.",
      icon: <Gavel size={28} strokeWidth={1.5} />,
    },
    {
      title: "Family Law",
      description:
        "Guidance on marriage, divorce, child custody, adoption, and other domestic relations.",
      icon: <Users size={28} strokeWidth={1.5} />,
    },
    {
      title: "Corporate Law",
      description:
        "Legal aspects of business formation, operation, mergers, acquisitions, and compliance.",
      icon: <Briefcase size={28} strokeWidth={1.5} />,
    },
    {
      title: "Property Law",
      description:
        "Understanding real estate transactions, land disputes, lease agreements, and property rights.",
      icon: <Flag size={28} strokeWidth={1.5} />,
    },
    {
      title: "Cyber & IT Law",
      description:
        "Laws governing internet usage, data privacy, cybersecurity, digital transactions, and online crimes.",
      icon: <Laptop size={28} strokeWidth={1.5} />,
    },
    {
      title: "Constitutional Law",
      description:
        "Principles and interpretations of India's foundational law, upholding fundamental rights.",
      icon: <Scale size={28} strokeWidth={1.5} />,
    },
    {
      title: "Civil Law",
      description:
        "Resolving non-criminal disputes such as contract breaches, torts, and personal injury claims.",
      icon: <ClipboardList size={28} strokeWidth={1.5} />,
    },
    {
      title: "Corporate & Labour",
      description:
        "Formation, enforceability, and breaches of legal contracts. Essential for business and employment.",
      icon: <Handshake size={28} strokeWidth={1.5} />,
    },
  ];

  const quickGuides = [
    {
      title: "Understanding Your Fundamental Rights",
      description:
        "A comprehensive guide to the six fundamental rights guaranteed to every Indian citizen under the Constitution.",
    },
    {
      title: "How to File a First Information Report (FIR)",
      description:
        "Step-by-step procedure to file an FIR at your nearest police station or online, and what to do if refused.",
    },
    {
      title: "Legal Aid Services & Free Consultation",
      description:
        "Information on how to access free legal services provided by NALSA for eligible citizens.",
    },
  ];

  const importantRights = [
    "Right to Equality",
    "Right to Freedom",
    "Right Against Exploitation",
    "Right to Freedom of Religion",
    "Cultural and Educational Rights",
    "Right to Constitutional Remedies",
    "Right to Education",
    "Women's Rights",
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] w-full font-sans text-[#171A1F] flex flex-col">
      {/* HERO SECTION */}
      <section className="relative w-full h-screen pt-[56px] flex items-center justify-center overflow-hidden">

  {/* Background */}
  <img
    src="/assets/hero.jpg"
    className="absolute inset-0 w-full h-full object-cover"
    alt="Courtroom"
  />

  {/* Overlay */}
  <div className="absolute inset-0 bg-[#197DCA]/60" />

  {/* Content */}
  <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center text-white">
    <h1 className="font-archivo font-bold text-4xl md:text-5xl leading-[1.2] mb-4">
      Navigating India's Legal <br /> Landscape with Ease.
    </h1>

    <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
      Your AI-powered companion for the new Bharatiya Nyaya Sanhita (BNS)
      and knowing your rights.
    </p>

    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <button
        onClick={() => navigate("/home/library")}
        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-8 py-3 rounded-xl text-white text-lg border border-white/20"
      >
        Search Library
      </button>

      <button
        onClick={() => navigate("/home/chat")}
        className="bg-white hover:bg-gray-100 text-[#323743] px-8 py-3 rounded-xl text-lg shadow-md"
      >
        Chat with AI
      </button>
    </div>
  </div>
</section>


      {/* EXPLORE LAWS SEARCH */}
      <section className="relative bg-white px-6 py-20 overflow-hidden">
  {/* DECORATIVE HAND IMAGE */}
  <img
    src="/assets/D-hand.png" // your hand image
    alt=""
    className="absolute pointer-events-none select-none"
    style={{
      width: "260px",   // resize here
      top: "40px",      // move up/down
      left: "-20px",   // move left/right (negative allowed)
      opacity: 0.9,
    }}
  />

  <div className="max-w-[1200px] mx-auto text-center relative z-10">
    <h2 className="font-archivo font-bold text-3xl md:text-4xl mb-12 text-[#171A1F]">
      Explore Laws
    </h2>

    {/* Search */}
    <div className="relative max-w-2xl mx-auto mb-12">
      <Search
        size={22}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#565D6D]"
      />
      <input
        type="text"
        placeholder="Search by keyword, case, or section..."
        className="w-full h-[56px] pl-12 pr-5 rounded-xl border border-[#DEE1E6] shadow-sm text-lg focus:border-[#258CF4] outline-none"
      />
    </div>

    {/* Tags */}
    <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
      {[
        "Criminal",
        "Property",
        "Corporate",
        "Cyber",
        "Consumer",
        "Constitutional",
        "Labour",
      ].map((t) => (
        <button
          key={t}
          className="px-6 py-2.5 rounded-full bg-[#379AE6] hover:bg-[#197DCA] text-white font-semibold transition"
        >
          {t} Law
        </button>
      ))}
    </div>
  </div>
</section>


      {/* KEY LEGAL DOMAINS */}
      <section className="bg-[#D7ECFF] py-12 px-4 w-full">
  <div className="max-w-[1280px] mx-auto">
    
    {/* Title */}
    <div className="flex items-center justify-center gap-3 mb-10">
      <h2 className="font-archivo font-bold text-[36px] leading-tight text-[#171A1F] text-center">
        Discover Key Legal Domains
      </h2>
      <div className="hidden sm:block text-[#171A1F]">
        <img
  src="/assets/Gavel.svg"
  alt=""
  className="w-9 h-9 -rotate-12"
/>

      </div>
    </div>

    {/* Cards Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {legalDomains.map((domain, index) => (
        <div
          key={index}
          className="bg-white rounded-[14px] border border-[#E4E8EE] shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow duration-300"
        >
          {/* Icon Background */}
          <div className="w-full h-[56px] bg-[#E9F3FF] rounded-[12px] flex items-center justify-center mb-6">
            <div className="text-[#258CF4]">{domain.icon}</div>
          </div>

          {/* Title */}
          <h3 className="font-archivo font-semibold text-[18px] leading-[26px] text-[#171A1F] mb-3">
            {domain.title}
          </h3>

          {/* Description */}
          <p className="font-open-sans text-[14px] leading-[22px] text-[#323743] mb-6 flex-grow">
            {domain.description}
          </p>

          {/* Explore Button */}
          <button
            className="text-[#258CF4] font-semibold text-[14px] hover:underline mt-auto text-left"
            onClick={() =>
              navigate("/home/library", {
                state: { domain: domain.title.split(" ")[0] },
              })
            }
          >
            Explore
          </button>
        </div>
      ))}
    </div>

  </div>
</section>


      {/* ESSENTIAL RESOURCES */}
      <section className="bg-white py-20 px-4 w-full relative overflow-hidden">
  <div className="max-w-[1280px] mx-auto relative">

    {/* TOP BREATHING — prevents cramped feel */}
    <div className="h-6" />

    {/* Heading */}
    <div className="flex justify-center items-center mb-14 relative">
      <h2 className="font-archivo font-bold text-[34px] leading-tight text-[#171A1F] text-center z-10">
        Essential Legal Guides & Resources
      </h2>

      {/* Decorative, low-weight icon */}
      <div className="hidden lg:block absolute top-[-14px] right-[22%] opacity-20 rotate-[12deg]">
        <BookOpen size={72} className="text-[#171A1F]" />
      </div>
    </div>

    {/* Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-2 lg:px-6">
      {quickGuides.map((guide, index) => (
        <div
          key={index}
          onClick={() =>
            navigate("/home/chat", { state: { autoQuery: guide.title } })
          }
          className="
            bg-[#379AE6]
            rounded-[16px]
            p-7
            text-white
            shadow-sm
            border border-[#DEE1E6]/10
            hover:shadow-lg
            hover:-translate-y-1
            transition-all
            cursor-pointer
            relative
          "
        >
          {/* Title + Bookmark */}
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-open-sans font-semibold text-[17px] leading-[26px]">
              {guide.title}
            </h3>

            <Bookmark
              size={18}
              className="opacity-80"
              fill="currentColor"
            />
          </div>

          {/* Description */}
          <p className="font-open-sans text-[14px] leading-[21px] opacity-95">
            {guide.description}
          </p>
        </div>
      ))}
    </div>

    {/* BOTTOM BREATHING — avoids abrupt section end */}
    <div className="h-10" />

  </div>
</section>

      {/* IMPORTANT RIGHTS */}
      <section className="bg-[#E6F3FF] py-20 px-4 w-full relative overflow-hidden">
  {/* Right Illustration */}
  <div className="hidden xl:block absolute inset-0 pointer-events-none z-0">
    <img
      src="/assets/LP-splash.svg"
      alt="Rights Illustration"
      className="absolute object-contain"
      style={{
        width: "80px",   // resize freely
        bottom: "110px",   // move up/down
        left: "600px",    // KEEP POSITIVE when overflow-hidden
        opacity: 0.9,
      }}
    />
  </div>

  {/* Content */}
  <div className="max-w-[1100px] mx-auto relative z-10 flex flex-col items-center">

    {/* Title */}
    <h2 className="font-archivo font-bold text-[36px] md:text-[42px] leading-tight text-[#171A1F] text-center mb-10">
      Important rights to know
    </h2>

    {/* Rights Buttons */}
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-4 max-w-4xl mb-10">
      {importantRights.map((right, index) => (
        <button
          key={index}
          className="bg-white text-[#171A1F] hover:bg-[#F2F4F7] px-6 py-2.5 
          rounded-full font-open-sans font-medium text-[15px] shadow-sm transition"
        >
          {right}
        </button>
      ))}
    </div>

    {/* Learn More Button */}
    <button className="bg-white text-[#258CF4] hover:text-[#197DCA] px-8 py-3 
      rounded-xl font-open-sans text-[17px] shadow-md transition">
      Learn More About Your Rights
    </button>
  </div>
</section>


      {/* FOOTER */}
      <footer className="bg-white w-full py-10 border-t border-[#DEE1E6]">
  <div className="max-w-[1200px] mx-auto px-4 sm:px-6">

    {/* TOP GRID */}
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-10">

      {/* LOGO + DESCRIPTION */}
      <div className="flex flex-col gap-3">

        {/* LOGO CONTAINER (layout-safe) */}
        <div className="relative">

          {/* LOGO — freely movable */}
          <img
            src="/assets/LP-logo.png"
            alt="LawGuide India"
            className="absolute object-contain"
            style={{
              width: "140px",   // ← CHANGE SIZE HERE
              top: "-40px",       // ← move up/down
              left: "0px",      // ← move left/right
            }}
          />

          {/* PLACEHOLDER — keeps layout intact */}
          <div className="w-[140px] h-[56px] opacity-0"></div>
        </div>

        {/* DESCRIPTION */}
        <p className="font-open-sans text-[#323743] text-[14px] leading-6 max-w-xs">
          Your comprehensive guide to India's legal system.
          Empowering you with knowledge and clarity.
        </p>
      </div>

      {/* LEGAL RESOURCES */}
      <div className="flex flex-col gap-3">
        <h3 className="font-archivo font-semibold text-[18px] text-[#171A1F]">
          Legal Resources
        </h3>
        <div className="flex flex-col gap-2 text-[14px]">
          <a className="text-[#323743] hover:text-[#197DCA]">Bare Acts</a>
          <a className="text-[#323743] hover:text-[#197DCA]">Case Laws</a>
          <a className="text-[#323743] hover:text-[#197DCA]">Legal Forms</a>
          <a className="text-[#323743] hover:text-[#197DCA]">Legal News</a>
        </div>
      </div>

      {/* SERVICES */}
      <div className="flex flex-col gap-3">
        <h3 className="font-archivo font-semibold text-[18px] text-[#171A1F]">
          Services
        </h3>
        <div className="flex flex-col gap-2 text-[14px]">
          <a className="text-[#323743] hover:text-[#197DCA]">Find a Lawyer</a>
          <a className="text-[#323743] hover:text-[#197DCA]">Online Consultation</a>
          <a className="text-[#323743] hover:text-[#197DCA]">Document Review</a>
          <a className="text-[#323743] hover:text-[#197DCA]">Legal Aid</a>
        </div>
      </div>

      {/* ABOUT */}
      <div className="flex flex-col gap-3">
        <h3 className="font-archivo font-semibold text-[18px] text-[#171A1F]">
          About Us
        </h3>
        <div className="flex flex-col gap-2 text-[14px]">
          <a className="text-[#323743] hover:text-[#197DCA]">Our Mission</a>
          <a className="text-[#323743] hover:text-[#197DCA]">Team</a>
          <a className="text-[#323743] hover:text-[#197DCA]">Careers</a>
          <a className="text-[#323743] hover:text-[#197DCA]">Contact</a>
        </div>
      </div>

      {/* CONTACT */}
      <div className="flex flex-col gap-4">
        <h3 className="font-archivo font-semibold text-[18px] text-[#171A1F]">
          Contact Us
        </h3>

        <div className="flex flex-col gap-3 text-[14px]">
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-[#323743] mt-0.5" />
            <p className="text-[#323743] leading-tight">
              123 Legal Avenue,<br />Mumbai, India
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Phone size={16} className="text-[#323743]" />
            <span className="text-[#323743]">+91 1800 123 4567</span>
          </div>

          <div className="flex items-center gap-2">
            <Mail size={16} className="text-[#323743]" />
            <span className="text-[#323743]">info@lawguideindia.com</span>
          </div>
        </div>

        {/* SOCIAL ICONS */}
        <div className="flex gap-3 pt-2">
          <Facebook size={18} className="text-[#323743] hover:text-[#197DCA]" />
          <Twitter size={18} className="text-[#323743] hover:text-[#197DCA]" />
          <Linkedin size={18} className="text-[#323743] hover:text-[#197DCA]" />
          <Youtube size={18} className="text-[#323743] hover:text-[#197DCA]" />
        </div>
      </div>
    </div>

    {/* BOTTOM COPYRIGHT */}
    <div className="border-t border-[#DEE1E6] pt-6 text-center">
      <p className="font-open-sans text-sm text-[#323743]">
        © 2025 LawGuide India. All rights reserved.
      </p>
    </div>

  </div>
</footer>


    </div>
  );
};

export default HomePage;
