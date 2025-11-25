import '../../../view/flappyBird.css'
import '../../../view/parallax.css'

export default function Bird({
    isShrunk,
    birdPosition
}) {
    return <>
        <div
            className={`flappy scale-2 ${isShrunk ? 'shrunk' : ''}`}
            style={{
                left: `${birdPosition.x}px`,
                top: `${birdPosition.y}px`
            }}
            aria-hidden="true"
        />
    </>
}