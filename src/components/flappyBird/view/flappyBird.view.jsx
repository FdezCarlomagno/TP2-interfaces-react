import { useState, useEffect, useRef } from 'react'
import './flappyBird.css'
import { Bird } from '../model/Bird'
import { Pipe } from '../model/Pipe'
import pipeGreen from '../../../assets/flappyBird/pipes/pipe-green.png'
import toast from 'react-hot-toast'


const GAME_STATES = {
    RUNNING: 'RUNNING',
    NOT_RUNNING: 'NOT_RUNNING',
    STOPPED: 'STOPPED'
}

export default function FlappyBird() {
    const [gameState, setGameState] = useState(GAME_STATES.NOT_RUNNING)
    const [score, setScore] = useState(0)
    const [birdPosition, setBirdPosition] = useState({ x: 100, y: 250 })
    const [pipes, setPipes] = useState([])
    
    const birdRef = useRef(null)
    const gameLoopRef = useRef(null)
    const screenRef = useRef(null)
    const pipeTimerRef = useRef(null)
    const pipesRef = useRef([])

    useEffect(() => {
        // Inicializar el pájaro
        birdRef.current = new Bird(100, 250)
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

    const startPipeGeneration = () => {
        // Generar una tubería cada 2.5 segundos
        pipeTimerRef.current = setInterval(() => {
            const screenWidth = screenRef.current?.clientWidth || 800
            const screenHeight = screenRef.current?.clientHeight || 600
            const newPipe = new Pipe(screenWidth, screenHeight)
            pipesRef.current.push(newPipe)
        }, 2500)
    }

    const stopPipeGeneration = () => {
        if (pipeTimerRef.current) {
            clearInterval(pipeTimerRef.current)
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
                handleGameOver()
                return
            }

            // Verificar colisiones con tuberías y puntos
            for (let pipe of pipesRef.current) {
                if (pipe.checkCollision(bird)) {
                    handleGameOver()
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

    const handleGameOver = () => {
        stopGameLoop()
        stopPipeGeneration()
        setGameState(GAME_STATES.NOT_RUNNING)
        toast.error(`Game Over! Score: ${score}`)
    }

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
                            <div
                                className="pipe pipe-top"
                                style={{
                                    position: 'absolute',
                                    left: `${pipe.x}px`,
                                    top: 0,
                                    width: `70px`, // Ancho fijo
                                    height: `${pipe.gapTop}px`,
                                    backgroundImage: `url(${pipeGreen})`,
                                    backgroundSize: '70px auto',
                                    backgroundRepeat: 'repeat-y',
                                    backgroundPosition: 'bottom',
                                    transform: 'scaleY(-1)',
                                    zIndex: 20,
                                    imageRendering: 'pixelated'
                                }}
                            />
                            {/* Tubería inferior */}
                            <div
                                className="pipe pipe-bottom"
                                style={{
                                    position: 'absolute',
                                    left: `${pipe.x}px`,
                                    top: `${pipe.gapBottom}px`,
                                    width: `70px`, // Ancho fijo
                                    height: `calc(100% - ${pipe.gapBottom}px)`,
                                    backgroundImage: `url(${pipeGreen})`,
                                    backgroundSize: '70px auto',
                                    backgroundRepeat: 'repeat-y',
                                    backgroundPosition: 'top',
                                    zIndex: 20,
                                    imageRendering: 'pixelated'
                                }}
                            />
                        </div>
                    ))}

                    {/* El pájaro con spritesheet */}
                    <div 
                        className="flappy scale-2" 
                        style={{
                            position: 'absolute',
                            left: `${birdPosition.x}px`,
                            top: `${birdPosition.y}px`,
                            zIndex: 50
                        }}
                        aria-hidden="true"
                    />
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

            <div className='bg-layer1'></div>
            <div className='bg-layer2'></div>
            <div className='bg-layer3'></div>
            <div className='bg-layer4'></div>
            <div className='bg-layer5'></div>
            <div className='bg-layer6'></div>
            <div className='bg-layer7'></div>
            <div className='bg-layer8'></div>

            {gameState === GAME_STATES.NOT_RUNNING && (
                <>
                    <h1 className='flappy-bird-title'>FLAPPY BIRD</h1>
                    <button className='start-flappy-bird' onClick={handleStartGame}>
                        EMPEZAR JUEGO
                    </button>
                </>
            )}
        </div>
    )
}