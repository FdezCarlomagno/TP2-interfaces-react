import { useCallback } from "react"
import { SHRINK_TIME, SHRINK_SCALE } from "../config/gameConfig"

export default function useGameLoop(
    gameLoopRef,
    screenRef,
    birdRef,
    setBirdPosition,
    pipesRef,
    powerUpsRef,
    shrinkTimerRef,
    setScore,
    setIsShrunk,
    handleGameOverRef,
    setPipes,
    setPowerUps,
    pointAudioRef,
    swooshAudioRef
) {

    // ───────────────────────────────────────────────
    // HELPERS
    // ───────────────────────────────────────────────

    const updateBird = () => {
        const bird = birdRef.current
        bird.update()
        setBirdPosition({ x: bird.x, y: bird.y })
    }

    const updateEntities = () => {
        pipesRef.current.forEach(p => p.update())
        powerUpsRef.current.forEach(p => p.update())
    }

    const handlePowerUpCollision = (bird) => {
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
                collectPowerUp(pu, bird)
            }
        }
    }

    const collectPowerUp = (pu, bird) => {
        const a = pointAudioRef.current
        if (!a) return
        a.currentTime = 0
        a.play().catch(() => { })
        pu.collected = true

        powerUpsRef.current = powerUpsRef.current.filter(x => x !== pu)
        setPowerUps([...powerUpsRef.current])

        setScore(prev => prev + 3)
        applyShrink(bird)
    }

    const applyShrink = (bird) => {
        if (shrinkTimerRef.current) clearTimeout(shrinkTimerRef.current)

        bird.setSize(
            Math.round(bird.baseWidth * SHRINK_SCALE),
            Math.round(bird.baseHeight * SHRINK_SCALE)
        )

        setIsShrunk(true)

        shrinkTimerRef.current = setTimeout(() => {
            bird.resetSize()
            setIsShrunk(false)
            shrinkTimerRef.current = null
            const a = swooshAudioRef.current
            if (!a) return
            a.currentTime = 0
            a.play().catch(() => { })
        }, SHRINK_TIME)

    }

    const handleWorldBoundsCollision = (bird, screenH) => {
        if (bird.checkCollision(screenH)) {
            handleGameOverRef.current?.(bird.x, bird.y)
            return true
        }
        return false
    }

    const handlePipeCollision = (bird) => {
        for (const pipe of pipesRef.current) {

            if (pipe.checkCollision(bird)) {
                handleGameOverRef.current?.(bird.x, bird.y)
                return true
            }

            if (pipe.hasPassed(bird)) {
                setScore(s => s + 1)
            }
        }
        return false
    }

    const cleanupEntities = () => {
        pipesRef.current = pipesRef.current.filter(p => !p.isOffScreen())
        powerUpsRef.current = powerUpsRef.current.filter(p => !p.isOffScreen() && !p.collected)

        setPipes([...pipesRef.current])
        setPowerUps([...powerUpsRef.current])
    }

    // ───────────────────────────────────────────────
    // MAIN LOOP
    // ───────────────────────────────────────────────
    const tick = () => {
        const bird = birdRef.current
        const screenH = screenRef.current?.clientHeight || 600
        if (!bird) return

        updateBird()
        updateEntities()
        handlePowerUpCollision(bird)

        if (handleWorldBoundsCollision(bird, screenH)) return
        if (handlePipeCollision(bird)) return

        cleanupEntities()
    }

    // ───────────────────────────────────────────────
    // PUBLIC API
    // ───────────────────────────────────────────────

    const startGameLoop = useCallback(() => {
        if (gameLoopRef.current) return

        gameLoopRef.current = setInterval(tick, 1000 / 60)
    }, [])

    const stopGameLoop = useCallback(() => {
        if (gameLoopRef.current) {
            clearInterval(gameLoopRef.current)
            gameLoopRef.current = null
        }
    }, [])

    return {
        startGameLoop,
        stopGameLoop
    }
}
