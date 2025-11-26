import { useEffect } from 'react'
import { motion } from 'framer-motion'
import './flappyBird.css'
import './parallax.css'
import useFlappyController from '../controller/useFlappyController'
import ScoreDisplay from '../view/components/UI/ScoreDisplay'
import Pipes from './components/objects/Pipes'
import Bird from './components/objects/Bird'
import Explosion from './components/UI/Explosion'
import PowerUp from './components/objects/PowerUp'
import Eagles from './components/objects/Eagles'
import { GAME_STATES, PARALLAX_BACKGROUNDS } from '../config/gameConfig'
import InGameUI from './components/UI/InGameUI'
import BG1 from './components/UI/Backgrounds/Background1'
import BG2 from './components/UI/Backgrounds/Background2'
import BG3 from './components/UI/Backgrounds/Background3'
import StartScreen from './components/UI/StartScreen'
import DebugHitboxes from './components/UI/DebugHitboxes'


export default function FlappyBird() {
    const {
        gameState,
        background,
        explosion,
        score,
        powerUps,
        eagles,
        isShrunk,
        birdPosition,
        pipes,
        screenRef,
        birdRef,  // ✅ NEW: Needed for debug
        handleJump,
        handleStartGame,
        handleExitGame,
        handleResumeGame,   
        setBackground
    } = useFlappyController()

    // Manejar teclas (Espacio para saltar, ESC para pausar)
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.code === 'Space' && gameState === GAME_STATES.RUNNING) {
                e.preventDefault()
                handleJump()
            }
        }
        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [gameState, handleJump])

    return (
        <div
            className="flappy-bird-screen"
            ref={screenRef}
            onClick={handleJump}
        >
            {gameState === GAME_STATES.RUNNING && (
                <>
                   <InGameUI 
                        handleExitGame={handleExitGame}
                   />

                    <ScoreDisplay score={score}/>

                    {/* Renderizar tuberías */}
                    <Pipes pipes={pipes}/>

                    {/* Renderizar power-ups */}
                    <PowerUp powerUps={powerUps}/>

                    {/* Renderizar águilas */}
                    <Eagles eagles={eagles}/>

                    {/* El pájaro con spritesheet */}
                    <Bird 
                        isShrunk={isShrunk} 
                        birdPosition={birdPosition}
                    />

                    <Explosion explosion={explosion}/>

                    {/* ✅ DEBUG: Shows hitboxes - REMOVE AFTER FIXING
                    <DebugHitboxes birdRef={birdRef} eagles={eagles} /> */}
                </>
            )}

            {background == PARALLAX_BACKGROUNDS.BG1 && <>
                <BG1></BG1>
            </>}
            {background == PARALLAX_BACKGROUNDS.BG2 && <>
                <BG2></BG2>
            </>}
            {background == PARALLAX_BACKGROUNDS.BG3 && <>
                <BG3></BG3>
            </>}

            {gameState === GAME_STATES.NOT_RUNNING && (
                <>
                   <StartScreen 
                    setBackground={setBackground}
                    background={background}
                    handleStartGame={handleStartGame}
                   />
                </>
            )}
        </div>
    )
}