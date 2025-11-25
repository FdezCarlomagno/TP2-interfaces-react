import '../../../view/flappyBird.css'
import '../../../view/parallax.css'

export default function InGameUI({
    handleExitGame,
}) {
    return <>
        <button className='exit-flappy-bird' onClick={(e) => {
            e.stopPropagation()
            handleExitGame()
        }}>
            SALIR
        </button>
    </>
}