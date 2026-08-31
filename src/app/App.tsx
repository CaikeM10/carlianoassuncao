import { useEffect, useState, useRef, type MouseEvent } from "react";
import { motion } from "motion/react";
import { ParticleAnimation } from "./components/ui/particle-animation";
import { CtaButton } from "./components/ui/cta-button";
import { WhatsappFloat } from "./WhatsappFloat.tsx";
import { ArrowDown, MapPin, Phone, Instagram, Youtube } from "lucide-react";
import { CardStack, type CardStackItem } from "./components/ui/card-stack";

const IMG_HERO = "/src/public/hero/Hero.png";

const IMG_ABOUT = "/src/public/about/sobre.png";

const IMG_CONTENT_A = "/src/public/Humanização.png";
const IMG_CONTENT_B = "/src/public/podcasts/capapodcast2.png";
const IMG_CONTENT_C = "/src/public/podcasts/capapodcast3.png";
const INSTAGRAM_URL = "https://www.instagram.com/carlianoassuncao/";
const WHATSAPP_URL =
  "https://wa.me/558899815110?text=Ol%C3%A1%2C%20Carliano.%20Encontrei%20seu%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20o%20atendimento%20psicol%C3%B3gico.%20Poderia%20me%20orientar%20sobre%20disponibilidade%20e%20funcionamento%20das%20consultas%3F";
const CONTENT_STACK: CardStackItem[] = [
  {
    id: "podcast",

    tag: "Podcast",

    title: "Conversas sobre saúde mental, autoconhecimento e bem-estar.",

    description:
      "Episódios que exploram emoções, vínculos, ansiedade, desenvolvimento pessoal e os desafios da vida contemporânea.",

    imageSrc: IMG_CONTENT_A,

    href: INSTAGRAM_URL,
  },

  {
    id: "videos",

    tag: "Vídeos",

    title: "Reflexões em vídeo sobre emoções e comportamento.",

    description:
      "Conversas e reflexões sobre saúde mental, relações humanas e os desafios que atravessam nossa vida cotidiana.",

    imageSrc: IMG_CONTENT_B,

    href: INSTAGRAM_URL,
  },

  {
    id: "reflexoes",

    tag: "Reflexões",

    title: "Conteúdos para aprofundar o autoconhecimento.",

    description:
      "Pensamentos e conteúdos sobre emoções, relações, escolhas e desenvolvimento pessoal.",

    imageSrc: IMG_CONTENT_C,

    href: INSTAGRAM_URL,
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  from?: "bottom" | "left";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function useSectionVisible(ref: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

function FadeIn({
  children,
  delay = 0,
  className = "",
  from = "bottom",
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const initial =
    from === "left" ? { opacity: 0, x: -24 } : { opacity: 0, y: 28 };
  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={visible ? { opacity: 1, x: 0, y: 0 } : initial}
      transition={{ duration: 0.75, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────
function Label({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <p
      className={`text-[10px] tracking-[0.22em] uppercase mb-5 ${light ? "text-[#9DB5A6]" : "text-[#668875]"}`}
    >
      {children}
    </p>
  );
}
function SpotlightRow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Spotlight */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -inset-px
          transition-opacity
          duration-500
        "
        style={{
          opacity: hovered ? 1 : 0,
          background: `
  radial-gradient(
    440px circle at ${position.x}px ${position.y}px,
    rgba(102,136,117,0.24),
    rgba(232,217,183,0.12) 32%,
    transparent 70%
  )
`,
        }}
      />

      {/* Conteúdo acima do efeito */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="relative overflow-x-hidden antialiased"
      style={{ fontFamily: "'DM Sans', sans-serif", color: "#1E2824" }}
    >
      {/* ── NAV ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "py-3 backdrop-blur-md" : "py-5"
        }`}
        style={{ background: scrolled ? "rgba(38,61,53,0.92)" : "transparent" }}
      >
        <div className="flex justify-between items-center px-5 md:px-14 max-w-7xl mx-auto">
          <span
            className="text-[#F7F5F0] text-sm tracking-[0.18em] uppercase"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Carliano ASSUNÇÃO.
          </span>
          <CtaButton href={WHATSAPP_URL} className="px-4 py-2 text-xs">
            Agendar
          </CtaButton>
        </div>
      </nav>
      {/* ═══════════════════════════════════════════════════════ HERO ═══ */}
      <section
        ref={heroRef}
        className="
    relative
    min-h-[620px]
    h-[100svh]
    overflow-hidden
    bg-[#263D35]
    md:min-h-[700px]
  "
      >
        {/* =====================================================
      IMAGEM
      ===================================================== */}
        {/* Desktop — imagem concentrada no lado direito */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="
      absolute
      inset-y-0
      right-0
      hidden
      w-[67%]
      overflow-hidden
      md:block
    "
        >
          <img
            src={IMG_HERO}
            alt="Carliano, psicólogo clínico"
            className="
        h-full
        w-full
        object-cover
        object-[60%_78%]
        lg:object-[60%_72%]
        xl:object-[60%_68%]
      "
          />
        </motion.div>
        {/* Mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="
      absolute
      inset-0
      overflow-hidden
      md:hidden
    "
        >
          <img
            src={IMG_HERO}
            alt="Carliano, psicólogo clínico"
            className="
        h-full
        w-full
        object-cover
        object-[58%_top]
        min-[390px]:object-[60%_top]
        min-[430px]:object-[62%_top]
      "
          />
        </motion.div>
        {/* =====================================================
      ATMOSFERA MOBILE
      ===================================================== */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(to top, #263D35 0%, rgba(38,61,53,0.94) 18%, rgba(38,61,53,0.78) 37%, rgba(0,0,0,0.16) 67%, transparent 100%)",
          }}
        />
        {/* =====================================================
      ATMOSFERA DESKTOP
      ===================================================== */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, #1E2824 0%, #263D35 22%, rgba(38,61,53,0.92) 39%, rgba(38,61,53,0.58) 54%, rgba(38,61,53,0.08) 76%, transparent 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="
      pointer-events-none
      absolute
      inset-y-0
      left-[28%]
      hidden
      w-[32%]
      md:block
    "
          style={{
            background:
              "linear-gradient(90deg, #263D35 0%, rgba(38,61,53,0.92) 30%, rgba(38,61,53,0.35) 70%, transparent 100%)",
            filter: "blur(18px)",
          }}
        />
        {/* =====================================================
      CONTEÚDO
      ===================================================== */}
        <div
          className="
      absolute
      inset-0
      flex
      flex-col
      justify-end
      px-5
      pb-[92px]
      pt-28

      min-[390px]:pb-[96px]
      min-[430px]:px-6

      md:justify-center
      md:px-14
      md:pb-0
      md:pt-0

      lg:px-16
      xl:px-20
    "
        >
          <div className="mx-auto w-full max-w-7xl">
            <div
              className="
          w-full
          max-w-[620px]
          lg:max-w-[680px]
          xl:max-w-[760px]
        "
            >
              {/* =================================================
            PILL
            ================================================= */}

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.9 }}
                className="
            mb-4
            flex
            items-center
            gap-2
            self-start

            min-[390px]:mb-5
            md:mb-7
          "
              >
                <div
                  className="
              flex
              items-center
              gap-2
              rounded-full
              border
              border-white/15
              px-3.5
              py-1.5
            "
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E8D9B7]" />

                  <span className="text-[10px] uppercase tracking-[0.18em] text-[#F7F5F0]">
                    Psicologia Clínica
                  </span>
                </div>
              </motion.div>

              {/* =================================================
            TÍTULO
            ================================================= */}

              <div
                className="
            mb-4
            overflow-hidden

            min-[390px]:mb-5
            md:mb-6
          "
              >
                {["Um espaço para", "compreender o que", "você sente."].map(
                  (line, i) => (
                    <div key={i} className="overflow-hidden">
                      <motion.h1
                        initial={{ y: 72, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          duration: 0.85,
                          delay: 1.05 + i * 0.14,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className={`
                    block
                    leading-[1.02]
                    text-[#F7F5F0]

                    min-[390px]:leading-[1.05]
                    md:leading-[1.08]

                    ${i === 2 ? "italic" : ""}
                  `}
                        style={{
                          fontFamily: "'DM Serif Display', serif",
                          fontSize: "clamp(2.15rem, 10.2vw, 5.4rem)",
                        }}
                      >
                        {line}
                      </motion.h1>
                    </div>
                  ),
                )}
              </div>

              {/* =================================================
            DESCRIÇÃO
            ================================================= */}

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.55 }}
                className="
            mb-2
            max-w-[620px]
            text-[14px]
            leading-[1.55]
            text-[#9DB5A6]

            min-[390px]:text-[15px]
            md:text-[17px]
            lg:text-[18px]
          "
              >
                Um espaço seguro para falar, compreender emoções e construir
                novos caminhos com mais clareza.
              </motion.p>

              {/* =================================================
            LOCALIZAÇÃO
            ================================================= */}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.7 }}
                className="
            mb-5
            flex
            items-start
            gap-2
            text-[12px]
            leading-[1.45]
            text-[#9DB5A6]/75

            min-[390px]:mb-6
            min-[390px]:text-[13px]

            md:mb-9
            md:items-center
            md:text-sm
          "
              >
                <MapPin
                  size={11}
                  className="mt-[3px] shrink-0 text-[#E8D9B7] md:mt-0"
                />

                <span>
                  Presencial em Poranga (CE) e Online em todo o Brasil.
                </span>
              </motion.div>

              {/* =================================================
            CTA
            ================================================= */}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 1.88 }}
              >
                <CtaButton href={WHATSAPP_URL}>
                  Agendar primeira conversa
                </CtaButton>
              </motion.div>
            </div>
          </div>
        </div>
        {/* =====================================================
      SCROLL HINT
      ===================================================== */}
        {/* =====================================================
    SCROLL HINT
    ===================================================== */}
        <motion.a
          href="#sobre"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.3 }}
          className="
    group
    absolute
    bottom-7
    left-1/2
    z-20
    flex
    -translate-x-1/2
    flex-col
    items-center
    gap-2
    text-[#F7F5F0]/60
    transition-colors
    hover:text-[#F7F5F0]
  "
          aria-label="Explorar o restante do site"
        >
          <div
            className="
      relative
      hidden
      h-8
      w-5
      rounded-full
      border
      border-current
      md:block
    "
          >
            <motion.span
              className="
        absolute
        left-1/2
        top-1.5
        h-1
        w-1
        -translate-x-1/2
        rounded-full
        bg-current
      "
              animate={{
                y: [0, 10, 0],
                opacity: [1, 0.25, 1],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          <span className="text-[9px] uppercase tracking-[0.22em] md:text-[10px]">
            Role para explorar
          </span>

          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="md:hidden"
          >
            <ArrowDown size={14} />
          </motion.div>
        </motion.a>{" "}
      </section>{" "}
      {/* ═══════════════════════════════════════════════════════ SOBRE ═══ */}
      <section className="bg-[#F7F5F0] px-5 py-20 md:py-36 md:px-14">
        <div className="max-w-7xl mx-auto">
          <div className="md:grid md:grid-cols-12 md:gap-16 md:items-center">
            {/* Text column */}
            <div className="md:col-span-7">
              <FadeIn>
                <div className="mb-7 flex justify-start">
                  <span
                    className="
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        border-[#668875]/15
        bg-[#668875]/[0.045]
        px-4
        py-2
        text-[9px]
        font-medium
        uppercase
        tracking-[0.24em]
        text-[#668875]
        backdrop-blur-sm
      "
                  >
                    <span
                      className="
          h-1.5
          w-1.5
          rounded-full
          bg-[#668875]
          shadow-[0_0_8px_rgba(102,136,117,0.25)]
        "
                    />
                    Sobre
                  </span>
                </div>
              </FadeIn>
              <FadeIn delay={0.06}>
                <h2
                  className="text-[#1E2824] mb-9 leading-[1.18]"
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "clamp(2rem, 4.5vw, 3rem)",
                  }}
                >
                  Conheça Carliano.
                </h2>
              </FadeIn>

              <FadeIn delay={0.12}>
                <div className="space-y-6 text-[#1E2824]/70 leading-[1.9] text-[0.96rem] md:text-[1.02rem]">
                  <p>
                    Sou psicólogo clínico com formação em Psicanálise e
                    Psicologia Humanista, dedicado a oferecer um espaço seguro
                    de escuta, acolhimento e reflexão.
                  </p>

                  <p>
                    Meu trabalho é acompanhar pessoas que desejam compreender
                    melhor suas emoções, atravessar momentos difíceis e
                    construir uma relação mais saudável consigo mesmas e com
                    suas histórias.
                  </p>

                  <p>
                    Acredito que cada processo é único e que a transformação
                    acontece quando existe tempo, presença e um ambiente onde a
                    fala pode surgir sem julgamentos.
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.18}>
                <div className="mt-12 flex items-center gap-4">
                  <div className="w-12 h-px bg-[#668875]" />
                  <span className="text-[#668875] text-xs uppercase tracking-[0.18em]">
                    CRP 11/XXXXX
                  </span>
                </div>
              </FadeIn>
            </div>

            {/* Photo column */}
            <div className="mt-16 md:mt-0 md:col-span-5">
              <FadeIn delay={0.1}>
                <div className="relative mx-auto max-w-sm md:max-w-none">
                  {/* Moldura externa */}
                  <div className="absolute -inset-4 rounded-[32px] border border-[#668875]/10 -z-10" />

                  {/* Bloco da foto */}
                  <div className="relative overflow-hidden rounded-3xl border border-[#668875]/10 bg-white shadow-[0_30px_80px_rgba(30,40,36,0.12)]">
                    <img
                      src={IMG_ABOUT}
                      alt="Carliano em atendimento"
                      className="
                  w-full
                  aspect-[4/5]
                  object-cover
                  object-center
                  transition-transform
                  duration-700
                  hover:scale-[1.03]
                "
                    />

                    {/* Gradiente sutil */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(30,40,36,0.08), transparent 45%)",
                      }}
                    />
                  </div>

                  {/* Elementos decorativos */}
                  <div
                    className="absolute -bottom-5 -left-5 w-24 h-24 rounded-2xl -z-10"
                    style={{
                      background: "#E8D9B7",
                      opacity: 0.9,
                    }}
                  />

                  <div
                    className="absolute -top-5 -right-5 w-14 h-14 rounded-xl -z-10"
                    style={{
                      background: "#9DB5A6",
                      opacity: 0.35,
                    }}
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
      {/* ══════════════════════════════════════════════════ MANIFESTO ═══ */}
      <section
        className="
    relative
    overflow-hidden
    px-5
    py-28
    md:py-48
    flex
    items-center
    justify-center
  "
        style={{ background: "#263D35" }}
      >
        {/* ═══════════════════════════════════════════════
      BOLHAS DECORATIVAS DE FUNDO
  ═══════════════════════════════════════════════ */}

        {/* Bolha principal */}
        <div
          aria-hidden="true"
          className="
      pointer-events-none
      absolute
      left-1/2
      top-1/2
      h-[430px]
      w-[430px]
      -translate-x-1/2
      -translate-y-1/2
      rounded-full
      border
      border-[#E8D9B7]/10
      md:h-[650px]
      md:w-[650px]
    "
        />

        {/* Segunda bolha */}
        <div
          aria-hidden="true"
          className="
      pointer-events-none
      absolute
      left-1/2
      top-1/2
      h-[340px]
      w-[340px]
      -translate-x-1/2
      -translate-y-1/2
      rounded-full
      border
      border-[#9DB5A6]/[0.07]
      md:h-[520px]
      md:w-[520px]
    "
        />

        {/* Glow central */}
        <div
          aria-hidden="true"
          className="
      pointer-events-none
      absolute
      left-1/2
      top-1/2
      h-[320px]
      w-[320px]
      -translate-x-1/2
      -translate-y-1/2
      rounded-full
      blur-3xl
      md:h-[500px]
      md:w-[500px]
    "
          style={{
            background:
              "radial-gradient(circle, rgba(157,181,166,0.055) 0%, transparent 70%)",
          }}
        />

        {/* ═══════════════════════════════════════════════
      CONTEÚDO
  ═══════════════════════════════════════════════ */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* BADGE MANIFESTO */}
          <FadeIn>
            <div className="mb-8 flex justify-center">
              <span
                className="
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-white/10
            bg-white/[0.045]
            px-4
            py-2
            text-[9px]
            font-medium
            uppercase
            tracking-[0.24em]
            text-[#9DB5A6]
            backdrop-blur-md
            shadow-[0_8px_30px_rgba(0,0,0,0.04)]
          "
              >
                <span
                  className="
              h-1.5
              w-1.5
              rounded-full
              bg-[#E8D9B7]
              shadow-[0_0_8px_rgba(232,217,183,0.35)]
            "
                />
                Manifesto
              </span>
            </div>
          </FadeIn>

          {/* FRASE PRINCIPAL */}
          <FadeIn delay={0.1}>
            <blockquote
              className="
          text-[#F7F5F0]
          leading-[1.25]
        "
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(1.75rem, 5vw, 3.2rem)",
              }}
            >
              "Cada história merece ser escutada
              <br className="hidden md:block" /> no seu próprio tempo."
            </blockquote>
          </FadeIn>

          {/* TEXTO DE APOIO */}
          <FadeIn delay={0.16}>
            <p
              className="
          mx-auto
          mt-8
          max-w-2xl
          text-sm
          md:text-base
          leading-[1.8]
          text-[#9DB5A6]
        "
            >
              Acredito que o cuidado começa quando alguém encontra um espaço
              seguro para falar, sentir e compreender a própria trajetória.
            </p>
          </FadeIn>

          {/* LINHA AUTORAL */}
          <FadeIn delay={0.22}>
            <div className="mt-12 flex items-center justify-center gap-4">
              <div className="h-px w-8 bg-[#668875]/30" />

              <div className="h-1 w-1 rounded-full bg-[#E8D9B7]/60" />

              <div className="h-px w-8 bg-[#668875]/30" />
            </div>
          </FadeIn>

          {/* ═══════════════════════════════════════════
        ASSINATURA
    ═══════════════════════════════════════════ */}
          <FadeIn delay={0.28}>
            <div className="mt-6">
              <p
                className="
            text-[#E8D9B7]
            italic
            leading-none
          "
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                  fontWeight: 500,
                }}
              >
                Carliano Assunção
              </p>

              <p
                className="
            mt-3
            text-[10px]
            md:text-[11px]
            uppercase
            tracking-[0.22em]
            text-[#9DB5A6]/70
          "
              >
                Psicólogo Clínico
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
      {/* ══════════════════════════════════════════ ÁREAS DE ATUAÇÃO ═══ */}
      <section className="bg-[#F7F5F0] px-5 py-20 md:py-36 md:px-14">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:flex md:justify-between md:items-end">
            <div>
              {/* BADGE / ESPECIALIDADES */}
              <FadeIn>
                <div className="mb-7 flex justify-start">
                  <span
                    className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[#668875]/15
                bg-[#668875]/[0.045]
                px-4
                py-2
                text-[9px]
                font-medium
                uppercase
                tracking-[0.24em]
                text-[#668875]
                backdrop-blur-sm
              "
                  >
                    <span
                      className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#668875]
                  shadow-[0_0_8px_rgba(102,136,117,0.25)]
                "
                    />
                    Especialidades
                  </span>
                </div>
              </FadeIn>

              <FadeIn delay={0.06}>
                <h2
                  className="text-[#1E2824]"
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                  }}
                >
                  Áreas de atuação.
                </h2>
              </FadeIn>

              <FadeIn delay={0.1}>
                <p className="mt-5 max-w-xl text-[#1E2824]/60 leading-relaxed">
                  Atendimento voltado para pessoas que desejam compreender
                  melhor suas emoções, fortalecer sua saúde mental e construir
                  relações mais saudáveis consigo mesmas e com os outros.
                </p>
              </FadeIn>
            </div>
          </div>

          {/* ═══════════════════════════════════════
        ESPECIALIDADES + SPOTLIGHT
    ═══════════════════════════════════════ */}
          <div>
            {[
              {
                num: "01",
                title: "Ansiedade",
                desc: "Para quem convive com pensamentos acelerados, preocupação constante, tensão emocional ou dificuldade de encontrar tranquilidade no dia a dia.",
              },
              {
                num: "02",
                title: "Autoconhecimento",
                desc: "Um processo de aproximação consigo mesmo, compreendendo emoções, padrões de comportamento e aspectos importantes da própria história.",
              },
              {
                num: "03",
                title: "Saúde Mental",
                desc: "Cuidado psicológico voltado ao equilíbrio emocional, prevenção do sofrimento psíquico e promoção de bem-estar e qualidade de vida.",
              },
              {
                num: "04",
                title: "Relacionamentos",
                desc: "Reflexão sobre vínculos afetivos, dificuldades de comunicação, limites, autoestima e construção de relações mais saudáveis.",
              },
              {
                num: "05",
                title: "Desenvolvimento Pessoal",
                desc: "Para quem busca mais clareza, maturidade emocional, autoconfiança e sentido em diferentes áreas da vida.",
              },
            ].map((area, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <SpotlightRow
                  className="
              group
              -mx-5
              border-t
              border-[#1E2824]/8
              transition-all
              duration-500
              hover:bg-white/25
            "
                >
                  <div
                    className="
                relative
                flex
                items-start
                gap-5
                px-5
                py-8
                md:gap-12
                md:py-10
              "
                  >
                    {/* Número */}
                    <span
                      className="
                  mt-1.5
                  w-8
                  shrink-0
                  select-none
                  text-[11px]
                  tracking-[0.2em]
                  text-[#668875]
                  transition-all
                  duration-300
                  group-hover:text-[#4F755E]
                "
                    >
                      {area.num}
                    </span>

                    {/* Conteúdo */}
                    <div className="flex-1 md:grid md:grid-cols-12 md:items-start md:gap-10">
                      <h3
                        className="
                    mb-3
                    text-[#1E2824]
                    transition-all
                    duration-300
                    group-hover:translate-x-1
                    md:col-span-4
                    md:mb-0
                  "
                        style={{
                          fontFamily: "'DM Serif Display', serif",
                          fontSize: "clamp(1.15rem, 2.5vw, 1.55rem)",
                        }}
                      >
                        {area.title}
                      </h3>

                      <p
                        className="
                    text-sm
                    leading-relaxed
                    text-[#1E2824]/60
                    transition-colors
                    duration-300
                    group-hover:text-[#1E2824]/70
                    md:col-span-8
                    md:text-base
                  "
                      >
                        {area.desc}
                      </p>
                    </div>

                    {/* Pequeno detalhe lateral */}
                    <div
                      aria-hidden="true"
                      className="
                  absolute
                  right-5
                  top-1/2
                  h-1.5
                  w-1.5
                  -translate-y-1/2
                  rounded-full
                  bg-[#668875]
                  opacity-0
                  transition-all
                  duration-300
                  group-hover:opacity-40
                "
                    />
                  </div>
                </SpotlightRow>
              </FadeIn>
            ))}

            <div className="border-t border-[#1E2824]/8" />
          </div>

          {/* ═══════════════════════════════════════
        FECHAMENTO
    ═══════════════════════════════════════ */}
          <FadeIn delay={0.25}>
            <div className="mt-24 text-center max-w-3xl mx-auto">
              <p
                className="text-[#1E2824]"
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(1.4rem, 3vw, 2rem)",
                  lineHeight: 1.4,
                }}
              >
                Cada pessoa chega com uma história única.
              </p>

              <p className="mt-5 text-[#1E2824]/60 leading-relaxed">
                Independentemente da sua demanda, o processo terapêutico será
                construído respeitando seu tempo, sua singularidade e aquilo que
                faz sentido para sua trajetória.
              </p>

              {/* CTA */}
              <div className="mt-12 md:mt-14">
                <CtaButton href={WHATSAPP_URL}>Agendar atendimento</CtaButton>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>{" "}
      {/* ═══════════════════════════════════════════════ EXPERIÊNCIA ═══ */}
      <section
        className="px-5 py-20 md:py-36 md:px-14"
        style={{ background: "#263D35" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* CABEÇALHO */}
          <div className="mb-16">
            {/* BADGE / TRAJETÓRIA */}
            <FadeIn>
              <div className="mb-7 flex justify-start">
                <span
                  className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-white/10
              bg-white/[0.045]
              px-4
              py-2
              text-[9px]
              font-medium
              uppercase
              tracking-[0.24em]
              text-[#9DB5A6]
              backdrop-blur-md
            "
                >
                  <span
                    className="
                h-1.5
                w-1.5
                rounded-full
                bg-[#E8D9B7]
                shadow-[0_0_8px_rgba(232,217,183,0.3)]
              "
                  />
                  Trajetória
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.06}>
              <h2
                className="text-[#F7F5F0]"
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                }}
              >
                Experiência.
              </h2>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="mt-5 max-w-2xl text-[#9DB5A6]/80 leading-relaxed">
                Uma trajetória construída entre formação clínica, prática
                profissional, produção de conteúdo e diálogo com diferentes
                públicos.
              </p>
            </FadeIn>
          </div>

          {/* TIMELINE */}
          <div className="relative">
            {[
              {
                year: "2018",
                label: "Graduação",
                text: "Bacharelado em Psicologia pela Universidade Regional do Cariri — URCA, com formação generalista e ênfase em Psicologia Clínica.",
              },
              {
                year: "2020",
                label: "Pós-graduação",
                text: "Especialização em Psicanálise Clínica e Saúde Mental, com abordagem centrada no sujeito e na escuta singular.",
              },
              {
                year: "2021",
                label: "Clínica Privada",
                text: "Início da prática clínica privada com atendimentos presenciais em Poranga, CE, e online para todo o Brasil.",
              },
              {
                year: "2022",
                label: "Conteúdo",
                text: "Produção contínua de conteúdo sobre saúde mental em podcasts, redes sociais e plataformas digitais.",
              },
              {
                year: "2023",
                label: "Palestras",
                text: "Ciclo de palestras em instituições educacionais e organizações sobre autoconhecimento, ansiedade e bem-estar psicológico.",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div
                  className="
              group
              relative
              flex
              gap-6
              border-t
              border-[#E8D9B7]/15
              py-7
              md:gap-12
              md:py-8
              transition-all
              duration-500
              ease-out
              transform-gpu
              hover:-translate-y-1
              hover:translate-x-1
              hover:scale-[1.008]
              hover:bg-white/[0.025]
              hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]
            "
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* ANO */}
                  <span
                    className="
                mt-1
                w-10
                shrink-0
                select-none
                text-[10px]
                tracking-[0.18em]
                text-[#E8D9B7]/70
                transition-all
                duration-300
                group-hover:text-[#E8D9B7]
              "
                  >
                    {item.year}
                  </span>

                  {/* CONTEÚDO */}
                  <div className="flex-1 md:grid md:grid-cols-12 md:gap-10 md:items-baseline">
                    <span
                      className="
                  mb-2
                  block
                  text-[10px]
                  uppercase
                  tracking-[0.16em]
                  text-[#E8D9B7]
                  md:col-span-3
                  md:mb-0
                  transition-all
                  duration-300
                  group-hover:translate-x-1
                "
                    >
                      {item.label}
                    </span>

                    <p
                      className="
                  text-sm
                  leading-relaxed
                  text-[#F7F5F0]/65
                  md:col-span-9
                  md:text-base
                  transition-colors
                  duration-300
                  group-hover:text-[#F7F5F0]/80
                "
                    >
                      {item.text}
                    </p>
                  </div>

                  {/* BRILHO SUTIL NO HOVER */}
                  <div
                    aria-hidden="true"
                    className="
                pointer-events-none
                absolute
                inset-0
                opacity-0
                transition-opacity
                duration-500
                group-hover:opacity-100
              "
                    style={{
                      background:
                        "linear-gradient(100deg, rgba(232,217,183,0.025), transparent 35%, transparent 70%, rgba(157,181,166,0.025))",
                    }}
                  />
                </div>
              </FadeIn>
            ))}

            {/* Linha final */}
            <div className="border-t border-[#E8D9B7]/15" />
          </div>
        </div>
      </section>{" "}
      {/* ═══════════════════════════════════════════ COMO FUNCIONA ═══ */}
      <section className="bg-[#F7F5F0] px-5 py-20 md:py-36 md:px-14">
        <div className="max-w-7xl mx-auto">
          {/* CABEÇALHO */}
          <div className="mb-16">
            <FadeIn>
              <div className="mb-7 flex justify-start">
                <span
                  className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#668875]/15
              bg-[#668875]/[0.045]
              px-4
              py-2
              text-[9px]
              font-medium
              uppercase
              tracking-[0.24em]
              text-[#668875]
              backdrop-blur-sm
            "
                >
                  <span
                    className="
                h-1.5
                w-1.5
                rounded-full
                bg-[#668875]
                shadow-[0_0_8px_rgba(102,136,117,0.25)]
              "
                  />
                  Processo
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.06}>
              <h2
                className="text-[#1E2824]"
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                }}
              >
                Como funciona.
              </h2>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="mt-5 max-w-2xl text-[#1E2824]/60 leading-relaxed">
                Um processo construído com calma, clareza e respeito ao seu
                tempo — desde o primeiro contato até o acompanhamento
                terapêutico.
              </p>
            </FadeIn>
          </div>

          {/* ETAPAS */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {[
              {
                step: "01",
                title: "Primeiro contato",
                desc: "Você me envia uma mensagem e conversamos brevemente sobre o que te trouxe até aqui.",
              },
              {
                step: "02",
                title: "Conversa inicial",
                desc: "Fazemos uma sessão de acolhimento para nos conhecermos e alinhar expectativas e objetivos.",
              },
              {
                step: "03",
                title: "Construção do acompanhamento",
                desc: "Juntos definimos a frequência, o formato e o foco do processo terapêutico.",
              },
              {
                step: "04",
                title: "Processo terapêutico",
                desc: "Sessões regulares de escuta, reflexão e trabalho consistente no seu desenvolvimento.",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={0.08 + i * 0.12}>
                <div
                  className="
              group
              relative
              h-full
              rounded-[24px]
              border
              border-[#263D35]/8
              bg-white/45
              p-6
              md:p-7
              backdrop-blur-sm
              transition-all
              duration-500
              ease-out
              hover:-translate-y-1
              hover:bg-white/70
              hover:shadow-[0_18px_45px_rgba(30,40,36,0.06)]
            "
                >
                  {/* NÚMERO */}
                  <div
                    className="
                mb-7
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-xl
                border
                border-[#668875]/20
                bg-[#668875]/[0.08]
                transition-all
                duration-500
                group-hover:border-[#668875]/35
                group-hover:bg-[#668875]/[0.12]
                group-hover:scale-[1.04]
              "
                  >
                    <span
                      className="
                  text-[#587766]
                  text-sm
                  font-medium
                  tracking-[0.18em]
                "
                    >
                      {item.step}
                    </span>
                  </div>

                  {/* CONTEÚDO */}
                  <h3
                    className="
                mb-3
                text-[#1E2824]
                leading-snug
              "
                    style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: "1.2rem",
                    }}
                  >
                    {item.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-[#1E2824]/55">
                    {item.desc}
                  </p>

                  {/* DETALHE DECORATIVO */}
                  <div
                    aria-hidden="true"
                    className="
                pointer-events-none
                absolute
                bottom-0
                left-6
                h-px
                w-0
                bg-[#668875]/35
                transition-all
                duration-500
                group-hover:w-16
              "
                  />
                </div>
              </FadeIn>
            ))}
          </div>

          {/* CTA FINAL */}
          <FadeIn delay={0.62}>
            <div className="mt-16 flex flex-col items-center text-center md:mt-20">
              <p
                className="max-w-xl text-[#1E2824]"
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(1.3rem, 2.8vw, 1.8rem)",
                  lineHeight: 1.4,
                }}
              >
                O primeiro passo pode ser mais simples do que parece.
              </p>

              <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#1E2824]/55 md:text-base">
                Se fizer sentido para você, podemos começar com uma conversa
                inicial.
              </p>

              <CtaButton href={WHATSAPP_URL} className="mt-10">
                Comece por aqui
              </CtaButton>
            </div>
          </FadeIn>
        </div>
      </section>{" "}
      {/* ═══════════════════════════════════════════════ CONTEÚDO ═══ */}
      <section
        className="
    relative
    overflow-hidden
    px-5
    py-24
    md:px-14
    md:py-40
  "
        style={{
          background: "#263D35",
        }}
      >
        {/* ═══════════════════════════════════════════════
      PARTICLE ANIMATION
  ═══════════════════════════════════════════════ */}
        <div
          aria-hidden="true"
          className="
    pointer-events-none
    absolute
    inset-x-0
    -top-8
    h-[340px]
    overflow-hidden
    opacity-35
    md:-top-12
    md:h-[560px]
    md:opacity-45
  "
        >
          <ParticleAnimation />

          <div
            className="
      pointer-events-none
      absolute
      inset-0
      bg-gradient-to-b
      from-transparent
      via-[#263D35]/20
      to-[#263D35]/85
    "
          />
        </div>

        {/* Glow */}
        <div
          aria-hidden="true"
          className="
      pointer-events-none
      absolute
      left-1/2
      top-0
      h-[420px]
      w-[90%]
      max-w-[900px]
      -translate-x-1/2
      rounded-full
      blur-3xl
      opacity-30
      md:h-[520px]
    "
          style={{
            background:
              "radial-gradient(circle, rgba(157,181,166,0.07) 0%, rgba(102,136,117,0.02) 45%, transparent 72%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl">
          {/* ═══════════════════════════════════════
        CABEÇALHO
    ═══════════════════════════════════════ */}

          <div
            className="
        mb-12
        flex
        flex-col
        gap-8
        md:mb-16
        md:flex-row
        md:items-end
        md:justify-between
      "
          >
            <div className="max-w-4xl">
              {/* Badge */}
              <FadeIn>
                <div className="mb-7 flex justify-start">
                  <span
                    className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-white/10
                bg-white/[0.045]
                px-4
                py-2
                text-[9px]
                font-medium
                uppercase
                tracking-[0.24em]
                text-[#9DB5A6]
                backdrop-blur-md
              "
                  >
                    <span
                      className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#E8D9B7]
                  shadow-[0_0_8px_rgba(232,217,183,0.3)]
                "
                    />
                    Conteúdo
                  </span>
                </div>
              </FadeIn>

              <FadeIn delay={0.05}>
                <h2
                  className="text-[#F7F5F0]"
                  style={{
                    fontFamily: "'DM Serif Display', serif",

                    fontSize: "clamp(2rem, 5vw, 4rem)",

                    lineHeight: 1.1,
                  }}
                >
                  Reflexões sobre a mente,
                  <br />
                  emoções e relações humanas.
                </h2>
              </FadeIn>

              <FadeIn delay={0.09}>
                <p
                  className="
              mt-6
              max-w-2xl
              text-sm
              leading-[1.8]
              text-[#9DB5A6]/80
              md:text-base
            "
                >
                  Conteúdos que ampliam a conversa para além do consultório,
                  aproximando temas da psicologia da vida cotidiana.
                </p>
              </FadeIn>
            </div>

            {/* CTA superior */}
            <FadeIn delay={0.1}>
              <CtaButton
                href={INSTAGRAM_URL}
                className="hidden shrink-0 px-5 py-3 text-xs uppercase tracking-[0.12em] md:inline-flex"
              >
                <Instagram size={15} />
                Veja mais conteúdos
              </CtaButton>
            </FadeIn>
          </div>

          {/* ═══════════════════════════════════════
        CARD STACK 3D
    ═══════════════════════════════════════ */}

          <FadeIn delay={0.15}>
            <div
              className="
          relative
          mx-auto
          w-full
          max-w-6xl
        "
            >
              <CardStack
                items={CONTENT_STACK}
                initialIndex={0}
                maxVisible={3}
                cardWidth={720}
                cardHeight={470}
                overlap={0.66}
                spreadDeg={24}
                perspectivePx={1400}
                depthPx={90}
                tiltXDeg={7}
                activeLiftPx={26}
                activeScale={1.02}
                inactiveScale={0.88}
                springStiffness={190}
                springDamping={24}
                autoAdvance
                intervalMs={3600}
                pauseOnHover
                showDots
              />
            </div>
          </FadeIn>

          {/* Instrução sutil */}
          <FadeIn delay={0.2}>
            <p
              className="
          mx-auto
          mt-5
          max-w-md
          text-center
          text-[10px]
          tracking-[0.08em]
          text-[#9DB5A6]/45
          md:text-xs
        "
            >
              Arraste ou selecione um conteúdo para explorar
            </p>
          </FadeIn>

          {/* CTA mobile */}
          <FadeIn delay={0.22}>
            <div
              className="
          mt-10
          flex
          justify-center
          md:hidden
        "
            >
              <CtaButton
                href={INSTAGRAM_URL}
                className="px-5 py-3 text-xs uppercase tracking-[0.12em]"
              >
                <Instagram size={15} />
                Veja mais conteúdos
              </CtaButton>
            </div>
          </FadeIn>
        </div>
      </section>{" "}
      {/* ═════════════════════════════════════════ MODALIDADES DE ATENDIMENTO ═══ */}
      <section
        id="contato"
        className="bg-[#F7F5F0] px-5 py-24 md:px-14 md:py-40"
      >
        <div className="mx-auto max-w-7xl">
          {/* CABEÇALHO */}
          <div className="mb-16 max-w-3xl md:mb-20">
            <FadeIn>
              <div className="mb-7 flex justify-start">
                <span
                  className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#668875]/15
              bg-[#668875]/[0.045]
              px-4
              py-2
              text-[9px]
              font-medium
              uppercase
              tracking-[0.24em]
              text-[#668875]
              backdrop-blur-sm
            "
                >
                  <span
                    className="
                h-1.5
                w-1.5
                rounded-full
                bg-[#668875]
                shadow-[0_0_8px_rgba(102,136,117,0.25)]
              "
                  />
                  Modalidades
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.06}>
              <h2
                className="mb-6 text-[#1E2824]"
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(2rem, 5vw, 3.2rem)",
                  lineHeight: "1.1",
                }}
              >
                Atendimento pensado para a sua realidade.
              </h2>
            </FadeIn>

            <FadeIn delay={0.12}>
              <p className="max-w-2xl text-base leading-relaxed text-[#1E2824]/65 md:text-lg">
                Escolha a modalidade que melhor se adapta à sua rotina. O
                cuidado, a escuta e o compromisso com o processo terapêutico
                permanecem os mesmos em qualquer formato.
              </p>
            </FadeIn>
          </div>

          {/* CARDS */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* ═══════════════ PRESENCIAL ═══════════════ */}
            <FadeIn>
              <div
                className="
            group
            flex
            h-full
            flex-col
            rounded-[32px]
            border
            border-[#1E2824]/[0.06]
            bg-white
            p-7
            transition-all
            duration-500
            hover:-translate-y-1
            hover:shadow-[0_25px_60px_rgba(30,40,36,0.07)]
            md:p-10
          "
              >
                {/* MODALIDADE */}
                <div className="mb-8 flex items-center gap-3">
                  <div
                    className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                border
                border-[#C94B4B]/10
                bg-[#C94B4B]/[0.07]
                text-[#C94B4B]
              "
                  >
                    <MapPin size={18} />
                  </div>

                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#668875]">
                    Presencial
                  </span>
                </div>

                <h3
                  className="mb-4 text-[#1E2824]"
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "clamp(1.7rem, 3vw, 2rem)",
                  }}
                >
                  Em Poranga, Ceará.
                </h3>

                <p className="mb-8 leading-relaxed text-[#1E2824]/65">
                  Um ambiente reservado, acolhedor e preparado para que você se
                  sinta confortável desde o primeiro encontro.
                </p>

                {/* CHECKLIST */}
                <div className="mb-10 space-y-4">
                  {[
                    "Ambiente acolhedor",
                    "Atendimento individual",
                    "Privacidade e conforto",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-[#1E2824]/70 md:text-base"
                    >
                      <span
                        className="
                    flex
                    h-6
                    w-6
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#668875]/15
                    bg-[#668875]/10
                    text-[11px]
                    font-bold
                    text-[#4F755E]
                  "
                      >
                        ✓
                      </span>

                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-auto pt-2">
                  <CtaButton href={WHATSAPP_URL} className="px-6">
                    Agendar atendimento
                  </CtaButton>
                </div>
              </div>
            </FadeIn>

            {/* ═══════════════ ONLINE ═══════════════ */}
            <FadeIn delay={0.08}>
              <div
                className="
            group
            flex
            h-full
            flex-col
            rounded-[32px]
            border
            border-[#1E2824]/[0.06]
            bg-white
            p-7
            transition-all
            duration-500
            hover:-translate-y-1
            hover:shadow-[0_25px_60px_rgba(30,40,36,0.07)]
            md:p-10
          "
              >
                <div className="mb-8 flex items-center gap-3">
                  <div
                    className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                border
                border-[#668875]/10
                bg-[#668875]/[0.08]
                text-[#587766]
              "
                  >
                    <Phone size={18} />
                  </div>

                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#668875]">
                    Online
                  </span>
                </div>

                <h3
                  className="mb-4 text-[#1E2824]"
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "clamp(1.7rem, 3vw, 2rem)",
                  }}
                >
                  Para todo o Brasil.
                </h3>

                <p className="mb-8 leading-relaxed text-[#1E2824]/65">
                  Atendimento por videochamada com a mesma qualidade de escuta,
                  acolhimento e acompanhamento clínico do formato presencial.
                </p>

                {/* CHECKLIST */}
                <div className="mb-10 space-y-4">
                  {[
                    "Atendimento seguro",
                    "Flexibilidade de horários",
                    "Para qualquer cidade do Brasil",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-[#1E2824]/70 md:text-base"
                    >
                      <span
                        className="
                    flex
                    h-6
                    w-6
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#668875]/15
                    bg-[#668875]/10
                    text-[11px]
                    font-bold
                    text-[#4F755E]
                  "
                      >
                        ✓
                      </span>

                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-auto pt-2">
                  <CtaButton href={WHATSAPP_URL} className="px-6">
                    Agendar atendimento
                  </CtaButton>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* ═══════════════════════════════════════════════
        LOCALIZAÇÃO / MAPA
    ═══════════════════════════════════════════════ */}
          <FadeIn delay={0.16}>
            <div className="mt-14 overflow-hidden rounded-[32px] border border-[#1E2824]/[0.06] bg-white md:mt-20">
              <div className="grid md:grid-cols-[0.75fr_1.25fr]">
                {/* INFO */}
                <div className="flex flex-col justify-center p-7 md:p-10 lg:p-12">
                  <div className="mb-5 flex items-center gap-3">
                    <span
                      className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-[#C94B4B]/[0.08]
                  text-[#C94B4B]
                "
                    >
                      <MapPin size={16} />
                    </span>

                    <span className="text-[9px] uppercase tracking-[0.22em] text-[#668875]">
                      Localização
                    </span>
                  </div>

                  <h3
                    className="text-[#1E2824]"
                    style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: "clamp(1.5rem, 3vw, 2rem)",
                    }}
                  >
                    Atendimento presencial em Poranga.
                  </h3>

                  <p className="mt-4 max-w-md text-sm leading-relaxed text-[#1E2824]/60 md:text-base">
                    Consulte a localização no mapa e, ao agendar, receba todas
                    as orientações necessárias para chegar ao consultório.
                  </p>
                </div>

                {/* MAPA */}
                <div className="relative min-h-[320px] overflow-hidden md:min-h-[390px]">
                  <iframe
                    title="Localização do atendimento em Poranga, Ceará"
                    src="https://www.google.com/maps?q=Poranga%20Cear%C3%A1&output=embed"
                    width="100%"
                    height="100%"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 h-full w-full border-0"
                  />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
      {/* ══════════════════════════════════════════════ CTA FINAL ═══ */}
      <section
        className="
    relative
    overflow-hidden
    px-5
    py-28
    md:py-48
  "
        style={{ background: "#263D35" }}
      >
        {/* Elementos atmosféricos */}
        <div
          aria-hidden="true"
          className="
      pointer-events-none
      absolute
      left-1/2
      top-1/2
      h-[420px]
      w-[420px]
      -translate-x-1/2
      -translate-y-1/2
      rounded-full
      border
      border-[#E8D9B7]/[0.07]
      md:h-[650px]
      md:w-[650px]
    "
        />

        <div
          aria-hidden="true"
          className="
      pointer-events-none
      absolute
      left-1/2
      top-1/2
      h-[290px]
      w-[290px]
      -translate-x-1/2
      -translate-y-1/2
      rounded-full
      border
      border-[#9DB5A6]/[0.05]
      md:h-[480px]
      md:w-[480px]
    "
        />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <FadeIn>
            <div className="mb-7 flex justify-center">
              <span
                className="
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-white/10
            bg-white/[0.04]
            px-4
            py-2
            text-[9px]
            uppercase
            tracking-[0.22em]
            text-[#9DB5A6]
            backdrop-blur-sm
          "
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#E8D9B7]" />
                Primeiro passo
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.06}>
            <h2
              className="mb-7 leading-[1.18] text-[#F7F5F0]"
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(2rem, 5vw, 3.4rem)",
              }}
            >
              Talvez esse seja o
              <br />
              <em>momento de começar.</em>
            </h2>
          </FadeIn>

          <FadeIn delay={0.12}>
            <p className="mx-auto mb-11 max-w-xl text-base leading-relaxed text-[#9DB5A6] md:text-lg">
              Dar o primeiro passo pode ser um ato importante de cuidado. Se
              fizer sentido para você, podemos começar com uma conversa.
            </p>
          </FadeIn>

          <FadeIn delay={0.18}>
            <CtaButton href={WHATSAPP_URL} className="px-9 py-4">
              Agendar atendimento
            </CtaButton>
          </FadeIn>
        </div>
      </section>
      {/* ════════════════════════════════════════════════════ FOOTER PREMIUM ═══ */}
      <footer
        className="px-5 pb-28 pt-16 md:px-14 md:pb-10 md:pt-20"
        style={{ background: "#1E2824" }}
      >
        <div className="mx-auto max-w-7xl">
          {/* BLOCO PRINCIPAL */}
          <div className="grid gap-12 pb-14 md:grid-cols-12 md:gap-10">
            {/* IDENTIDADE */}
            <div className="md:col-span-5">
              <p
                className="text-[#F7F5F0]"
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(1.6rem, 3vw, 2rem)",
                }}
              >
                Carliano Assunção
              </p>

              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#668875]">
                Psicólogo Clínico · CRP 11/XXXXX
              </p>

              <p className="mt-6 max-w-sm text-sm leading-[1.8] text-[#F7F5F0]/45">
                Psicoterapia pautada na escuta, no acolhimento e no respeito à
                singularidade de cada história.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <span
                  className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-white/[0.07]
              bg-white/[0.025]
              px-3.5
              py-2
              text-[10px]
              text-[#9DB5A6]
            "
                >
                  <MapPin size={12} className="text-[#C96A61]" />
                  Poranga, Ceará
                </span>

                <span
                  className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-white/[0.07]
              bg-white/[0.025]
              px-3.5
              py-2
              text-[10px]
              text-[#9DB5A6]
            "
                >
                  <Phone size={12} />
                  Online em todo o Brasil
                </span>
              </div>
            </div>

            {/* NAVEGAÇÃO */}
            <div className="md:col-span-2 md:col-start-7">
              <p className="mb-5 text-[9px] uppercase tracking-[0.22em] text-[#E8D9B7]/70">
                Navegação
              </p>

              <nav className="flex flex-col items-start gap-3 text-sm text-[#F7F5F0]/50">
                <a
                  href="#inicio"
                  className="transition-colors hover:text-[#F7F5F0]"
                >
                  Início
                </a>

                <a
                  href="#sobre"
                  className="transition-colors hover:text-[#F7F5F0]"
                >
                  Sobre
                </a>

                <a
                  href="#contato"
                  className="transition-colors hover:text-[#F7F5F0]"
                >
                  Atendimento
                </a>
              </nav>
            </div>

            {/* CONTATO */}
            <div className="md:col-span-2">
              <p className="mb-5 text-[9px] uppercase tracking-[0.22em] text-[#E8D9B7]/70">
                Contato
              </p>

              <div className="flex flex-col items-start gap-3 text-sm text-[#F7F5F0]/50">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[#F7F5F0]"
                >
                  WhatsApp
                </a>

                <a
                  href="mailto:contato@carliano.com.br"
                  className="transition-colors hover:text-[#F7F5F0]"
                >
                  E-mail
                </a>
              </div>
            </div>

            {/* REDES */}
            <div className="md:col-span-2">
              <p className="mb-5 text-[9px] uppercase tracking-[0.22em] text-[#E8D9B7]/70">
                Acompanhe
              </p>

              <div className="flex flex-col items-start gap-3 text-sm text-[#F7F5F0]/50">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
              group
              inline-flex
              items-center
              gap-2
              transition-colors
              hover:text-[#F7F5F0]
            "
                >
                  <Instagram
                    size={14}
                    className="transition-transform group-hover:scale-110"
                  />
                  Instagram
                </a>
              </div>
            </div>
          </div>

          {/* DIVISOR */}
          <div className="h-px w-full bg-[#F7F5F0]/[0.06]" />

          {/* RODAPÉ INFERIOR */}
          <div
            className="
        flex
        flex-col
        gap-4
        pt-7
        text-[10px]
        text-[#668875]/55
        md:flex-row
        md:items-center
        md:justify-between
      "
          >
            <p>© 2026 Carliano Psicologia. Todos os direitos reservados.</p>

            <p>Atendimento presencial em Poranga · Online para todo o Brasil</p>
          </div>
        </div>
      </footer>
      {/* ════════════════════════════════ FIXED WHATSAPP CTA — MOBILE ═══ */}
      <div
        className="
    fixed
    bottom-0
    left-0
    right-0
    z-40
    px-4
    pb-5
    pt-10
    md:hidden
  "
        style={{
          background:
            "linear-gradient(to top, rgba(30,40,36,0.98) 52%, transparent 100%)",
        }}
      >
        <CtaButton href={WHATSAPP_URL} className="w-full py-4">
          {/* WhatsApp icon */}
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Agendar pelo WhatsApp
        </CtaButton>
      </div>
      {/* CTA flutuante desktop */}
      <WhatsappFloat />
    </div>
  );
}
