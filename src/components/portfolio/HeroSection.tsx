import { Download, MessageCircle, Linkedin, Github, Instagram } from "lucide-react";
import { useProfiles } from "@/hooks/useProfile";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function useCountUp(value: string, duration = 1200) {
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    const n = parseFloat(value.replace(/[^\d.]/g, ""));
    if (isNaN(n) || n === 0) { setDisplay(value); return; }
    const prefix = value.match(/^[^\d]*/)?.[0] ?? "";
    const suffix = value.match(/[^\d]*$/)?.[0] ?? "";
    const start = Date.now();
    let rafId: number;
    const tick = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      setDisplay(`${prefix}${Math.round(eased * n)}${suffix}`);
      if (t < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [value, duration]);
  return display;
}

const HeroSection = () => {
  const { data: profiles = [], isLoading } = useProfiles();
  const profile = profiles[0];

  // Hooks must be called before any early return
  const stat1Number = profile?.stat_1_number ?? "+15";
  const stat2Number = profile?.stat_2_number ?? "5+";
  const stat1Animated = useCountUp(stat1Number);
  const stat2Animated = useCountUp(stat2Number);

  if (isLoading) {
    return (
      <section className="animate-pulse space-y-4">
        <div className="h-3 bg-secondary rounded w-16" />
        <div className="h-16 md:h-20 bg-secondary rounded-xl w-3/4" />
        <div className="h-16 md:h-20 bg-secondary rounded-xl w-1/2" />
        <div className="h-3 bg-secondary rounded w-32" />
        <div className="h-4 bg-secondary rounded w-2/3" />
        <div className="h-4 bg-secondary rounded w-1/2" />
        <div className="flex gap-3 pt-2">
          <div className="h-11 w-28 bg-secondary rounded-xl" />
          <div className="h-11 w-28 bg-secondary rounded-xl" />
        </div>
      </section>
    );
  }

  const profileName  = profile?.full_name ?? "";
  const nameParts    = profileName.trim().split(/\s+/);
  const firstName    = nameParts[0] ?? "";
  const lastName     = nameParts.slice(1).join(" ");
  const currentFocus = profile?.current_focus ?? "";
  const bioSummary   = profile?.bio_summary ?? "";
  const cvUrl        = profile?.cv_url ?? "";
  const phone        = profile?.phone ?? "";

  const stat1Label  = profile?.stat_1_label  ?? "Projetos Ativos";
  const stat2Label  = profile?.stat_2_label  ?? "Anos de Experiência";
  const phraseStart  = profile?.hero_phrase_start  ?? "Dados são o";
  const phraseStrike = profile?.hero_phrase_strike ?? "futuro";
  const phraseEnd    = profile?.hero_phrase_end    ?? "presente."

  const whatsappHref = phone
    ? `https://wa.me/${phone.replace(/\D/g, "")}`
    : "#contact";

  return (
    <section className="animate-fade-up delay-100">

      {/* ── Greeting label ────────────────────────────────── */}
      <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-muted-foreground mb-3">
        Eu sou
      </p>

      {/* ── Name — display serif, commanding weight ────────── */}
      <h1 className="font-display leading-[0.92] mb-5">
        <span className="block text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] text-foreground">
          {firstName}
        </span>
        {lastName && (
          <span className="block text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] text-primary">
            {lastName}
          </span>
        )}
      </h1>

      {/* ── Specialty — sans-serif secondary, with accent rule ─ */}
      <div className="flex items-center gap-3 mb-6">
        <span className="w-6 h-0.5 bg-primary rounded-full shrink-0" />
        <h2 className="text-sm md:text-base font-medium text-muted-foreground tracking-widest uppercase">
          {currentFocus}
        </h2>
      </div>

      {/* ── Bio — controlled width ────────────────────────── */}
      <p className="text-base text-muted-foreground max-w-[38rem] leading-relaxed mb-8">
        {bioSummary}
      </p>

      {/* ── Primary CTA ───────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {cvUrl ? (
          <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <Download className="w-4 h-4" />
            Baixar CV
          </a>
        ) : (
          <span className="btn-primary opacity-40 cursor-not-allowed select-none">
            <Download className="w-4 h-4" />
            Baixar CV
          </span>
        )}
        <a href="#contact" className="btn-secondary">
          <MessageCircle className="w-4 h-4" />
          Fale comigo
        </a>
      </div>

      {/* ── Social icons + secondary nav ──────────────────── */}
      <div className="flex items-center gap-2 mb-12 flex-wrap">
        <a
          href="https://linkedin.com/in/tarlisodoria"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
          aria-label="LinkedIn"
        >
          <Linkedin className="w-4 h-4 text-foreground transition-colors" />
        </a>
        <a
          href="https://github.com/tarlisodoria"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
          aria-label="GitHub"
        >
          <Github className="w-4 h-4 text-foreground transition-colors" />
        </a>
        <a
          href="https://instagram.com/tarlisodoria"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
          aria-label="Instagram"
        >
          <Instagram className="w-4 h-4 text-foreground transition-colors" />
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-4 h-4 text-foreground transition-colors" />
        </a>
        <span className="w-px h-5 bg-border mx-2 shrink-0" />
        <Link
          to="/about"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          Sobre
        </Link>
        <span className="text-border text-sm select-none">·</span>
        <Link
          to="/blog"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          Blog
        </Link>
      </div>

      {/* ── Stats ─────────────────────────────────────────── */}
      <div className="stats-grid">
        <div className="stat-item">
          <p className="stat-number">{stat1Animated}</p>
          <p className="stat-label">{stat1Label}</p>
        </div>
        <div className="stat-item">
          <p className="stat-number">{stat2Animated}</p>
          <p className="stat-label">{stat2Label}</p>
        </div>
        <div className="stat-item col-span-2 flex items-center justify-center">
          <p className="text-base md:text-lg font-medium text-center">
            {phraseStart}{" "}
            <span className="line-through text-muted-foreground/50 font-normal">{phraseStrike}</span>{" "}
            <span className="text-primary font-semibold">{phraseEnd}</span>
          </p>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
