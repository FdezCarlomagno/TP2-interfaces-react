import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Dashboard from '../components/dashboard/Dashboard';
import { Outlet } from 'react-router-dom';
import "../App.css"

function Layout() {
  return (
    <>
      <Header />
      <Dashboard />   {/* si también lo querés fijo */}
      <div className="appBody">
        <Outlet />   {/* acá se va a renderizar cada página */}
      </div>
    </>
  );
}

export default Layout;
