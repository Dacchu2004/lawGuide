import React from "react";
import { Scale, Clock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RightsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-full w-full bg-[#f8fafc] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor (optional subtle patterns) */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-100 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-2xl w-full bg-white rounded-[24px] shadow-xl p-10 md:p-14 text-center relative z-10 border border-white/50 backdrop-blur-sm">
        {/* Icon */}
        <div className="w-20 h-20 bg-[#EFF6FF] text-[#258CF4] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <Scale size={40} strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <h1 className="font-archivo font-bold text-3xl md:text-4xl text-[#171A1F] mb-4">
          Rights Framework Coming Soon
        </h1>

        {/* Message */}
        <p className="font-open-sans text-[#565D6D] text-lg leading-relaxed mb-10 max-w-lg mx-auto">
          We are meticulously crafting a comprehensive guide to your fundamental
          rights. This section will soon offer detailed insights into the Indian
          Constitution, empowering you with the knowledge you deserve.
        </p>

        {/* Buttons / CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 px-6 py-3 bg-[#258CF4] hover:bg-[#197DCA] text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
          >
            <ArrowLeft size={18} />
            Back to Home
          </button>

          <div className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-400 rounded-xl font-medium border border-gray-200 cursor-not-allowed">
            <Clock size={18} />
            Work in Progress
          </div>
        </div>
      </div>

      {/* Footer Text */}
      <p className="mt-8 text-gray-400 text-sm font-medium">
        LawGuide India © 2025
      </p>
    </div>
  );
};

export default RightsPage;
