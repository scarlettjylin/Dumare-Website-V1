import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Sparkles, Play } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import sceneTaste from "@/assets/scene-taste.jpg";
import sceneTaste2 from "@/assets/scene-taste-2.jpg";
import sceneTaste3 from "@/assets/scene-taste-3.jpg";
import sceneMoment from "@/assets/scene-moment.jpg";
import sceneProfile from "@/assets/scene-profile.jpg";
import dumareLogo from "@/assets/Dumare logo.png";

type Moment = { label: string; color: string };
const MOMENTS: Moment[] = [
  { label: "Dinner Watch",       color: "#e8a87c" },
  { label: "Late Night Watch",   color: "#a78bfa" },
  { label: "Sunday Afternoon",   color: "#f0c674" },
  { label: "Rainy Day",          color: "#5cbdb9" },
  { label: "Before Bed",         color: "#c9a0dc" },
  { label: "Background Watch",   color: "#94a3b8" },
  { label: "Weekend Escape",     color: "#f7931e" },
  { label: "Long Flight Watch",  color: "#7dd3fc" },
  { label: "After Work Reset",   color: "#87a878" },
  { label: "Vacation Mood",      color: "#ff6b6b" },
  { label: "Quick Escape",       color: "#ee5a70" },
  { label: "Slow Evening",       color: "#c17c74" },
  { label: "Family Watch",       color: "#f5b971" },
  { label: "Date Night",         color: "#e84393" },
  { label: "Watch With Friends", color: "#fbbf24" },
  { label: "Solo Night",         color: "#8b9dc3" },
  { label: "Kids Friendly",      color: "#fcd34d" },
  { label: "Parent Watch",       color: "#9ca3af" },
  { label: "Girls Night",        color: "#f472b6" },
  { label: "Guys Night",         color: "#60a5fa" },
  { label: "Group Vibes",        color: "#34d399" },
  { label: "Couple Pick",        color: "#fb7185" },
];

// Fixed slot positions (top%, left%) — varied layout, no overlap chaos.
const SLOTS = [
  { top: "28%", left: "8%"  },
  { top: "32%", left: "52%" },
  { top: "46%", left: "24%" },
  { top: "50%", left: "62%" },
  { top: "64%", left: "12%" },
  { top: "68%", left: "48%" },
];

// Mobile slots keep all tags well within the narrower visible area.
const MOBILE_SLOTS = [
  { top: "10%", left: "4%"  },
  { top: "16%", left: "44%" },
  { top: "38%", left: "10%" },
  { top: "44%", left: "48%" },
  { top: "66%", left: "4%"  },
  { top: "72%", left: "40%" },
];

function MomentCarousel({ ready = false }: { ready?: boolean }) {
  // Each slot holds an index into MOMENTS. Initialize with distinct labels.
  const [slotMoments, setSlotMoments] = useState<number[]>(() =>
    SLOTS.map((_, i) => i % MOMENTS.length),
  );
  // Visibility per slot (fade in/out independently).
  const [visible, setVisible] = useState<boolean[]>(() => SLOTS.map(() => true));
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const activeSlots = isMobile ? MOBILE_SLOTS : SLOTS;

  useEffect(() => {
    if (!ready) return;
    const timers: ReturnType<typeof setInterval>[] = [];
    SLOTS.forEach((_, slotIdx) => {
      // Stagger each slot's cycle so they fade asynchronously.
      const period = 3600 + slotIdx * 450;
      const offset = slotIdx * 700;
      const cycle = () => {
        // fade out
        setVisible((vs) => vs.map((v, i) => (i === slotIdx ? false : v)));
        setTimeout(() => {
          setSlotMoments((sm) => {
            const used = new Set(sm);
            let next = Math.floor(Math.random() * MOMENTS.length);
            let guard = 0;
            while (used.has(next) && guard++ < 20) {
              next = Math.floor(Math.random() * MOMENTS.length);
            }
            return sm.map((v, i) => (i === slotIdx ? next : v));
          });
          setVisible((vs) => vs.map((v, i) => (i === slotIdx ? true : v)));
        }, 1000);
      };
      const start = setTimeout(() => {
        // First fade fires immediately when this slot's stagger elapses
        // (slot 0 fires at +0 from ready), then repeats every `period`.
        cycle();
        const id = setInterval(cycle, period);
        timers.push(id);
      }, offset);
      timers.push(start as unknown as ReturnType<typeof setInterval>);
    });
    return () => timers.forEach((t) => clearInterval(t));
  }, [ready]);

  return (
    <div className="relative aspect-[4/3] md:aspect-[4/5] rounded-2xl overflow-hidden">

      {activeSlots.map((slot, slotIdx) => {
        const m = MOMENTS[slotMoments[slotIdx]];
        const isVisible = visible[slotIdx];
        return (
          <div
            key={slotIdx}
            className="absolute transition-all duration-1000 ease-out"
            style={{
              maxWidth: "48%",
              top: slot.top,
              left: slot.left,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0) scale(1)" : "translateY(6px) scale(0.94)",
            }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-md text-white text-sm font-medium whitespace-nowrap"
              style={{
                backgroundColor: `color-mix(in oklab, ${m.color} 16%, rgba(10,8,6,0.7))`,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: `color-mix(in oklab, ${m.color} 65%, transparent)`,
                boxShadow: `0 0 24px ${m.color}44, inset 0 0 10px ${m.color}22`,
              }}
            >
              <Sparkles className="size-3.5" style={{ color: m.color }} />
              {m.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

type Clip = { title: string; meta: string; gradient: string; accent: string; accent2: string };
const CLIPS: Clip[] = [
  { title: "Òlòtūré",        meta: "2h 0m · Nigeria · 2019",   gradient: "linear-gradient(135deg, #2a1410 0%, #6b2a1c 50%, #b56a3a 100%)", accent: "#d99257", accent2: "#7a3220" },
  { title: "Atlantics",      meta: "1h 46m · Senegal · 2019",  gradient: "linear-gradient(135deg, #1a1a24 0%, #3a4a55 55%, #8a9a8e 100%)", accent: "#a8b39a", accent2: "#4a5a60" },
  { title: "Rafiki",         meta: "1h 23m · Kenya · 2018",    gradient: "linear-gradient(135deg, #2a1820 0%, #7a3a3a 50%, #c97a52 100%)", accent: "#dc9268", accent2: "#7a3a3a" },
  { title: "The Burial of Kojo", meta: "1h 20m · Ghana · 2018",gradient: "linear-gradient(135deg, #1a2418 0%, #4a5a3a 55%, #b89a5e 100%)", accent: "#c9a86a", accent2: "#5a6a42" },
  { title: "Timbuktu",       meta: "1h 36m · Mali · 2014",     gradient: "linear-gradient(135deg, #2a1408 0%, #7a3818 50%, #c98a3a 100%)", accent: "#d99a4a", accent2: "#8a4220" },
  { title: "Mati Diop: Dahomey", meta: "1h 8m · Benin · 2024", gradient: "linear-gradient(135deg, #18141a 0%, #423850 55%, #8a7a8a 100%)", accent: "#a89888", accent2: "#5a4a5a" },
];

function ClipVisual({ c, variant }: { c: Clip; variant: number }) {
  const v = variant % 6;

  // Shared base — full-bleed gradient, slowly animated, never exposes edges.
  const Base = (
    <div className="absolute inset-0 animate-clip-shimmer" style={{ backgroundImage: c.gradient }} />
  );

  if (v === 0) {
    // Diagonal light sweep
    return (
      <>
        {Base}
        <div
          className="absolute inset-y-0 w-1/2 animate-clip-sweep mix-blend-screen"
          style={{ background: `linear-gradient(90deg, transparent, ${c.accent}66, transparent)` }}
        />
      </>
    );
  }

  if (v === 1) {
    // Soft drifting orb glow
    return (
      <>
        {Base}
        <div
          className="absolute size-[70%] rounded-full blur-3xl mix-blend-screen animate-clip-orb opacity-70"
          style={{ background: `radial-gradient(circle, ${c.accent}, transparent 70%)` }}
        />
      </>
    );
  }

  if (v === 2) {
    // Diagonal stripe pattern, gently scrolling
    return (
      <>
        {Base}
        <div
          className="absolute inset-0 mix-blend-overlay opacity-40 animate-clip-stripes"
          style={{ backgroundImage: `repeating-linear-gradient(45deg, ${c.accent}55 0 10px, transparent 10px 28px)` }}
        />
      </>
    );
  }

  if (v === 3) {
    // Dual orbs slow drift
    return (
      <>
        {Base}
        <div
          className="absolute size-[60%] rounded-full blur-3xl mix-blend-screen animate-clip-orb opacity-60"
          style={{ background: `radial-gradient(circle, ${c.accent}, transparent 70%)` }}
        />
        <div
          className="absolute size-[55%] rounded-full blur-3xl mix-blend-overlay animate-clip-orb opacity-50"
          style={{ background: `radial-gradient(circle, ${c.accent2}, transparent 70%)`, animationDelay: "-4s" }}
        />
      </>
    );
  }

  if (v === 4) {
    // Subtle dot grid drifting
    return (
      <>
        {Base}
        <div
          className="absolute inset-0 mix-blend-overlay opacity-30 animate-clip-stripes"
          style={{
            backgroundImage: `radial-gradient(circle, ${c.accent}aa 1px, transparent 1.5px)`,
            backgroundSize: "18px 18px",
          }}
        />
      </>
    );
  }

  // v === 5 — slow vertical light sweep
  return (
    <>
      {Base}
      <div
        className="absolute inset-x-0 h-1/2 animate-clip-sweep-v mix-blend-screen"
        style={{ background: `linear-gradient(180deg, transparent, ${c.accent}55, transparent)` }}
      />
    </>
  );
}

function ScrollClips({ ready = false, readyOnMobile = false }: { ready?: boolean; readyOnMobile?: boolean }) {
  const [i, setI] = useState(0);
  const [animate, setAnimate] = useState(true);

  // isMobile must be declared first — effectiveReady depends on it.
  // Initialize to false (SSR-safe), then update on client via useEffect.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update(); // set correct value immediately on mount
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // On mobile, wait for typing to finish (readyOnMobile). On desktop use ready.
  const effectiveReady = isMobile ? readyOnMobile : ready;
  useEffect(() => {
    if (!effectiveReady) return;
    const advance = () => {
      setI((v) => {
        const next = v + 1;
        if (next >= CLIPS.length * 2) {
          // Snap back to first copy without animation
          setAnimate(false);
          requestAnimationFrame(() => {
            setI(CLIPS.length);
            requestAnimationFrame(() => setAnimate(true));
          });
          return v;
        }
        return next;
      });
    };
    // Kick off the first transition immediately so the animation visibly
    // starts the moment effectiveReady flips.
    advance();
    const id = setInterval(advance, 2400);
    return () => clearInterval(id);
  }, [effectiveReady]);

  const loop = [...CLIPS, ...CLIPS, ...CLIPS];

  // Horizontal layout constants (mobile)
  const ITEM_W   = 64; // card width as % of container — leaves ~18% peek each side
  const GAP_X    = 4;
  const STEP_X   = ITEM_W + GAP_X;
  const OFFSET_X = (100 - ITEM_W) / 2;

  // Vertical layout constants (desktop)
  const ITEM   = 45;
  const GAP    = 4;
  const STEP   = ITEM + GAP;
  const OFFSET = (100 - ITEM) / 2;

  // Both layouts are always in the DOM — CSS (md:hidden / hidden md:block) picks
  // which one to show. This avoids a React hydration mismatch from JS-based
  // conditional rendering (isMobile starts false on the server).
  return (
    <>
      {/* ── Mobile: horizontal strip (hidden on md+) ─────────────────────── */}
      <div className="md:hidden relative aspect-[5/2] overflow-hidden rounded-2xl">
        <div
          className="absolute inset-0 flex flex-row items-center"
          style={{
            transform: `translateX(${OFFSET_X - i * STEP_X}%)`,
            transition: animate
              ? "transform 620ms cubic-bezier(0.22, 1.4, 0.36, 1)"
              : "none",
          }}
        >
          {loop.map((c, idx) => {
            const active = idx === i;
            return (
              <div
                key={idx}
                className="shrink-0 relative"
                style={{ width: `${ITEM_W}%`, marginRight: `${GAP_X}%` }}
              >
                <div className="relative w-full overflow-hidden rounded-xl" style={{ paddingBottom: "56.25%" }}>
                  <div
                    className="absolute inset-0 rounded-xl overflow-hidden transition-all duration-500"
                    style={{
                      transform: active ? "scale(1.06)" : "scale(0.86)",
                      opacity: active ? 1 : 0.45,
                      filter: active ? "brightness(1.1)" : "brightness(0.65)",
                    }}
                  >
                    <div className="absolute inset-0 animate-clip-hue">
                      <ClipVisual c={c} variant={idx % CLIPS.length} />
                    </div>
                    <div className="absolute inset-0 grain opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-primary animate-play-pulse" />
                        <div className="relative size-12 rounded-full bg-gradient-amber flex items-center justify-center">
                          <Play className="size-5 text-primary-foreground fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-[5%] bg-gradient-to-r from-background/80 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-[5%] bg-gradient-to-l from-background/80 to-transparent" />
      </div>

      {/* ── Desktop: vertical iPad frame (hidden on mobile) ──────────────── */}
      <div className="hidden md:block relative aspect-[4/5]">
      {/* iPad-style device frame */}
      <div className="absolute inset-0 rounded-[2.4rem] border border-border/60 bg-background/20 backdrop-blur-[1px] p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]">
        <div aria-hidden className="absolute top-2 left-1/2 -translate-x-1/2 h-1 w-10 rounded-full bg-foreground/10" />
        <div className="relative w-full h-full rounded-[1.7rem] overflow-hidden">
          <div
            className="absolute inset-0 flex flex-col"
            style={{
              transform: `translateY(${OFFSET - i * STEP}%)`,
              transition: animate ? "transform 620ms cubic-bezier(0.22, 1.4, 0.36, 1)" : "none",
              perspective: "800px",
            }}
          >
            {loop.map((c, idx) => {
              const active = idx === i;
              const distance = idx - i;
              const tiltX = active ? 0 : distance > 0 ? -6 : 6;
              return (
                <div
                  key={idx}
                  className="relative shrink-0 w-full overflow-hidden rounded-xl border border-white/5"
                  style={{ height: `${ITEM}%`, marginBottom: `${GAP}%` }}
                >
                  <div
                    className="absolute inset-0 transition-all duration-500"
                    style={{
                      transform: active
                        ? "scale(1.12) translateY(-3%)"
                        : `scale(0.84) rotateX(${tiltX}deg)`,
                      opacity: active ? 1 : 0.28,
                      filter: active ? "brightness(1.1)" : "brightness(0.55)",
                      transformOrigin: "center center",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <div className="absolute inset-0 animate-clip-hue">
                      <ClipVisual c={c} variant={idx % CLIPS.length} />
                    </div>
                    <div className="absolute inset-0 grain opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    {active && (
                      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-primary/30 shadow-[0_0_24px_4px_rgba(247,147,30,0.15)]" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-primary animate-play-pulse" />
                        <div className="relative size-16 rounded-full bg-gradient-amber flex items-center justify-center">
                          <Play className="size-7 text-primary-foreground fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[15%] bg-gradient-to-b from-background/80 to-transparent" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[15%] bg-gradient-to-t from-background/80 to-transparent" />
        </div>
      </div>
    </div>
    </>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dumaré — AI-powered discovery for African films & series" },
      {
        name: "description",
        content:
          "Dumaré is an AI-powered streaming platform for authentic African films and series. Personalized discovery, exclusive releases, premiere access.",
      },
      // Open Graph
      { property: "og:title", content: "Dumaré — Discover African stories, made personal" },
      {
        property: "og:description",
        content:
          "Personalized discovery for authentic African films and series. Join the free waitlist.",
      },
      { property: "og:image", content: "https://dumare.me/og-image.png" },
      { property: "og:url", content: "https://dumare.me/" },
      // Twitter / X
      { name: "twitter:title", content: "Dumaré — Discover African stories, made personal" },
      {
        name: "twitter:description",
        content:
          "Personalized discovery for authentic African films and series. Join the free waitlist.",
      },
      { name: "twitter:image", content: "https://dumare.me/og-image.png" },
    ],
  }),
  component: Landing,
});

function Logo() {
  return (
    <a href="#top" className="inline-block">
      <img src={dumareLogo} alt="Dumaré" className="h-5 w-auto" />
    </a>
  );
}

function Nav() {
  // Once the user scrolls past the hero's CTA, the nav CTA goes back to
  // its bold amber style. While the hero is in view we render a subtler
  // ghost-style button so it doesn't compete with the hero CTA.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/40 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Logo />
        <a
          href="#waitlist"
          className={`text-xs md:text-sm font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-full transition-colors duration-300 ${
            scrolled
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "text-foreground/75 border border-border/60 hover:text-primary hover:border-primary/50"
          }`}
        >
          <span className="hidden md:inline">Free </span>Early Access →
        </a>
      </div>
    </header>
  );
}

function Hero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = ref.current;
        if (!el) return;
        const y = window.scrollY;
        el.style.setProperty("--scroll-y", `${y}px`);
        el.style.setProperty("--scroll-progress", `${Math.min(y / window.innerHeight, 1)}`);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={ref} id="top" className="snap-hero hero-section relative min-h-[100svh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="hero-parallax-glow"><div className="hero-glow hero-glow-1" /></div>
          <div className="hero-parallax-glow-rev"><div className="hero-glow hero-glow-2" /></div>
          <div className="hero-parallax-beam"><div className="hero-beam hero-beam-1" /></div>
          <div className="hero-parallax-beam-rev"><div className="hero-beam hero-beam-2" /></div>
          {/* Cinematic ambience: slow projector-style shaft, drifting warm haze, faint film flicker. */}
          <div className="hero-parallax-glow"><div className="hero-shaft" /></div>
          <div className="hero-parallax-glow-rev"><div className="hero-haze" /></div>
          <div className="hero-flicker" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-16 w-full">
        <div className="max-w-2xl">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight">
            Discover African stories, <span className="italic text-gradient-amber">made personal.</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-logo font-medium max-w-xl leading-relaxed">
            An AI-powered streaming platform with a growing library of films and series, exclusive
            releases, and premiere access.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#waitlist"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-gradient-amber text-primary-foreground font-medium glow-amber hover:scale-[1.02] transition-transform"
            >
              Free Early Access
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>

    </section>
  );
}

function StorySection({
  id,
  eyebrow,
  title,
  body,
  image,
  images,
  media,
  reverse = false,
  snapScreen = false,
  mobilePositions,
  animationsReady = false,
}: {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  body: React.ReactNode;
  image: string;
  images?: string[];
  mobilePositions?: string[];
  media?: React.ReactNode;
  reverse?: boolean;
  snapScreen?: boolean;
  animationsReady?: boolean;
}) {
  const rotation = images && images.length > 1 ? images : null;
  const [activeIdx, setActiveIdx] = useState(0);
  // isMobile for per-image object-position on mobile only
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  // zoomStarted: lets the first image animate its Ken Burns zoom on mount.
  // Without this, the initial render snaps straight to scale(1.22) with no animation.
  const [zoomStarted, setZoomStarted] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setZoomStarted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Image carousel gets its own IntersectionObserver so it starts as soon as
  // the section enters view — independent of the typing animation chain.
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!rotation) return;
    const el = sectionRef.current;
    if (!el) return;
    let timers: ReturnType<typeof setTimeout>[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        // First swap at 1 s, then every 3.5 s.
        const first = setTimeout(() => setActiveIdx((i) => (i + 1) % rotation.length), 1000);
        const interval = setInterval(() => setActiveIdx((i) => (i + 1) % rotation.length), 3500);
        timers = [first, interval as unknown as ReturnType<typeof setTimeout>];
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => { observer.disconnect(); timers.forEach(clearTimeout); };
  }, [rotation]);

  return (
    <section ref={sectionRef} id={id} className={`relative ${snapScreen ? "snap-section py-12 md:py-0" : "py-12 md:py-16 lg:py-20"}`}>
      <div className={`relative max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-12 gap-12 lg:gap-20 w-full ${snapScreen ? "items-center" : "items-start"}`}>
        <div className={`md:col-span-8 ${snapScreen ? "" : "md:pt-8 lg:pt-12"} ${reverse ? "md:order-2" : ""}`}>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight max-w-2xl">
            {title}
          </h2>
          <div className={`${snapScreen ? "mt-4 md:mt-6" : "mt-6 md:mt-8"} space-y-4 text-base md:text-lg font-medium text-logo leading-relaxed max-w-2xl`}>
            {body}
          </div>
        </div>
        <div className={`md:col-span-4 ${reverse ? "md:order-1" : ""}`}>
          {media ?? (
            <div className="relative aspect-[4/3] md:aspect-[4/5] rounded-2xl overflow-hidden border border-border">
              {rotation ? (
                rotation.map((src, i) => {
                  const isActive = i === activeIdx;
                  return (
                    <img
                      key={src}
                      src={src}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-all ease-out"
                      style={{
                        opacity: isActive ? 1 : 0,
                        // zoomStarted defers the active scale so CSS transition
                        // actually fires on the first image (not an instant snap).
                        transform: isActive && zoomStarted ? "scale(1.22)" : "scale(1.14)",
                        transitionDuration: isActive ? "5000ms, 1200ms" : "1200ms, 1200ms",
                        transitionProperty: "transform, opacity",
                        objectPosition: isMobile && mobilePositions?.[i] ? mobilePositions[i] : undefined,
                      }}
                    />
                  );
                })
              ) : (
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
              <div className="absolute inset-0 ring-1 ring-inset ring-primary/10 rounded-2xl" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Taste profile crowd — many identical person silhouettes, varying color, size,
// and opacity to express that everyone is unique. Soft drift / fade animation.
// ─────────────────────────────────────────────────────────────────────────────
const TASTE_PALETTE = [
  "#f7931e", "#e85d3a", "#c9a84c", "#e8b84a", "#f0c674",
  "#a0522d", "#e8a87c", "#c44569", "#ff8a3d", "#8b4513",
  "#d4a574", "#b87333",
];

// Deterministic pseudo-random so the layout is stable across renders.
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type CrowdCell = {
  color: string;
  opacity: number;
  scale: number;
  duration: number;
  delay: number;
};

const CROWD_CELLS: CrowdCell[] = (() => {
  const rng = mulberry32(7);
  const cells: CrowdCell[] = [];
  for (let i = 0; i < 48; i++) {
    cells.push({
      color: TASTE_PALETTE[Math.floor(rng() * TASTE_PALETTE.length)],
      opacity: 0.28 + rng() * 0.32,
      scale: 0.6 + rng() * 0.5,
      duration: 0,
      delay: 0,
    });
  }
  return cells;
})();

const PERSON_PATH =
  "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z";

// Color "distance" using simple hex RGB diff — used to pick contrasting pairs.
function hexDist(a: string, b: string) {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [r1, g1, b1] = p(a);
  const [r2, g2, b2] = p(b);
  return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
}

function TasteShapes({ ready = false }: { ready?: boolean }) {
  const [highlights, setHighlights] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!ready) return;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const sameColor = Math.random() < 0.65;
      const next = new Set<number>();
      if (sameColor) {
        // pick a color present in the grid; highlight all cells with that color
        const color =
          TASTE_PALETTE[Math.floor(Math.random() * TASTE_PALETTE.length)];
        CROWD_CELLS.forEach((c, i) => {
          if (c.color === color) next.add(i);
        });
        // ensure at least 2
        if (next.size < 2) {
          for (let i = 0; i < CROWD_CELLS.length && next.size < 3; i++) next.add(i);
        }
      } else {
        // pick 2 cells whose colors are far apart
        let best: [number, number] = [0, 1];
        let bestD = -1;
        for (let tries = 0; tries < 14; tries++) {
          const a = Math.floor(Math.random() * CROWD_CELLS.length);
          const b = Math.floor(Math.random() * CROWD_CELLS.length);
          if (a === b) continue;
          const d = hexDist(CROWD_CELLS[a].color, CROWD_CELLS[b].color);
          if (d > bestD) {
            bestD = d;
            best = [a, b];
          }
        }
        next.add(best[0]);
        next.add(best[1]);
      }
      setHighlights(next);
      timer = setTimeout(tick, 1600 + Math.random() * 1400);
    };
    // First highlight fires immediately when ready=true so the animation
    // visibly starts at the same moment ScrollClips/MomentCarousel do.
    tick();
    return () => clearTimeout(timer);
  }, [ready]);

  return (
    <div className="relative aspect-[4/3] md:aspect-[4/5] rounded-2xl overflow-hidden">
      <div
        className="absolute inset-0 grid grid-cols-6 gap-3 sm:gap-4 p-8 sm:p-10 place-items-center"
        style={{
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 55%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse at center, black 55%, transparent 100%)",
        }}
      >
        {CROWD_CELLS.map((cell, i) => {
          const on = highlights.has(i);
          return (
            <div
              key={i}
              className="flex items-center justify-center w-full aspect-square transition-all duration-500 ease-out"
              style={{
                color: cell.color,
                opacity: on ? 0.92 : cell.opacity * 0.7,
                transform: `scale(${on ? cell.scale * 1.2 : cell.scale})`,
                filter: on
                  ? `drop-shadow(0 0 6px ${cell.color}88)`
                  : "none",
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d={PERSON_PATH} />
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}


function AiTypingLine({ text, onStart, onFinish }: { text: string; onStart?: () => void; onFinish?: () => void }) {
  const ref = useRef<HTMLParagraphElement>(null);
  // Always-current refs so timer closures never capture stale callbacks.
  const onStartRef = useRef(onStart);
  const onFinishRef = useRef(onFinish);
  useEffect(() => { onStartRef.current = onStart; onFinishRef.current = onFinish; });

  const [visible, setVisible] = useState(false);
  const [started, setStarted] = useState(false);
  const [count, setCount] = useState(0);

  // IntersectionObserver on the paragraph itself — fires the moment the text
  // enters the viewport (threshold 0). Works on mobile where sections are
  // very tall and scrollend fires far too late.
  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -80px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  // Self-contained timer chain — runs once when visible flips to true:
  //   +0 ms      typing starts immediately (no sparkle pre-roll)
  //   +1 000 ms  onStart fires → illustration animations unlock (1 s after typing)
  // `visible` is never reset and the effect bails when already triggered, so
  // this only fires once per page load — refresh required to replay.
  useEffect(() => {
    if (!visible) return;
    setStarted(true);
    const t = setTimeout(() => onStartRef.current?.(), 1000);
    return () => clearTimeout(t);
  }, [visible]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const interval = 8 + Math.random() * 10;
      if (now - last >= interval) {
        i += 1;
        setCount(i);
        last = now;
      }
      if (i < text.length) raf = requestAnimationFrame(tick);
      else onFinishRef.current?.();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, text]);

  const shown = text.slice(0, count);
  const done = count >= text.length;

  // The animated content — used in both mobile and desktop renders.
  const animatedContent = (
    <>
      {!started && (
        <Sparkles className="inline-block size-5 text-primary align-[-3px] animate-sparkle-twinkle" />
      )}
      {started && (
        <>
          <span>{shown}</span>
          <span
            aria-hidden
            className="inline-block w-[2px] h-[1em] bg-primary align-[-3px] ml-[2px] animate-caret-blink"
          />
          <Sparkles
            className={`inline-block size-5 text-primary align-[-3px] ml-1 ${
              done ? "" : "animate-pulse"
            }`}
          />
        </>
      )}
    </>
  );

  return (
    // CSS grid stacks the invisible spacer and the animated <p> in the same cell
    // on mobile — the spacer reserves full text height so content below never
    // shifts. On desktop (md:block) the grid collapses and the <p> flows normally.
    <span className="grid md:block">
      {/* Invisible spacer: full text, mobile-only, reserves the eventual paragraph height */}
      <span
        aria-hidden
        className="md:hidden invisible select-none text-logo font-medium text-base leading-relaxed"
        style={{ gridArea: "1 / 1" }}
      >
        {text}
      </span>
      {/* Animated paragraph — same grid cell as spacer on mobile, normal flow on desktop */}
      <p
        ref={ref}
        className="text-logo font-medium text-base md:text-lg leading-relaxed"
        style={{ gridArea: "1 / 1" }}
      >
        {animatedContent}
      </p>
    </span>
  );
}

function About() {
  return (
    <section id="about" className="relative py-12 md:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6">Our story</p>
        <p className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.2] tracking-tight">
          Dumaré is being <span className="italic text-gradient-amber">built by Africans</span> who grew up with these stories and cultures, and believe
          <span className="italic text-gradient-amber"> African storytelling</span> deserves a smarter, more personal streaming experience.
        </p>
      </div>
    </section>
  );
}

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xkoylpjv";

// Disposable / throwaway email domains that are never real signups.
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com","guerrillamail.com","guerrillamail.net","guerrillamail.org",
  "guerrillamail.biz","guerrillamail.de","guerrillamail.info","sharklasers.com",
  "grr.la","guerrillamailblock.com","spam4.me","tempmail.com","temp-mail.org",
  "throwam.com","throwam.net","dispostable.com","yopmail.com","yopmail.fr",
  "cool.fr.nf","jetable.fr.nf","nospam.ze.tc","nomail.xl.cx","mega.zik.dj",
  "speed.1s.fr","courriel.fr.nf","moncourrier.fr.nf","monemail.fr.nf",
  "monmail.fr.nf","fakeinbox.com","mailnull.com","spamgourmet.com",
  "trashmail.com","trashmail.at","trashmail.io","trashmail.me","trashmail.net",
  "trashmail.org","trashmail.xyz","discard.email","spamfree24.org",
  "maildrop.cc","spamspot.com","spamthisplease.com","spamhereplease.com",
  "tempr.email","discard.email","mailnesia.com","mailnull.com",
  "spamgourmet.net","spamgourmet.org","0-mail.com","0815.ru","0clickemail.com",
]);

function isValidEmail(email: string): { valid: boolean; reason?: string } {
  const lower = email.trim().toLowerCase();
  const atIdx = lower.lastIndexOf("@");
  if (atIdx < 1) return { valid: false, reason: "Please enter a valid email address." };

  const username = lower.slice(0, atIdx);
  const domain   = lower.slice(atIdx + 1);

  // Reject usernames made entirely of digits (e.g. 123@...)
  if (/^\d+$/.test(username)) {
    return { valid: false, reason: "Please enter a real email address." };
  }

  // Reject very short usernames (1 char)
  if (username.length < 2) {
    return { valid: false, reason: "Please enter a valid email address." };
  }

  // Reject domains with no dot or no valid TLD
  const domainParts = domain.split(".");
  if (domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
    return { valid: false, reason: "Please enter a valid email address." };
  }

  // Reject domains made entirely of digits (e.g. @123.com)
  const domainName = domainParts[0];
  if (/^\d+$/.test(domainName)) {
    return { valid: false, reason: "Please enter a real email address." };
  }

  // Reject known disposable / throwaway providers
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { valid: false, reason: "Please use a real email address — disposable emails won't receive your invite." };
  }

  return { valid: true };
}

function Waitlist() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName || !lastName || !email || submitting) return;

    // Validate email before hitting the network
    const emailCheck = isValidEmail(email);
    if (!emailCheck.valid) {
      setError(emailCheck.reason ?? "Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          // Only include inviteCode when the user actually entered one, so
          // submissions in the Formspree inbox don't show empty fields.
          ...(inviteCode.trim() ? { inviteCode: inviteCode.trim() } : {}),
          // Formspree shows this as the email subject in your inbox.
          _subject: "New Dumaré waitlist signup",
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => null);
        setError(
          data?.errors?.[0]?.message ??
            "Something went wrong. Please try again.",
        );
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="waitlist" className="relative py-12 md:py-16 lg:py-20">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <div className="relative rounded-3xl border border-primary/20 bg-card/60 backdrop-blur-sm p-10 md:p-16 text-center overflow-hidden grain">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[400px] rounded-full bg-primary/15 blur-3xl pointer-events-none" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6">Early access</p>
            <h2 className="font-serif text-4xl md:text-6xl tracking-tight leading-[1.05]">
              Be among the <span className="italic text-gradient-amber">first</span> inside.
            </h2>
            <p className="mt-6 text-logo font-medium max-w-md mx-auto">
              We're opening Dumaré gradually. Join the free waitlist, and we'll invite you as access expands.
            </p>

            {submitted ? (
              <p className="mt-10 font-serif text-2xl text-primary italic">
                Welcome. We'll be in touch soon.
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-10 flex flex-col gap-3 max-w-md mx-auto text-left"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    maxLength={100}
                    className="px-5 py-4 rounded-full bg-background/60 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground/60 transition"
                  />
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    maxLength={100}
                    className="px-5 py-4 rounded-full bg-background/60 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground/60 transition"
                  />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  maxLength={255}
                  className="px-5 py-4 rounded-full bg-background/60 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground/60 transition"
                />
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="Invite code (optional)"
                  maxLength={50}
                  className="px-5 py-4 rounded-full bg-background/60 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground/60 transition"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 px-7 py-4 rounded-full bg-gradient-amber text-primary-foreground font-medium glow-amber hover:scale-[1.02] transition-transform whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {submitting ? "Joining…" : "Join Free Waitlist"}
                </button>
                {error && (
                  <p className="mt-2 text-sm text-red-400 text-center" role="alert">
                    {error}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/40 py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <Logo />
        <p>© {new Date().getFullYear()} Dumaré.</p>
      </div>
    </footer>
  );
}

function PageAmbience() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* warm continuous glows spread across the viewport, drifting slowly */}
      <div
        className="absolute rounded-full blur-3xl bg-primary/[0.12] animate-page-glow-a"
        style={{ width: "70vw", height: "70vw", top: "-20vw", left: "-15vw" }}
      />
      <div
        className="absolute rounded-full blur-3xl bg-primary/[0.08] animate-page-glow-b"
        style={{ width: "60vw", height: "60vw", top: "30vh", right: "-15vw" }}
      />
      <div
        className="absolute rounded-full blur-3xl bg-primary/[0.07] animate-page-glow-c"
        style={{ width: "65vw", height: "65vw", bottom: "-20vw", left: "10vw" }}
      />
      <div
        className="absolute rounded-full blur-3xl bg-primary/[0.06] animate-page-glow-a"
        style={{ width: "45vw", height: "45vw", top: "55vh", left: "30vw", animationDelay: "-8s" }}
      />
      {/* page-wide vignette + grain to unify */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 40%, oklch(0.13 0.012 60 / 0.55) 100%)",
        }}
      />
      <div className="absolute inset-0 grain opacity-[0.12]" />
    </div>
  );
}

function Landing() {
  const [tasteReady,         setTasteReady]         = useState(false);
  const [tasteDone,          setTasteDone]          = useState(false);
  const [lessSearchingReady, setLessSearchingReady] = useState(false);
  const [lessSearchingDone,  setLessSearchingDone]  = useState(false);
  const [momentReady,        setMomentReady]        = useState(false);
  const [momentDone,         setMomentDone]         = useState(false);
  const [profileReady,       setProfileReady]       = useState(false);
  const [profileDone,        setProfileDone]        = useState(false);

  // Mobile detection — used to decide which trigger each animation uses.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // On mobile: animations start only after typing finishes (Done).
  // On desktop: animations start 1 s after typing begins (Ready).
  const tasteTrigger         = isMobile ? tasteDone         : tasteReady;
  const momentTrigger        = isMobile ? momentDone        : momentReady;
  const profileTrigger       = isMobile ? profileDone       : profileReady;

  return (
    <main className="relative">
      <PageAmbience />
      <div className="relative z-10">
      <Nav />
      <Hero />

      <StorySection
        id="taste"
        snapScreen
        animationsReady={tasteTrigger}
        eyebrow="Understand your taste"
        title={<>Stories that actually <span className="italic text-gradient-amber">feel right</span> for you.</>}
        image={sceneTaste}
        images={[sceneTaste, sceneTaste2, sceneTaste3]}
        mobilePositions={["center 25%", "center center", "center center"]}
        body={
          <>
            <p>
              Maybe you love slow emotional stories.<br />
              Maybe you're drawn to unconventional filmmakers.<br />
              Or maybe lately you just want to step outside your usual taste.
            </p>
            <AiTypingLine text="Dumaré learns your preferences over time and brings you stories that fit your taste, not just what's popular." onStart={() => setTasteReady(true)} onFinish={() => setTasteDone(true)} />
          </>
        }
      />

      <StorySection
        id="less-searching"
        snapScreen
        animationsReady={lessSearchingReady}
        eyebrow="Less searching. More watching."
        title={<>Skip the homework. <span className="italic text-gradient-amber">Press play.</span></>}
        image={sceneMoment}
        media={<ScrollClips ready={lessSearchingReady} readyOnMobile={lessSearchingDone} />}
        reverse
        body={
          <>
            <p className="whitespace-pre-line">
              A movie takes time, so you want to make sure it’s worth it.{"\n"}
              You ask friends, search on social media, and read reviews.{"\n"}
              Then you look for where to watch.
            </p>
            <AiTypingLine text="Dumaré does all the work for you. Just scroll through cinematic moments and start watching instantly when something feels right, all in one place." onStart={() => setLessSearchingReady(true)} onFinish={() => setLessSearchingDone(true)} />
          </>
        }
      />

      <section id="moment" className="snap-section relative py-12 md:py-0">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-12 gap-12 lg:gap-20 items-center w-full">
          <div className="md:col-span-7">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight max-w-xl">
              Tell us the <span className="italic text-gradient-amber">moment:</span> fun movie night, or something deep at 1am.
            </h2>
            <div className="mt-6 md:mt-8 space-y-4 text-base md:text-lg font-medium text-logo leading-relaxed max-w-xl">
              <p className="whitespace-pre-line">
                Genres and rankings matter, but they're not enough.{"\n"}
                Sometimes you’re choosing for a moment, a mood, or the people watching with you.
              </p>
              <AiTypingLine text="With Dumaré, you can simply describe your mood or moment and instantly get something that fits." onStart={() => setMomentReady(true)} onFinish={() => setMomentDone(true)} />
            </div>
          </div>
          <div className="md:col-span-5">
            <MomentCarousel ready={momentTrigger} />
          </div>
        </div>
      </section>

      <StorySection
        id="profile"
        snapScreen
        animationsReady={profileTrigger}
        eyebrow="Discover through taste profiles"
        title={<>The best recommendation comes from someone who <span className="italic text-gradient-amber">thinks like you</span>, or <span className="italic text-gradient-amber">completely unlike you.</span></>}
        image={sceneTaste}
        reverse
        media={<TasteShapes ready={profileTrigger} />}
        body={
          <>
            <p className="whitespace-pre-line">
              Does this sound familiar?{"\n"}
              “We just have completely different taste in movies.”
            </p>
            <AiTypingLine text="On Dumaré, everyone has a “taste profile.” Seeing how similar your tastes are with friends is fun. Then you decide whether you want a safe choice, or something that might surprise you." onStart={() => setProfileReady(true)} onFinish={() => setProfileDone(true)} />
          </>
        }
      />

      <div className="snap-group">
        <About />
        <Waitlist />
        <Footer />
      </div>
      </div>
    </main>
  );
}
