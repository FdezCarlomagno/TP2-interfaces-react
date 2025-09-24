import '../dashboard/dashboard.css'
import home from '../../assets/home.svg'
import menu from '../../assets/menu.svg'
import cross from '../../assets/cross.svg'
import { useState } from 'react'

const Dashboard = () => {
    const [menuOpen, setMenuOpen] = useState(false)

    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
    }

    return <>
        <div className={menuOpen ? 'dashboard open' : 'dashboard'}>
            <DashboardItem src={menuOpen ? cross : menu} alt={'menu'} onClick={toggleMenu}/>
            <DashboardItem src={home} alt={'home'}/>
        </div>
    </>
}


const DashboardItem = ({src, alt, onClick}) => {
    return <>
        <div className='dashboardItem' onClick={onClick}>
            <img src={src} alt={alt}/>
        </div>
    </>
}

export default Dashboard

