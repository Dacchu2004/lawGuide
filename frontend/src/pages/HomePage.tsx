import React from 'react';
import { 
  Search, 
  Globe, 
  ChevronDown, 
  MessageCircle, 
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
  Youtube
} from 'lucide-react';

const HomePage: React.FC = () => {

  // --- DATA SECTIONS ---

  const legalDomains = [
    {
      title: "Criminal Law",
      description: "Navigating legal procedures for offenses and defenses, from minor infractions to serious crimes.",
      icon: <Gavel size={28} strokeWidth={1.5} />,
    },
    {
      title: "Family Law",
      description: "Guidance on marriage, divorce, child custody, adoption, and other domestic relations.",
      icon: <Users size={28} strokeWidth={1.5} />,
    },
    {
      title: "Corporate Law",
      description: "Legal aspects of business formation, operation, mergers, acquisitions, and compliance.",
      icon: <Briefcase size={28} strokeWidth={1.5} />,
    },
    {
      title: "Property Law",
      description: "Understanding real estate transactions, land disputes, lease agreements, and property rights.",
      icon: <Flag size={28} strokeWidth={1.5} />,
    },
    {
      title: "Cyber & IT Law",
      description: "Laws governing internet usage, data privacy, cybersecurity, digital transactions, and online crimes.",
      icon: <Laptop size={28} strokeWidth={1.5} />,
    },
    {
      title: "Constitutional Law",
      description: "Principles and interpretations of India's foundational law, upholding fundamental rights.",
      icon: <Scale size={28} strokeWidth={1.5} />,
    },
    {
      title: "Civil Law",
      description: "Resolving non-criminal disputes such as contract breaches, torts, and personal injury claims.",
      icon: <ClipboardList size={28} strokeWidth={1.5} />,
    },
    {
      title: "Corporate & Labour",
      description: "Formation, enforceability, and breaches of legal contracts. Essential for business and employment.",
      icon: <Handshake size={28} strokeWidth={1.5} />,
    }
  ];

  const quickGuides = [
    {
      title: "Understanding Your Fundamental Rights",
      description: "A comprehensive guide to the six fundamental rights guaranteed to every Indian citizen under the Constitution.",
    },
    {
      title: "How to File a First Information Report (FIR)",
      description: "Step-by-step procedure to file an FIR at your nearest police station or online, and what to do if refused.",
    },
    {
      title: "Legal Aid Services & Free Consultation",
      description: "Information on how to access free legal services provided by NALSA for eligible citizens.",
    }
  ];

  const importantRights = [
    "Right to Equality",
    "Right to Freedom",
    "Right Against Exploitation",
    "Right to Freedom of Religion",
    "Cultural and Educational Rights",
    "Right to Constitutional Remedies",
    "Right to Education",
    "Women's Rights"
  ];

  return (
    <div className="min-h-screen w-full font-sans text-[#171A1F] flex flex-col">
      
      {/* ==================== 1. NAVBAR ==================== */}
      <nav className="bg-[#197DCA] text-white w-full sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-[90px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 text-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>
              </svg>
            </div>
            <span className="font-archivo font-bold text-xl md:text-2xl tracking-tight">
              LawGuide India
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-archivo font-medium text-lg">
            <a href="#" className="hover:bg-white/10 px-3 py-2 rounded-lg transition">Discover</a>
            <a href="#" className="hover:bg-white/10 px-3 py-2 rounded-lg transition">Chat</a>
            <a href="#" className="hover:bg-white/10 px-3 py-2 rounded-lg transition">Library</a>
            <a href="#" className="hover:bg-white/10 px-3 py-2 rounded-lg transition">Rights</a>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden lg:flex items-center gap-6">
              <button className="flex items-center gap-2 hover:opacity-80">
                <Globe size={20} />
                <span className="font-medium">English</span>
                <ChevronDown size={16} />
              </button>
              <button className="flex items-center gap-2 hover:opacity-80">
                <span className="font-medium">Maharashtra</span>
                <ChevronDown size={16} />
              </button>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white overflow-hidden cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=100&h=100" 
                alt="User Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* ==================== 2. HERO SECTION ==================== */}
      <section className="relative w-full h-[600px] flex items-center justify-center bg-blue-600 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2600&auto=format&fit=crop" 
            alt="Courtroom" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#258CF4]/90 via-[#258CF4]/50 to-[#197DCA]/40 mix-blend-multiply" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white flex flex-col items-center">
          <h1 className="font-archivo font-extrabold text-4xl md:text-5xl lg:text-6xl leading-tight mb-4">
            Navigating India's Legal<br />Landscape with Ease.
          </h1>
          <p className="font-open-sans text-lg md:text-xl text-white/90 font-normal mb-10 max-w-2xl">
            Your AI-powered companion for the new Bharatiya Nyaya Sanhita (BNS) and knowing your rights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="bg-[#258CF4] hover:bg-[#1a75d2] text-white px-8 py-3 rounded-xl font-medium text-lg shadow-lg transition flex items-center justify-center gap-2">
              <BookOpen size={20} />
              Search Library
            </button>
            <button className="bg-white hover:bg-gray-100 text-[#323743] px-8 py-3 rounded-xl font-medium text-lg border-2 border-white transition flex items-center justify-center gap-2">
              <MessageCircle size={20} />
              Chat with AI
            </button>
          </div>
        </div>
      </section>

      {/* ==================== 3. EXPLORE LAWS SEARCH ==================== */}
      <section className="bg-white py-16 px-4 w-full relative">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center">
          <h2 className="font-archivo font-bold text-3xl md:text-4xl text-[#171A1F] mb-10 text-center">
            Explore Laws
          </h2>
          <div className="relative w-full max-w-3xl mb-12">
            <input 
              type="text" 
              placeholder="Search by keyword, case, or section..." 
              className="w-full h-[60px] pl-12 pr-6 rounded-xl border-2 border-[#DEE1E6] text-[#323743] focus:border-[#258CF4] focus:outline-none text-lg shadow-sm transition"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#323743]" size={20} />
          </div>
          <div className="flex flex-wrap justify-center gap-4 w-full max-w-5xl">
            {["Criminal Law", "Property Law", "Group Law", "Corporate Law", "Cyber Law", "Constitutional Law", "Consumer Rights", "Environmental Law"].map((tag, index) => (
              <button key={index} className="bg-[#379AE6] hover:bg-[#197DCA] text-white px-6 py-2.5 rounded-full font-open-sans font-semibold text-sm md:text-base transition shadow-sm">
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 4. KEY LEGAL DOMAINS ==================== */}
      <section className="bg-[#197DCA] py-20 px-4 w-full">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center justify-center gap-4 mb-14">
            <h2 className="font-archivo font-bold text-3xl md:text-[40px] leading-tight text-white text-center">
              Discover Key Legal Domains
            </h2>
            <div className="hidden sm:block text-white transform -rotate-12">
              <Gavel size={48} fill="currentColor" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {legalDomains.map((domain, index) => (
              <div key={index} className="bg-white rounded-xl border border-[#DEE1E6] shadow-sm p-6 flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
                <div className="w-full h-[64px] bg-[#258CF41A] rounded-[10px] flex items-center justify-center mb-6">
                  <div className="text-[#258CF4]">{domain.icon}</div>
                </div>
                <h3 className="font-archivo font-semibold text-[20px] leading-[28px] text-[#171A1F] mb-3">{domain.title}</h3>
                <p className="font-open-sans text-[14px] leading-[23px] text-[#323743] font-normal mb-8 flex-grow">{domain.description}</p>
                <button className="text-[#258CF4] font-medium text-[14px] leading-[22px] hover:underline text-left mt-auto self-start">Explore</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 5. ESSENTIAL RESOURCES ==================== */}
      <section className="bg-white py-20 px-4 w-full relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto relative">
          <div className="flex justify-center items-center mb-16 relative">
            <h2 className="font-archivo font-bold text-3xl md:text-[40px] leading-tight text-[#171A1F] text-center max-w-4xl z-10">
              Essential Legal Guides &amp; Resources
            </h2>
            <div className="hidden lg:block absolute top-[-10px] right-[10%] xl:right-[20%] transform rotate-[13.15deg] opacity-20">
               <BookOpen size={80} className="text-[#171A1F]" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-0 lg:px-12">
            {quickGuides.map((guide, index) => (
              <div key={index} className="bg-[#379AE6] rounded-xl border border-[#DEE1E6]/20 p-6 md:p-8 text-white relative shadow-sm hover:shadow-lg transition-transform hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4 pr-6">
                  <h3 className="font-open-sans font-semibold text-[18px] leading-[28px]">{guide.title}</h3>
                  <div className="absolute top-7 right-7"><Bookmark size={20} fill="currentColor" /></div>
                </div>
                <p className="font-open-sans text-[14px] leading-[20px] font-normal opacity-95">{guide.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 6. IMPORTANT RIGHTS TO KNOW ==================== */}
      <section className="bg-[#197DCA] py-24 px-4 w-full relative overflow-hidden">
        <div className="hidden xl:block absolute bottom-0 right-0 z-0 opacity-100">
            <img 
                src="https://cdni.iconscout.com/illustration/premium/thumb/law-book-illustration-download-in-svg-png-gif-file-formats--justice-legal-education-hammer-scale-study-school-pack-interiors-illustrations-5386047.png" 
                alt="Rights Illustration" 
                className="w-[300px] h-auto object-contain drop-shadow-lg" 
            />
        </div>
        <div className="max-w-[1440px] mx-auto relative z-10 flex flex-col items-center">
          <h2 className="font-archivo font-bold text-3xl md:text-[40px] leading-tight text-white text-center mb-12">
            Important rights to know
          </h2>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-4 max-w-5xl mb-12">
            {importantRights.map((right, index) => (
              <button key={index} className="bg-white text-[#171A1F] hover:bg-[#DEE1E6] active:bg-[#BDC1CA] px-6 py-3 rounded-full font-open-sans font-semibold text-sm md:text-base transition-colors shadow-sm">
                {right}
              </button>
            ))}
          </div>
          <button className="bg-white text-[#379AE6] hover:text-[#197DCA] font-open-sans font-medium text-lg px-8 py-3 rounded-xl shadow-lg transition-colors flex items-center justify-center">
            Learn More About Your Rights
          </button>
        </div>
      </section>

      {/* ==================== 7. FOOTER SECTION ==================== */}
      <footer className="bg-white w-full py-16 border-t border-[#DEE1E6]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Footer Grid - 5 Columns on Large Screens */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6 mb-12">
            
            {/* Column 1: Logo & Description */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 text-[#197DCA]">
                  {/* Using Scale as placeholder for the blue map/scale logo */}
                  <Scale size={40} fill="#197DCA" className="text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-archivo font-bold text-2xl text-[#197DCA] leading-none">
                    LawGuide India
                  </span>
                </div>
              </div>
              <p className="font-open-sans text-[#323743] text-sm leading-6 max-w-xs mt-2">
                Your comprehensive guide to India's legal system. Empowering you with knowledge and clarity.
              </p>
            </div>

            {/* Column 2: Legal Resources */}
            <div className="flex flex-col gap-4">
              <h3 className="font-archivo font-bold text-lg text-[#171A1F]">Legal Resources</h3>
              <div className="flex flex-col gap-3">
                <a href="#" className="font-open-sans text-[#323743] hover:text-[#197DCA] transition-colors">Bare Acts</a>
                <a href="#" className="font-open-sans text-[#323743] hover:text-[#197DCA] transition-colors">Case Laws</a>
                <a href="#" className="font-open-sans text-[#323743] hover:text-[#197DCA] transition-colors">Legal Forms</a>
                <a href="#" className="font-open-sans text-[#323743] hover:text-[#197DCA] transition-colors">Legal News</a>
              </div>
            </div>

            {/* Column 3: Services */}
            <div className="flex flex-col gap-4">
              <h3 className="font-archivo font-bold text-lg text-[#171A1F]">Services</h3>
              <div className="flex flex-col gap-3">
                <a href="#" className="font-open-sans text-[#323743] hover:text-[#197DCA] transition-colors">Find a Lawyer</a>
                <a href="#" className="font-open-sans text-[#323743] hover:text-[#197DCA] transition-colors">Online Consultation</a>
                <a href="#" className="font-open-sans text-[#323743] hover:text-[#197DCA] transition-colors">Document Review</a>
                <a href="#" className="font-open-sans text-[#323743] hover:text-[#197DCA] transition-colors">Legal Aid</a>
              </div>
            </div>

            {/* Column 4: About Us */}
            <div className="flex flex-col gap-4">
              <h3 className="font-archivo font-bold text-lg text-[#171A1F]">About Us</h3>
              <div className="flex flex-col gap-3">
                <a href="#" className="font-open-sans text-[#323743] hover:text-[#197DCA] transition-colors">Our Mission</a>
                <a href="#" className="font-open-sans text-[#323743] hover:text-[#197DCA] transition-colors">Team</a>
                <a href="#" className="font-open-sans text-[#323743] hover:text-[#197DCA] transition-colors">Careers</a>
                <a href="#" className="font-open-sans text-[#323743] hover:text-[#197DCA] transition-colors">Contact</a>
              </div>
            </div>

            {/* Column 5: Contact Us */}
            <div className="flex flex-col gap-6">
              <h3 className="font-archivo font-bold text-lg text-[#171A1F]">Contact Us</h3>
              
              <div className="flex flex-col gap-4">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="text-[#323743] mt-0.5 shrink-0" size={18} />
                  <span className="font-open-sans text-sm text-[#323743] leading-tight">
                    123 Legal Avenue,<br/> Mumbai, India
                  </span>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3">
                  <Phone className="text-[#323743] shrink-0" size={18} />
                  <span className="font-open-sans text-sm text-[#323743]">
                    +91 1800 123 4567
                  </span>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <Mail className="text-[#323743] shrink-0" size={18} />
                  <span className="font-open-sans text-sm text-[#323743]">
                    info@lawguideindia.com
                  </span>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex gap-4 mt-2">
                <a href="#" className="text-[#323743] hover:text-[#197DCA] transition-colors"><Facebook size={20} /></a>
                <a href="#" className="text-[#323743] hover:text-[#197DCA] transition-colors"><Twitter size={20} /></a>
                <a href="#" className="text-[#323743] hover:text-[#197DCA] transition-colors"><Linkedin size={20} /></a>
                <a href="#" className="text-[#323743] hover:text-[#197DCA] transition-colors"><Youtube size={20} /></a>
              </div>
            </div>

          </div>

          {/* Copyright Section */}
          <div className="border-t border-[#DEE1E6] pt-8 text-center">
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