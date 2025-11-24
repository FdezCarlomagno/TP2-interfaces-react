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
    const screenRef = useRef(null)

    const pipesRef = useRef([])
    const powerUpsRef = useRef([])
    const scoreRef = useRef(0)

    const gameLoopRef = useRef(null)
    const pipeTimerRef = useRef(null)
    const powerUpTimerRef = useRef(null)
    const shrinkTimerRef = useRef(null)

    const explosionActiveRef = useRef(false)
    const explosionAudioRef = useRef(null)

    // ────────────────────────────────────────────────────────
    // INIT
    // ────────────────────────────────────────────────────────
    useEffect(() => {
        birdRef.current = new Bird(100, 250)

        try {
            const a = new Audio(explosionSfx)
            a.preload = 'auto'
            a.volume = 0.85
            explosionAudioRef.current = a
        } catch {
            explosionAudioRef.current = null
        }
    }, [])

    useEffect(() => {
        scoreRef.current = score
    }, [score])

    // ────────────────────────────────────────────────────────
    // GAME STATE
    // ────────────────────────────────────────────────────────
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

    // ────────────────────────────────────────────────────────
    // PIPE GENERATION
    // ────────────────────────────────────────────────────────
    const startPipeGeneration = useCallback(() => {
        const generate = () => {
            const screenWidth = screenRef.current?.clientWidth || 800
            const screenHeight = screenRef.current?.clientHeight || 600
            const currentScore = scoreRef.current

            const gap = Math.max(120, 200 - currentScore * 5)
            const pipe = new Pipe(screenWidth, screenHeight, gap)

            pipesRef.current.push(pipe)
            setPipes([...pipesRef.current])

            const next = Math.max(1500, 3000 - currentScore * 100)
            pipeTimerRef.current = setTimeout(generate, next)
        }
        generate()
    }, [])

    const stopPipeGeneration = useCallback(() => {
        if (pipeTimerRef.current) {
            clearTimeout(pipeTimerRef.current)
            pipeTimerRef.current = null
        }
    }, [])

    // ────────────────────────────────────────────────────────
    // POWERUP GENERATION
    // ────────────────────────────────────────────────────────
    const startPowerUpGeneration = useCallback(() => {
        const generate = () => {
            const w = screenRef.current?.clientWidth || 800
            const h = screenRef.current?.clientHeight || 600

            const pu = new PowerUp(w, h)

            // Evitar superposición con tuberías
            for (const pipe of pipesRef.current) {
                const pLeft = pipe.x
                const pRight = pipe.x + pipe.width
                const puLeft = pu.x
                const puRight = pu.x + pu.width

                // Si hay intersección horizontal
                if (puLeft < pRight && puRight > pLeft) {
                    // Forzar posición Y al centro del hueco
                    const gapCenter = pipe.gapTop + (pipe.gap / 2)
                    pu.y = gapCenter - (pu.height / 2)
                    break
                }
            }

            powerUpsRef.current.push(pu)
            setPowerUps([...powerUpsRef.current])

            const next = 8000 + Math.random() * 7000
            powerUpTimerRef.current = setTimeout(generate, next)
        }
        generate()
    }, [])

    const stopPowerUpGeneration = useCallback(() => {
        if (powerUpTimerRef.current) {
            clearTimeout(powerUpTimerRef.current)
            powerUpTimerRef.current = null
        }
    }, [])

    // ────────────────────────────────────────────────────────
    // GAME LOOP
    // ────────────────────────────────────────────────────────
    const startGameLoop = useCallback(() => {
        if (gameLoopRef.current) return

        gameLoopRef.current = setInterval(() => {
            const bird = birdRef.current
            const screenH = screenRef.current?.clientHeight || 600
            if (!bird) return

            bird.update()
            setBirdPosition({ x: bird.x, y: bird.y })

            pipesRef.current.forEach(p => p.update())
            powerUpsRef.current.forEach(p => p.update())

            // POWERUP collision
            for (const pu of powerUpsRef.current) {
                if (pu.collected) continue

                const b = bird.getHitbox()
                const h = pu.getHitbox()

                const touching = !(
                    b.x + b.width < h.x ||
                    b.x > h.x + h.width ||
                    b.y + b.height < h.y ||
                    b.y > h.y + h.height
                )

                if (touching) {
                    pu.collected = true
                    powerUpsRef.current = powerUpsRef.current.filter(x => x !== pu)
                    setPowerUps([...powerUpsRef.current])

                    setScore(prev => prev + 3)

                    // SHRINK
                    if (shrinkTimerRef.current) clearTimeout(shrinkTimerRef.current)

                    bird.setSize(
                        Math.round(bird.baseWidth * 0.6),
                        Math.round(bird.baseHeight * 0.6)
                    )

                    setIsShrunk(true)

                    shrinkTimerRef.current = setTimeout(() => {
                        bird.resetSize()
                        setIsShrunk(false)
                        shrinkTimerRef.current = null
                    }, 20000)
                }
            }

            // FLOOR / CEILING
            if (bird.checkCollision(screenH)) {
                handleGameOver(bird.x, bird.y, { src: explosionImg })
                return
            }

            // PIPE collision
            for (const pipe of pipesRef.current) {
                if (pipe.checkCollision(bird)) {
                    handleGameOver(bird.x, bird.y, { src: explosionImg })
                    return
                }
                if (pipe.hasPassed(bird)) {
                    setScore(s => s + 1)
                }
            }

            // CLEANUP
            pipesRef.current = pipesRef.current.filter(p => !p.isOffScreen())
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

    // ────────────────────────────────────────────────────────
    // INPUT
    // ────────────────────────────────────────────────────────
    const handleJump = useCallback(() => {
        if (gameState === GAME_STATES.RUNNING) {
            birdRef.current?.jump()
        }
    }, [gameState])

    // ────────────────────────────────────────────────────────
    // STATE CONTROL
    // ────────────────────────────────────────────────────────
    const handleStartGame = useCallback(() => {
        birdRef.current?.reset(100, 250)
        birdRef.current?.resetSize()

        setBirdPosition({ x: 100, y: 250 })
        setScore(0)
        setIsShrunk(false)

        pipesRef.current = []
        powerUpsRef.current = []

        setPipes([])
        setPowerUps([])

        setGameState(GAME_STATES.RUNNING)
    }, [])

    const handleExitGame = useCallback(() => {
        stopGameLoop()
        stopPipeGeneration()
        stopPowerUpGeneration()

        pipesRef.current = []
        powerUpsRef.current = []

        setPipes([])
        setPowerUps([])

        birdRef.current?.resetSize()
        setIsShrunk(false)
        setScore(0)

        setGameState(GAME_STATES.NOT_RUNNING)
    }, [stopGameLoop, stopPipeGeneration, stopPowerUpGeneration])

    const handlePauseGame = useCallback(() => {
        setGameState(GAME_STATES.STOPPED)
    }, [])

    const handleResumeGame = useCallback(() => {
        setGameState(GAME_STATES.RUNNING)
    }, [])

    // ────────────────────────────────────────────────────────
    // EXPLOSION FX
    // ────────────────────────────────────────────────────────
    const playExplosionSound = useCallback(() => {
        const a = explosionAudioRef.current
        if (!a) return
        a.currentTime = 0
        a.play().catch(() => { })
    }, [])

    const showExplosion = useCallback((x, y, opts = {}) => {
        return new Promise(resolve => {
            if (explosionActiveRef.current) return resolve()

            explosionActiveRef.current = true

            setExplosion({
                x,
                y,
                id: Date.now(),
                src: opts.src
            })

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

        if (shrinkTimerRef.current) clearTimeout(shrinkTimerRef.current)
        birdRef.current?.resetSize()
        setIsShrunk(false)

        await showExplosion(x, y, opts)

        setGameState(GAME_STATES.NOT_RUNNING)
        toast.error(`Game Over! Score: ${scoreRef.current}`)
    }, [stopGameLoop, stopPipeGeneration, stopPowerUpGeneration, showExplosion])

    // ────────────────────────────────────────────────────────
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
