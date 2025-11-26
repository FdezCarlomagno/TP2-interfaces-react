/**
 * PowerUp.jsx - Coin version
 * Renders spinning coins as power-ups
 */

import React from 'react'

export default function PowerUp({ powerUps }) {
    if (!powerUps || powerUps.length === 0) return null

    return (
        <>
            {powerUps.map((powerUp, index) => (
                <div
                    key={`powerup-${index}`}
                    className={`coin ${powerUp.collected ? 'collected' : ''}`}
                    style={{
                        left: `${powerUp.x}px`,
                        top: `${powerUp.y}px`,
                    }}
                />
            ))}
        </>
    )
}