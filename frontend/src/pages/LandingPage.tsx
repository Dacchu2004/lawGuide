import { Search, ChevronDown, Gavel, CheckCircle, Brain, Globe, Twitter, Facebook, Linkedin, Youtube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="font-['Inter'] text-[#171A1F] bg-white overflow-x-hidden">
      
      {/* ================= NAVBAR ================= */}
      <nav className="h-[104px] flex items-center justify-between px-6 lg:px-12 bg-white relative z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <img src="/assets/logo.png" alt="LawGuide India" className="h-16 w-auto" />
        </div>

        <div className="hidden lg:flex items-center gap-1 bg-white">
          {['Rights Hub', 'AI Auditor', 'About us', 'Help'].map((item, index) => (
            <a 
              key={item} 
              href="#" 
              className={`px-4 py-3 text-[16px] leading-[26px] font-normal ${index === 0 ? 'font-bold bg-[#F3F4F6] rounded' : 'hover:bg-gray-50'}`}
            >
              {item} {index === 0 && <ChevronDown className="inline w-4 h-4 ml-1"/>}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#171A1F]" />
            <input 
              type="text" 
              placeholder="Search" 
              className="pl-10 pr-4 h-[36px] w-[192px] border border-[#BDC1CA] rounded-[6px] text-[14px] focus:outline-none focus:border-[#9095A1]"
            />
          </div>
          <button 
            onClick={() => navigate('/auth')}
            className="h-[36px] px-4 bg-[#379AE6] text-white text-[14px] rounded-[10px] hover:bg-[#197DCA] transition-colors"
          >
            Get started
          </button>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="relative px-6 lg:px-20 py-12 flex flex-col lg:flex-row items-center justify-between">
        <div className="lg:w-1/2 z-10 mb-12 lg:mb-0">
          <h1 className="font-['Archivo'] text-[48px] leading-[68px] font-bold text-[#171A1F] mb-6">
            Simplify Indian Law. <br />
            Know Your Rights.
          </h1>
          
          <p className="text-[18px] leading-[28px] text-[#565D6D] mb-10 max-w-lg">
            A Responsible AI platform that explains your rights and retrieves accurate legal sections from the Bharatiya Nyaya Sanhita (BNS) & more.
          </p>

          <div className="flex gap-4">
            <button className="h-[52px] px-6 bg-[#379AE6] text-white text-[18px] rounded-[6px] hover:bg-[#197DCA] transition-colors font-medium">
              Chat with AI
            </button>
            <button className="h-[52px] px-6 border border-[#66BCFF] text-[#66BCFF] text-[18px] rounded-[6px] hover:text-[#007EDE] hover:border-[#007EDE] transition-colors font-medium bg-transparent">
              Learn more
            </button>
          </div>
        </div>

        <div className="lg:w-1/2 relative flex flex-col gap-5 items-end">
          <div className="absolute top-0 right-0 w-full h-full bg-pink-50 rounded-full blur-3xl -z-10 transform scale-125"></div>
          <img src="/assets/lady_justice_lineart.png" alt="Justice" className="absolute right-[-40px] top-[-20px] w-64 z-0 hidden xl:block" />

          {/* Card 1 */}
          <div className="relative z-10 w-full max-w-[375px] h-[126px] bg-white rounded-[16px] shadow-sm border border-gray-100 flex items-center p-2 hover:shadow-md transition-shadow">
            <img src="/assets/kids_education.jpg" alt="Property" className="w-[147px] h-[111px] rounded-[6px] object-cover" />
            <div className="ml-4 flex flex-col justify-between h-[111px] py-1">
              <h3 className="font-['Archivo'] font-bold text-[16px] text-[#171A1F]">Property Disputes</h3>
              <div className="flex items-center gap-2 mt-auto">
                <span className="bg-[#F3F4F6] px-2 py-1 rounded-[12px] text-[11px] text-[#323743]">Civil Law</span>
              </div>
              <span className="text-[#379AE6] text-[12px] mt-1 cursor-pointer">View more</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative z-10 w-full max-w-[375px] h-[126px] bg-white rounded-[16px] shadow-sm border border-gray-100 flex items-center p-2 ml-[-20px] hover:shadow-md transition-shadow">
            <img src="/assets/doctor_patient.jpg" alt="Cyber" className="w-[147px] h-[111px] rounded-[6px] object-cover" />
            <div className="ml-4 flex flex-col justify-between h-[111px] py-1">
              <h3 className="font-['Archivo'] font-bold text-[16px] text-[#171A1F]">Cyber Fraud & IT</h3>
              <div className="flex items-center gap-2 mt-auto">
                 <span className="bg-[#F3F4F6] px-2 py-1 rounded-[12px] text-[11px] text-[#323743]">Cyber Law</span>
              </div>
              <span className="text-[#379AE6] text-[12px] mt-1 cursor-pointer">View more</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative z-10 w-full max-w-[375px] h-[126px] bg-white rounded-[16px] shadow-sm border border-gray-100 flex items-center p-2 hover:shadow-md transition-shadow">
            <img src="/assets/women_safety.jpg" alt="Safety" className="w-[147px] h-[111px] rounded-[6px] object-cover" />
            <div className="ml-4 flex flex-col justify-between h-[111px] py-1">
              <h3 className="font-['Archivo'] font-bold text-[16px] text-[#171A1F]">Women's Safety</h3>
              <div className="flex items-center gap-2 mt-auto">
                 <span className="bg-[#F3F4F6] px-2 py-1 rounded-[12px] text-[11px] text-[#323743]">Criminal</span>
              </div>
              <span className="text-[#379AE6] text-[12px] mt-1 cursor-pointer">View more</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EXPLORE LAWS ================= */}
      <section className="mx-6 lg:mx-20 mt-10 mb-20 h-auto lg:h-[152px] bg-[#ACD5F5] rounded-[16px] flex flex-col justify-center px-8 py-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <h2 className="font-['Archivo'] text-[24px] font-medium text-[#197DCA] whitespace-nowrap">
            Explore Laws:
          </h2>
          <div className="flex flex-wrap gap-3">
            {['Police Rights', 'Traffic Rules', 'FIR Process', 'Consumer Rights', 'Rent Agreements'].map((tag) => (
              <button key={tag} className="h-[44px] px-4 bg-white rounded-[22px] text-[16px] text-[#171A1F] hover:bg-[#E6F0FF] transition">
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS SECTION ================= */}
      <section className="w-full bg-[#197DCA] py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          
          <div className="text-center mb-20 relative flex justify-center items-center gap-4">
            <h2 className="font-['Archivo'] font-bold text-[36px] md:text-[48px] leading-[1.2] text-white">
              Your Legal Journey, Simplified
            </h2>
            <Gavel className="w-[60px] h-[60px] md:w-[102px] md:h-[102px] text-white stroke-[1.5]" />
          </div>

          <div className="flex flex-wrap justify-center gap-8 mb-24">
            {/* Cards 1, 2, 3 */}
            {[
                { icon: CheckCircle, title: "1. Describe Your Issue", desc: "Type your legal problem in plain English or your native language. No complex legal jargon needed." },
                { icon: Brain, title: "2. AI Retrieves the Law", desc: "Our AI scans the official BNS & BNSS 2023 databases to find the exact Act and Section matching your case." },
                { icon: Globe, title: "3. Get Verified Advice", desc: "Receive a clear explanation with a confidence score and source links. Dual-phase validated for safety." }
            ].map((card, i) => (
                <div key={i} className="w-[368px] h-[292px] bg-[#ACD5F5]/80 rounded-[6px] shadow-sm flex flex-col items-center text-center p-6 relative group hover:scale-[1.02] transition-transform">
                    <div className="mt-2 mb-4 w-[120px] h-[120px] bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <card.icon className="w-[64px] h-[64px] text-white" />
                    </div>
                    <h3 className="font-['Archivo'] font-bold text-[20px] leading-[30px] text-white mb-2">{card.title}</h3>
                    <p className="font-['Inter'] font-normal text-[14px] leading-[22px] text-white px-4">{card.desc}</p>
                </div>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center border-t border-white/20 pt-12">
            {[
                { val: "3", label: "New Acts" },
                { val: "100%", label: "Free" },
                { val: "2000+", label: "Sections" },
                { val: "12+", label: "Languages" },
                { val: "24/7", label: "Access" },
                { val: "AI", label: "Audited" }
            ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                    <span className="font-['Archivo'] font-normal text-[36px] leading-[50px] text-white">{stat.val}</span>
                    <span className="font-['Inter'] font-normal text-[20px] leading-[30px] text-white">{stat.label}</span>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= NEWSLETTER SECTION (WHITE BG) ================= */}
      {/* UPDATED: Background changed to WHITE, text to DARK BLUE */}
      <section className="w-full bg-white py-20">
        <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                
                {/* Illustration */}
                <div className="relative lg:w-1/2 flex justify-center lg:justify-start">
                    <img src="/assets/person_pointing.png" alt="Subscribe" className="w-[400px] h-auto lg:w-[636px] object-contain" />
                </div>

                {/* Newsletter Content */}
                <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <h2 className="font-['Archivo'] font-bold text-[32px] md:text-[48px] leading-[1.2] mb-6 text-[#171A1F]">
                        Stay Legal Ready. <br/>
                        Get the latest updates on Indian Law & Rights directly to your inbox.
                    </h2>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[540px]">
                        <input 
                            type="email" 
                            placeholder="Enter your email address" 
                            className="flex-1 h-[52px] px-5 rounded-[6px] text-[#171A1F] text-[18px] bg-white border border-gray-300 focus:outline-none focus:border-[#379AE6] focus:ring-1 focus:ring-[#379AE6]"
                        />
                        <button className="h-[52px] px-8 bg-[#379AE6] text-white font-bold text-[18px] rounded-[6px] hover:bg-[#197DCA] transition-colors shadow-lg shadow-blue-100">
                            Get Updates
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* ================= BOTTOM LINKS (BLUE BG) ================= */}
      <footer className="w-full bg-[#197DCA] pt-16 pb-12 text-white">
        <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
                
                {/* Brand Column */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <img src="/assets/logo_white.png" alt="LawGuide India" className="h-12 w-auto brightness-0 invert" /> 
                        <span className="font-['Archivo'] font-bold text-[24px]">LawGuide India</span>
                    </div>
                    <p className="font-['Inter'] text-[14px] max-w-xs opacity-90">
                        (204) 541-9863 <br/>
                        123 Legal Avenue, New Delhi, India
                    </p>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-8 text-[14px] font-['Inter']">
                    <div className="flex flex-col gap-3">
                        <a href="#" className="hover:underline opacity-90">Rights Hub</a>
                        <a href="#" className="hover:underline opacity-90">AI Lawyer (Chat)</a>
                        <a href="#" className="hover:underline opacity-90">Law Library</a>
                    </div>
                    <div className="flex flex-col gap-3">
                        <a href="#" className="hover:underline opacity-90">About LawGuide</a>
                        <a href="#" className="hover:underline opacity-90">How AI Works</a>
                        <a href="#" className="hover:underline opacity-90">Open Source Code</a>
                        <a href="#" className="hover:underline opacity-90">Contact</a>
                    </div>
                    <div className="flex flex-col gap-3">
                        <a href="#" className="hover:underline opacity-90">Privacy Policy</a>
                        <a href="#" className="hover:underline opacity-90">Terms of Use</a>
                        <a href="#" className="hover:underline opacity-90">Disclaimer</a>
                        <span className="opacity-60">© 2025 LawGuide India</span>
                    </div>
                    <div className="flex flex-col gap-6">
                        <button className="h-[52px] px-6 border border-white rounded-[6px] text-[18px] hover:bg-white hover:text-[#197DCA] transition-colors">
                            Help Center
                        </button>
                        <div className="flex gap-4">
                            <Twitter className="w-6 h-6 cursor-pointer hover:opacity-80" />
                            <Facebook className="w-6 h-6 cursor-pointer hover:opacity-80" />
                            <Linkedin className="w-6 h-6 cursor-pointer hover:opacity-80" />
                            <Youtube className="w-6 h-6 cursor-pointer hover:opacity-80" />
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