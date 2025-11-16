
export class Pipe {
    constructor(x, screenHeight) {
        this.x = x
        this.width = 70 // Ancho fijo basado en la imagen pipe-green.png
        this.gap = 180 // Espacio entre tubería superior e inferior
        this.speed = 3
        this.scored = false

        // Generar altura aleatoria para el gap
        const minGapTop = 100
        const maxGapTop = screenHeight - this.gap - 80
        this.gapTop = Math.random() * (maxGapTop - minGapTop) + minGapTop
        this.gapBottom = this.gapTop + this.gap
    }

    update() {
        this.x -= this.speed
    }

    isOffScreen() {
        return this.x + this.width < 0
    }

    checkCollision(bird) {
        const birdBox = bird.getHitbox()

        // Ajuste mínimo del hitbox del pájaro
        const margin = 5
        const birdLeft = birdBox.x + margin
        const birdRight = birdBox.x + birdBox.width - margin
        const birdTop = birdBox.y + margin
        const birdBottom = birdBox.y + birdBox.height - margin

        // Hitboxes de la tubería
        const pipeLeft = this.x
        const pipeRight = this.x + this.width

        // Chequeo horizontal
        const horizontalOverlap = birdRight > pipeLeft && birdLeft < pipeRight

        if (!horizontalOverlap) return false

        // Si el pájaro NO está dentro del hueco vertical → colisión
        const insideGap = birdTop > this.gapTop && birdBottom < this.gapBottom

        return !insideGap
    }


    hasPassed(bird) {
        // Verificar si el pájaro pasó exactamente el centro de la tubería
        const pipeCenter = this.x + this.width / 2
        if (!this.scored && bird.x > pipeCenter) {
            this.scored = true
            return true
        }
        return false
    }
}