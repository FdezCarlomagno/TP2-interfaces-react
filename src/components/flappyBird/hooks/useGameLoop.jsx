import { useRef, useCallback, useEffect } from 'react'
import { Bird } from '../model/Bird'
import explosionImg from '../../../assets/flappyBird/Explosion.png'

export const useGameLoop = (screenRef, gameState, onGameOver, onScoreUpdate) => {
    const birdRef = useRef(null)
    const gameLoopRef = useRef(null)
    const pipesRef = useRef([])
    const scoreRef = useRef(0)

    const startGameLoop = useCallback(() => {
        gameLoopRef.current = setInterval(() => {
            const bird = birdRef.current
            const screenHeight = screenRef.current?.clientHeight || 600

            if (!bird) return

            // Actualizar física del pájaro
            bird.update()

            // Actualizar tuberías
            pipesRef.current.forEach(pipe => pipe.update())

            // Verificar colisión con el suelo
            if (bird.checkCollision(screenHeight)) {
                onGameOver(bird.x, screenHeight - bird.height / 2, { src: explosionImg })
                return
            }

            // Verificar colisiones con tuberías y puntos
            for (let pipe of pipesRef.current) {
                if (pipe.checkCollision(bird)) {
                    onGameOver(bird.x, bird.y, { src: explosionImg })
                    return
                }

                // Verificar si el pájaro pasó la tubería (sumar puntos)
                if (pipe.hasPassed(bird)) {
                    onScoreUpdate(prev => prev + 1)
                }
            }

            // Eliminar tuberías que salieron de la pantalla
            pipesRef.current = pipesRef.current.filter(pipe => !pipe.isOffScreen())

        }, 1000 / 60) // 60 FPS
    }, [screenRef, onGameOver, onScoreUpdate])

    const stopGameLoop = useCallback(() => {
        if (gameLoopRef.current) {
            clearInterval(gameLoopRef.current)
            gameLoopRef.current = null
        }
    }, [])

    const initializeBird = useCallback((x = 100, y = 250) => {
        birdRef.current = new Bird(x, y)
    }, [])

    const resetBird = useCallback((x = 100, y = 250) => {
        if (birdRef.current) {
            birdRef.current.reset(x, y)
        }
    }, [])

    const getBirdPosition = useCallback(() => {
        return birdRef.current ? { x: birdRef.current.x, y: birdRef.current.y } : { x: 100, y: 250 }
    }, [])

    const jump = useCallback(() => {
        if (birdRef.current) {
            birdRef.current.jump()
        }
    }, [])

    const clearPipes = useCallback(() => {
        pipesRef.current = []
    }, [])

    const addPipe = useCallback((pipe) => {
        pipesRef.current.push(pipe)
    }, [])

    const getPipes = useCallback(() => {
        return [...pipesRef.current]
    }, [])

    // Control del game loop basado en el estado del juego
    useEffect(() => {
        if (gameState === 'RUNNING') {
            startGameLoop()
        } else {
            stopGameLoop()
        }

        return () => {
            stopGameLoop()
        }
    }, [gameState, startGameLoop, stopGameLoop])

    return {
        initializeBird,
        resetBird,
        getBirdPosition,
        jump,
        clearPipes,
        addPipe,
        getPipes,
        scoreRef
    }
}