import '../../../view/flappyBird.css'
import '../../../view/parallax.css'
import { PARALLAX_BACKGROUNDS } from '../../../config/gameConfig'

export default function StartScreen({
    setBackground,
    background,
    handleStartGame
}) {
    return <>
        <h1 className='flappy-bird-title'>FLAPPY BIRD</h1>
        <button className='start-flappy-bird' onClick={handleStartGame}>
            EMPEZAR JUEGO
        </button>
        <div className='background-selector'>
            <div className='background-selector-buttons'>
                <button className={`button-background btn1 ${background === PARALLAX_BACKGROUNDS.BG1 && 'selected'} `} onClick={() => {
                    setBackground(PARALLAX_BACKGROUNDS.BG1)
                }}>
                    Ciudad
                </button>
                <button className={`button-background btn2 ${background === PARALLAX_BACKGROUNDS.BG2 && 'selected'} `} onClick={() => {
                    setBackground(PARALLAX_BACKGROUNDS.BG2)
                }}>
                    Bosque
                </button>
                <button className={`button-background btn3 ${background === PARALLAX_BACKGROUNDS.BG3 && 'selected'} `} onClick={() => {
                    setBackground(PARALLAX_BACKGROUNDS.BG3)
                }}>
                    Montaña
                </button>
            </div>
        </div>
    </>
}