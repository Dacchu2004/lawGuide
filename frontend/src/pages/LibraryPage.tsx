import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Search, FileText, Check, Sparkles } from "lucide-react";
import { searchLibrary } from "../api/library";
import { getAISummary } from "../api/ai";
import type { LibrarySection } from "../api/library";
import { useAuth } from "../context/AuthContext";

type DomainType =
  | "Criminal"
  | "Property"
  | "Cyber"
  | "Family"
  | "Labour"
  | "Constitutional"
  | "Consumer"
  | "Unknown";

interface UISection extends LibrarySection {
  domainUI: DomainType;
}

// Hardcoded Default Laws (Real Text for Demo)
const DEFAULT_LAWS: UISection[] = [
  {
    id: "def1",
    act: "Bharatiya Nyaya Sanhita 2023",
    section: "Section 103",
    text: "Punishment for murder. — (1) Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine. (2) When a group of five or more persons acting in concert commits murder on the ground of race, caste or community, sex, place of birth, language, personal belief or any other like ground each member of such group shall be punished with death or with imprisonment for life, and shall also be liable to fine.",
    domain: "Criminal",
    jurisdiction: "central",
    domainUI: "Criminal",
  },
  {
    id: "def2",
    act: "Constitution of India",
    section: "Article 21",
    text: "Protection of life and personal liberty. — No person shall be deprived of his life or personal liberty except according to procedure established by law.",
    domain: "Constitutional",
    jurisdiction: "central",
    domainUI: "Constitutional",
  },
  {
    id: "def3",
    act: "Information Technology Act, 2000",
    section: "Section 66D",
    text: "Punishment for cheating by personation by using computer resource. — Whoever, by means of any communication device or computer resource cheats by personation, shall be punished with imprisonment of either description for a term which may extend to three years and shall also be liable to fine which may extend to one lakh rupees.",
    domain: "Cyber",
    jurisdiction: "central",
    domainUI: "Cyber",
  },
  {
    id: "def4",
    act: "Bharatiya Nagarik Suraksha Sanhita 2023",
    section: "Section 173",
    text: "Information in cognizable cases. — (1) Every information relating to the commission of a cognizable offence, if given orally to an officer in charge of a police station, shall be reduced to writing by him or under his direction, and be read over to the informant; and every such information, whether given in writing or reduced to writing as aforesaid, shall be signed by the person giving it, and the substance thereof shall be entered in a book to be kept by such officer in such form as the State Government may prescribe in this behalf.",
    domain: "Criminal",
    jurisdiction: "central",
    domainUI: "Criminal",
  },
  {
    id: "def6",
    act: "Consumer Protection Act, 2019",
    section: "Section 2(9)",
    text: "Consumer rights includes,— (i) the right to be protected against the marketing of goods, products or services which are hazardous to life and property; (ii) the right to be informed about the quality, quantity, potency, purity, standard and price of goods, products or services, as the case may be, so as to protect the consumer against unfair trade practices; (iii) the right to be assured, wherever possible, access to a variety of goods, products or services at competitive prices.",
    domain: "Consumer",
    jurisdiction: "central",
    domainUI: "Consumer",
  },
  {
    id: "def7",
    act: "Hindu Marriage Act, 1955",
    section: "Section 13",
    text: "Divorce. — (1) Any marriage solemnized, whether before or after the commencement of this Act, may, on a petition presented by either the husband or the wife, be dissolved by a decree of divorce on the ground that the other party — (ia) has, after the solemnization of the marriage, treated the petitioner with cruelty; or (ib) has deserted the petitioner for a continuous period of not less than two years immediately preceding the presentation of the petition.",
    domain: "Family",
    jurisdiction: "central",
    domainUI: "Family",
  },
  {
    id: "def8",
    act: "Motor Vehicles Act, 1988",
    section: "Section 184",
    text: "Driving dangerously. — (1) Whoever drives a motor vehicle at a speed or in a manner which is dangerous to the public, having regard to all the circumstances of the case including the nature, condition and use of the place where the vehicle is driven and the amount of traffic which actually is at the time or which might reasonably be expected to be in the place, shall be punishable for the first offence with imprisonment for a term which may extend to one year but which may not be less than six months or with fine which may extend to ten thousand rupees or with both.",
    domain: "Criminal",
    jurisdiction: "central",
    domainUI: "Criminal",
  },
  {
    id: "def10",
    act: "Constitution of India",
    section: "Article 19",
    text: "Protection of certain rights regarding freedom of speech etc.—(1) All citizens shall have the right— (a) to freedom of speech and expression; (b) to assemble peaceably and without arms; (c) to form associations or unions; (d) to move freely throughout the territory of India; (e) to reside and settle in any part of the territory of India; and (g) to practise any profession, or to carry on any occupation, trade or business.",
    domain: "Constitutional",
    jurisdiction: "central",
    domainUI: "Constitutional",
  },
];

const LibraryPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [results, setResults] = useState<UISection[]>(DEFAULT_LAWS);
  const [selectedResult, setSelectedResult] = useState<UISection | null>(
    DEFAULT_LAWS[0]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [acts, setActs] = useState<string[]>([]);
  const [filters, setFilters] = useState<Record<string, boolean>>({});
  const [selectedDomain, setSelectedDomain] = useState<string | undefined>();
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<
    string | undefined
  >();

  const [aiSummary, setAiSummary] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    // Customize Acts Filter (Hardcoded as per user request)
    const IMPORTANT_ACTS = [
      "Bharatiya Nagarik Suraksha Sanhita 2023",
      "Bharatiya Nyaya Sanhita 2023",
      "Bharatiya Sakshya Adhinyam 2023",
      "Constitution of India",
      "Information Technology Act, 2000",
    ];

    setActs(IMPORTANT_ACTS);
    const map: Record<string, boolean> = {};
    IMPORTANT_ACTS.forEach((a) => (map[a] = false));
    setFilters(map);

    /* 
    // OLD: Fetch from API
    getActs().then((data) => {
      setActs(data);
      const map: Record<string, boolean> = {};
      data.forEach((a) => (map[a] = false));
      setFilters(map);
    });
    */

    // ✅ HANDLE NAVIGATION STATE - REMOVED from here to allow handleSearch usage
    // const state = location.state as { query?: string; domain?: string } | null;
    // ... (logic moved below)
  }, []); // Only run once for Acts init

  // ✅ SCROLL TO TOP ON MOUNT
  useEffect(() => {
    const main = document.getElementById("main-content");
    if (main) main.scrollTop = 0;
  }, []);

  const toggleAct = (act: string) => {
    setFilters((prev) => ({ ...prev, [act]: !prev[act] }));
  };

  const getDomainStyle = (domain?: string) => {
    switch (domain) {
      case "Criminal":
        return "bg-[#38EAFA] text-black";
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

  // ✅ SAFE SEARCH (NO UI CHANGE)
  const handleSearch = async (qOverride?: string, dOverride?: string) => {
    const q = qOverride !== undefined ? qOverride : searchQuery;
    const d = dOverride !== undefined ? dOverride : selectedDomain;

    // FIX: If query and domain are empty, show defaults
    if (!q.trim() && !d) {
      setResults(DEFAULT_LAWS);
      setSelectedResult(DEFAULT_LAWS[0]);
      setAiSummary("");
      return;
    }

    setIsSearching(true);

    try {
      const activeActs = Object.entries(filters)
        .filter(([, checked]) => checked)
        .map(([act]) => act);

      const data = await searchLibrary({
        query: q.trim(),
        act: activeActs.length === 1 ? activeActs[0] : "",
        domain: d || "",
        jurisdiction: selectedJurisdiction || "",
      });

      // ✅ HARD FILTER: remove fake / empty rows
      const cleaned = (data || []).filter(
        (r: any) =>
          r?.text &&
          typeof r.text === "string" &&
          r.text.trim().length > 30 &&
          r.text.trim() !== "..."
      );

      const mapped: UISection[] = cleaned.map((r: any) => ({
        ...r,
        sourceLink: r.source_link, // IMPORTANT FIX
        domainUI: (r.domain as DomainType) || "Unknown",
      }));

      setResults(mapped);
      setSelectedResult(mapped.length ? mapped[0] : null);
      setAiSummary("");
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
      setSelectedResult(null);
      setAiSummary("");
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Navigation Loop from Home Page
  useEffect(() => {
    const state = location.state as { query?: string; domain?: string } | null;
    if (state) {
      if (state.query) setSearchQuery(state.query);
      if (state.domain) setSelectedDomain(state.domain);

      // Trigger search immediately with incoming values
      handleSearch(state.query, state.domain);

      // Clear state to prevent loop on refresh? (Optional, but React Router keeps state)
      // window.history.replaceState({}, document.title) // risky if user refreshes
    }
  }, [location.state]);

  useEffect(() => {
    // Only auto-search if filters change, NOT purely on text change (user must click search)
    // But if domain changes via UI, we might want to auto-search
    if (selectedDomain) {
      handleSearch();
    }
  }, [selectedDomain, selectedJurisdiction, filters]);

  const fetchAISummary = async (section: UISection) => {
    if (!section?.text) return;

    setLoadingAI(true);
    try {
      const summary = await getAISummary({
        text: section.text,
        user_state: user?.state,
        user_language: user?.language,
      });

      setAiSummary(summary || "No AI summary available.");
    } catch {
      setAiSummary("AI service unavailable.");
    } finally {
      setLoadingAI(false);
    }
  };

  useEffect(() => {
    if (selectedResult) fetchAISummary(selectedResult);
  }, [selectedResult]);

  return (
    <div className="h-full flex flex-col bg-[#F8F9FA] overflow-hidden">
      {/* SEARCH BAR */}
      <div className="h-[80px] bg-white border-b flex items-center justify-center px-6">
        <div className="w-full max-w-5xl flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by keyword, section, offence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isSearching) {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              className="w-full h-[52px] pl-14 pr-4 rounded-full border"
            />
          </div>

          <button
            onClick={() => handleSearch()}
            disabled={isSearching}
            className="bg-[#258CF4] text-white px-10 h-[52px] rounded-full"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {/* 3-PANE LAYOUT */}
      <div className="flex-1 min-h-0 p-6 grid grid-cols-12 gap-6">
        {/* LEFT FILTERS */}
        <aside className="col-span-3 bg-[#DAECFA]/40 rounded-xl border p-5 overflow-y-auto no-scrollbar">
          <h2 className="font-bold mb-4">Filters</h2>

          {acts.map((act) => (
            <label key={act} className="flex gap-3 text-sm mb-3 cursor-pointer">
              <div
                onClick={() => toggleAct(act)}
                className={`w-4 h-4 border flex items-center justify-center ${
                  filters[act] ? "bg-[#258CF4] border-[#258CF4]" : "bg-white"
                }`}
              >
                {filters[act] && <Check size={12} className="text-white" />}
              </div>
              {act}
            </label>
          ))}

          {/* DOMAIN */}
          <div className="mt-6">
            <h3 className="font-bold text-sm mb-2">Domain</h3>
            {[
              "Criminal",
              "Property",
              "Cyber",
              "Family",
              "Consumer",
              "Labour",
              "Constitutional",
            ].map((d) => (
              <button
                key={d}
                onClick={() =>
                  setSelectedDomain(selectedDomain === d ? undefined : d)
                }
                className={`px-3 py-1 text-xs rounded-full border mr-2 mb-2 ${
                  selectedDomain === d ? "bg-[#258CF4] text-white" : "bg-white"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* JURISDICTION */}
          <div className="mt-6">
            <h3 className="font-bold text-sm mb-2">Jurisdiction</h3>
            {["central", "state"].map((j) => (
              <button
                key={j}
                onClick={() =>
                  setSelectedJurisdiction(
                    selectedJurisdiction === j ? undefined : j
                  )
                }
                className={`px-3 py-1 text-xs rounded-full border mr-2 ${
                  selectedJurisdiction === j
                    ? "bg-[#258CF4] text-white"
                    : "bg-white"
                }`}
              >
                {j}
              </button>
            ))}
          </div>
        </aside>

        {/* MIDDLE RESULTS (CRASH FIX ✅) */}
        <section className="col-span-4 bg-white rounded-xl border overflow-y-auto no-scrollbar">
          {results.map((result) => (
            <div
              key={result.id || `${result.act}-${result.section}`}
              onClick={() => setSelectedResult(result)}
              className={`p-5 border-b cursor-pointer ${
                selectedResult?.id === result.id
                  ? "border-[#258CF4] bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-between mb-2">
                <span className="text-xs font-bold text-[#258CF4]">
                  {result.act}
                </span>
                <span
                  className={`text-[10px] px-2 rounded ${getDomainStyle(
                    result.domain
                  )}`}
                >
                  {result.domain || "General"}
                </span>
              </div>

              <h3 className="text-sm font-bold mt-1">{result.section}</h3>

              {/* ✅ THIS LINE FIXES YOUR WHITE SCREEN */}
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {(result.text || "").slice(0, 120)}...
              </p>
            </div>
          ))}

          {results.length === 0 && (
            <p className="p-4 text-sm text-gray-500">No results found</p>
          )}
        </section>

        {/* RIGHT DETAILS – UNCHANGED */}
        <main className="col-span-5 bg-[#DAECFA]/30 rounded-xl border p-6 overflow-y-auto no-scrollbar">
          {!selectedResult && <p>Select a result</p>}

          {selectedResult && (
            <>
              <span className="bg-[#125D95] text-white text-xs px-2 py-1 rounded">
                {selectedResult.act}
              </span>

              <h1 className="text-xl font-bold mt-2 mb-4">
                {selectedResult.section}
              </h1>

              <p className="text-sm text-gray-700 mb-5 whitespace-pre-wrap">
                {selectedResult.text}
              </p>

              <div className="bg-white rounded-xl p-5 border relative mb-6">
                <div className="absolute left-0 top-0 h-full w-1 bg-[#258CF4]" />
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-[#258CF4]" />
                  <h3 className="font-bold text-[#258CF4] text-sm">
                    AI Explanation
                  </h3>
                </div>

                {loadingAI ? (
                  <p>Generating...</p>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{aiSummary}</p>
                )}
              </div>

              <div className="mt-4">
                <b>Jurisdiction:</b> {selectedResult.jurisdiction || "India"}
                {selectedResult.sourceLink ? (
                  <a
                    href={selectedResult.sourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#258CF4] text-[#125D95] hover:bg-[#258CF4] hover:text-white transition-all duration-150 cursor-pointer"
                  >
                    <FileText size={16} />
                    Open Government Page
                  </a>
                ) : (
                  <p className="text-xs text-gray-500 mt-2 italic">
                    Official document link is not available for this section.
                  </p>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default LibraryPage;
