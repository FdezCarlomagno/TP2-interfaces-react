"use client"

import { useRef, useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"
import toast from "react-hot-toast"
import messiFace from "../../assets/imgs/messiFace.png"
import messiBlocka2 from "../../assets/imgs/messiBlocka2.jpg"
import messiBlocka3 from "../../assets/imgs/messiBlocka3.jpg"
import messiBlocka4 from "../../assets/imgs/messiBlocka4.jpg"
import messiBlocka5 from "../../assets/imgs/messiBlocka5.jpg"
import messiBlocka6 from "../../assets/imgs/messiBlocka6.jpg"
import useTimer from "../Peg/Timer/useTimer"
import { getQuadrant } from "./utils/getQuadrant"
import { useRotateQuadrant } from "./utils/rotateQuadrant"
import useHandler from "./hooks/useHandler"
import useCanvas from "./hooks/useCanvas"
import GameComplete from './blockaComponents/GameComplete'
import GameControls from './blockaComponents/GameControls'
import ImagePreview from './blockaComponents/ImagePreview'
import FinalPreview from './blockaComponents/FinalPreview'
import Instructions from './blockaComponents/Instructions'
import LevelComplete from './blockaComponents/LevelComplete'
import TimerDisplay from './blockaComponents/TimerDisplay'

import "../blockaGame/BlockaGame.css"

const LEVEL_IMAGES = [messiFace, messiBlocka2, messiBlocka3, messiBlocka4, messiBlocka5, messiBlocka6]

const GAME_CONFIG = {
  MAX_LEVEL: 15,
  BASE_TIME: 25000,
  TIME_REDUCTION_PER_LEVEL: 1000,
  MIN_TIME: 5000,
  PREVIEW_ANIMATION_CYCLES: 15,
  PREVIEW_ANIMATION_SPEED: 120,
  PREVIEW_DISPLAY_DURATION: 1000,
  GAME_COMPLETE_DELAY: 3000,
  TIME_EXCEEDED_DELAY: 4000,
  HELP_PENALTY: 5000,
}

const ROTATION_ANGLES = [0, 90, 180, 270]


export default function BlockaGameV2({ size = 260, initialLevel = 0, onExit }) {
  const rotateQuadrant = useRotateQuadrant()
  const canvasRef = useRef(null)
  const imgRef = useRef(null)
  const devicePixelRatioRef = useRef(window.devicePixelRatio || 1)

  const [rotations, setRotations] = useState([0, 90, 180, 270])
  const [level, setLevel] = useState(initialLevel)
  const [loaded, setLoaded] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [imageSrc, setImageSrc] = useState(messiFace)
  const [showInstructions, setShowInstructions] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [uiHidden, setUiHidden] = useState(false)
  const [showLevelPreview, setShowLevelPreview] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [finalPreviewImage, setFinalPreviewImage] = useState(null)
  const [maxTime, setMaxTime] = useState(0)
  const [helpDisabled, setHelpDisabled] = useState(false)
  const [levelTimes, setLevelTimes] = useState({})
  const [showCleanImage, setShowCleanImage] = useState(false)

  const { 
    levelTimer, 
    setLevelTimer, 
    iniciarCronometro, 
    detenerCronometro, 
    formatearTiempo, 
    resetearCronometro 
} =
    useTimer()

  const { 
    getCanvasClassName, 
    draw 
} = useCanvas(
    canvasRef,
    imgRef,
    devicePixelRatioRef,
    level,
    isCompleted,
    showCleanImage,
    rotations,
    size,
    gameCompleted,
    showLevelPreview,
    finalPreviewImage,
  )

  const {
    handleLevelCompletion,
    handleAyuda,
    handleCloseInstructions,
    handleExitGame,
    handleResetGame,
    handleShowInstructions,
  } = useHandler(
    setHelpDisabled,
    setIsCompleted,
    setUiHidden,
    setShowCleanImage,
    draw,
    setLevel,
    detenerCronometro,
    onExit,
    gameCompleted,
    isCompleted,
    rotations,
    canvasRef,
    setLevelTimer,
    setShowInstructions,
    setRotations,
  )

  const calculateMaxTime = (currentLevel) => {
    return Math.max(GAME_CONFIG.MIN_TIME, GAME_CONFIG.BASE_TIME - currentLevel * GAME_CONFIG.TIME_REDUCTION_PER_LEVEL)
  }

  const generateRandomRotations = () => {
    return [0, 1, 2, 3].map(() => ROTATION_ANGLES[Math.floor(Math.random() * 4)])
  }

  const resetGame = () => {
    setLevel(0)
    setGameCompleted(false)
    setIsCompleted(false)
    setLevelTimes({})
    setUiHidden(false)
    setShowCleanImage(false)
  }

  useEffect(() => {
    if (level >= GAME_CONFIG.MAX_LEVEL) {
      setGameCompleted(true)
      detenerCronometro()
      setUiHidden(true)
      const timer = setTimeout(resetGame, GAME_CONFIG.GAME_COMPLETE_DELAY)
      return () => clearTimeout(timer)
    }

    setShowLevelPreview(true)
    setUiHidden(true)
    setShowCleanImage(false)
    setMaxTime(calculateMaxTime(level))

    let cycleCount = 0
    const interval = setInterval(() => {
      setSelectedImageIndex((prev) => (prev + 1) % LEVEL_IMAGES.length)
      cycleCount++

      if (cycleCount > GAME_CONFIG.PREVIEW_ANIMATION_CYCLES) {
        clearInterval(interval)
        const randomIndex = Math.floor(Math.random() * LEVEL_IMAGES.length)
        setSelectedImageIndex(randomIndex)
        setFinalPreviewImage(LEVEL_IMAGES[randomIndex])

        setTimeout(() => {
          setImageSrc(LEVEL_IMAGES[randomIndex])
          setFinalPreviewImage(null)
          setShowLevelPreview(false)
          setUiHidden(false)
          setRotations(generateRandomRotations())
          setIsCompleted(false)
          setShowCleanImage(false)
          resetearCronometro()
          iniciarCronometro()
        }, GAME_CONFIG.PREVIEW_DISPLAY_DURATION)
      }
    }, GAME_CONFIG.PREVIEW_ANIMATION_SPEED)

    return () => clearInterval(interval)
  }, [level])

  useEffect(() => {
    if (isCompleted && levelTimer.corriendo) {
      setLevelTimes((prev) => ({ ...prev, [level]: levelTimer.tiempo }))
      detenerCronometro()
      return
    }

    if (maxTime > 0 && levelTimer.tiempo >= maxTime && levelTimer.corriendo) {
      detenerCronometro()
      setUiHidden(true)
      toast.error("⏰ Tiempo máximo alcanzado. Reiniciando...")

      setTimeout(() => {
        setLevel(0)
        resetearCronometro()
        setLevelTimes({})
        setIsCompleted(false)
        setUiHidden(false)
        setShowCleanImage(false)
        iniciarCronometro()
      }, GAME_CONFIG.TIME_EXCEEDED_DELAY)
    }
  }, [levelTimer.tiempo, maxTime, isCompleted, levelTimer.corriendo])

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = imageSrc && imageSrc.default ? imageSrc.default : imageSrc
    img.onload = () => {
      imgRef.current = img
      setLoaded(true)
      draw()
    }
  }, [imageSrc, draw])

  useEffect(() => {
    if (!loaded || isCompleted || gameCompleted) return
    const completed = rotations.every((r) => Math.abs(r % 360) < 1)
    if (completed) handleLevelCompletion()
  }, [rotations, loaded, isCompleted, gameCompleted, handleLevelCompletion])

  useEffect(() => {
    if (loaded) draw()
  }, [rotations, level, draw, loaded, showCleanImage])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handlePointerDown = (e) => {
      if (showInstructions || isCompleted || gameCompleted) return

      const rect = canvas.getBoundingClientRect()
      const x = ((e.clientX - rect.left) * canvas.width) / rect.width
      const y = ((e.clientY - rect.top) * canvas.height) / rect.height
      const quadrant = getQuadrant(x, y, canvas.width, canvas.height)

      if (e.button === 0) {
        rotateQuadrant(quadrant, 90, setRotations)
      } else if (e.button === 2) {
        rotateQuadrant(quadrant, -90, setRotations)
      }
    }

    const preventContextMenu = (e) => e.preventDefault()

    canvas.addEventListener("pointerdown", handlePointerDown)
    canvas.addEventListener("contextmenu", preventContextMenu)

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown)
      canvas.removeEventListener("contextmenu", preventContextMenu)
    }
  }, [rotateQuadrant, showInstructions, isCompleted, gameCompleted])

  const currentTime = formatearTiempo(levelTimer.tiempo)
  const completedLevelTime = formatearTiempo(levelTimes[level] || 0)
  const totalGameTime = formatearTiempo(Object.values(levelTimes).reduce((acc, time) => acc + time, 0))

  return (
    <div className="blocka-container">
      <button className="close-game reset" hidden={uiHidden} onClick={handleResetGame} disabled={level === 0}>
        Reiniciar
      </button>
      <button className="close-game" hidden={uiHidden} onClick={handleExitGame}>
        Salir
      </button>

      <div className="blocka-game">
        <TimerDisplay time={currentTime} maxTime={maxTime} hidden={uiHidden} />

        {showLevelPreview && <ImagePreview images={LEVEL_IMAGES} selectedIndex={selectedImageIndex} />}

        <FinalPreview image={finalPreviewImage} />

        <Toaster
          position="top-center"
          containerStyle={{
            position: "absolute",
            top: "0px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            width: "300px",
          }}
          toastOptions={{
            style: {
              background: "#0b1116",
              color: "#fff",
              fontSize: "14px",
              borderRadius: "8px",
              padding: "10px 16px",
              textAlign: "left",
            },
            duration: 2000,
          }}
        />

        <canvas
          ref={canvasRef}
          className={getCanvasClassName()}
          width={size}
          height={size}
          onContextMenu={(e) => e.preventDefault()}
        />

        {showInstructions && <Instructions onClose={handleCloseInstructions} />}
      </div>

      {isCompleted && !gameCompleted && <LevelComplete levelTime={completedLevelTime} hidden={showLevelPreview} />}

      {gameCompleted && <GameComplete totalTime={totalGameTime} />}

      <GameControls
        onHelp={handleAyuda}
        onInstructions={handleShowInstructions}
        level={level}
        hidden={uiHidden}
        helpDisabled={gameCompleted || helpDisabled}
      />
    </div>
  )
}
