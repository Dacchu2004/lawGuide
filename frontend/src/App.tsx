import { useState, useRef, useEffect } from "react";
import TypewriterScene from "./components/TypewriterScene";
import { usePaperForm } from "./hooks/usePaperForm";
import useSound from "use-sound";
// File is in public/assets/key-click.wav
const clickSfx = "/assets/key-click.wav";

export default function App() {
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

  const handleKeyDown = () => {
    playClick();
  };

  // Update scroll target when mode changes
  useEffect(() => {
    setScrollTarget(mode === "login" ? "login" : "signup");
  }, [mode]);

  // Auto-scroll logic
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;

      // Small delay to ensure layout is calculated
      setTimeout(() => {
        if (scrollTarget === "login") {
          container.scrollTo({ top: 30, behavior: "smooth" });
        } else if (scrollTarget === "signup") {
          // Target the "User Signup" section (approx 40% down)
          const signupScrollPos = container.scrollHeight * 0.4;
          container.scrollTo({ top: signupScrollPos, behavior: "smooth" });
        } else if (scrollTarget === "terms") {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, [scrollTarget]);

  // Use the hook to drive the background canvas
  const { canvasRef } = usePaperForm({
    mode,
    email,
    password: pwd,
    language,
    state,
    username,
    termsAccepted,
  });

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* LEFT FORM */}
      <div
        style={{
          width: "40%",
          padding: "40px",
          background: "#0F172A",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px", fontSize: "1.8rem" }}>
          {mode === "login" ? "Login" : "Signup"}
        </h2>

        <input
          type="text"
          placeholder="Email"
          value={email}
          onFocus={() => mode === "signup" && setScrollTarget("signup")}
          onChange={(e) => {
            setEmail(e.target.value);
            handleKeyDown();
          }}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #475569",
            background: "#1E293B",
            color: "white",
          }}
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
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #475569",
            background: "#1E293B",
            color: "white",
          }}
        />

        {mode === "signup" && (
          <>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onFocus={() => setScrollTarget("signup")}
              onChange={(e) => {
                setUsername(e.target.value);
                handleKeyDown();
              }}
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "20px",
                borderRadius: "8px",
                border: "1px solid #475569",
                background: "#1E293B",
                color: "white",
              }}
            />

            <input
              type="text"
              placeholder="Preferred Language"
              value={language}
              onFocus={() => setScrollTarget("signup")}
              onChange={(e) => {
                setLanguage(e.target.value);
                handleKeyDown();
              }}
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "20px",
                borderRadius: "8px",
                border: "1px solid #475569",
                background: "#1E293B",
                color: "white",
              }}
            />
            <input
              type="text"
              placeholder="State / Union Territory"
              value={state}
              onFocus={() => setScrollTarget("signup")}
              onChange={(e) => {
                setState(e.target.value);
                handleKeyDown();
              }}
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "20px",
                borderRadius: "8px",
                border: "1px solid #475569",
                background: "#1E293B",
                color: "white",
              }}
            />

            <div style={{ marginBottom: "10px" }}>
              <button
                onClick={() => {
                  setTermsViewed(true);
                  setScrollTarget("terms");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#3B82F6",
                  textDecoration: "underline",
                  cursor: "pointer",
                  padding: 0,
                  fontSize: "0.9rem",
                  marginBottom: "10px",
                }}
              >
                View Terms & Conditions
              </button>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "start",
                marginBottom: "20px",
              }}
            >
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                disabled={!termsViewed}
                onChange={(e) => {
                  setTermsAccepted(e.target.checked);
                  setScrollTarget("terms");
                  handleKeyDown();
                }}
                style={{
                  marginTop: "5px",
                  marginRight: "10px",
                  cursor: termsViewed ? "pointer" : "not-allowed",
                }}
              />
              <label
                htmlFor="terms"
                style={{
                  fontSize: "0.9rem",
                  color: termsViewed ? "#CBD5E1" : "#64748B",
                }}
              >
                I have read the terms and conditions carefully and agree to
                that.
              </label>
            </div>
          </>
        )}

        <button
          style={{
            width: "100%",
            padding: "12px",
            background: "#3B82F6",
            color: "white",
            borderRadius: "8px",
            border: "none",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          {mode === "login" ? "Login" : "Signup"}
        </button>

        <p
          style={{
            textAlign: "center",
            color: "#94A3B8",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login"
            ? "Don't have an account? Signup"
            : "Already have an account? Login"}
        </p>
      </div>

      {/* RIGHT SIDE: Paper Form (Top) + Typewriter (Bottom) */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "white",
        }}
      >
        {/* TOP: Paper Form Display */}
        <div
          ref={scrollContainerRef}
          style={{
            flex: 1,
            display: "block", // Changed from flex to block
            position: "relative",
            overflowY: "auto", // Enable vertical scrolling
            padding: "10px",
            scrollBehavior: "smooth",
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              display: "block",
              width: "98%", // Full width, no horizontal scroll
              height: "auto", // Auto height to maintain aspect ratio
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
        </div>

        {/* BOTTOM: Typewriter Footer */}
        <div style={{ height: "300px", width: "100%", background: "white" }}>
          <TypewriterScene
            mode={mode}
            email={email}
            password={pwd}
            language={language}
            state={state}
          />
        </div>
      </div>
    </div>
  );
}
