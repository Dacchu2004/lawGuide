import React, { useEffect, useState } from "react";
import { Search, FileText, Check, Sparkles } from "lucide-react";
import { searchLibrary, getActs } from "../api/library";
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

const LibraryPage: React.FC = () => {
  const { user } = useAuth();

  const [results, setResults] = useState<UISection[]>([]);
  const [selectedResult, setSelectedResult] = useState<UISection | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [acts, setActs] = useState<string[]>([]);
  const [filters, setFilters] = useState<Record<string, boolean>>({});
  const [selectedDomain, setSelectedDomain] = useState<string | undefined>();
  const [selectedJurisdiction, setSelectedJurisdiction] =
    useState<string | undefined>();

  const [aiSummary, setAiSummary] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    getActs().then((data) => {
      setActs(data);
      const map: Record<string, boolean> = {};
      data.forEach((a) => (map[a] = false));
      setFilters(map);
    });
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
  const handleSearch = async () => {
  if (!searchQuery.trim()) {
    setResults([]);
    setSelectedResult(null);
    setAiSummary("");
    return;
  }

  setIsSearching(true);

  try {
    const activeActs = Object.entries(filters)
      .filter(([, checked]) => checked)
      .map(([act]) => act);

    const data = await searchLibrary({
      query: searchQuery.trim(),
      act: activeActs.length === 1 ? activeActs[0] : "",
      domain: selectedDomain || "",
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


  useEffect(() => {
    if (searchQuery.trim()) {
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
            onClick={handleSearch}
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
        <aside className="col-span-3 bg-[#DAECFA]/40 rounded-xl border p-5 overflow-y-auto">
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
                  selectedDomain === d
                    ? "bg-[#258CF4] text-white"
                    : "bg-white"
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
        <section className="col-span-4 bg-white rounded-xl border overflow-y-auto">
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
        <main className="col-span-5 bg-[#DAECFA]/30 rounded-xl border p-6 overflow-y-auto">
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

              <div className="text-sm text-gray-600">
                <p>
                  <b>Jurisdiction:</b>{" "}
                  {selectedResult.jurisdiction || "India"}
                </p>

                {selectedResult.sourceLink && (
                  <a
                    href={selectedResult.sourceLink}
                    target="_blank"
                    className="text-[#258CF4] flex items-center gap-1 mt-2"
                  >
                    <FileText size={14} />
                    Official Source
                  </a>
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
