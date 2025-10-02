import "./ofertaDelMes.css"
import BotonJugar from "../buttons/button.jugar"
import pegImage from '../../assets/pegImg.svg'

const OfertaDelMes = () => {
    return <>
        <section className="ofertaDelMes-container">
            <div>
                <h2 className="ofertaDelMes">Oferta del mes</h2>
                <div className="ofertaDelMes-info">
                    <div className="ofertaDelMes-info-game">
                        <p>
                             <span className="ofertaDelMes-game-title">Messi Solitaire </span>
                            Acompaña a <strong>Messi</strong> en un <strong>desafío único</strong> de ingenio: el <strong>Messi Solitaire</strong>. El objetivo es ayudarlo a superar <strong>todas las fichas del tablero</strong>, saltando unas sobre otras, hasta que solo quede <strong>una en pie</strong></p>

                        <p>Pon a prueba tu lógica y concentración junto al <strong>mejor del mundo</strong> en este adictivo reto solitario. ¿Serás capaz de dejar solo a <strong>Messi dominando el tablero</strong>?</p>

                        <div className="boton-jugar-container">
                            <BotonJugar />
                        </div>
                    </div>
                    

                    <img src={pegImage} alt="IMAGEN DE MESSI SOLITAIRE" />
                    
                </div>
            
            </div>
    
        </section>
    </>
}

export default OfertaDelMes