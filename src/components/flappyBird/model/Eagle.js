/**
 * Eagle.js - Enemy flying across the screen
 * FIXED: All eagles same speed, hitbox perfectly synced
 */

export class Eagle {
    constructor(x, y, screenWidth) {
        // Position is the SOURCE OF TRUTH
        this.x = x
        this.y = y
        this.screenWidth = screenWidth
        
        // Scaled dimensions (191.5 * 0.4 and 326 * 0.4)
        this.width = 76.6  // ~77px
        this.height = 130.4  // ~130px
        
        // FIXED: All eagles same speed (no random)
        this.speed = 5
        this.collected = false
        
        // Debug
        this.id = Math.random().toString(36).substr(2, 9)
        this.updateCount = 0
        
        // Track last position for debug
        this.lastX = x
        this.lastY = y
    }

    update() {
        if (this.collected) return
        
        // Store last position for debugging
        this.lastX = this.x
        this.lastY = this.y
        
        // CRITICAL: Direct, synchronous position update
        this.x -= this.speed
        
        this.updateCount++
        
        // Verify position changed
        if (this.x === this.lastX) {
            console.error(`⚠️ Eagle ${this.id} position NOT updated! Stuck at x=${this.x}`)
        }
        
        // Debug: Log every 60 frames (once per second at 60fps)
        if (this.updateCount % 60 === 0) {
            console.log(`🦅 Eagle ${this.id}: x=${Math.round(this.x)}, y=${Math.round(this.y)}, speed=${this.speed}, updates=${this.updateCount}`)
        }
    }

    getHitbox() {
        // CRITICAL: Hitbox calculated DIRECTLY from current x,y
        // NO delays, NO caching, NO state - just pure math
        const padding = 20
        
        const hitbox = {
            x: this.x + padding,
            y: this.y + padding,
            width: this.width - padding * 2,
            height: this.height - padding * 2
        }
        
        // Sanity check
        if (isNaN(hitbox.x) || isNaN(hitbox.y)) {
            console.error(`❌ Eagle ${this.id} has invalid hitbox!`, hitbox)
        }
        
        return hitbox
    }

    // Get visual position (for rendering)
    getVisualPosition() {
        return {
            x: this.x,
            y: this.y
        }
    }

    isOffScreen() {
        return this.x + this.width < -100
    }
}