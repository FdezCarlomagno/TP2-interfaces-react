export class PowerUp {
    constructor(screenWidth, screenHeight) {
        // Aparecer al borde derecho de la pantalla
        this.x = screenWidth
        // Elegir una Y aleatoria dentro de la pantalla, con márgenes
        const margin = 60
        this.y = Math.random() * (screenHeight - margin * 2) + margin
        this.width = 28
        this.height = 28
        this.speed = 3
        this.collected = false
    }

    update() {
        this.x -= this.speed
    }

    isOffScreen() {
        return this.x + this.width < 0
    }

    getHitbox() {
        return { x: this.x, y: this.y, width: this.width, height: this.height }
    }
}
