import "./boton.jugar.css"

const BotonJugar = ({ onClick = () => {} }) => {
    return <>
        <button onClick={onClick} className="boton-jugar">
            Jugar
        </button>
    </>
}

export default BotonJugar