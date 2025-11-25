import '../../../view/flappyBird.css'
import '../../../view/parallax.css'

export default function PowerUp({ powerUps }) {
    return <>
        {powerUps.map((p, idx) => (
            <div
                key={idx}
                className="powerup"
                style={{
                    left: `${p.x}px`,
                    top: `${p.y}px`,
                    width: `${p.width}px`,
                    height: `${p.height}px`
                }}
            />
        ))}
    </>
}