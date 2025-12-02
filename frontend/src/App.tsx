import { useState } from "react";
import TypewriterScene from "./components/TypewriterScene";

export default function App() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const previewText = `
Email: ${email}
Password: ${"*".repeat(pwd.length)}
`;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* LEFT FORM */}
      <div style={{ width: "40%", padding: "40px", background: "#0F172A", color: "white" }}>
        <h2 style={{ marginBottom: "20px", fontSize: "1.8rem" }}>Login</h2>

        <input
          type="text"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #475569",
            background: "#1E293B",
            color: "white"
          }}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPwd(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #475569",
            background: "#1E293B",
            color: "white"
          }}
        />

        <button
          style={{
            width: "100%",
            padding: "12px",
            background: "#3B82F6",
            color: "white",
            borderRadius: "8px",
            border: "none",
            fontWeight: "bold"
          }}
        >
          Login
        </button>
      </div>

      {/* RIGHT TYPEWRITER */}
      <div style={{ flex: 1 }}>
        <TypewriterScene typedText={previewText} />
      </div>
    </div>
  );
}
