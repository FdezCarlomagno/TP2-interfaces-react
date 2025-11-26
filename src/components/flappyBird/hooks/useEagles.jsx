/**
 * useEagles.js - Hook for eagle generation and management
 */

import { useCallback } from 'react'
import { Eagle } from '../model/Eagle'

export default function useEagles(
    screenRef,
    eaglesRef,
    setEagles
) {
    const eagleIntervalRef = { current: null }

    const generateEagle = useCallback(() => {
        if (!screenRef.current) return

        const screenWidth = screenRef.current.clientWidth
        const screenHeight = screenRef.current.clientHeight

        // Random Y position (top 60% of screen)
        const minY = 50
        const maxY = screenHeight * 0.6
        const randomY = minY + Math.random() * (maxY - minY)

        // Start from right edge
        const eagle = new Eagle(screenWidth + 100, randomY, screenWidth)
        
        eaglesRef.current.push(eagle)
        setEagles([...eaglesRef.current])
    }, [screenRef, eaglesRef, setEagles])

    const startEagleGeneration = useCallback(() => {
        if (eagleIntervalRef.current) return

        // Generate eagle every 8-15 seconds
        const scheduleNext = () => {
            const delay = 8000 + Math.random() * 7000
            eagleIntervalRef.current = setTimeout(() => {
                generateEagle()
                scheduleNext()
            }, delay)
        }

        scheduleNext()
    }, [generateEagle])

    const stopEagleGeneration = useCallback(() => {
        if (eagleIntervalRef.current) {
            clearTimeout(eagleIntervalRef.current)
            eagleIntervalRef.current = null
        }
    }, [])

    return {
        startEagleGeneration,
        stopEagleGeneration
    }
}