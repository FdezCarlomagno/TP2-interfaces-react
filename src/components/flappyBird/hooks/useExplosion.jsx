import { useState, useRef, useCallback } from 'react'
import explosionSfx from '../../../assets/flappyBird/Explosion.mp3'

export const useExplosion = () => {
    const [explosion, setExplosion] = useState(null)
    const explosionActiveRef = useRef(false)
    const explosionAudioRef = useRef(null)

    const initializeAudio = useCallback(() => {
        try {
            if (explosionSfx) {
                const audio = new Audio(explosionSfx)
                audio.preload = 'auto'
                audio.volume = 0.85
                explosionAudioRef.current = audio
            }
        } catch (error) {
            explosionAudioRef.current = null
        }
    }, [])

    const playExplosionSound = useCallback(() => {
        try {
            const audio = explosionAudioRef.current
            if (audio) {
                audio.currentTime = 0
                audio.play().catch(() => {})
            }
        } catch (error) {
            // Ignorar errores de reproducción
        }
    }, [])

    const showExplosion = useCallback((x, y, birdRef, opts = {}) => {
        return new Promise((resolve) => {
            if (explosionActiveRef.current) return resolve()
            
            explosionActiveRef.current = true
            
            // Centrar explosión en el centro del pájaro
            const birdWidth = birdRef?.current?.width || 34
            const birdHeight = birdRef?.current?.height || 24
            const explosionX = x + birdWidth / 2
            const explosionY = y + birdHeight / 2
            
            const payload = { 
                x: explosionX, 
                y: explosionY, 
                id: Date.now(), 
                src: opts.src 
            }
            
            setExplosion(payload)
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
        showExplosion,
        initializeAudio
    }
}