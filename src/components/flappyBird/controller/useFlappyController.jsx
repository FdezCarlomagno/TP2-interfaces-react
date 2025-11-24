import { useState, useEffect, useRef, useCallback } from 'react'
import { Bird } from '../model/Bird'
import { Pipe } from '../model/Pipe'
import { PowerUp } from '../model/PowerUp'
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

export function useFlappyController() {
    const [gameState, setGameState] = useState(GAME_STATES.NOT_RUNNING)
    const [background, setBackground] = useState(PARALLAX_BACKGROUNDS.BG1)
    const [explosion, setExplosion] = useState(null)
    const [score, setScore] = useState(0)
    const [birdPosition, setBirdPosition] = useState({ x: 100, y: 250 })
    const [pipes, setPipes] = useState([])
    const [powerUps, setPowerUps] = useState([])
    const [isShrunk, setIsShrunk] = useState(false)

    const birdRef = useRef(null)
    const gameLoopRef = useRef(null)
    const screenRef = useRef(null)
    const pipeTimerRef = useRef(null)
    const pipesRef = useRef([])
    const powerUpTimerRef = useRef(null)
    const powerUpsRef = useRef([])
    const shrinkTimerRef = useRef(null)
    const scoreRef = useRef(0)
    const explosionActiveRef = useRef(false)
    const explosionAudioRef = useRef(null)

    useEffect(() => {
        birdRef.current = new Bird(100, 250)
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
            startPowerUpGeneration()
        } else {
            stopGameLoop()
            stopPipeGeneration()
            stopPowerUpGeneration()
        }

        return () => {
            stopGameLoop()
            stopPipeGeneration()
            stopPowerUpGeneration()
        }
    }, [gameState])

    useEffect(() => {
        scoreRef.current = score
    }, [score])

    const startPipeGeneration = useCallback(() => {
        const generatePipe = () => {
            const screenWidth = screenRef.current?.clientWidth || 800
            const screenHeight = screenRef.current?.clientHeight || 600
            const currentScore = scoreRef.current
            const gap = Math.max(120, 200 - currentScore * 5)
            const newPipe = new Pipe(screenWidth, screenHeight, gap)
            pipesRef.current.push(newPipe)
            const nextInterval = Math.max(1500, 3000 - currentScore * 100)
            pipeTimerRef.current = setTimeout(generatePipe, nextInterval)
        }
        generatePipe()
    }, [])

    const startPowerUpGeneration = useCallback(() => {
        const generate = () => {
            const screenWidth = screenRef.current?.clientWidth || 800
            const screenHeight = screenRef.current?.clientHeight || 600
            const p = new PowerUp(screenWidth, screenHeight)
            powerUpsRef.current.push(p)
            // programar siguiente powerup aleatorio entre 8s y 15s
            const next = Math.floor(Math.random() * (15000 - 8000)) + 8000
            powerUpTimerRef.current = setTimeout(generate, next)
            setPowerUps([...powerUpsRef.current])
        }
        generate()
    }, [])

    const stopPowerUpGeneration = useCallback(() => {
        if (powerUpTimerRef.current) {
            clearTimeout(powerUpTimerRef.current)
            powerUpTimerRef.current = null
        }
    }, [])

    const stopPipeGeneration = useCallback(() => {
        if (pipeTimerRef.current) {
            clearTimeout(pipeTimerRef.current)
            pipeTimerRef.current = null
        }
    }, [])

    const startGameLoop = useCallback(() => {
        if (gameLoopRef.current) return
        gameLoopRef.current = setInterval(() => {
            const bird = birdRef.current
            const screenHeight = screenRef.current?.clientHeight || 600
            if (!bird) return
            bird.update()
            setBirdPosition({ x: bird.x, y: bird.y })
            pipesRef.current.forEach(pipe => pipe.update())
            // actualizar powerups
            powerUpsRef.current.forEach(p => p.update())

            // colisiones con powerups
            for (let i = 0; i < powerUpsRef.current.length; i++) {
                const p = powerUpsRef.current[i]
                if (p.collected) continue
                const pb = p.getHitbox()
                const bb = bird.getHitbox()
                const overlap = !(bb.x + bb.width < pb.x || bb.x > pb.x + pb.width || bb.y + bb.height < pb.y || bb.y > pb.y + pb.height)
                if (overlap) {
                    // recoger powerup: shrink + 3 puntos
                    p.collected = true
                    // remover del array
                    powerUpsRef.current = powerUpsRef.current.filter(u => u !== p)
                    setPowerUps([...powerUpsRef.current])
                    // Sumar puntos
                    setScore(prev => prev + 3)
                    // aplicar shrink al pájaro
                    if (birdRef.current) {
                        // reiniciar timer si ya había
                        if (shrinkTimerRef.current) {
                            clearTimeout(shrinkTimerRef.current)
                        }
                        const newW = Math.max(10, Math.round(birdRef.current.baseWidth * 0.6))
                        const newH = Math.max(8, Math.round(birdRef.current.baseHeight * 0.6))
                        birdRef.current.setSize(newW, newH)
                        setIsShrunk(true)
                        // restaurar después de 20s
                        shrinkTimerRef.current = setTimeout(() => {
                            if (birdRef.current) birdRef.current.resetSize()
                            setIsShrunk(false)
                            shrinkTimerRef.current = null
                        }, 20000)
                    }
                }
            }

            if (bird.checkCollision(screenHeight)) {
                handleGameOver(bird.x, screenHeight - bird.height / 2, { src: explosionImg })
                return
            }

            for (let pipe of pipesRef.current) {
                if (pipe.checkCollision(bird)) {
                    handleGameOver(bird.x, bird.y, { src: explosionImg })
                    return
                }
                if (pipe.hasPassed(bird)) {
                    setScore(prev => prev + 1)
                }
            }

            pipesRef.current = pipesRef.current.filter(pipe => !pipe.isOffScreen())
            powerUpsRef.current = powerUpsRef.current.filter(p => !p.isOffScreen() && !p.collected)
            setPipes([...pipesRef.current])
            setPowerUps([...powerUpsRef.current])
        }, 1000 / 60)
    }, [])

    const stopGameLoop = useCallback(() => {
        if (gameLoopRef.current) {
            clearInterval(gameLoopRef.current)
            gameLoopRef.current = null
        }
    }, [])

    const handleJump = useCallback(() => {
        if (gameState === GAME_STATES.RUNNING && birdRef.current) {
            birdRef.current.jump()
        }
    }, [gameState])

    const handleStartGame = useCallback(() => {
        if (birdRef.current) birdRef.current.reset(100, 250)
        setBirdPosition({ x: 100, y: 250 })
        setScore(0)
        pipesRef.current = []
        setPipes([])
        // Ensure any shrink state is cleared on new game
        if (shrinkTimerRef.current) {
            clearTimeout(shrinkTimerRef.current)
            shrinkTimerRef.current = null
        }
        if (birdRef.current) birdRef.current.resetSize()
        setIsShrunk(false)
        setGameState(GAME_STATES.RUNNING)
    }, [])

    const handleExitGame = useCallback(() => {
        stopGameLoop()
        stopPipeGeneration()
        pipesRef.current = []
        setPipes([])
        // Clear powerup/shrink state when exiting
        stopPowerUpGeneration()
        if (shrinkTimerRef.current) {
            clearTimeout(shrinkTimerRef.current)
            shrinkTimerRef.current = null
        }
        if (birdRef.current) birdRef.current.resetSize()
        setIsShrunk(false)
        setGameState(GAME_STATES.NOT_RUNNING)
        setScore(0)
    }, [stopGameLoop, stopPipeGeneration])

    const handlePauseGame = useCallback(() => {
        setGameState(GAME_STATES.STOPPED)
    }, [])

    const handleResumeGame = useCallback(() => {
        setGameState(GAME_STATES.RUNNING)
    }, [])

    const playExplosionSound = useCallback(() => {
        try {
            const a = explosionAudioRef.current
            if (a) {
                a.currentTime = 0
                a.play().catch(() => { })
            }
        } catch (e) { }
    }, [])

    const showExplosion = useCallback((x, y, opts = {}) => {
        return new Promise((resolve) => {
            if (explosionActiveRef.current) return resolve()
            explosionActiveRef.current = true
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
    }, [playExplosionSound])

    const handleGameOver = useCallback(async (x, y, opts = {}) => {
        stopGameLoop()
        stopPipeGeneration()
        stopPowerUpGeneration()
        if (shrinkTimerRef.current) {
            clearTimeout(shrinkTimerRef.current)
            shrinkTimerRef.current = null
        }
        // restore visual state on game over
        if (birdRef.current) birdRef.current.resetSize()
        setIsShrunk(false)
        if (typeof x === 'number' && typeof y === 'number') {
            await showExplosion(x, y, opts)
        }
        setGameState(GAME_STATES.NOT_RUNNING)
        toast.error(`Game Over! Score: ${scoreRef.current}`)
    }, [stopGameLoop, stopPipeGeneration, showExplosion])

    return {
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
    }
}

export default useFlappyController
