import '../../../view/flappyBird.css'
import '../../../view/parallax.css'


export default function ScoreDisplay({ score }) {
    return <>
        {/* Score Display */}
        <div className='score-display'>
            {score}
        </div>
    </>
}