import { useEffect } from 'react'
import { motion } from 'framer-motion'
import './flappyBird.css'
import './parallax.css'
import pipeGreen from '../../../assets/flappyBird/pipes/pipe-green.png'
import pipeGreenInvertido from '../../../assets/flappyBird/pipes/pipe-green-invertido.png'
import useFlappyController from '../controller/useFlappyController'


const GAME_STATES = {
    RUNNING: 'RUNNING',
    NOT_RUNNING: 'NOT_RUNNING',
    STOPPED: 'STOPPED'
}

const PARALLAX_BACKGROUNDS = {
    BG1: 'BG1',
    BG2: 'BG2',
    BG3: 'BG3'
}

export default function FlappyBird() {
    const {
        gameState,
        background,
        explosion,
        score,
        powerUps,
        isShrunk,
        birdPosition,
        pipes,
        screenRef,
        handleJump,
        handleStartGame,
        handleExitGame,
        handlePauseGame,
        handleResumeGame,
        setBackground
    } = useFlappyController()

    // Manejar teclas (Espacio para saltar, ESC para pausar)
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.code === 'Space' && gameState === GAME_STATES.RUNNING) {
                e.preventDefault()
                handleJump()
            }
            if (e.code === 'Escape') {
                e.preventDefault()
                if (gameState === GAME_STATES.RUNNING) {
                    handlePauseGame()
                } else if (gameState === GAME_STATES.STOPPED) {
                    handleResumeGame()
                }
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [gameState, handleJump, handlePauseGame, handleResumeGame])

    return (
        <div
            className="flappy-bird-screen"
            ref={screenRef}
            onClick={handleJump}
        >
            {gameState === GAME_STATES.RUNNING && (
                <>
                    <button className='exit-flappy-bird' onClick={(e) => {
                        e.stopPropagation()
                        handleExitGame()
                    }}>
                        SALIR
                    </button>
                    <button className='pause-flappy-bird' onClick={(e) => {
                        e.stopPropagation()
                        handlePauseGame()
                    }}>
                        PAUSA
                    </button>

                    {/* Score Display */}
                    <div className='score-display'>
                        {score}
                    </div>

                    {/* Renderizar tuberías */}
                    {pipes.map((pipe, index) => (
                        <div key={index}>
                            {/* Tubería superior (invertida) */}
                            <motion.div
                                className={`pipe pipe-top`}
                                style={{
                                    left: `${pipe.x}px`,
                                    top: 0,
                                    height: `${pipe.gapTop}px`,
                                    '--pipe-bg': `url(${pipeGreenInvertido})`,
                                }}
                                initial={{ scale: 1, filter: 'none' }}
                                animate={pipe.hit ? { scale: 1.06, filter: 'drop-shadow(0 0 10px rgba(255,140,40,0.6))' } : { scale: 1, filter: 'none' }}
                                transition={{ duration: 0.45, ease: 'easeOut' }}
                            />
                            {/* Tubería inferior */}
                            <motion.div
                                className={`pipe pipe-bottom`}
                                style={{
                                    left: `${pipe.x}px`,
                                    top: `${pipe.gapBottom}px`,
                                    height: `calc(100% - ${pipe.gapBottom}px)`,
                                    '--pipe-bg': `url(${pipeGreen})`
                                }}
                                initial={{ scale: 1, filter: 'none' }}
                                animate={pipe.hit ? { scale: 1.06, filter: 'drop-shadow(0 0 10px rgba(255,140,40,0.6))' } : { scale: 1, filter: 'none' }}
                                transition={{ duration: 0.45, ease: 'easeOut' }}
                            />
                        </div>
                    ))}

                    {/* El pájaro con spritesheet */}
                    <div
                        className={`flappy scale-2 ${isShrunk ? 'shrunk' : ''}`}
                        style={{
                            left: `${birdPosition.x}px`,
                            top: `${birdPosition.y}px`
                        }}
                        aria-hidden="true"
                    />
                    {explosion && (
                        <img
                            className="explosion-img"
                            src={explosion.src}
                            alt="explosion"
                            style={{ left: `${explosion.x}px`, top: `${explosion.y}px` }}
                        />
                    )}
                    {/* Render power-ups */}
                    {powerUps.map((p, idx) => (
                        <div
                            key={idx}
                            className="powerup"
                            style={{
                                left: `${p.x}px`,
                                top: `${p.y}px`,
                                width: `${p.width}px`,
                                height: `${p.height}px`
                            }}
                        />
                    ))}
                </>
            )}

            {gameState === GAME_STATES.STOPPED && (
                <>
                    <h1 className='flappy-bird-title'>EN PAUSA</h1>
                    <button className='pause-flappy-bird resume' onClick={handleResumeGame}>
                        REANUDAR
                    </button>
                    <div className='pause-hint'>
                        Presiona ESC para continuar
                    </div>
                </>
            )}

            {background == PARALLAX_BACKGROUNDS.BG1 && <>
                <div className='bg-layer1'></div>
                <div className='bg-layer2'></div>
                <div className='bg-layer3'></div>
                <div className='bg-layer4'></div>
                <div className='bg-layer5'></div>
                <div className='bg-layer6'></div>
                <div className='bg-layer7'></div>
                <div className='bg-layer8'></div>
            </>}
            {background == PARALLAX_BACKGROUNDS.BG2 && <>
                <div className='bg2-layer1'></div>
                <div className='bg2-layer2'></div>
                <div className='bg2-layer3'></div>
                <div className='bg2-layer4'></div>
                <div className='bg2-layer5'></div>
                <div className='bg2-layer6'></div>
                <div className='bg2-layer7'></div>
            </>}
            {background == PARALLAX_BACKGROUNDS.BG3 && <>
                <div className='bg3-layer1'></div>
                <div className='bg3-layer2'></div>
                <div className='bg3-layer3'></div>
                <div className='bg3-layer4'></div>
                <div className='bg3-layer5'></div>
            </>}

            {gameState === GAME_STATES.NOT_RUNNING && (
                <>
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
            )}
        </div>
    )
}