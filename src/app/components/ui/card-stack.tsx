import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronRight, SquareArrowOutUpRight } from "lucide-react";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

export type CardStackItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc?: string;
  href?: string;
  tag?: string;
};

type CardStackProps = {
  items: CardStackItem[];

  initialIndex?: number;
  maxVisible?: number;

  cardWidth?: number;
  cardHeight?: number;

  overlap?: number;
  spreadDeg?: number;

  perspectivePx?: number;
  depthPx?: number;
  tiltXDeg?: number;

  activeLiftPx?: number;
  activeScale?: number;
  inactiveScale?: number;

  springStiffness?: number;
  springDamping?: number;

  loop?: boolean;
  autoAdvance?: boolean;
  intervalMs?: number;
  pauseOnHover?: boolean;

  showDots?: boolean;
  className?: string;
};

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

function signedOffset(i: number, active: number, len: number, loop: boolean) {
  const raw = i - active;

  if (!loop || len <= 1) {
    return raw;
  }

  const alternative = raw > 0 ? raw - len : raw + len;

  return Math.abs(alternative) < Math.abs(raw) ? alternative : raw;
}

export function CardStack({
  items,

  initialIndex = 0,
  maxVisible = 3,

  cardWidth = 720,
  cardHeight = 470,

  overlap = 0.72,
  spreadDeg = 17,

  perspectivePx = 1300,
  depthPx = 65,
  tiltXDeg = 4,

  activeLiftPx = 20,
  activeScale = 1,
  inactiveScale = 0.91,

  springStiffness = 220,
  springDamping = 28,

  loop = true,
  autoAdvance = true,
  intervalMs = 5200,
  pauseOnHover = true,

  showDots = true,
  className,
}: CardStackProps) {
  const reduceMotion = useReducedMotion();

  const len = items.length;

  const [active, setActive] = React.useState(() =>
    wrapIndex(initialIndex, len),
  );

  const [hovering, setHovering] = React.useState(false);

  /*
   * Precisamos conhecer a largura real da seção.
   * Isso permite que o CardStack funcione corretamente
   * tanto no desktop quanto no celular.
   */
  const stageRef = React.useRef<HTMLDivElement>(null);

  const [stageWidth, setStageWidth] = React.useState(1000);

  React.useEffect(() => {
    const element = stageRef.current;

    if (!element) return;

    const updateSize = () => {
      setStageWidth(element.clientWidth);
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    setActive((current) => wrapIndex(current, len));
  }, [len]);

  const mobile = stageWidth < 640;

  /*
   * Desktop:
   * até 720px
   *
   * Mobile:
   * largura disponível menos as margens
   */
  const effectiveCardWidth = Math.min(
    cardWidth,
    Math.max(280, stageWidth - (mobile ? 28 : 90)),
  );

  const effectiveCardHeight = mobile
    ? Math.min(cardHeight, effectiveCardWidth * 0.96)
    : cardHeight;

  const visibleAmount = mobile ? 1 : maxVisible;

  const maxOffset = Math.max(0, Math.floor(visibleAmount / 2));

  const effectiveOverlap = mobile ? 0.94 : overlap;

  const cardSpacing = Math.max(
    8,
    Math.round(effectiveCardWidth * (1 - effectiveOverlap)),
  );

  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;

  const prev = React.useCallback(() => {
    if (!len) return;

    setActive((current) => wrapIndex(current - 1, len));
  }, [len]);

  const next = React.useCallback(() => {
    if (!len) return;

    setActive((current) => wrapIndex(current + 1, len));
  }, [len]);

  React.useEffect(() => {
    if (!autoAdvance) return;
    if (reduceMotion) return;
    if (!len) return;

    if (pauseOnHover && hovering) {
      return;
    }

    const id = window.setInterval(() => {
      next();
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [
    autoAdvance,
    reduceMotion,
    len,
    pauseOnHover,
    hovering,
    intervalMs,
    next,
  ]);

  if (!len) return null;

  const activeItem = items[active];

  const stageHeight = effectiveCardHeight + (mobile ? 65 : 125);

  return (
    <div
      className={cn("w-full", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        ref={stageRef}
        className="
          relative
          w-full
          outline-none
        "
        style={{
          height: stageHeight,
        }}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            prev();
          }

          if (event.key === "ArrowRight") {
            next();
          }
        }}
      >
        {/* Glow atrás do stack */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-10
            left-1/2
            h-[200px]
            w-[75%]
            -translate-x-1/2
            rounded-full
            bg-[#9DB5A6]/[0.07]
            blur-[70px]
          "
        />

        <div
          className="
            absolute
            inset-0
            flex
            items-end
            justify-center
          "
          style={{
            perspective: `${perspectivePx}px`,
          }}
        >
          <AnimatePresence initial={false}>
            {items.map((item, index) => {
              const offset = signedOffset(index, active, len, loop);

              const absoluteOffset = Math.abs(offset);

              /*
               * Mobile:
               * mostramos apenas o ativo.
               *
               * Desktop:
               * mostramos o leque completo.
               */
              const visible = mobile
                ? offset === 0
                : absoluteOffset <= maxOffset;

              if (!visible) {
                return null;
              }

              const rotateZ = mobile ? 0 : offset * stepDeg;

              const x = mobile ? 0 : offset * cardSpacing;

              const y = mobile ? 0 : absoluteOffset * 18;

              const z = -absoluteOffset * depthPx;

              const isActive = offset === 0;

              const scale = isActive ? activeScale : inactiveScale;

              const lift = isActive ? -activeLiftPx : 0;

              const rotateX = isActive ? 0 : tiltXDeg;

              const dragProps = isActive
                ? {
                    drag: "x" as const,

                    dragConstraints: {
                      left: 0,
                      right: 0,
                    },

                    dragElastic: 0.16,

                    onDragEnd: (
                      _event: unknown,
                      info: {
                        offset: {
                          x: number;
                        };
                        velocity: {
                          x: number;
                        };
                      },
                    ) => {
                      if (reduceMotion) {
                        return;
                      }

                      const travel = info.offset.x;

                      const velocity = info.velocity.x;

                      const threshold = Math.min(130, effectiveCardWidth * 0.2);

                      if (travel > threshold || velocity > 550) {
                        prev();
                      } else if (travel < -threshold || velocity < -550) {
                        next();
                      }
                    },
                  }
                : {};

              return (
                <motion.div
                  key={item.id}
                  className={cn(
                    `
                      absolute
                      bottom-0
                      overflow-hidden
                      rounded-[28px]
                      border
                      border-white/[0.10]
                      shadow-[0_30px_70px_rgba(0,0,0,0.22)]
                      will-change-transform
                      select-none
                    `,
                    isActive
                      ? "cursor-grab active:cursor-grabbing"
                      : "cursor-pointer",
                  )}
                  style={{
                    width: effectiveCardWidth,

                    height: effectiveCardHeight,

                    zIndex: 100 - absoluteOffset,

                    transformStyle: "preserve-3d",
                  }}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: y + 40,
                          x,
                          rotateZ,
                          rotateX,
                          scale,
                        }
                  }
                  animate={{
                    opacity: 1,
                    x,
                    y: y + lift,
                    rotateZ,
                    rotateX,
                    scale,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: springStiffness,
                    damping: springDamping,
                  }}
                  onClick={() => setActive(index)}
                  {...dragProps}
                >
                  <div
                    className="h-full w-full"
                    style={{
                      transform: `translateZ(${z}px)`,

                      transformStyle: "preserve-3d",
                    }}
                  >
                    <CarlianoCard item={item} active={isActive} />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Navegação */}
      {showDots && (
        <div
          className="
            mt-5
            flex
            items-center
            justify-center
            gap-4
          "
        >
          <div className="flex gap-2">
            {items.map((item, index) => {
              const selected = index === active;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Ver ${item.title}`}
                  className={cn(
                    `
                      rounded-full
                      transition-all
                      duration-300
                    `,
                    selected
                      ? "h-2 w-6 bg-[#E8D9B7]"
                      : "h-2 w-2 bg-[#9DB5A6]/35 hover:bg-[#9DB5A6]/70",
                  )}
                />
              );
            })}
          </div>

          {activeItem.href && (
            <a
              href={activeItem.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir conteúdo"
              className="
                text-[#9DB5A6]/60
                transition-all
                duration-300
                hover:text-[#E8D9B7]
              "
            >
              <SquareArrowOutUpRight size={16} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function CarlianoCard({
  item,
  active,
}: {
  item: CardStackItem;
  active: boolean;
}) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        group/card
        relative
        block
        h-full
        w-full
        bg-[#1E2824]
      "
      onClick={(event) => {
        if (!active) {
          event.preventDefault();
        }
      }}
    >
      {item.imageSrc && (
        <img
          src={item.imageSrc}
          alt={item.title}
          draggable={false}
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            ease-out
            group-hover/card:scale-[1.035]
          "
        />
      )}

      {/* Overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(20,29,25,0.98) 0%, rgba(20,29,25,0.63) 34%, rgba(20,29,25,0.12) 72%, transparent 100%)",
        }}
      />

      {/* Tag */}
      <div
        className="
          absolute
          left-5
          top-5
          md:left-7
          md:top-7
        "
      >
        <span
          className="
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-white/10
            bg-[#263D35]/55
            px-3
            py-1.5
            text-[8px]
            uppercase
            tracking-[0.22em]
            text-[#E8D9B7]
            backdrop-blur-md
            md:text-[9px]
          "
        >
          <span
            className="
              h-1
              w-1
              rounded-full
              bg-[#E8D9B7]
            "
          />

          {item.tag}
        </span>
      </div>

      {/* CTA circular */}
      <div
        className="
          absolute
          right-5
          top-5
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border
          border-white/10
          bg-white/[0.08]
          text-white
          backdrop-blur-md
          transition-all
          duration-300
          group-hover/card:bg-white/[0.14]
          md:right-7
          md:top-7
        "
      >
        <ChevronRight size={16} />
      </div>

      {/* Conteúdo */}
      <div
        className="
          absolute
          inset-x-0
          bottom-0
          p-6
          md:p-9
        "
      >
        <h3
          className="
            max-w-xl
            text-[#F7F5F0]
          "
          style={{
            fontFamily: "'DM Serif Display', serif",

            fontSize: "clamp(1.35rem, 3vw, 2rem)",

            lineHeight: 1.16,
          }}
        >
          {item.title}
        </h3>

        {item.description && (
          <p
            className="
              mt-3
              max-w-lg
              text-xs
              leading-relaxed
              text-[#D6E0DA]/70
              md:text-sm
            "
          >
            {item.description}
          </p>
        )}

        <span
          className="
            mt-5
            inline-flex
            items-center
            gap-2
            text-[11px]
            text-[#E8D9B7]
            transition-all
            duration-300
            group-hover/card:gap-3
          "
        >
          Ver conteúdo
          <ChevronRight size={13} />
        </span>
      </div>
    </a>
  );
}
