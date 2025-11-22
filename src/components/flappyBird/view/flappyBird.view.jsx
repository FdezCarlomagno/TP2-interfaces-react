import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import './flappyBird.css'
import './parallax.css'
import { Bird } from '../model/Bird'
import { Pipe } from '../model/Pipe'
import pipeGreen from '../../../assets/flappyBird/pipes/pipe-green.png'
import pipeGreenInvertido from '../../../assets/flappyBird/pipes/pipe-green-invertido.png'
import toast from 'react-hot-toast'
import explosionSfx from '../../../assets/flappyBird/Explosion.mp3'
import explosionImg from '../../../assets/flappyBird/Explosion.png'


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
    const [gameState, setGameState] = useState(GAME_STATES.NOT_RUNNING)
    const [background, setBackground] = useState(PARALLAX_BACKGROUNDS.BG1)
    const [explosion, setExplosion] = useState(null)
    const [score, setScore] = useState(0)
    const [birdPosition, setBirdPosition] = useState({ x: 100, y: 250 })
    const [pipes, setPipes] = useState([])
    const [pipeInterval, setPipeInterval] = useState(3000)

    const birdRef = useRef(null)
    const gameLoopRef = useRef(null)
    const screenRef = useRef(null)
    const pipeTimerRef = useRef(null)
    const pipesRef = useRef([])
    const scoreRef = useRef(0)
    const explosionActiveRef = useRef(false)
    const explosionAudioRef = useRef(null)

    useEffect(() => {
        // Inicializar el pájaro
        birdRef.current = new Bird(100, 250)
        // Preload explosion audio if available
        try {
            if (explosionSfx) {
                const a = new Audio(explosionSfx)
                a.preload = 'auto'
                a.volume = 0.85
                explosionAudioRef.current = a
            }
        } catch (e) {
            explosionAudioRef.current = null
        }
    }, [])

    useEffect(() => {
        if (gameState === GAME_STATES.RUNNING) {
            startGameLoop()
            startPipeGeneration()
        } else {
            stopGameLoop()
            stopPipeGeneration()
        }

        return () => {
            stopGameLoop()
            stopPipeGeneration()
        }
    }, [gameState])

    // Elimina este estado:
    // const [pipeInterval, setPipeInterval] = useState(3000)

    // Y en startPipeGeneration:
    const startPipeGeneration = () => {
        const generatePipe = () => {
            const screenWidth = screenRef.current?.clientWidth || 800
            const screenHeight = screenRef.current?.clientHeight || 600

            // Usar scoreRef.current para obtener el valor actual
            const currentScore = scoreRef.current
            const gap = Math.max(120, 200 - currentScore * 5)
            const newPipe = new Pipe(screenWidth, screenHeight, gap)
            pipesRef.current.push(newPipe)

            // Calcular intervalo directamente
            const nextInterval = Math.max(1500, 3000 - currentScore * 100)
            console.log("Next pipe in:", nextInterval, "ms - Score:", currentScore)

            pipeTimerRef.current = setTimeout(generatePipe, nextInterval)
        }

        generatePipe()
    }

    // Este useEffect es crucial
    useEffect(() => {
        scoreRef.current = score
        console.log("Score updated to:", score) // Para debug
    }, [score])
    // Y elimina esta línea del game loop:
    // setPipeInterval(prev => prev - 50)

    const stopPipeGeneration = () => {
        if (pipeTimerRef.current) {
            clearTimeout(pipeTimerRef.current)
            pipeTimerRef.current = null
        }
    }


    const startGameLoop = () => {
        gameLoopRef.current = setInterval(() => {
            const bird = birdRef.current
            const screenHeight = screenRef.current?.clientHeight || 600

            // Actualizar física del pájaro
            bird.update()

            // Actualizar posición en el estado para el renderizado
            setBirdPosition({ x: bird.x, y: bird.y })

            // Actualizar tuberías
            pipesRef.current.forEach(pipe => pipe.update())

            // Verificar colisión con el suelo
            if (bird.checkCollision(screenHeight)) {
                // Llamar a handleGameOver con coordenadas para que se encargue de la explosión
                handleGameOver(bird.x, screenHeight - bird.height / 2, { src: explosionImg })
                return
            }

            // Verificar colisiones con tuberías y puntos
            for (let pipe of pipesRef.current) {
                if (pipe.checkCollision(bird)) {
                    // Llamar a handleGameOver con coordenadas y la imagen de explosión
                    // No marcamos la tubería como 'hit' para evitar que desaparezca; la animación
                    // de desaparición será sobre el pájaro.
                    handleGameOver(bird.x, bird.y, { src: explosionImg })
                    return
                }

                // Verificar si el pájaro pasó la tubería (sumar puntos)
                if (pipe.hasPassed(bird)) {
                    setScore(prev => prev + 1)
                }
            }

            // Eliminar tuberías que salieron de la pantalla
            pipesRef.current = pipesRef.current.filter(pipe => !pipe.isOffScreen())

            // Actualizar estado de las tuberías para renderizado
            setPipes([...pipesRef.current])
        }, 1000 / 60) // 60 FPS
    }

    const stopGameLoop = () => {
        if (gameLoopRef.current) {
            clearInterval(gameLoopRef.current)
            gameLoopRef.current = null
        }
    }

    const handleJump = () => {
        if (gameState === GAME_STATES.RUNNING && birdRef.current) {
            birdRef.current.jump()
        }
    }

    const handleStartGame = () => {
        birdRef.current.reset(100, 250)
        setBirdPosition({ x: 100, y: 250 })
        setScore(0)
        pipesRef.current = []
        setPipes([])
        setGameState(GAME_STATES.RUNNING)
    }

    const handleExitGame = () => {
        stopGameLoop()
        stopPipeGeneration()
        pipesRef.current = []
        setPipes([])
        setGameState(GAME_STATES.NOT_RUNNING)
        setScore(0)
    }

    const handlePauseGame = () => {
        setGameState(GAME_STATES.STOPPED)
    }

    const handleResumeGame = () => {
        setGameState(GAME_STATES.RUNNING)
    }

    const showExplosion = (x, y, opts = {}) => {
        return new Promise((resolve) => {
            if (explosionActiveRef.current) return resolve()
            explosionActiveRef.current = true
            // Center explosion on the bird's center (account for bird dimensions)
            const bw = (birdRef.current && birdRef.current.width) ? birdRef.current.width : 34
            const bh = (birdRef.current && birdRef.current.height) ? birdRef.current.height : 24
            const payload = { x: x + bw / 2, y: y + bh / 2, id: Date.now(), src: opts.src }
            setExplosion(payload)
            playExplosionSound()
            setTimeout(() => {
                setExplosion(null)
                explosionActiveRef.current = false
                resolve()
            }, opts.duration || 700)
        })
    }

    const handleGameOver = async (x, y, opts = {}) => {
        // Always stop loops first
        stopGameLoop()
        stopPipeGeneration()

        // Si recibimos coordenadas, mostramos explosión antes de terminar
        if (typeof x === 'number' && typeof y === 'number') {
            await showExplosion(x, y, opts)
        }

        setGameState(GAME_STATES.NOT_RUNNING)
        toast.error(`Game Over! Score: ${score}`)
    }

    // triggerExplosion removed; use showExplosion() inside handleGameOver

    // Reproducir el SFX de explosión si existe, sino sintetizar un ruido de fallback
    const playExplosionSound = () => {
        try {
            const a = explosionAudioRef.current
            if (a) {
                a.currentTime = 0
                a.play().catch(() => { })
            }
        } catch (e) {
            // ignore playback errors
        }
    }

    // Particle system removed: using framer-motion for keyframe animations

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
    }, [gameState])

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
                        className="flappy scale-2"
                        style={{
                            left: `${birdPosition.x}px`,
                            top: `${birdPosition.y}px`
                        }}
                        aria-hidden="true"
                    />
                    {explosion && (
                        <img
                            className="explosion-img"
                            src={explosion.src || explosionImg}
                            alt="explosion"
                            style={{ left: `${explosion.x}px`, top: `${explosion.y}px` }}
                        />
                    )}
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