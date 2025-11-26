/**
 * DebugHitboxes.jsx
 * TEMPORARY DEBUG COMPONENT - Remove after fixing collisions
 * Shows hitboxes for bird and eagles
 */

import React from 'react'

export default function DebugHitboxes({ birdRef, eagles }) {
    if (!birdRef?.current) return null

    const bird = birdRef.current
    const birdBox = bird.getHitbox()

    return (
        <>

            {/* Eagle Hitboxes */}
            {eagles.map((eagle, i) => {
                const eagleBox = eagle.getHitbox()
                return (
                    <div
                        key={`eagle-debug-${i}`}
                        style={{
                            position: 'absolute',
                            left: `${eagleBox.x}px`,
                            top: `${eagleBox.y}px`,
                            width: `${eagleBox.width}px`,
                            height: `${eagleBox.height}px`,
                            border: '2px solid red',
                            backgroundColor: 'rgba(255, 0, 0, 0.2)',
                            pointerEvents: 'none',
                            zIndex: 200
                        }}
                    >
                        <span style={{
                            position: 'absolute',
                            top: '-20px',
                            left: '0',
                            color: 'red',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            textShadow: '1px 1px 2px black'
                        }}>
                            EAGLE {i} ({Math.round(eagle.x)}, {Math.round(eagle.y)})
                        </span>
                    </div>
                )
            })}
        </>
    )
}

/* 
HOW TO USE:

1. Import in FlappyBird.jsx:
   import DebugHitboxes from './components/debug/DebugHitboxes'

2. Add to useFlappyController return:
   birdRef, // expose birdRef

3. Add to render (after all game objects):
   <DebugHitboxes birdRef={birdRef} eagles={eagles} />

4. Remove when collision is fixed!
*/