// Clase Bird para manejar la física y posición del pájaro
export class Bird {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.velocity = 0
        this.gravity = 0.6
        this.jumpForce = -10
        this.width = 34;   // ancho real frame pájaro
        this.height = 24;  // alto real

    }

    jump() {
        this.velocity = this.jumpForce
    }

    update() {
        this.velocity += this.gravity
        this.y += this.velocity

        // Limitar para que no salga de la pantalla
        if (this.y < 0) {
            this.y = 0
            this.velocity = 0
        }
    }

    getHitbox() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        }
    }

    checkCollision(screenHeight) {
        // Colisión con el suelo
        if (this.y + this.height >= screenHeight) {
            return true
        }
        return false
    }

    reset(x, y) {
        this.x = x
        this.y = y
        this.velocity = 0
    }
}
