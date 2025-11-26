/**
 * Eagles.jsx
 * Renders flying eagles using direct position from eagle objects
 */

import React from 'react'

export default function Eagles({ eagles }) {
    if (!eagles || eagles.length === 0) return null

    return (
        <>
            {eagles.map((eagle, index) => {
                // Get position directly from eagle object
                const pos = eagle.getVisualPosition()
                
                return (
                    <div
                        key={`eagle-${eagle.id || index}`}
                        className="eagle moving"
                        style={{
                            left: `${pos.x}px`,
                            top: `${pos.y}px`,
                            // Performance optimizations
                            willChange: 'transform',
                            transform: 'translateZ(0)', // Force GPU acceleration
                        }}
                        // Debug data attribute
                        data-eagle-id={eagle.id}
                        data-eagle-x={Math.round(pos.x)}
                    />
                )
            })}
        </>
    )
}