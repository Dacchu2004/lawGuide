// src/pages/LibraryPage.tsx
import React, { useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  FileText,
  Scale,
  Globe,
  Check,
  Sparkles,
} from "lucide-react";
import { searchLibrary } from "../api/library";
import type { LibrarySection as ApiLibrarySection } from "../api/library";

// --- Type Definitions used inside this page ---
type DomainType =
  | "Criminal"
  | "Property"
  | "Cyber"
  | "Family"
  | "Labour"
  | "Constitutional"
  | "Consumer";

interface LegalSection extends ApiLibrarySection {
  domain: DomainType;
}

// --- Mock Data (used as fallback & initial UI) ---
const mockResults: LegalSection[] = [
  {
    id: "1",
    act: "BNS 2023",
    section: "Section 151",
    title:
      "Punishment for causing grievous hurt voluntarily by use of any acid, etc.",
    description:
      "Punishment for causing grievous hurt voluntarily by use of any acid, etc.",
    domain: "Criminal",
    year: "2023",
    details: {
      fullText:
        "Ad aute qui cillum et pariatur nostrud quis ad Lorem pariatur elit aliquip excepteur. Esse ipsum Lorem minim excepteur dolore nostrud minim occaecat dolor dolor commodo magna eu velit nostrud occaecat.",
      aiExplanation:
        "This section outlines the severe penalties for intentionally inflicting grievous bodily harm using corrosive substances like acid. The law mandates a minimum of seven years imprisonment, extendable to life, along with a fine. It specifically targets acid attacks and similar acts of extreme violence.",
      offenseType: "Cognizable, Non-bailable",
      punishment: "Imprisonment for life or 7+ years + Fine",
      jurisdiction: "Central",
      source: "Official Gazette",
    },
  },
  {
    id: "2",
    act: "BNSS 2023",
    section: "Section 173",
    title: "Power to order police investigation in cognizable cases.",
    description: "Power to order police investigation in cognizable cases.",
    domain: "Criminal",
    year: "2023",
    details: {
      fullText: "Legal text regarding police investigation powers...",
      aiExplanation:
        "Empowers magistrates to order investigations when police refuse to file FIRs, ensuring checks and balances in the legal process.",
      offenseType: "Procedural",
      punishment: "N/A",
      jurisdiction: "Central",
      source: "Official Gazette",
    },
  },
  {
    id: "3",
    act: "IPC",
    section: "Section 420",
    title: "Cheating and dishonestly inducing delivery of property.",
    description: "Cheating and dishonestly inducing delivery of property.",
    domain: "Property",
    year: "1860",
    details: {
      fullText:
        "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property...",
      aiExplanation:
        "Deals with fraud and deception where one person induces another to deliver property or alter valuable security.",
      offenseType: "Cognizable, Non-bailable",
      punishment: "Up to 7 years + Fine",
      jurisdiction: "Central",
      source: "Indian Penal Code",
    },
  },
  {
    id: "4",
    act: "IT Act",
    section: "Section 66",
    title: "Computer related offences including hacking, data theft, etc.",
    description: "Computer related offences.",
    domain: "Cyber",
    year: "2000",
    details: {
      fullText:
        "If any person, dishonestly or fraudulently, does any act referred to in section 43...",
      aiExplanation:
        "Covers a wide range of cyber crimes including hacking and identity theft, focusing on unauthorized access and damage to computer systems.",
      offenseType: "Cognizable, Bailable",
      punishment: "Up to 3 years + Fine",
      jurisdiction: "Central",
      source: "IT Act 2000",
    },
  },
  {
    id: "5",
    act: "CrPC",
    section: "Section 125",
    title: "Order for maintenance of wives, children and parents.",
    description: "Maintenance laws.",
    domain: "Family",
    year: "1973",
    details: {
      fullText:
        "If any person having sufficient means neglects or refuses to maintain...",
      aiExplanation:
        "Ensures financial support for wives, children, and parents to prevent destitution, framing it as a social justice measure.",
      offenseType: "Civil/Criminal Hybrid",
      punishment: "Distress warrant / Imprisonment",
      jurisdiction: "Central",
      source: "CrPC 1973",
    },
  },
];

const LibraryPage: React.FC = () => {
  const [results, setResults] = useState<LegalSection[]>(mockResults);
  const [selectedResult, setSelectedResult] = useState<LegalSection>(
    mockResults[0]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Filter States
  const [filters, setFilters] = useState({
    acts: {
      "Bharatiya Nyaya Sanhita (BNS) 2023": true,
      "Bharatiya Nagarik Suraksha (BNSS)": false,
      "Indian Penal Code (IPC)": false,
      "Criminal Procedure Code (CrPC)": false,
      "IT Act": false,
    } as Record<string, boolean>,
    yearRange: 2024,
  });

  const toggleAct = (act: string) => {
    setFilters((prev) => ({
      ...prev,
      acts: { ...prev.acts, [act]: !prev.acts[act] },
    }));
  };

  // Helper for Badge Colors
  const getDomainStyle = (domain: string) => {
    switch (domain) {
      case "Criminal":
        return "bg-[#38EAFA] text-[#000000]";
      case "Property":
        return "bg-[#F4A462] text-white";
      case "Cyber":
        return "bg-[#E8C468] text-black";
      case "Family":
        return "bg-[#F3F4F6] text-gray-700";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // ================= SEARCH HANDLER =================
  // WHY:
  //  - collect active filters
  //  - call backend /library/search
  //  - update results list & selectedResult
  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const activeActs = Object.entries(filters.acts)
        .filter(([, checked]) => checked)
        .map(([act]) => act);

      const apiResults = await searchLibrary({
        query: searchQuery,
        acts: activeActs,
        yearMax: filters.yearRange,
      });

      // If backend returns empty array, keep it; else map to LegalSection
      const mapped: LegalSection[] = apiResults.map((r) => ({
        ...r,
        domain: r.domain as DomainType,
      }));

      if (mapped.length > 0) {
        setResults(mapped);
        setSelectedResult(mapped[0]);
      } else {
        setResults([]);
        setSelectedResult(
          mockResults[0] // or keep previous selectedResult
        );
      }
    } catch (error) {
      console.error("Library search failed, falling back to mock data:", error);
      setResults(mockResults);
      setSelectedResult(mockResults[0]);
    } finally {
      setIsSearching(false);
    }
  };

  // Optional: auto-search once on page load
  useEffect(() => {
    // handleSearch();
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#F8F9FA] font-sans text-[#1E2128] overflow-hidden">
      {/* --- 1. NAVBAR ---
      <nav className="h-[83px] bg-[#125D95] text-white flex-none flex items-center justify-between px-6 shadow-md z-30">
        <div className="flex items-center gap-3">
          <Scale className="w-8 h-8 text-white" fill="white" />
          <span className="font-archivo font-bold text-2xl tracking-tight">
            LawGuide India
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {["Discover", "Chat", "Library", "Rights"].map((item) => (
            <button
              key={item}
              className={`font-archivo text-lg font-medium transition-colors ${
                item === "Library"
                  ? "text-white font-bold"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 font-medium text-sm cursor-pointer opacity-90 hover:opacity-100">
            <Globe size={18} /> English <ChevronDown size={14} />
          </div>
          <div className="flex items-center gap-2 font-medium text-sm cursor-pointer opacity-90 hover:opacity-100">
            Maharashtra <ChevronDown size={14} />
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-pink-100">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </nav> */}

      {/* --- 2. SEARCH BAR --- */}
      <div className="h-[80px] bg-white flex-none border-b border-gray-200 flex items-center justify-center px-6 z-20">
        <div className="w-full max-w-5xl flex gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by section, case, keyword, or offense (e.g., theft, IPC 420, cyber fraud)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[52px] pl-14 pr-4 rounded-full border border-gray-200 focus:border-[#258CF4] focus:ring-2 focus:ring-[#258CF4]/20 outline-none transition-all text-[15px] font-open-sans shadow-sm"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-[#258CF4] hover:bg-blue-600 text-white px-10 h-[52px] rounded-full text-[15px] font-medium transition-colors shadow-sm disabled:opacity-70"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {/* --- 3. THREE-PANE LAYOUT --- */}
      <div className="flex-1 min-h-0 overflow-hidden p-4 md:p-6 w-full max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-stretch">
          {/* LEFT FILTERS */}
          <aside className="hidden lg:flex lg:col-span-3 bg-[#DAECFA]/50 rounded-xl border border-blue-100 flex-col h-full overflow-hidden">
            <div className="p-5 border-b border-blue-200/50 flex justify-between items-center bg-[#DAECFA]/20">
              <h2 className="font-archivo font-bold text-xl text-[#1E2128]">
                Filters
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-8">
              {/* Act Filter */}
              <div>
                <button className="flex justify-between items-center w-full font-bold text-[#1E2128] mb-3 text-sm">
                  Filter by Act <ChevronUp size={16} />
                </button>
                <div className="space-y-3">
                  {Object.entries(filters.acts).map(([act, checked]) => (
                    <label
                      key={act}
                      className="flex items-start gap-3 cursor-pointer group select-none"
                    >
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          toggleAct(act);
                        }}
                        className={`w-5 h-5 mt-0.5 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
                          checked
                            ? "bg-[#258CF4] border-[#258CF4]"
                            : "bg-white border-gray-400 group-hover:border-blue-400"
                        }`}
                      >
                        {checked && (
                          <Check
                            size={14}
                            className="text-white"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                      <span className="text-[13px] text-gray-700 leading-tight pt-0.5 group-hover:text-blue-600 transition-colors">
                        {act}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Domain Filter (UI only for now) */}
              <div>
                <button className="flex justify-between items-center w-full font-bold text-[#1E2128] mb-3 text-sm">
                  Filter by Domain <ChevronDown size={16} />
                </button>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Criminal",
                    "Cyber",
                    "Property",
                    "Consumer",
                    "Family",
                    "Labour",
                    "Constitutional",
                  ].map((tag) => (
                    <button
                      key={tag}
                      className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all shadow-sm ${
                        tag === "Criminal"
                          ? "bg-[#258CF4] text-white border-transparent"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jurisdiction Placeholder */}
              <div>
                <button className="flex justify-between items-center w-full font-bold text-[#1E2128] mb-1 text-sm py-2 border-b border-gray-300/50">
                  Filter by Jurisdiction <ChevronDown size={16} />
                </button>
              </div>

              {/* Year Slider */}
              <div>
                <button className="flex justify-between items-center w-full font-bold text-[#1E2128] mb-4 text-sm">
                  Filter by Year <ChevronDown size={16} />
                </button>
                <div className="px-1">
                  <input
                    type="range"
                    min="1990"
                    max="2024"
                    value={filters.yearRange}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        yearRange: parseInt(e.target.value),
                      }))
                    }
                    className="w-full h-1 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-[#258CF4]"
                  />
                  <div className="flex justify-between text-[11px] text-gray-500 mt-2 font-semibold font-open-sans">
                    <span>1990</span>
                    <span>{filters.yearRange}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-blue-200/50">
              <button
                onClick={() => {
                  setFilters({
                    acts: {
                      "Bharatiya Nyaya Sanhita (BNS) 2023": true,
                      "Bharatiya Nagarik Suraksha (BNSS)": false,
                      "Indian Penal Code (IPC)": false,
                      "Criminal Procedure Code (CrPC)": false,
                      "IT Act": false,
                    },
                    yearRange: 2024,
                  });
                }}
                className="w-full h-[40px] border border-[#258CF4] text-[#258CF4] rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors bg-white"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* MIDDLE COLUMN: RESULTS */}
          <section className="lg:col-span-4 flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-gray-100 bg-white z-10 sticky top-0 flex items-center justify-between">
              <h2 className="font-archivo font-bold text-xl text-[#1E2128]">
                Search Results
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4 bg-white">
              {results.length === 0 && (
                <p className="text-sm text-gray-500">
                  No results yet. Try searching for something like{" "}
                  <span className="font-semibold">"acid attack"</span> or{" "}
                  <span className="font-semibold">"IPC 420"</span>.
                </p>
              )}

              {results.map((result) => (
                <div
                  key={result.id}
                  onClick={() => setSelectedResult(result)}
                  className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 group relative bg-white ${
                    selectedResult.id === result.id
                      ? "border-[#258CF4] ring-1 ring-[#258CF4]/30 shadow-md"
                      : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4 relative">
                    <div className="relative">
                      <span className="text-[11px] font-bold text-[#258CF4] bg-blue-50 px-2.5 py-1 rounded border border-blue-100 z-10 relative">
                        {result.act}
                      </span>
                      <div
                        className={`absolute top-[50%] left-full w-[150px] h-[1px] ${
                          selectedResult.id === result.id
                            ? "bg-[#258CF4]"
                            : "bg-gray-100 group-hover:bg-blue-100"
                        } ml-2`}
                      ></div>
                    </div>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${getDomainStyle(
                        result.domain
                      )}`}
                    >
                      {result.domain}
                    </span>
                  </div>

                  <h3 className="text-[16px] font-bold text-[#1E2128] mb-2 leading-snug font-archivo">
                    {result.section}
                  </h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed font-open-sans mb-4">
                    {result.description}
                  </p>

                  <div className="flex justify-end">
                    <span className="text-[12px] font-bold text-[#258CF4] flex items-center gap-1 hover:underline">
                      View Details
                    </span>
                  </div>
                </div>
              ))}
              <div className="h-8" />
            </div>
          </section>

          {/* RIGHT COLUMN: DETAILS */}
          <main className="hidden lg:flex lg:col-span-5 bg-[#DAECFA]/30 rounded-xl border border-blue-100 flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-blue-100 bg-[#DAECFA]/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#125D95] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  {selectedResult.act}
                </span>
              </div>
              <h1 className="text-xl font-bold text-[#1E2128] leading-tight font-archivo">
                {selectedResult.section}: {selectedResult.title}
              </h1>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="font-open-sans text-[14px] text-gray-600 leading-7 space-y-4 mb-6">
                <p>{selectedResult.details.fullText}</p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-white shadow-sm ring-1 ring-blue-50 mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#258CF4]"></div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-[#258CF4]" />
                  <h3 className="text-[#258CF4] font-bold text-[14px] font-archivo">
                    Simplified AI Explanation
                  </h3>
                </div>
                <p className="text-[14px] text-[#1E2128] leading-relaxed font-open-sans">
                  {selectedResult.details.aiExplanation}
                </p>
              </div>

              <div className="text-[13px] font-open-sans space-y-3">
                <div className="flex justify-between items-start border-b border-gray-200/50 pb-2">
                  <span className="text-gray-500 font-medium w-1/3">
                    Offense Type
                  </span>
                  <span className="text-[#1E2128] text-right w-2/3">
                    {selectedResult.details.offenseType}
                  </span>
                </div>
                <div className="flex justify-between items-start border-b border-gray-200/50 pb-2">
                  <span className="text-gray-500 font-medium w-1/3">
                    Maximum Punishment
                  </span>
                  <span className="text-[#1E2128] text-right w-2/3">
                    {selectedResult.details.punishment}
                  </span>
                </div>
                <div className="flex justify-between items-start border-b border-gray-200/50 pb-2">
                  <span className="text-gray-500 font-medium w-1/3">
                    Jurisdiction
                  </span>
                  <span className="text-[#1E2128] text-right w-2/3">
                    {selectedResult.details.jurisdiction}
                  </span>
                </div>
                <div className="flex justify-between items-start pt-1">
                  <span className="text-gray-500 font-medium w-1/3">
                    Source Link
                  </span>
                  <a
                    href="#"
                    className="text-[#258CF4] font-medium flex items-center justify-end gap-1 hover:underline w-2/3 text-right"
                  >
                    <FileText size={12} /> {selectedResult.details.source}
                  </a>
                </div>
              </div>

              <div className="h-10" />
            </div>
          </main>
        </div>
      </div>

      {/* --- Modern Scrollbars --- */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
        }
      `}</style>
    </div>
  );
};

export default LibraryPage;
