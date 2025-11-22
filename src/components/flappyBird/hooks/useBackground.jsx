import { useState, useCallback } from 'react'

export const PARALLAX_BACKGROUNDS = {
    BG1: 'BG1',
    BG2: 'BG2',
    BG3: 'BG3'
}

export const useBackground = () => {
    const [background, setBackground] = useState(PARALLAX_BACKGROUNDS.BG1)

    const changeBackground = useCallback((newBackground) => {
        setBackground(newBackground)
    }, [])

    return {
        background,
        changeBackground
    }
}