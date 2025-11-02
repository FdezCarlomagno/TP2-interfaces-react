import { useCallback } from "react";
import toast from "react-hot-toast";

export default function useHandler(
    setDisableAyuda,
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
    setRotations
) {
    const handleLevelCompletion = useCallback(async () => {
        setDisableAyuda(false);
        setIsCompleted(true);
        setUiHidden(true);
        await new Promise((r) => setTimeout(r, 500));
        setShowCleanImage(true);
        draw();
        await new Promise((r) => setTimeout(r, 2000));
        setLevel((lvl) => lvl + 1);
    }, [draw]);

    const handleResetGame = () => {
        detenerCronometro();
        setLevel(0);
    };

    const handleExitGame = () => {
        detenerCronometro();
        onExit();
    };

    const handleAyuda = () => {
        if (gameCompleted || isCompleted) return;

        const incorrectIndexes = rotations
            .map((r, i) => (r % 360 !== 0 ? i : null))
            .filter((i) => i !== null);

        if (incorrectIndexes.length === 0) {
            toast.error("No quedan ayudas");
            setDisableAyuda(true);
            return;
        }

        if (incorrectIndexes.length === 1) {
            toast.error("No quedan ayudas");
            setDisableAyuda(true);
            return;
        }

        // Aplicar ayuda
        const randomIndex =
            incorrectIndexes[Math.floor(Math.random() * incorrectIndexes.length)];
        const next = [...rotations];
        next[randomIndex] = 0;
        setRotations(next);

        // Efectos visuales y tiempo extra
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.classList.add("help-flash");
            setTimeout(() => canvas.classList.remove("help-flash"), 800);
        }

        setLevelTimer((prev) => ({ ...prev, tiempo: prev.tiempo + 5000 }));
    };

    const handleCloseInstructions = () => {
        setUiHidden(false);
        setShowInstructions(false);
    };

    const handleShowInstructions = () => {
        setUiHidden(true);
        setShowInstructions(true);
    };

    return {
        handleLevelCompletion,
        handleAyuda,
        handleCloseInstructions,
        handleExitGame,
        handleResetGame,
        handleShowInstructions
    }
}