"use client"

import { useState } from "react"
import "./GameHubSection.css"
import GamingSetup from '../../assets/imgs/gaming-setup.jpg'
import PersonMobile from '../../assets/imgs/person-using-mobile.jpg'
import PersonHeadphones from '../../assets/imgs/person-with-headphones.jpg'


export default function GameHubSection() {
  const [activeTab, setActiveTab] = useState("cross-platform")

  const content = {
    "cross-platform": {
      title: "CROSS-PLATFORM",
      text: (
        <p>
          GameHub rompe las barreras <strong>entre las consolas y el escritorio</strong>, ofreciendo{" "}
          <strong>compatibilidad total</strong> para que los juegos de Windows se ejecuten en consolas gracias a un{" "}
          <strong>diseño de compatibilidad de alta precisión</strong>.
          <br />
          <br />
          Los usuarios <strong>no necesitan equipos adicionales</strong> ni configuraciones complejas: con un solo clic
          disfrutan de <strong>una verdadera experiencia de nivel PC en consola</strong>.
        </p>
      ),
      image: PersonMobile,
    },
    "play-anytime": {
      title: "PLAY-ANYTIME",
      text: (
        <p>
          Con GameHub <strong>podés jugar cuando quieras y donde quieras</strong>. Accedé a tu{" "}
          <strong>biblioteca de Windows</strong> directamente desde tu <strong>consola</strong>, sin importar el lugar
          ni la hora. Además, <strong>tu progreso queda siempre guardado en la nube</strong>, listo para retomarlo en
          cualquier momento.
        </p>
      ),
      image: PersonHeadphones,
    },
    highlights: {
      title: "HIGHLIGHTS",
      text: (
        <p>
          GameHub ofrece <strong>compatibilidad total con juegos de Windows en consolas</strong>, garantizando una{" "}
          <strong>experiencia fluida y optimizada de nivel PC</strong>.
          <br />
          <br />
          Todo funciona con un solo clic y sin complicaciones,{" "}
          <strong>gracias a una interfaz moderna e intuitiva</strong> que te permite enfocarte únicamente en lo más
          importante: jugar.
        </p>
      ),
      image: GamingSetup,
    },
  }

  return (
    <section className="gamehub-section">
      <div className="container">
        <h1 className="main-title">GAMEHUB TE TRAE DIFERENTES MODOS DE JUEGO</h1>

        <nav className="tabs">
          <button
            className={`tab ${activeTab === "cross-platform" ? "active" : ""}`}
            onClick={() => setActiveTab("cross-platform")}
          >
            cross-platform
          </button>
          <button
            className={`tab ${activeTab === "play-anytime" ? "active" : ""}`}
            onClick={() => setActiveTab("play-anytime")}
          >
            play-anytime
          </button>
          <button
            className={`tab ${activeTab === "highlights" ? "active" : ""}`}
            onClick={() => setActiveTab("highlights")}
          >
            highlights
          </button>
        </nav>

        <div className="content-wrapper">
          <div className="text-content">
            <h2 className="content-title">{content[activeTab].title}</h2>
            <p className="content-text">{content[activeTab].text}</p>
          </div>

          <div className="image-content">
            <img
              src={content[activeTab].image}
              alt={content[activeTab].title}
              className="content-image"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
