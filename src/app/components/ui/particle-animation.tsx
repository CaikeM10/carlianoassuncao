import { useEffect, useRef } from "react";
import p5 from "p5";
import { gsap } from "gsap";

export function ParticleAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sketchRef = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      const particles: Particle[] = [];

      const amount = window.innerWidth < 768 ? 450 : 900;

      const durationShrink = 12;
      const durationGrow = 12;
      const total = durationShrink + durationGrow;

      // Paleta Carliano
      const theme = ["#668875", "#9DB5A6", "#E8D9B7", "#668875", "#9DB5A6"];

      const proxy = {
        progress: 1,
        val: 0,
      };

      let progress: gsap.core.Tween;
      let interpolator: gsap.core.Timeline;

      class Particle {
        i: number;
        cos: number;
        sin: number;
        r: number;
        offset: number;
        color: string;

        constructor(i: number) {
          this.i = i;

          this.cos = p.cos(i * p.TWO_PI);
          this.sin = p.sin(i * p.TWO_PI);

          this.r = p.random(1.2, 3.4);

          this.offset = p.pow(p.random(1, 2), 2.4) * p.random(-0.01, 0.01);

          this.color = theme[Math.floor(p.random(theme.length))];
        }

        draw() {
          interpolator.progress((proxy.progress + this.i) % 1);

          const radius = p.width * (0.35 + proxy.val * this.offset);

          const x = this.cos * radius + p.width / 2;

          const y = this.sin * radius + p.height / 2;

          p.fill(this.color);

          p.circle(x, y, this.r);
        }
      }

      const onMove = (x: number, y: number) => {
        let angle = p.atan2(y - p.height / 2, x - p.width / 2);

        if (angle < 0) {
          angle += p.TWO_PI;
        }

        const time = Math.abs(angle / p.TWO_PI) * total;

        progress.time(time);
      };

      p.setup = () => {
        const width = containerRef.current?.clientWidth || 600;

        const height = containerRef.current?.clientHeight || 420;

        const canvas = p.createCanvas(width, height);

        canvas.parent(containerRef.current!);

        p.noStroke();

        progress = gsap.to(proxy, {
          progress: 0,
          ease: "none",
          duration: total,
          repeat: -1,
        });

        interpolator = gsap
          .timeline({
            paused: true,
          })
          .to(proxy, {
            val: 1,
            duration: durationShrink,
            ease: "sine.inOut",
          })
          .to(proxy, {
            val: 0,
            duration: durationGrow,
            ease: "sine.inOut",
          });

        for (let i = 0; i < amount; i++) {
          particles.push(new Particle(i / amount));
        }
      };

      p.windowResized = () => {
        if (!containerRef.current) return;

        p.resizeCanvas(
          containerRef.current.clientWidth,
          containerRef.current.clientHeight,
        );
      };

      p.mouseMoved = () => {
        onMove(p.mouseX, p.mouseY);
      };
      (p as any).touchMoved = () => {
        if (!p.touches.length) return;

        const touch = p.touches[0] as any;

        onMove(Number(touch.x), Number(touch.y));
      };

      p.draw = () => {
        p.clear();

        particles.forEach((particle) => particle.draw());
      };
    };

    sketchRef.current = new p5(sketch);

    return () => {
      sketchRef.current?.remove();

      gsap.killTweensOf("*");
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="
        pointer-events-none
        absolute
        inset-0
        h-full
        w-full
        opacity-30
        mix-blend-screen
      "
    />
  );
}
