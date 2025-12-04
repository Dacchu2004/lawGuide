import React, { useState } from 'react';
import { 
  Scale, 
  Plus, 
  Search, 
  MessageSquare, 
  Lightbulb, 
  Film, 
  Image as ImageIcon, 
  Cat, 
  CloudSun, 
  Menu, 
  BookOpen,
  ShieldAlert,
  PenTool,
  Languages,
  Tag,
  Mic,
  Send,
  MoreHorizontal
} from 'lucide-react';

const ChatPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Mock Data for History
  const historyToday = [
    { icon: <MessageSquare size={18} />, text: "Helpful AI Ready" },
    { icon: <Lightbulb size={18} />, text: "Greenhouse Effect Expla..." },
    { icon: <Film size={18} />, text: "Movie Streaming Help" },
  ];

  const historyPast = [
    { icon: <PenTool size={18} />, text: "Web Design Workflow" },
    { icon: <ImageIcon size={18} />, text: "Photo generation" },
    { icon: <Cat size={18} />, text: "Cats eat grass" },
    { icon: <CloudSun size={18} />, text: "Weather Dynamics" },
  ];

  // Mock Data for Suggestion Cards
  const suggestions = [
    { 
      icon: <BookOpen className="text-[#125D95]" size={24} />, 
      bg: "bg-[#DAECFA]", 
      text: "What are my Fundamental Rights if arrested?" 
    },
    { 
      icon: <ShieldAlert className="text-white" size={24} />, 
      bg: "bg-[#379AE6]", 
      text: "How do I file an e-FIR for a lost phone?",
      active: true // The highlighted one in your design
    },
    { 
      icon: <PenTool className="text-[#125D95]" size={24} />, 
      bg: "bg-[#DAECFA]", 
      text: "Draft a standard House Rental Agreement format." 
    },
    { 
      icon: <Languages className="text-[#125D95]" size={24} />, 
      bg: "bg-[#DAECFA]", 
      text: "Explain the new Bhartiya Nyaya Sanhita in Hindi." 
    },
    { 
      icon: <Tag className="text-[#125D95]" size={24} />, 
      bg: "bg-[#DAECFA]", 
      text: "Can a shopkeeper charge extra for a carry bag?" 
    }
  ];

  return (
    <div className="flex h-screen bg-white font-sans text-[#171A1F] overflow-hidden relative">
      
      {/* Mobile Overlay for Sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside 
        className={`
          fixed md:relative z-30
          h-[96%] top-[2%] left-2 md:left-4 bottom-4
          w-[280px] bg-[#DAECFA] rounded-2xl flex flex-col
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[110%] md:translate-x-0'}
        `}
      >
        {/* Logo Area */}
        <div className="p-5 flex items-center gap-3">
          <div className="p-1">
             {/* Using Scale icon as a proxy for the Justice Logo */}
            <Scale size={32} className="text-[#125D95]" fill="#125D95" /> 
          </div>
          <h1 className="font-archivo text-xl font-bold tracking-tight">LawGuide India</h1>
        </div>

        {/* New Chat & Search */}
        <div className="px-4 flex gap-2">
          <button className="flex-1 h-10 bg-[#171A1F] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-[#262A33] transition-colors">
            <Plus size={16} />
            <span className="text-sm font-medium">New Consultation</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/50 text-[#9095A1] transition-colors">
            <Search size={20} />
          </button>
        </div>

        {/* Scrollable History Area */}
        <div className="flex-1 overflow-y-auto px-4 mt-6 custom-scrollbar">
          
          {/* Today Section */}
          <div className="mb-6">
            <h3 className="text-xs font-medium text-[#171A1F] opacity-60 mb-3 px-2">Today</h3>
            <ul className="space-y-1">
              {historyToday.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 px-3 py-2 text-sm text-[#565D6D] hover:bg-black/5 rounded-md cursor-pointer transition-colors">
                  {item.icon}
                  <span className="truncate">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Previous 7 Days Section */}
          <div>
            <h3 className="text-xs font-medium text-[#171A1F] opacity-60 mb-3 px-2">Previous 7 days</h3>
            <ul className="space-y-1">
              {historyPast.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 px-3 py-2 text-sm text-[#565D6D] hover:bg-black/5 rounded-md cursor-pointer transition-colors">
                  {item.icon}
                  <span className="truncate">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* User Profile (Bottom) */}
        <div className="p-4 mt-auto border-t border-[#171A1F]/10 mx-4 mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#379AE6] overflow-hidden">
                {/* Placeholder Avatar */}
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emily" alt="User" className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-bold">Emily</span>
            </div>
            <button className="text-[#9095A1] hover:text-[#171A1F]">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>
      </aside>


      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-full relative w-full">
        
        {/* Mobile Header (Only visible on small screens) */}
        <div className="md:hidden p-4 flex items-center justify-between bg-white border-b">
           <button onClick={() => setIsSidebarOpen(true)} className="p-2">
             <Menu size={24} />
           </button>
           <span className="font-bold text-lg">LawGuide India</span>
           <div className="w-8" /> {/* Spacer */}
        </div>

        {/* Chat Scroll Area */}
        <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-4 md:p-8 pb-32">
          
          {/* Header Text */}
          <div className="text-center mb-10 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 text-[#171A1F]">
              Your AI Legal Companion for India
            </h1>
            <p className="text-[#9095A1] text-sm md:text-base italic">
              Ask questions in English, Hindi, Kannada, Tamil, or any Indian language
            </p>
          </div>

          {/* Suggestion Cards Grid */}
          <div className="w-full max-w-2xl space-y-3">
            {suggestions.map((card, idx) => (
              <button 
                key={idx}
                className={`
                  w-full flex items-center p-3 md:p-4 rounded-lg border text-left transition-all hover:shadow-md
                  ${card.active 
                    ? 'border-[#94C9F2] shadow-[0_0_2px_rgba(23,26,31,0.12)] bg-white' 
                    : 'bg-white border-gray-100 hover:border-blue-200'}
                `}
              >
                {/* Icon Box */}
                <div className={`w-12 h-12 md:w-[60px] md:h-[60px] rounded-md flex items-center justify-center flex-shrink-0 ${card.bg}`}>
                  {card.icon}
                </div>
                
                {/* Text */}
                <span className="ml-4 text-sm md:text-lg text-[#171A1F] flex-1">
                  {card.text}
                </span>

                {/* Arrow (Only for active/hover logic if needed, showing on active as per design) */}
                {card.active && (
                   <div className="hidden md:block text-[#379AE6]">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                       <path d="M5 12h14M12 5l7 7-7 7"/>
                     </svg>
                   </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area (Fixed Bottom) */}
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-white via-white to-transparent pb-6 pt-10 px-4 md:px-0 flex flex-col items-center">
          <div className="w-full max-w-3xl relative">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type your legal query (e.g., 'Is dowry illegal?')..."
              className="w-full h-[52px] pl-5 pr-24 rounded-lg border border-[#379AE6] focus:outline-none focus:ring-2 focus:ring-[#379AE6]/20 shadow-sm text-lg placeholder:text-gray-400"
            />
            
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button className="p-2 text-[#9095A1] hover:text-[#171A1F] transition-colors rounded-full hover:bg-gray-100">
                <Mic size={20} />
              </button>
              <button className={`p-2 transition-colors rounded-full ${query ? 'text-[#379AE6] hover:bg-blue-50' : 'text-[#9095A1]'}`}>
                <Send size={20} />
              </button>
            </div>
          </div>
          
          <p className="mt-3 text-xs text-[#9095A1] text-center px-4">
            LawGuide AI provides legal information, not professional advice. Always consult a verified advocate for court proceedings.
          </p>
        </div>

      </main>
    </div>
  );
};

export default ChatPage;