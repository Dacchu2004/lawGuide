import { useState, useRef, useEffect } from "react";
import TypewriterScene from "../components/TypewriterScene";
import { usePaperForm } from "../hooks/usePaperForm";
import useSound from "use-sound";
import { loginRequest, signupRequest } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const clickSfx = "/assets/key-click.wav";

export default function AuthPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [language, setLanguage] = useState("");
  const [state, setState] = useState("");
  const [username, setUsername] = useState("");

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsViewed, setTermsViewed] = useState(false);

  const [scrollTarget, setScrollTarget] = useState<
    "login" | "signup" | "terms"
  >("login");

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [playClick] = useSound(clickSfx, { volume: 0.6 });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleKeyDown = () => {
    playClick();
    setErrorMsg(null);
  };

  useEffect(() => {
    setScrollTarget(mode === "login" ? "login" : "signup");
  }, [mode]);

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;

    setTimeout(() => {
      if (scrollTarget === "login") {
        container.scrollTo({ top: 30, behavior: "smooth" });
      } else if (scrollTarget === "signup") {
        const signupPos = container.scrollHeight * 0.4;
        container.scrollTo({ top: signupPos, behavior: "smooth" });
      } else if (scrollTarget === "terms") {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 80);
  }, [scrollTarget]);

  const { canvasRef, texture } = usePaperForm({
    mode,
    email,
    password: pwd,
    language,
    state,
    username,
    termsAccepted,
  });

  const handleSubmit = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !pwd) {
      setErrorMsg("Email and password are required.");
      return;
    }

    if (mode === "signup") {
      if (!state || !language) {
        setErrorMsg("State and language are required for signup.");
        return;
      }
      if (!termsAccepted) {
        setErrorMsg("Please accept the terms & conditions to signup.");
        return;
      }
    }

    try {
      setLoading(true);

      if (mode === "login") {
        const data = await loginRequest({ email, password: pwd });
        login(data.user, data.token);
        setSuccessMsg("Login successful!");
        navigate("/home");
      } else {
        await signupRequest({
          email,
          password: pwd,
          state,
          language,
          username: username || undefined,
        });

        setSuccessMsg("Signup successful! You can now login.");
        setMode("login");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";

      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* ✅ LEFT SIDE FORM — TAILWIND MATCHING VISILY DESIGN */}
      <div className="w-[40%] min-w-[360px] bg-white flex items-center justify-center relative overflow-hidden">
        <div className="w-[448px] h-[820px] bg-white rounded-[224px] shadow-sm flex flex-col px-10 py-14 relative">

          <h2 className="text-[30px] font-bold text-[#171A1F] mb-2">
            {mode === "login"
              ? "Welcome back to LawGuide India"
              : "Create your LawGuide account"}
          </h2>

          <p className="text-[14px] text-[#323743] mb-8">
            {mode === "login"
              ? "Sign in to access your legal resources and tools."
              : "Save laws, get alerts, and ask questions"}
          </p>

          <input
            type="text"
            placeholder={mode === "login" ? "Email or Mobile" : "Email"}
            value={email}
            onFocus={() => mode === "signup" && setScrollTarget("signup")}
            onChange={(e) => {
              setEmail(e.target.value);
              handleKeyDown();
            }}
            className="w-full h-[40px] border border-[#DEE1E6] rounded-md px-4 text-sm mb-4"
          />

          <input
            type="password"
            placeholder="Password"
            value={pwd}
            onFocus={() => mode === "signup" && setScrollTarget("signup")}
            onChange={(e) => {
              setPwd(e.target.value);
              handleKeyDown();
            }}
            className="w-full h-[40px] border border-[#DEE1E6] rounded-md px-4 text-sm mb-4"
          />

          {mode === "signup" && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  handleKeyDown();
                }}
                className="w-full h-[40px] border border-[#DEE1E6] rounded-md px-4 text-sm mb-4"
              />

              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  handleKeyDown();
                }}
                className="w-full h-[40px] border border-[#DEE1E6] rounded-md px-3 text-sm mb-4"
              >
                <option value="">Select Language</option>
                <option>English</option>
                <option>Hindi</option>
                <option>Tamil</option>
              </select>

              <select
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  handleKeyDown();
                }}
                className="w-full h-[40px] border border-[#DEE1E6] rounded-md px-3 text-sm mb-4"
              >
                <option value="">Select State</option>
                <option>Maharashtra</option>
                <option>Karnataka</option>
              </select>

              <button
                onClick={() => {
                  setTermsViewed(true);
                  setScrollTarget("terms");
                }}
                className="text-[#2F8EFF] text-sm mb-2 text-left"
              >
                View Terms & Conditions
              </button>

              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  disabled={!termsViewed}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    handleKeyDown();
                  }}
                />
                <label className="text-sm text-[#171A1F]">
                  Agree to Terms & Privacy Policy
                </label>
              </div>
            </>
          )}

          {errorMsg && <p className="text-red-500 text-sm mb-2">{errorMsg}</p>}
          {successMsg && <p className="text-green-500 text-sm mb-2">{successMsg}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-[48px] rounded-md text-white text-[16px] font-medium bg-gradient-to-r from-blue-600 to-blue-400 mt-2"
          >
            {loading
              ? mode === "login"
                ? "Logging in..."
                : "Signing up..."
              : mode === "login"
              ? "Sign in"
              : "Create Account"}
          </button>

          <p
            onClick={switchMode}
            className="text-center text-sm text-[#2F8EFF] mt-4 cursor-pointer"
          >
            {mode === "login"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </p>
        </div>
      </div>

      {/* ✅ RIGHT SIDE — PAPER + TYPEWRITER (UNCHANGED) */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          ref={scrollContainerRef}
          style={{ flex: 1, overflowY: "auto", padding: "10px" }}
        >
          <canvas
            ref={canvasRef}
            style={{
              width: "98%",
              height: "auto",
              display: "block",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          />
        </div>

        <div style={{ height: "300px" }}>
          <TypewriterScene
            mode={mode}
            email={email}
            password={pwd}
            language={language}
            state={state}
            texture={texture}
          />
        </div>
      </div>
    </div>
  );
}
