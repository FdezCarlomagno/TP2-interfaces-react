import { useState, useRef, useCallback } from "react";

export default function useTimer() {
  // Estado del cronómetro (fix)
  const [levelTimer, setLevelTimer] = useState({
    tiempo: 0,
    corriendo: false,
  });

  const intervaloRef = useRef(null);

  const iniciarCronometro = useCallback(() => {
    if (intervaloRef.current) return; // evitar duplicados
    setLevelTimer({ tiempo: 0, corriendo: true });
    const intervalo = setInterval(() => {
      setLevelTimer((prev) => ({
        ...prev,
        tiempo: prev.tiempo + 10,
      }));
    }, 10);
    intervaloRef.current = intervalo;
    console.log("⏱️ Cronómetro iniciado");
  }, []);

  const detenerCronometro = useCallback(() => {
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
      console.log("⏹️ Cronómetro detenido");
    }
    setLevelTimer((prev) => ({ ...prev, corriendo: false }));
  }, []);

  const resetearCronometro = useCallback(() => {
    detenerCronometro();
    setLevelTimer({ tiempo: 0, corriendo: false });
    console.log("🔄 Cronómetro reseteado");
  }, [detenerCronometro]);

  const formatearTiempo = useCallback((ms) => {
    const minutos = Math.floor(ms / 60000);
    const segundos = Math.floor((ms % 60000) / 1000);
    const centesimas = Math.floor((ms % 1000) / 10);
    return {
      minutos: minutos.toString().padStart(2, "0"),
      segundos: segundos.toString().padStart(2, "0"),
      centesimas: centesimas.toString().padStart(2, "0"),
    };
  }, []);

  return {
    levelTimer,
    setLevelTimer,
    formatearTiempo,
    resetearCronometro,
    detenerCronometro,
    iniciarCronometro
  }
}

