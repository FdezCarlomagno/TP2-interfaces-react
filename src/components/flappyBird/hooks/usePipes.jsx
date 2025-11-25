import { useCallback, useRef } from "react"
import { Pipe } from "../model/Pipe"

export default function usePipes(
    scoreRef,
    screenRef,
    pipesRef,
    setPipes,
){
    const pipeTimerRef = useRef(null)
    
     const startPipeGeneration = useCallback(() => {
            const generate = () => {
                const screenWidth = screenRef.current?.clientWidth || 800
                const screenHeight = screenRef.current?.clientHeight || 600
                const currentScore = scoreRef.current
    
                const gap = Math.max(120, 200 - currentScore * 5)
                const pipe = new Pipe(screenWidth, screenHeight, gap)
    
                pipesRef.current.push(pipe)
                setPipes([...pipesRef.current])
    
                const next = Math.max(1500, 3000 - currentScore * 100)
                pipeTimerRef.current = setTimeout(generate, next)
            }
            generate()
        }, [])
    
        const stopPipeGeneration = useCallback(() => {
            if (pipeTimerRef.current) {
                clearTimeout(pipeTimerRef.current)
                pipeTimerRef.current = null
            }
        }, [])

    return {
        startPipeGeneration,
        stopPipeGeneration
    }
}