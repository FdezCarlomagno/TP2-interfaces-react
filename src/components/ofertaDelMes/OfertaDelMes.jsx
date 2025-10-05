import "./ofertaDelMes.css"
import BotonJugar from "../buttons/button.jugar"
import pegImage from '../../assets/pegImg.svg'
import ic_puzzle from '../../assets/dashboardItemsImg/ic_puzzle.svg'
import "./OfertaDelMes.css"
import { useNavigate } from "react-router-dom";


export default function OfertaDelMes() {
    const navigate = useNavigate();
  return (
    <section className="oferta-container">
      <div className="oferta-header">
        <div className="oferta-title-wrapper">
          <h2 className="oferta-title">OFERTA DEL MES</h2>
          <svg
            className="gift-icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 12v10H4V12"
              stroke="#6d9bff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 7H2v5h20V7z"
              stroke="#6d9bff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M12 22V7" stroke="#6d9bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"
              stroke="#6d9bff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"
              stroke="#6d9bff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="categoria-badge">
          <span>Categoría:</span>
          <img src={ic_puzzle} alt="" />
        </div>
      </div>

      <div className="oferta-content">
        <div className="oferta-text">
          <h3 className="game-title">Messi Solitaire</h3>
          <p className="game-description">
            Acompaña a <strong>Messi</strong> en un <strong>desafío único</strong> de ingenio: el{" "}
            <strong>Messi Solitaire</strong>. El objetivo es ayudarlo a superar{" "}
            <strong>todas las fichas del tablero</strong>, saltando unas sobre otras, hasta que solo quede{" "}
            <strong>una en pie</strong>.
          </p>
          <p className="game-description">
            Pon a prueba tu lógica y concentración junto al <strong>mejor del mundo</strong> en este adictivo reto
            solitario. ¿Serás capaz de dejar solo a <strong>Messi dominando el tablero</strong>?
          </p>
          <BotonJugar onClick={()=>navigate('/peg')}></BotonJugar>
        </div>

        <div className="oferta-image">
          <img
            src={pegImage}
            alt="Messi Solitaire"
          />
        </div>
      </div>
    </section>
  )
}
