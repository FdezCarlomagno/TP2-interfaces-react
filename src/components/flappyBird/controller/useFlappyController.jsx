import { useState, useEffect, useRef, useCallback } from 'react'
import { Bird } from '../model/Bird'
import toast from 'react-hot-toast'
import explosionSfx from '../../../assets/flappyBird/Explosion.mp3'
import audio_point from '../../../assets/flappyBird/audio/audio_point.wav'
import audio_swoosh from '../../../assets/flappyBird/audio/audio_swoosh.wav'
import audio_wing from '../../../assets/flappyBird/audio/audio_wing.wav'
import audio_die from '../../../assets/flappyBird/audio/audio_die.wav'

import { PARALLAX_BACKGROUNDS, GAME_STATES } from '../config/gameConfig'
import usePipes from '../hooks/usePipes'
import usePowerUp from '../hooks/usePowerUp'
import useEagles from '../hooks/useEagles'  // NEW
import useGameLoop from '../hooks/useGameLoop'
import useExplosion from '../hooks/useExplosion'

export function useFlappyController() {
    const [gameState, setGameState] = useState(GAME_STATES.NOT_RUNNING)
    const [background, setBackground] = useState(PARALLAX_BACKGROUNDS.BG1)
    const [score, setScore] = useState(0)
    const [birdPosition, setBirdPosition] = useState({ x: 100, y: 250 })
    const [pipes, setPipes] = useState([])
    const [powerUps, setPowerUps] = useState([])
    const [eagles, setEagles] = useState([])  // NEW
    const [isShrunk, setIsShrunk] = useState(false)

    const birdRef = useRef(null)
    const screenRef = useRef(null)

    const pipesRef = useRef([])
    const powerUpsRef = useRef([])
    const eaglesRef = useRef([])  // NEW
    const scoreRef = useRef(0)

    const gameLoopRef = useRef(null)
    const powerUpTimerRef = useRef(null)
    const shrinkTimerRef = useRef(null)

    const explosionAudioRef = useRef(null)
    const pointAudioRef = useRef(null)
    const wingAudioRef = useRef(null)
    const dieAudioRef = useRef(null)
    const swooshAudioRef = useRef(null)

    const handleGameOverRef = useRef(null)


    // ────────────────────────────────────────────────────────
    // INIT
    // ────────────────────────────────────────────────────────
    const initAudios = () => {
        try {
            const a = new Audio(explosionSfx)
            a.preload = 'auto'
            a.volume = 0.40
            explosionAudioRef.current = a

            const pointAudio = new Audio(audio_point)
            pointAudio.preload = 'auto'
            pointAudio.volume = 0.60
            pointAudioRef.current = pointAudio

            const wingAudio = new Audio(audio_wing)
            wingAudio.preload = 'auto'
            wingAudio.volume = 0.60
            wingAudioRef.current = wingAudio

            const dieAudio = new Audio(audio_die)
            dieAudio.preload = 'auto'
            dieAudio.volume = 1
            dieAudioRef.current = dieAudio

            const swooshAudio = new Audio(audio_swoosh)
            swooshAudio.preload = 'auto'
            swooshAudio.volume = 0.60
            swooshAudioRef.current = swooshAudio
        } catch {
            explosionAudioRef.current = null
            wingAudioRef.current = null
            dieAudioRef.current = null
            pointAudioRef.current = null
            swooshAudioRef.current = null
        }
    }


    useEffect(() => {
        birdRef.current = new Bird(100, 250)
        initAudios()
    }, [])

    useEffect(() => {
        scoreRef.current = score
    }, [score])

    // ────────────────────────────────────────────────────────
    // EXPLOSION
    // ────────────────────────────────────────────────────────
    const { explosion, showExplosion } = useExplosion(explosionAudioRef)

    // ────────────────────────────────────────────────────────
    // PIPES + POWERUPS + EAGLES
    // ────────────────────────────────────────────────────────
    const { startPipeGeneration, stopPipeGeneration } = usePipes(
        scoreRef,
        screenRef,
        pipesRef,
        setPipes
    )

    const { startPowerUpGeneration, stopPowerUpGeneration } = usePowerUp(
        pipesRef,
        screenRef,
        setPowerUps,
        powerUpsRef,
        powerUpTimerRef
    )

    // NEW: Eagles hook
    const { startEagleGeneration, stopEagleGeneration } = useEagles(
        screenRef,
        eaglesRef,
        setEagles
    )


    // ────────────────────────────────────────────────────────
    // GAME LOOP (con handleGameOverRef)
    // ────────────────────────────────────────────────────────
    const { startGameLoop, stopGameLoop } = useGameLoop(
        gameLoopRef,
        screenRef,
        birdRef,
        setBirdPosition,
        pipesRef,
        powerUpsRef,
        eaglesRef,  // NEW
        shrinkTimerRef,
        setScore,
        setIsShrunk,
        handleGameOverRef,
        setPipes,
        setPowerUps,
        setEagles,  // NEW
        pointAudioRef,
        swooshAudioRef
    )


    // ────────────────────────────────────────────────────────
    // INPUT
    // ────────────────────────────────────────────────────────
    const handleJump = useCallback(() => {
        if (gameState === GAME_STATES.RUNNING) {
            const a = wingAudioRef.current
            if (!a) return
            a.currentTime = 0
            a.play().catch(() => { })
            birdRef.current?.jump()
        }
    }, [gameState])


    // ────────────────────────────────────────────────────────
    // GAME OVER 
    // ────────────────────────────────────────────────────────
    const handleGameOver = useCallback(async (x, y, opts = {}) => {
        const a = dieAudioRef.current
        if (!a) return
        a.currentTime = 0
        a.play().catch(() => { })
        birdRef.current?.jump()
        stopGameLoop()
        stopPipeGeneration()
        stopPowerUpGeneration()
        stopEagleGeneration()  // NEW

        if (shrinkTimerRef.current) clearTimeout(shrinkTimerRef.current)
        birdRef.current?.resetSize()
        setIsShrunk(false)

        await showExplosion(x, y, opts)

        setGameState(GAME_STATES.NOT_RUNNING)
        
        // NEW: Different message if hit by eagle
        const message = opts.hitByEagle 
            ? `Caught by Eagle! Score: ${scoreRef.current}`
            : `Game Over! Score: ${scoreRef.current}`
        toast.error(message)
    }, [stopGameLoop, stopPipeGeneration, stopPowerUpGeneration, stopEagleGeneration, showExplosion])

    // *** Seteamos la ref acá ***
    handleGameOverRef.current = handleGameOver


    // ────────────────────────────────────────────────────────
    // GAME STATE
    // ────────────────────────────────────────────────────────
    useEffect(() => {
        if (gameState === GAME_STATES.RUNNING) {
            startGameLoop()
            startPipeGeneration()
            startPowerUpGeneration()
            startEagleGeneration()  // NEW
        } else {
            stopGameLoop()
            stopPipeGeneration()
            stopPowerUpGeneration()
            stopEagleGeneration()  // NEW
        }

        return () => {
            stopGameLoop()
            stopPipeGeneration()
            stopPowerUpGeneration()
            stopEagleGeneration()  // NEW
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
        eaglesRef.current = []  // NEW

        setPipes([])
        setPowerUps([])
        setEagles([])  // NEW

        setGameState(GAME_STATES.RUNNING)
    }, [])

    const handleExitGame = useCallback(() => {
        stopGameLoop()
        stopPipeGeneration()
        stopPowerUpGeneration()
        stopEagleGeneration()  // NEW

        pipesRef.current = []
        powerUpsRef.current = []
        eaglesRef.current = []  // NEW

        setPipes([])
        setPowerUps([])
        setEagles([])  // NEW

        birdRef.current?.resetSize()
        setIsShrunk(false)
        setScore(0)

        setGameState(GAME_STATES.NOT_RUNNING)
    }, [stopGameLoop, stopPipeGeneration, stopPowerUpGeneration, stopEagleGeneration])

    const handleResumeGame = useCallback(() => {
        setGameState(GAME_STATES.RUNNING)
    }, [])


    // ────────────────────────────────────────────────────────
    return {
        gameState,
        background,
        explosion,
        score,
        powerUps,
        eagles,  // NEW
        isShrunk,
        birdPosition,
        pipes,
        screenRef,
        birdRef,  // NEW: Expose for debug
        handleJump,
        handleStartGame,
        handleExitGame,
        handleResumeGame,
        setBackground
    }
}

export default useFlappyController