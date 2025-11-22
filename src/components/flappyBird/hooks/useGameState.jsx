import { useState, useCallback } from 'react'

export const GAME_STATES = {
    RUNNING: 'RUNNING',
    NOT_RUNNING: 'NOT_RUNNING',
    STOPPED: 'STOPPED'
}

export const useGameState = () => {
    const [gameState, setGameState] = useState(GAME_STATES.NOT_RUNNING)

    const startGame = useCallback(() => {
        setGameState(GAME_STATES.RUNNING)
    }, [])

    const pauseGame = useCallback(() => {
        setGameState(GAME_STATES.STOPPED)
    }, [])

    const resumeGame = useCallback(() => {
        setGameState(GAME_STATES.RUNNING)
    }, [])

    const stopGame = useCallback(() => {
        setGameState(GAME_STATES.NOT_RUNNING)
    }, [])

    return {
        gameState,
        startGame,
        pauseGame,
        resumeGame,
        stopGame
    }
}