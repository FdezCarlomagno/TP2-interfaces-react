import { useAppContext } from "../context/AppContext"

const Game = () => {
    const { selectedGame } = useAppContext() 
    const isPremium = selectedGame.isPremium
    console.log(selectedGame.gameInfo)

    return <>
        <h1>
            {selectedGame.gameInfo.name} {isPremium && <p>Es premium</p>}
        </h1>
        <p>Aca iria toda la demas info del juego junto con la pantalla en si</p>
    </>
}


export default Game