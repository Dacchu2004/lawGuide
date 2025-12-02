import { useState } from "react";
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

  const [playClick] = useSound(clickSfx, { volume: 0.6 });

  const handleKeyDown = () => {
    playClick();
  };

  // Use the hook to drive the background canvas
  const { canvasRef } = usePaperForm({
    mode,
    email,
    password: pwd,
    language,
    state,
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
              placeholder="Preferred Language"
              value={language}
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
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            padding: "10px",
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              maxHeight: "590px",
              maxWidth: "1000px",
              objectFit: "contain",
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
