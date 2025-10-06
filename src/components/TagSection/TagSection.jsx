import './TagSection.css'
import ic_games from '../../assets/tags/ic_games.svg'
import ic_console from '../../assets/tags/ic_console.svg'
import ic_instalacion from '../../assets/tags/ic_instalacion.svg'
import ic_amigos from '../../assets/tags/ic_amigos.svg'


const TagSection = () => {
    const tags = [
        {
            iconSrc: ic_games,
            name: "4000+ Juegos"
        },
        {
            iconSrc: ic_console,
            name: "Consola"
        },
        {
            iconSrc: ic_instalacion,
            name: "Sin instalación"
        },
        {
            iconSrc: ic_amigos,
            name: "Jugá con amigos"
        }
    ]

    return (
        <>
           <div className='tagSection'>
                {tags.map((tag) => (
                    <div key={tag.name} className="tag">
                         <img src={tag.iconSrc} alt={`tag`} />  <p>{tag.name}</p> 
                    </div>
                ))}
            </div> 
        </>
    )
}

export default TagSection