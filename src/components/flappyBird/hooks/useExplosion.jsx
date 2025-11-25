import { useState, useRef, useCallback } from 'react'
import explosionImg from '../../../assets/flappyBird/Explosion.png'

export function useExplosion(explosionAudioRef) {
    const [explosion, setExplosion] = useState(null)
    const explosionActiveRef = useRef(false)

    const playExplosionSound = useCallback(() => {
        const a = explosionAudioRef.current
        if (!a) return
        a.currentTime = 0
        a.play().catch(() => {})
    }, [explosionAudioRef])

    const showExplosion = useCallback((x, y, opts = {}) => {
        return new Promise(resolve => {
            if (explosionActiveRef.current) return resolve()

            explosionActiveRef.current = true
            setExplosion({
                x,
                y,
                id: Date.now(),
                src: opts.src || explosionImg
            })

            playExplosionSound()

            setTimeout(() => {
                setExplosion(null)
                explosionActiveRef.current = false
                resolve()
            }, opts.duration || 700)
        })
    }, [playExplosionSound])

    return {
        explosion,
        showExplosion
    }
}

export default useExplosion