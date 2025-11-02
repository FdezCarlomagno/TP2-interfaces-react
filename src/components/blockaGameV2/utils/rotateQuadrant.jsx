import { useCallback } from "react";

export function useRotateQuadrant() {
  return useCallback((index, delta, setRotations) => {
    setRotations(prev => {
      const next = [...prev];
      next[index] = ((next[index] + delta) % 360 + 360) % 360;
      return next;
    });
  }, []);
}
