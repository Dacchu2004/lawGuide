// frontend/src/App.tsx
import { useState, useRef, useEffect } from "react";
import TypewriterScene from "./components/TypewriterScene";
import { usePaperForm } from "./hooks/usePaperForm";
import useSound from "use-sound";

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

  const handleKeyDown = () => playClick();

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

  // ✅ This is the ONLY PLACE we call usePaperForm
  const { canvasRef, texture } = usePaperForm({
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
      {/* LEFT SIDE FORM */}
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

        {/* EMAIL */}
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

        {/* PASSWORD */}
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
            {/* USERNAME */}
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

            {/* LANGUAGE */}
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

            {/* STATE */}
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

            {/* TERMS */}
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
                marginBottom: "10px",
              }}
            >
              View Terms & Conditions
            </button>

            <div style={{ display: "flex", alignItems: "start" }}>
              <input
                type="checkbox"
                checked={termsAccepted}
                disabled={!termsViewed}
                onChange={(e) => {
                  setTermsAccepted(e.target.checked);
                  handleKeyDown();
                }}
                style={{ marginTop: "5px", marginRight: "10px" }}
              />
              <label
                style={{
                  fontSize: "0.9rem",
                  color: termsViewed ? "#CBD5E1" : "#64748B",
                }}
              >
                I have read the terms and agree.
              </label>
            </div>
          </>
        )}

        {/* SUBMIT BUTTON */}
        <button
          style={{
            width: "100%",
            padding: "12px",
            background: "#3B82F6",
            color: "white",
            borderRadius: "8px",
            border: "none",
            fontWeight: "bold",
            marginTop: "20px",
          }}
        >
          {mode === "login" ? "Login" : "Signup"}
        </button>

        {/* SWITCH MODE */}
        <p
          style={{ marginTop: "20px", cursor: "pointer", textAlign: "center" }}
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login"
            ? "Don't have an account? Signup"
            : "Already have an account? Login"}
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top canvas (flat paper) */}
        <div
          ref={scrollContainerRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "10px",
          }}
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

        {/* Bottom Typewriter */}
        <div style={{ height: "300px" }}>
          <TypewriterScene
            mode={mode}
            email={email}
            password={pwd}
            language={language}
            state={state}
            texture={texture} // ✅ passed properly
          />
        </div>
      </div>
    </div>
  );
}
