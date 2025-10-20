import React from "react";
import "./GameplayCarousel.css";
import pegImg1 from "../../../assets/imgs/Peg1.png";
import pegImg2 from "../../../assets/imgs/Peg2.png";
import pegImg3 from "../../../assets/imgs/Peg3.png";

// Simple static dataset for Messi Solitaire gameplays (images only)
const GAMEPLAY_ITEMS = [
  { id: 10001, image: pegImg1 },
  { id: 10002, image: pegImg2 },
  { id: 10003, image: pegImg3 },
  { id: 10004, image: pegImg1 },
  { id: 10005, image: pegImg2 },
  { id: 10006, image: pegImg3 },
];

export default function GameplayCarousel() {
  const [index, setIndex] = React.useState(0);
  const containerRef = React.useRef(null);
  const trackRef = React.useRef(null);
  const [cardWidth, setCardWidth] = React.useState(0);

  const next = () => setIndex((prev) => Math.min(prev + 1, Math.max(0, GAMEPLAY_ITEMS.length - visibleCount())));
  const prev = () => setIndex((prev) => Math.max(prev - 1, 0));

  const visibleCount = () => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1024;
    if (w < 480) return 1;
    if (w < 768) return 2;
    if (w < 1024) return 3;
    return 3; // at most 3 visible to keep it compact under the main media
  };

  React.useEffect(() => {
    const compute = () => {
      if (!trackRef.current) return;
      const first = trackRef.current.querySelector(".gameplay-card");
      if (!first) return;
      const rect = first.getBoundingClientRect();
      const style = window.getComputedStyle(trackRef.current);
      const gap = parseFloat(style.gap || 0) || 0;
      setCardWidth(Math.round(rect.width + gap));
    };
    compute();
    const onResize = () => {
      compute();
      // clamp index after resize
      setIndex((prev) => Math.min(prev, Math.max(0, GAMEPLAY_ITEMS.length - visibleCount())));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const translateX = index * cardWidth;

  return (
    <section className="gameplay-section">
      <div className="gameplay-wrapper" ref={containerRef}>
        <button className="gameplay-nav left" onClick={prev} aria-label="Anterior">
          <svg viewBox="0 0 24 24" width="24" height="24"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div className="gameplay-viewport">
          <div className="gameplay-track" ref={trackRef} style={{ transform: `translateX(-${translateX}px)` }}>
            {GAMEPLAY_ITEMS.map((it) => (
              <div className="gameplay-card" key={it.id}>
                <div className="gameplay-image">
                  <img src={it.image} alt={it.name} loading="lazy" />
                </div>
                <div className="gameplay-name">{it.name}</div>
              </div>
            ))}
          </div>
        </div>
        <button className="gameplay-nav right" onClick={next} aria-label="Siguiente">
          <svg viewBox="0 0 24 24" width="24" height="24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </section>
  );
}
