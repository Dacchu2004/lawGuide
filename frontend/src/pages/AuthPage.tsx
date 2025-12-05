// import { useState, useRef, useEffect } from "react";
// import TypewriterScene from "../components/TypewriterScene";
// import { usePaperForm } from "../hooks/usePaperForm";
// import useSound from "use-sound";
// import { loginRequest, signupRequest } from "../api/auth";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const clickSfx = "/assets/key-click.wav";

// export default function AuthPage() {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const [mode, setMode] = useState<"login" | "signup">("login");
//   const [email, setEmail] = useState("");
//   const [pwd, setPwd] = useState("");
//   const [language, setLanguage] = useState("");
//   const [state, setState] = useState("");
//   const [username, setUsername] = useState("");

//   const [termsAccepted, setTermsAccepted] = useState(false);
//   const [termsViewed, setTermsViewed] = useState(false);

//   const [scrollTarget, setScrollTarget] = useState<
//     "login" | "signup" | "terms"
//   >("login");

//   const scrollContainerRef = useRef<HTMLDivElement>(null);
//   const [playClick] = useSound(clickSfx, { volume: 0.6 });

//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);
//   const [successMsg, setSuccessMsg] = useState<string | null>(null);

//   const handleKeyDown = () => {
//     playClick();
//     setErrorMsg(null);
//   };

//   useEffect(() => {
//     setScrollTarget(mode === "login" ? "login" : "signup");
//   }, [mode]);

//   useEffect(() => {
//     if (!scrollContainerRef.current) return;
//     const container = scrollContainerRef.current;

//     setTimeout(() => {
//       if (scrollTarget === "login") {
//         container.scrollTo({ top: 30, behavior: "smooth" });
//       } else if (scrollTarget === "signup") {
//         const signupPos = container.scrollHeight * 0.4;
//         container.scrollTo({ top: signupPos, behavior: "smooth" });
//       } else if (scrollTarget === "terms") {
//         container.scrollTo({
//           top: container.scrollHeight,
//           behavior: "smooth",
//         });
//       }
//     }, 80);
//   }, [scrollTarget]);

//   const { canvasRef, texture } = usePaperForm({
//     mode,
//     email,
//     password: pwd,
//     language,
//     state,
//     username,
//     termsAccepted,
//   });

//   const handleSubmit = async () => {
//     setErrorMsg(null);
//     setSuccessMsg(null);

//     if (!email || !pwd) {
//       setErrorMsg("Email and password are required.");
//       return;
//     }

//     if (mode === "signup") {
//       if (!state || !language) {
//         setErrorMsg("State and language are required for signup.");
//         return;
//       }
//       if (!termsAccepted) {
//         setErrorMsg("Please accept the terms & conditions to signup.");
//         return;
//       }
//     }

//     try {
//       setLoading(true);

//       if (mode === "login") {
//         const data = await loginRequest({ email, password: pwd });
//         login(data.user, data.token);
//         setSuccessMsg("Login successful!");
//         navigate("/home");
//       } else {
//         await signupRequest({
//           email,
//           password: pwd,
//           state,
//           language,
//           username: username || undefined,
//         });

//         setSuccessMsg("Signup successful! You can now login.");
//         setMode("login");
//       }
//     } catch (err: any) {
//       const msg =
//         err?.response?.data?.message ||
//         err?.message ||
//         "Something went wrong. Please try again.";

//       setErrorMsg(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const switchMode = () => {
//     setMode((prev) => (prev === "login" ? "signup" : "login"));
//     setErrorMsg(null);
//     setSuccessMsg(null);
//   };

//   return (
//     <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
//       {/* ✅ LEFT SIDE FORM — TAILWIND MATCHING VISILY DESIGN */}
//       <div className="w-[40%] min-w-[360px] bg-white flex items-center justify-center relative overflow-hidden">
//         <div className="w-[448px] h-[820px] bg-white rounded-[224px] shadow-sm flex flex-col px-10 py-14 relative">

//           <h2 className="text-[30px] font-bold text-[#171A1F] mb-2">
//             {mode === "login"
//               ? "Welcome back to LawGuide India"
//               : "Create your LawGuide account"}
//           </h2>

//           <p className="text-[14px] text-[#323743] mb-8">
//             {mode === "login"
//               ? "Sign in to access your legal resources and tools."
//               : "Save laws, get alerts, and ask questions"}
//           </p>

//           <input
//             type="text"
//             placeholder={mode === "login" ? "Email or Mobile" : "Email"}
//             value={email}
//             onFocus={() => mode === "signup" && setScrollTarget("signup")}
//             onChange={(e) => {
//               setEmail(e.target.value);
//               handleKeyDown();
//             }}
//             className="w-full h-[40px] border border-[#DEE1E6] rounded-md px-4 text-sm mb-4"
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             value={pwd}
//             onFocus={() => mode === "signup" && setScrollTarget("signup")}
//             onChange={(e) => {
//               setPwd(e.target.value);
//               handleKeyDown();
//             }}
//             className="w-full h-[40px] border border-[#DEE1E6] rounded-md px-4 text-sm mb-4"
//           />

//           {mode === "signup" && (
//             <>
//               <input
//                 type="text"
//                 placeholder="Full Name"
//                 value={username}
//                 onChange={(e) => {
//                   setUsername(e.target.value);
//                   handleKeyDown();
//                 }}
//                 className="w-full h-[40px] border border-[#DEE1E6] rounded-md px-4 text-sm mb-4"
//               />

//               <select
//                 value={language}
//                 onChange={(e) => {
//                   setLanguage(e.target.value);
//                   handleKeyDown();
//                 }}
//                 className="w-full h-[40px] border border-[#DEE1E6] rounded-md px-3 text-sm mb-4"
//               >
//                 <option value="">Select Language</option>
//                 <option>English</option>
//                 <option>Hindi</option>
//                 <option>Tamil</option>
//               </select>

//               <select
//                 value={state}
//                 onChange={(e) => {
//                   setState(e.target.value);
//                   handleKeyDown();
//                 }}
//                 className="w-full h-[40px] border border-[#DEE1E6] rounded-md px-3 text-sm mb-4"
//               >
//                 <option value="">Select State</option>
//                 <option>Maharashtra</option>
//                 <option>Karnataka</option>
//               </select>

//               <button
//                 onClick={() => {
//                   setTermsViewed(true);
//                   setScrollTarget("terms");
//                 }}
//                 className="text-[#2F8EFF] text-sm mb-2 text-left"
//               >
//                 View Terms & Conditions
//               </button>

//               <div className="flex items-center gap-2 mb-4">
//                 <input
//                   type="checkbox"
//                   checked={termsAccepted}
//                   disabled={!termsViewed}
//                   onChange={(e) => {
//                     setTermsAccepted(e.target.checked);
//                     handleKeyDown();
//                   }}
//                 />
//                 <label className="text-sm text-[#171A1F]">
//                   Agree to Terms & Privacy Policy
//                 </label>
//               </div>
//             </>
//           )}

//           {errorMsg && <p className="text-red-500 text-sm mb-2">{errorMsg}</p>}
//           {successMsg && <p className="text-green-500 text-sm mb-2">{successMsg}</p>}

//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="w-full h-[48px] rounded-md text-white text-[16px] font-medium bg-gradient-to-r from-blue-600 to-blue-400 mt-2"
//           >
//             {loading
//               ? mode === "login"
//                 ? "Logging in..."
//                 : "Signing up..."
//               : mode === "login"
//               ? "Sign in"
//               : "Create Account"}
//           </button>

//           <p
//             onClick={switchMode}
//             className="text-center text-sm text-[#2F8EFF] mt-4 cursor-pointer"
//           >
//             {mode === "login"
//               ? "Don't have an account? Sign up"
//               : "Already have an account? Sign in"}
//           </p>
//         </div>
//       </div>

//       {/* ✅ RIGHT SIDE — PAPER + TYPEWRITER (UNCHANGED) */}
//       <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         <div
//           ref={scrollContainerRef}
//           style={{ flex: 1, overflowY: "auto", padding: "10px" }}
//         >
//           <canvas
//             ref={canvasRef}
//             style={{
//               width: "98%",
//               height: "auto",
//               display: "block",
//               boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//             }}
//           />
//         </div>

//         <div style={{ height: "300px" }}>
//           <TypewriterScene
//             mode={mode}
//             email={email}
//             password={pwd}
//             language={language}
//             state={state}
//             texture={texture}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

//New Design
import { useState } from "react";
import { 
  Eye, 
  EyeOff, 
  ChevronDown, 
  User, 
  Mail, 
  Lock 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useSound from "use-sound";
import { useAuth } from "../context/AuthContext";
import { loginRequest, signupRequest } from "../api/auth";

const clickSfx = "/assets/key-click.wav";

export default function AuthPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [playClick] = useSound(clickSfx, { volume: 0.6 });

  // State for Sliding Animation (true = showing Sign Up)
  const [isSignUp, setIsSignUp] = useState(false);

  // Form States
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState("English");
  const [state, setState] = useState("Maharashtra");
  
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Logic State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleKeyDown = () => {
    playClick();
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Basic Validation
    if (!email || !pwd) {
      setErrorMsg("Email and password are required.");
      return;
    }

    if (isSignUp && !termsAccepted) {
      setErrorMsg("Please accept the terms & conditions.");
      return;
    }

    try {
      setLoading(true);
      if (!isSignUp) {
        // LOGIN LOGIC
        const data = await loginRequest({ email, password: pwd });
        login(data.user, data.token);
        setSuccessMsg("Login successful!");
        navigate("/home");
      } else {
        // SIGNUP LOGIC
        await signupRequest({
          email,
          password: pwd,
          state,
          language,
          username: username || undefined,
        });
        setSuccessMsg("Signup successful! Please log in.");
        // Slide back to login after success
        setTimeout(() => setIsSignUp(false), 1500);
      }
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // --- Visily Styles in Tailwind ---
  const inputClass = "w-full h-[40px] px-3 pl-10 border border-[#DEE1E6] rounded-[6px] text-[14px] font-open-sans text-[#171A1F] placeholder-gray-400 focus:outline-none focus:border-[#2F8EFF] focus:ring-1 focus:ring-[#2F8EFF] bg-white transition-colors shadow-sm";
  const selectClass = "w-full h-[40px] px-3 border border-[#DEE1E6] rounded-[6px] text-[14px] font-open-sans text-[#171A1F] bg-white appearance-none cursor-pointer focus:outline-none focus:border-[#2F8EFF]";

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8F9FA] font-sans overflow-hidden py-4">
      
      {/* === MAIN CONTAINER (Reduced Height to 700px) === */}
      <div 
        className={`relative w-full max-w-[1000px] h-[700px] bg-white rounded-[30px] shadow-[0_5px_15px_rgba(0,0,0,0.35)] overflow-hidden ${isSignUp ? "active" : ""}`}
        id="container"
      >
        
        {/* ================= SIGN UP FORM CONTAINER (Left, moves to Right) ================= */}
        <div className={`absolute top-0 h-full transition-all duration-700 ease-in-out left-0 w-1/2 ${isSignUp ? "translate-x-[100%] opacity-100 z-50" : "opacity-0 z-10"}`}>
          <form onSubmit={handleSubmit} className="bg-white flex flex-col items-center justify-start h-full px-10 py-6 text-center relative overflow-hidden">
            
            <h1 className="font-roboto font-bold text-[28px] leading-tight text-[#171A1F] mb-1 mt-2">
              Create Account
            </h1>
            <p className="font-open-sans text-[13px] text-[#323743] mb-4">
              Join LawGuide India today
            </p>

            <div className="w-full max-w-[380px] space-y-3 relative z-10">
              {/* Full Name */}
              <div className="relative">
                <div className="absolute left-3 top-3 pointer-events-none">
                  <User className="text-[#323743] w-4 h-4" />
                </div>
                <input type="text" placeholder="Full Name" value={username} onChange={(e) => { setUsername(e.target.value); handleKeyDown(); }} className={inputClass} />
              </div>

              {/* Email */}
              <div className="relative">
                <div className="absolute left-3 top-3 pointer-events-none">
                  <Mail className="text-[#323743] w-4 h-4" />
                </div>
                <input type="email" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value); handleKeyDown(); }} className={inputClass} />
              </div>

              {/* Password */}
              <div className="relative">
                <div className="absolute left-3 top-3 pointer-events-none">
                  <Lock className="text-[#323743] w-4 h-4" />
                </div>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-[#323743] hover:text-blue-600 z-10">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <input type={showPassword ? "text" : "password"} placeholder="Password" value={pwd} onChange={(e) => { setPwd(e.target.value); handleKeyDown(); }} className={inputClass} />
              </div>

              {/* Dropdowns */}
              <div className="flex gap-3">
                <div className="relative w-1/2">
                  <select value={language} onChange={(e) => { setLanguage(e.target.value); handleKeyDown(); }} className={selectClass}>
                    <option>English</option><option>Hindi</option><option>Marathi</option><option>Kannada</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-[#171A1F] pointer-events-none" />
                </div>

                <div className="relative w-1/2">
                  <select value={state} onChange={(e) => { setState(e.target.value); handleKeyDown(); }} className={selectClass}>
                    <option>Maharashtra</option><option>Delhi</option><option>Karnataka</option><option>Tamil Nadu</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-[#171A1F] pointer-events-none" />
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 mt-1 text-left">
                <input type="checkbox" checked={termsAccepted} onChange={(e) => { setTermsAccepted(e.target.checked); handleKeyDown(); }} className="mt-1 w-3.5 h-3.5 rounded-[2px] border-[#DEE1E6] text-[#2E8CFF] focus:ring-[#2E8CFF]" />
                <span className="text-[11px] text-[#323743] font-open-sans leading-tight">
                  I agree to the Terms & Conditions & Privacy Policy
                </span>
              </div>

              {/* Gradient Button */}
              <button disabled={loading} className="w-full h-[44px] mt-2 bg-gradient-to-r from-[#2563EB] to-[#60A5FA] hover:opacity-90 text-white rounded-[6px] font-medium text-[15px] shadow-sm transition-all">
                {loading ? "Creating..." : "Sign Up"}
              </button>
            </div>

            {/* ILLUSTRATION: Court Building (Scaled for 700px height) */}
            <div className="absolute bottom-0 left-0 w-full flex justify-center z-0">
               <img src="/assets/auth-illustration-signup.png" alt="Court Illustration" className="w-full h-auto object-cover opacity-90 max-h-[220px]" />
            </div>
          </form>
        </div>

        {/* ================= SIGN IN FORM CONTAINER (Left, Default Visible) ================= */}
        <div className={`absolute top-0 h-full transition-all duration-700 ease-in-out left-0 w-1/2 z-20 ${isSignUp ? "translate-x-[100%]" : ""}`}>
          <form onSubmit={handleSubmit} className="bg-white flex flex-col items-center justify-start h-full px-10 py-8 text-center relative overflow-hidden">
            
            <h1 className="font-roboto font-bold text-[30px] leading-[36px] text-[#171A1F] mb-2 mt-10">
              Welcome back!
            </h1>
            <p className="font-open-sans text-[14px] text-[#323743] mb-6">
              Sign in to access your legal tools
            </p>

            {errorMsg && <div className="w-full max-w-[380px] mb-4 p-2 bg-red-50 text-red-500 text-xs rounded border border-red-100">{errorMsg}</div>}
            {successMsg && <div className="w-full max-w-[380px] mb-4 p-2 bg-green-50 text-green-600 text-xs rounded border border-green-100">{successMsg}</div>}

            <div className="w-full max-w-[380px] space-y-5 relative z-10">
              <div className="relative">
                <div className="absolute left-3 top-3 pointer-events-none">
                  <Mail className="text-[#323743] w-4 h-4" />
                </div>
                <input type="text" placeholder="Email or Mobile" value={email} onChange={(e) => { setEmail(e.target.value); handleKeyDown(); }} className={inputClass} />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-3 pointer-events-none">
                  <Lock className="text-[#323743] w-4 h-4" />
                </div>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-[#323743] hover:text-blue-600 z-10">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <input type={showPassword ? "text" : "password"} placeholder="Password" value={pwd} onChange={(e) => { setPwd(e.target.value); handleKeyDown(); }} className={inputClass} />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded-[2px] border-[#DEE1E6] text-[#2E8CFF]" />
                  <span className="font-open-sans font-medium text-[13px] text-[#171A1F]">Remember me</span>
                </label>
                <button type="button" className="text-[#2F8EFF] hover:underline font-open-sans font-medium text-[13px]">
                  Forgot password?
                </button>
              </div>

              <button disabled={loading} className="w-full h-[44px] bg-[#2F8EFF] hover:opacity-90 text-white rounded-[6px] font-medium text-[15px] transition-all shadow-sm">
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>

            {/* ILLUSTRATION: Lady Justice (Scaled for 700px height) */}
            <div className="absolute bottom-0 left-0 w-full flex justify-center z-0">
               <img src="/assets/auth-illustration-login.png" alt="Legal Illustration" className="w-[80%] max-w-[320px] object-contain opacity-100" />
            </div>
          </form>
        </div>

        {/* ================= OVERLAY CONTAINER (Slides Left/Right) ================= */}
        <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-700 ease-in-out z-100 rounded-l-[100px] ${isSignUp ? "-translate-x-full rounded-l-none rounded-r-[100px]" : ""}`}>
          <div className={`bg-gradient-to-br from-[#125D95] to-[#2F8EFF] text-white relative -left-full h-full w-[200%] transform transition-all duration-700 ease-in-out ${isSignUp ? "translate-x-1/2" : "translate-x-0"}`}>
            
            {/* Overlay Left Panel (Visible when showing Sign In option on Signup Page) */}
            <div className={`absolute top-0 flex flex-col items-center justify-center h-full w-1/2 px-10 text-center transform transition-all duration-700 ease-in-out ${isSignUp ? "translate-x-0" : "-translate-x-[20%]"}`}>
              <h1 className="font-roboto font-bold text-[36px] mb-4">Welcome Back!</h1>
              <p className="font-open-sans text-[14px] mb-8 leading-6">
                To keep connected with us please login with your personal info
              </p>
              <button 
                onClick={() => setIsSignUp(false)}
                className="bg-transparent border border-white text-white py-2 px-10 rounded-[6px] font-bold uppercase text-xs tracking-wider hover:bg-white hover:text-[#125D95] transition-colors"
              >
                Sign In
              </button>
            </div>

            {/* Overlay Right Panel (Visible when showing Sign Up option on Login Page) */}
            <div className={`absolute top-0 right-0 flex flex-col items-center justify-center h-full w-1/2 px-10 text-center transform transition-all duration-700 ease-in-out ${isSignUp ? "translate-x-[20%]" : "translate-x-0"}`}>
              <h1 className="font-roboto font-bold text-[36px] mb-4">New Here?</h1>
              <p className="font-open-sans text-[14px] mb-8 leading-6">
                Enter your personal details and start your legal journey with LawGuide
              </p>
              <button 
                onClick={() => setIsSignUp(true)}
                className="bg-transparent border border-white text-white py-2 px-10 rounded-[6px] font-bold uppercase text-xs tracking-wider hover:bg-white hover:text-[#125D95] transition-colors"
              >
                Sign Up
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}