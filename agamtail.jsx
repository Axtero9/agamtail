import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import { ArrowUpRight, Play, Zap, Leaf, BarChart3, Shield, X, ChevronRight } from "lucide-react";

// ── LIQUID GLASS STYLES ──────────────────────────────────────────────────────
const glassStyle = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.1)",
};
const glassStrongStyle = {
  background: "rgba(255,255,255,0.07)",
  backdropFilter: "blur(40px)",
  WebkitBackdropFilter: "blur(40px)",
  border: "1px solid rgba(255,255,255,0.15)",
  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.15), 4px 4px 4px rgba(0,0,0,0.05)",
};

// ── BLUR TEXT REVEAL ─────────────────────────────────────────────────────────
function BlurText({ text, className }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: "blur(10px)", opacity: 0, y: 30 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "inline-block", marginRight: "0.28em" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// ── HLS VIDEO ────────────────────────────────────────────────────────────────
function HLSVideo({ src, className, style, poster }) {
  const ref = useRef(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    } else {
      import("https://cdn.jsdelivr.net/npm/hls.js@1.5.7/dist/hls.min.js").then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(src);
          hls.attachMedia(video);
          return () => hls.destroy();
        }
      }).catch(() => { });
    }
  }, [src]);
  return (
    <video
      ref={ref}
      autoPlay
      loop
      muted
      playsInline
      poster={poster}
      className={className}
      style={style}
    />
  );
}

// ── GIMMICK D: SKIN QUIZ WIDGET ──────────────────────────────────────────────
const rituals = {
  "Dry-Aging": { name: "Dewdrop Ritual", products: ["Hyaluronic Surge Serum", "Ceramide Barrier Cream", "Retinol Night Oil"] },
  "Dry-Dullness": { name: "Radiance Revival", products: ["Vitamin C Brightening Serum", "Squalane Face Oil", "Peptide Glow Cream"] },
  "Dry-Acne": { name: "Calm & Clear Protocol", products: ["Niacinamide Balance Serum", "AHA/BHA Gentle Exfoliant", "Ceramide Repair Gel"] },
  "Dry-Pigmentation": { name: "Even Skin Ritual", products: ["Bakuchiol Brightener", "Vitamin C+E Complex", "Ceramide Night Mask"] },
  "Oily-Aging": { name: "Age-Control Matte Ritual", products: ["Retinol Renewal Serum", "Peptide Firming Essence", "Oil-Free Barrier Gel"] },
  "Oily-Acne": { name: "Clear Skin Protocol", products: ["Niacinamide + Zinc Serum", "AHA/BHA Daily Peel", "Lightweight Hydra-Gel"] },
  "Oily-Dullness": { name: "Luminance Ritual", products: ["Vitamin C Glow Drops", "BHA Refining Toner", "Matte Radiance Moisturiser"] },
  "Oily-Pigmentation": { name: "Clarity Protocol", products: ["Azelaic Acid Serum", "Niacinamide Dark Spot Corrector", "Oil-Control SPF Fluid"] },
  "Combination-Aging": { name: "Balance & Renew Ritual", products: ["Retinol Lift Serum", "Ceramide Zone Cream", "Hyaluronic Night Plump"] },
  "Combination-Acne": { name: "Zone Defence Protocol", products: ["Niacinamide Mattifier", "Salicylic Clarifying Drops", "Adaptive Hydration Gel"] },
  "Combination-Dullness": { name: "Glow Equilibrium", products: ["Vitamin C Essence", "Bakuchiol Balancer", "Light Radiance Fluid"] },
  "Combination-Pigmentation": { name: "Tone Harmony Ritual", products: ["AHA Brightening Serum", "Vitamin C Spot Fader", "Peptide Equalising Cream"] },
  "Sensitive-Aging": { name: "Gentle Renewal Ritual", products: ["Bakuchiol (Retinol Alt.) Serum", "Collagen Peptide Cream", "Squalane Barrier Oil"] },
  "Sensitive-Acne": { name: "Calm Clear Protocol", products: ["Centella Soothing Serum", "Niacinamide Sensitive Gel", "Ceramide Calming Cream"] },
  "Sensitive-Dullness": { name: "Soothe & Glow Ritual", products: ["Vitamin C Gentle Drops", "Peptide Brightening Serum", "Hyaluronic Comfort Cream"] },
  "Sensitive-Pigmentation": { name: "Gentle Even Ritual", products: ["Tranexamic Acid Serum", "Bakuchiol Brightener", "Ceramide Barrier Mask"] },
};

function QuizWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [skinType, setSkinType] = useState(null);
  const [concern, setConcern] = useState(null);

  const ritual = skinType && concern ? rituals[`${skinType}-${concern}`] || rituals["Combination-Dullness"] : null;

  const reset = () => { setStep(0); setSkinType(null); setConcern(null); };

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}>
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.button
            key="pill"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setOpen(true)}
            style={{
              ...glassStrongStyle,
              borderRadius: 9999,
              padding: "12px 20px",
              color: "#fff",
              fontSize: 13,
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              letterSpacing: "0.01em",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: 14 }}>✦</span> Find Your Ritual
          </motion.button>
        ) : (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              ...glassStrongStyle,
              borderRadius: 20,
              width: 340,
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#fff", fontSize: 17 }}>
                {step === 2 ? "Your Ritual" : "Skin Profiler"}
              </span>
              <button onClick={() => { setOpen(false); reset(); }} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", display: "flex" }}>
                <X size={16} />
              </button>
            </div>

            {/* Steps */}
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="s0" initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -60, opacity: 0 }} transition={{ duration: 0.3 }} style={{ padding: 20 }}>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, fontFamily: "'Barlow', sans-serif", fontWeight: 300, marginBottom: 14 }}>What's your skin type?</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {["Dry", "Oily", "Combination", "Sensitive"].map(t => (
                      <button key={t} onClick={() => { setSkinType(t); setStep(1); }}
                        style={{ ...glassStyle, borderRadius: 12, padding: "12px 8px", color: "#fff", fontSize: 13, fontFamily: "'Barlow', sans-serif", fontWeight: 400, cursor: "pointer", transition: "all 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                      >{t}</button>
                    ))}
                  </div>
                </motion.div>
              )}
              {step === 1 && (
                <motion.div key="s1" initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -60, opacity: 0 }} transition={{ duration: 0.3 }} style={{ padding: 20 }}>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, fontFamily: "'Barlow', sans-serif", fontWeight: 300, marginBottom: 14 }}>Your primary concern?</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {["Acne", "Aging", "Dullness", "Pigmentation"].map(c => (
                      <button key={c} onClick={() => { setConcern(c); setStep(2); }}
                        style={{ ...glassStyle, borderRadius: 12, padding: "12px 8px", color: "#fff", fontSize: 13, fontFamily: "'Barlow', sans-serif", fontWeight: 400, cursor: "pointer", transition: "all 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                      >{c}</button>
                    ))}
                  </div>
                  <button onClick={() => setStep(0)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", fontSize: 12, fontFamily: "'Barlow', sans-serif", marginTop: 12, padding: 0 }}>← Back</button>
                </motion.div>
              )}
              {step === 2 && ritual && (
                <motion.div key="s2" initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -60, opacity: 0 }} transition={{ duration: 0.3 }} style={{ padding: 20 }}>
                  <div style={{ ...glassStyle, borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
                    <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, fontFamily: "'Barlow', sans-serif", fontWeight: 300, marginBottom: 4 }}>
                      {skinType} · {concern}
                    </p>
                    <p style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#fff", fontSize: 16, marginBottom: 12 }}>{ritual.name}</p>
                    {ritual.products.map((p, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderTop: i === 0 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.4)", flexShrink: 0 }} />
                        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}>{p}</span>
                      </div>
                    ))}
                  </div>
                  <button style={{ ...glassStrongStyle, borderRadius: 9999, width: "100%", padding: "11px 0", color: "#fff", fontSize: 13, fontFamily: "'Barlow', sans-serif", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    Start Your Ritual <ArrowUpRight size={14} />
                  </button>
                  <button onClick={reset} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", fontSize: 12, fontFamily: "'Barlow', sans-serif", marginTop: 10, padding: 0, width: "100%", textAlign: "center" }}>
                    Retake quiz
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step dots */}
            {step < 2 && (
              <div style={{ padding: "0 20px 16px", display: "flex", gap: 5, justifyContent: "center" }}>
                {[0, 1].map(i => (
                  <span key={i} style={{ width: i === step ? 16 : 6, height: 6, borderRadius: 9999, background: i === step ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)", transition: "all 0.3s" }} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "fixed", top: 16, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      {/* Wordmark */}
      <div style={{ background: "#e8e8e0", borderRadius: 12, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#000", fontSize: 24, paddingRight: 2, paddingBottom: 2 }}>S</span>
      </div>

      {/* Nav pill */}
      <div style={{ ...glassStyle, borderRadius: 9999, padding: "10px 4px", display: "flex", gap: 2 }}>
        {["Home", "Services", "Work", "Process", "Pricing"].map(link => (
          <button key={link} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.8)", fontSize: 13, fontFamily: "'Barlow', sans-serif", fontWeight: 500, padding: "4px 14px", borderRadius: 9999, transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >{link}</button>
        ))}
      </div>

      {/* CTA */}
      <button style={{ background: "#fff", color: "#000", borderRadius: 9999, border: "none", padding: "10px 18px", fontSize: 13, fontFamily: "'Barlow', sans-serif", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
        Get Started <ArrowUpRight size={14} />
      </button>
    </motion.nav>
  );
}

// ── BOTANICAL SVG BACKGROUND ─────────────────────────────────────────────────
function BotanicalScene() {
  const dandelion = (cx, cy, r, spokes, opacity = 0.5) =>
    Array.from({ length: spokes }, (_, i) => {
      const a = (i / spokes) * Math.PI * 2;
      return (
        <g key={i}>
          <line x1={cx} y1={cy} x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r * 0.75} stroke="#c0c0a8" strokeWidth="0.65" opacity={opacity * 0.9} />
          <circle cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r * 0.75} r="2.2" fill="#d8d8c0" opacity={opacity} />
        </g>
      );
    });

  const daisy = (cx, cy, pr, petals, pcolor, ccolor, opacity = 0.7, squeeze = 0.55) =>
    Array.from({ length: petals }, (_, i) => {
      const a = (i / petals) * Math.PI * 2;
      return (
        <ellipse key={i}
          cx={cx + Math.cos(a) * pr} cy={cy + Math.sin(a) * pr * squeeze}
          rx={pr * 0.55} ry={pr * 0.28} fill={pcolor} opacity={opacity}
          transform={`rotate(${a * 180 / Math.PI}, ${cx + Math.cos(a) * pr}, ${cy + Math.sin(a) * pr * squeeze})`}
        />
      );
    }).concat(<circle key="c" cx={cx} cy={cy} r={pr * 0.35} fill={ccolor} opacity={opacity + 0.1} />);

  const umbellifera = (ox, oy, branches, color, opacity) =>
    branches.map(([dx, dy], i) => (
      <g key={i}>
        <line x1={ox + dx * 0.25} y1={oy} x2={ox + dx} y2={dy} stroke={color} strokeWidth="0.9" opacity={opacity * 0.8} />
        <circle cx={ox + dx} cy={dy} r="2.8" fill={color} opacity={opacity} />
        <circle cx={ox + dx} cy={dy} r="1.2" fill="#fff" opacity={opacity * 0.4} />
      </g>
    ));

  return (
    <svg
      viewBox="0 0 1440 1000"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1 }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="nebula" cx="52%" cy="55%" r="40%">
          <stop offset="0%" stopColor="#0e7a6a" stopOpacity="0.72" />
          <stop offset="20%" stopColor="#0a5e58" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#052e3a" stopOpacity="0.28" />
          <stop offset="80%" stopColor="#01101a" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="nebula2" cx="48%" cy="60%" r="28%">
          <stop offset="0%" stopColor="#1a9e7a" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glowAmber" cx="16%" cy="68%" r="28%">
          <stop offset="0%" stopColor="#7a3a0a" stopOpacity="0.6" />
          <stop offset="40%" stopColor="#4a2008" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glowAmber2" cx="22%" cy="80%" r="18%">
          <stop offset="0%" stopColor="#d46a10" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glowTealR" cx="84%" cy="62%" r="24%">
          <stop offset="0%" stopColor="#0a4a44" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glowGreenR" cx="78%" cy="75%" r="20%">
          <stop offset="0%" stopColor="#0a3020" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vignette" cx="50%" cy="48%" r="72%">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="75%" stopColor="#000" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.92" />
        </radialGradient>
        <radialGradient id="groundGlow" cx="50%" cy="100%" r="55%">
          <stop offset="0%" stopColor="#0a4030" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="1" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="1" />
        </linearGradient>
        <filter id="bigBlur"><feGaussianBlur stdDeviation="18" /></filter>
        <filter id="softBlur"><feGaussianBlur stdDeviation="4" /></filter>
        <filter id="microBlur"><feGaussianBlur stdDeviation="1" /></filter>
        <style>{`
          @keyframes sw1{0%,100%{transform:rotate(-1.8deg)}50%{transform:rotate(1.8deg) translateX(4px)}}
          @keyframes sw2{0%,100%{transform:rotate(1.2deg)}50%{transform:rotate(-2.2deg) translateX(-5px)}}
          @keyframes sw3{0%,100%{transform:rotate(-0.7deg)}50%{transform:rotate(1.4deg)}}
          @keyframes sw4{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(0.8deg) translateX(3px)}}
          @keyframes twinkle{0%,100%{opacity:0.2}50%{opacity:0.95}}
          @keyframes fu1{0%{transform:translate(0,0);opacity:0.85}100%{transform:translate(20px,-230px);opacity:0}}
          @keyframes fu2{0%{transform:translate(0,0);opacity:0.7}100%{transform:translate(-25px,-290px);opacity:0}}
          @keyframes fu3{0%{transform:translate(0,0);opacity:0.75}100%{transform:translate(14px,-200px);opacity:0}}
          @keyframes fu4{0%{transform:translate(0,0);opacity:0.6}100%{transform:translate(-10px,-320px);opacity:0}}
          @keyframes nebPulse{0%,100%{opacity:0.9}50%{opacity:1}}
          .sw1{transform-origin:50% 100%;animation:sw1 7s ease-in-out infinite}
          .sw2{transform-origin:50% 100%;animation:sw2 9s ease-in-out infinite}
          .sw3{transform-origin:50% 100%;animation:sw3 6s ease-in-out infinite}
          .sw4{transform-origin:50% 100%;animation:sw4 11s ease-in-out infinite}
          .sw1d{transform-origin:50% 100%;animation:sw1 8s ease-in-out infinite;animation-delay:-3s}
          .sw2d{transform-origin:50% 100%;animation:sw2 12s ease-in-out infinite;animation-delay:-5s}
          .sw3d{transform-origin:50% 100%;animation:sw3 10s ease-in-out infinite;animation-delay:-1.5s}
        `}</style>
      </defs>

      {/* ── BASE ── */}
      <rect width="1440" height="1000" fill="#000" />

      {/* ── ATMOSPHERE GLOWS ── */}
      <ellipse cx="720" cy="560" rx="600" ry="380" fill="url(#nebula)" style={{ animation: "nebPulse 8s ease-in-out infinite" }} />
      <ellipse cx="700" cy="590" rx="380" ry="240" fill="url(#nebula2)" />
      <ellipse cx="210" cy="700" rx="320" ry="240" fill="url(#glowAmber)" filter="url(#bigBlur)" />
      <ellipse cx="200" cy="800" rx="200" ry="140" fill="url(#glowAmber2)" filter="url(#bigBlur)" />
      <ellipse cx="1230" cy="640" rx="280" ry="200" fill="url(#glowTealR)" filter="url(#bigBlur)" />
      <ellipse cx="1170" cy="760" rx="220" ry="160" fill="url(#glowGreenR)" filter="url(#bigBlur)" />
      <ellipse cx="720" cy="1000" rx="820" ry="200" fill="url(#groundGlow)" />

      {/* ── STARS ── */}
      {[
        [88, 62, 1.6, 0], [210, 44, 1.2, 1.4], [360, 28, 2, 0.6], [480, 58, 0.9, 2], [620, 38, 1.5, 0.3],
        [750, 22, 1.8, 1], [860, 50, 1.1, 1.8], [980, 36, 2.2, 0.4], [1080, 58, 1.3, 2.2], [1200, 42, 1.6, 0.8],
        [1320, 28, 0.9, 1.6], [1400, 66, 1.4, 0.2], [320, 110, 1, 2.8], [550, 88, 1.3, 0.5], [780, 95, 1.7, 1.3],
        [1000, 80, 1.1, 2.4], [1150, 100, 1.5, 0.9], [1350, 92, 0.8, 1.2], [420, 175, 1.2, 0], [660, 160, 1.8, 1.7],
        [900, 148, 1, 2.1], [1100, 165, 1.4, 0.6], [1280, 172, 1.1, 3], [440, 250, 0.9, 1.9], [700, 240, 1.3, 0.8],
        [950, 260, 1.6, 1.5], [1200, 244, 1, 2.6], [390, 340, 1.1, 0.4], [750, 320, 1.4, 2], [1050, 330, 0.8, 0.7],
      ].map(([cx, cy, r, delay], i) => (
        <circle key={`s${i}`} cx={cx} cy={cy} r={r} fill="#fff"
          style={{ animation: `twinkle ${2.2 + (i % 4) * 0.7}s ease-in-out infinite`, animationDelay: `${delay}s` }} />
      ))}

      {/* ── LEFT CLUSTER — BACKGROUND LAYER (dim, far) ── */}
      <g opacity="0.45">
        <g className="sw3d">
          <line x1="14" y1="1000" x2="8" y2="340" stroke="#1e3818" strokeWidth="2" />
          {umbellifera(8, 340, [[-16, 325], [-4, 310], [10, 318], [-24, 332], [6, 302], [-12, 295]], "#2e5828", 0.5)}
        </g>
        <g className="sw2d">
          <line x1="62" y1="1000" x2="52" y2="460" stroke="#1a3015" strokeWidth="1.6" />
          <line x1="52" y1="600" x2="30" y2="520" stroke="#1a3015" strokeWidth="1.1" />
          {dandelion(52, 460, 14, 0.42)}
        </g>
      </g>

      {/* ── LEFT CLUSTER — MAIN LAYER ── */}

      {/* Far-left tall umbellifer */}
      <g className="sw2d">
        <line x1="95" y1="1000" x2="82" y2="310" stroke="#243820" strokeWidth="2.8" />
        <line x1="82" y1="310" x2="65" y2="185" stroke="#243820" strokeWidth="2" />
        <line x1="82" y1="480" x2="50" y2="390" stroke="#243820" strokeWidth="1.4" />
        {umbellifera(65, 185,
          [[-24, 168], [-8, 152], [12, 160], [-36, 178], [8, 144], [-16, 138], [20, 154], [-4, 132]],
          "#3a6a30", 0.65)}
        {umbellifera(50, 390,
          [[-14, 376], [-2, 365], [10, 372], [-20, 382]],
          "#2e5225", 0.5)}
      </g>

      {/* Big dandelion clock */}
      <g className="sw1">
        <line x1="172" y1="1000" x2="160" y2="330" stroke="#1e3018" strokeWidth="3.2" />
        <line x1="160" y1="550" x2="124" y2="460" stroke="#1e3018" strokeWidth="1.8" />
        <line x1="160" y1="500" x2="192" y2="420" stroke="#1e3018" strokeWidth="1.6" />
        {dandelion(160, 330, 26, 18, 0.58)}
        <circle cx={160} cy={330} r="5" fill="#adadA0" opacity="0.7" />
        {/* Glowing halo around dandelion */}
        <circle cx={160} cy={330} r="34" fill="#fff" opacity="0.03" />
        {dandelion(124, 460, 15, 12, 0.42)}
        {daisy(192, 420, 12, 6, "#4a7a2a", "#2a4a18", 0.5)}
        {/* Leaf shapes */}
        <path d="M160 650 Q130 610 118 565 Q145 598 160 635" fill="#1e3d15" opacity="0.55" />
        <path d="M160 580 Q185 545 196 500 Q175 530 160 560" fill="#1a3810" opacity="0.45" />
      </g>

      {/* Amber wildflower — the star of the left cluster */}
      <g className="sw3">
        <line x1="265" y1="1000" x2="258" y2="488" stroke="#203018" strokeWidth="2.6" />
        <line x1="258" y1="680" x2="228" y2="595" stroke="#203018" strokeWidth="1.6" />
        {daisy(258, 488, 22, 10, "#d08020", "#7a4010", 0.78)}
        {/* Ambient glow under amber flower */}
        <circle cx={258} cy={490} r="48" fill="#c06010" opacity="0.12" filter="url(#softBlur)" />
        {daisy(228, 595, 14, 8, "#b86c18", "#6a3a0e", 0.6)}
        <path d="M258 720 Q230 685 220 648 Q244 672 258 700" fill="#1e3d14" opacity="0.55" />
        <path d="M258 800 Q280 762 292 726 Q272 755 258 778" fill="#1a3810" opacity="0.45" />
      </g>

      {/* Fluffy seed cluster - short stem */}
      <g className="sw2">
        <line x1="345" y1="1000" x2="338" y2="580" stroke="#1a2c14" strokeWidth="2.2" />
        {dandelion(338, 580, 18, 14, 0.48)}
        <circle cx={338} cy={580} r="4" fill="#b0b098" opacity="0.65" />
        <line x1="338" y1="740" x2="312" y2="666" stroke="#1a2c14" strokeWidth="1.3" />
        {daisy(312, 666, 10, 6, "#6a9a38", "#3a5a20", 0.5)}
      </g>

      {/* Thin grass group left */}
      {[[385, 1000, 382, 490, 0.9], [400, 1000, 404, 520, 1.1], [418, 1000, 414, 500, 0.8], [432, 1000, 436, 478, 1.0]].map(([x1, y1, x2, y2, sw], i) => (
        <g key={`glg${i}`} className={["sw1", "sw3", "sw2", "sw1d"][i]}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1a2a0e" strokeWidth={sw} opacity="0.6" />
          {[-1, 0, 1].map(j => <ellipse key={j} cx={x2 + j * 3} cy={y2 - j * 9 - 6} rx="1.8" ry="6" fill="#253518" opacity="0.5" />)}
        </g>
      ))}

      {/* ── CENTER-LEFT ACCENT ── */}
      <g className="sw3d" opacity="0.55">
        <line x1="490" y1="1000" x2="485" y2="660" stroke="#1a2c14" strokeWidth="1.6" />
        {daisy(485, 660, 16, 8, "#b8b8b0", "#888880", 0.55)}
      </g>

      {/* ── RIGHT CLUSTER — BACKGROUND LAYER ── */}
      <g opacity="0.42">
        <g className="sw3d">
          <line x1="1430" y1="1000" x2="1436" y2="380" stroke="#1e3818" strokeWidth="2.2" />
          {umbellifera(1436, 380,
            [[18, 364], [4, 350], [-14, 358], [28, 372], [-6, 344], [14, 338]], "#2e5828", 0.5)}
        </g>
        <g className="sw1d">
          <line x1="1380" y1="1000" x2="1386" y2="470" stroke="#1a3015" strokeWidth="1.5" />
          {dandelion(1386, 470, 13, 12, 0.4)}
        </g>
      </g>

      {/* ── RIGHT CLUSTER — MAIN LAYER ── */}

      {/* White macro daisy — luminous, rightmost hero flower */}
      <g className="sw2">
        <line x1="1342" y1="1000" x2="1350" y2="380" stroke="#1e3018" strokeWidth="3" />
        <line x1="1350" y1="560" x2="1382" y2="470" stroke="#1e3018" strokeWidth="1.8" />
        {daisy(1350, 380, 26, 12, "#e8e8e0", "#f0ecca", 0.82, 0.6)}
        {/* Luminous halo */}
        <circle cx={1350} cy={382} r="52" fill="#fff" opacity="0.06" filter="url(#softBlur)" />
        {daisy(1382, 470, 15, 9, "#d0d0c8", "#e8e4b8", 0.65)}
        <path d="M1350 620 Q1375 585 1385 548 Q1362 575 1350 600" fill="#1e3d14" opacity="0.5" />
        <path d="M1350 730 Q1326 695 1318 658 Q1338 682 1350 710" fill="#1a3810" opacity="0.45" />
      </g>

      {/* Tall right umbellifer cluster */}
      <g className="sw1d">
        <line x1="1255" y1="1000" x2="1268" y2="295" stroke="#243818" strokeWidth="3.2" />
        <line x1="1268" y1="295" x2="1285" y2="170" stroke="#243818" strokeWidth="2.2" />
        <line x1="1268" y1="460" x2="1300" y2="380" stroke="#243818" strokeWidth="1.6" />
        {umbellifera(1285, 170,
          [[22, 152], [6, 136], [-16, 144], [34, 164], [-4, 130], [18, 122], [-12, 146], [28, 138]],
          "#3a6a2e", 0.68)}
        {umbellifera(1300, 380,
          [[16, 364], [4, 352], [-12, 360], [24, 374]], "#2e5222", 0.52)}
      </g>

      {/* Right dandelion */}
      <g className="sw3">
        <line x1="1160" y1="1000" x2="1168" y2="445" stroke="#1c2e14" strokeWidth="2.5" />
        {dandelion(1168, 445, 24, 16, 0.55)}
        <circle cx={1168} cy={445} r="4.5" fill="#a8a898" opacity="0.7" />
        <circle cx={1168} cy={445} r="32" fill="#fff" opacity="0.03" />
        <line x1="1168" y1="640" x2="1142" y2="560" stroke="#1c2e14" strokeWidth="1.5" />
        {daisy(1142, 560, 12, 7, "#5a8a35", "#304e20", 0.55)}
        <path d="M1168 750 Q1192 712 1200 674 Q1180 703 1168 728" fill="#1e3d14" opacity="0.5" />
      </g>

      {/* Smaller accent flower right */}
      <g className="sw2d">
        <line x1="1080" y1="1000" x2="1088" y2="600" stroke="#1a2c12" strokeWidth="2" />
        {daisy(1088, 600, 18, 9, "#c8c8bc", "#ded8a8", 0.62)}
        <path d="M1088 770 Q1064 735 1055 700 Q1074 724 1088 750" fill="#1a3810" opacity="0.5" />
      </g>

      {/* Thin grass group right */}
      {[[1000, 1000, 998, 510, 1.0], [1018, 1000, 1022, 530, 0.9], [1036, 1000, 1032, 505, 1.1], [1054, 1000, 1058, 488, 0.85]].map(([x1, y1, x2, y2, sw], i) => (
        <g key={`grg${i}`} className={["sw3", "sw1", "sw2d", "sw3d"][i]}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1a2a0e" strokeWidth={sw} opacity="0.6" />
          {[-1, 0, 1].map(j => <ellipse key={j} cx={x2 + j * 3} cy={y2 - j * 9 - 6} rx="1.8" ry="6" fill="#253518" opacity="0.5" />)}
        </g>
      ))}

      {/* ── FOREGROUND GROUND COVER ── */}
      {/* Left ferns */}
      {[[20, 958], [65, 972], [115, 962], [170, 975], [225, 965], [275, 972], [330, 960]].map(([x, y], i) => (
        <g key={`fl${i}`}>
          <path d={`M${x} ${y} Q${x - 22} ${y - 40} ${x - 38} ${y - 70}`} stroke="#182a10" strokeWidth="1.6" fill="none" opacity="0.65" />
          <path d={`M${x} ${y} Q${x + 18} ${y - 32} ${x + 30} ${y - 58}`} stroke="#182a10" strokeWidth="1.4" fill="none" opacity="0.55" />
          <ellipse cx={x - 35} cy={y - 72} rx="7" ry="3" fill="#1e3d12" opacity="0.55" transform={`rotate(-25,${x - 35},${y - 72})`} />
          <ellipse cx={x + 28} cy={y - 60} rx="6" ry="3" fill="#1a3810" opacity="0.48" transform={`rotate(18,${x + 28},${y - 60})`} />
        </g>
      ))}
      {/* Right ferns */}
      {[[1120, 965], [1170, 958], [1220, 972], [1275, 962], [1335, 975], [1390, 962], [1435, 955]].map(([x, y], i) => (
        <g key={`fr${i}`}>
          <path d={`M${x} ${y} Q${x + 22} ${y - 40} ${x + 38} ${y - 70}`} stroke="#182a10" strokeWidth="1.6" fill="none" opacity="0.65" />
          <path d={`M${x} ${y} Q${x - 18} ${y - 30} ${x - 28} ${y - 55}`} stroke="#182a10" strokeWidth="1.4" fill="none" opacity="0.55" />
          <ellipse cx={x + 36} cy={y - 72} rx="7" ry="3" fill="#1e3d12" opacity="0.55" transform={`rotate(25,${x + 36},${y - 72})`} />
          <ellipse cx={x - 26} cy={y - 57} rx="5" ry="3" fill="#1a3810" opacity="0.48" transform={`rotate(-18,${x - 26},${y - 57})`} />
        </g>
      ))}

      {/* ── FLOATING SPORES ── */}
      {[
        [160, 318, 7.5, "fu1", 0], [160, 318, 5, "fu3", 3.5],
        [258, 476, 8, "fu2", 1], [258, 476, 5.5, "fu4", 5],
        [338, 568, 7, "fu3", 2], [338, 568, 4.5, "fu1", 6],
        [1168, 432, 8, "fu1", 1.5], [1168, 432, 5, "fu2", 4.5],
        [1350, 368, 7, "fu4", 0.5], [1350, 368, 4.5, "fu3", 3],
        [720, 610, 5, "fu2", 2.5], [640, 640, 4, "fu1", 4],
        [820, 590, 4.5, "fu3", 1.2],
      ].map(([cx, cy, r, anim, delay], i) => (
        <g key={`sp${i}`} style={{ animation: `${anim} ${9 + i * 1.3}s ease-in-out infinite`, animationDelay: `${delay}s` }}>
          <circle cx={cx} cy={cy} r="1.8" fill="#e0e0cc" opacity="0.65" />
          {Array.from({ length: 8 }, (_, j) => {
            const a = (j / 8) * Math.PI * 2;
            return (
              <g key={j}>
                <line x1={cx} y1={cy} x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r * 0.85}
                  stroke="#c0c0a8" strokeWidth="0.55" opacity="0.38" />
                <circle cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r * 0.85} r="1.4"
                  fill="#d0d0b8" opacity="0.38" />
              </g>
            );
          })}
        </g>
      ))}

      {/* Drifting motes / micro spores */}
      {[
        [280, 720, 2.5, "fu3", 3.2], [420, 660, 2, "fu1", 5.8], [555, 700, 2.2, "fu2", 2], [
          660, 640, 1.8, "fu4", 4.4], [800, 668, 2, "fu1", 1.1], [920, 700, 2.4, "fu3", 6.5], [
          1050, 655, 1.9, "fu2", 0.8], [1170, 688, 2.1, "fu4", 3.8], [600, 580, 1.5, "fu1", 7], [
          750, 604, 1.7, "fu3", 2.2], [880, 572, 2, "fu2", 4], [480, 620, 1.6, "fu4", 1.5],
      ].map(([cx, cy, r, anim, delay], i) => (
        <circle key={`m${i}`} cx={cx} cy={cy} r={r} fill="#fff"
          style={{ animation: `${anim} ${12 + i * 0.9}s linear infinite`, animationDelay: `${delay}s`, opacity: 0.28 }} />
      ))}

      {/* ── OVERLAYS ── */}
      <rect width="1440" height="1000" fill="url(#vignette)" />
      <rect width="1440" height="220" fill="url(#topFade)" />
      <rect y="760" width="1440" height="240" fill="url(#bottomFade)" />
    </svg>
  );
}

// ── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ position: "relative", height: 1000, background: "#000", overflow: "hidden" }}>
      {/* Botanical SVG scene */}
      <BotanicalScene />
      {/* Subtle dark overlay to ensure text legibility */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.15)", zIndex: 2 }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 180, paddingLeft: 24, paddingRight: 24, textAlign: "center" }}>
        {/* Heading */}
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#fff", fontSize: "clamp(52px, 7vw, 100px)", lineHeight: 0.88, letterSpacing: "-3px", maxWidth: 800, marginBottom: 28 }}>
          <BlurText text="The Website Your Brand" /><br /><BlurText text="Deserves" />
        </h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.8 }}
          style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, fontFamily: "'Barlow', sans-serif", fontWeight: 300, maxWidth: 480, lineHeight: 1.7, marginBottom: 40 }}
        >
          Stunning design. Blazing performance. Built by AI, refined by experts. This is web design, wildly reimagined.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}
        >
          <button style={{ ...glassStrongStyle, borderRadius: 9999, padding: "13px 24px", color: "#fff", fontSize: 14, fontFamily: "'Barlow', sans-serif", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}>
            Get Started <ArrowUpRight size={15} />
          </button>
          <button style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 14, fontFamily: "'Barlow', sans-serif", fontWeight: 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}>
            <Play size={15} fill="currentColor" /> Watch the Film
          </button>
        </motion.div>

        {/* Trusted by pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.3 }}
          style={{ position: 'absolute', top: 860, background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9999, padding: '8px 24px' }}
        >
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontFamily: "'Barlow', sans-serif", fontWeight: 400 }}>Trusted by the teams behind</span>
        </motion.div>
      </div>
    </section>
  );
}

// ── MARQUEE ──────────────────────────────────────────────────────────────────
function Marquee() {
  const items = "React · Next.js · Tailwind CSS · Framer Motion · Three.js · WebGL · TypeScript · Vercel · Stripe · GSAP ·";
  return (
    <section style={{ position: "relative", padding: "100px 24px", textAlign: "center", overflow: "hidden" }}>
      {/* Ambient macro skincare video */}
      <video autoPlay loop muted playsInline
        src="https://videos.pexels.com/video-files/3192157/3192157-uhd_2560_1440_25fps.mp4"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, opacity: 0.18, filter: "saturate(0.4)" }}
      />
      {/* Edge fades */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, background: "linear-gradient(to bottom, #000, transparent)", zIndex: 1 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "linear-gradient(to top, #000, transparent)", zIndex: 1 }} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ ...glassStyle, borderRadius: 9999, padding: "6px 16px", display: "inline-block", marginBottom: 32 }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'Barlow', sans-serif", fontWeight: 400, letterSpacing: "0.08em", textTransform: "uppercase" }}>Powered by science.</span>
        </div>
        <div style={{ overflow: "hidden", position: "relative" }}>
          <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
          <div style={{ display: "flex", width: "max-content", animation: "marquee 22s linear infinite" }}>
            {[items, items].map((s, i) => (
              <span key={i} style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "rgba(255,255,255,0.7)", fontSize: "clamp(20px,3vw,30px)", whiteSpace: "nowrap", paddingRight: 48 }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── HOW IT WORKS ─────────────────────────────────────────────────────────────
function HowItWorks() {
  return (
    <section style={{ position: "relative", minHeight: 700, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <HLSVideo
        src="https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, opacity: 0.6 }}
      />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 200, background: "linear-gradient(to bottom, #000, transparent)", zIndex: 1 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, background: "linear-gradient(to top, #000, transparent)", zIndex: 1 }} />
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "80px 24px", maxWidth: 640, margin: "0 auto" }}>
        <div style={{ ...glassStyle, borderRadius: 9999, padding: "6px 16px", display: "inline-block", marginBottom: 28 }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'Barlow', sans-serif", fontWeight: 400, letterSpacing: "0.08em", textTransform: "uppercase" }}>How It Works</span>
        </div>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#fff", fontSize: "clamp(36px,5vw,64px)", lineHeight: 0.92, letterSpacing: "-2px", marginBottom: 24 }}>
          You share your vision.<br />We craft the reality.
        </h2>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, fontFamily: "'Barlow', sans-serif", fontWeight: 300, lineHeight: 1.7, marginBottom: 36 }}>
          Tell us your brand story. Our team designs, develops, and deploys a stunningly fast web experience — in days, not lifetimes.
        </p>
        <button style={{ ...glassStrongStyle, borderRadius: 9999, padding: "13px 24px", color: "#fff", fontSize: 14, fontFamily: "'Barlow', sans-serif", fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7 }}>
          Start Your Project <ArrowUpRight size={15} />
        </button>
      </div>
    </section>
  );
}

// ── BEFORE/AFTER SLIDER ──────────────────────────────────────────────────────
function BeforeAfterSlider() {
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);
  const containerRef = useRef(null);

  const updatePos = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    setPos(pct);
  };

  useEffect(() => {
    const onMove = (e) => { if (dragging.current) updatePos(e.clientX || e.touches?.[0]?.clientX); };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseDown={(e) => { dragging.current = true; updatePos(e.clientX); }}
      onTouchStart={(e) => { dragging.current = true; updatePos(e.touches[0].clientX); }}
      style={{ position: "relative", width: "100%", height: 400, borderRadius: 20, overflow: "hidden", cursor: "ew-resize", userSelect: "none" }}
    >
      {/* Before */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)", filter: "saturate(0) brightness(0.6)" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />
        <div style={{ position: "absolute", bottom: 20, left: 20, ...glassStyle, borderRadius: 9999, padding: "5px 14px" }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'Barlow', sans-serif" }}>Before</span>
        </div>
      </div>

      {/* After */}
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - pos}% 0 0)`, background: "linear-gradient(135deg, #3d1a0f 0%, #8b4513 30%, #c68642 60%, #f4c68d 100%)", filter: "saturate(1.3) brightness(1.1)" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 40% 40%, rgba(255,200,150,0.3) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: 20, right: 20, ...glassStyle, borderRadius: 9999, padding: "5px 14px" }}>
          <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 12, fontFamily: "'Barlow', sans-serif" }}>After Agamtail</span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: 2, background: "rgba(255,255,255,0.8)", transform: "translateX(-50%)", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", ...glassStrongStyle, borderRadius: 9999, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontSize: 14 }}>⇄</span>
        </div>
      </div>
    </div>
  );
}

// ── FEATURES CHESS ───────────────────────────────────────────────────────────
function Features() {
  return (
    <section style={{ position: "relative", padding: "100px 24px", overflow: "hidden" }}>
      {/* Subtle serum/liquid macro in the background */}
      <video autoPlay loop muted playsInline
        src="https://videos.pexels.com/video-files/4503874/4503874-uhd_2560_1440_25fps.mp4"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, opacity: 0.06, filter: "saturate(0.5)" }}
      />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 200, background: "linear-gradient(to bottom, #000, transparent)", zIndex: 1 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, background: "linear-gradient(to top, #000, transparent)", zIndex: 1 }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ ...glassStyle, borderRadius: 9999, padding: "6px 16px", display: "inline-block", marginBottom: 16 }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'Barlow', sans-serif", fontWeight: 400, letterSpacing: "0.08em", textTransform: "uppercase" }}>Capabilities</span>
        </div>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#fff", fontSize: "clamp(36px,5vw,64px)", lineHeight: 0.92, letterSpacing: "-2px", marginBottom: 64 }}>
          Pro design.<br />Zero guesswork.
        </h2>

        {/* Row 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", marginBottom: 80 }}>
          <div>
            <h3 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#fff", fontSize: 32, lineHeight: 1, marginBottom: 16 }}>Designed to convert. Built to wow.</h3>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, fontFamily: "'Barlow', sans-serif", fontWeight: 300, lineHeight: 1.75, marginBottom: 24 }}>
              Every pixel is intentional. Our experts study your brand, audience, and market — then build a digital experience to outperform them all.
            </p>
            <button style={{ ...glassStrongStyle, borderRadius: 9999, padding: "11px 20px", color: "#fff", fontSize: 13, fontFamily: "'Barlow', sans-serif", fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
              Learn more <ArrowUpRight size={14} />
            </button>
          </div>
          <BeforeAfterSlider />
        </div>

        {/* Row 2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div style={{ borderRadius: 20, overflow: "hidden", height: 380, position: "relative" }}>
            <video autoPlay loop muted playsInline
              src="https://videos.pexels.com/video-files/7518831/7518831-uhd_2560_1440_24fps.mp4"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            {/* Glass overlay with pulsing skin data tags */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 24 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Lighthouse 100%", "Conversions ↑", "Interactions Smooth", "Design Pixel-Perfect"].map((label, i) => (
                  <motion.span key={label}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 + i * 0.15, duration: 0.5 }}
                    style={{ ...glassStrongStyle, borderRadius: 9999, padding: "5px 12px", color: "rgba(255,255,255,0.85)", fontSize: 11, fontFamily: "'Barlow', sans-serif", fontWeight: 500 }}>
                    {label}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h3 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#fff", fontSize: 32, lineHeight: 1, marginBottom: 16 }}>It scales with you. Automatically.</h3>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, fontFamily: "'Barlow', sans-serif", fontWeight: 300, lineHeight: 1.75, marginBottom: 24 }}>
              Your website evolves with your business. Modern architecture handles every traffic spike and feature addition flawlessly. No bottlenecks. Ever.
            </p>
            <button style={{ ...glassStrongStyle, borderRadius: 9999, padding: "11px 20px", color: "#fff", fontSize: 13, fontFamily: "'Barlow', sans-serif", fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
              See how it works <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── INGREDIENT CINEMA ─────────────────────────────────────────────────────────
// A full-bleed split-screen moment — two videos side by side, text floating between
function IngredientCinema() {
  const clips = [
    {
      src: "https://videos.pexels.com/video-files/3997792/3997792-uhd_2560_1440_25fps.mp4",
      label: "React & Next.js", sub: "Blazing fast performance",
    },
    {
      src: "https://videos.pexels.com/video-files/6476254/6476254-uhd_2560_1440_25fps.mp4",
      label: "WebGL & Three.js", sub: "Immersive 3D experiences",
    },
    {
      src: "https://videos.pexels.com/video-files/7230534/7230534-uhd_2560_1440_25fps.mp4",
      label: "Framer Motion", sub: "Fluid, physics-based animations.",
    },
  ];

  return (
    <section style={{ position: "relative", width: "100%", overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", height: 480 }}>
        {clips.map(({ src, label, sub }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, delay: i * 0.2 }}
            style={{ position: "relative", overflow: "hidden" }}
          >
            <video autoPlay loop muted playsInline src={src}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "saturate(0.65) brightness(0.7)", transition: "filter 0.6s ease" }}
              onMouseEnter={e => { e.currentTarget.style.filter = "saturate(1.1) brightness(0.9)"; }}
              onMouseLeave={e => { e.currentTarget.style.filter = "saturate(0.65) brightness(0.7)"; }}
            />
            {/* Thin vertical divider */}
            {i < 2 && <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.08)", zIndex: 2 }} />}
            {/* Dark gradient overlay */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)" }} />
            {/* Label */}
            <div style={{ position: "absolute", bottom: 28, left: 24, right: 24 }}>
              <p style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#fff", fontSize: "clamp(18px,2.5vw,28px)", lineHeight: 1, marginBottom: 6 }}>{label}</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontFamily: "'Barlow', sans-serif", fontWeight: 300, letterSpacing: "0.04em" }}>{sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Top / bottom black bleed */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 80, background: "linear-gradient(to bottom, #000, transparent)", zIndex: 3 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(to top, #000, transparent)", zIndex: 3 }} />
    </section>
  );
}

// ── FEATURES GRID ────────────────────────────────────────────────────────────
function FeaturesGrid() {
  const cards = [
    {
      icon: Zap,
      title: "Days, Not Months",
      desc: "Concept-to-launch at a pace that redefines fast.",
      video: "https://videos.pexels.com/video-files/6476254/6476254-uhd_2560_1440_25fps.mp4",
    },
    {
      icon: Leaf,
      title: "Obsessively Crafted",
      desc: "Every component considered. Every pixel refined.",
      video: "https://videos.pexels.com/video-files/4503874/4503874-uhd_2560_1440_25fps.mp4",
    },
    {
      icon: BarChart3,
      title: "Built to Convert",
      desc: "Designs informed by user data. Decisions backed by analytics.",
      video: "https://videos.pexels.com/video-files/7230534/7230534-uhd_2560_1440_25fps.mp4",
    },
    {
      icon: Shield,
      title: "Performant by Default",
      desc: "SEO-optimized, accessible, and blindingly fast by default.",
      video: "https://videos.pexels.com/video-files/3997792/3997792-uhd_2560_1440_25fps.mp4",
    },
  ];

  return (
    <section style={{ position: "relative", padding: "80px 24px 120px", overflow: "hidden" }}>
      {/* Full-bleed ambient video behind the whole section */}
      <video autoPlay loop muted playsInline
        src="https://videos.pexels.com/video-files/5718859/5718859-uhd_2560_1440_25fps.mp4"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, opacity: 0.07, filter: "saturate(0.3)" }}
      />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 200, background: "linear-gradient(to bottom, #000, transparent)", zIndex: 1 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, background: "linear-gradient(to top, #000, transparent)", zIndex: 1 }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ ...glassStyle, borderRadius: 9999, padding: "6px 16px", display: "inline-block", marginBottom: 16 }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'Barlow', sans-serif", fontWeight: 400, letterSpacing: "0.08em", textTransform: "uppercase" }}>Why Agamtail</span>
        </div>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#fff", fontSize: "clamp(36px,5vw,64px)", lineHeight: 0.92, letterSpacing: "-2px", marginBottom: 48 }}>
          The difference is<br />in the formula.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {cards.map(({ icon: Icon, title, desc, video }) => (
            <motion.div
              key={title}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ ...glassStyle, borderRadius: 20, overflow: "hidden" }}
            >
              {/* Video header */}
              <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
                <video autoPlay loop muted playsInline
                  src={video}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "saturate(0.7) brightness(0.75)" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7) 100%)" }} />
                <div style={{ position: "absolute", bottom: 14, left: 14, ...glassStrongStyle, borderRadius: 9999, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={15} color="rgba(255,255,255,0.9)" />
                </div>
              </div>
              {/* Text */}
              <div style={{ padding: "20px 22px 24px" }}>
                <h4 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#fff", fontSize: 20, marginBottom: 8 }}>{title}</h4>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, fontFamily: "'Barlow', sans-serif", fontWeight: 300, lineHeight: 1.65 }}>{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── STATS ────────────────────────────────────────────────────────────────────
function Stats() {
  const stats = [
    { value: "400+", label: "Websites launched" },
    { value: "99%", label: "Client satisfaction" },
    { value: "3.2×", label: "Increase in conversion" },
    { value: "14 days", label: "Average delivery time" },
  ];

  return (
    <section style={{ position: "relative", overflow: "hidden", padding: "120px 24px" }}>
      <HLSVideo
        src="https://stream.mux.com/NcU3HlHeF7CUL86azTTzpy3Tlb00d6iF3BmCdFslMJYM.m3u8"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, filter: "saturate(0)", opacity: 0.5 }}
      />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 200, background: "linear-gradient(to bottom, #000, transparent)", zIndex: 1 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, background: "linear-gradient(to top, #000, transparent)", zIndex: 1 }} />
      <div style={{ position: "relative", zIndex: 10, maxWidth: 900, margin: "0 auto" }}>
        <div style={{ ...glassStyle, borderRadius: 28, padding: "56px 48px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40, textAlign: "center" }}>
            {stats.map(({ value, label }) => (
              <div key={label}>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#fff", fontSize: "clamp(40px,5vw,60px)", lineHeight: 1, marginBottom: 8 }}>{value}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── TESTIMONIALS ─────────────────────────────────────────────────────────────
function Testimonials() {
  const testimonials = [
    {
      quote: "Our organic traffic skyrocketed and bounce rate dropped to zero. The new site paid for itself in a week.",
      name: "Priya Sharma", role: "CEO, Bloom Collective",
      video: "https://videos.pexels.com/video-files/3256542/3256542-uhd_2560_1440_25fps.mp4",
    },
    {
      quote: "I was skeptical about the timeline. Then they delivered a masterpiece in under two weeks. Absolutely stunning.",
      name: "James Okafor", role: "Founder, Lumière",
      video: "https://videos.pexels.com/video-files/5327583/5327583-uhd_2560_1440_25fps.mp4",
    },
    {
      quote: "They didn't just build a website. They elevated our entire brand identity. The interactions alone put us ahead.",
      name: "Mia Tanaka", role: "Brand Director, Helix",
      video: "https://videos.pexels.com/video-files/6896079/6896079-uhd_2560_1440_25fps.mp4",
    },
  ];

  return (
    <section style={{ position: "relative", padding: "120px 24px", overflow: "hidden" }}>
      {/* Ambient background video — macro skin texture */}
      <video autoPlay loop muted playsInline
        src="https://videos.pexels.com/video-files/3192157/3192157-uhd_2560_1440_25fps.mp4"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, opacity: 0.12, filter: "saturate(0.2) brightness(0.6)" }}
      />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 200, background: "linear-gradient(to bottom, #000, transparent)", zIndex: 1 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, background: "linear-gradient(to top, #000, transparent)", zIndex: 1 }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ ...glassStyle, borderRadius: 9999, padding: "6px 16px", display: "inline-block", marginBottom: 16 }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'Barlow', sans-serif", fontWeight: 400, letterSpacing: "0.08em", textTransform: "uppercase" }}>What They Say</span>
        </div>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#fff", fontSize: "clamp(36px,5vw,64px)", lineHeight: 0.92, letterSpacing: "-2px", marginBottom: 52 }}>
          Don't take our word for it.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {testimonials.map(({ quote, name, role, video }) => (
            <motion.div
              key={name}
              whileHover={{ y: -5, scale: 1.01 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ ...glassStyle, borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column" }}
            >
              {/* Looping video portrait */}
              <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
                <video autoPlay loop muted playsInline
                  src={video}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "saturate(0.8) brightness(0.8)" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.8) 100%)" }} />
              </div>
              {/* Quote body */}
              <div style={{ padding: "24px 26px 28px", flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
                <p style={{ color: "rgba(255,255,255,0.78)", fontSize: 14, fontFamily: "'Barlow', sans-serif", fontWeight: 300, lineHeight: 1.8, fontStyle: "italic", flex: 1 }}>
                  "{quote}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 16 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "1px solid rgba(255,255,255,0.15)" }}>
                    <video autoPlay loop muted playsInline src={video}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div>
                    <div style={{ color: "#fff", fontSize: 13, fontFamily: "'Barlow', sans-serif", fontWeight: 500 }}>{name}</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}>{role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA + FOOTER ─────────────────────────────────────────────────────────────
function CTAFooter() {
  return (
    <section style={{ position: "relative", overflow: "hidden", minHeight: 700, display: "flex", flexDirection: "column" }}>
      <HLSVideo
        src="https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, opacity: 0.6 }}
      />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 200, background: "linear-gradient(to bottom, #000, transparent)", zIndex: 1 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, background: "linear-gradient(to top, #000, transparent)", zIndex: 1 }} />

      <div style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "120px 24px 60px" }}>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#fff", fontSize: "clamp(40px,7vw,88px)", lineHeight: 0.9, letterSpacing: "-3px", marginBottom: 24, maxWidth: 780 }}>
          Your brand's transformation starts here.
        </h2>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, fontFamily: "'Barlow', sans-serif", fontWeight: 300, lineHeight: 1.7, marginBottom: 40, maxWidth: 440 }}>
          Book a free discovery call. See what expert web design can do for your business.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <button style={{ ...glassStrongStyle, borderRadius: 9999, padding: "13px 24px", color: "#fff", fontSize: 14, fontFamily: "'Barlow', sans-serif", fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7 }}>
            Book a Consultation <ArrowUpRight size={15} />
          </button>
          <button style={{ background: "#fff", color: "#000", borderRadius: 9999, border: "none", padding: "13px 24px", fontSize: 14, fontFamily: "'Barlow', sans-serif", fontWeight: 500, cursor: "pointer" }}>
            View Pricing
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: "relative", zIndex: 10, borderTop: "1px solid rgba(255,255,255,0.08)", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}>© 2026 Agamtail</span>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", "Contact"].map(link => (
            <button key={link} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", fontSize: 12, fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}>{link}</button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── ROOT ─────────────────────────────────────────────────────────────────────
export default function Agamtail() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #000; color: #fff; }
        button { outline: none; }
      `}</style>
      <div style={{ background: "#000", minHeight: "100vh", overflowX: "hidden" }}>
        <Navbar />
        <Hero />
        <Marquee />
        <HowItWorks />
        <Features />
        <FeaturesGrid />
        <IngredientCinema />
        <Stats />
        <Testimonials />
        <CTAFooter />
        <QuizWidget />
      </div>
    </>
  );
}
