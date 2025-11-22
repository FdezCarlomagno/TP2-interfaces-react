import { useRef, useCallback, useEffect } from 'react'
import { Pipe } from '../model/Pipe'

export const usePipeGeneration = (screenRef, gameState, score, onPipeAdded) => {
    const pipeTimerRef = useRef(null)
    const scoreRef = useRef(0)

    const getIntervalByScore = useCallback((currentScore) => {
        return Math.max(1500, 3000 - currentScore * 100)
    }, [])

    const getGapByScore = useCallback((currentScore) => {
        return Math.max(120, 200 - currentScore * 5)
    }, [])

    const generatePipe = useCallback(() => {
        const screenWidth = screenRef.current?.clientWidth || 800
        const screenHeight = screenRef.current?.clientHeight || 600

        const currentScore = scoreRef.current
        const gap = getGapByScore(currentScore)
        const newPipe = new Pipe(screenWidth, screenHeight, gap)

        onPipeAdded(newPipe)

        const nextInterval = getIntervalByScore(currentScore)
        console.log("Next pipe in:", nextInterval, "ms - Score:", currentScore)

        pipeTimerRef.current = setTimeout(generatePipe, nextInterval)
    }, [screenRef, getGapByScore, getIntervalByScore, onPipeAdded])

    const startPipeGeneration = useCallback(() => {
        generatePipe()
    }, [generatePipe])

    const stopPipeGeneration = useCallback(() => {
        if (pipeTimerRef.current) {
            clearTimeout(pipeTimerRef.current)
            pipeTimerRef.current = null
        }
    }, [])

    // Sincronizar score con la referencia
    useEffect(() => {
        scoreRef.current = score
    }, [score])

    // Control de la generación de tuberías basado en el estado del juego
    useEffect(() => {
        if (gameState === 'RUNNING') {
            startPipeGeneration()
        } else {
            stopPipeGeneration()
        }

        return () => {
            stopPipeGeneration()
        }
    }, [gameState, startPipeGeneration, stopPipeGeneration])

    return {
        stopPipeGeneration
    }
}