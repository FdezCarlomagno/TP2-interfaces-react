import { useCallback } from "react"
import { SHRINK_TIME, SHRINK_SCALE } from "../config/gameConfig"

export default function useGameLoop(
    gameLoopRef,
    screenRef,
    birdRef,
    setBirdPosition,
    pipesRef,
    powerUpsRef,
    eaglesRef,
    shrinkTimerRef,
    setScore,
    setIsShrunk,
    handleGameOverRef,
    setPipes,
    setPowerUps,
    setEagles,
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
        // CRITICAL: Update entities IN-PLACE on the ref
        // Don't create new arrays, just call update() on each object
        pipesRef.current.forEach(p => p.update())
        powerUpsRef.current.forEach(p => p.update())
        eaglesRef.current.forEach(e => e.update())
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

    // CRITICAL FIX: Use ref directly, check collision IMMEDIATELY after update
    const handleEagleCollision = (bird) => {
        const eagles = eaglesRef.current
        
        for (let i = 0; i < eagles.length; i++) {
            const eagle = eagles[i]
            
            if (eagle.collected) continue

            // VERIFY: Eagle position is valid
            if (isNaN(eagle.x) || isNaN(eagle.y)) {
                console.error(`❌ Eagle ${i} has invalid position!`, eagle)
                continue
            }

            // Get CURRENT hitboxes (after update was called)
            const birdBox = bird.getHitbox()
            const eagleBox = eagle.getHitbox()

            // VERIFY: Hitboxes are valid
            if (isNaN(eagleBox.x) || isNaN(eagleBox.y)) {
                console.error(`❌ Eagle ${i} hitbox is invalid!`, eagleBox)
                continue
            }

            // Direct collision check
            const isColliding = !(
                birdBox.x + birdBox.width < eagleBox.x ||
                birdBox.x > eagleBox.x + eagleBox.width ||
                birdBox.y + birdBox.height < eagleBox.y ||
                birdBox.y > eagleBox.y + eagleBox.height
            )

            if (isColliding) {
                const distance = Math.sqrt(
                    Math.pow(eagle.x - bird.x, 2) + 
                    Math.pow(eagle.y - bird.y, 2)
                )
                
                console.log('🦅💥 COLLISION DETECTED!', {
                    eagleId: eagle.id,
                    eagleActualPos: { x: Math.round(eagle.x), y: Math.round(eagle.y) },
                    eagleSpeed: eagle.speed,
                    eagleBox: {
                        x: Math.round(eagleBox.x),
                        y: Math.round(eagleBox.y),
                        w: Math.round(eagleBox.width),
                        h: Math.round(eagleBox.height)
                    },
                    birdBox: {
                        x: Math.round(birdBox.x),
                        y: Math.round(birdBox.y),
                        w: Math.round(birdBox.width),
                        h: Math.round(birdBox.height)
                    },
                    distance: Math.round(distance),
                    updateCount: eagle.updateCount
                })
                
                eagle.collected = true
                handleGameOverRef.current?.(bird.x, bird.y, { hitByEagle: true })
                return true
            }
        }
        return false
    }

    const collectPowerUp = (pu, bird) => {
        const a = pointAudioRef.current
        if (a) {
            a.currentTime = 0
            a.play().catch(() => { })
        }
        
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
            if (a) {
                a.currentTime = 0
                a.play().catch(() => { })
            }
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
        const pipesBefore = pipesRef.current.length
        const eaglesBefore = eaglesRef.current.length
        
        pipesRef.current = pipesRef.current.filter(p => !p.isOffScreen())
        powerUpsRef.current = powerUpsRef.current.filter(p => !p.isOffScreen() && !p.collected)
        eaglesRef.current = eaglesRef.current.filter(e => !e.isOffScreen() && !e.collected)

        // Only update state if something changed (reduce re-renders)
        if (pipesRef.current.length !== pipesBefore) {
            setPipes([...pipesRef.current])
        }
        
        if (eaglesRef.current.length !== eaglesBefore) {
            setEagles([...eaglesRef.current])
        }
        
        setPowerUps([...powerUpsRef.current])
    }

    // ───────────────────────────────────────────────
    // MAIN LOOP - SYNCHRONOUS EXECUTION
    // ───────────────────────────────────────────────
    const tick = () => {
        const bird = birdRef.current
        const screenH = screenRef.current?.clientHeight || 600
        if (!bird) return

        // CRITICAL: All updates happen synchronously in order
        // 1. Update bird
        updateBird()
        
        // 2. Update all entities (modifies objects in-place)
        updateEntities()
        
        // 3. Check collisions using UPDATED positions
        handlePowerUpCollision(bird)
        
        if (handleWorldBoundsCollision(bird, screenH)) return
        if (handlePipeCollision(bird)) return
        if (handleEagleCollision(bird)) return  // Uses ref directly

        // 4. Cleanup
        cleanupEntities()
    }

    // ───────────────────────────────────────────────
    // PUBLIC API
    // ───────────────────────────────────────────────

    const startGameLoop = useCallback(() => {
        if (gameLoopRef.current) return
        
        console.log('🎮 Game loop started')
        gameLoopRef.current = setInterval(tick, 1000 / 60)
    }, [])

    const stopGameLoop = useCallback(() => {
        if (gameLoopRef.current) {
            console.log('🎮 Game loop stopped')
            clearInterval(gameLoopRef.current)
            gameLoopRef.current = null
        }
    }, [])

    return {
        startGameLoop,
        stopGameLoop
    }
}