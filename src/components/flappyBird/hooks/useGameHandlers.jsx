import { useCallback, useRef } from 'react'
import toast from 'react-hot-toast'
import { GAME_STATES } from '../config/gameConfig'

export function useGameHandlers({
    birdRef,
    gameState,
    setGameState,
    setBirdPosition,
    setScore,
    setIsShrunk,
    setPipes,
    setPowerUps,
    pipesRef,
    powerUpsRef,
    scoreRef,
    shrinkTimerRef,
    stopGameLoop,
    stopPipeGeneration,
    stopPowerUpGeneration,
    showExplosion
}) {
    // Ref para evitar dependencias circulares
    const handleGameOverRef = useRef(null)

    // ────────────────────────────────────────────────────────
    // JUMP
    // ────────────────────────────────────────────────────────
    const handleJump = useCallback(() => {
        if (gameState === GAME_STATES.RUNNING) {
            birdRef.current?.jump()
        }
    }, [gameState, birdRef])

    // ────────────────────────────────────────────────────────
    // GAME OVER
    // ────────────────────────────────────────────────────────
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
    }, [
        stopGameLoop,
        stopPipeGeneration,
        stopPowerUpGeneration,
        showExplosion,
        birdRef,
        shrinkTimerRef,
        setIsShrunk,
        setGameState,
        scoreRef
    ])

    // Actualizar la ref
    handleGameOverRef.current = handleGameOver

    // ────────────────────────────────────────────────────────
    // START GAME
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
    }, [
        birdRef,
        setBirdPosition,
        setScore,
        setIsShrunk,
        pipesRef,
        powerUpsRef,
        setPipes,
        setPowerUps,
        setGameState
    ])

    // ────────────────────────────────────────────────────────
    // EXIT GAME
    // ────────────────────────────────────────────────────────
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
    }, [
        stopGameLoop,
        stopPipeGeneration,
        stopPowerUpGeneration,
        pipesRef,
        powerUpsRef,
        setPipes,
        setPowerUps,
        birdRef,
        setIsShrunk,
        setScore,
        setGameState
    ])

    // ────────────────────────────────────────────────────────
    // RESUME GAME
    // ────────────────────────────────────────────────────────
    const handleResumeGame = useCallback(() => {
        setGameState(GAME_STATES.RUNNING)
    }, [setGameState])

    return {
        handleJump,
        handleGameOver,
        handleGameOverRef,
        handleStartGame,
        handleExitGame,
        handleResumeGame
    }
}

export default useGameHandlers