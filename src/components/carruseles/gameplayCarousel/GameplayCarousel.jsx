import React from "react";
import "./GameplayCarousel.css";

// 🧩 Assets
import messi1 from "../../../assets/imgs/gamePreview1.png";
import messi2 from "../../../assets/imgs/messiBlocka2.jpg";
import messi3 from "../../../assets/imgs/gamePreview2.png";
import messi4 from "../../../assets/imgs/messiBlocka4.jpg";
import messi5 from "../../../assets/imgs/messiBlocka5.jpg";
import messi6 from "../../../assets/imgs/gamePreview3.png";

import peg1 from "../../../assets/imgs/peg-solitaire1.png";
import peg2 from "../../../assets/imgs/peg-solitaire2.png";
import peg3 from "../../../assets/imgs/peg-solitaire3.png";
import peg4 from "../../../assets/imgs/peg-solitaire4.png";
import peg5 from "../../../assets/imgs/peg-solitaire5.png";

// 🎮 Dataset de Blocka Game
const GAMEPLAY_BLOCKA = [
  { 
    id: 1, 
    image: messi2, 
    title: "¡NIVEL 50 COMPLETADO! Blocka Game - Estrategia Pro", 
    channel: "BlockaMaster", 
    views: "128K vistas", 
    time: "Hace 2 días",
    duration: "15:22",
    avatar: messi1
  },
  { 
    id: 2, 
    image: messi3, 
    title: "Blocka Game: TODOS los SECRETOS y TRUCOS Revelados", 
    channel: "GameGuías", 
    views: "89K vistas", 
    time: "Hace 1 semana",
    duration: "22:45",
    avatar: messi4
  },
  { 
    id: 3, 
    image: messi4, 
    title: "REACCIÓN: Mi Primera Vez en Blocka Game 😲 Nivel 10", 
    channel: "GamerReacts", 
    views: "67K vistas", 
    time: "Hace 3 días",
    duration: "18:30",
    avatar: messi5
  },
  { 
    id: 4, 
    image: messi5, 
    title: "Blocka Game - Speedrun Niveles 1-20 RÉCORD MUNDIAL", 
    channel: "SpeedRunPro", 
    views: "203K vistas", 
    time: "Hace 5 días",
    duration: "14:12",
    avatar: messi6
  },
  { 
    id: 5, 
    image: messi6, 
    title: "Cómo PASAR el Nivel 25 de Blocka Game SIN ERRORES", 
    channel: "TutorialGamer", 
    views: "95K vistas", 
    time: "Hace 2 semanas",
    duration: "11:28",
    avatar: messi2
  },
  { 
    id: 6, 
    image: messi1, 
    title: "Blocka Game vs Amigos - ¿Quién es MEJOR?", 
    channel: "GamingFriends", 
    views: "156K vistas", 
    time: "Hace 4 días",
    duration: "26:15",
    avatar: messi3
  }
];

// ⚽ Dataset de Peg Solitaire
const GAMEPLAY_PEG = [
  {
    id: 1,
    image: peg1,
    title: "Peg Solitaire - Cómo GANAR en 3 minutos ⏱️",
    channel: "PegMaster",
    views: "48K vistas",
    time: "Hace 1 día",
    duration: "09:34",
    avatar: messi1
  },
  {
    id: 2,
    image: peg2,
    title: "El TRUCO DEFINITIVO para Peg Solitaire 🔥",
    channel: "LogicGamer",
    views: "72K vistas",
    time: "Hace 3 días",
    duration: "12:17",
    avatar: messi2
  },
  {
    id: 3,
    image: peg3,
    title: "Mi Speedrun en Peg Solitaire 😱 (RÉCORD ARG)",
    channel: "MessiPlays",
    views: "102K vistas",
    time: "Hace 1 semana",
    duration: "08:29",
    avatar: messi3
  },
  {
    id: 4,
    image: peg4,
    title: "Peg Solitaire - Guía Completa para Principiantes 🎯",
    channel: "GamingAcademy",
    views: "55K vistas",
    time: "Hace 2 semanas",
    duration: "14:45",
    avatar: messi4
  },
  {
    id: 5,
    image: peg5,
    title: "¿Puedes Resolverlo con SOLO 1 Movimiento? 🤔",
    channel: "PuzzlePro",
    views: "88K vistas",
    time: "Hace 5 días",
    duration: "10:10",
    avatar: messi5
  }
];

export default function GameplayCarousel({ game = "blocka" }) {
  const ITEMS = game === "peg" ? GAMEPLAY_PEG : GAMEPLAY_BLOCKA;

  const [index, setIndex] = React.useState(0);
  const containerRef = React.useRef(null);
  const trackRef = React.useRef(null);
  const [cardWidth, setCardWidth] = React.useState(0);

  const next = () => setIndex((prev) => Math.min(prev + 1, Math.max(0, ITEMS.length - visibleCount())));
  const prev = () => setIndex((prev) => Math.max(prev - 1, 0));

  const visibleCount = () => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1024;
    if (w < 480) return 1;
    if (w < 768) return 2;
    if (w < 1024) return 3;
    return 3;
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
      setIndex((prev) => Math.min(prev, Math.max(0, ITEMS.length - visibleCount())));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [ITEMS]);

  const translateX = index * cardWidth;

  return (
    <section className="gameplay-section">
      <h2 className="gameplay-title">
        {game === "peg" ? "Gameplays de Peg Solitaire" : "Gameplays de Blocka Game"}
      </h2>

      <div className="gameplay-wrapper" ref={containerRef}>
        <button className="gameplay-nav left" onClick={prev} aria-label="Anterior">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="gameplay-viewport">
          <div className="gameplay-track" ref={trackRef} style={{ transform: `translateX(-${translateX}px)` }}>
            {ITEMS.map((item) => (
              <div className="gameplay-card" key={item.id}>
                <div className="gameplay-thumbnail">
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <div className="video-duration">{item.duration}</div>
                </div>
                <div className="video-info">
                  <div className="channel-avatar">
                    <img src={item.avatar} alt={item.channel} />
                  </div>
                  <div className="video-details">
                    <h3 className="video-title">{item.title}</h3>
                    <p className="channel-name">{item.channel}</p>
                    <p className="video-stats">{item.views} • {item.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="gameplay-nav right" onClick={next} aria-label="Siguiente">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </section>
  );
}
