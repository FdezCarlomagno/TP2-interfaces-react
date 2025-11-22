export class Pipe {
    constructor(x, screenHeight, difficultyGap) {
        this.x = x
        this.width = 70
        this.speed = 3
        this.scored = false

        // Gap dinámico dependiendo de la dificultad
        this.gap = difficultyGap  

        // Generar altura aleatoria del hueco
        const minGapTop = 80
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

        const margin = 5
        const birdLeft = birdBox.x + margin
        const birdRight = birdBox.x + birdBox.width - margin
        const birdTop = birdBox.y + margin
        const birdBottom = birdBox.y + birdBox.height - margin

        const pipeLeft = this.x
        const pipeRight = this.x + this.width

        const horizontalOverlap = birdRight > pipeLeft && birdLeft < pipeRight
        if (!horizontalOverlap) return false

        const insideGap = birdTop > this.gapTop && birdBottom < this.gapBottom
        return !insideGap
    }

    hasPassed(bird) {
        const pipeCenter = this.x + this.width / 2
        if (!this.scored && bird.x > pipeCenter) {
            this.scored = true
            return true
        }
        return false
    }
}
