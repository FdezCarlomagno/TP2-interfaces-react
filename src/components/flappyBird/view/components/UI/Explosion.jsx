import '../../../view/flappyBird.css'
import '../../../view/parallax.css'

export default function Explosion({ explosion }) {
    return <>
        {explosion && (
            <img
                className="explosion-img"
                src={explosion.src}
                alt="explosion"
                style={{ left: `${explosion.x}px`, top: `${explosion.y}px` }}
            />
        )}
    </>
}