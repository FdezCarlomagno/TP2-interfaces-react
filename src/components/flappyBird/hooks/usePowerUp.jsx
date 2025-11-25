import { useCallback } from "react"
import { PowerUp } from "../model/PowerUp"

export default function usePowerUp(
    pipesRef,
    screenRef,
    setPowerUps,
    powerUpsRef,
    powerUpTimerRef
){
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

    return {
        startPowerUpGeneration,
        stopPowerUpGeneration
    }
}