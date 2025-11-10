# Plan para implementar animación de ficha comida

## Tareas Pendientes
- [x] Modificar PegController.jsx para llamar a animateEatenPiece con la ficha comida en movePiece.
- [x] Definir animateEatenPiece en Peg.jsx para iniciar la animación.
- [x] Agregar estado de animación en useGame.jsx (animatingPiece, animationProgress).
- [x] Modificar draw en useGame.jsx para renderizar la ficha animada (agrandar y desvanecer).
- [x] Ajustar PegModel.jsx para pasar la ficha comida en mover.

## Notas
- La animación dura ~500ms.
- Usar requestAnimationFrame para suavidad.
- La ficha se agranda 1.5x y opacidad de 1 a 0.
